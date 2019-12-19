const { Model } = require('objection');

class Role extends Model {
	static get tableName() { return 'pf_role'; }

	static active() {
		return this.query().where({ 'pf_role.active': 1 });
	}
}

module.exports = Role;
