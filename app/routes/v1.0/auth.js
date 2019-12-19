const express = require('express');
const validate = require('express-validation');
const authCtrl = require('../../controllers/auth');
const { localIdentityAuth } = lRequire('expressMiddleware');
const asyncWrap = hRequire('asyncRouteWrapper');
const pV = require('./paramValid/auth');



const router = express.Router();

router.route('/login/:slug')
	.post(validate(pV.login), localIdentityAuth, asyncWrap(authCtrl.login));
	
router.route('/signup/:slug')
	.post(validate(pV.signup), asyncWrap(authCtrl.signup));
	
router.route('/email')
	.get(validate(pV.emailInUse), asyncWrap(authCtrl.emailInUse));

module.exports = router;
