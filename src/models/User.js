const mongoose = require('mongoose')

const collectionName = 'user'

const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true }
	},
	{ collection: collectionName }
)

const User = mongoose.model(collectionName, userSchema)

export default User
