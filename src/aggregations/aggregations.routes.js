const aggregationValidation = require('./aggregations.validation')
const AggregtionsController = require('./aggregations.controller')

module.exports = [
	{
		method: 'POST',
		path: '/aggregations/generate',
		validation: aggregationValidation.generateAggregation,
		handler: AggregtionsController.generateAggregation
	}
]
