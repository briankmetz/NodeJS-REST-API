const Joi = require('joi');
const JoiTypes = hRequire('customJoiType');

module.exports.uploadImage = {
	body: {
		type: Joi.valid('PROFILE').required(),
		image: JoiTypes.image.required()
	}
}