const aggregationValidation = require('./aggregations.validation')
const AggregtionsController = require('./aggregations.controller')

module.exports = [
	{
		method: 'POST',
		path: '/aggregations',
		validation: aggregationValidation.generateAggregation,
		handler: AggregtionsController.generateAggregation
	},
	{
		method: 'GET',
		path: '/ping',
		handler: AggregtionsController.pingDb
	}
]
