// dpk 样式基线（与 plugins/dsh-plugin-kit/client.js 的样式表同源，body 作用域 token）
// ⚠️ 修改这里时同步 vanilla kit；颜色全部来自 DSH 主题 token（dsw alias 声明在 body 上，勿挂 :root）
export const dpkStyle = `
  body {
    --dpk-h-sm: 24px; --dpk-h-md: 28px; --dpk-h-lg: 32px;
    --dpk-radius: 6px; --dpk-radius-lg: 8px;
    --dpk-gap: 8px; --dpk-pad: 14px;
    --dpk-font: var(--dsw-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif);
    --dpk-dur: var(--ds-transition-duration, .2s);
    --dpk-ease: var(--ds-ease-in-out, cubic-bezier(.4,0,.2,1));
    --dpk-bg: var(--dsw-alias-bg-base, #fff);
    --dpk-layer1: var(--dsw-alias-bg-layer-1, #fff);
    --dpk-layer2: var(--dsw-alias-bg-layer-2, #fff);
    --dpk-border: var(--dsw-alias-border-l1, #0000000a);
    --dpk-border2: var(--dsw-alias-border-l2, #0000001a);
    --dpk-text: var(--dsw-alias-label-primary, #0f1115);
    --dpk-text2: var(--dsw-alias-label-secondary, #61666b);
    --dpk-text3: var(--dsw-alias-label-tertiary, #81858c);
    --dpk-brand: var(--dsw-alias-brand-primary, #0f1115);
    --dpk-brandfill: var(--dsw-alias-button-primary-fill, #0f1115);
    --dpk-brandhover: var(--dsw-alias-button-primary-hover, #43454a);
    --dpk-oncolor: var(--dsw-alias-label-primary-foreground, #fff);
    --dpk-hover: var(--dsw-alias-interactive-bg-hover, #2631480f);
    --dpk-danger: var(--dsw-alias-state-error-primary, #ec1313);
    --dpk-dangerdeep: #b91c1c;
    --dpk-hoverdanger: var(--dsw-alias-interactive-bg-hover-danger, #ec13130d);
    --dpk-warn: var(--dsw-alias-state-warn-primary, #f59e0b);
    --dpk-success: var(--dsw-alias-state-success-primary, #22c55e);
    --dpk-mask: var(--dsw-alias-bg-mask-1, #0000003d);
    --dpk-shadow: var(--dsw-shadow-lv3, 0 0 1px 0 #0003, 0 0 4px 0 #00000005, 0 12px 32px 0 #00000014);
    --dpk-panel: var(--dsw-alias-bg-panel, #f7f8fa);
    --dpk-softdanger-bg: var(--dsw-alias-state-error-bg, #fee2e2);
    --dpk-softdanger-text: var(--dsw-alias-state-error-secondary, #dc2626);
    --dpk-softdanger-hover: var(--dsw-alias-state-error-bg-hover, #fbd9d9);
    --dpk-neutral-bg: var(--dsw-alias-interactive-bg-hover-solid, #f1f3f5);
    --dpk-neutral-hover: var(--dsw-alias-button-ghost-active-fill, #ebeef2);
  }
  .dpk-btn { display:inline-flex; align-items:center; justify-content:center; gap:4px; height:var(--dpk-h-md); padding:0 10px; border:1px solid var(--dpk-border2); background:var(--dpk-bg); color:var(--dpk-text); border-radius:var(--dpk-radius); font:inherit; font-size:12px; line-height:1; box-sizing:border-box; cursor:pointer; transition:background var(--dpk-dur) var(--dpk-ease), border-color var(--dpk-dur) var(--dpk-ease), color var(--dpk-dur) var(--dpk-ease); }
  .dpk-btn:hover { background:var(--dpk-hover); }
  .dpk-btn:disabled { opacity:.6; cursor:not-allowed; }
  /* v5.3 根治：实色钮边框与底色同色（不用 transparent 虚占位），全系 border-box 外框同高 */
  .dpk-btn-primary { background:var(--dpk-brandfill); color:var(--dpk-oncolor); border-color:var(--dpk-brandfill); }
  .dpk-btn-primary:hover { background:var(--dpk-brandhover); border-color:var(--dpk-brandhover); }
  .dpk-btn-danger { color:var(--dpk-danger); }
  .dpk-btn-danger:hover { background:var(--dpk-hoverdanger); }
  .dpk-btn-sm { height:var(--dpk-h-sm); padding:0 8px; }
  .dpk-iconbtn { display:inline-flex; align-items:center; justify-content:center; width:var(--dpk-h-md); height:var(--dpk-h-md); padding:0; border:none; border-radius:var(--dpk-radius); background:transparent; color:var(--dpk-text2); cursor:pointer; transition:background var(--dpk-dur) var(--dpk-ease), color var(--dpk-dur) var(--dpk-ease); }
  .dpk-iconbtn:hover { background:var(--dpk-hover); color:var(--dpk-text); }
  .dpk-input, .dpk-select { height:var(--dpk-h-md); width:100%; box-sizing:border-box; border:1px solid var(--dpk-border2); border-radius:var(--dpk-radius); padding:0 7px; font:inherit; font-size:13px; background:var(--dpk-bg); color:var(--dpk-text); }
  .dpk-textarea { width:100%; box-sizing:border-box; border:1px solid var(--dpk-border2); border-radius:var(--dpk-radius); padding:5px 7px; font:inherit; font-size:13px; background:var(--dpk-bg); color:var(--dpk-text); resize:vertical; }
  .dpk-input:focus, .dpk-select:focus, .dpk-textarea:focus { outline:none; border-color:var(--dpk-brand); }
  .dpk-field { display:block; margin:8px 0 3px; font-size:13px; color:var(--dpk-text2); }
  .dpk-field-hint { font-size:12px; color:var(--dpk-text3); margin-top:2px; }
  .dpk-formerr { margin:8px 0 0; padding:7px 10px; border-radius:var(--dpk-radius); background:var(--dpk-hoverdanger); color:var(--dpk-danger); font-size:12px; }
  .dpk-check { display:inline-flex !important; align-items:center; gap:4px; font-size:12px; color:var(--dpk-text); margin:0; }
  .dpk-switch { position:relative; display:inline-flex; align-items:center; cursor:pointer; }
  .dpk-switch input { position:absolute; opacity:0; width:0; height:0; }
  .dpk-switch i { width:32px; height:18px; border-radius:999px; background:var(--dpk-border2); transition:background var(--dpk-dur) var(--dpk-ease); position:relative; font-style:normal; }
  .dpk-switch i::after { content:""; position:absolute; top:2px; left:2px; width:14px; height:14px; border-radius:50%; background:#fff; transition:transform var(--dpk-dur) var(--dpk-ease); box-shadow:0 1px 2px rgba(0,0,0,.2); }
  .dpk-switch input:checked + i { background:var(--dpk-brandfill); }
  .dpk-switch input:checked + i::after { transform:translateX(14px); }
  .dpk-row { display:flex; align-items:center; gap:var(--dpk-gap); flex-wrap:wrap; }
  .dpk-row > .dpk-input, .dpk-row > .dpk-select { width:auto; }
  .dpk-stack { display:flex; flex-direction:column; gap:var(--dpk-gap); }
  .dpk-card { background:var(--dpk-bg); border:1px solid var(--dpk-border); border-radius:var(--dpk-radius-lg); padding:10px 12px; }
  .dpk-card-head { display:flex; align-items:center; justify-content:space-between; gap:8px; }
  .dpk-card-name { font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .dpk-card-meta { color:var(--dpk-text2); font-size:12px; margin-top:2px; }
  .dpk-card-prompt { color:var(--dpk-text3); font-size:12px; margin-top:4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .dpk-card-ops { display:flex; gap:6px; margin-top:8px; flex-wrap:wrap; }
  .dpk-tabs { display:flex; gap:2px; padding:6px 14px 0; background:var(--dpk-layer1); border-bottom:1px solid var(--dpk-border); }
  .dpk-tab { border:none; background:none; color:var(--dpk-text2); padding:7px 12px; cursor:pointer; font:inherit; font-size:13px; border-bottom:2px solid transparent; transition:color var(--dpk-dur) var(--dpk-ease); }
  .dpk-tab:hover { color:var(--dpk-text); }
  .dpk-tab.active { border-bottom-color:var(--dpk-brand); color:var(--dpk-brand); font-weight:600; }
  .dpk-status { font-size:12px; }
  .dpk-pill { display:inline-flex; align-items:center; gap:4px; font-size:11px; border:1px solid var(--dpk-border2); border-radius:999px; padding:0 7px; color:var(--dpk-text2); }
  .dpk-badge { display:inline-flex; align-items:center; justify-content:center; min-width:16px; height:16px; padding:0 4px; border-radius:999px; background:var(--dpk-brandfill); color:var(--dpk-oncolor); font-size:10px; }
  .dpk-banner { margin:8px 14px 0; padding:7px 10px; border-radius:var(--dpk-radius); background:var(--dpk-layer2); color:var(--dpk-danger); font-size:12px; }
  .dpk-empty { color:var(--dpk-text3); padding:24px 16px; text-align:center; font-size:13px; }
  .dpk-group { margin-bottom:14px; }
  .dpk-group-title { font-weight:600; color:var(--dpk-text2); margin:0 0 6px; font-size:12px; }
  .dpk-group .dpk-card { margin-bottom:6px; }
  .dpk-divider { border:none; border-top:1px solid var(--dpk-border); margin:10px 0; }
  .dpk-page { height:100%; overflow:auto; padding:12px 14px; box-sizing:border-box; }
  .dpk-fill { height:100%; min-height:0; display:flex; flex-direction:column; }
  .dpk-fill-body { flex:1; min-height:0; overflow:auto; }
  .dpk-drawer-mask { position:fixed; inset:0; background:var(--dpk-mask); z-index:9980; }
  .dpk-drawer { position:fixed; top:0; right:0; bottom:0; width:400px; max-width:92vw; background:var(--dpk-layer1); z-index:9990; display:flex; flex-direction:column; box-shadow:var(--dpk-shadow); font-family:var(--dpk-font); font-size:14px; line-height:1.5; color:var(--dpk-text); }
  .dpk-toastwrap { position:fixed; left:50%; transform:translateX(-50%); bottom:76px; z-index:10010; display:flex; flex-direction:column; gap:6px; align-items:center; pointer-events:none; }
  .dpk-toast { background:var(--dpk-text); color:var(--dpk-bg); border-radius:var(--dpk-radius); padding:7px 14px; font-size:12px; box-shadow:var(--dpk-shadow); max-width:70vw; transition:opacity .2s; }
  .dpk-toast-success { background:var(--dpk-success); color:#fff; }
  .dpk-toast-error { background:var(--dpk-softdanger-bg); color:var(--dpk-softdanger-text); border:1px solid var(--dpk-softdanger-hover); }
  .dpk-toast-out { opacity:0; }
  .dpk-formhead { display:flex; align-items:center; gap:6px; padding:10px 0 8px; }
  .dpk-formtitle { font-weight:600; font-size:14px; }
  .dpk-formhint { margin:0 0 8px; padding:7px 10px; border-radius:var(--dpk-radius); background:var(--dpk-layer2); color:var(--dpk-text2); font-size:12px; }
  .dpk-formops { display:flex; justify-content:flex-end; gap:8px; margin-top:12px; }
  .dpk-overtag { display:inline-block; font-size:11px; color:var(--dpk-warn); border:1px solid var(--dpk-warn); border-radius:999px; padding:0 6px; }
  .dpk-datepick-hidden { position:absolute; width:1px; height:1px; opacity:0; pointer-events:none; border:none; padding:0; }
  .dpk-hidden { display:none !important; }
  .dpk-datepop { position:fixed; z-index:10020; width:252px; background:var(--dpk-bg); border:1px solid var(--dpk-border2); border-radius:var(--dpk-radius-lg); box-shadow:var(--dpk-shadow); padding:8px; font-family:var(--dpk-font); }
  .dpk-datepop-head { display:flex; align-items:center; justify-content:space-between; gap:2px; margin-bottom:6px; }
  .dpk-datepop-month { flex:1; text-align:center; font-weight:600; font-size:13px; color:var(--dpk-text); background:none; border:none; border-radius:var(--dpk-radius); padding:4px 6px; cursor:pointer; font-family:var(--dpk-font); }
  .dpk-datepop-month:hover { background:var(--dpk-hover); }
  .dpk-datepop-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; }
  .dpk-datepop-grid-years { grid-template-columns:repeat(3,1fr); gap:4px; }
  .dpk-datepop-dow { text-align:center; font-size:11px; color:var(--dpk-text3); padding:2px 0; }
  .dpk-datepop-cell { border:none; background:none; font:inherit; font-size:12px; color:var(--dpk-text); height:30px; border-radius:var(--dpk-radius); cursor:pointer; }
  .dpk-datepop-cell:hover { background:var(--dpk-hover); }
  .dpk-datepop-dim { visibility:hidden; }
  .dpk-datepop-today { font-weight:600; box-shadow:inset 0 0 0 1px var(--dpk-border2); }
  .dpk-datepop-sel { background:var(--dpk-brandfill); color:var(--dpk-oncolor); font-weight:600; }
  .dpk-datepop-foot { display:flex; justify-content:flex-end; margin-top:6px; }
  /* ---- v4 视觉定稿沉淀（源自 dsh-model-cap「提供商配置」页，additive） ---- */
  .dpk-card-raise { border-radius:10px; box-shadow:0 1px 3px rgba(15,17,21,.05), 0 1px 2px rgba(15,17,21,.03); padding:14px 16px; margin-bottom:14px; }
  .dpk-panel { background:var(--dpk-panel); border:none; border-radius:8px; padding:4px 8px 6px; }
  .dpk-rowitem { position:relative; display:flex; align-items:center; gap:12px; padding:9px 10px; border-radius:8px; }
  .dpk-rowitem:hover { background:var(--dpk-hover); }
  .dpk-rowitem-drag { cursor:grab; }
  .dpk-rowitem-drag:active { cursor:grabbing; }
  /* 落点线：绝对定位不占布局（插入式会让下面的行上下跳，指针一碰就抖）；pointer-events:none 保证指针永远"碰不到"它 */
  .dpk-dropline { position:absolute; left:2px; right:2px; height:3px; border-radius:2px; background:var(--dpk-accent, #3b82f6); pointer-events:none; }
  .dpk-dropline-top { top:-2px; }
  .dpk-dropline-bottom { bottom:-2px; }
  .dpk-draghandle { cursor:grab; color:var(--dpk-text3); font-size:12px; line-height:1; padding:1px 4px; border:1px solid var(--dpk-border); border-radius:4px; user-select:none; flex:none; }
  .dpk-draghandle:active { cursor:grabbing; }
  .dpk-cell { flex:1; min-width:0; }
  .dpk-cell-title { font-size:13px; font-weight:500; color:var(--dpk-text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .dpk-cell-sub { font-size:11px; color:var(--dpk-text3); margin-top:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .dpk-mono { font-family:ui-monospace, Consolas, monospace; font-size:11px; color:var(--dpk-text2); }
  .dpk-btn-soft { background:var(--dpk-softdanger-bg); color:var(--dpk-softdanger-text); border-color:var(--dpk-softdanger-bg); }
  .dpk-btn-soft:hover { background:var(--dpk-softdanger-hover); border-color:var(--dpk-softdanger-hover); }
  /* v5.6 中性选项钮（additive）：选项组未选中态 / 次级强调。与 soft（危险柔和红）严格区分语义 */
  .dpk-btn-neutral { background:var(--dpk-neutral-bg); color:var(--dpk-text2); border-color:var(--dpk-neutral-bg); }
  .dpk-btn-neutral:hover { background:var(--dpk-neutral-hover); border-color:var(--dpk-neutral-hover); color:var(--dpk-text); }
  .dpk-state { display:inline-flex; align-items:center; justify-content:center; gap:4px; font-size:11px; border-radius:999px; padding:3px 9px; min-width:52px; white-space:nowrap; flex:none; background:#eceef0; color:var(--dpk-text2); }
  .dpk-state-ok { background:#e6faed; color:#16a34a; }
  .dpk-state-fail { background:#fee2e2; color:#dc2626; }
  .dpk-state-testing { background:#fef5e7; color:#d97706; }
  .dpk-chip { display:inline-block; font-size:12px; border:1px solid var(--dpk-border2); border-radius:999px; padding:3px 10px; cursor:pointer; color:var(--dpk-text2); user-select:none; }
  .dpk-chip.on { background:var(--dpk-brandfill); color:var(--dpk-oncolor); border-color:var(--dpk-brandfill); }
  .dpk-chip-exist { cursor:default; background:var(--dpk-panel); color:var(--dpk-text3); border-color:var(--dpk-panel); }
  .dpk-footlink { border-top:1px solid var(--dpk-border); margin:2px 6px 0; padding:10px 0 6px; text-align:center; font-size:12px; color:var(--dpk-text2); cursor:pointer; user-select:none; }
  .dpk-footlink:hover { color:var(--dpk-text); }
  /* ---- 面板头 / 操作区 / 拉取面板 / 搜索 / 空态 / 软删除（与 vanilla kit 同步，additive） ---- */
  /* v5.5 确认态 hover 修正在位：常态红底，hover 红色加深（0,3,0 压过 danger:hover，不出红色系） */
  .dpk-btn.dpk-btn-armed, .dpk-btn-danger.dpk-btn-armed { background:var(--dpk-danger); color:var(--dpk-oncolor); border-color:var(--dpk-danger); }
  .dpk-btn.dpk-btn-armed:hover, .dpk-btn-danger.dpk-btn-armed:hover { background:var(--dpk-dangerdeep); color:var(--dpk-oncolor); border-color:var(--dpk-dangerdeep); }
  .dpk-panel-head { display:flex; align-items:center; gap:6px; margin:0; padding:8px 6px; }
  .dpk-panel-title { font-weight:600; font-size:13px; }
  .dpk-ops { display:flex; align-items:center; gap:6px; flex:none; }
  .dpk-card-meta-wrap { color:var(--dpk-text3); font-size:12px; margin:8px 2px 10px; line-height:1.7; }
  .dpk-pullpanel { background:var(--dpk-bg); border:1px dashed var(--dpk-border2); border-radius:8px; padding:10px 12px; margin:2px 6px 8px; }
  .dpk-pullbar { display:flex; align-items:center; gap:6px; margin-bottom:8px; }
  .dpk-pullsearch { flex:1; height:26px; box-sizing:border-box; min-width:0; border:1px solid var(--dpk-border2); border-radius:6px; padding:0 8px; font:inherit; font-size:12px; background:var(--dpk-bg); color:var(--dpk-text); }
  .dpk-pullsearch:focus { outline:none; border-color:var(--dpk-brand); }
  .dpk-chips { display:flex; flex-wrap:wrap; gap:6px; }
  .dpk-pullops { display:flex; justify-content:flex-end; gap:8px; margin-top:10px; align-items:center; }
  .dpk-hint { font-size:12px; color:var(--dpk-text3); }
  /* v5.3 新增：页面头（标题+描述+撑开器，走类名替代内联样式）+ 开关行 */
  .dpk-page-pad { padding:4px 14px 14px; }
  .dpk-page-head { display:flex; align-items:center; margin:2px 0 4px; }
  .dpk-page-title { font-weight:700; font-size:14px; }
  .dpk-page-desc { font-size:12px; color:var(--dpk-text3); margin:0 0 10px; }
  .dpk-spacer { flex:1; }
  .dpk-switch-row { display:flex; align-items:center; gap:8px; margin-top:10px; }
  /* v5.3 新增：模型行内错误展开（与 mockup 的 m-err 同款） */
  .dpk-merr { margin-top:5px; padding:6px 9px; border-radius:6px; background:var(--dpk-hoverdanger); color:var(--dpk-danger); font-size:11px; line-height:1.6; white-space:normal; }
  .dpk-merr b { font-weight:600; }
  .dpk-loading { font-size:12px; color:var(--dpk-text3); padding:4px 0; }
  .dpk-pill-brand { color:#4176e6; border-color:#4176e6; }
  /* ---- 二级组件资产（面板操作区 / 两段式确认 / 搜索框，与 vanilla kit 同步，additive） ---- */
  /* v5.5 操作区单排：不换行（窄到真放不下时横向滚，不挤第二行） */
  .dpk-toolbar { display:flex; align-items:center; gap:6px; flex-wrap:nowrap; overflow-x:auto; }
  .dpk-searchinput { position:relative; box-sizing:border-box; flex:1; min-width:80px; display:inline-flex; align-items:center; }
  .dpk-searchinput input { width:100%; height:26px; box-sizing:border-box; padding:0 8px 0 26px; border:1px solid var(--dpk-border2); border-radius:6px; font:inherit; font-size:12px; background:var(--dpk-bg); color:var(--dpk-text); }
  .dpk-searchinput input:focus { outline:none; border-color:var(--dpk-brand); }
  .dpk-searchinput-icon { position:absolute; left:8px; width:13px; height:13px; color:var(--dpk-text3); pointer-events:none; }
  /* ---- 可搜索组合框 ComboBox（v0.7.0，additive：不改既有规则） ----
     场景：40+ 项的长列表。原生 select 的弹出层由浏览器绘制，无法限高/搜索，必须自建。
     弹出层挂 body + position:fixed，所以 z-index 要高于 toast(10010) 与 datepop(10020)。 */
  .dpk-combo-trigger { display:flex; align-items:center; gap:6px; width:100%; box-sizing:border-box; height:var(--dpk-h-md); padding:0 7px; border:1px solid var(--dpk-border2); border-radius:var(--dpk-radius); background:var(--dpk-bg); color:var(--dpk-text); font:inherit; font-size:13px; text-align:left; cursor:pointer; }
  .dpk-combo-trigger:hover { border-color:var(--dpk-brand); }
  .dpk-combo-trigger:disabled { opacity:.6; cursor:not-allowed; }
  .dpk-combo-triggertext { flex:1; min-width:0; display:flex; align-items:baseline; gap:6px; overflow:hidden; }
  .dpk-combo-triggertext > span:first-child { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .dpk-combo-placeholder { color:var(--dpk-text3); }
  .dpk-combo-caret { flex:none; width:13px; height:13px; color:var(--dpk-text3); }
  .dpk-combo-desc { font-size:11px; color:var(--dpk-text3); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .dpk-combo-pop { position:fixed; z-index:10030; box-sizing:border-box; background:var(--dpk-bg); border:1px solid var(--dpk-border2); border-radius:var(--dpk-radius-lg); box-shadow:var(--dpk-shadow); display:flex; flex-direction:column; max-height:264px; font-family:var(--dpk-font); }
  .dpk-combo-search { position:relative; display:flex; align-items:center; padding:7px 8px; border-bottom:1px solid var(--dpk-border); flex:none; }
  .dpk-combo-search input { width:100%; box-sizing:border-box; height:26px; padding:0 8px 0 26px; border:1px solid var(--dpk-border2); border-radius:6px; background:var(--dpk-bg); color:var(--dpk-text); font:inherit; font-size:12px; }
  .dpk-combo-search input:focus { outline:none; border-color:var(--dpk-brand); }
  .dpk-combo-searchicon { position:absolute; left:16px; width:13px; height:13px; color:var(--dpk-text3); pointer-events:none; }
  .dpk-combo-list { overflow-y:auto; padding:4px; flex:1; min-height:0; }
  .dpk-combo-item { display:flex; flex-direction:column; gap:1px; padding:6px 8px; border-radius:6px; cursor:pointer; }
  .dpk-combo-item:hover { background:var(--dpk-hover); }
  .dpk-combo-item.on { background:var(--dpk-neutral-bg); }
  .dpk-combo-item.disabled { opacity:.45; cursor:not-allowed; }
  .dpk-combo-item.disabled:hover { background:transparent; }
  .dpk-combo-itemlabel { font-size:12px; color:var(--dpk-text); }
  .dpk-combo-empty { padding:14px 8px; text-align:center; font-size:12px; color:var(--dpk-text3); }
`
