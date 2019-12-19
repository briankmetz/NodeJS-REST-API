const { Model } = require('objection');

class EmailQueue extends Model {
	static get tableName() { return 'sys_email_queue'; }
}

module.exports = EmailQueue;
