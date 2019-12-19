const { Model } = require('objection');

class ErrorLog extends Model {
	static get tableName() { return 'sys_err_log'; }
}

module.exports = ErrorLog;
