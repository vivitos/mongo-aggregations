const UtilsController = require('./utils.controller');

module.exports = [
	{
		method: 'GET',
		path: '/utils/pingdb',
		handler: UtilsController.pingDb
	}
]