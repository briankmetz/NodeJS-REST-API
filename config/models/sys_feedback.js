const { Model } = require('objection');

class Feedback extends Model {
	static get tableName() { return 'sys_feedback'; }
}

module.exports = Feedback;
