const { Model } = require('objection');

class UserProfile extends Model {
	static get tableName() { return 'v_user_profile'; }

	static active() {
		return this.query().where({ 'v_user_profile.active': 1 });
	}
	
	static async lookupByKey(key) {
		const user = await UserProfile.active()
		.select('id')
		.where({ key })
		.first()
		
		if(user)
			return user.id;
		else
			return null;
	}
	
	static async getByKey(key) {
		const user = await UserProfile.active()
		.where({ key })
		.first()
		
		if(user)
			return user;
		else
			return null;
	}

	static get relationMappings() {
		return {
			attendee_categories: { // hardcoded conference categories to be removed in v2 and replaced with selections
				relation: Model.HasManyRelation,
				modelClass: `${__dirname}/pf_category`,
				join: {
					from: 'v_user_profile.conference_id',
					to: 'pf_category.conference_id'
				},
				modify: 'attendeeCategories'
			},
			interest_categories: {
				relation: Model.HasManyRelation,
				modelClass: `${__dirname}/pf_category`,
				join: {
					from: 'v_user_profile.conference_id',
					to: 'pf_category.conference_id'
				},
				modify: 'interestCategories'
			},
			offer_categories: {
				relation: Model.HasManyRelation,
				modelClass: `${__dirname}/pf_category`,
				join: {
					from: 'v_user_profile.conference_id',
					to: 'pf_category.conference_id'
				},
				modify: 'offerCategories'
			},
			
			conference: {
				relation: Model.HasOneRelation,
				modelClass: `${__dirname}/pf_conference`,
				join: {
					from: 'v_user_profile.conference_id',
					to: 'pf_conference.id'
				}
			},
			image: {
				relation: Model.HasOneRelation,
				modelClass: `${__dirname}/pf_image`,
				join: {
					from: 'v_user_profile.image_id',
					to: 'pf_image.id'
				}
			},
			links: {
				relation: Model.HasManyRelation,
				modelClass: `${__dirname}/pf_link`,
				join: {
					from: 'v_user_profile.id',
					to: 'pf_link.user_id'
				}
			},
			meeting: { // for psuedo-enforced one-to-one mappings (ie. user to specific meeting)
				relation: Model.HasOneThroughRelation,
				modelClass: `${__dirname}/pf_meeting`,
				join: {
					from: 'v_user_profile.id',
					through: {
						from: 'j_user_meeting.user_id',
						to: 'j_user_meeting.meeting_id'
					},
					to: 'pf_meeting.id'
				}
			},
			meetings: {
				relation: Model.ManyToManyRelation,
				modelClass: `${__dirname}/pf_meeting`,
				join: {
					from: 'v_user_profile.id',
					through: {
						from: 'j_user_meeting.user_id',
						to: 'j_user_meeting.meeting_id'
					},
					to: 'pf_meeting.id'
				}
			},
			roles: {
				relation: Model.ManyToManyRelation,
				modelClass: `${__dirname}/pf_role`,
				join: {
					from: 'v_user_profile.id',
					through: {
						from: 'j_user_role.user_id',
						to: 'j_user_role.role_id'
					},
					to: 'pf_role.id'
				}
			},
			selections: { // not in use atm, selections are hardcoded on the frontend so conferences key directly to categories for now
				relation: Model.HasManyRelation,
				modelClass: `${__dirname}/pf_selection`,
				join: {
					from: 'v_user_profile.conference_id',
					to: 'pf_selection.conference_id'
				}
			},
			tags: {
				relation: Model.ManyToManyRelation,
				modelClass: `${__dirname}/pf_tag`,
				join: {
					from: 'v_user_profile.id',
					through: {
						from: 'j_user_tag.user_id',
						to: 'j_user_tag.tag_id'
					},
					to: 'pf_tag.id'
				}
			},
			thread: { // for psuedo-enforced one-to-one mappings (ie. user to specific thread)
				relation: Model.HasOneThroughRelation,
				modelClass: `${__dirname}/pf_thread`,
				join: {
					from: 'v_user_profile.id',
					through: {
						from: 'j_user_thread.user_id',
						to: 'j_user_thread.thread_id'
					},
					to: 'pf_thread.id'
				}
			},
			threads: {
				relation: Model.ManyToManyRelation,
				modelClass: `${__dirname}/pf_thread`,
				join: {
					from: 'v_user_profile.id',
					through: {
						from: 'j_user_thread.user_id',
						to: 'j_user_thread.thread_id'
					},
					to: 'pf_thread.id'
				}
			}
		}
	}
	
	static get modifiers() {
		return {
			// modifies eager to only return other users. userKey must be set by adding .context({userKey: 'my_key'}) to query builder
			notMe: (builder) => {
				builder.where('v_user_profile.key', '!=', builder.context().userKey);
			},
			// modifies eager to only return the sender user of a meeting
			sender: (builder) => {
				builder.where('j_user_meeting.type', 'SENDER');
			},
			// modifies eager to only return the recipient user of a meeting
			recipient: (builder) => {
				builder.where('j_user_meeting.type', 'RECIPIENT');
			}
		}
	}
}

module.exports = UserProfile;
