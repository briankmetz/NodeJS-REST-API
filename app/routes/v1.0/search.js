const express = require('express');
const validate = require('express-validation');
const searchCtrl = require('../../controllers/search');
const { jwt } = lRequire('expressMiddleware');
const asyncWrap = hRequire('asyncRouteWrapper');
const pV = require('./paramValid/search');



const router = express.Router();

router.route('/attendee')
	.get(jwt, validate(pV.getAttendees), asyncWrap(searchCtrl.getAttendees));

module.exports = router;
