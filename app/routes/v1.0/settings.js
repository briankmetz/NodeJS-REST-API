const express = require('express');
const validate = require('express-validation');
const settingsCtrl = require('../../controllers/settings');
const { jwt } = lRequire('expressMiddleware');
const asyncWrap = hRequire('asyncRouteWrapper');
const pV = require('./paramValid/settings');



const router = express.Router();

router.route('/feedback')
	.post(validate(pV.sendFeedback), asyncWrap(settingsCtrl.sendFeedback));

router.route('/email')
	.post(jwt, validate(pV.resetEmail), asyncWrap(settingsCtrl.resetEmail));
	
router.route('/password')
	.post(jwt, validate(pV.resetPassword), asyncWrap(settingsCtrl.resetPassword));

module.exports = router;
