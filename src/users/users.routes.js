const UsersController = require('./users.controller')

module.exports = [
	{
		method: 'POST',
		path: '/users/signup',
		handler: UsersController.signUp
	},
	{
		method: 'POST',
		path: '/users/signin',
		handler: UsersController.signIn
	},
	{
		method: 'POST',
		path: '/users/check',
		session: true,
		handler: UsersController.checkToken
	}
]