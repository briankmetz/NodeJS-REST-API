const { Model } = require('objection');

class Whitelabel extends Model {
	static get tableName() { return 'pf_whitelabel'; }

	static active() {
		return this.query().where({ 'pf_whitelabel.active': 1 });
	}
	
	static async lookupByKey(key) {
		const whitelabel = await Whitelabel.active()
		.select('id')
		.where({ key })
		.first()
		
		if(whitelabel)
			return whitelabel.id;
		else
			return null;
	}
	
	static get relationMappings() {
		return {
			image: {
				relation: Model.HasOneRelation,
				modelClass: `${__dirname}/pf_image`,
				join: {
					from: 'pf_whitelabel.image_id',
					to: 'pf_image.id'
				}
			}
		}
	}
}

module.exports = Whitelabel;
