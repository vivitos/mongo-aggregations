const bcrypt = require('bcrypt');
const { db } = require('mono-mongodb');
const { HttpError } = require('@terrajs/mono');

exports.findByMail = (email, next) => {
	db.collection('users').findOne({ email }, {}, (err, user) => {
		if (err) return next(err);

		return next(null, user);
	})
}

exports.addUser = (user, next) => {
	const { password } = user;

	bcrypt.hash(password, 10, (err, hash) => {
		if (err) return next(err);

		db.collection('users').insertOne({ ...user, password: hash }, {}, (err, result) => {
			if (err) return next(err);

			return next(null, result);
		})
	});
}

exports.checkPassword = (password, encryptedPassword, next) => {
	bcrypt.compare(password, encryptedPassword, (err, check) => {
		if (err) return next(err);
		if (!check) return next(new HttpError('Wrong password', 400))

		return next();
	})
}