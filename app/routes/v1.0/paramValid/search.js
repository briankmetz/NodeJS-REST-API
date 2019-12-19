const Joi = require('joi');

module.exports.getAttendees = {
	query: {
		query: Joi.string().allow(''),
		tags: Joi.array().items(Joi.string().regex(/[0-9A-F]{16}/)),
		limit: Joi.number().integer().min(1).max(100),
		paging: Joi.string().allow('')
	}
}