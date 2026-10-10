// dsh-model-cap — 宿主半边
//
// 为浏览器管理卡（client.js）提供 /api/model-cap/test：对指定提供商下的指定模型
// 发一条最小请求，测连通性并测延迟。所有配置读写都走官方 remote
// （settings.mutate + credentials.set），本插件不再注册自己的 settings 命名空间
// （v1 的 model-capabilities 覆盖层已随 v2 卡片废弃：卡片直写 llm-pi-ai 后，
// 覆盖层只剩重复 UI 和"复活已删提供商"的风险）。
//
// 测试请求与官方 llm-pi-ai 同源：Key 用 credentials.resolve(apiKeyEnv) 解析
// （回落进程环境变量），URL 按提供商 baseURL + 协议拼接。

// ---------- 设置命名空间（禁用归档）----------
// 浏览器半边把「已禁用提供商」的 profile 存进本条目 config 的 disabled 字段。
// 必须声明成 volatile，设置面才会把它当作可写表单提供（与官方 dsh-model-capabilities 同款做法）。
// 行 id = 本包名 → 命名空间完全自控，不受 web-all 聚合层 web-ui-* 命名规则影响。
// 2026-10-10：此前归档借官方命名空间（写死 id 不匹配，宿主抛 No configurable plugin entry），现改为自包含。
import z from '@deepseek-ai/schemastery'

export const name = 'dsh-model-cap'
export const Config = z.object({ disabled: z.any().default({}).volatile() })

function writeJson(res, code, obj) {
	const body = JSON.stringify(obj)
	res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
	res.end(body)
}

function readBody(req, limit = 64 * 1024) {
	return new Promise((resolve, reject) => {
		const chunks = []
		let size = 0
		req.on('data', (c) => { size += c.length; if (size > limit) { reject(new Error('body-too-large')); req.destroy() } else chunks.push(c) })
		req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
		req.on('error', reject)
	})
}

function isTrusted(req) {
	// 环回 socket + 浏览器同源标记（与 agenda-panel / task-board 的栅栏一致）
	const remote = req.socket?.remoteAddress ?? ''
	const loopback = remote === '127.0.0.1' || remote === '::1' || remote === '::ffff:127.0.0.1'
	if (!loopback) return false
	return req.headers['sec-fetch-site'] === 'same-origin' || typeof req.headers.origin === 'string'
}

// ---------- 出站 URL 校验 ----------
// 本服务只绑环回且接口有同源栅栏，提供商 baseURL 由用户本人在本机配置
// （含 127.0.0.1/局域网网关），因此只限定协议，不做内网地址拦截。
function assertHttpUrl(raw) {
	let u
	try { u = new URL(raw) } catch { throw new Error('Base URL 不是合法 URL') }
	if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('仅允许 http/https 地址')
	return u
}

// ---------- 按协议构造最小探测请求 ----------
function buildProbe(api, baseURL, model, key) {
	const base = baseURL.replace(/\/+$/, '')
	const headers = { 'content-type': 'application/json' }
	if (api === 'anthropic-messages') {
		if (key) { headers['x-api-key'] = key; headers.authorization = 'Bearer ' + key }
		headers['anthropic-version'] = '2023-06-01'
		// 与官方 Anthropic SDK 同构：baseURL 后拼 /v1/messages（baseURL 不含 /v1）
		return { url: base + '/v1/messages', headers, body: { model, max_tokens: 32, messages: [{ role: 'user', content: 'ping' }] } }
	}
	if (api === 'openai-responses') {
		if (key) headers.authorization = 'Bearer ' + key
		return { url: base + '/responses', headers, body: { model, input: 'ping', max_output_tokens: 32 } }
	}
	// openai-completions（默认）
	if (key) headers.authorization = 'Bearer ' + key
	return { url: base + '/chat/completions', headers, body: { model, messages: [{ role: 'user', content: 'ping' }], max_tokens: 32, stream: false } }
}

const TEST_TIMEOUT_MS = 60_000

async function probeModel(probe) {
	const ctl = new AbortController()
	const timer = setTimeout(() => ctl.abort(), TEST_TIMEOUT_MS)
	const started = Date.now()
	try {
		const r = await fetch(probe.url, {
			method: 'POST',
			headers: probe.headers,
			body: JSON.stringify(probe.body),
			signal: ctl.signal,
		})
		const latencyMs = Date.now() - started
		if (!r.ok) {
			const text = (await r.text()).replace(/\s+/g, ' ').slice(0, 200)
			return { ok: false, error: `HTTP ${r.status} ${r.statusText}${text ? ' · ' + text : ''}` }
		}
		// 把响应体读完再算成功，避免网关半途断流被误判为通过
		await r.arrayBuffer()
		return { ok: true, latencyMs }
	} catch (error) {
		const aborted = error?.name === 'AbortError' || error?.name === 'TimeoutError'
		return { ok: false, error: aborted ? `测试超时（${TEST_TIMEOUT_MS / 1000}s）` : String(error?.message || error) }
	} finally {
		clearTimeout(timer)
	}
}

export function apply(ctx) {
	ctx.inject(['webServer', 'credentials', 'settings'], (sctx) => {
		function llmProviders() {
			const descriptors = sctx.settings.describe() ?? []
			const llm = descriptors.find((d) => d.ns === 'llm-pi-ai')
			// 读合并后的生效值：很多提供商（如内置的 opencode-go）用户层只存模型
			// 覆盖，baseURL/api 在官方基础层——读 user 层会"找不到 baseURL"
			return llm?.value?.providers ?? llm?.user?.providers ?? {}
		}

		async function resolveKey(apiKeyEnv) {
			if (!apiKeyEnv) return undefined
			try {
				const hit = await sctx.credentials.resolve(String(apiKeyEnv))
				if (hit?.value) return hit.value
			} catch { /* 凭据层没有，回落进程环境 */ }
			return process.env[apiKeyEnv] || undefined
		}

		ctx.effect(() => {
			const dispose = sctx.webServer.register({
				kind: 'exact',
				path: '/api/model-cap/test',
				handler: async (req, res) => {
					if (req.method !== 'POST') { res.writeHead(405); res.end(); return }
					if (!isTrusted(req)) return writeJson(res, 403, { ok: false, error: 'untrusted' })
					try {
						const body = JSON.parse((await readBody(req)) || '{}')
						const provider = String(body.provider ?? '')
						const model = String(body.model ?? '')
						if (!provider || !model) throw new Error('provider/model 必填')
						const p = llmProviders()[provider]
						if (!p?.baseURL) throw new Error(`找不到提供商 "${provider}" 或其 baseURL`)
						assertHttpUrl(p.baseURL)
						const key = await resolveKey(p.apiKeyEnv)
						const probe = buildProbe(p.api, p.baseURL, model, key)
						const result = await probeModel(probe)
						writeJson(res, 200, result)
					} catch (error) {
						writeJson(res, 200, { ok: false, error: String(error?.message || error) })
					}
				},
			})
			console.log('[dsh-model-cap] /api/model-cap/test registered')
			return () => dispose?.()
		}, 'dsh-model-cap: test route')
	})
}
