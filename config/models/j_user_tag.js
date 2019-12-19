const { Model } = require('objection');

class UserTag extends Model {
	static get tableName() { return 'j_user_tag'; }
}

module.exports = UserTag;
