const { db } = require('mono-mongodb')
const _ = require('lodash');
const conf = require('../../conf/application');

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
	}

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

	if (query.shouldMatch) q.push({ '$match': { '$or': _.map(query.shouldMatch, (field, name) => { return { [name]: processMatch(field) } }) } })
	if (query.mustMatch) q.push({ '$match': { '$and': _.map(query.mustMatch, (field, name) => { return { [name]: processMatch(field) } }) } })
	if (query.sort) q.push({ '$sort': query.sort })
	if (query.unwind) q.push({ '$unwind': `$${query.unwind}` })
	if (query.group) q.push({ '$group': processGroup(query.group) })

	if (query.aggregations) q.push({ "$facet": _.mapValues(query.aggregations, (aggs) => { return mapAggregationQuery(aggs) }) })

	return q;
}

function aggregate(options, next) {
	db.collection(`${conf.aggregations.collection}`).aggregate(mapAggregationQuery(options), {}, (err, cursor) => {
		if (err) return next(err);

		return next(null, cursor);
	})
}

function findOne(next) {
	db.collection(`${conf.aggregations.collection}`).findOne({}, {}, (err, cursor) => {
		if (err) return next(err);

		return next(null, cursor);
	})
}

module.exports = {
	aggregate,
	findOne
}
