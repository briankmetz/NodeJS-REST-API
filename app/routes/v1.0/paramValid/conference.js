const Joi = require('joi');

module.exports.getConference = {
	params: {
		conferenceKey: Joi.string()
	}
}