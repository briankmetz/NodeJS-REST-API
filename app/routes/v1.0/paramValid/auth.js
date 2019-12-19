const Joi = require('joi');

module.exports.login = {
	params: {
		slug: Joi.string().required()
	},
	body: {
		email: Joi.string().email().lowercase().required(),
		password: Joi.string().min(6).required()
	}
}

module.exports.signup = {
	params: {
		slug: Joi.string().required()
	},
	body: {
		email: Joi.string().email().lowercase().required(),
		password: Joi.string().min(6).required(),
		name: Joi.string().required()
	}
}

module.exports.emailInUse = {
	query: {
		email: Joi.string().email().lowercase().required()
	}
}