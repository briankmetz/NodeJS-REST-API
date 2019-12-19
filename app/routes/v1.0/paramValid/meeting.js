const Joi = require('joi');

module.exports.sendMeetingRequest = {
	params: {
		sendToUserKey: Joi.string().required()
	},
	body: {
		location: Joi.string().required(),
		start_time: Joi.date().iso().required(),
		end_time: Joi.date().iso().greater(Joi.ref('start_time')).required(),
		message: Joi.string().required()
	}
}

module.exports.cancelMeeting = {
	params: {
		meetingKey: Joi.string().required()
	}
}

module.exports.setMeetingStatus = {
	params: {
		meetingKey: Joi.string().required()
	},
	body: {
		status: Joi.valid('ACCEPTED', 'DECLINED')
	}
}