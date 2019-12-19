const { Model } = require('objection');

class Profile extends Model {
	static get tableName() { return 'pf_profile'; }
	
	static active() {
		return this.query().where({ 'pf_profile.active': 1 });
	}

	static get relationMappings() {
		return {
			image: {
				relation: Model.HasOneRelation,
				modelClass: `${__dirname}/pf_image`,
				join: {
					from: 'pf_profile.image_id',
					to: 'pf_image.id'
				}
			}
		}
	}
}

module.exports = Profile;
