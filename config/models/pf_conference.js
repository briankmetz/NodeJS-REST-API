const { Model } = require('objection');

class Conference extends Model {
	static get tableName() { return 'pf_conference'; }
	
	static active() {
		return this.query().where({ 'pf_conference.active': 1 });
	}
	
	static async lookupByKey(key) {
		const conference = await Conference.active()
		.select('id')
		.where({ key })
		.first()
		
		if(conference)
			return conference.id;
		else
			return null;
	}
	
	static async lookupBySlugOrKey(query) {
		const conference = await Conference.active()
		.select('id')
		.where('key', query)
		.orWhere('slug', query)
		.first()
		
		if(conference)
			return conference.id;
		else
			return null;
	}
	
	static async getById(id) {
		const conference = await Conference.active()
		.where({ id })
		.first()
		
		if(conference)
			return conference;
		else
			return null;
	}
	
	static async getByKey(key) {
		const conference = await Conference.active()
		.where({ key })
		.first()
		
		if(conference)
			return conference;
		else
			return null;
	}

	static get relationMappings() {
		return {
			attendee_categories: { // hardcoded conference categories to be removed in v2 and replaced with selections
				relation: Model.HasManyRelation,
				modelClass: `${__dirname}/pf_category`,
				join: {
					from: 'pf_conference.id',
					to: 'pf_category.conference_id'
				},
				modify: 'attendeeCategories'
			},
			interest_categories: {
				relation: Model.HasManyRelation,
				modelClass: `${__dirname}/pf_category`,
				join: {
					from: 'pf_conference.id',
					to: 'pf_category.conference_id'
				},
				modify: 'interestCategories'
			},
			offer_categories: {
				relation: Model.HasManyRelation,
				modelClass: `${__dirname}/pf_category`,
				join: {
					from: 'pf_conference.id',
					to: 'pf_category.conference_id'
				},
				modify: 'offerCategories'
			},
			dates: {
				relation: Model.HasManyRelation,
				modelClass: `${__dirname}/pf_date`,
				join: {
					from: 'pf_conference.id',
					to: 'pf_date.conference_id'
				}
			},
			roles: {
				relation: Model.HasManyRelation,
				modelClass: `${__dirname}/pf_role`,
				join: {
					from: 'pf_conference.id',
					to: 'pf_role.conference_id'
				}
			},
			selections: { // not in use atm, selections are hardcoded on the frontend so conferences key directly to categories for now
				relation: Model.HasManyRelation,
				modelClass: `${__dirname}/pf_selection`,
				join: {
					from: 'pf_conference.id',
					to: 'pf_selection.conference_id'
				}
			},
			whitelabels: {
				relation: Model.HasManyRelation,
				modelClass: `${__dirname}/pf_whitelabel`,
				join: {
					from: 'pf_conference.id',
					to: 'pf_whitelabel.conference_id'
				}
			}
		}
	}
}

module.exports = Conference;
