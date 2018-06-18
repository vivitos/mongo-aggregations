const aggregationValidation = require('./aggregations.validation')
const AggregationsController = require('./aggregations.controller')

module.exports = [
	{
		method: 'POST',
		path: '/aggregations',
		validation: aggregationValidation.generateAggregation,
		handler: AggregationsController.generateAggregation
	},
	{
		method: 'GET',
		path: '/ping',
		handler: AggregationsController.pingDb
	}
]
