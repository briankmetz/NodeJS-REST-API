const expressJwt = require('express-jwt');
const passport = require('passport');
const config = cRequire('env');
const roleCheck = lRequire('roleCheck');


const localIdentityAuth = passport.authenticate('local-identity', { session: false });
const jwt = expressJwt({ secret: config.jwtSecret });

module.exports = { 
	jwt, 
	localIdentityAuth, 
	roleCheck 
}
