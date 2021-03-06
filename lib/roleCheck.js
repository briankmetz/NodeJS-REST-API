const _ = require('lodash');
const customError = cRequire('customError');

const requestProperty = 'user';
const permissionsProperty = 'roles';

// currently unused; in the future will allow for a role based identity system so even regular users could be made moderators for example
async function check(requiredRoles) {
	let required = requiredRoles;
	if (typeof required === 'string') {
		required = [required];
	}
	return _middleware.bind(this);

	async function _middleware(req, res, next) {
		const user = req[requestProperty];
		if (!user) return next(new customError.InternalError());

		const permissions = _.get(user, permissionsProperty, undefined);
		if (!permissions) return next(new customError.UnauthorizedError());

		return next(_.intersection(required, permissions).length < required.length ? new customError.UnauthorizedError() : null);
	}
}

module.exports = check;
