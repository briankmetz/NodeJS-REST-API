const express = require('express');
const validate = require('express-validation');
const messageCtrl = require('../../controllers/message');
const { jwt } = lRequire('expressMiddleware');
const asyncWrap = hRequire('asyncRouteWrapper');
const pV = require('./paramValid/message');



const router = express.Router();

router.route('/user/:sendToUserKey([0-9A-F]{16})')
	.post(jwt, validate(pV.sendMessage), asyncWrap(messageCtrl.sendMessage));

module.exports = router;
