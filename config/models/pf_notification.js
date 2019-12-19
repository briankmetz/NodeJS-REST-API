const { Model } = require('objection');

class Notification extends Model {
	static get tableName() { return 'pf_notification'; }

	static active() {
		return this.query().where({ 'pf_notification.active': 1 });
	}
	
	static async lookupByKey(key) {
		const notification = await Notification.active()
		.select('id')
		.where({ key })
		.first()
		
		if(notification)
			return notification.id;
		else
			return null;
	}
	
	static get relationMappings() {
		return {
			user: {
				relation: Model.HasOneRelation,
				modelClass: `${__dirname}/v_user_profile`,
				join: {
					from: 'pf_notification.user_id',
					to: 'v_user_profile.id'
				}
			}
		}
	}
}

module.exports = Notification;
