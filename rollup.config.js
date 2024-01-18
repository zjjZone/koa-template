const babel = require('rollup-plugin-babel')
const dotenvPlugin = require('rollup-plugin-dotenv').default

const resolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const json = require('@rollup/plugin-json')
const run = require('@rollup/plugin-run')

const isProd = process.env.NODE_ENV === 'production'

function getOutPut(isProd) {
	if (isProd) {
		return {
			file: `./dist/prod.js`,
			format: 'cjs'
		}
	} else {
		return {
			file: `./dist/bundle.js`,
			format: 'umd',
			name: 'nico-ui-server',
			globals: {
				koa: 'Koa',
				'@koa/router': 'Router',
				'koa-bodyparser': 'bodyParser',
				ip: 'ip'
			}
		}
	}
}

function getPlugins(isProd) {
	const plugins = [
		babel({
			runtimeHelpers: true,
			extensions: ['.js', '.ts'],
			exclude: 'node_modules/**',
			externalHelpers: true
		}),
		dotenvPlugin()
	]

	if (isProd) {
		plugins.push(resolve())
		plugins.push(commonjs())
		plugins.push(json())
	} else {
		plugins.push(
			run({
				wait: true,
				cmd: 'npm run serve' // 开发环境下，每次构建后运行一下，实现热更新
			})
		)
	}

	return plugins
}

module.exports = {
	input: './src/index.js',
	output: getOutPut(isProd),
	treeshake: false,
	plugins: getPlugins(isProd),
	onwarn: (warning, warn) => {
		// dev环境下忽略 Unresolved dependencies 警告
		if (!isProd && warning.code === 'UNRESOLVED_IMPORT') {
			return
		}

		// 忽略 no-eval 警告
		if (warning.code === 'EVAL') {
			return
		}
		warn(warning)
	}
}
