const { Model } = require('objection');

class UserMeeting extends Model {
	static get tableName() { return 'j_user_meeting'; }
}

module.exports = UserMeeting;
