// custom JOI types for reusably validating complex user input
const Joi = require('joi');

const imageMime = Joi.valid('image/jpeg', 'image/png');
const maxImageSize = Joi.number().integer().min(0).max(8000000);

const imageKeys = {
	type: imageMime.required(),
	size: maxImageSize.required()
}

// defines the minimum requires for an image to pass input validation
const image = Joi.object().keys(imageKeys)

module.exports = {
	image
}