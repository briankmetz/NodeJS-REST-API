const { Model } = require('objection');

class Thread extends Model {
	static get tableName() { return 'pf_thread'; }

	static active() {
		return this.query().where({ 'pf_thread.active': 1 });
	}
	
	static async lookupByKey(key) {
		const thread = await Thread.active()
		.select('id')
		.where({ key })
		.first()
		
		if(thread)
			return thread.id;
		else
			return null;
	}
	
	static async lookupAndVerifyByKey(key, userKey) { // verify this person has access to the thread
		const thread = await Thread.active()
		.select('pf_thread.id')
		.join('j_user_thread', 'j_user_thread.thread_id', 'pf_thread.id')
		.join('pf_user', 'pf_user.id', 'j_user_thread.user_id')
		.where({
			'pf_thread.key': key,
			'pf_user.key': userKey
		})
		.first()
		
		if(thread)
			return thread.id;
		else
			return null;
	}
	
	static async existingThread(userKey1, userKey2) { // verify an active meeting exists between these two users
		const thread = await Thread.active()
		.select('pf_thread.id')
		.join('j_user_thread as j_ut1', 'j_ut1.thread_id', 'pf_thread.id')
		.join('pf_user as pf_u1', 'pf_u1.id', 'j_ut1.user_id')
		.join('j_user_thread as j_ut2', 'j_ut2.thread_id', 'pf_thread.id')
		.join('pf_user as pf_u2', 'pf_u2.id', 'j_ut2.user_id')
		.where({
			'pf_u1.key': userKey1,
			'pf_u2.key': userKey2
		})
		.whereRaw('users_in_thread(pf_thread.id) = 2')
		.first()
		
		if(thread)
			return thread.id;
		else
			return null;
	}
	
	static get relationMappings() {
		return {
			message: { // for psuedo-enforced one-to-one mappings (ie. thread to top message)
				relation: Model.HasOneRelation,
				modelClass: `${__dirname}/pf_message`,
				join: {
					from: 'pf_thread.id',
					to: 'pf_message.thread_id'
				}
			},
			messages: {
				relation: Model.HasManyRelation,
				modelClass: `${__dirname}/pf_message`,
				join: {
					from: 'pf_thread.id',
					to: 'pf_message.thread_id'
				}
			},
			user_threads: {
				relation: Model.HasManyRelation,
				modelClass: `${__dirname}/j_user_thread`,
				join: {
					from: 'pf_thread.id',
					to: 'j_user_thread.thread_id'
				}
			},
			users: {
				relation: Model.ManyToManyRelation,
				modelClass: `${__dirname}/v_user_profile`,
				join: {
					from: 'pf_thread.id',
					through: {
						from: 'j_user_thread.thread_id',
						to: 'j_user_thread.user_id'
					},
					to: 'v_user_profile.id'
				}
			}
		}
	}
	
	static get modifiers() {
		return {
			// modifies eager to only return active threads with this user, selects 'accepted' for this user not the model user
			withMe: (builder) => {
				builder
					.select('pf_thread.*', 'j_ut2.accepted as accepted')
					.join('j_user_thread as j_ut2', function(){
						this.on('j_ut2.thread_id', '=', 'pf_thread.id').on('j_ut2.user_id', '!=', 'j_user_thread.user_id') // ensures no threads will return if user looks up themselves
					}) 
					.join('pf_user as pf_u2', 'pf_u2.id', 'j_ut2.user_id')
					.where('pf_u2.key', builder.context().userKey)
					.whereRaw('users_in_thread(pf_thread.id) = 2')
			}
		}
	}
}

module.exports = Thread;
