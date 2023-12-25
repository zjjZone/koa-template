export const RequestMethod = {
	GET: 'get',
	POST: 'post',
	PUT: 'put',
	DELETE: 'delete'
}

export const controllers = []

// 类装饰器
export function Controller(prefix = '') {
	return function (target) {
		target.prefix = prefix
	}
}

// 类方法装饰器
export function RequestMapping(method = '', url = '') {
	return function (target, name) {
		let path = url || `/${name}`
		const item = {
			path,
			method,
			handler: target[name],
			constructor: target.constructor
		}
		controllers.push(item)
	}
}
