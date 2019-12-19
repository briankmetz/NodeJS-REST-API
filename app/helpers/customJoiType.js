const Joi = require('joi');

const imageMime = Joi.valid('image/jpeg', 'image/png');
const maxImageSize = Joi.number().integer().min(0).max(8000000);

const imageKeys = {
	type: imageMime.required(),
	size: maxImageSize.required()
}

const image = Joi.object().keys(imageKeys)

module.exports = {
	image
}