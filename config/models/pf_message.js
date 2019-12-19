const { Model } = require('objection');

class Message extends Model {
	static get tableName() { return 'pf_message'; }

	static active() {
		return this.query().where({ 'pf_message.active': 1 });
	}
	
	static async lookupByKey(key) {
		const message = await Message.active()
		.select('id')
		.where({ key })
		.first()
		
		if(message)
			return message.id;
		else
			return null;
	}
	
	static get relationMappings() {
		return {
			meeting: {
				relation: Model.HasOneRelation,
				modelClass: `${__dirname}/pf_meeting`,
				join: {
					from: 'pf_message.meeting_id',
					to: 'pf_meeting.id'
				}
			},
			user: {
				relation: Model.HasOneRelation,
				modelClass: `${__dirname}/v_user_profile`,
				join: {
					from: 'pf_message.user_id',
					to: 'v_user_profile.id'
				}
			}
		}
	}
	
	static get modifiers() {
		return {
			// modifies eager to only return messages that are the top message in a thread
			topInThread: (builder) => {
				builder.leftJoin('pf_message as pf_m2', (builder) => {
					builder.on('pf_m2.thread_id', 'pf_message.thread_id').on('pf_m2.id', '>', 'pf_message.id')
				})
				.whereNull('pf_m2.id')
			}
		}
	}
}

module.exports = Message;
