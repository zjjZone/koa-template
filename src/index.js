import Koa from 'koa'
import Router from '@koa/router'
import bodyParser from 'koa-bodyparser'
import ip from 'ip'
import { controllers } from './utils/decorator'
import Routers from './controllers/index' // 要import一下，装饰器函数才会执行

import { connect } from './utils/DB'

// 连接数据库

connect()

const app = new Koa()

// 解析请求参数
app.use(
	bodyParser({
		enableTypes: ['json', 'form', 'text']
	})
)

// 拦截器
app.use(async (ctx, next) => {
	console.log(ctx)
	await next()
})

const router = new Router()

router.get('/', (ctx, next) => {
	ctx.body = 'hello world'
})

// 注册controllers
function initControllers() {
	controllers.forEach(item => {
		let { method, path, handler, constructor } = item
		const { prefix } = constructor
		if (prefix) path = `${prefix}${path}`
		router[method](path, handler)
	})
}

initControllers()

// 异步请求处理示例
router.get('/async', async ctx => {
	// 模拟异步操作，例如从数据库中获取数据
	const fetchDataAsync = () => {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve('Async Data')
			}, 1000)
		})
	}

	try {
		// 等待异步操作完成
		const data = await fetchDataAsync()
		// 发送响应
		ctx.body = { success: true, data }
	} catch (error) {
		// 处理错误
		ctx.status = 500
		ctx.body = { success: false, error: 'Internal Server Error' }
	}
})

app.use(router.routes())
app.use(router.allowedMethods())

const HOST = '0.0.0.0'
app.listen(process.env.PORT, HOST, () => {
	console.log(`app listening on http://localhost:${process.env.PORT}`)
	console.log(`                 http://${ip.address()}:${process.env.PORT}`)
})
