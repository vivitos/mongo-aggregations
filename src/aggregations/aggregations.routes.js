const aggregationValidation = require('./aggregations.validation')
const AggregationsController = require('./aggregations.controller')

module.exports = [
	{
		method: 'POST',
		path: '/aggregations',
		session: true,
		validation: aggregationValidation.generateAggregation,
		handler: AggregationsController.generateAggregation
	},
	{
		method: 'GET',
		path: '/pingdb',
		session: true,
		handler: AggregationsController.pingDb
	}
]
