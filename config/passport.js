const passport = require('passport');
const Strategy = require('passport-local');
const { Identity } = require('./db');
const customError = cRequire('customError');

passport.use('local-identity', new Strategy({ usernameField: 'email' }, async (email, password, next) => {
	try {
		const identity = await Identity.active().where({ email }).first();
		if (!identity) {
			return next(new customError.ResourceNotFoundError('Email'));
		}

		const isMatch = await Identity.comparePassword(password, identity.password);
		if (!isMatch) {
			return next(new customError.ResourceNotFoundError('Email or password'));
		}

		return next(null, identity);
	} catch (err) {
		return next(err);
	}
}));

// TODO: a passport strategy for users who forgot their password

module.exports = passport;
