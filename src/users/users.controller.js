const { HttpError, jwt } = require('@terrajs/mono');
const Users = require('./users.services');

exports.signUp = async (req, res, next) => {
	const newUser = req.body.user;

	try {
		const user = await Users.findByMail(newUser.email);
		if (user) return next(new HttpError('User already exists', 400));

		const result = await Users.addUser(newUser);
		const token = await jwt.generateJWT({ userId: newUser.email });

		res.json({ result, token });

	} catch (err) {
		return next(err);
	}
}

exports.signIn = async (req, res, next) => {
	const { password, email } = req.body.user;

	try {
		const user = await Users.findByMail(email);
		if (!user) return next(new HttpError('User not found', 400));

		await Users.checkPassword(password, user.password);
		const token = await jwt.generateJWT({ userId: email });

		res.json(token);

	} catch (err) {
		return next(err);
	}
}