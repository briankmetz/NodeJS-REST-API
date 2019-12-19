const Joi = require('joi');

module.exports.acceptThread = {
	params: {
		threadKey: Joi.string().required()
	}
}

module.exports.getMessages = {
	params: {
		threadKey: Joi.string().required()
	},
	query: {
		limit: Joi.number().integer().min(1).max(100),
		paging: Joi.string()
	}
}