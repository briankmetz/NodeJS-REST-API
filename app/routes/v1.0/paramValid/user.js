const Maps = require('joi-enums-extension')
const Joi = require('joi').extend(Maps);

const typeMap = {
	RECEIVED: 'RECIPIENT',
	SENT: 'SENDER'
}

module.exports.getUser = {
	params: {
		userKey: Joi.string()
	}
}

module.exports.editUser = {
	params: {
		userKey: Joi.string()
	},
	body: {
		name: Joi.string(),
		title: Joi.string().allow(''),
		company: Joi.string().allow(''),
		description: Joi.string().allow(''),
		links: Joi.array().items(Joi.string().uri({allowRelative: true}).trim()),
		tags: Joi.array().items(Joi.string().regex(/[0-9A-F]{16}/))
	}
}

module.exports.getCalendar = {
	query: {
		time_min: Joi.date().iso().required(),
		time_max: Joi.date().iso().greater(Joi.ref('time_min')).required()
	}
}

module.exports.getMeetings = {
	query: {
		type: Joi.any().map(typeMap),
		limit: Joi.number().integer().min(1).max(100),
		paging: Joi.string()
	}
}

module.exports.getNotifications = {
	query: {
		limit: Joi.number().integer().min(1).max(100),
		paging: Joi.string()
	}
}

module.exports.getThreads = {
	query: {
		accepted: Joi.number().integer().min(0).max(1),
		limit: Joi.number().integer().min(1).max(100),
		paging: Joi.string()
	}
}