// 公共组件来自模板 dsh-react-kit/client（运行时 external 依赖：见 build.mjs external 与 package.json dsh.client.external）。
// 只 re-export 本插件用到的面；模板新增通用组件后在 dsh-react-kit/src/client.tsx 统一导出，再在此补充引用。
export {
	Button, Card, Checkbox, Chip, Field, Input, Pill, Select, StateBadge, Switch,
	SearchInput, ConfirmButton, PanelActions, Banner,
	Hint, Row, FormHead, Mono, Spacer, FormError, Loading, FormOps, ComboBox,
	installDebugOverlay, installStyle, toast,
} from "dsh-react-kit/client"
export type { ComboOption } from "dsh-react-kit/client"
