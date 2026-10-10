// 独立构建（发布版）：把模板组件（vendor/dpk）内联进本包，不再依赖 dsh-react-kit。
// 用法：node build.mjs [--watch]
import * as esbuild from 'esbuild'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const PLUGIN_ID = 'dsh-model-cap'

function wrapAsModuleLoader(code) {
	return `window.__ModuleLoader__.load({
	id: ${JSON.stringify(PLUGIN_ID)},
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
${code}
		return module.exports;
	}
});
`
}

const buildOptions = {
	entryPoints: [join(root, 'src/client.tsx')],
	bundle: true,
	format: 'cjs',
	platform: 'neutral',
	jsx: 'transform',
	jsxFactory: 'React.createElement',
	jsxFragment: 'React.Fragment',
	external: ['react', 'react-dom', '@deepseek-ai/*'],
	alias: { 'dsh-react-kit/client': join(root, 'vendor/dpk/index.tsx') },
	logLevel: 'info',
	outfile: join(root, 'lib/client.js'),
}

if (process.argv.includes('--watch')) {
	const ctx = await esbuild.context(buildOptions)
	await ctx.watch()
	console.log('[dsh-model-cap] watch 模式')
} else {
	await esbuild.build(buildOptions)
	const raw = readFileSync(join(root, 'lib/client.js'), 'utf8')
	mkdirSync(dirname(join(root, 'lib/client.js')), { recursive: true })
	writeFileSync(join(root, 'lib/client.js'), wrapAsModuleLoader(raw))
	console.log('[dsh-model-cap] 独立构建完成 → lib/client.js')
}