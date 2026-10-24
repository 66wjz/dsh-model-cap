window.__ModuleLoader__.load({
	id: "dsh-model-cap",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.tsx
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var React2 = __toESM(require("react"), 1);

// vendor/dpk/index.tsx
var React = __toESM(require("react"), 1);
var import_react_dom = require("react-dom");

// vendor/dpk/css.ts
var dpkStyle = `
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
  /* v5.3 \u6839\u6CBB\uFF1A\u5B9E\u8272\u94AE\u8FB9\u6846\u4E0E\u5E95\u8272\u540C\u8272\uFF08\u4E0D\u7528 transparent \u865A\u5360\u4F4D\uFF09\uFF0C\u5168\u7CFB border-box \u5916\u6846\u540C\u9AD8 */
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
  /* ---- v4 \u89C6\u89C9\u5B9A\u7A3F\u6C89\u6DC0\uFF08\u6E90\u81EA dsh-model-cap\u300C\u63D0\u4F9B\u5546\u914D\u7F6E\u300D\u9875\uFF0Cadditive\uFF09 ---- */
  .dpk-card-raise { border-radius:10px; box-shadow:0 1px 3px rgba(15,17,21,.05), 0 1px 2px rgba(15,17,21,.03); padding:14px 16px; margin-bottom:14px; }
  .dpk-panel { background:var(--dpk-panel); border:none; border-radius:8px; padding:4px 8px 6px; }
  .dpk-rowitem { position:relative; display:flex; align-items:center; gap:12px; padding:9px 10px; border-radius:8px; }
  .dpk-rowitem:hover { background:var(--dpk-hover); }
  .dpk-rowitem-drag { cursor:grab; }
  .dpk-rowitem-drag:active { cursor:grabbing; }
  /* \u843D\u70B9\u7EBF\uFF1A\u7EDD\u5BF9\u5B9A\u4F4D\u4E0D\u5360\u5E03\u5C40\uFF08\u63D2\u5165\u5F0F\u4F1A\u8BA9\u4E0B\u9762\u7684\u884C\u4E0A\u4E0B\u8DF3\uFF0C\u6307\u9488\u4E00\u78B0\u5C31\u6296\uFF09\uFF1Bpointer-events:none \u4FDD\u8BC1\u6307\u9488\u6C38\u8FDC"\u78B0\u4E0D\u5230"\u5B83 */
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
  /* v5.6 \u4E2D\u6027\u9009\u9879\u94AE\uFF08additive\uFF09\uFF1A\u9009\u9879\u7EC4\u672A\u9009\u4E2D\u6001 / \u6B21\u7EA7\u5F3A\u8C03\u3002\u4E0E soft\uFF08\u5371\u9669\u67D4\u548C\u7EA2\uFF09\u4E25\u683C\u533A\u5206\u8BED\u4E49 */
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
  /* ---- \u9762\u677F\u5934 / \u64CD\u4F5C\u533A / \u62C9\u53D6\u9762\u677F / \u641C\u7D22 / \u7A7A\u6001 / \u8F6F\u5220\u9664\uFF08\u4E0E vanilla kit \u540C\u6B65\uFF0Cadditive\uFF09 ---- */
  /* v5.5 \u786E\u8BA4\u6001 hover \u4FEE\u6B63\u5728\u4F4D\uFF1A\u5E38\u6001\u7EA2\u5E95\uFF0Chover \u7EA2\u8272\u52A0\u6DF1\uFF080,3,0 \u538B\u8FC7 danger:hover\uFF0C\u4E0D\u51FA\u7EA2\u8272\u7CFB\uFF09 */
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
  /* v5.3 \u65B0\u589E\uFF1A\u9875\u9762\u5934\uFF08\u6807\u9898+\u63CF\u8FF0+\u6491\u5F00\u5668\uFF0C\u8D70\u7C7B\u540D\u66FF\u4EE3\u5185\u8054\u6837\u5F0F\uFF09+ \u5F00\u5173\u884C */
  .dpk-page-pad { padding:4px 14px 14px; }
  .dpk-page-head { display:flex; align-items:center; margin:2px 0 4px; }
  .dpk-page-title { font-weight:700; font-size:14px; }
  .dpk-page-desc { font-size:12px; color:var(--dpk-text3); margin:0 0 10px; }
  .dpk-spacer { flex:1; }
  .dpk-switch-row { display:flex; align-items:center; gap:8px; margin-top:10px; }
  /* v5.3 \u65B0\u589E\uFF1A\u6A21\u578B\u884C\u5185\u9519\u8BEF\u5C55\u5F00\uFF08\u4E0E mockup \u7684 m-err \u540C\u6B3E\uFF09 */
  .dpk-merr { margin-top:5px; padding:6px 9px; border-radius:6px; background:var(--dpk-hoverdanger); color:var(--dpk-danger); font-size:11px; line-height:1.6; white-space:normal; }
  .dpk-merr b { font-weight:600; }
  .dpk-loading { font-size:12px; color:var(--dpk-text3); padding:4px 0; }
  .dpk-pill-brand { color:#4176e6; border-color:#4176e6; }
  /* ---- \u4E8C\u7EA7\u7EC4\u4EF6\u8D44\u4EA7\uFF08\u9762\u677F\u64CD\u4F5C\u533A / \u4E24\u6BB5\u5F0F\u786E\u8BA4 / \u641C\u7D22\u6846\uFF0C\u4E0E vanilla kit \u540C\u6B65\uFF0Cadditive\uFF09 ---- */
  /* v5.5 \u64CD\u4F5C\u533A\u5355\u6392\uFF1A\u4E0D\u6362\u884C\uFF08\u7A84\u5230\u771F\u653E\u4E0D\u4E0B\u65F6\u6A2A\u5411\u6EDA\uFF0C\u4E0D\u6324\u7B2C\u4E8C\u884C\uFF09 */
  .dpk-toolbar { display:flex; align-items:center; gap:6px; flex-wrap:nowrap; overflow-x:auto; }
  .dpk-searchinput { position:relative; box-sizing:border-box; flex:1; min-width:80px; display:inline-flex; align-items:center; }
  .dpk-searchinput input { width:100%; height:26px; box-sizing:border-box; padding:0 8px 0 26px; border:1px solid var(--dpk-border2); border-radius:6px; font:inherit; font-size:12px; background:var(--dpk-bg); color:var(--dpk-text); }
  .dpk-searchinput input:focus { outline:none; border-color:var(--dpk-brand); }
  .dpk-searchinput-icon { position:absolute; left:8px; width:13px; height:13px; color:var(--dpk-text3); pointer-events:none; }
  /* ---- \u53EF\u641C\u7D22\u7EC4\u5408\u6846 ComboBox\uFF08v0.7.0\uFF0Cadditive\uFF1A\u4E0D\u6539\u65E2\u6709\u89C4\u5219\uFF09 ----
     \u573A\u666F\uFF1A40+ \u9879\u7684\u957F\u5217\u8868\u3002\u539F\u751F select \u7684\u5F39\u51FA\u5C42\u7531\u6D4F\u89C8\u5668\u7ED8\u5236\uFF0C\u65E0\u6CD5\u9650\u9AD8/\u641C\u7D22\uFF0C\u5FC5\u987B\u81EA\u5EFA\u3002
     \u5F39\u51FA\u5C42\u6302 body + position:fixed\uFF0C\u6240\u4EE5 z-index \u8981\u9AD8\u4E8E toast(10010) \u4E0E datepop(10020)\u3002 */
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
`;

// vendor/dpk/index.tsx
var styleInjected = false;
function installStyle() {
  const existing = document.getElementById("dpk-style");
  if (existing) {
    if (existing.textContent !== dpkStyle) existing.textContent = dpkStyle;
    styleInjected = true;
    return;
  }
  if (styleInjected) return;
  const s = document.createElement("style");
  s.id = "dpk-style";
  s.textContent = dpkStyle;
  document.head.appendChild(s);
  styleInjected = true;
}
function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}
function Button({
  variant = "default",
  size,
  className,
  children,
  ...rest
}) {
  installStyle();
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: cx("dpk-btn", variant !== "default" && `dpk-btn-${variant}`, size === "sm" && "dpk-btn-sm", className),
      ...rest
    },
    children
  );
}
function Input({ className, ...rest }) {
  installStyle();
  return /* @__PURE__ */ React.createElement("input", { className: cx("dpk-input", className), ...rest });
}
function Select({ className, children, ...rest }) {
  installStyle();
  return /* @__PURE__ */ React.createElement("select", { className: cx("dpk-select", className), ...rest }, children);
}
function Switch({ checked, onChange }) {
  installStyle();
  return /* @__PURE__ */ React.createElement("label", { className: "dpk-switch" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked, onChange: (e) => onChange(e.target.checked) }), /* @__PURE__ */ React.createElement("i", null));
}
function Card({ className, children }) {
  installStyle();
  return /* @__PURE__ */ React.createElement("div", { className: cx("dpk-card", className) }, children);
}
function Field({ label, hint, children }) {
  installStyle();
  return /* @__PURE__ */ React.createElement("label", { className: "dpk-field" }, label, children, hint ? /* @__PURE__ */ React.createElement("div", { className: "dpk-field-hint" }, hint) : null);
}
function Banner({ children, style }) {
  installStyle();
  return /* @__PURE__ */ React.createElement("div", { className: "dpk-banner", style }, children);
}
function Pill({ className, children }) {
  installStyle();
  return /* @__PURE__ */ React.createElement("span", { className: cx("dpk-pill", className) }, children);
}
function Checkbox({ checked, onChange, children, className }) {
  installStyle();
  return /* @__PURE__ */ React.createElement("label", { className: cx("dpk-check", className) }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked, onChange: (e) => onChange(e.target.checked) }), children != null ? /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center" } }, children) : null);
}
function SearchInput({ className, ...rest }) {
  installStyle();
  return /* @__PURE__ */ React.createElement("div", { className: cx("dpk-searchinput", className) }, /* @__PURE__ */ React.createElement(
    "svg",
    {
      className: "dpk-searchinput-icon",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.7",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true"
    },
    /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "11", r: "7" }),
    /* @__PURE__ */ React.createElement("path", { d: "M20 20l-4-4" })
  ), /* @__PURE__ */ React.createElement("input", { type: "text", ...rest }));
}
function StateBadge({ state, children, title }) {
  installStyle();
  return /* @__PURE__ */ React.createElement("span", { className: cx("dpk-state", state !== "idle" && `dpk-state-${state}`), title }, children);
}
function Chip({ on, exist, onClick, children }) {
  installStyle();
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      className: cx("dpk-chip", exist && "dpk-chip-exist", !exist && on && "on"),
      onClick: exist ? void 0 : onClick
    },
    children,
    exist ? " \xB7 \u5DF2\u914D\u7F6E" : null
  );
}
var debugBox = null;
function showDebugError(title, detail) {
  try {
    if (!debugBox || !debugBox.isConnected) {
      debugBox = document.createElement("pre");
      debugBox.style.cssText = "position:fixed;inset:auto 12px 12px 12px;max-height:45vh;overflow:auto;z-index:99999;background:#2b1d1d;color:#ffb4b4;border:1px solid #ec1313;border-radius:8px;padding:10px;font:11px/1.5 monospace;white-space:pre-wrap";
      document.body.appendChild(debugBox);
    }
    debugBox.textContent = `[${title}]
${detail}`.slice(0, 4e3);
  } catch {
  }
}
function installDebugOverlay(filter) {
  installStyle();
  window.addEventListener("error", (ev) => {
    if (!ev.error) return;
    const text = String(ev.error.stack ?? ev.error.message ?? "");
    if (text.includes(filter)) showDebugError("\u672A\u6355\u83B7\u5F02\u5E38", text);
  });
  window.addEventListener("unhandledrejection", (ev) => {
    const text = String(ev.reason?.stack ?? ev.reason?.message ?? ev.reason ?? "");
    if (text.includes(filter)) showDebugError("\u672A\u5904\u7406\u7684 Promise \u62D2\u7EDD", text);
  });
}
var toastWrap = null;
function toast(message, type = "info", ms = type === "error" ? 5200 : 2600) {
  installStyle();
  if (!toastWrap || !toastWrap.isConnected) {
    toastWrap = document.createElement("div");
    toastWrap.className = "dpk-toastwrap";
    document.body.appendChild(toastWrap);
  }
  const t = document.createElement("div");
  t.className = `dpk-toast dpk-toast-${type}`;
  t.textContent = message;
  toastWrap.appendChild(t);
  setTimeout(() => {
    t.classList.add("dpk-toast-out");
    setTimeout(() => {
      t.remove();
      if (toastWrap && !toastWrap.childElementCount) {
        toastWrap.remove();
        toastWrap = null;
      }
    }, 220);
  }, ms);
}
function ConfirmButton({ confirmText, ms = 2600, disabled, variant = "danger", onConfirm, children, className }) {
  installStyle();
  const [armed, setArmed] = React.useState(false);
  const timer = React.useRef(null);
  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  return /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: variant === "default" ? "default" : "danger",
      size: "sm",
      disabled,
      className: cx(armed && "dpk-btn-armed", className),
      onClick: () => {
        if (armed) {
          if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
          }
          setArmed(false);
          try {
            const r = onConfirm();
            if (r && typeof r.then === "function") r.catch((e) => {
              console.error("[dpk] ConfirmButton onConfirm \u5931\u8D25", e);
            });
          } catch (e) {
            console.error("[dpk] ConfirmButton onConfirm \u5931\u8D25", e);
          }
        } else {
          setArmed(true);
          timer.current = setTimeout(() => {
            setArmed(false);
            timer.current = null;
          }, ms);
        }
      }
    },
    armed ? confirmText : children
  );
}
function PanelActions({ children, className, style }) {
  installStyle();
  return /* @__PURE__ */ React.createElement("div", { className: cx("dpk-toolbar", className), style }, children);
}
function Hint({ children, className, style }) {
  installStyle();
  return /* @__PURE__ */ React.createElement("div", { className: cx("dpk-hint", className), style }, children);
}
function Row({ children, gap, align, className, style }) {
  installStyle();
  const merged = { ...gap != null ? { gap } : {}, ...align ? { alignItems: align } : {}, ...style };
  return /* @__PURE__ */ React.createElement("div", { className: cx("dpk-row", className), style: Object.keys(merged).length ? merged : void 0 }, children);
}
function FormHead({ title, size = 14, leading, trailing, style }) {
  installStyle();
  return /* @__PURE__ */ React.createElement("div", { className: "dpk-formhead", style }, leading, /* @__PURE__ */ React.createElement("span", { className: "dpk-formtitle", style: { fontSize: size } }, title), trailing);
}
function Mono({ children }) {
  installStyle();
  return /* @__PURE__ */ React.createElement("span", { className: "dpk-mono" }, children);
}
function Spacer() {
  installStyle();
  return /* @__PURE__ */ React.createElement("span", { className: "dpk-spacer" });
}
function FormError({ children }) {
  installStyle();
  return /* @__PURE__ */ React.createElement("div", { className: "dpk-formerr" }, children);
}
function Loading({ children }) {
  installStyle();
  return /* @__PURE__ */ React.createElement("div", { className: "dpk-loading" }, children);
}
function FormOps({ children }) {
  installStyle();
  return /* @__PURE__ */ React.createElement("div", { className: "dpk-formops" }, children);
}
function ComboBox({ value, options, onChange, placeholder = "\u8BF7\u9009\u62E9\u2026", disabled, emptyText = "\u6CA1\u6709\u5339\u914D\u9879", className }) {
  installStyle();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [rect, setRect] = React.useState(null);
  const triggerRef = React.useRef(null);
  const popRef = React.useRef(null);
  const searchRef = React.useRef(null);
  const selected = options.find((o) => o.value === value);
  const q = query.trim().toLowerCase();
  const filtered = React.useMemo(() => {
    if (!q) return options;
    const byLabel = [];
    const byDesc = [];
    for (const o of options) {
      if (o.label.toLowerCase().includes(q)) byLabel.push(o);
      else if (String(o.description ?? "").toLowerCase().includes(q)) byDesc.push(o);
    }
    return [...byLabel, ...byDesc];
  }, [options, q]);
  const place = React.useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const H = 264;
    const below = window.innerHeight - r.bottom;
    const top = below < H && r.top > below ? r.top - H - 4 : r.bottom + 4;
    setRect({ left: r.left, top: Math.max(8, top), width: r.width });
  }, []);
  React.useEffect(() => {
    if (!open) return;
    place();
    const raf = requestAnimationFrame(() => searchRef.current?.focus());
    const onDocDown = (e) => {
      const t = e.target;
      if (popRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onReflow = () => place();
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onReflow);
    window.addEventListener("scroll", onReflow, true);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onReflow);
      window.removeEventListener("scroll", onReflow, true);
    };
  }, [open, place]);
  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);
  const pick = (o) => {
    if (o.disabled) return;
    onChange(o.value);
    setOpen(false);
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      ref: triggerRef,
      disabled,
      className: cx("dpk-combo-trigger", className),
      onClick: () => setOpen((v) => !v)
    },
    /* @__PURE__ */ React.createElement("span", { className: "dpk-combo-triggertext" }, selected ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", null, selected.label), selected.description ? /* @__PURE__ */ React.createElement("span", { className: "dpk-combo-desc" }, selected.description) : null) : /* @__PURE__ */ React.createElement("span", { className: "dpk-combo-placeholder" }, placeholder)),
    /* @__PURE__ */ React.createElement(
      "svg",
      {
        className: "dpk-combo-caret",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": "true"
      },
      /* @__PURE__ */ React.createElement("path", { d: "M6 9l6 6 6-6" })
    )
  ), open ? (0, import_react_dom.createPortal)(
    /* @__PURE__ */ React.createElement(
      "div",
      {
        ref: popRef,
        className: "dpk-combo-pop",
        style: { left: rect?.left ?? 0, top: rect?.top ?? 0, width: rect?.width ?? 240 }
      },
      /* @__PURE__ */ React.createElement("div", { className: "dpk-combo-search" }, /* @__PURE__ */ React.createElement(
        "svg",
        {
          className: "dpk-combo-searchicon",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.7",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          "aria-hidden": "true"
        },
        /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "11", r: "7" }),
        /* @__PURE__ */ React.createElement("path", { d: "M20 20l-4-4" })
      ), /* @__PURE__ */ React.createElement(
        "input",
        {
          ref: searchRef,
          type: "text",
          value: query,
          placeholder: "\u641C\u7D22\u2026",
          onChange: (e) => setQuery(e.target.value)
        }
      )),
      /* @__PURE__ */ React.createElement("div", { className: "dpk-combo-list" }, filtered.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "dpk-combo-empty" }, emptyText) : filtered.map((o) => /* @__PURE__ */ React.createElement(
        "div",
        {
          key: o.value,
          className: cx("dpk-combo-item", o.value === value && "on", o.disabled && "disabled"),
          onClick: () => pick(o)
        },
        /* @__PURE__ */ React.createElement("span", { className: "dpk-combo-itemlabel" }, o.label),
        o.description ? /* @__PURE__ */ React.createElement("span", { className: "dpk-combo-desc" }, o.description) : null
      )))
    ),
    document.body
  ) : null);
}

// src/client.tsx
var NS = "dsh-model-cap";
var LLM_NS = "llm-pi-ai";
var OWN_CAPS_NS = "dsh-model-cap";
var CAPS_ENTRY_IDS = [OWN_CAPS_NS, "ui-model-capabilities", "web-ui-model-capabilities"];
var CAPS_NS = null;
var CAPS_RESOLVE_ERR = null;
var capsBus = {
  listeners: /* @__PURE__ */ new Set(),
  on(fn) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  },
  emit() {
    for (const fn of [...this.listeners]) fn();
  }
};
function schemaNode(value, refs) {
  if (value && typeof value === "object" && typeof value.type === "string") return value;
  const key = value && typeof value === "object" ? value.uid : value;
  if (key === void 0) return void 0;
  const node = refs[String(key)];
  return node && typeof node === "object" ? node : void 0;
}
function isArchiveSchema(schema) {
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) return false;
  const refs = schema.refs && typeof schema.refs === "object" && !Array.isArray(schema.refs) ? schema.refs : {};
  const root = schemaNode(schema, refs);
  if (root?.type !== "object" || !root.dict || typeof root.dict !== "object") return false;
  const fields = Object.keys(root.dict);
  if (fields.length !== 1 || fields[0] !== "disabled") return false;
  return schemaNode(root.dict[fields[0]], refs)?.type === "any";
}
function namespacesOf(res) {
  if (Array.isArray(res)) return res;
  const v = res?.value ?? res?.result?.value;
  if (Array.isArray(v?.namespaces)) return v.namespaces;
  return [];
}
async function resolveCaps(binder) {
  CAPS_RESOLVE_ERR = null;
  try {
    capsScope = binder.bind({ namespace: OWN_CAPS_NS });
    CAPS_NS = OWN_CAPS_NS;
    capsBus.emit();
    return;
  } catch (e) {
    CAPS_RESOLVE_ERR = `\u7ED1\u5B9A ${OWN_CAPS_NS} \u5931\u8D25\uFF1A${e?.message ?? e}`;
  }
  try {
    const list = namespacesOf(await REMOTE.settings.describe());
    const pick = list.find((f) => CAPS_ENTRY_IDS.includes(f?.ns)) ?? list.find((f) => isArchiveSchema(f?.schema));
    if (pick?.ns) {
      capsScope = binder.bind({ namespace: pick.ns });
      CAPS_NS = pick.ns;
      capsBus.emit();
      return;
    }
    CAPS_RESOLVE_ERR = (CAPS_RESOLVE_ERR ? CAPS_RESOLVE_ERR + "\uFF1B" : "") + `describe() \u8FD4\u56DE ${list.length} \u4E2A\u547D\u540D\u7A7A\u95F4\uFF0C\u6CA1\u6709\u5F52\u6863\u6761\u76EE`;
  } catch (e) {
    CAPS_RESOLVE_ERR = (CAPS_RESOLVE_ERR ? CAPS_RESOLVE_ERR + "\uFF1B" : "") + "settings.describe() \u5931\u8D25\uFF1A" + (e?.message ?? e);
  }
  capsBus.emit();
}
function requireCapsNs() {
  if (!CAPS_NS) throw new Error("\u7981\u7528/\u542F\u7528\u529F\u80FD\u5DF2\u505C\u7528" + (CAPS_RESOLVE_ERR ? "\uFF1A" + CAPS_RESOLVE_ERR : "\uFF08\u5F52\u6863\u6761\u76EE\u672A\u5C31\u7EEA\uFF09"));
  return CAPS_NS;
}
var VISION = ["text", "image"];
var THINKING_LEVELS = ["off", "minimal", "low", "medium", "high", "xhigh", "max"];
var PROTOCOLS = [
  { v: "openai-completions", label: "openai \u517C\u5BB9" },
  { v: "openai-responses", label: "openai responses" },
  { v: "anthropic-messages", label: "anthropic" }
];
var MODEL_PAGE = 5;
var RETRY_CODES_HINT = "EMPTY_RESPONSE, RATE_LIMIT, SERVER, TIMEOUT, TRANSPORT";
function retrySummary(p) {
  const r = p?.retryPolicy;
  if (!r || typeof r !== "object") return "";
  if (r.mode === "always") return "\u91CD\u8BD5 always\uFF08\u6BCF\u6B21\u5931\u8D25\u90FD\u91CD\u8BD5\uFF09";
  if (r.mode !== "normal") return "";
  const n = Number.isFinite(r.maxRetries) ? r.maxRetries : 5;
  const codes = Array.isArray(r.retryableCodes) ? r.retryableCodes.length : 5;
  return `\u91CD\u8BD5 normal \xD7${n}\uFF08${codes} \u7C7B\u9519\u8BEF\uFF09`;
}
function buildRetryPolicy(f) {
  if (f.mode === "default") return void 0;
  const optNum = (raw, label, ok, hint) => {
    const s = raw.trim();
    if (!s) return void 0;
    const n = Number(s);
    if (!ok(n)) throw new Error(`${label}\uFF1A${hint}`);
    return n;
  };
  const backoff = {};
  const init = optNum(f.initialDelayMs, "\u9000\u907F\u521D\u59CB\u5EF6\u8FDF", (n) => Number.isFinite(n) && n > 0, "\u5FC5\u987B\u662F\u5927\u4E8E 0 \u7684\u6BEB\u79D2\u6570");
  if (init !== void 0) backoff.initialDelayMs = init;
  const maxDelay = optNum(f.maxDelayMs, "\u9000\u907F\u6700\u5927\u5EF6\u8FDF", (n) => Number.isFinite(n) && n > 0, "\u5FC5\u987B\u662F\u5927\u4E8E 0 \u7684\u6BEB\u79D2\u6570");
  if (maxDelay !== void 0) backoff.maxDelayMs = maxDelay;
  if (init !== void 0 && maxDelay !== void 0 && init > maxDelay) throw new Error("\u9000\u907F\u521D\u59CB\u5EF6\u8FDF\u4E0D\u80FD\u5927\u4E8E\u6700\u5927\u5EF6\u8FDF");
  const jitter = optNum(f.jitterRatio, "\u6296\u52A8\u6BD4", (n) => Number.isFinite(n) && n >= 0 && n <= 1, "\u5FC5\u987B\u5728 0 \u5230 1 \u4E4B\u95F4");
  if (jitter !== void 0) backoff.jitterRatio = jitter;
  const out = { mode: f.mode };
  if (f.mode === "normal") {
    const mr = optNum(f.maxRetries, "\u6700\u5927\u91CD\u8BD5\u6B21\u6570", (n) => Number.isSafeInteger(n) && n >= 0, "\u5FC5\u987B\u662F\u975E\u8D1F\u6574\u6570");
    if (mr !== void 0) out.maxRetries = mr;
    const codes = f.codes.split(",").map((s) => s.trim()).filter(Boolean);
    if (codes.length) {
      if (new Set(codes).size !== codes.length) throw new Error("\u53EF\u91CD\u8BD5\u9519\u8BEF\u7801\u6709\u91CD\u590D");
      out.retryableCodes = codes;
    }
  }
  if (Object.keys(backoff).length) out.backoff = backoff;
  return out;
}
var COMPAT_FIELDS = {
  "openai-completions": [
    {
      key: "maxTokensField",
      label: "\u8F93\u51FA\u4E0A\u9650\u5B57\u6BB5\u540D",
      kind: "enum",
      options: ["max_tokens", "max_completion_tokens"],
      hint: "\u7F51\u5173\u8BFB\u54EA\u4E2A\u5B57\u6BB5\u9650\u5236\u8F93\u51FA\u957F\u5EA6\uFF1B\u591A\u6570\u4E2D\u8F6C\u7AD9\u7528 max_tokens"
    },
    {
      key: "thinkingFormat",
      label: "\u63A8\u7406\u53C2\u6570\u683C\u5F0F",
      kind: "enum",
      options: ["openai", "deepseek", "openrouter", "together", "baseten", "zai", "qwen", "chat-template", "qwen-chat-template", "string-thinking", "ant-ling"],
      hint: "\u63A8\u7406\u6863\u4F4D\u4EE5\u4EC0\u4E48\u53C2\u6570\u5F62\u6001\u4E0B\u53D1\uFF1B\u9009\u9519\u4F1A\u88AB\u7F51\u5173\u5FFD\u7565\u6216 400"
    },
    {
      key: "chatTemplateKwargs",
      label: "chat_template_kwargs",
      kind: "json",
      hint: '\u4EC5 chat-template \u7CFB\u683C\u5F0F\u751F\u6548\uFF1BJSON \u5BF9\u8C61\uFF0C\u5982 {"enable_thinking": true}'
    },
    { key: "supportsReasoningEffort", label: "\u63A5\u53D7 reasoning_effort", kind: "bool" },
    {
      key: "supportsUsageInStreaming",
      label: "\u6D41\u5F0F\u8FD4\u56DE usage",
      kind: "bool",
      hint: "\u5173\u95ED\u5219\u65E0\u6CD5\u5728\u6D41\u5F0F\u54CD\u5E94\u91CC\u7EDF\u8BA1 token \u7528\u91CF"
    }
  ],
  "openai-responses": [
    { key: "supportsDeveloperRole", label: "\u63A5\u53D7 developer \u89D2\u8272", kind: "bool", hint: "\u5173\u6389\u5219\u7CFB\u7EDF\u63D0\u793A\u8BCD\u4ECD\u7528 system \u89D2\u8272" },
    { key: "supportsMaxOutputTokens", label: "\u63A5\u53D7 max_output_tokens", kind: "bool" }
  ],
  "anthropic-messages": [
    { key: "supportsTemperature", label: "\u63A5\u53D7 temperature", kind: "bool" },
    { key: "forceAdaptiveThinking", label: "\u5F3A\u5236\u81EA\u9002\u5E94\u601D\u8003", kind: "bool", hint: "\u4E0D\u770B\u6A21\u578B ID\uFF0C\u4E00\u5F8B\u5F00\u542F adaptive thinking" },
    { key: "supportsStrictTools", label: "\u63A5\u53D7\u4E25\u683C\u5DE5\u5177 schema", kind: "bool" }
  ]
};
var COMPAT_ALL_KEYS = Array.from(new Set(Object.values(COMPAT_FIELDS).flat().map((f) => f.key)));
var COMPAT_OFFER = {
  "openai-completions": [
    "supportsStore",
    "supportsDeveloperRole",
    "supportsReasoningEffort",
    "supportsUsageInStreaming",
    "supportsFinishReason",
    "maxTokensField",
    "requiresToolResultName",
    "requiresAssistantAfterToolResult",
    "requiresThinkingAsText",
    "requiresReasoningContentOnAssistantMessages",
    "thinkingFormat",
    "chatTemplateKwargs",
    "chatTemplateArgs",
    "supportsThinkingTokenBudget",
    "thinkingTokenBudgetField",
    "vllmPriority",
    "supportsStrictMode",
    "cacheControlFormat",
    "supportsLongCacheRetention"
  ],
  "openai-responses": ["supportsDeveloperRole", "supportsMaxOutputTokens", "supportsStrictMode", "supportsLongCacheRetention"],
  "anthropic-messages": [
    "supportsEagerToolInputStreaming",
    "supportsLongCacheRetention",
    "supportsCacheControlOnTools",
    "supportsTemperature",
    "forceAdaptiveThinking",
    "allowEmptySignature",
    "supportsStrictTools"
  ]
};
function strayCompatKeys(compat, api) {
  if (!compat || typeof compat !== "object") return [];
  if (!COMPAT_OFFER[api]) return [];
  const offer = COMPAT_OFFER[api];
  return Object.keys(compat).filter((k) => !offer.includes(k));
}
function strayCompatCount(providerName, api) {
  const models = getProviders()[providerName]?.models ?? [];
  let n = 0;
  for (const m of models) n += strayCompatKeys(m?.compat, api).length;
  return n;
}
function compatSummary(m) {
  const c = m?.compat;
  if (!c || typeof c !== "object") return "";
  const n = Object.keys(c).filter((k) => COMPAT_ALL_KEYS.includes(k)).length;
  return n ? `\u517C\u5BB9\u5F00\u5173 ${n} \u9879` : "";
}
function buildCompat(fields, tri, inherited, api) {
  if (!api || !COMPAT_OFFER[api]) return inherited && Object.keys(inherited).length ? inherited : void 0;
  const offer = COMPAT_OFFER[api];
  const out = {};
  for (const [k, v] of Object.entries(inherited ?? {})) {
    if (offer.includes(k)) out[k] = v;
  }
  const errors = [];
  for (const f of fields) {
    const raw = tri[f.key];
    if (raw === void 0 || raw === "") {
      delete out[f.key];
      continue;
    }
    if (f.kind === "bool") {
      if (raw === "true") out[f.key] = true;
      else if (raw === "false") out[f.key] = false;
      continue;
    }
    if (f.kind === "enum") {
      if (!f.options?.includes(raw)) {
        errors.push(`${f.label}\uFF1A\u503C "${raw}" \u4E0D\u5728\u53EF\u9009\u8303\u56F4`);
        continue;
      }
      out[f.key] = raw;
      continue;
    }
    try {
      const v = JSON.parse(raw);
      if (!v || typeof v !== "object" || Array.isArray(v)) {
        errors.push(`${f.label}\uFF1A\u5FC5\u987B\u662F JSON \u5BF9\u8C61`);
        continue;
      }
      if (Object.keys(v).length === 0) {
        delete out[f.key];
        continue;
      }
      out[f.key] = v;
    } catch {
      errors.push(`${f.label}\uFF1A\u4E0D\u662F\u5408\u6CD5 JSON`);
    }
  }
  if (errors.length) throw new Error(errors.join("\uFF1B"));
  return Object.keys(out).length ? out : void 0;
}
var llmScope = null;
var capsScope = null;
var REMOTE = null;
function fmtNum(n) {
  if (!n) return "\u2014";
  if (n >= 1e4) return Math.round(n / 1e3) / 10 + "\u4E07";
  return String(n);
}
function deriveKeyRef(provider) {
  const base = String(provider).toUpperCase().replace(/[^A-Z0-9]+/g, "_");
  return (/^[A-Z]/.test(base) ? base : "R_" + base) + "_API_KEY";
}
function hasVision(m) {
  return Array.isArray(m?.input) && m.input.includes("image");
}
function effortsLabel(m) {
  const e = m?.reasoningEfforts;
  if (e === void 0) return null;
  if (e === false) return "\u65E0\u63A8\u7406";
  if (typeof e === "object" && e !== null && !Array.isArray(e)) {
    const lvls = Object.keys(e).filter((k) => k !== "off" && e[k] !== "" && e[k] != null);
    if (lvls.length === 0) return "\u4EC5 off";
    return "\u63A8\u7406\uFF1A" + lvls.join("/");
  }
  return null;
}
function protoLabel(api) {
  return (PROTOCOLS.find((x) => x.v === api) ?? {}).label ?? api ?? "\u2014";
}
function fmtLatency(ms) {
  return ms != null && ms >= 1e3 ? Math.round(ms / 100) / 10 + "s" : (ms ?? 0) + "ms";
}
function testKey(provider, modelId) {
  return provider + "|" + modelId;
}
function chipLabel(m) {
  return (m.name && m.name !== m.id ? m.name + " \xB7 " : "") + m.id;
}
function jsonValue(value) {
  if (Array.isArray(value)) return value.map(jsonValue);
  if (!value || typeof value !== "object") return value;
  const out = {};
  for (const [key, child] of Object.entries(value)) {
    if (child !== void 0) out[key] = jsonValue(child);
  }
  return out;
}
function getProviders() {
  return llmScope?.getSnapshot().value?.providers ?? {};
}
async function writeProviders(mutate) {
  const snap = llmScope.getSnapshot();
  const providers = jsonValue(snap.value?.providers ?? {});
  const next = jsonValue(mutate(providers) ?? providers);
  const ops = [{ op: "set", path: ["providers"], value: next }];
  const response = await REMOTE.settings.mutate(LLM_NS, ops, snap.revision);
  if (!response.ok) throw new Error(friendlyReject(response.error?.message));
}
function friendlyReject(message) {
  const raw = String(message ?? "\u5199\u5165\u88AB\u62D2\u7EDD");
  if (raw.includes("resolves no models")) return "\u5BBF\u4E3B\u62D2\u7EDD\u4E86\u5199\u5165\uFF1A\u81EA\u5B9A\u4E49\u63D0\u4F9B\u5546\u5220\u9664\u540E\u5269\u4F59 0 \u4E2A\u6A21\u578B\u3002\u5185\u7F6E\u76EE\u5F55\u5916\u7684\u8DEF\u7531\u5FC5\u987B\u81F3\u5C11\u4FDD\u7559\u4E00\u4E2A\u6A21\u578B\uFF0C\u5982\u9700\u6E05\u7A7A\u8BF7\u5220\u9664\u6574\u4E2A\u63D0\u4F9B\u5546\u3002\uFF08" + raw + "\uFF09";
  return raw;
}
function assertNotLastModels(providers, providerName, ids) {
  const p = providers[providerName];
  if (!p) return;
  const remaining = (p.models ?? []).filter((m) => !ids.includes(m.id));
  if (remaining.length === 0 && (p.models ?? []).length > 0) {
    const err = new Error(
      `"${providerName}" \u7684\u6A21\u578B\u5C06\u5168\u90E8\u5220\u7A7A\u3002\u81EA\u5B9A\u4E49\u63D0\u4F9B\u5546\u5FC5\u987B\u81F3\u5C11\u4FDD\u7559\u4E00\u4E2A\u6A21\u578B\u3002\u4F60\u53EF\u4EE5\uFF1A\u2460 \u4FDD\u7559\u4E00\u4E2A\u6A21\u578B\uFF1B\u2461 \u7528\u300C\u6062\u590D\u9ED8\u8BA4\u300D\u628A\u5217\u8868\u4ECE\u914D\u7F6E\u91CC\u79FB\u9664\uFF08\u7F51\u5173\u4F1A\u6309\u5730\u5740\u81EA\u52A8\u63D0\u4F9B\u76EE\u5F55\uFF09\uFF1B\u2462 \u5220\u9664\u6574\u4E2A\u63D0\u4F9B\u5546\u3002`
    );
    err.code = "LAST_MODEL";
    err.providerName = providerName;
    throw err;
  }
}
function isNoCatalogReject(message) {
  return /resolves no models/.test(String(message ?? ""));
}
function getDisabledStore() {
  const value = capsScope?.getSnapshot?.()?.value;
  const out = {};
  const disabled = value?.disabled;
  if (!disabled || typeof disabled !== "object" || Array.isArray(disabled)) return out;
  for (const [route, entry] of Object.entries(disabled)) {
    const e = entry;
    if (!e || typeof e !== "object" || !e.profile || typeof e.profile !== "object") continue;
    out[route] = { profile: e.profile, ...typeof e.displayName === "string" && e.displayName ? { displayName: e.displayName } : {} };
  }
  return out;
}
async function actionDisableProvider(route) {
  const capsNs = requireCapsNs();
  const snap = llmScope.getSnapshot();
  const profile = jsonValue(snap.value?.providers?.[route]);
  if (!profile) throw new Error(`\u63D0\u4F9B\u5546 "${route}" \u4E0D\u5B58\u5728`);
  const capsSnap = capsScope.getSnapshot();
  const stash = { profile, displayName: String(profile.displayName ?? route) };
  const r1 = await REMOTE.settings.mutate(capsNs, [{ op: "set", path: ["disabled", route], value: stash }], capsSnap.revision);
  if (!r1.ok) throw new Error("\u5F52\u6863\u5931\u8D25\uFF1A" + (r1.error?.message ?? "\u5199\u5165\u88AB\u62D2\u7EDD"));
  const r2 = await REMOTE.settings.mutate(LLM_NS, [{ op: "unset", path: ["providers", route] }], snap.revision);
  if (!r2.ok) {
    await REMOTE.settings.mutate(capsNs, [{ op: "unset", path: ["disabled", route] }], capsSnap.revision).catch(() => {
    });
    throw new Error("\u79FB\u9664\u5931\u8D25\uFF1A" + (r2.error?.message ?? "\u5199\u5165\u88AB\u62D2\u7EDD"));
  }
}
async function actionEnableProvider(route) {
  const capsNs = requireCapsNs();
  const capsSnap = capsScope.getSnapshot();
  const stash = getDisabledStore()[route];
  if (!stash) throw new Error(`\u5F52\u6863\u4E2D\u6CA1\u6709 "${route}" \u7684\u8BB0\u5F55`);
  const llmSnap = llmScope.getSnapshot();
  if (llmSnap.value?.providers?.[route]) throw new Error(`\u63D0\u4F9B\u5546 "${route}" \u5DF2\u5728\u542F\u7528\u5217\u8868\u4E2D`);
  const r1 = await REMOTE.settings.mutate(LLM_NS, [{ op: "set", path: ["providers", route], value: jsonValue(stash.profile) }], llmSnap.revision);
  if (!r1.ok) throw new Error("\u6062\u590D\u5931\u8D25\uFF1A" + (r1.error?.message ?? "\u5199\u5165\u88AB\u62D2\u7EDD"));
  const r2 = await REMOTE.settings.mutate(capsNs, [{ op: "unset", path: ["disabled", route] }], capsSnap.revision);
  if (!r2.ok) throw new Error("\u6E05\u7406\u5F52\u6863\u5931\u8D25\uFF1A" + (r2.error?.message ?? "\u5199\u5165\u88AB\u62D2\u7EDD"));
}
async function actionPurgeDisabled(route) {
  const capsNs = requireCapsNs();
  const snap = capsScope.getSnapshot();
  const r = await REMOTE.settings.mutate(capsNs, [{ op: "unset", path: ["disabled", route] }], snap.revision);
  if (!r.ok) throw new Error(r.error?.message ?? "\u5199\u5165\u88AB\u62D2\u7EDD");
}
async function actionAddProvider(f) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(f.name)) throw new Error("\u8DEF\u7531\u540D\u79F0\u8BF7\u7528\u5C0F\u5199\u5B57\u6BCD/\u6570\u5B57/\u8FDE\u5B57\u7B26\uFF08\u5982 my-gateway\uFF09");
  if (!f.baseURL) throw new Error("Base URL \u5FC5\u586B");
  if (f.apiKey && String(f.apiKey).trim()) await REMOTE.credentials.set(deriveKeyRef(f.name), String(f.apiKey).trim());
  await writeProviders((providers) => {
    if (providers[f.name]) throw new Error(`\u63D0\u4F9B\u5546 "${f.name}" \u5DF2\u5B58\u5728`);
    providers[f.name] = {
      displayName: f.displayName || f.name,
      baseURL: f.baseURL,
      apiKeyEnv: deriveKeyRef(f.name),
      // ⚠️ v0.6.0 实测（宿主 resolveRouteModels L689）：路由级 api 会**覆盖**目录里每个模型自带的协议
      //   （`const api = request.api ?? base?.api ?? routeApi`）。给内置厂商写死 api 会让它的模型
      //   按错的协议发请求（如 anthropic 的模型被按 openai-completions 发）。故内置目录已知的路由
      //   一律不写 api，交给目录；只有自建路由才必须显式指定。
      ...!f.catalogKnown && f.api ? { api: f.api } : {},
      // ⚠️ 同理不写 models：空数组会被判「声明了空列表」，且 UI 会显示"0 个模型"与实际
      //   （目录提供全部模型）不符。省略字段 = 回退目录，这才是「跟随内置目录」的正确表达。
      //   仅当用户填了首个模型时才写 models。
      ...f.firstModelId ? {
        models: [{
          id: f.firstModelId,
          name: f.firstModelName || f.firstModelId,
          contextWindow: f.contextWindow || void 0,
          maxTokens: f.maxTokens || void 0,
          input: f.vision ? VISION : ["text"]
        }]
      } : {},
      // v0.6.0：只有用户明确配置了才写（undefined 会被 jsonValue 清掉，等于跟随官方默认）
      ...f.retryPolicy ? { retryPolicy: f.retryPolicy } : {}
    };
    return providers;
  });
}
async function actionSaveProviderEdits(name, fields) {
  if (fields.apiKey && String(fields.apiKey).trim()) {
    await REMOTE.credentials.set(deriveKeyRef(name), String(fields.apiKey).trim());
  }
  await writeProviders((providers) => {
    const p = providers[name];
    if (!p) throw new Error(`\u63D0\u4F9B\u5546 "${name}" \u4E0D\u5B58\u5728`);
    const apiChanged = p.api !== fields.api;
    p.displayName = fields.displayName || name;
    p.baseURL = fields.baseURL;
    if (fields.api) p.api = fields.api;
    else delete p.api;
    if (apiChanged) {
      for (const m of p.models ?? []) {
        const stray = strayCompatKeys(m?.compat, fields.api);
        if (!stray.length) continue;
        for (const k of stray) delete m.compat[k];
        if (Object.keys(m.compat).length === 0) delete m.compat;
      }
    }
    if (fields.retryPolicy === void 0) delete p.retryPolicy;
    else p.retryPolicy = fields.retryPolicy;
    return providers;
  });
}
async function actionDeleteProvider(name) {
  await writeProviders((providers) => {
    delete providers[name];
    return providers;
  });
}
async function actionAddModel(providerName, m) {
  await writeProviders((providers) => {
    const list = providers[providerName].models ?? [];
    if (list.some((x) => x.id === m.id)) throw new Error(`\u6A21\u578B "${m.id}" \u5DF2\u5B58\u5728`);
    list.push(m);
    providers[providerName].models = list;
    return providers;
  });
}
async function actionDeleteModel(providerName, modelId) {
  await writeProviders((providers) => {
    assertNotLastModels(providers, providerName, [modelId]);
    providers[providerName].models = (providers[providerName].models ?? []).filter((m) => m.id !== modelId);
    return providers;
  });
}
async function actionUpdateModel(providerName, modelId, entry) {
  await writeProviders((providers) => {
    const list = providers[providerName].models ?? [];
    const i = list.findIndex((m) => m.id === modelId);
    if (i < 0) throw new Error(`\u6A21\u578B "${modelId}" \u4E0D\u5B58\u5728`);
    list[i] = { ...list[i], ...entry };
    if (entry.reasoningEfforts === void 0 && "reasoningEfforts" in list[i]) {
      delete list[i].reasoningEfforts;
    }
    if (entry.compat === void 0 && "compat" in list[i]) {
      delete list[i].compat;
    }
    providers[providerName].models = list;
    return providers;
  });
}
async function actionListPresets() {
  const res = await REMOTE.llm.listConfigurableProviders();
  if (!res?.ok) throw new Error(res?.error?.message ?? "\u8BFB\u53D6\u9884\u7F6E\u5382\u5546\u5217\u8868\u5931\u8D25");
  return (Array.isArray(res.value) ? res.value : []).filter(
    (e) => e && typeof e.provider === "string" && e.settingsNs === LLM_NS
  );
}
function needsOAuthOnly(e) {
  const env = e?.nativeAuth?.env;
  const hasEnv = Array.isArray(env) ? env.length > 0 : !!env;
  return e?.nativeAuth?.oauth === true && !hasEnv;
}
function visiblePresets(all, configured) {
  let oauthOnly = 0;
  const list = [];
  for (const e of all) {
    if (e.declared === true) continue;
    if (e.provider in configured) continue;
    if (needsOAuthOnly(e)) {
      oauthOnly += 1;
      continue;
    }
    list.push(e);
  }
  return { list, oauthOnly };
}
async function actionPullModels(providerName) {
  const p = getProviders()[providerName];
  const response = await REMOTE.llm.discoverModels(LLM_NS, { provider: providerName, api: p.api, baseURL: p.baseURL });
  if (!response.ok) throw new Error(response.error?.message ?? "\u62C9\u53D6\u5931\u8D25");
  const raw = Array.isArray(response.value) ? response.value : Array.isArray(response.value?.models) ? response.value.models : [];
  const found = raw.filter((m) => m && m.id).map((m) => ({
    id: m.id,
    name: m.name || m.id,
    ...m.contextWindow !== void 0 ? { contextWindow: m.contextWindow } : {},
    ...m.maxTokens !== void 0 ? { maxTokens: m.maxTokens } : {},
    input: Array.isArray(m.input) ? m.input : ["text"]
  }));
  const existing = new Set((getProviders()[providerName]?.models ?? []).map((m) => m.id));
  const fresh = found.filter((m) => !existing.has(m.id));
  return { all: found, fresh, skipped: found.length - fresh.length, existing };
}
async function actionAddPulled(providerName, picked) {
  await writeProviders((providers) => {
    const list = providers[providerName].models ?? [];
    for (const m of picked) {
      if (!list.some((x) => x.id === m.id)) list.push(m);
    }
    providers[providerName].models = list;
    return providers;
  });
}
async function actionRemoveModels(providerName, ids) {
  const set = new Set(ids);
  await writeProviders((providers) => {
    assertNotLastModels(providers, providerName, ids);
    providers[providerName].models = (providers[providerName].models ?? []).filter((m) => !set.has(m.id));
    return providers;
  });
}
async function actionResetModels(providerName) {
  try {
    await writeProviders((providers) => {
      const p = providers[providerName];
      if (!p) throw new Error(`\u63D0\u4F9B\u5546 "${providerName}" \u4E0D\u5B58\u5728`);
      delete p.models;
      return providers;
    });
  } catch (e) {
    if (isNoCatalogReject(e?.message)) {
      throw new Error(
        `"${providerName}" \u4E0D\u5728\u5185\u7F6E\u6A21\u578B\u76EE\u5F55\u91CC\uFF08\u81EA\u5EFA\u7F51\u5173\uFF09\uFF0C\u6CA1\u6709\u53EF\u56DE\u9000\u7684\u9ED8\u8BA4\u76EE\u5F55\u3002\u8BF7\u6539\u7528\uFF1A\u2460 \u4FDD\u7559\u81F3\u5C11\u4E00\u4E2A\u6A21\u578B\uFF1B\u2461 \u5220\u9664\u6574\u4E2A\u63D0\u4F9B\u5546\u3002`
      );
    }
    throw e;
  }
}
async function actionMoveModelTo(providerName, modelId, toIndex) {
  await writeProviders((providers) => {
    const list = providers[providerName].models ?? [];
    const i = list.findIndex((m) => m.id === modelId);
    if (i < 0) throw new Error(`\u6A21\u578B "${modelId}" \u4E0D\u5B58\u5728`);
    const j = Math.max(0, Math.min(toIndex, list.length - 1));
    if (i === j) return providers;
    const [item] = list.splice(i, 1);
    list.splice(j, 0, item);
    return providers;
  });
}
function ModelRow({ provider, m, t, checked, index, onReorder, onTest, onEdit, onDelete, onToggleCheck, ro }) {
  const [drop, setDrop] = React2.useState("");
  const drag = !ro && !!onReorder;
  return /* @__PURE__ */ React2.createElement(
    "div",
    {
      className: "dpk-rowitem" + (drag ? " dpk-rowitem-drag" : ""),
      style: ro ? { opacity: 0.7 } : void 0,
      draggable: drag || void 0,
      onDragStart: drag ? (e) => {
        e.dataTransfer.setData("text/plain", m.id);
        e.dataTransfer.effectAllowed = "move";
      } : void 0,
      onDragEnd: drag ? () => setDrop("") : void 0,
      onDragOver: drag ? (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        const r = e.currentTarget.getBoundingClientRect();
        const side = e.clientY < r.top + r.height / 2 ? "top" : "bottom";
        if (side !== drop) setDrop(side);
      } : void 0,
      onDragLeave: drag ? () => setDrop("") : void 0,
      onDrop: drag ? (e) => {
        e.preventDefault();
        const side = drop === "top" ? "top" : "bottom";
        setDrop("");
        const fromId = e.dataTransfer.getData("text/plain");
        if (fromId && fromId !== m.id && index !== void 0) onReorder(fromId, index, side);
      } : void 0
    },
    drop === "top" ? /* @__PURE__ */ React2.createElement("div", { className: "dpk-dropline dpk-dropline-top", "aria-hidden": "true" }) : null,
    drag ? /* @__PURE__ */ React2.createElement("span", { className: "dpk-draghandle", title: "\u6309\u4F4F\u53EF\u62D6\u52A8\u8C03\u6574\u987A\u5E8F" }, "\u283F") : null,
    ro ? null : /* @__PURE__ */ React2.createElement(Checkbox, { checked, onChange: onToggleCheck }),
    /* @__PURE__ */ React2.createElement("div", { className: "dpk-cell" }, /* @__PURE__ */ React2.createElement("div", { className: "dpk-cell-title", title: m.id }, m.name && m.name !== m.id ? m.name : m.id), /* @__PURE__ */ React2.createElement("div", { className: "dpk-cell-sub" }, /* @__PURE__ */ React2.createElement(Mono, null, m.id), " \xB7 ", fmtNum(m.contextWindow), " ctx \xB7 ", fmtNum(m.maxTokens), " out \xB7 ", hasVision(m) ? "\u8BC6\u56FE" : "\u6587\u672C", effortsLabel(m) ? " \xB7 " + effortsLabel(m) : "", compatSummary(m) ? " \xB7 " + compatSummary(m) : ""), t?.status === "fail" ? /* @__PURE__ */ React2.createElement("div", { className: "dpk-merr" }, /* @__PURE__ */ React2.createElement("b", null, "\u5931\u8D25\uFF1A"), t.error) : null, t?.status === "ok" && (t.latencyMs ?? 0) >= 1e4 ? /* @__PURE__ */ React2.createElement(Hint, null, "\u901A\u8FC7 ", fmtLatency(t.latencyMs), " \xB7 \u7F51\u5173\u9996\u5B57\u8282\u6162\uFF0C\u65E5\u5E38\u5BF9\u8BDD\u53EF\u7528\uFF0C\u4ECB\u610F\u5EF6\u8FDF\u53EF\u6362\u8DEF\u7531") : null),
    ro ? /* @__PURE__ */ React2.createElement(StateBadge, { state: "idle" }, "\u5DF2\u7981\u7528") : t ? t.status === "testing" ? /* @__PURE__ */ React2.createElement(StateBadge, { state: "testing" }, "\u6D4B\u8BD5\u4E2D\u2026", t.elapsed != null ? " " + Math.round(t.elapsed / 1e3) + "s" : "") : t.status === "ok" ? /* @__PURE__ */ React2.createElement(StateBadge, { state: "ok" }, "\u901A\u8FC7 ", fmtLatency(t.latencyMs)) : /* @__PURE__ */ React2.createElement(StateBadge, { state: "fail" }, "\u5931\u8D25") : /* @__PURE__ */ React2.createElement(StateBadge, { state: "idle" }, "\u672A\u6D4B"),
    ro ? null : /* @__PURE__ */ React2.createElement("div", { className: "dpk-ops" }, /* @__PURE__ */ React2.createElement(Button, { size: "sm", disabled: t?.status === "testing", onClick: onTest }, t?.status === "fail" ? "\u91CD\u8BD5" : t?.status === "testing" ? "\u6D4B\u8BD5\u4E2D" : "\u6D4B\u8BD5"), /* @__PURE__ */ React2.createElement(Button, { size: "sm", onClick: onEdit }, "\u7F16\u8F91"), /* @__PURE__ */ React2.createElement(ConfirmButton, { confirmText: "\u786E\u8BA4\u5220\u9664\uFF1F", onConfirm: onDelete }, "\u5220\u9664")),
    drop === "bottom" ? /* @__PURE__ */ React2.createElement("div", { className: "dpk-dropline dpk-dropline-bottom", "aria-hidden": "true" }) : null
  );
}
function PullPanel({ models, existing, onJoin }) {
  const [search, setSearch] = React2.useState("");
  const [picked, setPicked] = React2.useState(() => new Set(models.filter((m) => !existing.has(m.id)).map((m) => m.id)));
  const fresh = models.filter((m) => !existing.has(m.id));
  const q = search.trim().toLowerCase();
  const matches = (m) => (m.name + " " + m.id).toLowerCase().includes(q);
  const visible = fresh.filter(matches);
  const empty = models.length === 0;
  const allConfigured = !empty && fresh.length === 0;
  const noneMatched = fresh.length > 0 && visible.length === 0;
  const allPicked = visible.length > 0 && visible.every((m) => picked.has(m.id));
  const togglePick = (id) => setPicked((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
  const toggleAll = () => setPicked((prev) => {
    const next = new Set(prev);
    if (allPicked) {
      for (const m of visible) next.delete(m.id);
    } else {
      for (const m of visible) next.add(m.id);
    }
    return next;
  });
  let hint;
  if (empty) hint = "\u7F51\u5173\u6CA1\u6709\u8FD4\u56DE\u4EFB\u4F55\u6A21\u578B\uFF08\u68C0\u67E5\u7F51\u5173\u662F\u5426\u652F\u6301 /v1/models \u63A5\u53E3\uFF09\uFF0C\u53EF\u7528\u300C\u624B\u52A8\u6DFB\u52A0\u300D\u5F55\u5165";
  else if (allConfigured) hint = `\u6CA1\u6709\u53EF\u52A0\u5165\u7684\u65B0\u6A21\u578B\uFF08\u7F51\u5173\u7684 ${models.length} \u4E2A\u6A21\u578B\u90FD\u5DF2\u914D\u7F6E\uFF09`;
  else if (noneMatched) hint = `\u6CA1\u6709\u5339\u914D\u300C${search}\u300D\u7684\u6A21\u578B`;
  else hint = `\u5C06\u52A0\u5165 ${picked.size} \u4E2A\u65B0\u6A21\u578B${fresh.length !== models.length ? `\uFF08\u5DF2\u914D\u7F6E\u7684 ${models.length - fresh.length} \u4E2A\u81EA\u52A8\u8DF3\u8FC7\uFF09` : ""}`;
  return /* @__PURE__ */ React2.createElement("div", { className: "dpk-pullpanel" }, /* @__PURE__ */ React2.createElement("div", { className: "dpk-pullbar" }, /* @__PURE__ */ React2.createElement(SearchInput, { placeholder: "\u641C\u7D22\u6A21\u578B\u540D\u2026", value: search, onChange: (e) => setSearch(e.target.value) }), /* @__PURE__ */ React2.createElement(Button, { size: "sm", disabled: visible.length === 0, onClick: toggleAll }, allPicked ? "\u53D6\u6D88\u5168\u9009" : "\u5168\u9009")), /* @__PURE__ */ React2.createElement("div", { className: "dpk-chips" }, !empty ? models.filter(matches).map((m) => {
    if (existing.has(m.id)) return /* @__PURE__ */ React2.createElement(Chip, { key: m.id, exist: true }, chipLabel(m));
    const on = picked.has(m.id);
    return /* @__PURE__ */ React2.createElement(Chip, { key: m.id, on, onClick: () => togglePick(m.id) }, chipLabel(m), on ? " \u2713" : "");
  }) : null), /* @__PURE__ */ React2.createElement("div", { className: "dpk-pullops" }, /* @__PURE__ */ React2.createElement(Hint, null, hint), !empty && fresh.length > 0 ? /* @__PURE__ */ React2.createElement(
    Button,
    {
      size: "sm",
      variant: "primary",
      disabled: picked.size === 0,
      onClick: () => onJoin(models.filter((m) => !existing.has(m.id) && picked.has(m.id)))
    },
    "\u52A0\u5165\u6240\u9009"
  ) : null));
}
function ProviderForm({ mode, provider, onDone }) {
  const isEdit = mode === "editProvider";
  const p = isEdit ? getProviders()[provider] ?? {} : {};
  const [name, setName] = React2.useState(provider ?? "");
  const [displayName, setDisplayName] = React2.useState(p.displayName ?? "");
  const [api, setApi] = React2.useState(p.api ?? (isEdit ? "" : "openai-completions"));
  const [baseURL, setBaseURL] = React2.useState(p.baseURL ?? "");
  const [apiKey, setApiKey] = React2.useState("");
  const [firstModelId, setFirstModelId] = React2.useState("");
  const [vision, setVision] = React2.useState(false);
  const [err, setErr] = React2.useState(null);
  const rp = p.retryPolicy && typeof p.retryPolicy === "object" ? p.retryPolicy : null;
  const [retryMode, setRetryMode] = React2.useState(
    rp?.mode === "always" ? "always" : rp?.mode === "normal" ? "normal" : "default"
  );
  const [retryMax, setRetryMax] = React2.useState(rp?.maxRetries != null ? String(rp.maxRetries) : "");
  const [retryCodes, setRetryCodes] = React2.useState(
    Array.isArray(rp?.retryableCodes) ? rp.retryableCodes.join(", ") : ""
  );
  const [retryInit, setRetryInit] = React2.useState(rp?.backoff?.initialDelayMs != null ? String(rp.backoff.initialDelayMs) : "");
  const [retryMaxDelay, setRetryMaxDelay] = React2.useState(rp?.backoff?.maxDelayMs != null ? String(rp.backoff.maxDelayMs) : "");
  const [retryJitter, setRetryJitter] = React2.useState(rp?.backoff?.jitterRatio != null ? String(rp.backoff.jitterRatio) : "");
  const [presets, setPresets] = React2.useState(null);
  const [presetErr, setPresetErr] = React2.useState(null);
  React2.useEffect(() => {
    let alive = true;
    actionListPresets().then((list) => {
      if (alive) setPresets(list);
    }).catch((e) => {
      if (alive) setPresetErr(e?.message ?? String(e));
    });
    return () => {
      alive = false;
    };
  }, []);
  const applyPreset = (route) => {
    const hit = (presets ?? []).find((x) => x.provider === route);
    if (!hit) return;
    setName(hit.provider);
    setDisplayName(hit.displayName && hit.displayName !== hit.provider ? hit.displayName : "");
    setBaseURL(hit.defaultBaseURL ?? "");
    setApi("openai-completions");
    setErr(null);
  };
  const presetView = React2.useMemo(() => visiblePresets(presets ?? [], getProviders()), [presets]);
  const catalogKnownNow = (presets ?? []).some((x) => x.provider === name.trim());
  const submit = () => {
    const fail = (e) => {
      let m = e?.message ?? String(e);
      if (/resolves no models/.test(m)) m = "\u8BE5\u8DEF\u7531\u4E0D\u5728\u5185\u7F6E\u76EE\u5F55\u4E2D\uFF0C\u5FC5\u987B\u81F3\u5C11\u5217\u51FA\u4E00\u4E2A\u6A21\u578B\uFF08\u6A21\u578B ID \u7559\u7A7A\u4EC5\u5BF9\u5185\u7F6E\u76EE\u5F55\u5DF2\u77E5\u7684\u8DEF\u7531\u6709\u6548\uFF09";
      setErr(m);
      toast(m, "error");
    };
    try {
      if (!baseURL.trim()) throw new Error("Base URL \u5FC5\u586B");
      if (isEdit) {
        const retryPolicy = buildRetryPolicy({
          mode: retryMode,
          maxRetries: retryMax,
          codes: retryCodes,
          initialDelayMs: retryInit,
          maxDelayMs: retryMaxDelay,
          jitterRatio: retryJitter
        });
        actionSaveProviderEdits(provider, {
          displayName: displayName.trim(),
          api,
          baseURL: baseURL.trim(),
          apiKey,
          retryPolicy
        }).then(() => {
          toast(`\u5DF2\u4FDD\u5B58\u63D0\u4F9B\u5546 ${provider}`, "success");
          onDone();
        }).catch(fail);
      } else {
        const n = name.trim();
        if (!/^[a-z0-9][a-z0-9-]*$/.test(n)) throw new Error("\u8DEF\u7531\u540D\u79F0\u8BF7\u7528\u5C0F\u5199\u5B57\u6BCD/\u6570\u5B57/\u8FDE\u5B57\u7B26\uFF08\u5982 my-gateway\uFF09");
        const catalogKnown = (presets ?? []).some((x) => x.provider === n);
        if (!catalogKnown && !firstModelId.trim()) {
          throw new Error("\u81EA\u5EFA\u8DEF\u7531\u5FC5\u987B\u81F3\u5C11\u586B\u4E00\u4E2A\u6A21\u578B ID\uFF08\u5185\u7F6E\u76EE\u5F55\u4E0D\u8BA4\u8BC6\u8BE5\u8DEF\u7531\uFF0C\u65E0\u6CD5\u81EA\u52A8\u5E26\u51FA\u6A21\u578B\uFF09");
        }
        actionAddProvider({
          name: n,
          displayName: displayName.trim(),
          baseURL: baseURL.trim(),
          api,
          apiKey: apiKey.trim(),
          firstModelId: firstModelId.trim(),
          firstModelName: "",
          vision,
          catalogKnown,
          retryPolicy: buildRetryPolicy({
            mode: retryMode,
            maxRetries: retryMax,
            codes: retryCodes,
            initialDelayMs: retryInit,
            maxDelayMs: retryMaxDelay,
            jitterRatio: retryJitter
          })
        }).then(() => {
          toast(`\u5DF2\u6DFB\u52A0\u63D0\u4F9B\u5546 ${n}`, "success");
          onDone();
        }).catch(fail);
      }
    } catch (e) {
      fail(e);
    }
  };
  return /* @__PURE__ */ React2.createElement("div", null, /* @__PURE__ */ React2.createElement(
    FormHead,
    {
      title: isEdit ? `\u7F16\u8F91\u63D0\u4F9B\u5546 \xB7 ${provider}` : "\u65B0\u589E\u63D0\u4F9B\u5546",
      leading: /* @__PURE__ */ React2.createElement(Button, { size: "sm", onClick: onDone }, "\u2190 \u8FD4\u56DE")
    }
  ), /* @__PURE__ */ React2.createElement("div", { className: "dpk-formhint" }, "\u63D0\u4F9B\u5546 = \u8BF7\u6C42\u5730\u5740 + \u51ED\u636E + \u534F\u8BAE\uFF1BKey \u5199\u5165\u51ED\u636E\u5E93\uFF0C\u4FDD\u5B58\u5373\u70ED\u751F\u6548\u3002"), !isEdit ? /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(Field, { label: "\u4ECE\u9884\u7F6E\u5382\u5546\u9009\u62E9\uFF08\u53EF\u9009\uFF0C\u9009\u4E2D\u540E\u81EA\u52A8\u586B\u597D\u5730\u5740\uFF09" }, /* @__PURE__ */ React2.createElement(
    ComboBox,
    {
      value: name.trim(),
      placeholder: "\u2014 \u81EA\u5B9A\u4E49 / \u624B\u52A8\u586B\u5199 \u2014",
      options: presetView.list.map((x) => ({
        value: x.provider,
        label: x.provider,
        description: x.defaultBaseURL ?? "\u9700\u81EA\u586B\u5730\u5740"
      })),
      onChange: (v) => {
        if (v) applyPreset(v);
      },
      emptyText: "\u6CA1\u6709\u5339\u914D\u7684\u5382\u5546\uFF0C\u53EF\u76F4\u63A5\u624B\u586B"
    }
  )), presetErr ? /* @__PURE__ */ React2.createElement(Hint, null, "\u9884\u7F6E\u5217\u8868\u8BFB\u53D6\u5931\u8D25\uFF08\u4E0D\u5F71\u54CD\u624B\u586B\uFF09\uFF1A", presetErr) : presets === null ? /* @__PURE__ */ React2.createElement(Hint, null, "\u6B63\u5728\u8BFB\u53D6\u5B98\u65B9\u9884\u7F6E\u5382\u5546\u5217\u8868\u2026") : /* @__PURE__ */ React2.createElement(Hint, null, "\u53EF\u6DFB\u52A0 ", presetView.list.length, " \u4E2A\u5185\u7F6E\u5382\u5546\uFF08\u5DF2\u914D\u7F6E\u7684\u4E0E\u81EA\u5EFA\u8DEF\u7531\u4E0D\u5728\u5217\u8868\u91CC\uFF09\u3002", presetView.oauthOnly > 0 ? `\u53E6\u6709 ${presetView.oauthOnly} \u4E2A\u9700 OAuth \u767B\u5F55\uFF0C\u586B API Key \u8FDE\u4E0D\u901A\uFF0C\u6545\u672A\u5217\u51FA\u3002` : "", "\u9009\u4E2D\u53EA\u505A\u9884\u586B\uFF0C\u4ECD\u53EF\u81EA\u7531\u4FEE\u6539\uFF1B\u6A21\u578B\u5217\u8868\u7559\u7A7A\u65F6\u7531\u5185\u7F6E\u76EE\u5F55\u81EA\u52A8\u5E26\u51FA\u3002")) : null, !isEdit ? /* @__PURE__ */ React2.createElement(Field, { label: "\u8DEF\u7531\u540D\u79F0\uFF08\u5C0F\u5199\u5B57\u6BCD/\u6570\u5B57/\u8FDE\u5B57\u7B26\uFF09" }, /* @__PURE__ */ React2.createElement(Input, { value: name, onChange: (e) => setName(e.target.value), placeholder: "my-gateway" })) : null, !isEdit && catalogKnownNow ? /* @__PURE__ */ React2.createElement(Hint, { style: { marginTop: 6 } }, "\u300C", name.trim(), "\u300D\u662F\u5185\u7F6E\u5382\u5546\uFF1A", /* @__PURE__ */ React2.createElement("b", null, "\u534F\u8BAE\u4E0E\u6A21\u578B\u90FD\u7531\u5185\u7F6E\u76EE\u5F55\u63D0\u4F9B"), "\uFF0C\u4E0D\u7528\u586B\u3002", firstModelId.trim() ? "\uFF08\u4F60\u586B\u4E86\u6A21\u578B ID\uFF0C\u5C06\u4EE5\u4F60\u7684\u58F0\u660E\u4E3A\u51C6\uFF0C\u53EA\u5217\u8FD9\u4E00\u4E2A\uFF09" : "") : null, /* @__PURE__ */ React2.createElement(Field, { label: "\u663E\u793A\u540D\u79F0" }, /* @__PURE__ */ React2.createElement(Input, { value: displayName, onChange: (e) => setDisplayName(e.target.value), placeholder: "\u4E0E\u8DEF\u7531\u540D\u79F0\u76F8\u540C\u53EF\u7559\u7A7A" })), isEdit || !catalogKnownNow ? /* @__PURE__ */ React2.createElement(Field, { label: "API \u534F\u8BAE" }, /* @__PURE__ */ React2.createElement(Select, { value: api, onChange: (e) => setApi(e.target.value) }, isEdit && !p.api ? /* @__PURE__ */ React2.createElement("option", { value: "" }, "\u2014 \u4E0D\u6307\u5B9A\uFF08\u8DDF\u968F\u5185\u7F6E\u76EE\u5F55\uFF0C\u63A8\u8350\uFF09\u2014") : null, PROTOCOLS.map((x) => /* @__PURE__ */ React2.createElement("option", { key: x.v, value: x.v }, x.label)))) : null, isEdit && api !== (p.api ?? "") && strayCompatCount(provider, api) > 0 ? /* @__PURE__ */ React2.createElement(FormError, null, "\u5207\u6362\u534F\u8BAE\u540E\uFF0C\u8BE5\u63D0\u4F9B\u5546\u4E0B\u5171 ", strayCompatCount(provider, api), " \u4E2A\u6A21\u578B\u7EA7\u517C\u5BB9\u5F00\u5173\u4E0D\u5C5E\u4E8E\u300C", api, "\u300D\uFF0C\u4FDD\u5B58\u65F6\u4F1A\u81EA\u52A8\u6E05\u9664\uFF08\u5426\u5219\u5BBF\u4E3B\u4F1A\u6574\u5355\u62D2\u7EDD\uFF09\u3002") : null, /* @__PURE__ */ React2.createElement(Field, { label: "Base URL" }, /* @__PURE__ */ React2.createElement(Input, { value: baseURL, onChange: (e) => setBaseURL(e.target.value), placeholder: "https://\u2026/v1" })), !isEdit ? /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(Field, { label: "API Key\uFF08\u53EF\u7559\u7A7A\uFF09" }, /* @__PURE__ */ React2.createElement(Input, { type: "password", value: apiKey, onChange: (e) => setApiKey(e.target.value), placeholder: "sk-\u2026\uFF08\u672C\u5730\u6A21\u578B/\u514D\u9274\u6743\u7F51\u5173\u53EF\u7559\u7A7A\uFF09" })), /* @__PURE__ */ React2.createElement(Field, { label: catalogKnownNow ? "\u9996\u4E2A\u6A21\u578B ID\uFF08\u53EF\u7559\u7A7A\uFF0C\u7559\u7A7A\u5373\u7528\u76EE\u5F55\u5168\u90E8\u6A21\u578B\uFF09" : "\u9996\u4E2A\u6A21\u578B ID\uFF08\u81EA\u5EFA\u8DEF\u7531\u5FC5\u586B\uFF09" }, /* @__PURE__ */ React2.createElement(Input, { value: firstModelId, onChange: (e) => setFirstModelId(e.target.value), placeholder: "deepseek-v4-flash" })), /* @__PURE__ */ React2.createElement(Hint, null, catalogKnownNow ? "\u7559\u7A7A = \u5B8C\u5168\u8DDF\u968F\u5185\u7F6E\u76EE\u5F55\uFF08\u63A8\u8350\uFF09\uFF1B\u586B\u4E86\u5219\u53EA\u5217\u8FD9\u4E00\u4E2A\u6A21\u578B\u3002" : "\u5185\u7F6E\u76EE\u5F55\u4E0D\u8BA4\u8BC6\u8BE5\u8DEF\u7531\uFF0C\u5FC5\u987B\u81F3\u5C11\u5217\u4E00\u4E2A\u6A21\u578B\uFF0C\u5426\u5219\u5BBF\u4E3B\u4F1A\u62D2\u7EDD\u3002"), /* @__PURE__ */ React2.createElement(Row, null, /* @__PURE__ */ React2.createElement(Switch, { checked: vision, onChange: setVision }), /* @__PURE__ */ React2.createElement(Hint, null, "\u8BE5\u6A21\u578B\u652F\u6301\u8BC6\u56FE\uFF1F"))) : /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(Field, { label: "API Key\uFF08\u53EF\u9009\uFF0C\u7559\u7A7A\u4FDD\u6301\u4E0D\u53D8\uFF09" }, /* @__PURE__ */ React2.createElement(Input, { type: "password", value: apiKey, onChange: (e) => setApiKey(e.target.value), placeholder: p.apiKeyEnv ? "\u7559\u7A7A = \u6CBF\u7528\u5F53\u524D Key" : "sk-\u2026" })), /* @__PURE__ */ React2.createElement(Hint, null, "Key \u5F15\u7528\uFF1A", p.apiKeyEnv ?? "\u2014", "\uFF1B\u51ED\u636E\u5E93\u8986\u76D6\u5373\u70ED\u751F\u6548\uFF0C\u65E0\u9700\u91CD\u542F\u3002")), /* @__PURE__ */ React2.createElement(FormHead, { title: "\u5931\u8D25\u91CD\u8BD5\uFF08retryPolicy\uFF09", size: 13, style: { marginTop: 10 } }), /* @__PURE__ */ React2.createElement(Row, { gap: 6 }, /* @__PURE__ */ React2.createElement(Button, { size: "sm", variant: retryMode === "default" ? "primary" : "neutral", onClick: () => setRetryMode("default") }, "\u8DDF\u968F\u5B98\u65B9\u9ED8\u8BA4"), /* @__PURE__ */ React2.createElement(Button, { size: "sm", variant: retryMode === "normal" ? "primary" : "neutral", onClick: () => setRetryMode("normal") }, "\u9650\u6B21\u91CD\u8BD5 normal"), /* @__PURE__ */ React2.createElement(Button, { size: "sm", variant: retryMode === "always" ? "primary" : "neutral", onClick: () => setRetryMode("always") }, "\u65E0\u9650\u91CD\u8BD5 always")), retryMode === "default" ? /* @__PURE__ */ React2.createElement(Hint, null, "\u4E0D\u5199 retryPolicy \u5B57\u6BB5\uFF1Anormal \u6A21\u5F0F\u3001\u6700\u591A\u91CD\u8BD5 5 \u6B21\uFF0C\u53EA\u91CD\u8BD5\u77AC\u65F6\u9519\u8BEF\u3002\u6362\u56DE\u9ED8\u8BA4\u65F6\u65E7\u914D\u7F6E\u4F1A\u88AB\u5220\u9664\u3002") : null, retryMode === "normal" ? /* @__PURE__ */ React2.createElement(Row, { gap: 8, align: "flex-end", style: { marginTop: 8 } }, /* @__PURE__ */ React2.createElement(Field, { label: "\u6700\u5927\u91CD\u8BD5\u6B21\u6570\uFF08\u7559\u7A7A=5\uFF09" }, /* @__PURE__ */ React2.createElement(Input, { type: "number", min: "0", value: retryMax, onChange: (e) => setRetryMax(e.target.value), placeholder: "5" })), /* @__PURE__ */ React2.createElement(Field, { label: "\u53EF\u91CD\u8BD5\u9519\u8BEF\u7801\uFF08\u9017\u53F7\u5206\u9694\uFF0C\u7559\u7A7A=\u5B98\u65B9\u9ED8\u8BA4\u96C6\uFF09" }, /* @__PURE__ */ React2.createElement(Input, { value: retryCodes, onChange: (e) => setRetryCodes(e.target.value), placeholder: RETRY_CODES_HINT, style: { minWidth: 320 } }))) : null, retryMode === "always" ? /* @__PURE__ */ React2.createElement(Hint, null, "\u6BCF\u6B21\u5931\u8D25\u90FD\u91CD\u8BD5\uFF0C\u76F4\u5230\u6210\u529F\u3001\u53D6\u6D88\u6216\u4F1A\u8BDD\u9500\u6BC1\u3002\u7F51\u5173\u957F\u671F\u4E0D\u53EF\u7528\u65F6\u4F1A\u4E00\u76F4\u5361\u5728\u91CD\u8BD5\u4E0A\uFF0C\u8BF7\u8C28\u614E\u542F\u7528\u3002") : null, retryMode !== "default" ? /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(Row, { gap: 8, align: "flex-end", style: { marginTop: 6 } }, /* @__PURE__ */ React2.createElement(Field, { label: "\u9000\u907F\u521D\u59CB\u5EF6\u8FDF ms\uFF08\u7559\u7A7A=500\uFF09" }, /* @__PURE__ */ React2.createElement(Input, { type: "number", min: "1", value: retryInit, onChange: (e) => setRetryInit(e.target.value), placeholder: "500" })), /* @__PURE__ */ React2.createElement(Field, { label: "\u9000\u907F\u6700\u5927\u5EF6\u8FDF ms\uFF08\u7559\u7A7A=10000\uFF09" }, /* @__PURE__ */ React2.createElement(Input, { type: "number", min: "1", value: retryMaxDelay, onChange: (e) => setRetryMaxDelay(e.target.value), placeholder: "10000" })), /* @__PURE__ */ React2.createElement(Field, { label: "\u6296\u52A8\u6BD4 0~1\uFF08\u7559\u7A7A=0.1\uFF09" }, /* @__PURE__ */ React2.createElement(Input, { type: "number", min: "0", max: "1", step: "0.05", value: retryJitter, onChange: (e) => setRetryJitter(e.target.value), placeholder: "0.1" })))) : null, err ? /* @__PURE__ */ React2.createElement(FormError, null, err) : null, /* @__PURE__ */ React2.createElement(FormOps, null, /* @__PURE__ */ React2.createElement(Button, { onClick: onDone }, "\u53D6\u6D88"), /* @__PURE__ */ React2.createElement(Button, { variant: "primary", onClick: submit }, isEdit ? "\u4FDD\u5B58" : "\u521B\u5EFA")));
}
function ModelForm({ mode, provider, modelId, onDone }) {
  const isEdit = mode === "editModel";
  const list = getProviders()[provider]?.models ?? [];
  const m = isEdit ? list.find((x) => x.id === modelId) ?? {} : {};
  const [id, setId] = React2.useState(m.id ?? "");
  const [display, setDisplay] = React2.useState(m.name ?? "");
  const [ctx, setCtx] = React2.useState(m.contextWindow ?? "");
  const [max, setMax] = React2.useState(m.maxTokens ?? "");
  const [vision, setVision] = React2.useState(!!m.input?.includes("image"));
  const [err, setErr] = React2.useState(null);
  const effortsRaw = m.reasoningEfforts;
  const [effortsMode, setEffortsMode] = React2.useState(
    effortsRaw === void 0 ? "inherit" : effortsRaw === false ? "none" : "levels"
  );
  const [efforts, setEfforts] = React2.useState(
    () => {
      if (effortsRaw && typeof effortsRaw === "object" && !Array.isArray(effortsRaw)) {
        const out = {};
        for (const lvl of THINKING_LEVELS) {
          const w = effortsRaw[lvl];
          out[lvl] = typeof w === "string" ? w : "";
        }
        return out;
      }
      return {};
    }
  );
  const setLevelWire = (lvl, v) => setEfforts((e) => ({ ...e, [lvl]: v }));
  const applyPreset = () => {
    setEfforts(Object.fromEntries(THINKING_LEVELS.map((l) => [l, l === "off" ? "" : l])));
    setEffortsMode("levels");
  };
  const providerApiRaw = getProviders()[provider]?.api;
  const providerApi = typeof providerApiRaw === "string" && providerApiRaw ? providerApiRaw : "";
  const compatFields = COMPAT_FIELDS[providerApi] ?? [];
  const [compatOpen, setCompatOpen] = React2.useState(false);
  const [compatTri, setCompatTri] = React2.useState(() => {
    const out = {};
    const c = m.compat && typeof m.compat === "object" ? m.compat : {};
    for (const f of COMPAT_FIELDS[providerApi] ?? []) {
      const v = c[f.key];
      if (v === void 0 || v === null) out[f.key] = "";
      else if (f.kind === "bool") out[f.key] = v ? "true" : "false";
      else if (f.kind === "json") {
        const isEmpty = v && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0;
        out[f.key] = isEmpty ? "" : JSON.stringify(v);
      } else out[f.key] = String(v);
    }
    return out;
  });
  const setTri = (key, v) => setCompatTri((t) => ({ ...t, [key]: v }));
  const submit = () => {
    const finalId = isEdit ? modelId : id.trim();
    if (!finalId) {
      setErr("\u6A21\u578B ID \u5FC5\u586B");
      toast("\u6A21\u578B ID \u5FC5\u586B", "error");
      return;
    }
    let reasoningEfforts = void 0;
    if (effortsMode === "none") reasoningEfforts = false;
    else if (effortsMode === "levels") {
      const declared = Object.entries(efforts).filter(([lvl, wire]) => wire !== "" && wire != null);
      if (declared.length === 0) {
        setErr("\u58F0\u660E\u6863\u4F4D\u65F6\u81F3\u5C11\u52FE\u9009/\u586B\u5199\u4E00\u4E2A off \u4EE5\u5916\u7684\u6863\u4F4D");
        toast("\u58F0\u660E\u6863\u4F4D\u65F6\u81F3\u5C11\u586B\u5199\u4E00\u4E2A\u6863\u4F4D", "error");
        return;
      }
      const hasBeyondOff = declared.some(([lvl]) => lvl !== "off");
      if (!hasBeyondOff) {
        setErr("\u81F3\u5C11\u58F0\u660E\u4E00\u4E2A off \u4EE5\u5916\u7684\u6863\u4F4D\uFF0C\u6216\u6539\u9009\u300C\u65E0\u63A8\u7406\u300D");
        toast("\u81F3\u5C11\u58F0\u660E\u4E00\u4E2A off \u4EE5\u5916\u7684\u6863\u4F4D", "error");
        return;
      }
      reasoningEfforts = {};
      for (const lvl of THINKING_LEVELS) {
        const wire = efforts[lvl] ?? "";
        if (wire !== "") reasoningEfforts[lvl] = wire;
        else if (lvl === "off") reasoningEfforts[lvl] = null;
      }
    }
    let compat;
    try {
      compat = buildCompat(compatFields, compatTri, m.compat, providerApi);
    } catch (e) {
      setErr(e?.message ?? String(e));
      toast(e?.message ?? String(e), "error");
      return;
    }
    const entry = {
      id: finalId,
      name: display.trim() || finalId,
      contextWindow: Number(ctx) || void 0,
      maxTokens: Number(max) || void 0,
      input: vision ? VISION : ["text"],
      reasoningEfforts,
      compat
    };
    const fail = (e) => {
      const m2 = e?.message ?? String(e);
      setErr(m2);
      toast(m2, "error");
    };
    if (isEdit) actionUpdateModel(provider, modelId, entry).then(() => {
      toast(`\u5DF2\u4FDD\u5B58\u6A21\u578B ${finalId}`, "success");
      onDone();
    }).catch(fail);
    else actionAddModel(provider, entry).then(() => {
      toast(`\u5DF2\u6DFB\u52A0\u6A21\u578B ${finalId}`, "success");
      onDone();
    }).catch(fail);
  };
  return /* @__PURE__ */ React2.createElement("div", null, /* @__PURE__ */ React2.createElement(
    FormHead,
    {
      title: isEdit ? `\u7F16\u8F91\u6A21\u578B \xB7 ${modelId}` : `\u6DFB\u52A0\u6A21\u578B \xB7 ${provider}`,
      leading: /* @__PURE__ */ React2.createElement(Button, { size: "sm", onClick: onDone }, "\u2190 \u8FD4\u56DE")
    }
  ), /* @__PURE__ */ React2.createElement("div", { className: "dpk-formhint" }, "\u6A21\u578B ID \u53D1\u7ED9\u7F51\u5173\uFF0C\u521B\u5EFA\u540E\u4E0D\u53EF\u6539\uFF1B\u663E\u793A\u540D\u79F0\u53EA\u5F71\u54CD\u672C\u9875\u5C55\u793A\u3002\u6539\u5B8C\u4FDD\u5B58\u5373\u70ED\u751F\u6548\u3002"), /* @__PURE__ */ React2.createElement(Field, { label: "\u6A21\u578B ID" + (isEdit ? "\uFF08\u4E0D\u53EF\u6539\uFF09" : "") }, /* @__PURE__ */ React2.createElement(Input, { value: id, disabled: isEdit, onChange: (e) => setId(e.target.value), placeholder: "deepseek-v4-flash" })), /* @__PURE__ */ React2.createElement(Field, { label: "\u663E\u793A\u540D\u79F0\uFF08\u53EF\u7559\u7A7A\uFF09" }, /* @__PURE__ */ React2.createElement(Input, { value: display, onChange: (e) => setDisplay(e.target.value), placeholder: "GLM-5.3 Flash" })), /* @__PURE__ */ React2.createElement(Row, null, /* @__PURE__ */ React2.createElement(Field, { label: "\u4E0A\u4E0B\u6587\u7A97\u53E3" }, /* @__PURE__ */ React2.createElement(Input, { type: "number", min: "1", value: ctx, onChange: (e) => setCtx(e.target.value), placeholder: "1000000" })), /* @__PURE__ */ React2.createElement(Field, { label: "\u6700\u5927\u8F93\u51FA" }, /* @__PURE__ */ React2.createElement(Input, { type: "number", min: "1", value: max, onChange: (e) => setMax(e.target.value), placeholder: "131072" }))), /* @__PURE__ */ React2.createElement("div", { className: "dpk-switch-row" }, /* @__PURE__ */ React2.createElement(Switch, { checked: vision, onChange: setVision }), /* @__PURE__ */ React2.createElement(Hint, null, "\u8BC6\u56FE\u80FD\u529B\uFF08\u56FE\u7247\u8F93\u5165\uFF09\uFF1A\u5F00\u542F\u540E\u8BE5\u6A21\u578B\u53EF\u63A5\u6536\u56FE\u7247\u8F93\u5165")), /* @__PURE__ */ React2.createElement(FormHead, { title: "\u63A8\u7406\u6863\u4F4D\uFF08reasoningEfforts\uFF09", size: 13, style: { marginTop: 10 } }), /* @__PURE__ */ React2.createElement(Row, { gap: 6 }, /* @__PURE__ */ React2.createElement(Button, { size: "sm", variant: effortsMode === "inherit" ? "primary" : "neutral", onClick: () => setEffortsMode("inherit") }, "\u4E0D\u58F0\u660E"), /* @__PURE__ */ React2.createElement(Button, { size: "sm", variant: effortsMode === "none" ? "primary" : "neutral", onClick: () => setEffortsMode("none") }, "\u65E0\u63A8\u7406"), /* @__PURE__ */ React2.createElement(Button, { size: "sm", variant: effortsMode === "levels" ? "primary" : "neutral", onClick: () => setEffortsMode("levels") }, "\u58F0\u660E\u6863\u4F4D"), effortsMode === "levels" ? /* @__PURE__ */ React2.createElement(Button, { size: "sm", onClick: applyPreset }, "\u4E00\u952E\u586B\u6EE1\u6863\u4F4D") : null), effortsMode === "inherit" ? /* @__PURE__ */ React2.createElement(Hint, null, "\u8DDF\u968F\u5185\u7F6E\u76EE\u5F55\u58F0\u660E\uFF1B\u81EA\u5B9A\u4E49\u6A21\u578B\u6CA1\u6709\u76EE\u5F55\u53EF\u8DDF\u968F\uFF0C\u7B49\u540C\u65E0\u63A8\u7406\u3002\u4E0D\u5199 reasoningEfforts \u5B57\u6BB5\u3002") : null, effortsMode === "none" ? /* @__PURE__ */ React2.createElement(Hint, null, "\u58F0\u660E\u8BE5\u6A21\u578B\u4E0D\u53C2\u4E0E\u63A8\u7406\uFF08reasoningEfforts: false\uFF09\uFF0C\u6A21\u578B\u9009\u62E9\u5668\u4E0D\u518D\u63D0\u4F9B\u601D\u8003\u6863\u4F4D\u3002") : null, effortsMode === "levels" ? /* @__PURE__ */ React2.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 6, marginTop: 6 } }, THINKING_LEVELS.map((lvl) => /* @__PURE__ */ React2.createElement(Field, { key: lvl, label: lvl }, /* @__PURE__ */ React2.createElement(
    Input,
    {
      type: "text",
      value: efforts[lvl] ?? "",
      placeholder: lvl === "off" ? "\uFF08\u7559\u7A7A=\u4E0D\u53D1\u9001\uFF09" : lvl,
      onChange: (e) => setLevelWire(lvl, e.target.value)
    }
  )))) : null, /* @__PURE__ */ React2.createElement(
    FormHead,
    {
      title: `\u9AD8\u7EA7\u517C\u5BB9\u6027\uFF08compat${providerApi ? " \xB7 " + providerApi : ""}\uFF09`,
      size: 13,
      style: { marginTop: 10 },
      trailing: /* @__PURE__ */ React2.createElement(Button, { size: "sm", onClick: () => setCompatOpen((v) => !v) }, compatOpen ? "\u6536\u8D77" : "\u5C55\u5F00")
    }
  ), /* @__PURE__ */ React2.createElement(Hint, null, "\u6BCF\u9879\u4E09\u6001\uFF1A\u300C\u8DDF\u968F\u300D= \u4E0D\u5199\u8BE5\u952E\uFF0C\u7531\u5185\u7F6E\u76EE\u5F55\u6216 pi-ai \u81EA\u52A8\u63A2\u6D4B\u51B3\u5B9A\uFF1B\u300C\u5F00 / \u5173\u300D= \u5F3A\u5236\u6307\u5B9A\u3002 \u5199\u9519\u534F\u8BAE\u4E13\u5C5E\u5B57\u6BB5\u4F1A\u5BFC\u81F4\u6574\u4E2A\u63D0\u4F9B\u5546\u4FDD\u5B58\u5931\u8D25\uFF0C\u6240\u4EE5\u8FD9\u91CC\u53EA\u5217\u51FA\u672C\u534F\u8BAE\u652F\u6301\u7684\u5B57\u6BB5\u3002"), compatOpen ? /* @__PURE__ */ React2.createElement("div", { style: { marginTop: 6 } }, compatFields.length === 0 ? /* @__PURE__ */ React2.createElement(Hint, null, providerApi ? "\u5F53\u524D\u534F\u8BAE\u6CA1\u6709\u53EF\u914D\u7F6E\u7684\u517C\u5BB9\u5F00\u5173\u3002" : "\u8BE5\u63D0\u4F9B\u5546\u6CA1\u6709\u663E\u5F0F\u58F0\u660E API \u534F\u8BAE\uFF08\u8DDF\u968F\u5185\u7F6E\u76EE\u5F55\uFF0C\u5404\u6A21\u578B\u534F\u8BAE\u53EF\u80FD\u4E0D\u540C\uFF09\uFF0C\u56E0\u6B64\u4E0D\u63D0\u4F9B\u534F\u8BAE\u4E13\u5C5E\u5F00\u5173\u3002\u8981\u914D\u7F6E\u8BF7\u5148\u5728\u300C\u7F16\u8F91\u63D0\u4F9B\u5546\u300D\u91CC\u9009\u5B9A\u534F\u8BAE\u3002") : compatFields.map((f) => {
    const v = compatTri[f.key] ?? "";
    return /* @__PURE__ */ React2.createElement("div", { key: f.key, style: { marginTop: 8 } }, /* @__PURE__ */ React2.createElement(Row, { gap: 6 }, /* @__PURE__ */ React2.createElement("span", { className: "dpk-formtitle", style: { fontSize: 12 } }, f.label), /* @__PURE__ */ React2.createElement(Mono, null, f.key), /* @__PURE__ */ React2.createElement(Spacer, null), f.kind === "bool" ? /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(Button, { size: "sm", variant: v === "" ? "primary" : "neutral", onClick: () => setTri(f.key, "") }, "\u8DDF\u968F"), /* @__PURE__ */ React2.createElement(Button, { size: "sm", variant: v === "true" ? "primary" : "neutral", onClick: () => setTri(f.key, "true") }, "\u5F00"), /* @__PURE__ */ React2.createElement(Button, { size: "sm", variant: v === "false" ? "primary" : "neutral", onClick: () => setTri(f.key, "false") }, "\u5173")) : /* @__PURE__ */ React2.createElement(Button, { size: "sm", variant: v === "" ? "primary" : "neutral", onClick: () => setTri(f.key, "") }, "\u8DDF\u968F")), f.kind === "enum" ? /* @__PURE__ */ React2.createElement(Select, { value: v, onChange: (e) => setTri(f.key, e.target.value) }, /* @__PURE__ */ React2.createElement("option", { value: "" }, "\uFF08\u8DDF\u968F\u76EE\u5F55 / \u81EA\u52A8\u63A2\u6D4B\uFF09"), f.options.map((o) => /* @__PURE__ */ React2.createElement("option", { key: o, value: o }, o))) : null, f.kind === "json" && v !== "" ? /* @__PURE__ */ React2.createElement(Input, { value: v, onChange: (e) => setTri(f.key, e.target.value), placeholder: '{"enable_thinking": true}' }) : null, f.kind === "json" && v === "" ? /* @__PURE__ */ React2.createElement(Button, { size: "sm", onClick: () => setTri(f.key, "{}") }, "\u586B\u5199 JSON") : null, f.hint ? /* @__PURE__ */ React2.createElement(Hint, null, f.hint) : null);
  })) : null, err ? /* @__PURE__ */ React2.createElement(FormError, null, err) : null, /* @__PURE__ */ React2.createElement(FormOps, null, /* @__PURE__ */ React2.createElement(Button, { onClick: onDone }, "\u53D6\u6D88"), /* @__PURE__ */ React2.createElement(Button, { variant: "primary", onClick: submit }, isEdit ? "\u4FDD\u5B58" : "\u6DFB\u52A0")));
}
function ModelCapSection() {
  const [providers, setProviders] = React2.useState(() => getProviders());
  const [disabledStore, setDisabledStore] = React2.useState(() => getDisabledStore());
  const [form, setForm] = React2.useState(null);
  const [banner, setBannerRaw] = React2.useState(null);
  const setBanner = React2.useCallback((text, scope = "page") => {
    setBannerRaw(text ? { text, scope } : null);
  }, []);
  const [lastModel, setLastModel] = React2.useState(null);
  const [pull, setPull] = React2.useState(null);
  const [listOpen, setListOpen] = React2.useState({});
  const [test, setTest] = React2.useState({});
  const [checks, setChecks] = React2.useState({});
  const [q, setQ] = React2.useState("");
  const [catalogRoutes, setCatalogRoutes] = React2.useState(() => /* @__PURE__ */ new Set());
  React2.useEffect(() => {
    let alive = true;
    actionListPresets().then((list) => {
      if (alive) setCatalogRoutes(new Set(list.map((x) => x.provider)));
    }).catch(() => {
    });
    return () => {
      alive = false;
    };
  }, []);
  const refresh = React2.useCallback(() => {
    setProviders(getProviders());
    setDisabledStore(getDisabledStore());
  }, []);
  const [capsTick, setCapsTick] = React2.useState(0);
  React2.useEffect(() => capsBus.on(() => setCapsTick((n) => n + 1)), []);
  React2.useEffect(() => {
    if (!llmScope) return;
    refresh();
    const un1 = llmScope.subscribe(refresh);
    const un2 = capsScope ? capsScope.subscribe(refresh) : null;
    return () => {
      un1?.();
      un2?.();
    };
  }, [refresh, capsTick]);
  const rootRef = React2.useRef(null);
  const scrollRef = React2.useRef(null);
  const savedTop = React2.useRef(0);
  React2.useEffect(() => {
    let el = rootRef.current?.parentElement ?? null;
    while (el) {
      const oy = getComputedStyle(el).overflowY;
      if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight) {
        scrollRef.current = el;
        return;
      }
      el = el.parentElement;
    }
    scrollRef.current = document.scrollingElement ?? null;
  }, []);
  React2.useLayoutEffect(() => {
    if (form === null && scrollRef.current) scrollRef.current.scrollTop = savedTop.current;
  }, [form]);
  const openForm = React2.useCallback((f) => {
    savedTop.current = scrollRef.current?.scrollTop ?? 0;
    setForm(f);
  }, []);
  const runTest = React2.useCallback((providerName, modelId) => {
    const key = testKey(providerName, modelId);
    const startedAt = Date.now();
    setTest((t) => ({ ...t, [key]: { status: "testing", startedAt, elapsed: 0 } }));
    const timer = setInterval(() => {
      setTest((t) => {
        const cur = t[key];
        if (!cur || cur.status !== "testing") {
          clearInterval(timer);
          return t;
        }
        return { ...t, [key]: { ...cur, elapsed: Date.now() - startedAt } };
      });
    }, 1e3);
    return fetch("/api/model-cap/test", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ provider: providerName, model: modelId })
    }).then(async (r) => {
      clearInterval(timer);
      let body = null;
      try {
        body = await r.json();
      } catch {
      }
      if (!body) throw new Error(`\u63A5\u53E3\u5F02\u5E38\uFF08HTTP ${r.status}\uFF0C\u82E5\u521A\u6539\u8FC7\u4EE3\u7801\u8BF7\u91CD\u542F\u670D\u52A1\uFF09`);
      if (body.ok) setTest((t) => ({ ...t, [key]: { status: "ok", latencyMs: body.latencyMs } }));
      else {
        setTest((t) => ({ ...t, [key]: { status: "fail", error: body.error || "\u672A\u77E5\u9519\u8BEF" } }));
        setBanner(`\u6D4B\u8BD5\u5931\u8D25 \xB7 ${providerName}/${modelId}\uFF1A${body.error || "\u672A\u77E5\u9519\u8BEF"}`, providerName);
      }
    }).catch((e) => {
      clearInterval(timer);
      setTest((t) => ({ ...t, [key]: { status: "fail", error: e?.message } }));
      setBanner(`\u6D4B\u8BD5\u5931\u8D25 \xB7 ${providerName}/${modelId}\uFF1A${e?.message ?? String(e)}`, providerName);
    });
  }, [setBanner]);
  const runAllTests = React2.useCallback(async (providerName) => {
    const models = getProviders()[providerName]?.models ?? [];
    for (const m of models) await runTest(providerName, m.id);
  }, [runTest]);
  const checkOf = React2.useCallback((key) => checks[key] === true, [checks]);
  const toggleCheck = React2.useCallback((provider, modelId) => {
    setChecks((c) => {
      const k = testKey(provider, modelId);
      const next = { ...c };
      if (next[k]) delete next[k];
      else next[k] = true;
      return next;
    });
  }, []);
  const clearChecks = React2.useCallback((provider, ids) => {
    setChecks((c) => {
      const next = { ...c };
      for (const id of ids) delete next[testKey(provider, id)];
      return next;
    });
  }, []);
  const selectAllVisible = React2.useCallback((provider, visible) => {
    const allSel = visible.every((m) => checkOf(testKey(provider, m.id)));
    setChecks((c) => {
      const next = { ...c };
      for (const m of visible) {
        const k = testKey(provider, m.id);
        if (allSel) delete next[k];
        else next[k] = true;
      }
      return next;
    });
  }, [checkOf]);
  const batchDelete = React2.useCallback(async (provider) => {
    const ids = (getProviders()[provider]?.models ?? []).filter((m) => checkOf(testKey(provider, m.id))).map((m) => m.id);
    if (!ids.length) return;
    try {
      await actionRemoveModels(provider, ids);
      clearChecks(provider, ids);
      setBanner(null);
      setLastModel(null);
      toast(`\u5DF2\u5220\u9664 ${ids.length} \u4E2A\u6A21\u578B`, "success");
    } catch (e) {
      if (e?.code === "LAST_MODEL") {
        setBanner(null);
        setLastModel({ provider });
        return;
      }
      setBanner("\u6279\u91CF\u5220\u9664\u5931\u8D25\uFF1A" + (e?.message ?? e), provider);
    }
  }, [checkOf, clearChecks, setBanner]);
  const names = Object.keys(providers).sort();
  const disabledRoutes = Object.keys(disabledStore).filter((r) => !providers[r]).sort();
  const allNames = [...names, ...disabledRoutes].sort();
  const ql = q.trim().toLowerCase();
  const matchProvider = (name, p) => !ql || name.toLowerCase().includes(ql) || String(p?.baseURL ?? "").toLowerCase().includes(ql);
  const filterModels = (ms) => !ql ? ms : ms.filter(
    (m) => String(m?.id ?? "").toLowerCase().includes(ql) || String(m?.name ?? "").toLowerCase().includes(ql)
  );
  const visibleNames = allNames.filter((name) => matchProvider(name, providers[name] ?? disabledStore[name]?.profile));
  const toggleProvider = React2.useCallback((route, isOn) => {
    setBanner(null);
    const action = isOn ? actionDisableProvider(route) : actionEnableProvider(route);
    action.then(() => toast(isOn ? `\u5DF2\u7981\u7528 ${route}\uFF08\u914D\u7F6E\u5DF2\u5F52\u6863\uFF0C\u968F\u65F6\u53EF\u6062\u590D\uFF09` : `\u5DF2\u542F\u7528 ${route}`, "success")).catch((e) => setBanner((isOn ? "\u7981\u7528" : "\u542F\u7528") + "\u5931\u8D25\uFF1A" + (e?.message ?? e), route));
  }, [setBanner]);
  return /* @__PURE__ */ React2.createElement("div", { className: "dpk-page-pad", ref: rootRef }, banner && banner.scope === "page" ? /* @__PURE__ */ React2.createElement(Banner, null, banner.text) : null, form ? /* @__PURE__ */ React2.createElement(Card, { className: "dpk-card-raise" }, form.mode === "addProvider" || form.mode === "editProvider" ? /* @__PURE__ */ React2.createElement(ProviderForm, { key: form.mode + (form.provider ?? ""), mode: form.mode, provider: form.provider, onDone: () => setForm(null) }) : /* @__PURE__ */ React2.createElement(ModelForm, { key: form.mode + (form.provider ?? "") + (form.modelId ?? ""), mode: form.mode, provider: form.provider, modelId: form.modelId, onDone: () => setForm(null) })) : /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement("div", { className: "dpk-page-head" }, /* @__PURE__ */ React2.createElement("span", { className: "dpk-page-title" }, "\u6A21\u578B\u4E0E\u63D0\u4F9B\u5546"), /* @__PURE__ */ React2.createElement(Spacer, null), /* @__PURE__ */ React2.createElement(Button, { variant: "primary", onClick: () => openForm({ mode: "addProvider" }) }, "\uFF0B \u65B0\u589E\u63D0\u4F9B\u5546")), /* @__PURE__ */ React2.createElement("div", { className: "dpk-page-desc" }, "\u63D0\u4F9B\u5546 = \u8BF7\u6C42\u5730\u5740 + \u51ED\u636E + \u534F\u8BAE\uFF1B\u6A21\u578B\u6302\u5728\u63D0\u4F9B\u5546\u4E0B\uFF0C\u8BC6\u56FE\u80FD\u529B\u6309\u6A21\u578B\u58F0\u660E\uFF0C\u4FDD\u5B58\u5373\u70ED\u751F\u6548\u3002\u8FDE\u901A\u6D4B\u8BD5\u8D85\u65F6 60 \u79D2\uFF0C\u6162\u6A21\u578B\u4F1A\u663E\u793A\u771F\u5B9E\u5EF6\u8FDF\u3002"), /* @__PURE__ */ React2.createElement(Hint, { style: { marginBottom: 8 } }, "\u5B9A\u4F4D\uFF1A\u672C\u9875\u662F", /* @__PURE__ */ React2.createElement("b", null, "\u9AD8\u7EA7\u7BA1\u7406\u53F0"), "\uFF08\u6D4B\u8BD5 / \u6279\u91CF / \u7981\u7528 / \u6392\u5E8F / \u5F7B\u5E95\u5220\u9664\uFF09\uFF1B\u65E5\u5E38\u6362\u6A21\u578B\u3001\u8BBE\u63A8\u7406\u6863\u4F4D\u4E5F\u53EF\u7528\u5B98\u65B9\u300C\u8BBE\u7F6E \u2192 \u6A21\u578B\u300D\u9875\uFF0C\u4E24\u8FB9\u8BFB\u5199\u540C\u4E00\u4EFD\u914D\u7F6E\u3001\u4E92\u901A\u3002"), /* @__PURE__ */ React2.createElement("div", { style: { maxWidth: 360, marginBottom: 10 } }, /* @__PURE__ */ React2.createElement(SearchInput, { placeholder: "\u641C\u7D22\u63D0\u4F9B\u5546\u6216\u6A21\u578B\uFF08\u540D\u79F0 / Base URL / \u6A21\u578B ID\uFF09\u2026", value: q, onChange: (e) => setQ(e.target.value) })), allNames.length === 0 ? /* @__PURE__ */ React2.createElement(Loading, null, "\u8FD8\u6CA1\u6709\u4EFB\u4F55\u63D0\u4F9B\u5546\uFF0C\u70B9\u53F3\u4E0A\u300C\u65B0\u589E\u63D0\u4F9B\u5546\u300D") : visibleNames.length === 0 ? /* @__PURE__ */ React2.createElement(Loading, null, "\u6CA1\u6709\u5339\u914D\u300C", q, "\u300D\u7684\u63D0\u4F9B\u5546\u6216\u6A21\u578B") : visibleNames.map((name) => {
    const isOff = !providers[name];
    const p = isOff ? disabledStore[name]?.profile ?? {} : providers[name];
    const models = p.models ?? [];
    const catalogKnownRoute = catalogRoutes.has(name);
    const open = listOpen[name] === true;
    const allVision = models.length > 0 && models.every(hasVision);
    const filteredModels = filterModels(models);
    const visible = open ? filteredModels : filteredModels.slice(0, MODEL_PAGE);
    const selCount = models.filter((m) => checkOf(testKey(name, m.id))).length;
    const allVisibleSel = visible.length > 0 && visible.every((m) => checkOf(testKey(name, m.id)));
    return /* @__PURE__ */ React2.createElement(Card, { key: name, className: "dpk-card-raise", style: isOff ? { opacity: 0.6 } : void 0 }, /* @__PURE__ */ React2.createElement("div", { className: "dpk-card-head" }, /* @__PURE__ */ React2.createElement("span", { className: "dpk-card-name" }, name), allVision ? /* @__PURE__ */ React2.createElement(Pill, { className: "dpk-pill-brand" }, "\u8BC6\u56FE\u8DEF\u7531") : /* @__PURE__ */ React2.createElement(Pill, null, protoLabel(p.api)), isOff ? /* @__PURE__ */ React2.createElement(Pill, null, "\u5DF2\u7981\u7528") : null, /* @__PURE__ */ React2.createElement(Spacer, null), /* @__PURE__ */ React2.createElement(Switch, { checked: !isOff, onChange: (v) => toggleProvider(name, !v) }), isOff ? /* @__PURE__ */ React2.createElement(ConfirmButton, { confirmText: "\u5F52\u6863\u5C06\u4E00\u5E76\u5220\u9664\uFF0C\u786E\u8BA4\uFF1F", onConfirm: () => {
      setBanner(null);
      actionPurgeDisabled(name).then(() => toast(`\u5DF2\u5F7B\u5E95\u5220\u9664 ${name}`, "success")).catch((e) => setBanner("\u5220\u9664\u5931\u8D25\uFF1A" + (e?.message ?? e), name));
    } }, "\u5F7B\u5E95\u5220\u9664") : /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(Button, { size: "sm", onClick: () => openForm({ mode: "editProvider", provider: name }) }, "\u7F16\u8F91"), /* @__PURE__ */ React2.createElement(ConfirmButton, { confirmText: "\u7ED1\u5B9A\u4F1A\u8BDD\u5C06\u5931\u6548\uFF0C\u786E\u8BA4\uFF1F", onConfirm: () => {
      setBanner(null);
      clearChecks(name, models.map((m) => m.id));
      actionDeleteProvider(name).then(() => toast(`\u5DF2\u5220\u9664\u63D0\u4F9B\u5546 ${name}`, "success")).catch((e) => setBanner("\u5220\u9664\u5931\u8D25\uFF1A" + (e?.message ?? e), name));
    } }, "\u5220\u9664"))), /* @__PURE__ */ React2.createElement("div", { className: "dpk-card-meta-wrap" }, "base_url \xB7 ", /* @__PURE__ */ React2.createElement(Mono, null, p.baseURL ?? "\u2014"), " \xB7 ", models.length === 0 ? "\u672A\u5217\u51FA\u6A21\u578B" : `${models.length} \u4E2A\u6A21\u578B`, " \xB7 Key \u7531 ", p.apiKeyEnv ?? "\u2014", " \u63D0\u4F9B", retrySummary(p) ? /* @__PURE__ */ React2.createElement("span", null, " \xB7 ", /* @__PURE__ */ React2.createElement(Mono, null, retrySummary(p))) : null), banner && banner.scope === name ? /* @__PURE__ */ React2.createElement(Banner, { style: { margin: "0 0 8px" } }, banner.text) : null, lastModel && lastModel.provider === name ? /* @__PURE__ */ React2.createElement(Banner, { style: { margin: "0 0 8px" } }, /* @__PURE__ */ React2.createElement("b", null, "\u5DF2\u62E6\u4E0B\uFF1A\u8FD9\u662F\u8BE5\u63D0\u4F9B\u5546\u7684\u6700\u540E\u4E00\u4E2A\u6A21\u578B\u3002"), /* @__PURE__ */ React2.createElement("div", { style: { marginTop: 4 } }, "\u81EA\u5B9A\u4E49\u8DEF\u7531\u4E0D\u80FD\u300C\u58F0\u660E\u7A7A\u5217\u8868\u300D\u3002\u300C\u6062\u590D\u9ED8\u8BA4\u300D\u662F\u5220\u6389\u5B57\u6BB5\u8BA9\u7F51\u5173\u6309\u5730\u5740\u81EA\u52A8\u63D0\u4F9B\u76EE\u5F55\uFF0C\u53EA\u6709\u5185\u7F6E\u76EE\u5F55\u5DF2\u77E5\u7684\u8DEF\u7531\u624D\u80FD\u56DE\u9000\uFF1B\u81EA\u5EFA\u7F51\u5173\u6CA1\u6709\u76EE\u5F55\u53EF\u56DE\u9000\u3002"), /* @__PURE__ */ React2.createElement(Row, { gap: 6, style: { marginTop: 8 } }, /* @__PURE__ */ React2.createElement(Button, { size: "sm", onClick: () => setLastModel(null) }, "\u4FDD\u7559\u4E00\u4E2A\u6A21\u578B"), /* @__PURE__ */ React2.createElement(Button, { size: "sm", variant: "soft", onClick: () => {
      clearChecks(name, models.map((m) => m.id));
      actionResetModels(name).then(() => {
        setLastModel(null);
        toast(`\u5DF2\u6062\u590D\u9ED8\u8BA4\u6A21\u578B\u76EE\u5F55\uFF08${name}\uFF09`, "success");
      }).catch((e) => setBanner("\u6062\u590D\u5931\u8D25\uFF1A" + (e?.message ?? e), name));
    } }, "\u6539\u7528\u300C\u6062\u590D\u9ED8\u8BA4\u300D"), /* @__PURE__ */ React2.createElement(Button, { size: "sm", variant: "danger", onClick: () => {
      setLastModel(null);
      clearChecks(name, models.map((m) => m.id));
      actionDeleteProvider(name).then(() => toast(`\u5DF2\u5220\u9664\u63D0\u4F9B\u5546 ${name}`, "success")).catch((e) => setBanner("\u5220\u9664\u5931\u8D25\uFF1A" + (e?.message ?? e), name));
    } }, "\u5220\u9664\u6574\u4E2A\u63D0\u4F9B\u5546"))) : null, isOff ? /* @__PURE__ */ React2.createElement("div", { className: "dpk-panel" }, models.length === 0 ? /* @__PURE__ */ React2.createElement(Loading, null, "\u6682\u65E0\u6A21\u578B") : /* @__PURE__ */ React2.createElement(React2.Fragment, null, visible.map((m) => /* @__PURE__ */ React2.createElement(
      ModelRow,
      {
        key: m.id,
        provider: name,
        m,
        ro: true,
        checked: false,
        onTest: () => {
        },
        onEdit: () => {
        },
        onDelete: () => {
        },
        onToggleCheck: () => {
        }
      }
    )), models.length > MODEL_PAGE ? /* @__PURE__ */ React2.createElement("div", { className: "dpk-footlink", onClick: () => setListOpen((o) => ({ ...o, [name]: !open })) }, open ? "\u6536\u8D77" : `\u5C55\u5F00\u5168\u90E8\uFF08${models.length} \u4E2A\uFF09`) : null)) : /* @__PURE__ */ React2.createElement("div", { className: "dpk-panel" }, /* @__PURE__ */ React2.createElement("div", { className: "dpk-panel-head" }, /* @__PURE__ */ React2.createElement(PanelActions, null, models.length ? /* @__PURE__ */ React2.createElement(Button, { size: "sm", onClick: () => {
      runAllTests(name).catch(() => {
      });
    } }, "\u5168\u91CF\u6D4B\u8BD5") : null, /* @__PURE__ */ React2.createElement(Button, { size: "sm", onClick: () => {
      if (pull && pull.provider === name) {
        setPull(null);
        return;
      }
      actionPullModels(name).then((res) => {
        setBanner(null);
        setPull({ provider: name, models: res.all, existing: res.existing });
      }).catch((e) => setBanner("\u62C9\u53D6\u5931\u8D25\uFF1A" + (e?.message ?? e), name));
    } }, pull && pull.provider === name ? "\u6536\u8D77" : "\u62C9\u53D6\u6A21\u578B"), /* @__PURE__ */ React2.createElement(Button, { size: "sm", onClick: () => openForm({ mode: "addModel", provider: name }) }, "\u624B\u52A8\u6DFB\u52A0"), /* @__PURE__ */ React2.createElement(ConfirmButton, { confirmText: "\u6A21\u578B\u5217\u8868\u4F1A\u4ECE\u914D\u7F6E\u4E2D\u79FB\u9664\uFF08\u4E0D\u662F\u8BBE\u4E3A\u7A7A\uFF09\uFF0C\u7F51\u5173\u5C06\u6309\u5730\u5740\u81EA\u52A8\u63D0\u4F9B\u76EE\u5F55\uFF0C\u786E\u8BA4\uFF1F", disabled: models.length === 0, onConfirm: () => {
      setBanner(null);
      clearChecks(name, models.map((m) => m.id));
      actionResetModels(name).then(() => toast(`\u5DF2\u6062\u590D\u9ED8\u8BA4\u6A21\u578B\u76EE\u5F55\uFF08${name}\uFF09`, "success")).catch((e) => setBanner("\u6062\u590D\u5931\u8D25\uFF1A" + (e?.message ?? e), name));
    } }, "\u6062\u590D\u9ED8\u8BA4"), /* @__PURE__ */ React2.createElement(Button, { size: "sm", disabled: visible.length === 0, onClick: () => selectAllVisible(name, visible) }, allVisibleSel ? "\u53D6\u6D88\u5168\u9009" : "\u5168\u9009"), /* @__PURE__ */ React2.createElement(ConfirmButton, { confirmText: `\u5220\u9664 ${selCount} \u4E2A\uFF1F`, disabled: selCount === 0, onConfirm: () => batchDelete(name) }, "\u5220\u9664\uFF08", selCount, "\uFF09"))), pull && pull.provider === name ? /* @__PURE__ */ React2.createElement(
      PullPanel,
      {
        models: pull.models,
        existing: pull.existing,
        onJoin: (chosen) => {
          actionAddPulled(name, chosen).then(() => {
            setPull(null);
            setBanner(null);
            toast(`\u5DF2\u52A0\u5165 ${chosen.length} \u4E2A\u6A21\u578B`, "success");
          }).catch((e) => setBanner("\u52A0\u5165\u5931\u8D25\uFF1A" + (e?.message ?? e), name));
        }
      }
    ) : null, visible.map((m) => {
      const idx = models.findIndex((x) => x.id === m.id);
      return /* @__PURE__ */ React2.createElement(
        ModelRow,
        {
          key: m.id,
          provider: name,
          m,
          t: test[testKey(name, m.id)],
          index: idx,
          onReorder: (fromId, toIndex, side) => {
            const from = models.findIndex((x) => x.id === fromId);
            if (from < 0) return;
            let insert = side === "top" ? toIndex : toIndex + 1;
            if (from < insert) insert -= 1;
            if (insert === from) return;
            actionMoveModelTo(name, fromId, insert).then(() => {
              setBanner(null);
              setListOpen((o) => ({ ...o, [name]: true }));
            }).catch((e) => setBanner("\u6392\u5E8F\u5931\u8D25\uFF1A" + (e?.message ?? e), name));
          },
          checked: checkOf(testKey(name, m.id)),
          onTest: () => runTest(name, m.id),
          onEdit: () => openForm({ mode: "editModel", provider: name, modelId: m.id }),
          onDelete: () => {
            setBanner(null);
            clearChecks(name, [m.id]);
            actionDeleteModel(name, m.id).then(() => toast(`\u5DF2\u5220\u9664\u6A21\u578B ${m.id}`, "success")).catch((e) => {
              if (e?.code === "LAST_MODEL") {
                setLastModel({ provider: name });
                return;
              }
              setBanner("\u5220\u9664\u5931\u8D25\uFF1A" + (e?.message ?? e), name);
            });
          },
          onToggleCheck: () => toggleCheck(name, m.id)
        }
      );
    }), models.length === 0 ? /* @__PURE__ */ React2.createElement(Loading, null, catalogKnownRoute ? "\u672A\u5217\u51FA\u6A21\u578B\u3002\u8FD9\u662F\u5185\u7F6E\u5382\u5546\uFF1A\u7559\u7A7A\u5373\u7531\u5185\u7F6E\u76EE\u5F55\u63D0\u4F9B\u6A21\u578B\uFF1B\u82E5\u8981\u56FA\u5B9A\u6E05\u5355\u8BF7\u300C\u62C9\u53D6\u6A21\u578B\u300D\u6216\u300C\u624B\u52A8\u6DFB\u52A0\u300D\u3002" : "\u6682\u65E0\u6A21\u578B\uFF0C\u70B9\u300C\u62C9\u53D6\u6A21\u578B\u300D\u6216\u300C\u624B\u52A8\u6DFB\u52A0\u300D") : models.length > MODEL_PAGE ? /* @__PURE__ */ React2.createElement("div", { className: "dpk-footlink", onClick: () => setListOpen((o) => ({ ...o, [name]: !open })) }, open ? "\u6536\u8D77" : `\u5C55\u5F00\u5168\u90E8\uFF08${models.length} \u4E2A\uFF09`) : null));
  })));
}
function apply(ctx) {
  installStyle();
  installDebugOverlay(NS);
  ctx.inject(["webUiSettings", "slots", "remote"], (sctx) => {
    const binder = sctx.webUiSettings;
    llmScope = binder.bind({ namespace: LLM_NS });
    REMOTE = sctx.remote;
    void resolveCaps(binder);
    sctx.slots.inject("settings.section", () => sctx.slots.register({
      name: "settings.section",
      id: "modelcap",
      order: 12,
      label: () => "\u63D0\u4F9B\u5546\u914D\u7F6E",
      inject: () => ({})
    }, ModelCapSection));
  });
}
var inject = ["slots", "remote", "remote.settings", "remote.credentials", "remote.llm"];

		return module.exports;
	}
});
