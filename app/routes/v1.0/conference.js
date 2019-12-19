const express = require('express');
const validate = require('express-validation');
const conferenceCtrl = require('../../controllers/conference');
const { jwt } = lRequire('expressMiddleware');
const asyncWrap = hRequire('asyncRouteWrapper');
const pV = require('./paramValid/conference');



const router = express.Router();

router.route('/profile')
	.get(jwt, validate(pV.getConference), asyncWrap(conferenceCtrl.getConference));

module.exports = router;
