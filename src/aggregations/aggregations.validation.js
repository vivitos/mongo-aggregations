/*
** See https://terrajs.org/mono/routes#validation
*/
const Joi = require('joi') // joi is a dependency of mono

const generateAggregation = {
	body: Joi.object().keys({
		mustMatch: Joi.object().min(1),
		shouldMatch: Joi.object().min(1),
		sort: Joi.string(),
		unwind: Joi.string(),
		group: Joi.object(),
		aggregations: Joi.object().min(1)
	})
}
module.exports = {
	generateAggregation
}