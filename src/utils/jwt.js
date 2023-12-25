import jwt from 'jsonwebtoken'

const SALT = 'zhaowazhenniubi'

export const verify = async token => {
	return new Promise(resolve => {
		if (token) {
			jwt.verify(token, SALT, (err, data) => {
				if (err) {
					if (err.name === 'TokenExpiredError') {
						resolve({
							status: 'failed',
							error: 'token 已过期'
						})
					} else {
						resolve({
							status: 'failed',
							error: 'token 认证失败'
						})
					}
				} else {
					resolve({
						status: 'success',
						data
					})
				}
			})
		} else {
			resolve({
				status: 'failed',
				error: 'token 不能为空'
			})
		}
	})
}

export const signatrue = user =>
	jwt.sign(user, SALT, {
		expiresIn: 10000
	})

// whiteList /user/login, /user/register
export const jwtVerify = whiteList => async (ctx, next) => {
	if (whiteList.includes(ctx.path)) {
		next(ctx)
	} else {
		// 不是白名单，拿你给的token
		let token
		try {
			token = ctx.request.headers.authorization.split('Bearer ')[1]
		} catch (err) {
			// todo
		}

		const res = await verify(token)
		if (res.status === 'success') {
			next(ctx)
		} else {
			ctx.body = {
				...res,
				code: 401
			}
		}
	}
}
