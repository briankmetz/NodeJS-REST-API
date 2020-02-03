const expressJwt = require('express-jwt');
const passport = require('passport');
const config = cRequire('env');
const roleCheck = lRequire('roleCheck');

// sets passport strategy; currently only customer users exist in the platform
// eventually business users, admin users and moderator users could be added with distinct login strategies
const localIdentityAuth = passport.authenticate('local-identity', { session: false });
const jwt = expressJwt({ secret: config.jwtSecret });

module.exports = { 
	jwt, 
	localIdentityAuth, 
	roleCheck 
}
