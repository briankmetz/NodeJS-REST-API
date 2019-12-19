const Joi = require('joi');

module.exports.sendFeedback = {
	body: {
		email: Joi.string().email().lowercase(),
		name: Joi.string(),
		feedback: Joi.string().required()
	}
}

module.exports.resetEmail = {
	body: {
		email: Joi.string().email().lowercase().required()
	}
}

module.exports.resetPassword = {
	body: {
		old_password: Joi.string().min(6).required(),
		new_password: Joi.string().min(6).required()
	}
}