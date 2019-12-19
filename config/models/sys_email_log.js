const { Model } = require('objection');

class EmailLog extends Model {
	static get tableName() { return 'sys_email_log'; }
}

module.exports = EmailLog;
