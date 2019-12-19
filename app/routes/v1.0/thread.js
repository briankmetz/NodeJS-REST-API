const express = require('express');
const validate = require('express-validation');
const threadCtrl = require('../../controllers/thread');
const { jwt } = lRequire('expressMiddleware');
const asyncWrap = hRequire('asyncRouteWrapper');
const pV = require('./paramValid/thread');



const router = express.Router();

router.route('/accept/:threadKey([0-9A-F]{16})')
	.post(jwt, validate(pV.acceptThread), asyncWrap(threadCtrl.acceptThread));

router.route('/message/:threadKey([0-9A-F]{16})')
	.get(jwt, validate(pV.getMessages), asyncWrap(threadCtrl.getMessages));

module.exports = router;
