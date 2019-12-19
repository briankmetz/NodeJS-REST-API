const express = require('express');
const validate = require('express-validation');
const meetingCtrl = require('../../controllers/meeting');
const { jwt } = lRequire('expressMiddleware');
const asyncWrap = hRequire('asyncRouteWrapper');
const pV = require('./paramValid/meeting');



const router = express.Router();

router.route('/user/:sendToUserKey([0-9A-F]{16})')
	.post(jwt, validate(pV.sendMeetingRequest), asyncWrap(meetingCtrl.sendMeetingRequest));

router.route('/status/:meetingKey([0-9A-F]{16})')
	.post(jwt, validate(pV.setMeetingStatus), asyncWrap(meetingCtrl.setMeetingStatus));

router.route('/cancel/:meetingKey([0-9A-F]{16})')
	.post(jwt, validate(pV.cancelMeeting), asyncWrap(meetingCtrl.cancelMeeting));

module.exports = router;
