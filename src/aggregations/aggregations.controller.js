const JSONStream = require('JSONStream')
const Aggregations = require('./aggregations.services')

exports.generateAggregation = (req, res, next) => {

	const query = req.body

	Aggregations.aggregate(query, (err, cursor) => {
		if (err) return next(err)

		cursor
			.pipe(JSONStream.stringify())
			.pipe(res.type('json'));
	})
}