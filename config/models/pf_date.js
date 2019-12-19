const { Model } = require('objection');

class Date extends Model {
	static get tableName() { return 'pf_date'; }

	static active() {
		return this.query().where({ 'pf_date.active': 1 });
	}
	
	static get modifiers() {
		return {
			// modifies eager to display dates in proper order
			inOrder: (builder) => {
				builder.orderBy('pf_date.day', 'asc');
			}
		}
	}
}

module.exports = Date;
