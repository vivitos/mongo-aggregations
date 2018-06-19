const { HttpError, jwt } = require('@terrajs/mono');
const Users = require('./users.services');

exports.signUp = (req, res, next) => {
	const newUser = req.body.user;

	Users.findByMail(newUser.email, (err, user) => {
		if (err) return next(err);
		if (user) return next(new HttpError('User already exists', 400));

		Users.addUser(newUser, (err, result) => {
			if (err) return next(err);

			jwt.generateJWT({ userId: newUser.email }).then((token) => {
				res.json({ result, token });
			}).catch((err) => { return next(err) })
		})
	})
}

exports.signIn = (req, res, next) => {
	const { password, email } = req.body.user;

	Users.findByMail(email, (err, user) => {
		if (err) return next(err);
		if (!user) return next(new HttpError('User not found', 400));

		Users.checkPassword(password, user.password, (err) => {
			if (err) return next(err);

			jwt.generateJWT({ userId: email }).then((token) => {
				res.json(token);
			}).catch((err) => { return next(err) })
		})
	})
}

exports.checkToken = (req, res) => {
	res.json();
}