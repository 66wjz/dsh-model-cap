# dsh-model-cap

给 [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness)（`dsh`）用的**提供商与模型高级管理台**。
在设置里新增独立导航「提供商配置」，把官方「模型」页里做不到的事一次做全。

## 功能

- **提供商管理**：新增 / 编辑 / 删除，配置地址、协议（openai-completions / openai-responses / anthropic-messages）、API Key 凭据（**可留空**，本地模型/免鉴权网关直接用）
- **预置厂商**：新增提供商时可直接从官方内置目录一键选中，自动填好路由名与 Base URL。列表**只列可新增的官方厂商**——你已配置的路由、自建网关路由（不在官方目录里）都不会出现；需要 OAuth 登录（不能用 API Key）的厂商也不列出，并单独说明数量。列表支持搜索、限高滚动，不再铺满屏幕。内置厂商**不写 `api`、不写 `models`**——协议与模型都交给内置目录，插件只保存你真正改过的字段
- **失败重试**（`retryPolicy`，provider 级）：跟随官方默认 / 限次重试 normal（可调最大次数、可重试错误码、退避参数）/ 无限重试 always。不配置则不写该字段，完全跟随官方默认（normal ×5）
- **模型管理**：新增 / 编辑 / 删除 / 批量删除，**拖动排序**（蓝色落点线）、搜索、拉取网关模型
- **推理档位**：按模型声明 `reasoningEfforts`（minimal / low / medium / high / xhigh / max，off 留空即"支持但不发送"），一键填满档位
- **高级兼容性**（`compat`）：按当前协议动态渲染可用开关（openai-completions 5 项 / openai-responses 2 项 / anthropic-messages 3 项），每项三态「跟随 / 开 / 关」——「跟随」不写该键，由内置目录或 pi-ai 自动探测决定，避免误覆盖目录值
- **识图声明**：按模型声明 `input: [text, image]`
- **连通测试**：单个测试 / 全量测试（宿主半边提供 `POST /api/model-cap/test`）
- **禁用归档**：临时禁用某个提供商，配置整体归档、随时启用
- 直写 `llm-pi-ai` 命名空间，**保存即热生效**；提供商会话中断时按 revision 栅栏自动恢复重读

### 批量删除删到 0 时会怎样

自定义路由不能「声明空列表」（`models: []` 会被宿主拒绝）。全选删到 0 时，卡片内会拦下并给出三条出路：

1. **保留一个模型** —— 取消本次删除
2. **改用「恢复默认」** —— 删掉 `models` 字段，让网关按地址自动提供目录。**仅内置目录已知的路由**可用；自建网关没有可回退的目录，会提示改走其他两条路
3. **删除整个提供商**

## 安装

```bash
# 从 npm（发布后）
dsh plugin --profile web add dsh-model-cap

# 从源码目录（本地开发）
dsh plugin --profile web add file:/absolute/path/to/dsh-model-cap
```

装完重启 dsh，设置侧边栏出现「提供商配置」。

## 环境要求

- `dsh` >= `0.2.0-rc.1`（0.2.0 起有插件兼容守卫，peer 不匹配的插件会被整条跳过）
- Node.js >= 22

## 自包含说明

本包**不依赖** `dsh-react-kit`：模板组件（`dpk-*`）已随构建内联进 `lib/client.js`，
源码快照在 `vendor/dpk/`，构建脚本 `build.mjs` 用 esbuild alias 把 `dsh-react-kit/client` 指到该快照。
因此单包安装即可运行，无需额外依赖。

## 开发

```bash
npm install
npm run build      # src/client.tsx → lib/client.js（内联 vendor/dpk）
npm run watch      # 监听重建
```

## 目录

```
index.js            宿主半边（连通测试接口等）
src/client.tsx      浏览器半边源码（React）
src/dpk.ts          组件转发 shim（构建时被 alias 到 vendor/dpk）
vendor/dpk/         内联的模板组件与样式（来自 dsh-react-kit）
cordis.patch.yml    宿主半边插件声明
lib/client.js       构建产物（提交进仓库，装包即可用）
```

## License

MIT