import { Controller, RequestMapping, RequestMethod } from '../utils/decorator'

import User from '../models/User'

@Controller('/user')
export default class BookController {
	@RequestMapping(RequestMethod.GET, '/all')
	async getAllBooks(ctx) {
		ctx.body = {
			data: ['手搓java编译器', '一眼精通rust', 'JS 从入门到放弃']
		}
	}

	@RequestMapping(RequestMethod.GET, '/add')
	async addUser(ctx) {
		const username = ctx.request.query.username
		const user = new User({
			username: username,
			password: '123456',
			email: '18036507270@163.com'
		})
		try {
			const result = await user.save()
			console.log(result)
			ctx.status = 200
			ctx.body = result
		} catch (error) {
			ctx.status = 500
			ctx.body = { error: 'Failed to create user' }
		}
	}
}
