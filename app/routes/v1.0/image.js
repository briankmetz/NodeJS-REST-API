const express = require('express');
const validate = require('express-validation');
const imageCtrl = require('../../controllers/image');
const { jwt } = lRequire('expressMiddleware');
const asyncWrap = hRequire('asyncRouteWrapper');
const formParser = hRequire('formDataParser');
const pV = require('./paramValid/image');



const router = express.Router();

router.route('/user')
	.post(jwt, formParser, validate(pV.uploadImage), asyncWrap(imageCtrl.uploadImage));

module.exports = router;
