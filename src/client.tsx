// dsh-model-cap — browser half（React 轨）
// 定位：替代官方"模型"页的完整管理界面（提供商增删改 + Key 凭据 + 模型增删/批量删 + 识图能力 + 拉取模型）。
// 数据流全部走官方 remote：settings.mutate（ops + revision 栅栏）+ credentials.set + llm.discoverModels。
// 写策略：读改写整个 providers 对象（单 set op），revision 由 llmScope 快照提供，冲突自动恢复重读；
// 写入前做 undefined 清理（避免 settings/mutate rejected "ops"），编辑模型合并写入保留 compat 等表单外字段。
// 组件与样式全部来自模板 dsh-react-kit（dsh-react-kit/client external），本插件不再自带 amc-* 样式。
import * as React from "react"
import {
	Banner, Button, Card, Checkbox, Chip, ComboBox, Field, FormError, FormHead, FormOps, Hint, Input,
	Loading, Mono, Pill, Row, Select, Spacer, StateBadge, Switch,
	SearchInput, ConfirmButton, PanelActions,
	installDebugOverlay, installStyle, toast,
} from "./dpk"

const NS = "dsh-model-cap"
const LLM_NS = "llm-pi-ai"
// 官方 model-capabilities 插件的归档命名空间：disabled.<route> = { profile, displayName }
// 禁用提供商 = profile 搬进这里 + 从 llm-pi-ai unset；启用 = 原样搬回。
//
// ⚠️ 这个命名空间**不能写死**：0.1.7 起设置面按「活动 profile 条目 id」寻址（settings.describe()
// 的 key 就是条目 id），而同一个插件在不同安装源下条目 id 不同：
//   · 独立装（包自带 cordis.patch.yml）→ ui-model-capabilities
//   · web-all 聚合装（聚合层给每个子行加 web-ui- 前缀）→ web-ui-model-capabilities
// 写错 id 的后果是宿主直接抛 `No configurable plugin entry "<id>"`，禁用/启用必失败（2026-10-10 实测踩坑）。
// 解析顺序照抄官方 provider-toggle.ts：先按候选 id 命中，再按 schema 形状兜底。
// 归档命名空间解析（**自包含优先**）：
//   · 首选我们自己宿主半边声明的条目（行 id = 包名 `dsh-model-cap`）：我方的 id 完全自控，
//     不受 web-all 聚合命名规则（web-ui-* 前缀）影响，也不依赖官方插件是否在组合里。
//   · 官方两个 id（独立装 / 聚合装）保留为兜底——历史归档可能写在那边。
//   · 最后按 schema 形状兜底（行被重命名的情况，同官方 isArchiveSchema）。
// 2026-10-10 教训：写死官方 id `dsh-model-capabilities` 两个安装源都不匹配，宿主直接抛
// `No configurable plugin entry`，禁用/启用必失败。
const OWN_CAPS_NS = "dsh-model-cap"
const CAPS_ENTRY_IDS = [OWN_CAPS_NS, "ui-model-capabilities", "web-ui-model-capabilities"]
let CAPS_NS: string | null = null
/** 解析失败的真实原因（进横幅，便于自查；正常时为 null） */
let CAPS_RESOLVE_ERR: string | null = null
/** 归档命名空间解析完成/失败的广播：页面可能在异步解析前就挂载好了 */
const capsBus = {
	listeners: new Set<() => void>(),
	on(fn: () => void) { this.listeners.add(fn); return () => { this.listeners.delete(fn) } },
	emit() { for (const fn of [...this.listeners]) fn() },
}
/** 序列化 schema 的节点解析：schemastery toJSON 把节点放进 refs、用 uid 引用（同官方 schemaNode） */
function schemaNode(value: any, refs: Record<string, any>): any {
	if (value && typeof value === "object" && typeof value.type === "string") return value
	const key = value && typeof value === "object" ? value.uid : value
	if (key === undefined) return undefined
	const node = refs[String(key)]
	return node && typeof node === "object" ? node : undefined
}
/** 是否就是归档表单：根对象只有唯一字段 disabled 且它是 any（同官方 isArchiveSchema） */
function isArchiveSchema(schema: any): boolean {
	if (!schema || typeof schema !== "object" || Array.isArray(schema)) return false
	const refs = schema.refs && typeof schema.refs === "object" && !Array.isArray(schema.refs) ? schema.refs : {}
	const root = schemaNode(schema, refs)
	if (root?.type !== "object" || !root.dict || typeof root.dict !== "object") return false
	const fields = Object.keys(root.dict)
	if (fields.length !== 1 || fields[0] !== "disabled") return false
	return schemaNode(root.dict[fields[0]], refs)?.type === "any"
}
/** 从 describe 响应里取命名空间列表：client 远程面返回 RPC 信封 { value: { namespaces: [...] } }
 *  （2026-10-10 抓包 /api/settings/describe 实测；老的"直接数组"假设会导致误判为 0 个表单） */
function namespacesOf(res: any): any[] {
	if (Array.isArray(res)) return res
	const v = res?.value ?? res?.result?.value
	if (Array.isArray(v?.namespaces)) return v.namespaces
	return []
}
/** 解析归档命名空间：自包含条目直接绑定（服务端已确认 Config 可配置，绑定即生效）；
 *  绑定抛错才回退「官方 id → schema 形状」；全失败则记录原因并停用禁用功能 */
async function resolveCaps(binder: any) {
	CAPS_RESOLVE_ERR = null
	try {
		capsScope = binder.bind({ namespace: OWN_CAPS_NS })
		CAPS_NS = OWN_CAPS_NS
		capsBus.emit()
		return
	} catch (e: any) {
		CAPS_RESOLVE_ERR = `绑定 ${OWN_CAPS_NS} 失败：${e?.message ?? e}`
	}
	try {
		const list = namespacesOf(await (REMOTE as any).settings.describe())
		const pick = list.find((f: any) => CAPS_ENTRY_IDS.includes(f?.ns)) ?? list.find((f: any) => isArchiveSchema(f?.schema))
		if (pick?.ns) {
			capsScope = binder.bind({ namespace: pick.ns })
			CAPS_NS = pick.ns
			capsBus.emit()
			return
		}
		CAPS_RESOLVE_ERR = (CAPS_RESOLVE_ERR ? CAPS_RESOLVE_ERR + "；" : "") + `describe() 返回 ${list.length} 个命名空间，没有归档条目`
	} catch (e: any) {
		CAPS_RESOLVE_ERR = (CAPS_RESOLVE_ERR ? CAPS_RESOLVE_ERR + "；" : "") + "settings.describe() 失败：" + (e?.message ?? e)
	}
	capsBus.emit()
}
/** 取归档命名空间；不可用时给人话提示（附真实原因），而不是宿主的 No configurable plugin entry */
function requireCapsNs(): string {
	if (!CAPS_NS) throw new Error("禁用/启用功能已停用" + (CAPS_RESOLVE_ERR ? "：" + CAPS_RESOLVE_ERR : "（归档条目未就绪）"))
	return CAPS_NS
}
const VISION = ["text", "image"]
// 推理档位（与官方 dsh-model-capabilities / llm-pi-ai 的 reasoningEfforts 同结构）
const THINKING_LEVELS = ["off", "minimal", "low", "medium", "high", "xhigh", "max"]
const PROTOCOLS = [
	{ v: "openai-completions", label: "openai 兼容" },
	{ v: "openai-responses", label: "openai responses" },
	{ v: "anthropic-messages", label: "anthropic" },
]
const MODEL_PAGE = 5

// ---------- 重试策略（官方 retryPolicy，provider 级；用户口中的「故障转移」） ----------
// 官方语义（@deepseek-ai/dsh-llm/retry-policy）：
//   省略字段 = normal 模式、最多重试 5 次、只重试 EMPTY_RESPONSE/RATE_LIMIT/SERVER/TIMEOUT/TRANSPORT
//   normal  = 限次重试，遇到 retryableCodes 里的错误才重试
//   always  = 每一次失败都重试，直到成功/取消
// 写入规则：选「跟随官方默认」不写 retryPolicy 字段；写错未知键会被宿主整单拒绝，所以这里只产出官方声明过的键。
const RETRY_CODES_HINT = "EMPTY_RESPONSE, RATE_LIMIT, SERVER, TIMEOUT, TRANSPORT"

type RetryForm = {
	mode: "default" | "normal" | "always"
	maxRetries: string
	codes: string
	initialDelayMs: string
	maxDelayMs: string
	jitterRatio: string
}

/** 卡片摘要：只显示用户显式配过的策略，跟随默认时返回空串（不占位） */
function retrySummary(p: any): string {
	const r = p?.retryPolicy
	if (!r || typeof r !== "object") return ""
	if (r.mode === "always") return "重试 always（每次失败都重试）"
	if (r.mode !== "normal") return ""
	const n = Number.isFinite(r.maxRetries) ? r.maxRetries : 5
	const codes = Array.isArray(r.retryableCodes) ? r.retryableCodes.length : 5
	return `重试 normal ×${n}（${codes} 类错误）`
}

/** 表单 → retryPolicy 结构。default 返回 undefined（= 删字段）；非法值抛人话错误，不发请求 */
function buildRetryPolicy(f: RetryForm): any {
	if (f.mode === "default") return undefined
	const optNum = (raw: string, label: string, ok: (n: number) => boolean, hint: string): number | undefined => {
		const s = raw.trim()
		if (!s) return undefined
		const n = Number(s)
		if (!ok(n)) throw new Error(`${label}：${hint}`)
		return n
	}
	const backoff: any = {}
	const init = optNum(f.initialDelayMs, "退避初始延迟", (n) => Number.isFinite(n) && n > 0, "必须是大于 0 的毫秒数")
	if (init !== undefined) backoff.initialDelayMs = init
	const maxDelay = optNum(f.maxDelayMs, "退避最大延迟", (n) => Number.isFinite(n) && n > 0, "必须是大于 0 的毫秒数")
	if (maxDelay !== undefined) backoff.maxDelayMs = maxDelay
	if (init !== undefined && maxDelay !== undefined && init > maxDelay) throw new Error("退避初始延迟不能大于最大延迟")
	const jitter = optNum(f.jitterRatio, "抖动比", (n) => Number.isFinite(n) && n >= 0 && n <= 1, "必须在 0 到 1 之间")
	if (jitter !== undefined) backoff.jitterRatio = jitter

	const out: any = { mode: f.mode }
	if (f.mode === "normal") {
		const mr = optNum(f.maxRetries, "最大重试次数", (n) => Number.isSafeInteger(n) && n >= 0, "必须是非负整数")
		if (mr !== undefined) out.maxRetries = mr
		const codes = f.codes.split(",").map((s) => s.trim()).filter(Boolean)
		if (codes.length) {
			if (new Set(codes).size !== codes.length) throw new Error("可重试错误码有重复")
			out.retryableCodes = codes
		}
	}
	if (Object.keys(backoff).length) out.backoff = backoff
	return out
}

type TestState = { status: "testing"; startedAt: number; elapsed?: number } | { status: "ok"; latencyMs: number } | { status: "fail"; error: string }

// ---------- 模型级 compat（wire 兼容开关，v0.6.0） ----------
// 官方 strict 校验：给某协议写它不 offer 的字段 → 整个 provider 保存失败（不是忽略）。
// 所以字段必须按当前路由的 api 精确过滤，且保存时清理掉不属于新协议的旧键。
// 三态语义：未设置（跟随内置目录/pi-ai 自动探测）≠ 设为 false（强制关闭）。
type CompatField = { key: string; label: string; kind: "bool" | "enum" | "json"; options?: string[]; hint?: string }
const COMPAT_FIELDS: Record<string, CompatField[]> = {
	"openai-completions": [
		{ key: "maxTokensField", label: "输出上限字段名", kind: "enum", options: ["max_tokens", "max_completion_tokens"],
			hint: "网关读哪个字段限制输出长度；多数中转站用 max_tokens" },
		{ key: "thinkingFormat", label: "推理参数格式", kind: "enum",
			options: ["openai", "deepseek", "openrouter", "together", "baseten", "zai", "qwen", "chat-template", "qwen-chat-template", "string-thinking", "ant-ling"],
			hint: "推理档位以什么参数形态下发；选错会被网关忽略或 400" },
		{ key: "chatTemplateKwargs", label: "chat_template_kwargs", kind: "json",
			hint: "仅 chat-template 系格式生效；JSON 对象，如 {\"enable_thinking\": true}" },
		{ key: "supportsReasoningEffort", label: "接受 reasoning_effort", kind: "bool" },
		{ key: "supportsUsageInStreaming", label: "流式返回 usage", kind: "bool",
			hint: "关闭则无法在流式响应里统计 token 用量" },
	],
	"openai-responses": [
		{ key: "supportsDeveloperRole", label: "接受 developer 角色", kind: "bool", hint: "关掉则系统提示词仍用 system 角色" },
		{ key: "supportsMaxOutputTokens", label: "接受 max_output_tokens", kind: "bool" },
	],
	"anthropic-messages": [
		{ key: "supportsTemperature", label: "接受 temperature", kind: "bool" },
		{ key: "forceAdaptiveThinking", label: "强制自适应思考", kind: "bool", hint: "不看模型 ID，一律开启 adaptive thinking" },
		{ key: "supportsStrictTools", label: "接受严格工具 schema", kind: "bool" },
	],
}
const COMPAT_ALL_KEYS = Array.from(new Set(Object.values(COMPAT_FIELDS).flat().map((f) => f.key)))
// 官方 *_COMPAT_GATE 的 offer 白名单（catalog.d.ts L77-134）。写协议外字段 = 整个 provider 被拒，
// 所以保存时按这里裁剪；同协议内、但本插件 UI 还没做的字段（如 supportsStore）保留不动。
const COMPAT_OFFER: Record<string, string[]> = {
	"openai-completions": [
		"supportsStore", "supportsDeveloperRole", "supportsReasoningEffort", "supportsUsageInStreaming",
		"supportsFinishReason", "maxTokensField", "requiresToolResultName", "requiresAssistantAfterToolResult",
		"requiresThinkingAsText", "requiresReasoningContentOnAssistantMessages", "thinkingFormat",
		"chatTemplateKwargs", "chatTemplateArgs", "supportsThinkingTokenBudget", "thinkingTokenBudgetField",
		"vllmPriority", "supportsStrictMode", "cacheControlFormat", "supportsLongCacheRetention",
	],
	"openai-responses": ["supportsDeveloperRole", "supportsMaxOutputTokens", "supportsStrictMode", "supportsLongCacheRetention"],
	"anthropic-messages": [
		"supportsEagerToolInputStreaming", "supportsLongCacheRetention", "supportsCacheControlOnTools",
		"supportsTemperature", "forceAdaptiveThinking", "allowEmptySignature", "supportsStrictTools",
	],
}
/** 该协议下不可用的 compat 键（切换协议后这些旧键会让整单被拒） */
function strayCompatKeys(compat: any, api: string): string[] {
	if (!compat || typeof compat !== "object") return []
	if (!COMPAT_OFFER[api]) return []
	const offer = COMPAT_OFFER[api]
	return Object.keys(compat).filter((k) => !offer.includes(k))
}
/** 某个 provider 下所有模型里，因协议不匹配而必须清掉的 compat 键数量 */
function strayCompatCount(providerName: string, api: string): number {
	const models = getProviders()[providerName]?.models ?? []
	let n = 0
	for (const m of models) n += strayCompatKeys(m?.compat, api).length
	return n
}
/** 卡片摘要：模型上显式配过几个兼容开关（未配置时不占位） */
function compatSummary(m: any): string {
	const c = m?.compat
	if (!c || typeof c !== "object") return ""
	const n = Object.keys(c).filter((k) => COMPAT_ALL_KEYS.includes(k)).length
	return n ? `兼容开关 ${n} 项` : ""
}
/**
 * 表单 → compat 对象。
 * @param tri 每个字段的值："" = 跟随（删掉该键，回到目录/探测），"true"/"false" = 布尔，其他 = 枚举/JSON 原文
 * @param inherited 模型原有 compat（同协议内未在表单里出现的键原样保留）
 * @returns 无任何键时返回 undefined（= 删除 compat 字段）
 */
function buildCompat(fields: CompatField[], tri: Record<string, string>, inherited: any, api: string): any {
	// 路由没声明协议时无法判断哪些键合法 → 原样保留已有关键，不做任何裁剪（否则会静默丢配置）
	if (!api || !COMPAT_OFFER[api]) return inherited && Object.keys(inherited).length ? inherited : undefined
	const offer = COMPAT_OFFER[api]
	const out: any = {}
	for (const [k, v] of Object.entries(inherited ?? {})) {
		if (offer.includes(k)) out[k] = v
	}
	const errors: string[] = []
	for (const f of fields) {
		const raw = tri[f.key]
		if (raw === undefined || raw === "") { delete out[f.key]; continue }
		if (f.kind === "bool") {
			if (raw === "true") out[f.key] = true
			else if (raw === "false") out[f.key] = false
			continue
		}
		if (f.kind === "enum") {
			if (!f.options?.includes(raw)) { errors.push(`${f.label}：值 "${raw}" 不在可选范围`); continue }
			out[f.key] = raw
			continue
		}
		try {
			const v = JSON.parse(raw)
			if (!v || typeof v !== "object" || Array.isArray(v)) { errors.push(`${f.label}：必须是 JSON 对象`); continue }
			// 空对象等于没写（官方 configuredCompatEntries 也把它当未配置），不落进配置
			if (Object.keys(v).length === 0) { delete out[f.key]; continue }
			out[f.key] = v
		} catch { errors.push(`${f.label}：不是合法 JSON`) }
	}
	if (errors.length) throw new Error(errors.join("；"))
	return Object.keys(out).length ? out : undefined
}
// ---------- module state（apply 时注入，组件闭包引用） ----------
let llmScope: any = null
let capsScope: any = null
let REMOTE: any = null

// ---------- utils ----------
function fmtNum(n: number | undefined | null) {
	if (!n) return "—"
	if (n >= 10000) return Math.round(n / 1000) / 10 + "万"
	return String(n)
}
function deriveKeyRef(provider: string) {
	// 凭据名必须匹配 /^[A-Za-z_][A-Za-z0-9_]*$/（宿主 dsh-api-settings-controller 的规则）。
	// 路由名允许数字开头（如 "1"），直接拼会产出 "1_API_KEY" 被宿主拒绝 —— 2026-10-10 用户实测，故补前缀。
	const base = String(provider).toUpperCase().replace(/[^A-Z0-9]+/g, "_")
	return (/^[A-Z]/.test(base) ? base : "R_" + base) + "_API_KEY"
}
function hasVision(m: any) {
	return Array.isArray(m?.input) && m.input.includes("image")
}
/** 推理档位摘要（与官方同语义）：未声明 → 无标注；false → 无推理；dict → 列出启用档位 */
function effortsLabel(m: any): string | null {
	const e = m?.reasoningEfforts
	if (e === undefined) return null
	if (e === false) return "无推理"
	if (typeof e === "object" && e !== null && !Array.isArray(e)) {
		const lvls = Object.keys(e).filter((k) => k !== "off" && e[k] !== "" && e[k] != null)
		if (lvls.length === 0) return "仅 off"
		return "推理：" + lvls.join("/")
	}
	return null
}
function protoLabel(api: string | undefined) {
	return (PROTOCOLS.find((x) => x.v === api) ?? {}).label ?? api ?? "—"
}
function fmtLatency(ms: number | undefined) {
	return ms != null && ms >= 1000 ? Math.round(ms / 100) / 10 + "s" : (ms ?? 0) + "ms"
}
function testKey(provider: string, modelId: string) {
	return provider + "|" + modelId
}
function chipLabel(m: any) {
	return (m.name && m.name !== m.id ? m.name + " · " : "") + m.id
}
/** 写入前清理：递归丢弃 undefined 字段（schemastery 结构值不接受 undefined 键） */
function jsonValue(value: any): any {
	if (Array.isArray(value)) return value.map(jsonValue)
	if (!value || typeof value !== "object") return value
	const out: Record<string, any> = {}
	for (const [key, child] of Object.entries(value)) {
		if (child !== undefined) out[key] = jsonValue(child)
	}
	return out
}

// ---------- data access ----------
function getProviders(): Record<string, any> {
	return llmScope?.getSnapshot().value?.providers ?? {}
}
async function writeProviders(mutate: (providers: Record<string, any>) => Record<string, any>) {
		const snap = llmScope.getSnapshot()
		const providers = jsonValue(snap.value?.providers ?? {})
		const next = jsonValue(mutate(providers) ?? providers)
		const ops = [{ op: "set", path: ["providers"], value: next }]
		const response = await REMOTE.settings.mutate(LLM_NS, ops, snap.revision)
		if (!response.ok) throw new Error(friendlyReject(response.error?.message))
	}
	// 宿主拒绝原因 → 中文提示；未知错误原样抛出
	function friendlyReject(message: string | undefined): string {
		const raw = String(message ?? "写入被拒绝")
		if (raw.includes("resolves no models")) return "宿主拒绝了写入：自定义提供商删除后剩余 0 个模型。内置目录外的路由必须至少保留一个模型，如需清空请删除整个提供商。（" + raw + "）"
		return raw
	}
	/** 删除前校验：非内置目录路由删到 0 模型会被宿主整单拒绝，提前拦下 */
function assertNotLastModels(providers: Record<string, any>, providerName: string, ids: string[]) {
	const p = providers[providerName]
	if (!p) return
	const remaining = (p.models ?? []).filter((m: any) => !ids.includes(m.id))
	if (remaining.length === 0 && (p.models ?? []).length > 0) {
		const err: any = new Error(
			`"${providerName}" 的模型将全部删空。自定义提供商必须至少保留一个模型。`
			+ `你可以：① 保留一个模型；② 用「恢复默认」把列表从配置里移除（网关会按地址自动提供目录）；③ 删除整个提供商。`,
		)
		// v0.6.0：结构化错误码，UI 据此弹「三选一」而不是只显示一行红字
		err.code = "LAST_MODEL"
		err.providerName = providerName
		throw err
	}
}

/** 判断写入被拒是否因为「该路由在内置目录中不存在，删空 models 后无目录可回退」 */
function isNoCatalogReject(message: string | undefined): boolean {
	return /resolves no models/.test(String(message ?? ""))
}

// ---------- 禁用归档（官方 dsh-model-capabilities 机制，跨命名空间对账搬移） ----------
function getDisabledStore(): Record<string, { profile: any; displayName?: string }> {
	const value = capsScope?.getSnapshot?.()?.value
	const out: Record<string, any> = {}
	const disabled = value?.disabled
	if (!disabled || typeof disabled !== "object" || Array.isArray(disabled)) return out
	for (const [route, entry] of Object.entries(disabled)) {
		const e: any = entry
		if (!e || typeof e !== "object" || !e.profile || typeof e.profile !== "object") continue
		out[route] = { profile: e.profile, ...(typeof e.displayName === "string" && e.displayName ? { displayName: e.displayName } : {}) }
	}
	return out
}
/** 禁用：profile 归档到 caps ns + 从 llm ns unset（unset 不触发"至少1模型"校验） */
async function actionDisableProvider(route: string) {
	const capsNs = requireCapsNs()
	const snap = llmScope.getSnapshot()
	const profile = jsonValue(snap.value?.providers?.[route])
	if (!profile) throw new Error(`提供商 "${route}" 不存在`)
	const capsSnap = capsScope.getSnapshot()
	const stash = { profile, displayName: String(profile.displayName ?? route) }
	const r1 = await REMOTE.settings.mutate(capsNs, [{ op: "set", path: ["disabled", route], value: stash }], capsSnap.revision)
	if (!r1.ok) throw new Error("归档失败：" + (r1.error?.message ?? "写入被拒绝"))
	const r2 = await REMOTE.settings.mutate(LLM_NS, [{ op: "unset", path: ["providers", route] }], snap.revision)
	if (!r2.ok) {
		// 回滚归档，避免两边不一致
		await REMOTE.settings.mutate(capsNs, [{ op: "unset", path: ["disabled", route] }], capsSnap.revision).catch(() => {})
		throw new Error("移除失败：" + (r2.error?.message ?? "写入被拒绝"))
	}
}
/** 启用：归档原样搬回 llm ns + 清归档条目 */
async function actionEnableProvider(route: string) {
	const capsNs = requireCapsNs()
	const capsSnap = capsScope.getSnapshot()
	const stash = getDisabledStore()[route]
	if (!stash) throw new Error(`归档中没有 "${route}" 的记录`)
	const llmSnap = llmScope.getSnapshot()
	if (llmSnap.value?.providers?.[route]) throw new Error(`提供商 "${route}" 已在启用列表中`)
	const r1 = await REMOTE.settings.mutate(LLM_NS, [{ op: "set", path: ["providers", route], value: jsonValue(stash.profile) }], llmSnap.revision)
	if (!r1.ok) throw new Error("恢复失败：" + (r1.error?.message ?? "写入被拒绝"))
	const r2 = await REMOTE.settings.mutate(capsNs, [{ op: "unset", path: ["disabled", route] }], capsSnap.revision)
	if (!r2.ok) throw new Error("清理归档失败：" + (r2.error?.message ?? "写入被拒绝"))
}
/** 彻底删除已禁用的提供商（只清归档条目） */
async function actionPurgeDisabled(route: string) {
	const capsNs = requireCapsNs()
	const snap = capsScope.getSnapshot()
	const r = await REMOTE.settings.mutate(capsNs, [{ op: "unset", path: ["disabled", route] }], snap.revision)
	if (!r.ok) throw new Error(r.error?.message ?? "写入被拒绝")
}

// ---------- actions ----------
async function actionAddProvider(f: any) {
	if (!/^[a-z0-9][a-z0-9-]*$/.test(f.name)) throw new Error("路由名称请用小写字母/数字/连字符（如 my-gateway）")
	if (!f.baseURL) throw new Error("Base URL 必填")
	// API Key 可留空：本地模型/免鉴权网关不需要（留空则不写凭据库，Key 引用名保留，日后可补填）
	if (f.apiKey && String(f.apiKey).trim()) await REMOTE.credentials.set(deriveKeyRef(f.name), String(f.apiKey).trim())
	await writeProviders((providers) => {
		if (providers[f.name]) throw new Error(`提供商 "${f.name}" 已存在`)
		providers[f.name] = {
			displayName: f.displayName || f.name,
			baseURL: f.baseURL,
			apiKeyEnv: deriveKeyRef(f.name),
			// ⚠️ v0.6.0 实测（宿主 resolveRouteModels L689）：路由级 api 会**覆盖**目录里每个模型自带的协议
			//   （`const api = request.api ?? base?.api ?? routeApi`）。给内置厂商写死 api 会让它的模型
			//   按错的协议发请求（如 anthropic 的模型被按 openai-completions 发）。故内置目录已知的路由
			//   一律不写 api，交给目录；只有自建路由才必须显式指定。
			...(!f.catalogKnown && f.api ? { api: f.api } : {}),
			// ⚠️ 同理不写 models：空数组会被判「声明了空列表」，且 UI 会显示"0 个模型"与实际
			//   （目录提供全部模型）不符。省略字段 = 回退目录，这才是「跟随内置目录」的正确表达。
			//   仅当用户填了首个模型时才写 models。
			...(f.firstModelId ? {
				models: [{
					id: f.firstModelId,
					name: f.firstModelName || f.firstModelId,
					contextWindow: f.contextWindow || undefined,
					maxTokens: f.maxTokens || undefined,
					input: f.vision ? VISION : ["text"],
				}],
			} : {}),
			// v0.6.0：只有用户明确配置了才写（undefined 会被 jsonValue 清掉，等于跟随官方默认）
			...(f.retryPolicy ? { retryPolicy: f.retryPolicy } : {}),
		}
		return providers
	})
}
async function actionSaveProviderEdits(name: string, fields: any) {
	// 可选：填了新 Key 就覆盖写入凭据库；不填则保留原 Key 不动
	if (fields.apiKey && String(fields.apiKey).trim()) {
		await REMOTE.credentials.set(deriveKeyRef(name), String(fields.apiKey).trim())
	}
	await writeProviders((providers) => {
		const p = providers[name]
		if (!p) throw new Error(`提供商 "${name}" 不存在`)
		const apiChanged = p.api !== fields.api
		p.displayName = fields.displayName || name
		p.baseURL = fields.baseURL
		// fields.api 为空串 = 用户选择「不指定协议」→ 删掉字段，跟随内置目录里每个模型自己的协议。
		// ⚠️ 不能写成 api: ""（空串会被当作未知协议校验失败），也不能默认填一个协议（会覆盖目录）。
		if (fields.api) p.api = fields.api
		else delete p.api
		// v0.6.0：协议变了 → 模型上的旧 compat 键对新协议可能不存在，宿主会整单拒绝。
		// 新协议不 offer 的键一律清掉（能留的保留）；也有可能是空 compat，删字段。
		if (apiChanged) {
			for (const m of p.models ?? []) {
				const stray = strayCompatKeys(m?.compat, fields.api)
				if (!stray.length) continue
				for (const k of stray) delete m.compat[k]
				if (Object.keys(m.compat).length === 0) delete m.compat
			}
		}
		// v0.6.0：重试策略。undefined = 「跟随官方默认」→ 必须把旧字段删掉（spread 不会移除旧键）
		if (fields.retryPolicy === undefined) delete p.retryPolicy
		else p.retryPolicy = fields.retryPolicy
		return providers
	})
}
async function actionDeleteProvider(name: string) {
	await writeProviders((providers) => { delete providers[name]; return providers })
}
async function actionAddModel(providerName: string, m: any) {
	await writeProviders((providers) => {
		const list = providers[providerName].models ?? []
		if (list.some((x) => x.id === m.id)) throw new Error(`模型 "${m.id}" 已存在`)
		list.push(m)
		providers[providerName].models = list
		return providers
	})
}
async function actionDeleteModel(providerName: string, modelId: string) {
	await writeProviders((providers) => {
		assertNotLastModels(providers, providerName, [modelId])
		providers[providerName].models = (providers[providerName].models ?? []).filter((m) => m.id !== modelId)
		return providers
	})
}
async function actionUpdateModel(providerName: string, modelId: string, entry: any) {
	await writeProviders((providers) => {
		const list = providers[providerName].models ?? []
		const i = list.findIndex((m) => m.id === modelId)
		if (i < 0) throw new Error(`模型 "${modelId}" 不存在`)
		// 合并而非整体替换：compat 等表单外的字段原样保留
		list[i] = { ...list[i], ...entry }
		// 显式清除字段：inherit 模式下要删掉 reasoningEfforts（spread 不会移除旧键）
		if (entry.reasoningEfforts === undefined && "reasoningEfforts" in list[i]) {
			delete list[i].reasoningEfforts
		}
		// compat 同理：所有开关都选「跟随」时删除整个字段，回到目录/自动探测
		if (entry.compat === undefined && "compat" in list[i]) {
			delete list[i].compat
		}
		providers[providerName].models = list
		return providers
	})
}
/** 拉取官方预置厂商目录（宿主 llm/listConfigurableProviders）。
 *  ⚠️ 这个接口返回的是**并集**（宿主 directoryEntries）：
 *    ① 所有已安装目录里的官方厂商  ② 当前 profiles 自己声明的路由
 *    `declared: true` 标记的就是 ② —— 是用户自建路由，不属于「预置厂商」。
 *  这里返回**完整目录**（含 declared 标记），因为「某个路由是不是内置厂商」要用全集判断；
 *  下拉里「可新增的预置项」由调用方用 visiblePresets 派生，不要在这里裁剪。 */
async function actionListPresets(): Promise<any[]> {
	const res = await REMOTE.llm.listConfigurableProviders()
	if (!res?.ok) throw new Error(res?.error?.message ?? "读取预置厂商列表失败")
	return (Array.isArray(res.value) ? res.value : []).filter((e: any) =>
		e && typeof e.provider === "string" && e.settingsNs === LLM_NS
	)
}
/** 该条目是否只能靠 OAuth 登录（没有可用的 API Key 环境变量）→ 填 Key 也连不通，属伪选项 */
function needsOAuthOnly(e: any): boolean {
	const env = e?.nativeAuth?.env
	const hasEnv = Array.isArray(env) ? env.length > 0 : !!env
	return e?.nativeAuth?.oauth === true && !hasEnv
}
/** 从完整目录派生「可以新增的预置厂商」：
 *  - 排除配置自己声明的路由（declared）
 *  - 排除当前已配置的（否则会出现在列表里、点进去又提示已存在）
 *  - 排除仅支持 OAuth 的（填 API Key 也连不通）
 *  返回 { 可新增, 需要OAuth登录的条数 } */
function visiblePresets(all: any[], configured: Record<string, any>): { list: any[]; oauthOnly: number } {
	let oauthOnly = 0
	const list: any[] = []
	for (const e of all) {
		if (e.declared === true) continue
		if (e.provider in configured) continue
		if (needsOAuthOnly(e)) { oauthOnly += 1; continue }
		list.push(e)
	}
	return { list, oauthOnly }
}
async function actionPullModels(providerName: string) {
	const p = getProviders()[providerName]
	// 必须带 provider 名：官方运行时据此从凭据库解析该路由的 key；
	// 不带则裸请求，需要鉴权的网关（如本地 googleanti）会 401
	const response = await REMOTE.llm.discoverModels(LLM_NS, { provider: providerName, api: p.api, baseURL: p.baseURL })
	if (!response.ok) throw new Error(response.error?.message ?? "拉取失败")
	// 远端通道成功时 value 就是宿主返回的模型数组（不是 {models:[…]}）
	const raw = Array.isArray(response.value) ? response.value : (Array.isArray(response.value?.models) ? response.value.models : [])
	const found = raw.filter((m) => m && m.id).map((m) => ({
		id: m.id,
		name: m.name || m.id,
		...(m.contextWindow !== undefined ? { contextWindow: m.contextWindow } : {}),
		...(m.maxTokens !== undefined ? { maxTokens: m.maxTokens } : {}),
		input: Array.isArray(m.input) ? m.input : ["text"],
	}))
	const existing = new Set((getProviders()[providerName]?.models ?? []).map((m) => m.id))
	const fresh = found.filter((m) => !existing.has(m.id))
	return { all: found, fresh, skipped: found.length - fresh.length, existing }
}
async function actionAddPulled(providerName: string, picked: any[]) {
	await writeProviders((providers) => {
		const list = providers[providerName].models ?? []
		for (const m of picked) {
			if (!list.some((x) => x.id === m.id)) list.push(m)
		}
		providers[providerName].models = list
		return providers
	})
}
/** 批量删除：只发一次 settings.mutate */
async function actionRemoveModels(providerName: string, ids: string[]) {
	const set = new Set(ids)
	await writeProviders((providers) => {
		assertNotLastModels(providers, providerName, ids)
		providers[providerName].models = (providers[providerName].models ?? []).filter((m) => !set.has(m.id))
		return providers
	})
}
/** 恢复默认模型：删除整个 models 字段，让适配器回退到网关动态目录（与官方模型页 resetModels 同语义）。
 *  ⚠️ 仅对「内置目录已知的路由」合法：目录不认识的自建路由没有可回退的目录，删字段等于声明无模型，
 *  会被宿主以 `resolves no models` 整单拒绝（2026-10-23 实测 smart-route）。这里翻成人话，别把英文原文抛给用户。 */
async function actionResetModels(providerName: string) {
	try {
		await writeProviders((providers) => {
			const p = providers[providerName]
			if (!p) throw new Error(`提供商 "${providerName}" 不存在`)
			delete p.models
			return providers
		})
	} catch (e: any) {
		if (isNoCatalogReject(e?.message)) {
			throw new Error(
				`"${providerName}" 不在内置模型目录里（自建网关），没有可回退的默认目录。`
				+ `请改用：① 保留至少一个模型；② 删除整个提供商。`,
			)
		}
		throw e
	}
}
/** 拖拽排序：把 modelId 移动到目标下标（模型选择器顺序 = models 数组顺序） */
async function actionMoveModelTo(providerName: string, modelId: string, toIndex: number) {
	await writeProviders((providers) => {
		const list = providers[providerName].models ?? []
		const i = list.findIndex((m) => m.id === modelId)
		if (i < 0) throw new Error(`模型 "${modelId}" 不存在`)
		const j = Math.max(0, Math.min(toIndex, list.length - 1))
		if (i === j) return providers
		const [item] = list.splice(i, 1)
		list.splice(j, 0, item)
		return providers
	})
}

// ---------- 模型行（复选 + 状态胶囊 + 测试/编辑/删除/排序；ro=只读用于已禁用提供商） ----------
function ModelRow({ provider, m, t, checked, index, onReorder, onTest, onEdit, onDelete, onToggleCheck, ro }: {
	provider: string; m: any; t?: TestState; checked: boolean;
	index?: number; onReorder?: (fromId: string, toIndex: number, side: "top" | "bottom") => void;
	onTest: () => void; onEdit: () => void; onDelete: () => void; onToggleCheck: () => void;
	ro?: boolean;
}) {
	// 拖动排序：HTML5 原生 DnD（不引第三方库）。指针在某行的上半/下半 → 在该行上/下**插入一条真实元素**的蓝色落点线
	// （用元素而非 box-shadow：box-shadow 会被父容器裁剪，这正是上一版"看不到线"的坑）
	const [drop, setDrop] = React.useState<"" | "top" | "bottom">("")
	const drag = !ro && !!onReorder
	return (
		<div className={"dpk-rowitem" + (drag ? " dpk-rowitem-drag" : "")}
			style={ro ? { opacity: 0.7 } : undefined}
			draggable={drag || undefined}
			onDragStart={drag ? (e: any) => { e.dataTransfer.setData("text/plain", m.id); e.dataTransfer.effectAllowed = "move" } : undefined}
			onDragEnd={drag ? () => setDrop("") : undefined}
			onDragOver={drag ? (e: any) => {
				e.preventDefault()
				e.dataTransfer.dropEffect = "move"
				const r = e.currentTarget.getBoundingClientRect()
				const side = e.clientY < r.top + r.height / 2 ? "top" : "bottom"
				if (side !== drop) setDrop(side)
			} : undefined}
			onDragLeave={drag ? () => setDrop("") : undefined}
			onDrop={drag ? (e: any) => {
				e.preventDefault()
				const side = drop === "top" ? "top" : "bottom"
				setDrop("")
				const fromId = e.dataTransfer.getData("text/plain")
				if (fromId && fromId !== m.id && index !== undefined) onReorder!(fromId, index, side)
			} : undefined}>
			{/* 落点线绝对定位在行的上/下沿：不占布局空间，避免"插线→顶动下面的行→指针落到别的行→来回抖" */}
			{drop === "top" ? <div className="dpk-dropline dpk-dropline-top" aria-hidden="true" /> : null}
			{drag ? <span className="dpk-draghandle" title="按住可拖动调整顺序">⠿</span> : null}
			{ro ? null : <Checkbox checked={checked} onChange={onToggleCheck} />}
			<div className="dpk-cell">
				<div className="dpk-cell-title" title={m.id}>{m.name && m.name !== m.id ? m.name : m.id}</div>
				<div className="dpk-cell-sub">
					<Mono>{m.id}</Mono> · {fmtNum(m.contextWindow)} ctx · {fmtNum(m.maxTokens)} out · {hasVision(m) ? "识图" : "文本"}{effortsLabel(m) ? " · " + effortsLabel(m) : ""}{compatSummary(m) ? " · " + compatSummary(m) : ""}
				</div>
				{t?.status === "fail" ? <div className="dpk-merr"><b>失败：</b>{t.error}</div> : null}
				{t?.status === "ok" && (t.latencyMs ?? 0) >= 10000 ? <Hint>通过 {fmtLatency(t.latencyMs)} · 网关首字节慢，日常对话可用，介意延迟可换路由</Hint> : null}
			</div>
			{ro ? <StateBadge state="idle">已禁用</StateBadge> : t ? (
				t.status === "testing" ? <StateBadge state="testing">测试中…{t.elapsed != null ? " " + Math.round(t.elapsed / 1000) + "s" : ""}</StateBadge>
				: t.status === "ok" ? <StateBadge state="ok">通过 {fmtLatency(t.latencyMs)}</StateBadge>
				: <StateBadge state="fail">失败</StateBadge>
			) : <StateBadge state="idle">未测</StateBadge>}
			{ro ? null : (
				<div className="dpk-ops">
					<Button size="sm" disabled={t?.status === "testing"} onClick={onTest}>{t?.status === "fail" ? "重试" : t?.status === "testing" ? "测试中" : "测试"}</Button>
					<Button size="sm" onClick={onEdit}>编辑</Button>
					<ConfirmButton confirmText="确认删除？" onConfirm={onDelete}>删除</ConfirmButton>
				</div>
			)}
		{drop === "bottom" ? <div className="dpk-dropline dpk-dropline-bottom" aria-hidden="true" /> : null}
		</div>
	)
}

// ---------- 拉取面板（Chip 受控选中态：on=true 深色 / 默认白底 / exist 灰色不可选） ----------
function PullPanel({ models, existing, onJoin }: {
	models: any[]; existing: Set<string>;
	onJoin: (chosen: any[]) => void;
}) {
	const [search, setSearch] = React.useState("")
	// 默认选中全部新模型，选中态由 picked 显式控制
	const [picked, setPicked] = React.useState<Set<string>>(() => new Set(models.filter((m) => !existing.has(m.id)).map((m) => m.id)))
	const fresh = models.filter((m) => !existing.has(m.id))
	const q = search.trim().toLowerCase()
	const matches = (m: any) => (m.name + " " + m.id).toLowerCase().includes(q)
	const visible = fresh.filter(matches)
	const empty = models.length === 0
	const allConfigured = !empty && fresh.length === 0
	const noneMatched = fresh.length > 0 && visible.length === 0
	const allPicked = visible.length > 0 && visible.every((m) => picked.has(m.id))

	const togglePick = (id: string) => setPicked((prev) => {
		const next = new Set(prev)
		if (next.has(id)) next.delete(id); else next.add(id)
		return next
	})
	const toggleAll = () => setPicked((prev) => {
		const next = new Set(prev)
		if (allPicked) { for (const m of visible) next.delete(m.id) }
		else { for (const m of visible) next.add(m.id) }
		return next
	})

	let hint: React.ReactNode
	if (empty) hint = "网关没有返回任何模型（检查网关是否支持 /v1/models 接口），可用「手动添加」录入"
	else if (allConfigured) hint = `没有可加入的新模型（网关的 ${models.length} 个模型都已配置）`
	else if (noneMatched) hint = `没有匹配「${search}」的模型`
	else hint = `将加入 ${picked.size} 个新模型${fresh.length !== models.length ? `（已配置的 ${models.length - fresh.length} 个自动跳过）` : ""}`

	return (
		<div className="dpk-pullpanel">
			<div className="dpk-pullbar">
				<SearchInput placeholder="搜索模型名…" value={search} onChange={(e) => setSearch(e.target.value)} />
				<Button size="sm" disabled={visible.length === 0} onClick={toggleAll}>{allPicked ? "取消全选" : "全选"}</Button>
			</div>
			<div className="dpk-chips">
				{!empty ? models.filter(matches).map((m) => {
					if (existing.has(m.id)) return <Chip key={m.id} exist>{chipLabel(m)}</Chip>
					const on = picked.has(m.id)
					return <Chip key={m.id} on={on} onClick={() => togglePick(m.id)}>{chipLabel(m)}{on ? " ✓" : ""}</Chip>
				}) : null}
			</div>
			<div className="dpk-pullops">
				<Hint>{hint}</Hint>
				{!empty && fresh.length > 0 ? (
					<Button size="sm" variant="primary" disabled={picked.size === 0}
						onClick={() => onJoin(models.filter((m) => !existing.has(m.id) && picked.has(m.id)))}>加入所选</Button>
				) : null}
			</div>
		</div>
	)
}

// ---------- 提供商表单 ----------
function ProviderForm({ mode, provider, onDone }: { mode: "addProvider" | "editProvider"; provider?: string; onDone: () => void }) {
	const isEdit = mode === "editProvider"
	const p = isEdit ? (getProviders()[provider!] ?? {}) : {}
	const [name, setName] = React.useState(provider ?? "")
	const [displayName, setDisplayName] = React.useState(p.displayName ?? "")
	// 编辑时 p.api 可能为空（内置目录接管协议），此时保持空串 = 「不指定协议」，
	// 保存时删掉 api 字段而不是写死一个默认协议（否则会覆盖目录里每个模型的协议）
	const [api, setApi] = React.useState<string>(p.api ?? (isEdit ? "" : "openai-completions"))
	const [baseURL, setBaseURL] = React.useState(p.baseURL ?? "")
	const [apiKey, setApiKey] = React.useState("")
	const [firstModelId, setFirstModelId] = React.useState("")
	const [vision, setVision] = React.useState(false)
	const [err, setErr] = React.useState<string | null>(null)
	// 重试策略（v0.6.0）：把已有 retryPolicy 回填进表单；没有就是「跟随官方默认」
	const rp = p.retryPolicy && typeof p.retryPolicy === "object" ? p.retryPolicy : null
	const [retryMode, setRetryMode] = React.useState<"default" | "normal" | "always">(
		rp?.mode === "always" ? "always" : rp?.mode === "normal" ? "normal" : "default"
	)
	const [retryMax, setRetryMax] = React.useState<string>(rp?.maxRetries != null ? String(rp.maxRetries) : "")
	const [retryCodes, setRetryCodes] = React.useState<string>(
		Array.isArray(rp?.retryableCodes) ? rp.retryableCodes.join(", ") : ""
	)
	const [retryInit, setRetryInit] = React.useState<string>(rp?.backoff?.initialDelayMs != null ? String(rp.backoff.initialDelayMs) : "")
	const [retryMaxDelay, setRetryMaxDelay] = React.useState<string>(rp?.backoff?.maxDelayMs != null ? String(rp.backoff.maxDelayMs) : "")
	const [retryJitter, setRetryJitter] = React.useState<string>(rp?.backoff?.jitterRatio != null ? String(rp.backoff.jitterRatio) : "")
	// 预置厂商（v0.6.0，仅新增模式）：官方内置目录的一键填充。
	// 目录是异步拉的，失败不阻塞手填 —— 只把错误显示在预置区。
	const [presets, setPresets] = React.useState<any[] | null>(null)
	const [presetErr, setPresetErr] = React.useState<string | null>(null)
	// 编辑态也要拉目录：只用于校验「不指定协议」是否合法（内置目录已知的路由才能省略 api）
	React.useEffect(() => {
		let alive = true
		actionListPresets()
			.then((list) => { if (alive) setPresets(list) })
			.catch((e) => { if (alive) setPresetErr(e?.message ?? String(e)) })
		return () => { alive = false }
	}, [])
	/** 选中预置项：只预填表单（路由名/显示名/Base URL），不直接写配置。
	 *  协议不预填 —— 官方目录里没有协议字段，内置模型各自声明；留空即跟随目录（api 字段本就可选）。
	 *  模型 ID 也不预填：目录已知的路由模型会自动带出，正是我们要的语义。 */
	const applyPreset = (route: string) => {
		const hit = (presets ?? []).find((x) => x.provider === route)
		if (!hit) return
		setName(hit.provider)
		setDisplayName(hit.displayName && hit.displayName !== hit.provider ? hit.displayName : "")
		setBaseURL(hit.defaultBaseURL ?? "")
		// 预置厂商协议由目录决定，把选择器复位到默认值不参与写入；用户若要强改协议，改路由名即退出预置模式
		setApi("openai-completions")
		setErr(null)
	}
	// 下拉只列「可新增的官方厂商」：自建路由(declared)与已配置项都不出现（FB-1 修复点，见 visiblePresets）
	const presetView = React.useMemo(() => visiblePresets(presets ?? [], getProviders()), [presets])
	// 路由名是否在官方内置目录里：决定协议/模型是否由目录接管（写不写 api、必不必填模型）。
	// ⚠️ 必须用**完整目录**判断，不能用下拉可见列表 —— 已配置的内置厂商不会出现在下拉里，但仍是内置厂商。
	const catalogKnownNow = (presets ?? []).some((x: any) => x.provider === name.trim())

	const submit = () => {
		// 表单级反馈统一走 toast：错=红、对=绿（+ 就地红字，提示 2.6 秒消失后仍能回看）
		const fail = (e: any) => {
			let m = e?.message ?? String(e)
			if (/resolves no models/.test(m)) m = "该路由不在内置目录中，必须至少列出一个模型（模型 ID 留空仅对内置目录已知的路由有效）"
			setErr(m)
			toast(m, "error")
		}
		try {
			if (!baseURL.trim()) throw new Error("Base URL 必填")
			if (isEdit) {
					const retryPolicy = buildRetryPolicy({
						mode: retryMode, maxRetries: retryMax, codes: retryCodes,
						initialDelayMs: retryInit, maxDelayMs: retryMaxDelay, jitterRatio: retryJitter,
					})
					actionSaveProviderEdits(provider!, {
						displayName: displayName.trim(), api, baseURL: baseURL.trim(), apiKey, retryPolicy,
					})
						.then(() => { toast(`已保存提供商 ${provider}`, "success"); onDone() }).catch(fail)
				} else {
				const n = name.trim()
				if (!/^[a-z0-9][a-z0-9-]*$/.test(n)) throw new Error("路由名称请用小写字母/数字/连字符（如 my-gateway）")
				// 判据是「路由名在不在官方内置目录里」，不是「有没有从下拉里选」——
				// 这样手打 openai / anthropic 也能走对路径（不写 api、不必填模型）。
				const catalogKnown = (presets ?? []).some((x: any) => x.provider === n)
				// 自建路由目录不认识，宿主无从推断协议与模型 → 必须显式给出
				if (!catalogKnown && !firstModelId.trim()) {
					throw new Error("自建路由必须至少填一个模型 ID（内置目录不认识该路由，无法自动带出模型）")
				}
				// API Key 可留空（本地模型/免鉴权网关）；留空时不写凭据库，但保留 Key 引用名以便日后补填
				actionAddProvider({
					name: n, displayName: displayName.trim(), baseURL: baseURL.trim(), api,
					apiKey: apiKey.trim(), firstModelId: firstModelId.trim(), firstModelName: "", vision,
					catalogKnown,
					retryPolicy: buildRetryPolicy({
						mode: retryMode, maxRetries: retryMax, codes: retryCodes,
						initialDelayMs: retryInit, maxDelayMs: retryMaxDelay, jitterRatio: retryJitter,
					}),
				})
					.then(() => { toast(`已添加提供商 ${n}`, "success"); onDone() }).catch(fail)
			}
		} catch (e: any) { fail(e) }
	}

	return (
		<div>
			<FormHead
				title={isEdit ? `编辑提供商 · ${provider}` : "新增提供商"}
				leading={<Button size="sm" onClick={onDone}>← 返回</Button>}
			/>
			<div className="dpk-formhint">提供商 = 请求地址 + 凭据 + 协议；Key 写入凭据库，保存即热生效。</div>
			{!isEdit ? (
				<React.Fragment>
					{/* FB-1/FB-2：官方预置厂商一键填充。只列「可新增的官方厂商」——
					    自建路由(declared)与已配置项都不出现；40+ 项用可搜索组合框（原生 select 会铺满屏幕）。 */}
					<Field label="从预置厂商选择（可选，选中后自动填好地址）">
						<ComboBox
							value={name.trim()}
							placeholder="— 自定义 / 手动填写 —"
							options={presetView.list.map((x: any) => ({
								value: x.provider,
								label: x.provider,
								description: x.defaultBaseURL ?? "需自填地址",
							}))}
							onChange={(v) => { if (v) applyPreset(v) }}
							emptyText="没有匹配的厂商，可直接手填"
						/>
					</Field>
					{presetErr ? (
						<Hint>预置列表读取失败（不影响手填）：{presetErr}</Hint>
					) : presets === null ? (
						<Hint>正在读取官方预置厂商列表…</Hint>
					) : (
						<Hint>
							可添加 {presetView.list.length} 个内置厂商（已配置的与自建路由不在列表里）。
							{presetView.oauthOnly > 0 ? `另有 ${presetView.oauthOnly} 个需 OAuth 登录，填 API Key 连不通，故未列出。` : ""}
							选中只做预填，仍可自由修改；模型列表留空时由内置目录自动带出。
						</Hint>
					)}
				</React.Fragment>
			) : null}
			{!isEdit ? (
				<Field label="路由名称（小写字母/数字/连字符）">
					<Input value={name} onChange={(e) => setName(e.target.value)} placeholder="my-gateway" />
				</Field>
			) : null}
			{!isEdit && catalogKnownNow ? (
				<Hint style={{ marginTop: 6 }}>
					「{name.trim()}」是内置厂商：<b>协议与模型都由内置目录提供</b>，不用填。
					{firstModelId.trim() ? "（你填了模型 ID，将以你的声明为准，只列这一个）" : ""}
				</Hint>
			) : null}
			<Field label="显示名称">
				<Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="与路由名称相同可留空" />
			</Field>
			{/* 内置目录已知的路由不写 api（否则会覆盖目录里每个模型自带的协议），故只在自建路由时展示该选择 */}
			{isEdit || !catalogKnownNow ? (
				<Field label="API 协议">
					<Select value={api} onChange={(e) => setApi(e.target.value)}>
						{/* 只在原本就没写协议时提供该项：已声明过协议的提供商切成「不指定」，
						    会让模型上遗留的 compat 键失去协议依据，不做这个有风险的转换。 */}
						{isEdit && !p.api ? <option value="">— 不指定（跟随内置目录，推荐）—</option> : null}
						{PROTOCOLS.map((x) => <option key={x.v} value={x.v}>{x.label}</option>)}
					</Select>
				</Field>
			) : null}
			{isEdit && api !== (p.api ?? "") && strayCompatCount(provider!, api) > 0 ? (
				<FormError>
					切换协议后，该提供商下共 {strayCompatCount(provider!, api)} 个模型级兼容开关不属于「{api}」，保存时会自动清除（否则宿主会整单拒绝）。
				</FormError>
			) : null}
			<Field label="Base URL">
				<Input value={baseURL} onChange={(e) => setBaseURL(e.target.value)} placeholder="https://…/v1" />
			</Field>
			{!isEdit ? (
				<React.Fragment>
					<Field label="API Key（可留空）">
						<Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-…（本地模型/免鉴权网关可留空）" />
					</Field>
					<Field label={catalogKnownNow ? "首个模型 ID（可留空，留空即用目录全部模型）" : "首个模型 ID（自建路由必填）"}>
						<Input value={firstModelId} onChange={(e) => setFirstModelId(e.target.value)} placeholder="deepseek-v4-flash" />
					</Field>
					<Hint>
						{catalogKnownNow
							? "留空 = 完全跟随内置目录（推荐）；填了则只列这一个模型。"
							: "内置目录不认识该路由，必须至少列一个模型，否则宿主会拒绝。"}
					</Hint>
					<Row>
						<Switch checked={vision} onChange={setVision} />
						<Hint>该模型支持识图？</Hint>
					</Row>
				</React.Fragment>
			) : (
				<React.Fragment>
					<Field label="API Key（可选，留空保持不变）">
						<Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={p.apiKeyEnv ? "留空 = 沿用当前 Key" : "sk-…"} />
					</Field>
					<Hint>Key 引用：{p.apiKeyEnv ?? "—"}；凭据库覆盖即热生效，无需重启。</Hint>
				</React.Fragment>
			)}
			{/* v0.6.0：重试策略（官方 retryPolicy，provider 级） */}
			<FormHead title="失败重试（retryPolicy）" size={13} style={{ marginTop: 10 }} />
			<Row gap={6}>
				<Button size="sm" variant={retryMode === "default" ? "primary" : "neutral"} onClick={() => setRetryMode("default")}>跟随官方默认</Button>
				<Button size="sm" variant={retryMode === "normal" ? "primary" : "neutral"} onClick={() => setRetryMode("normal")}>限次重试 normal</Button>
				<Button size="sm" variant={retryMode === "always" ? "primary" : "neutral"} onClick={() => setRetryMode("always")}>无限重试 always</Button>
			</Row>
			{retryMode === "default" ? (
				<Hint>不写 retryPolicy 字段：normal 模式、最多重试 5 次，只重试瞬时错误。换回默认时旧配置会被删除。</Hint>
			) : null}
			{retryMode === "normal" ? (
				<Row gap={8} align="flex-end" style={{ marginTop: 8 }}>
					<Field label="最大重试次数（留空=5）">
						<Input type="number" min="0" value={retryMax} onChange={(e) => setRetryMax(e.target.value)} placeholder="5" />
					</Field>
					<Field label="可重试错误码（逗号分隔，留空=官方默认集）">
						<Input value={retryCodes} onChange={(e) => setRetryCodes(e.target.value)} placeholder={RETRY_CODES_HINT} style={{ minWidth: 320 }} />
					</Field>
				</Row>
			) : null}
			{retryMode === "always" ? (
				<Hint>每次失败都重试，直到成功、取消或会话销毁。网关长期不可用时会一直卡在重试上，请谨慎启用。</Hint>
			) : null}
			{retryMode !== "default" ? (
				<React.Fragment>
					<Row gap={8} align="flex-end" style={{ marginTop: 6 }}>
						<Field label="退避初始延迟 ms（留空=500）">
							<Input type="number" min="1" value={retryInit} onChange={(e) => setRetryInit(e.target.value)} placeholder="500" />
						</Field>
						<Field label="退避最大延迟 ms（留空=10000）">
							<Input type="number" min="1" value={retryMaxDelay} onChange={(e) => setRetryMaxDelay(e.target.value)} placeholder="10000" />
						</Field>
						<Field label="抖动比 0~1（留空=0.1）">
							<Input type="number" min="0" max="1" step="0.05" value={retryJitter} onChange={(e) => setRetryJitter(e.target.value)} placeholder="0.1" />
						</Field>
					</Row>
				</React.Fragment>
			) : null}
			{err ? <FormError>{err}</FormError> : null}
			<FormOps>
				<Button onClick={onDone}>取消</Button>
				<Button variant="primary" onClick={submit}>{isEdit ? "保存" : "创建"}</Button>
			</FormOps>
		</div>
	)
}

// ---------- 模型表单 ----------
function ModelForm({ mode, provider, modelId, onDone }: { mode: "addModel" | "editModel"; provider: string; modelId?: string; onDone: () => void }) {
	const isEdit = mode === "editModel"
	const list = getProviders()[provider]?.models ?? []
	const m = isEdit ? (list.find((x) => x.id === modelId) ?? {}) : {}
	const [id, setId] = React.useState(m.id ?? "")
	const [display, setDisplay] = React.useState(m.name ?? "")
	const [ctx, setCtx] = React.useState<any>(m.contextWindow ?? "")
	const [max, setMax] = React.useState<any>(m.maxTokens ?? "")
	const [vision, setVision] = React.useState(!!m.input?.includes("image"))
	const [err, setErr] = React.useState<string | null>(null)
	// 推理档位（与官方 dsh-model-capabilities 同字段 reasoningEfforts）：
	// "inherit" 不声明（不写字段）| "none" 无推理（false）| "levels" 声明档位（dict）
	const effortsRaw = m.reasoningEfforts
	const [effortsMode, setEffortsMode] = React.useState<"inherit" | "none" | "levels">(
		effortsRaw === undefined ? "inherit" : (effortsRaw === false ? "none" : "levels")
	)
	const [efforts, setEfforts] = React.useState<Record<string, string>>(
		() => {
			if (effortsRaw && typeof effortsRaw === "object" && !Array.isArray(effortsRaw)) {
				const out: Record<string, string> = {}
				for (const lvl of THINKING_LEVELS) {
					// 只回读**实际声明过**的档位；缺失或 null 一律留空。
					// （旧写法把缺失档位填成档位名本身 → "只存 1 个档位、重开全变成已填" —— 2026-10-10 用户实测报的 bug）
					const w = (effortsRaw as any)[lvl]
					out[lvl] = typeof w === "string" ? w : ""
				}
				return out
			}
			return {}
		}
	)
	const setLevelWire = (lvl: string, v: string) => setEfforts((e) => ({ ...e, [lvl]: v }))
	/** 一键填满：off 留空（= 支持但不发送参数），其余档位一律填同名 wire 值（用户要求"一键就填充所有档位"） */
	const applyPreset = () => {
		setEfforts(Object.fromEntries(THINKING_LEVELS.map((l) => [l, l === "off" ? "" : l])))
		setEffortsMode("levels")
	}

	// 高级兼容性（v0.6.0）：只显示当前路由协议 offer 的字段，三态（跟随 / 开 / 关）
	// 路由没写 api 时（跟随内置目录，每个模型协议可能不同），无法确定协议专属开关 →
	// 一律不显示，避免给 anthropic 模型写 completions 专属字段导致整个 provider 保存失败。
	const providerApiRaw = getProviders()[provider]?.api
	const providerApi = typeof providerApiRaw === "string" && providerApiRaw ? providerApiRaw : ""
	const compatFields = COMPAT_FIELDS[providerApi] ?? []
	const [compatOpen, setCompatOpen] = React.useState(false)
	const [compatTri, setCompatTri] = React.useState<Record<string, string>>(() => {
		const out: Record<string, string> = {}
		const c = m.compat && typeof m.compat === "object" ? m.compat : {}
		for (const f of COMPAT_FIELDS[providerApi] ?? []) {
			const v = c[f.key]
			if (v === undefined || v === null) out[f.key] = ""
			else if (f.kind === "bool") out[f.key] = v ? "true" : "false"
			// 官方 schemastery 会把 chatTemplateKwargs / chatTemplateArgs 无条件序列化成 `{}`，
			// 语义上等同未配置（官方 configuredCompatEntries 也视为空）。这里当「跟随」显示，
			// 否则用户看到 "{}" 会以为配过，一保存又因空对象被判未配置 —— 观感像"配置丢了"。
			else if (f.kind === "json") {
				const isEmpty = v && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0
				out[f.key] = isEmpty ? "" : JSON.stringify(v)
			}
			else out[f.key] = String(v)
		}
		return out
	})
	const setTri = (key: string, v: string) => setCompatTri((t) => ({ ...t, [key]: v }))

	const submit = () => {
		const finalId = isEdit ? modelId! : id.trim()
		if (!finalId) { setErr("模型 ID 必填"); toast("模型 ID 必填", "error"); return }
		// 推理档位：inherit → 不写字段（undefined 触发删除）；none → false；levels → dict
		let reasoningEfforts: any = undefined
		if (effortsMode === "none") reasoningEfforts = false
		else if (effortsMode === "levels") {
			const declared = Object.entries(efforts).filter(([lvl, wire]) => wire !== "" && wire != null)
			if (declared.length === 0) { setErr("声明档位时至少勾选/填写一个 off 以外的档位"); toast("声明档位时至少填写一个档位", "error"); return }
			const hasBeyondOff = declared.some(([lvl]) => lvl !== "off")
			if (!hasBeyondOff) { setErr("至少声明一个 off 以外的档位，或改选「无推理」"); toast("至少声明一个 off 以外的档位", "error"); return }
			reasoningEfforts = {}
		for (const lvl of THINKING_LEVELS) {
			const wire = efforts[lvl] ?? ""
			if (wire !== "") reasoningEfforts[lvl] = wire
			// off 留空 = 「支持但本次不发送参数」，按官方约定写 null（写空串会被 llm-pi-ai 校验拒绝：
			// reasoningEfforts.off must not be an empty string —— 2026-10-10 实测踩坑）
			else if (lvl === "off") reasoningEfforts[lvl] = null
			}
		}
		let compat: any
		try {
			compat = buildCompat(compatFields, compatTri, m.compat, providerApi)
		} catch (e: any) {
			setErr(e?.message ?? String(e)); toast(e?.message ?? String(e), "error"); return
		}
		const entry = {
			id: finalId,
			name: display.trim() || finalId,
			contextWindow: Number(ctx) || undefined,
			maxTokens: Number(max) || undefined,
			input: vision ? VISION : ["text"],
			reasoningEfforts,
			compat,
		}
		const fail = (e: any) => { const m = e?.message ?? String(e); setErr(m); toast(m, "error") }
		if (isEdit) actionUpdateModel(provider, modelId!, entry).then(() => { toast(`已保存模型 ${finalId}`, "success"); onDone() }).catch(fail)
		else actionAddModel(provider, entry).then(() => { toast(`已添加模型 ${finalId}`, "success"); onDone() }).catch(fail)
	}

	return (
		<div>
			<FormHead
				title={isEdit ? `编辑模型 · ${modelId}` : `添加模型 · ${provider}`}
				leading={<Button size="sm" onClick={onDone}>← 返回</Button>}
			/>
			<div className="dpk-formhint">模型 ID 发给网关，创建后不可改；显示名称只影响本页展示。改完保存即热生效。</div>
			<Field label={"模型 ID" + (isEdit ? "（不可改）" : "")}>
				<Input value={id} disabled={isEdit} onChange={(e) => setId(e.target.value)} placeholder="deepseek-v4-flash" />
			</Field>
			<Field label="显示名称（可留空）">
				<Input value={display} onChange={(e) => setDisplay(e.target.value)} placeholder="GLM-5.3 Flash" />
			</Field>
			<Row>
				<Field label="上下文窗口">
					<Input type="number" min="1" value={ctx} onChange={(e) => setCtx(e.target.value)} placeholder="1000000" />
				</Field>
				<Field label="最大输出">
					<Input type="number" min="1" value={max} onChange={(e) => setMax(e.target.value)} placeholder="131072" />
				</Field>
			</Row>
			<div className="dpk-switch-row">
				<Switch checked={vision} onChange={setVision} />
				<Hint>识图能力（图片输入）：开启后该模型可接收图片输入</Hint>
			</div>
			<FormHead title="推理档位（reasoningEfforts）" size={13} style={{ marginTop: 10 }} />
			<Row gap={6}>
				<Button size="sm" variant={effortsMode === "inherit" ? "primary" : "neutral"} onClick={() => setEffortsMode("inherit")}>不声明</Button>
				<Button size="sm" variant={effortsMode === "none" ? "primary" : "neutral"} onClick={() => setEffortsMode("none")}>无推理</Button>
				<Button size="sm" variant={effortsMode === "levels" ? "primary" : "neutral"} onClick={() => setEffortsMode("levels")}>声明档位</Button>
				{effortsMode === "levels" ? <Button size="sm" onClick={applyPreset}>一键填满档位</Button> : null}
			</Row>
			{effortsMode === "inherit" ? <Hint>跟随内置目录声明；自定义模型没有目录可跟随，等同无推理。不写 reasoningEfforts 字段。</Hint> : null}
			{effortsMode === "none" ? <Hint>声明该模型不参与推理（reasoningEfforts: false），模型选择器不再提供思考档位。</Hint> : null}
			{effortsMode === "levels" ? (
				<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 6, marginTop: 6 }}>
					{THINKING_LEVELS.map((lvl) => (
						<Field key={lvl} label={lvl}>
							<Input
								type="text"
								value={efforts[lvl] ?? ""}
								placeholder={lvl === "off" ? "（留空=不发送）" : lvl}
								onChange={(e) => setLevelWire(lvl, e.target.value)}
							/>
						</Field>
					))}
				</div>
			) : null}
			{/* v0.6.0：高级兼容性（compat）。只列当前协议 offer 的字段，三态避免误覆盖目录值 */}
			<FormHead
				title={`高级兼容性（compat${providerApi ? " · " + providerApi : ""}）`}
				size={13}
				style={{ marginTop: 10 }}
				trailing={<Button size="sm" onClick={() => setCompatOpen((v) => !v)}>{compatOpen ? "收起" : "展开"}</Button>}
			/>
			<Hint>
				每项三态：「跟随」= 不写该键，由内置目录或 pi-ai 自动探测决定；「开 / 关」= 强制指定。
				写错协议专属字段会导致整个提供商保存失败，所以这里只列出本协议支持的字段。
			</Hint>
			{compatOpen ? (
				<div style={{ marginTop: 6 }}>
					{compatFields.length === 0 ? (
						<Hint>
							{providerApi
								? "当前协议没有可配置的兼容开关。"
								: "该提供商没有显式声明 API 协议（跟随内置目录，各模型协议可能不同），因此不提供协议专属开关。要配置请先在「编辑提供商」里选定协议。"}
						</Hint>
					) : compatFields.map((f) => {
						const v = compatTri[f.key] ?? ""
						return (
							<div key={f.key} style={{ marginTop: 8 }}>
								<Row gap={6}>
									<span className="dpk-formtitle" style={{ fontSize: 12 }}>{f.label}</span>
									<Mono>{f.key}</Mono>
									<Spacer />
									{/* 三态：跟随 / 开 / 关（枚举与 JSON 没有"关"，用输入框 + 清空按钮） */}
									{f.kind === "bool" ? (
										<React.Fragment>
											<Button size="sm" variant={v === "" ? "primary" : "neutral"} onClick={() => setTri(f.key, "")}>跟随</Button>
											<Button size="sm" variant={v === "true" ? "primary" : "neutral"} onClick={() => setTri(f.key, "true")}>开</Button>
											<Button size="sm" variant={v === "false" ? "primary" : "neutral"} onClick={() => setTri(f.key, "false")}>关</Button>
										</React.Fragment>
									) : (
										<Button size="sm" variant={v === "" ? "primary" : "neutral"} onClick={() => setTri(f.key, "")}>跟随</Button>
									)}
								</Row>
								{f.kind === "enum" ? (
									<Select value={v} onChange={(e) => setTri(f.key, e.target.value)}>
										<option value="">（跟随目录 / 自动探测）</option>
										{f.options!.map((o) => <option key={o} value={o}>{o}</option>)}
									</Select>
								) : null}
								{f.kind === "json" && v !== "" ? (
									<Input value={v} onChange={(e) => setTri(f.key, e.target.value)} placeholder='{"enable_thinking": true}' />
								) : null}
								{f.kind === "json" && v === "" ? (
									<Button size="sm" onClick={() => setTri(f.key, "{}")}>填写 JSON</Button>
								) : null}
								{f.hint ? <Hint>{f.hint}</Hint> : null}
							</div>
						)
					})}
				</div>
			) : null}
			{err ? <FormError>{err}</FormError> : null}
			<FormOps>
				<Button onClick={onDone}>取消</Button>
				<Button variant="primary" onClick={submit}>{isEdit ? "保存" : "添加"}</Button>
			</FormOps>
		</div>
	)
}

// ---------- 设置页独立导航（React 页面宿主） ----------
function ModelCapSection() {
	const [providers, setProviders] = React.useState<Record<string, any>>(() => getProviders())
	const [disabledStore, setDisabledStore] = React.useState<Record<string, any>>(() => getDisabledStore())
	const [form, setForm] = React.useState<any>(null)
	// v0.6.0：banner 带作用域。页面级显示在顶部，provider 级显示在该卡片内 ——
	// 之前只在顶部，用户在卡片中部点删除时看不到提示，误以为"点了没反应"。
	const [banner, setBannerRaw] = React.useState<{ text: string; scope: string } | null>(null)
	const setBanner = React.useCallback((text: string | null, scope = "page") => {
		setBannerRaw(text ? { text, scope } : null)
	}, [])
	// 删除到 0 时的「三选一」提示（v0.6.0）
	const [lastModel, setLastModel] = React.useState<{ provider: string } | null>(null)
	const [pull, setPull] = React.useState<any>(null)
	const [listOpen, setListOpen] = React.useState<Record<string, boolean>>({})
	const [test, setTest] = React.useState<Record<string, TestState>>({})
	const [checks, setChecks] = React.useState<Record<string, boolean>>({})
	const [q, setQ] = React.useState("")
	// 官方内置目录里的路由名（v0.6.0）：用来区分「模型由目录接管」与「自己声明的空列表」。
	// ⚠️ 不能用 `p.models === undefined` 判断 —— 官方 schemastery 会把缺省字段归一成 `[]`，
	//   快照里永远拿不到 undefined（实测 anthropic 卡片因此误显示「0 个模型 / 暂无模型」）。
	const [catalogRoutes, setCatalogRoutes] = React.useState<Set<string>>(() => new Set())
	React.useEffect(() => {
		let alive = true
		actionListPresets()
			.then((list) => { if (alive) setCatalogRoutes(new Set(list.map((x: any) => x.provider))) })
			.catch(() => { /* 目录拉不到就退化为「不标跟随」，不影响其余功能 */ })
		return () => { alive = false }
	}, [])

	const refresh = React.useCallback(() => {
		setProviders(getProviders())
		setDisabledStore(getDisabledStore())
	}, [])
	// 归档命名空间是异步解析的（resolveCapsNs）；capsTick 让解析完成后重跑下面的效应，
	// 补上对 capsScope 的订阅并重读禁用区
	const [capsTick, setCapsTick] = React.useState(0)
	React.useEffect(() => capsBus.on(() => setCapsTick((n) => n + 1)), [])
	React.useEffect(() => {
		if (!llmScope) return
		refresh()
		const un1 = llmScope.subscribe(refresh)
		const un2 = capsScope ? capsScope.subscribe(refresh) : null
		return () => { un1?.(); un2?.() }
	}, [refresh, capsTick])

	// 打开表单前记住列表的滚动位置：表单与列表共用同一个滚动容器，切换会把位置重置到顶部
	// （用户实测痛点：从列表深处点「编辑」，返回后跳回顶部，还得重新往下翻）
	const rootRef = React.useRef<HTMLDivElement | null>(null)
	const scrollRef = React.useRef<HTMLElement | null>(null)
	const savedTop = React.useRef(0)
	React.useEffect(() => {
		let el: HTMLElement | null = rootRef.current?.parentElement ?? null
		while (el) {
			const oy = getComputedStyle(el).overflowY
			if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight) { scrollRef.current = el; return }
			el = el.parentElement
		}
		scrollRef.current = (document.scrollingElement as HTMLElement | null) ?? null
	}, [])
	React.useLayoutEffect(() => {
		if (form === null && scrollRef.current) scrollRef.current.scrollTop = savedTop.current
	}, [form])
	const openForm = React.useCallback((f: any) => {
		savedTop.current = scrollRef.current?.scrollTop ?? 0
		setForm(f)
	}, [])

	// ---- 测试（单模型 / 全量串行，测试中每秒刷新已耗时） ----
	const runTest = React.useCallback((providerName: string, modelId: string) => {
		const key = testKey(providerName, modelId)
		const startedAt = Date.now()
		setTest((t) => ({ ...t, [key]: { status: "testing", startedAt, elapsed: 0 } }))
		const timer = setInterval(() => {
			setTest((t) => {
				const cur = t[key]
				if (!cur || cur.status !== "testing") { clearInterval(timer); return t }
				return { ...t, [key]: { ...cur, elapsed: Date.now() - startedAt } }
			})
		}, 1000)
		return fetch("/api/model-cap/test", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ provider: providerName, model: modelId }),
		})
			.then(async (r) => {
				clearInterval(timer)
				let body: any = null
				try { body = await r.json() } catch { /* 非 JSON（404 页等） */ }
				if (!body) throw new Error(`接口异常（HTTP ${r.status}，若刚改过代码请重启服务）`)
				if (body.ok) setTest((t) => ({ ...t, [key]: { status: "ok", latencyMs: body.latencyMs } }))
				else {
					setTest((t) => ({ ...t, [key]: { status: "fail", error: body.error || "未知错误" } }))
					setBanner(`测试失败 · ${providerName}/${modelId}：${body.error || "未知错误"}`, providerName)
				}
			})
			.catch((e) => {
				clearInterval(timer)
				setTest((t) => ({ ...t, [key]: { status: "fail", error: e?.message } }))
				setBanner(`测试失败 · ${providerName}/${modelId}：${e?.message ?? String(e)}`, providerName)
			})
	}, [setBanner])

	const runAllTests = React.useCallback(async (providerName: string) => {
		const models = getProviders()[providerName]?.models ?? []
		// 逐个串行跑（避免瞬间并发轰炸网关），每完成一个行内状态即刷新
		for (const m of models) await runTest(providerName, m.id)
	}, [runTest])

	// ---- 复选框 / 批量删除 ----
	const checkOf = React.useCallback((key: string) => checks[key] === true, [checks])
	const toggleCheck = React.useCallback((provider: string, modelId: string) => {
		setChecks((c) => {
			const k = testKey(provider, modelId)
			const next = { ...c }
			if (next[k]) delete next[k]
			else next[k] = true
			return next
		})
	}, [])
	const clearChecks = React.useCallback((provider: string, ids: string[]) => {
		setChecks((c) => {
			const next = { ...c }
			for (const id of ids) delete next[testKey(provider, id)]
			return next
		})
	}, [])
	const selectAllVisible = React.useCallback((provider: string, visible: any[]) => {
		const allSel = visible.every((m) => checkOf(testKey(provider, m.id)))
		setChecks((c) => {
			const next = { ...c }
			for (const m of visible) {
				const k = testKey(provider, m.id)
				if (allSel) delete next[k]
				else next[k] = true
			}
			return next
		})
	}, [checkOf])
	const batchDelete = React.useCallback(async (provider: string) => {
		const ids = (getProviders()[provider]?.models ?? []).filter((m) => checkOf(testKey(provider, m.id))).map((m) => m.id)
		if (!ids.length) return
		try {
			await actionRemoveModels(provider, ids)
			clearChecks(provider, ids)
			setBanner(null)
			setLastModel(null)
			toast(`已删除 ${ids.length} 个模型`, "success")
		} catch (e: any) {
			// v0.6.0：删到 0 → 不是"失败"，是"规则限制"，弹三选一引导用户走对路
			if (e?.code === "LAST_MODEL") {
				setBanner(null)
				setLastModel({ provider })
				return
			}
			setBanner("批量删除失败：" + (e?.message ?? e), provider)
		}
	}, [checkOf, clearChecks, setBanner])

	const names = Object.keys(providers).sort()
	// 归档中且不在启用列表的路由（官方 caps 界面也可能写过归档，两边对账）
	const disabledRoutes = Object.keys(disabledStore).filter((r) => !providers[r]).sort()
	// 中转站模式：禁用的提供商仍显示在原排序位置（顺序不随启停变化），只是配置冻结只读
	const allNames = [...names, ...disabledRoutes].sort()

	// 全局搜索：过滤提供商（名/Base URL）与模型（ID/显示名）
	const ql = q.trim().toLowerCase()
	const matchProvider = (name: string, p: any) => !ql || name.toLowerCase().includes(ql) || String(p?.baseURL ?? "").toLowerCase().includes(ql)
	const filterModels = (ms: any[]) => !ql ? ms : ms.filter((m) =>
		String(m?.id ?? "").toLowerCase().includes(ql) || String(m?.name ?? "").toLowerCase().includes(ql)
	)
	const visibleNames = allNames.filter((name) => matchProvider(name, providers[name] ?? disabledStore[name]?.profile))

	const toggleProvider = React.useCallback((route: string, isOn: boolean) => {
		setBanner(null)
		const action = isOn ? actionDisableProvider(route) : actionEnableProvider(route)
		action
			.then(() => toast(isOn ? `已禁用 ${route}（配置已归档，随时可恢复）` : `已启用 ${route}`, "success"))
			.catch((e) => setBanner((isOn ? "禁用" : "启用") + "失败：" + (e?.message ?? e), route))
	}, [setBanner])

	return (
		<div className="dpk-page-pad" ref={rootRef}>
			{/* v0.6.0：页面级提示留在顶部；provider 级提示渲染在对应卡片内（否则用户在卡片中部看不到） */}
			{banner && banner.scope === "page" ? <Banner>{banner.text}</Banner> : null}
			{form ? (
				<Card className="dpk-card-raise">
					{form.mode === "addProvider" || form.mode === "editProvider" ? (
						<ProviderForm key={form.mode + (form.provider ?? "")} mode={form.mode} provider={form.provider} onDone={() => setForm(null)} />
					) : (
						<ModelForm key={form.mode + (form.provider ?? "") + (form.modelId ?? "")} mode={form.mode} provider={form.provider} modelId={form.modelId} onDone={() => setForm(null)} />
					)}
				</Card>
			) : (
				<React.Fragment>
					<div className="dpk-page-head">
						<span className="dpk-page-title">模型与提供商</span>
						<Spacer />
						<Button variant="primary" onClick={() => openForm({ mode: "addProvider" })}>＋ 新增提供商</Button>
					</div>
					<div className="dpk-page-desc">
						提供商 = 请求地址 + 凭据 + 协议；模型挂在提供商下，识图能力按模型声明，保存即热生效。连通测试超时 60 秒，慢模型会显示真实延迟。
					</div>
					<Hint style={{ marginBottom: 8 }}>
						定位：本页是<b>高级管理台</b>（测试 / 批量 / 禁用 / 排序 / 彻底删除）；日常换模型、设推理档位也可用官方「设置 → 模型」页，两边读写同一份配置、互通。
					</Hint>
					<div style={{ maxWidth: 360, marginBottom: 10 }}>
						<SearchInput placeholder="搜索提供商或模型（名称 / Base URL / 模型 ID）…" value={q} onChange={(e) => setQ(e.target.value)} />
					</div>
					{allNames.length === 0 ? (
						<Loading>还没有任何提供商，点右上「新增提供商」</Loading>
					) : visibleNames.length === 0 ? (
						<Loading>没有匹配「{q}」的提供商或模型</Loading>
					) : visibleNames.map((name) => {
						const isOff = !providers[name]
						// 禁用态从归档取 profile（数据已搬走，仅渲染用）
						const p = isOff ? (disabledStore[name]?.profile ?? {}) : providers[name]
						const models = p.models ?? []
						// 列表为空时该路由到底有没有模型，快照里看不出来：
						// 官方 schemastery 把「省略 models」和「models: []」都归一成 []，
						// 前者回退内置目录（有模型），后者是声明空列表（无模型，宿主会拒绝）。
						// 所以只陈述「当前没列出模型」，再按是否内置厂商给两条不同出路，不做来源断言。
						const catalogKnownRoute = catalogRoutes.has(name)
						const open = listOpen[name] === true
						const allVision = models.length > 0 && models.every(hasVision)
						// 先按搜索过滤，再分页：折叠时显示前 5 个匹配项，展开显示全部匹配项
						const filteredModels = filterModels(models)
						const visible = open ? filteredModels : filteredModels.slice(0, MODEL_PAGE)
						const selCount = models.filter((m) => checkOf(testKey(name, m.id))).length
						const allVisibleSel = visible.length > 0 && visible.every((m) => checkOf(testKey(name, m.id)))
						return (
								<Card key={name} className="dpk-card-raise" style={isOff ? { opacity: 0.6 } : undefined}>
									<div className="dpk-card-head">
										<span className="dpk-card-name">{name}</span>
										{allVision ? <Pill className="dpk-pill-brand">识图路由</Pill> : <Pill>{protoLabel(p.api)}</Pill>}
										{isOff ? <Pill>已禁用</Pill> : null}
										<Spacer />
										<Switch checked={!isOff} onChange={(v: boolean) => toggleProvider(name, !v)} />
										{isOff ? (
											<ConfirmButton confirmText="归档将一并删除，确认？" onConfirm={() => {
												setBanner(null)
												actionPurgeDisabled(name)
													.then(() => toast(`已彻底删除 ${name}`, "success"))
													.catch((e) => setBanner("删除失败：" + (e?.message ?? e), name))
											}}>彻底删除</ConfirmButton>
										) : (
											<React.Fragment>
												<Button size="sm" onClick={() => openForm({ mode: "editProvider", provider: name })}>编辑</Button>
												<ConfirmButton confirmText="绑定会话将失效，确认？" onConfirm={() => {
													setBanner(null)
													clearChecks(name, models.map((m) => m.id))
													actionDeleteProvider(name)
														.then(() => toast(`已删除提供商 ${name}`, "success"))
														.catch((e) => setBanner("删除失败：" + (e?.message ?? e), name))
												}}>删除</ConfirmButton>
											</React.Fragment>
										)}
									</div>
									<div className="dpk-card-meta-wrap">
										base_url · <Mono>{p.baseURL ?? "—"}</Mono> · {models.length === 0 ? "未列出模型" : `${models.length} 个模型`} · Key 由 {p.apiKeyEnv ?? "—"} 提供
										{retrySummary(p) ? <span> · <Mono>{retrySummary(p)}</Mono></span> : null}
									</div>
									{/* v0.6.0：provider 级提示就近渲染（在这个卡片里操作出错，提示就在这里，不再跑到页面顶部看不见） */}
									{banner && banner.scope === name ? <Banner style={{ margin: "0 0 8px" }}>{banner.text}</Banner> : null}
									{/* v0.6.0：删到 0 时给出可执行路径（不替用户自动兜底） */}
									{lastModel && lastModel.provider === name ? (
										<Banner style={{ margin: "0 0 8px" }}>
											<b>已拦下：这是该提供商的最后一个模型。</b>
											<div style={{ marginTop: 4 }}>
												自定义路由不能「声明空列表」。「恢复默认」是删掉字段让网关按地址自动提供目录，只有内置目录已知的路由才能回退；自建网关没有目录可回退。
											</div>
											<Row gap={6} style={{ marginTop: 8 }}>
												<Button size="sm" onClick={() => setLastModel(null)}>保留一个模型</Button>
												<Button size="sm" variant="soft" onClick={() => {
													clearChecks(name, models.map((m) => m.id))
													actionResetModels(name)
														.then(() => { setLastModel(null); toast(`已恢复默认模型目录（${name}）`, "success") })
														.catch((e) => setBanner("恢复失败：" + (e?.message ?? e), name))
												}}>改用「恢复默认」</Button>
												<Button size="sm" variant="danger" onClick={() => {
													setLastModel(null)
													clearChecks(name, models.map((m) => m.id))
													actionDeleteProvider(name)
														.then(() => toast(`已删除提供商 ${name}`, "success"))
														.catch((e) => setBanner("删除失败：" + (e?.message ?? e), name))
												}}>删除整个提供商</Button>
											</Row>
										</Banner>
									) : null}
									{isOff ? (
										<div className="dpk-panel">
											{models.length === 0 ? (
												<Loading>暂无模型</Loading>
											) : (
												<React.Fragment>
													{visible.map((m) => (
														<ModelRow key={m.id} provider={name} m={m} ro checked={false}
															onTest={() => {}} onEdit={() => {}} onDelete={() => {}} onToggleCheck={() => {}} />
													))}
													{models.length > MODEL_PAGE ? (
														<div className="dpk-footlink" onClick={() => setListOpen((o) => ({ ...o, [name]: !open }))}>
															{open ? "收起" : `展开全部（${models.length} 个）`}
														</div>
													) : null}
												</React.Fragment>
											)}
										</div>
									) : (
									<div className="dpk-panel">
									<div className="dpk-panel-head">
										<PanelActions>
											{models.length ? <Button size="sm" onClick={() => { runAllTests(name).catch(() => {}) }}>全量测试</Button> : null}
											<Button size="sm" onClick={() => {
												if (pull && pull.provider === name) { setPull(null); return }
												actionPullModels(name)
													.then((res) => { setBanner(null); setPull({ provider: name, models: res.all, existing: res.existing }) })
													.catch((e) => setBanner("拉取失败：" + (e?.message ?? e), name))
											}}>{pull && pull.provider === name ? "收起" : "拉取模型"}</Button>
											<Button size="sm" onClick={() => openForm({ mode: "addModel", provider: name })}>手动添加</Button>
											<ConfirmButton confirmText="模型列表会从配置中移除（不是设为空），网关将按地址自动提供目录，确认？" disabled={models.length === 0} onConfirm={() => {
												setBanner(null)
												clearChecks(name, models.map((m) => m.id))
												actionResetModels(name)
													.then(() => toast(`已恢复默认模型目录（${name}）`, "success"))
													.catch((e) => setBanner("恢复失败：" + (e?.message ?? e), name))
											}}>恢复默认</ConfirmButton>
											<Button size="sm" disabled={visible.length === 0} onClick={() => selectAllVisible(name, visible)}>
											{allVisibleSel ? "取消全选" : "全选"}
										</Button>
											<ConfirmButton confirmText={`删除 ${selCount} 个？`} disabled={selCount === 0} onConfirm={() => batchDelete(name)}>
												删除（{selCount}）
											</ConfirmButton>
										</PanelActions>
									</div>
									{pull && pull.provider === name ? (
										<PullPanel
											models={pull.models}
											existing={pull.existing}
											onJoin={(chosen) => {
												actionAddPulled(name, chosen)
													.then(() => { setPull(null); setBanner(null); toast(`已加入 ${chosen.length} 个模型`, "success") })
													.catch((e) => setBanner("加入失败：" + (e?.message ?? e), name))
											}}
										/>
									) : null}
									{visible.map((m) => {
										const idx = models.findIndex((x) => x.id === m.id)
										return (
										<ModelRow key={m.id} provider={name} m={m} t={test[testKey(name, m.id)]}
											index={idx}
											onReorder={(fromId: string, toIndex: number, side: "top" | "bottom") => {
												const from = models.findIndex((x) => x.id === fromId)
												if (from < 0) return
												// 先按"插到目标行的前/后"算目标下标，再补偿被拖走那一项造成的左移
												let insert = side === "top" ? toIndex : toIndex + 1
												if (from < insert) insert -= 1
												if (insert === from) return
												actionMoveModelTo(name, fromId, insert)
													.then(() => { setBanner(null); setListOpen((o) => ({ ...o, [name]: true })) })
													.catch((e) => setBanner("排序失败：" + (e?.message ?? e), name))
											}}
											checked={checkOf(testKey(name, m.id))}
											onTest={() => runTest(name, m.id)}
											onEdit={() => openForm({ mode: "editModel", provider: name, modelId: m.id })}
											onDelete={() => {
												setBanner(null)
												clearChecks(name, [m.id])
												actionDeleteModel(name, m.id)
													.then(() => toast(`已删除模型 ${m.id}`, "success"))
													.catch((e: any) => {
														// 单模型删除同样会命中「至少保留一个」规则 → 用同一套三选一
														if (e?.code === "LAST_MODEL") { setLastModel({ provider: name }); return }
														setBanner("删除失败：" + (e?.message ?? e), name)
													})
											}}
											onToggleCheck={() => toggleCheck(name, m.id)} />
										)
									})}
									{/* v0.6.0：列表为空时给出与「是否内置厂商」匹配的出路（不做来源断言，详见上方注释） */}
									{models.length === 0 ? (
										<Loading>
											{catalogKnownRoute
												? "未列出模型。这是内置厂商：留空即由内置目录提供模型；若要固定清单请「拉取模型」或「手动添加」。"
												: "暂无模型，点「拉取模型」或「手动添加」"}
										</Loading>
									) : models.length > MODEL_PAGE ? (
										<div className="dpk-footlink" onClick={() => setListOpen((o) => ({ ...o, [name]: !open }))}>
											{open ? "收起" : `展开全部（${models.length} 个）`}
										</div>
									) : null}
										</div>
									)}
								</Card>
							)
						})}
				</React.Fragment>
			)}
		</div>
	)
}

// ---------- apply ----------
export function apply(ctx: any) {
	installStyle()
	// 开发期建议：异常红框浮层（按插件 id 过滤，发布版可删这一行）
	installDebugOverlay(NS)
	// 0.1.7 cohort 起官方把设置绑定服务改名为 webUiSettings（旧 seat 名 settingsScope 不再作为服务暴露，
	// 只剩对象上的 getter 别名）。这里用响应式嵌套 inject 等它就绪——不能用 ctx.get 快照，
	// 那会在服务尚未提供时直接取空；也不能写进 exports.inject，硬声明会让整条条目 pending 不激活。
	ctx.inject(["webUiSettings", "slots", "remote"], (sctx: any) => {
		const binder = sctx.webUiSettings
		llmScope = binder.bind({ namespace: LLM_NS })
		REMOTE = sctx.remote
		void resolveCaps(binder)
		// 独立设置页（设置侧边栏"提供商配置"导航项）：注册包在 ctx.inject 里等服务就绪再挂
		sctx.slots.inject("settings.section", () => sctx.slots.register({
			name: "settings.section",
			id: "modelcap",
			order: 12,
			label: () => "提供商配置",
			inject: () => ({}),
		}, ModelCapSection))
	})
}

// 浏览器半边依赖声明：用到哪个 remote 子命名空间就逐个写上（漏声明 = 运行时报 cannot get property "remote.X" without inject）
// 注意：设置绑定服务（webUiSettings）刻意不写进来——新版由官方按需提供，硬声明会让条目 pending
export const inject = ["slots", "remote", "remote.settings", "remote.credentials", "remote.llm"]