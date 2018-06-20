const bcrypt = require('bcrypt');
const { db } = require('mono-mongodb');
const { HttpError } = require('@terrajs/mono');

exports.findByMail = async (email) => {
	try {
		return await db.collection('users').findOne({ email })
	} catch (err) {
		throw new Error(err);
	}
}

exports.addUser = async (user) => {
	const { password } = user;

	try {
		const hash = await bcrypt.hash(password, 10);
		return await db.collection('users').insertOne({ ...user, password: hash });
	} catch (err) {
		throw new Error(err);
	}
}

exports.checkPassword = async (password, encryptedPassword) => {
	try {
		const check = await bcrypt.compare(password, encryptedPassword);
		if (!check) throw new HttpError('Wrong password', 400);

	} catch (err) {
		throw new Error(err);
	}
}