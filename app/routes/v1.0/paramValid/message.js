const Joi = require('joi');

module.exports.sendMessage = {
	params: {
		sendToUserKey: Joi.string().required()
	},
	body: {
		message: Joi.string().required()
	}
}