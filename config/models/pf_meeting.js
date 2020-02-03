const { Model } = require('objection');

class Meeting extends Model {
	static get tableName() { return 'pf_meeting'; }

	static active() {
		return this.query().where({ 'pf_meeting.active': 1 });
	}
	
	static async lookupByKey(key) {
		const meeting = await Meeting.active()
		.select('id')
		.where({ key })
		.first()
		
		if(meeting)
			return meeting.id;
		else
			return null;
	}
	
	static async lookupAndVerifyByKey(key, userKey, type) { // verify this person has access to the request
		if(!type){
			type = ['SENDER', 'RECIPIENT']
		}
		type = Array.isArray(type) ? type : [type];
		
		const meeting = await Meeting.active()
		.select('pf_meeting.id')
		.join('j_user_meeting', 'j_user_meeting.meeting_id', 'pf_meeting.id')
		.join('pf_user', 'pf_user.id', 'j_user_meeting.user_id')
		.where({
			'pf_meeting.key': key,
			'pf_user.key': userKey
		})
		.whereIn('j_user_meeting.type', type)
		.whereIn('pf_meeting.status', ['ACCEPTED', 'PENDING'])
		.first()
		
		if(meeting)
			return meeting.id;
		else
			return null;
	}
	
	static async lookupAndVerifySenderByKey(key, userKey) { // verify this person sent the meeting request and still has access to it
		return await Meeting.lookupAndVerifyByKey(key, userKey, 'SENDER')
	}
	
	static async lookupAndVerifyRecipientByKey(key, userKey) { // verify this person recieved the meeting request and still has access to it
		return await Meeting.lookupAndVerifyByKey(key, userKey, 'RECIPIENT')
	}
	
	static async existingMeeting(userKey1, userKey2) { // verify an active meeting exists between these two users
		const meeting = await Meeting.active()
		.select('pf_meeting.id')
		.join('j_user_meeting as j_um1', 'j_um1.meeting_id', 'pf_meeting.id')
		.join('pf_user as pf_u1', 'pf_u1.id', 'j_um1.user_id')
		.join('j_user_meeting as j_um2', function(){
			this.on('j_um2.meeting_id', '=', 'pf_meeting.id').on('j_um2.user_id', '!=', 'j_um1.user_id') // avoid bugs when userKey1 and userKey2 are the same
		}) 
		.join('pf_user as pf_u2', 'pf_u2.id', 'j_um2.user_id')
		.where({
			'pf_u1.key': userKey1,
			'pf_u2.key': userKey2
		})
		.whereRaw('users_in_meeting(pf_meeting.id) = 2')
		.whereIn('pf_meeting.status', ['ACCEPTED', 'PENDING'])
		.first()
		
		if(meeting)
			return meeting.id;
		else
			return null;
	}
	
	static get relationMappings() {
		return {
			sender: {
				relation: Model.HasOneThroughRelation,
				modelClass: `${__dirname}/v_user_profile`,
				join: {
					from: 'pf_meeting.id',
					through: {
						from: 'j_user_meeting.meeting_id',
						to: 'j_user_meeting.user_id'
					},
					to: 'v_user_profile.id'
				},
				modify: 'sender'
			},
			recipient: {
				relation: Model.HasOneThroughRelation,
				modelClass: `${__dirname}/v_user_profile`,
				join: {
					from: 'pf_meeting.id',
					through: {
						from: 'j_user_meeting.meeting_id',
						to: 'j_user_meeting.user_id'
					},
					to: 'v_user_profile.id'
				},
				modify: 'recipient'
			},
			user_meetings: {
				relation: Model.HasManyRelation,
				modelClass: `${__dirname}/j_user_meeting`,
				join: {
					from: 'pf_meeting.id',
					to: 'j_user_meeting.meeting_id'
				}
			},
			user: { // for psuedo-enforced one-to-one mappings (ie. meeting to sending user)
				relation: Model.HasOneThroughRelation,
				modelClass: `${__dirname}/v_user_profile`,
				join: {
					from: 'pf_meeting.id',
					through: {
						from: 'j_user_meeting.meeting_id',
						to: 'j_user_meeting.user_id'
					},
					to: 'v_user_profile.id'
				}
			},
			users: {
				relation: Model.ManyToManyRelation,
				modelClass: `${__dirname}/v_user_profile`,
				join: {
					from: 'pf_meeting.id',
					through: {
						from: 'j_user_meeting.meeting_id',
						to: 'j_user_meeting.user_id'
					},
					to: 'v_user_profile.id'
				}
			}
		}
	}
	
	static get modifiers() {
		return {
			// modifies eager query to only return active meetings with a specified user. Be aware, the 'type' field returned is for the specified user, not the model user
			withMe: (builder) => {
				builder
					.select('pf_meeting.*', 'j_um2.type as type')
					.join('j_user_meeting as j_um2', function(){
						this.on('j_um2.meeting_id', '=', 'pf_meeting.id').on('j_um2.user_id', '!=', 'j_user_meeting.user_id') // ensures no meetings will return if user looks up themselves
					}) 
					.join('pf_user as pf_u2', 'pf_u2.id', 'j_um2.user_id')
					.where('pf_u2.key', builder.context().userKey)
					.whereIn('pf_meeting.status', ['ACCEPTED', 'PENDING'])
			}
		}
	}
}

module.exports = Meeting;
