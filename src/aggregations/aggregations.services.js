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

function processGroup({ dimensions, sumBy }) {
	const g = {};

	if (dimensions && dimensions.length) {
		if (_.isString(dimensions)) {
			g['_id'] = `$${dimensions}`
			g[dimensions] = { '$first': `$${dimensions}` }
		} else {
			g['_id'] = _.reduce(dimensions, (accumulator, dimension) => {
				accumulator[dimension] = `$${dimension}`;
				return accumulator;
			}, {});
			_.forEach(dimensions, (dim) => { g[dim] = { '$first': `$${dim}` } })
		}
	} else g['_id'] = null;

	if (sumBy && sumBy.length) {
		if (_.isString(sumBy)) {
			g[sumBy] = { $sum: `$${sumBy}` }
		} else {
			_.forEach(sumBy, (field) => {
				g[field] = { $sum: `$${field}` }
			});
		}
	}

	return g;
}

function mapAggregationQuery({ shouldMatch, mustMatch, sort, unwind, group, aggregations }) {
	const q = [];

	if (shouldMatch) q.push({ '$match': { '$or': _.map(shouldMatch, (field, name) => { return { [name]: processMatch(field) } }) } })
	if (mustMatch) q.push({ '$match': { '$and': _.map(mustMatch, (field, name) => { return { [name]: processMatch(field) } }) } })
	if (sort) q.push({ '$sort': sort })
	if (unwind) q.push({ '$unwind': `$${unwind}` })
	if (group) {
		q.push({ '$group': processGroup(group) })
		q.push({ '$project': { _id: 0 } });
	}

	if (aggregations) q.push({ "$facet": _.mapValues(aggregations, (aggs) => { return mapAggregationQuery(aggs) }) })

	return q;
}

function aggregate(options, next) {
	db.collection(options.collection).aggregate(mapAggregationQuery(options), {}, (err, cursor) => {
		if (err) return next(err);

		return next(null, cursor);
	})
}

module.exports = {
	aggregate
}
