// dpk-react — 基础组件层（薄封装：样式全部来自 dpk-* 类，见 ./css）
// 与 vanilla 套件（plugins/dsh-plugin-kit）同源的视觉基线；改样式去 css.ts。
import * as React from "react"
import { createPortal } from "react-dom"
import { dpkStyle } from "./css"

// ---------- 样式注入（与 vanilla kit 共用同一个 style id，天然去重） ----------
let styleInjected = false
export function installStyle() {
	// 多个插件共用同一个 style id（dsh-plugin-kit / dsh-react-kit 同源），**先注入的那份会一直占位**。
	// 旧逻辑只判"存在就 return"，导致新样式进了包却不可见（2026-10-10 实测：拖拽落点线规则在包里、页面上却查无此类）。
	// 现在存在时也比对内容：不同就覆盖，谁最后加载谁生效 —— 插件加载顺序里我们（react-kit/model-cap）在后 ✔
	const existing = document.getElementById("dpk-style")
	if (existing) {
		if (existing.textContent !== dpkStyle) existing.textContent = dpkStyle
		styleInjected = true
		return
	}
	if (styleInjected) return
	const s = document.createElement("style")
	s.id = "dpk-style"
	s.textContent = dpkStyle
	document.head.appendChild(s)
	styleInjected = true
}

export function cx(...parts: Array<string | false | null | undefined>) {
	return parts.filter(Boolean).join(" ")
}

// ---------- 控件 ----------
export function Button({
	variant = "default", size, className, children, ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "primary" | "danger" | "soft" | "neutral"; size?: "sm" }) {
	installStyle()
	return <button
		type="button"
		className={cx("dpk-btn", variant !== "default" && `dpk-btn-${variant}`, size === "sm" && "dpk-btn-sm", className)}
		{...rest}
	>{children}</button>
}

export function Input({ className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
	installStyle()
	return <input className={cx("dpk-input", className)} {...rest} />
}

export function Select({ className, children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
	installStyle()
	return <select className={cx("dpk-select", className)} {...rest}>{children}</select>
}

export function Textarea({ className, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
	installStyle()
	return <textarea className={cx("dpk-textarea", className)} {...rest} />
}

export function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
	installStyle()
	return <label className="dpk-switch">
		<input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
		<i />
	</label>
}

// ---------- 展示 ----------
export function Card({ className, children }: { className?: string; children?: React.ReactNode }) {
	installStyle()
	return <div className={cx("dpk-card", className)}>{children}</div>
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
	installStyle()
	return <label className="dpk-field">{label}{children}{hint ? <div className="dpk-field-hint">{hint}</div> : null}</label>
}

export function Empty({ children }: { children: React.ReactNode }) {
	installStyle()
	return <div className="dpk-empty">{children}</div>
}

export function Banner({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
	installStyle()
	return <div className="dpk-banner" style={style}>{children}</div>
}

export function Pill({ className, children }: { className?: string; children: React.ReactNode }) {
	installStyle()
	return <span className={cx("dpk-pill", className)}>{children}</span>
}

/** 复选框（模型行选择 / 批量操作用；label 包裹保证点击区域） */
export function Checkbox({ checked, onChange, children, className }: {
	checked: boolean; onChange: (v: boolean) => void; children?: React.ReactNode; className?: string;
}) {
	installStyle()
	return <label className={cx("dpk-check", className)}>
		<input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
		{children != null ? <span style={{ display: "inline-flex", alignItems: "center" }}>{children}</span> : null}
	</label>
}

/** 搜索输入框（基础组件）：带前缀搜索图标的 Input，统一控件尺寸与图标，业务层禁止用裸 input */
export function SearchInput({ className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
	installStyle()
	return <div className={cx("dpk-searchinput", className)}>
		<svg className="dpk-searchinput-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
			strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
			<circle cx="11" cy="11" r="7" />
			<path d="M20 20l-4-4" />
		</svg>
		<input type="text" {...rest} />
	</div>
}

/** 状态胶囊：idle=灰「未测态」、ok=绿、fail=红、testing=黄（v4 定稿样式） */
export function StateBadge({ state, children, title }: {
	state: "idle" | "ok" | "fail" | "testing"; children: React.ReactNode; title?: string;
}) {
	installStyle()
	return <span className={cx("dpk-state", state !== "idle" && `dpk-state-${state}`)} title={title}>{children}</span>
}

/** 可点选芯片：exist=true 渲染为灰色「已配置」不可点；on 控制选中态（受控） */
export function Chip({ on, exist, onClick, children }: {
	on?: boolean; exist?: boolean; onClick?: () => void; children: React.ReactNode;
}) {
	installStyle()
	return <span
		className={cx("dpk-chip", exist && "dpk-chip-exist", !exist && on && "on")}
		onClick={exist ? undefined : onClick}
	>{children}{exist ? " · 已配置" : null}</span>
}

// ---------- 开发期调试浮层（源自 dsh-model-cap 踩坑：白屏/静默异常定位用，发布可移除） ----------
let debugBox: HTMLPreElement | null = null
function showDebugError(title: string, detail: string) {
	try {
		if (!debugBox || !debugBox.isConnected) {
			debugBox = document.createElement("pre")
			debugBox.style.cssText = "position:fixed;inset:auto 12px 12px 12px;max-height:45vh;overflow:auto;z-index:99999;background:#2b1d1d;color:#ffb4b4;border:1px solid #ec1313;border-radius:8px;padding:10px;font:11px/1.5 monospace;white-space:pre-wrap"
			document.body.appendChild(debugBox)
		}
		debugBox.textContent = `[${title}]\n${detail}`.slice(0, 4000)
	} catch { /* ignore */ }
}
/**
 * 捕获指定插件前缀相关的未捕获异常并红框浮层显示（filter 匹配 stack/message 子串）。
 * 开发期在 client apply 最前面调用一次：installDebugOverlay("my-plugin")。
 */
export function installDebugOverlay(filter: string) {
	installStyle()
	window.addEventListener("error", (ev) => {
		if (!ev.error) return
		const text = String(ev.error.stack ?? ev.error.message ?? "")
		if (text.includes(filter)) showDebugError("未捕获异常", text)
	})
	window.addEventListener("unhandledrejection", (ev) => {
		const text = String((ev.reason as any)?.stack ?? (ev.reason as any)?.message ?? ev.reason ?? "")
		if (text.includes(filter)) showDebugError("未处理的 Promise 拒绝", text)
	})
}

// ---------- 浮动提示（命令式，与 vanilla 套件同款） ----------
let toastWrap: HTMLDivElement | null = null
export function toast(message: string, type: "info" | "success" | "error" = "info", ms = type === "error" ? 5200 : 2600) {
	installStyle()
	if (!toastWrap || !toastWrap.isConnected) {
		toastWrap = document.createElement("div")
		toastWrap.className = "dpk-toastwrap"
		document.body.appendChild(toastWrap)
	}
	const t = document.createElement("div")
	t.className = `dpk-toast dpk-toast-${type}`
	t.textContent = message
	toastWrap.appendChild(t)
	setTimeout(() => {
		t.classList.add("dpk-toast-out")
		setTimeout(() => {
			t.remove()
			if (toastWrap && !toastWrap.childElementCount) { toastWrap.remove(); toastWrap = null }
		}, 220)
	}, ms)
}

// ---------- 二级组件（可复用业务块，建模 model-cap 提供商配置页真实用法） ----------

/** 两段式确认按钮：第一击进入确认态（红底白字 + confirmText），第二击执行 onConfirm；超时自动复原。
 *  破坏性操作（删除等）统一用它，避免各插件各写一套 armed 逻辑。 */
export function ConfirmButton({ confirmText, ms = 2600, disabled, variant = "danger", onConfirm, children, className }: {
	confirmText: string; ms?: number; disabled?: boolean;
	variant?: "default" | "danger"; onConfirm: () => void | Promise<void>;
	children: React.ReactNode; className?: string;
}) {
	installStyle()
	const [armed, setArmed] = React.useState(false)
	const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
	React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
	return <Button
		variant={variant === "default" ? "default" : "danger"}
		size="sm"
		disabled={disabled}
		className={cx(armed && "dpk-btn-armed", className)}
		onClick={() => {
			if (armed) {
				if (timer.current) { clearTimeout(timer.current); timer.current = null }
				setArmed(false)
				// v0.5.0：onConfirm 允许返回 Promise。异步失败由调用方自己 setBanner，
				// 这里兜住残留的 rejection，避免控制台 unhandled rejection
				try {
					const r: any = onConfirm()
					if (r && typeof r.then === "function") r.catch((e: any) => { console.error("[dpk] ConfirmButton onConfirm 失败", e) })
				} catch (e) { console.error("[dpk] ConfirmButton onConfirm 失败", e) }
			} else {
				setArmed(true)
				timer.current = setTimeout(() => { setArmed(false); timer.current = null }, ms)
			}
		}}
	>{armed ? confirmText : children}</Button>
}

/** 面板操作区按钮组：统一尺寸/间距/行内对齐。规范：主操作至多一个 primary，危险操作用 ConfirmButton。 */
export function PanelActions({ children, className, style }: {
	children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
	installStyle()
	return <div className={cx("dpk-toolbar", className)} style={style}>{children}</div>
}

// ---------- 布局与文本（v0.7.0：收敛业务层手写的裸 dpk-* class） ----------
// 背景：client.tsx 曾手写 32 种裸 class、86 处，其中 dpk-hint 18 次 / dpk-row 8 次。
// 这里把最高频的几个包成组件 —— 只替换调用面，样式与观感零变化（css.ts 不动）。

/** 说明文字（灰色小字）：替代 `<div className="dpk-hint">` */
export function Hint({ children, className, style }: {
	children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
	installStyle()
	return <div className={cx("dpk-hint", className)} style={style}>{children}</div>
}

/** 横向布局行：替代 `<div className="dpk-row">` */
export function Row({ children, gap, align, className, style }: {
	children: React.ReactNode; gap?: number; align?: React.CSSProperties["alignItems"];
	className?: string; style?: React.CSSProperties;
}) {
	installStyle()
	const merged: React.CSSProperties = { ...(gap != null ? { gap } : {}), ...(align ? { alignItems: align } : {}), ...style }
	return <div className={cx("dpk-row", className)} style={Object.keys(merged).length ? merged : undefined}>{children}</div>
}

/** 表单区块头：替代 `<div className="dpk-formhead"><span className="dpk-formtitle">…</span>`。
 *  leading 放在标题之前（如「← 返回」按钮），trailing 放在最右（如「展开/收起」）。 */
export function FormHead({ title, size = 14, leading, trailing, style }: {
	title: React.ReactNode; size?: number;
	leading?: React.ReactNode; trailing?: React.ReactNode; style?: React.CSSProperties;
}) {
	installStyle()
	return <div className="dpk-formhead" style={style}>
		{leading}
		<span className="dpk-formtitle" style={{ fontSize: size }}>{title}</span>
		{trailing}
	</div>
}

/** 等宽文本（ID / 地址 / 错误码）：替代 `<span className="dpk-mono">` */
export function Mono({ children }: { children: React.ReactNode }) {
	installStyle()
	return <span className="dpk-mono">{children}</span>
}

/** 弹性撑开：替代 `<span className="dpk-spacer" />` */
export function Spacer() {
	installStyle()
	return <span className="dpk-spacer" />
}

/** 表单级错误：替代 `<div className="dpk-formerr">` */
export function FormError({ children }: { children: React.ReactNode }) {
	installStyle()
	return <div className="dpk-formerr">{children}</div>
}

/** 空态 / 加载态文本：替代 `<div className="dpk-loading">` */
export function Loading({ children }: { children: React.ReactNode }) {
	installStyle()
	return <div className="dpk-loading">{children}</div>
}

/** 表单底部操作区（右对齐）：替代 `<div className="dpk-formops">` */
export function FormOps({ children }: { children: React.ReactNode }) {
	installStyle()
	return <div className="dpk-formops">{children}</div>
}

// ---------- 可搜索组合框（v0.7.0） ----------
export type ComboOption = {
	value: string
	label: string
	/** 次要说明（灰色小字，如 Base URL）；也参与搜索匹配 */
	description?: string
	disabled?: boolean
}
/**
 * 可搜索下拉：替代长列表场景下的原生 `<select>`。
 * 原生 select 的弹出列表由浏览器绘制，无法限高/搜索/过滤 —— 40+ 项必然铺满屏幕。
 *
 * 实现要点：
 * - 弹出层挂到 document.body + position:fixed，避免被父级 overflow 裁剪（设置页容器有滚动）
 * - max-height 限高 + overflow-y:auto，超出即滚动
 * - 顶部搜索框按 label/description 子串过滤，不区分大小写
 * - 点击外部 / Esc / 选中后关闭；打开时自动聚焦搜索框
 * @param value - 当前选中值（空串 = 未选择）
 * @param options - 选项列表
 * @param onChange - 选中回调（传 value）
 * @param placeholder - 未选择时触发区显示的文字
 * @param disabled - 禁用整个控件
 * @param emptyText - 搜索无结果时的提示
 */
export function ComboBox({ value, options, onChange, placeholder = "请选择…", disabled, emptyText = "没有匹配项", className }: {
	value: string; options: ComboOption[]; onChange: (v: string) => void;
	placeholder?: string; disabled?: boolean; emptyText?: string; className?: string;
}) {
	installStyle()
	const [open, setOpen] = React.useState(false)
	const [query, setQuery] = React.useState("")
	const [rect, setRect] = React.useState<{ left: number; top: number; width: number } | null>(null)
	const triggerRef = React.useRef<HTMLButtonElement | null>(null)
	const popRef = React.useRef<HTMLDivElement | null>(null)
	const searchRef = React.useRef<HTMLInputElement | null>(null)

	const selected = options.find((o) => o.value === value)
	const q = query.trim().toLowerCase()
	// 分组匹配：命中标题的排前面，只命中说明（如 Base URL）的排后面。
	// 例：搜 "anth" 时 anthropic 第一，minimax（地址含 /anthropic）作为次要结果靠后，不抢位。
	const filtered = React.useMemo(() => {
		if (!q) return options
		const byLabel: ComboOption[] = []
		const byDesc: ComboOption[] = []
		for (const o of options) {
			if (o.label.toLowerCase().includes(q)) byLabel.push(o)
			else if (String(o.description ?? "").toLowerCase().includes(q)) byDesc.push(o)
		}
		return [...byLabel, ...byDesc]
	}, [options, q])

	// 根据触发区位置算弹出层坐标（fixed）。空间不足时自动向上翻，避免超出视口。
	const place = React.useCallback(() => {
		const el = triggerRef.current
		if (!el) return
		const r = el.getBoundingClientRect()
		const H = 264  // 弹出层估算高度（搜索框 + 列表上限）
		const below = window.innerHeight - r.bottom
		const top = below < H && r.top > below ? r.top - H - 4 : r.bottom + 4
		setRect({ left: r.left, top: Math.max(8, top), width: r.width })
	}, [])

	React.useEffect(() => {
		if (!open) return
		place()
		// 打开时聚焦搜索框（下一帧，等弹出层挂载）
		const raf = requestAnimationFrame(() => searchRef.current?.focus())
		const onDocDown = (e: MouseEvent) => {
			const t = e.target as Node
			if (popRef.current?.contains(t) || triggerRef.current?.contains(t)) return
			setOpen(false)
		}
		const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
		const onReflow = () => place()
		document.addEventListener("mousedown", onDocDown)
		document.addEventListener("keydown", onKey)
		window.addEventListener("resize", onReflow)
		window.addEventListener("scroll", onReflow, true)
		return () => {
			cancelAnimationFrame(raf)
			document.removeEventListener("mousedown", onDocDown)
			document.removeEventListener("keydown", onKey)
			window.removeEventListener("resize", onReflow)
			window.removeEventListener("scroll", onReflow, true)
		}
	}, [open, place])

	React.useEffect(() => { if (!open) setQuery("") }, [open])

	const pick = (o: ComboOption) => {
		if (o.disabled) return
		onChange(o.value)
		setOpen(false)
	}

	return <React.Fragment>
		<button
			type="button"
			ref={triggerRef}
			disabled={disabled}
			className={cx("dpk-combo-trigger", className)}
			onClick={() => setOpen((v) => !v)}
		>
			<span className="dpk-combo-triggertext">
				{selected
					? <React.Fragment>
						<span>{selected.label}</span>
						{selected.description ? <span className="dpk-combo-desc">{selected.description}</span> : null}
					</React.Fragment>
					: <span className="dpk-combo-placeholder">{placeholder}</span>}
			</span>
			<svg className="dpk-combo-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor"
				strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<path d="M6 9l6 6 6-6" />
			</svg>
		</button>
		{open ? createPortal(
			<div ref={popRef} className="dpk-combo-pop"
				style={{ left: rect?.left ?? 0, top: rect?.top ?? 0, width: rect?.width ?? 240 }}>
				<div className="dpk-combo-search">
					<svg className="dpk-combo-searchicon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
						strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
						<circle cx="11" cy="11" r="7" />
						<path d="M20 20l-4-4" />
					</svg>
					<input ref={searchRef} type="text" value={query} placeholder="搜索…"
						onChange={(e) => setQuery(e.target.value)} />
				</div>
				<div className="dpk-combo-list">
					{filtered.length === 0 ? <div className="dpk-combo-empty">{emptyText}</div> : filtered.map((o) => (
						<div key={o.value}
							className={cx("dpk-combo-item", o.value === value && "on", o.disabled && "disabled")}
							onClick={() => pick(o)}>
							<span className="dpk-combo-itemlabel">{o.label}</span>
							{o.description ? <span className="dpk-combo-desc">{o.description}</span> : null}
						</div>
					))}
				</div>
			</div>,
			document.body,
		) : null}
	</React.Fragment>
}
