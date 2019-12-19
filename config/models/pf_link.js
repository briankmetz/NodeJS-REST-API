const { Model } = require('objection');

class Link extends Model {
	static get tableName() { return 'pf_link'; }
	
	static active() {
		return this.query().where({ 'pf_link.active': 1 });
	}
}

module.exports = Link;
