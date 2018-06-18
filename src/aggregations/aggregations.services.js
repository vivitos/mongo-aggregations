const { db } = require('mono-mongodb')
const _ = require('lodash');

function processMatch(query) {
	const q = {};

	if (_.isString(query) || _.isNumber(query)) return query;

	if (query.between && query.between.length) {
		q['$gte'] = _.head(query.between)
		q['$lte'] = _.last(query.between)
	}

	if (query.in && query.in.length) {
		q['$in'] = query.in
	}

	return q;
}

function mapAggregationQuery(query) {
	const q = [];

	if (query.shouldMatch) q.push({ '$match': { '$or': _.map(query.shouldMatch, (field, name) => { return { [name]: processMatch(field) } }) } })
	if (query.mustMatch) q.push({ '$match': { '$and': _.map(query.mustMatch, (field, name) => { return { [name]: processMatch(field) } }) } })
	if (query.sort) q.push({ '$sort': query.sort })
	if (query.unwind) q.push({ '$unwind': `$${query.unwind}` })

	if (query.aggregations) q.push({ "$facet": _.mapValues(query.aggregations, (aggs) => { return mapAggregationQuery(aggs) }) })

	return q;
}

function aggregate(options, next) {

	return next(null, mapAggregationQuery(options));

	// db.collection("perfo_data").aggregate(options, {}, (err, cursor) => {
	// 	if (err) return next(err);

	// 	return next(null, cursor);
	// })
}

function findOne(next) {
	db.collection("perfo_data").findOne({}, {}, (err, cursor) => {
		if (err) return next(err);

		return next(null, cursor);
	})
}

module.exports = {
	aggregate,
	findOne
}
