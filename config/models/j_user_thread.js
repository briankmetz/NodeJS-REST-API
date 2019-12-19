const { Model } = require('objection');

class UserThread extends Model {
	static get tableName() { return 'j_user_thread'; }
}

module.exports = UserThread;
