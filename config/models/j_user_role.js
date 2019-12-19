const { Model } = require('objection');

class UserRole extends Model {
	static get tableName() { return 'j_user_role'; }
}

module.exports = UserRole;
