const { Model } = require('objection');

class Image extends Model {
	static get tableName() { return 'pf_image'; }

	static active() {
		return this.query().where({ 'pf_image.active': 1 });
	}
}

module.exports = Image;
