const { db } = require('mono-mongodb');

exports.pingDb = async (req, res, next) => {
	try {
		const response = await db.admin().ping();
		res.json(response);
	} catch (err) {
		return next(err);
	}
}