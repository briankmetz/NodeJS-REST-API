const { Model } = require('objection');

class Category extends Model {
	static get tableName() { return 'pf_category'; }

	static active() {
		return this.query().where({ 'pf_category.active': 1 });
	}

	static get relationMappings() {
		return {
			tags: {
				relation: Model.HasManyRelation,
				modelClass: `${__dirname}/pf_tag`,
				join: {
					from: 'pf_category.id',
					to: 'pf_tag.category_id'
				}
			}
		}
	}
	
	static get modifiers() {
		return {
			// modifies eager to return specific category types
			// selections are currently hardcoded on the frontend so each categories array needs a different name based on the selction it belongs to
			attendeeCategories: (builder) => {
				builder.where('pf_category.attendee', 1);
			},
			interestCategories: (builder) => {
				builder.where('pf_category.interest', 1);
			},
			offerCategories: (builder) => {
				builder.where('pf_category.offer', 1);
			}
		}
	}
}

module.exports = Category;
