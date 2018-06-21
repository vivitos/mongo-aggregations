const AggregationValidation = require('./aggregations.validation')
const AggregationsController = require('./aggregations.controller')

module.exports = [
	{
		method: 'POST',
		path: '/aggregations',
		session: true,
		validation: AggregationValidation.generateAggregation,
		handler: AggregationsController.generateAggregation
	}
]