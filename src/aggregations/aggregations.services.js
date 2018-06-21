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

function processGroup(group) {
	const g = {};

	if (group.dimensions && group.dimensions.length) {
		if (_.isString(group.dimensions)) {
			g['_id'] = `$${group.dimensions}`
		} else {
			g['_id'] = _.reduce(group.dimensions, (accumulator, dimension) => {
				accumulator[dimension] = `$${dimension}`;
				return accumulator;
			}, {});
		}
	} else g['_id'] = null;

	if (group.sumBy && group.sumBy.length) {
		if (_.isString(group.sumBy)) {
			g[group.sumBy] = { $sum: `$${group.sumBy}` }
		} else {
			_.forEach(group.sumBy, (field) => {
				g[field] = { $sum: `$${field}` }
			});
		}
	}

	return g;
}

function mapAggregationQuery(query) {
	const q = [];

	const {
		shouldMatch,
		mustMatch,
		sort,
		unwind,
		group,
		aggregations
	} = query;

	if (shouldMatch) q.push({ '$match': { '$or': _.map(shouldMatch, (field, name) => { return { [name]: processMatch(field) } }) } })
	if (mustMatch) q.push({ '$match': { '$and': _.map(mustMatch, (field, name) => { return { [name]: processMatch(field) } }) } })
	if (sort) q.push({ '$sort': sort })
	if (unwind) q.push({ '$unwind': `$${unwind}` })
	if (group) q.push({ '$group': processGroup(group) })

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
