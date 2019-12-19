const express = require('express');
const validate = require('express-validation');
const userCtrl = require('../../controllers/user');
const { jwt } = lRequire('expressMiddleware');
const asyncWrap = hRequire('asyncRouteWrapper');
const pV = require('./paramValid/user');



const router = express.Router();

router.route(['/profile', '/profile/:userKey([0-9A-F]{16})'])
	.get(jwt, validate(pV.getUser), asyncWrap(userCtrl.getUser))
	.post(jwt, validate(pV.editUser), asyncWrap(userCtrl.editUser));
	
router.route('/calendar')
	.get(jwt, validate(pV.getCalendar), asyncWrap(userCtrl.getCalendar));

router.route('/meeting')
	.get(jwt, validate(pV.getMeetings), asyncWrap(userCtrl.getMeetings));

router.route('/notification')
	.get(jwt, validate(pV.getNotifications), asyncWrap(userCtrl.getNotifications));
	
router.route('/thread')
	.get(jwt, validate(pV.getThreads), asyncWrap(userCtrl.getThreads));

module.exports = router;
