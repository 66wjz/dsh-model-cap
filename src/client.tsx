// dsh-model-cap — browser half（React 轨）
// 定位：替代官方"模型"页的完整管理界面（提供商增删改 + Key 凭据 + 模型增删/批量删 + 识图能力 + 拉取模型）。
// 数据流全部走官方 remote：settings.mutate（ops + revision 栅栏）+ credentials.set + llm.discoverModels。
// 写策略：读改写整个 providers 对象（单 set op），revision 由 llmScope 快照提供，冲突自动恢复重读；
// 写入前做 undefined 清理（避免 settings/mutate rejected "ops"），编辑模型合并写入保留 compat 等表单外字段。
// 组件与样式全部来自模板 dsh-react-kit（dsh-react-kit/client external），本插件不再自带 amc-* 样式。
import * as React from "react"
import {
	Button, Card, Checkbox, Chip, Field, Input, Pill, Select, StateBadge, Switch,
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

type TestState = { status: "testing"; startedAt: number; elapsed?: number } | { status: "ok"; latencyMs: number } | { status: "fail"; error: string }

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
			throw new Error(`"${providerName}" 的模型将全部删空。自定义提供商必须至少保留一个模型，如需清空请直接「删除」整个提供商。`)
		}
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
	// 首个模型也可留空：只有内置目录已描述的路由允许 0 模型（llm-pi-ai 会用目录带出模型）
	await writeProviders((providers) => {
		if (providers[f.name]) throw new Error(`提供商 "${f.name}" 已存在`)
		providers[f.name] = {
			displayName: f.displayName || f.name,
			api: f.api,
			baseURL: f.baseURL,
			apiKeyEnv: deriveKeyRef(f.name),
			models: f.firstModelId ? [{
				id: f.firstModelId,
				name: f.firstModelName || f.firstModelId,
				contextWindow: f.contextWindow || undefined,
				maxTokens: f.maxTokens || undefined,
				input: f.vision ? VISION : ["text"],
			}] : [],
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
		p.displayName = fields.displayName || name
		p.baseURL = fields.baseURL
		p.api = fields.api
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
		providers[providerName].models = list
		return providers
	})
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
/** 恢复默认模型：删除整个 models 字段，让适配器回退到网关动态目录（与官方模型页 resetModels 同语义） */
async function actionResetModels(providerName: string) {
	await writeProviders((providers) => {
		const p = providers[providerName]
		if (!p) throw new Error(`提供商 "${providerName}" 不存在`)
		delete p.models
		return providers
	})
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
					<span className="dpk-mono">{m.id}</span> · {fmtNum(m.contextWindow)} ctx · {fmtNum(m.maxTokens)} out · {hasVision(m) ? "识图" : "文本"}{effortsLabel(m) ? " · " + effortsLabel(m) : ""}
				</div>
				{t?.status === "fail" ? <div className="dpk-merr"><b>失败：</b>{t.error}</div> : null}
				{t?.status === "ok" && (t.latencyMs ?? 0) >= 10000 ? <div className="dpk-hint">通过 {fmtLatency(t.latencyMs)} · 网关首字节慢，日常对话可用，介意延迟可换路由</div> : null}
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
				<span className="dpk-hint">{hint}</span>
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
	const [api, setApi] = React.useState(p.api ?? "openai-completions")
	const [baseURL, setBaseURL] = React.useState(p.baseURL ?? "")
	const [apiKey, setApiKey] = React.useState("")
	const [firstModelId, setFirstModelId] = React.useState("")
	const [vision, setVision] = React.useState(false)
	const [err, setErr] = React.useState<string | null>(null)

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
					actionSaveProviderEdits(provider!, {
						displayName: displayName.trim(), api, baseURL: baseURL.trim(), apiKey,
					})
						.then(() => { toast(`已保存提供商 ${provider}`, "success"); onDone() }).catch(fail)
				} else {
				const n = name.trim()
				if (!/^[a-z0-9][a-z0-9-]*$/.test(n)) throw new Error("路由名称请用小写字母/数字/连字符（如 my-gateway）")
				// API Key 可留空（本地模型/免鉴权网关）；留空时不写凭据库，但保留 Key 引用名以便日后补填
				// 首个模型也可留空（仅内置目录已知的路由有效；未知路由由 actionAddProvider 翻成人话报错）
				actionAddProvider({
					name: n, displayName: displayName.trim(), baseURL: baseURL.trim(), api,
					apiKey: apiKey.trim(), firstModelId: firstModelId.trim(), firstModelName: "", vision,
				})
					.then(() => { toast(`已添加提供商 ${n}`, "success"); onDone() }).catch(fail)
			}
		} catch (e: any) { fail(e) }
	}

	return (
		<div>
			<div className="dpk-formhead">
				<Button size="sm" onClick={onDone}>← 返回</Button>
				<span className="dpk-formtitle">{isEdit ? `编辑提供商 · ${provider}` : "新增提供商"}</span>
			</div>
			<div className="dpk-formhint">提供商 = 请求地址 + 凭据 + 协议；Key 写入凭据库，保存即热生效。</div>
			{!isEdit ? (
				<Field label="路由名称（小写字母/数字/连字符）">
					<Input value={name} onChange={(e) => setName(e.target.value)} placeholder="my-gateway" />
				</Field>
			) : null}
			<Field label="显示名称">
				<Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="与路由名称相同可留空" />
			</Field>
			<Field label="API 协议">
				<Select value={api} onChange={(e) => setApi(e.target.value)}>
					{PROTOCOLS.map((x) => <option key={x.v} value={x.v}>{x.label}</option>)}
				</Select>
			</Field>
			<Field label="Base URL">
				<Input value={baseURL} onChange={(e) => setBaseURL(e.target.value)} placeholder="https://…/v1" />
			</Field>
			{!isEdit ? (
				<React.Fragment>
					<Field label="API Key（可留空）">
						<Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-…（本地模型/免鉴权网关可留空）" />
					</Field>
					<Field label="首个模型 ID（可留空）">
						<Input value={firstModelId} onChange={(e) => setFirstModelId(e.target.value)} placeholder="deepseek-v4-flash" />
					</Field>
					<div className="dpk-hint">模型 ID 留空只对「内置目录已知的路由」有效（目录会自动带出模型）；自建路由必须至少列一个，否则宿主会拒绝。</div>
					<div className="dpk-row">
						<Switch checked={vision} onChange={setVision} />
						<span className="dpk-hint">该模型支持识图？</span>
					</div>
				</React.Fragment>
			) : (
				<React.Fragment>
					<Field label="API Key（可选，留空保持不变）">
						<Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={p.apiKeyEnv ? "留空 = 沿用当前 Key" : "sk-…"} />
					</Field>
					<div className="dpk-hint">Key 引用：{p.apiKeyEnv ?? "—"}；凭据库覆盖即热生效，无需重启。</div>
				</React.Fragment>
			)}
			{null}
			<div className="dpk-formops">
				<Button onClick={onDone}>取消</Button>
				<Button variant="primary" onClick={submit}>{isEdit ? "保存" : "创建"}</Button>
			</div>
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
		const entry = {
			id: finalId,
			name: display.trim() || finalId,
			contextWindow: Number(ctx) || undefined,
			maxTokens: Number(max) || undefined,
			input: vision ? VISION : ["text"],
			reasoningEfforts,
		}
		const fail = (e: any) => { const m = e?.message ?? String(e); setErr(m); toast(m, "error") }
		if (isEdit) actionUpdateModel(provider, modelId!, entry).then(() => { toast(`已保存模型 ${finalId}`, "success"); onDone() }).catch(fail)
		else actionAddModel(provider, entry).then(() => { toast(`已添加模型 ${finalId}`, "success"); onDone() }).catch(fail)
	}

	return (
		<div>
			<div className="dpk-formhead">
				<Button size="sm" onClick={onDone}>← 返回</Button>
				<span className="dpk-formtitle">{isEdit ? `编辑模型 · ${modelId}` : `添加模型 · ${provider}`}</span>
			</div>
			<div className="dpk-formhint">模型 ID 发给网关，创建后不可改；显示名称只影响本页展示。改完保存即热生效。</div>
			<Field label={"模型 ID" + (isEdit ? "（不可改）" : "")}>
				<Input value={id} disabled={isEdit} onChange={(e) => setId(e.target.value)} placeholder="deepseek-v4-flash" />
			</Field>
			<Field label="显示名称（可留空）">
				<Input value={display} onChange={(e) => setDisplay(e.target.value)} placeholder="GLM-5.3 Flash" />
			</Field>
			<div className="dpk-row">
				<Field label="上下文窗口">
					<Input type="number" min="1" value={ctx} onChange={(e) => setCtx(e.target.value)} placeholder="1000000" />
				</Field>
				<Field label="最大输出">
					<Input type="number" min="1" value={max} onChange={(e) => setMax(e.target.value)} placeholder="131072" />
				</Field>
			</div>
			<div className="dpk-switch-row">
				<Switch checked={vision} onChange={setVision} />
				<span className="dpk-hint">识图能力（图片输入）：开启后该模型可接收图片输入</span>
			</div>
			<div className="dpk-formhead" style={{ marginTop: 10 }}>
				<span className="dpk-formtitle" style={{ fontSize: 13 }}>推理档位（reasoningEfforts）</span>
			</div>
			<div className="dpk-row" style={{ gap: 6 }}>
				<Button size="sm" variant={effortsMode === "inherit" ? "primary" : "neutral"} onClick={() => setEffortsMode("inherit")}>不声明</Button>
				<Button size="sm" variant={effortsMode === "none" ? "primary" : "neutral"} onClick={() => setEffortsMode("none")}>无推理</Button>
				<Button size="sm" variant={effortsMode === "levels" ? "primary" : "neutral"} onClick={() => setEffortsMode("levels")}>声明档位</Button>
				{effortsMode === "levels" ? <Button size="sm" onClick={applyPreset}>一键填满档位</Button> : null}
			</div>
			{effortsMode === "inherit" ? <div className="dpk-hint">跟随内置目录声明；自定义模型没有目录可跟随，等同无推理。不写 reasoningEfforts 字段。</div> : null}
			{effortsMode === "none" ? <div className="dpk-hint">声明该模型不参与推理（reasoningEfforts: false），模型选择器不再提供思考档位。</div> : null}
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
			{null}
			<div className="dpk-formops">
				<Button onClick={onDone}>取消</Button>
				<Button variant="primary" onClick={submit}>{isEdit ? "保存" : "添加"}</Button>
			</div>
		</div>
	)
}

// ---------- 设置页独立导航（React 页面宿主） ----------
function ModelCapSection() {
	const [providers, setProviders] = React.useState<Record<string, any>>(() => getProviders())
	const [disabledStore, setDisabledStore] = React.useState<Record<string, any>>(() => getDisabledStore())
	const [form, setForm] = React.useState<any>(null)
	const [banner, setBanner] = React.useState<string | null>(null)
	const [pull, setPull] = React.useState<any>(null)
	const [listOpen, setListOpen] = React.useState<Record<string, boolean>>({})
	const [test, setTest] = React.useState<Record<string, TestState>>({})
	const [checks, setChecks] = React.useState<Record<string, boolean>>({})
	const [q, setQ] = React.useState("")

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
					setBanner(`测试失败 · ${providerName}/${modelId}：${body.error || "未知错误"}`)
				}
			})
			.catch((e) => {
				clearInterval(timer)
				setTest((t) => ({ ...t, [key]: { status: "fail", error: e?.message } }))
				setBanner(`测试失败 · ${providerName}/${modelId}：${e?.message ?? String(e)}`)
			})
	}, [])

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
			toast(`已删除 ${ids.length} 个模型`, "success")
		} catch (e) {
			setBanner("批量删除失败：" + (e?.message ?? e))
		}
	}, [checkOf, clearChecks])

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
			.catch((e) => setBanner((isOn ? "禁用" : "启用") + "失败：" + (e?.message ?? e)))
	}, [])

	return (
		<div className="dpk-page-pad" ref={rootRef}>
			{banner ? <div className="dpk-banner">{banner}</div> : null}
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
						<span className="dpk-spacer" />
						<Button variant="primary" onClick={() => openForm({ mode: "addProvider" })}>＋ 新增提供商</Button>
					</div>
					<div className="dpk-page-desc">
						提供商 = 请求地址 + 凭据 + 协议；模型挂在提供商下，识图能力按模型声明，保存即热生效。连通测试超时 60 秒，慢模型会显示真实延迟。
					</div>
					<div className="dpk-hint" style={{ marginBottom: 8 }}>
						定位：本页是<b>高级管理台</b>（测试 / 批量 / 禁用 / 排序 / 彻底删除）；日常换模型、设推理档位也可用官方「设置 → 模型」页，两边读写同一份配置、互通。
					</div>
					<div style={{ maxWidth: 360, marginBottom: 10 }}>
						<SearchInput placeholder="搜索提供商或模型（名称 / Base URL / 模型 ID）…" value={q} onChange={(e) => setQ(e.target.value)} />
					</div>
					{allNames.length === 0 ? (
						<div className="dpk-loading">还没有任何提供商，点右上「新增提供商」</div>
					) : visibleNames.length === 0 ? (
						<div className="dpk-loading">没有匹配「{q}」的提供商或模型</div>
					) : visibleNames.map((name) => {
						const isOff = !providers[name]
						// 禁用态从归档取 profile（数据已搬走，仅渲染用）
						const p = isOff ? (disabledStore[name]?.profile ?? {}) : providers[name]
						const models = p.models ?? []
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
										<span className="dpk-spacer" />
										<Switch checked={!isOff} onChange={(v: boolean) => toggleProvider(name, !v)} />
										{isOff ? (
											<ConfirmButton confirmText="归档将一并删除，确认？" onConfirm={() => {
												setBanner(null)
												actionPurgeDisabled(name)
													.then(() => toast(`已彻底删除 ${name}`, "success"))
													.catch((e) => setBanner("删除失败：" + (e?.message ?? e)))
											}}>彻底删除</ConfirmButton>
										) : (
											<React.Fragment>
												<Button size="sm" onClick={() => openForm({ mode: "editProvider", provider: name })}>编辑</Button>
												<ConfirmButton confirmText="绑定会话将失效，确认？" onConfirm={() => {
													setBanner(null)
													clearChecks(name, models.map((m) => m.id))
													actionDeleteProvider(name)
														.then(() => toast(`已删除提供商 ${name}`, "success"))
														.catch((e) => setBanner("删除失败：" + (e?.message ?? e)))
												}}>删除</ConfirmButton>
											</React.Fragment>
										)}
									</div>
									<div className="dpk-card-meta-wrap">
										base_url · <span className="dpk-mono">{p.baseURL ?? "—"}</span> · {models.length} 个模型 · Key 由 {p.apiKeyEnv ?? "—"} 提供
									</div>
									{isOff ? (
										<div className="dpk-panel">
											{models.length === 0 ? (
												<div className="dpk-loading">暂无模型</div>
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
													.catch((e) => setBanner("拉取失败：" + (e?.message ?? e)))
											}}>{pull && pull.provider === name ? "收起" : "拉取模型"}</Button>
											<Button size="sm" onClick={() => openForm({ mode: "addModel", provider: name })}>手动添加</Button>
											<ConfirmButton confirmText="将清空手动配置的模型列表，恢复为网关动态目录，确认？" disabled={models.length === 0} onConfirm={() => {
												setBanner(null)
												clearChecks(name, models.map((m) => m.id))
												actionResetModels(name)
													.then(() => toast(`已恢复默认模型目录（${name}）`, "success"))
													.catch((e) => setBanner("恢复失败：" + (e?.message ?? e)))
											}}>恢复默认</ConfirmButton>
											<Button size="sm" disabled={visible.length === 0} onClick={() => selectAllVisible(name, visible)}>
											{allVisibleSel ? "取消全选" : "全选"}
										</Button>
											<ConfirmButton confirmText={`删除 ${selCount} 个？`} disabled={selCount === 0} onConfirm={() => { batchDelete(name) }}>
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
													.catch((e) => setBanner("加入失败：" + (e?.message ?? e)))
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
													.catch((e) => setBanner("排序失败：" + (e?.message ?? e)))
											}}
											checked={checkOf(testKey(name, m.id))}
											onTest={() => runTest(name, m.id)}
											onEdit={() => openForm({ mode: "editModel", provider: name, modelId: m.id })}
											onDelete={() => {
												setBanner(null)
												clearChecks(name, [m.id])
												actionDeleteModel(name, m.id)
														.then(() => toast(`已删除模型 ${m.id}`, "success"))
														.catch((e) => setBanner("删除失败：" + (e?.message ?? e)))
											}}
											onToggleCheck={() => toggleCheck(name, m.id)} />
										)
									})}
									{models.length === 0 ? (
										<div className="dpk-loading">暂无模型，点「拉取模型」或「手动添加」</div>
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