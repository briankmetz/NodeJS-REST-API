const { Model } = require('objection');

class User extends Model {
	static get tableName() { return 'pf_user'; }

	static active() {
		return this.query().where({ 'pf_user.active': 1 });
	}

	static get relationMappings() {
		return {
			conference: {
				relation: Model.HasOneRelation,
				modelClass: `${__dirname}/pf_conference`,
				join: {
					from: 'pf_user.conference_id',
					to: 'pf_conference.id'
				}
			},
			links: {
				relation: Model.HasManyRelation,
				modelClass: `${__dirname}/pf_link`,
				join: {
					from: 'pf_user.id',
					to: 'pf_link.user_id'
				}
			},
			meetings: {
				relation: Model.ManyToManyRelation,
				modelClass: `${__dirname}/pf_meeting`,
				join: {
					from: 'pf_user.id',
					through: {
						from: 'j_user_meeting.user_id',
						to: 'j_user_meeting.meeting_id',
						extra: ['type']
					},
					to: 'pf_meeting.id'
				}
			},
			profile: {
				relation: Model.HasOneRelation,
				modelClass: `${__dirname}/pf_profile`,
				join: {
					from: 'pf_user.identity_id',
					to: 'pf_profile.identity_id'
				}
			},
			roles: {
				relation: Model.ManyToManyRelation,
				modelClass: `${__dirname}/pf_role`,
				join: {
					from: 'pf_user.id',
					through: {
						from: 'j_user_role.user_id',
						to: 'j_user_role.role_id'
					},
					to: 'pf_role.id'
				}
			},
			tags: {
				relation: Model.ManyToManyRelation,
				modelClass: `${__dirname}/pf_tag`,
				join: {
					from: 'pf_user.id',
					through: {
						from: 'j_user_tag.user_id',
						to: 'j_user_tag.tag_id'
					},
					to: 'pf_tag.id'
				}
			}
		}
	}
}

module.exports = User;
