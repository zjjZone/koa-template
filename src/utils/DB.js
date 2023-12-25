const mongoose = require('mongoose')

function connect() {
	// 连接到 MongoDB 数据库
	mongoose.connect(process.env.DATABASE_URL)

	// 获取默认连接
	const db = mongoose.connection

	// 检查连接是否成功
	db.on('error', console.error.bind(console, 'MongoDB connection error:'))
	db.once('open', () => {
		console.log('Connected to the database')
	})
}

export { connect }
