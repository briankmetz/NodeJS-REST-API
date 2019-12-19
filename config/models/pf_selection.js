const { Model } = require('objection');
// This model will be used in V2 when the selections are not fixed
class Selection extends Model {
	static get tableName() { return 'pf_selection'; }

	static active() {
		return this.query().where({ 'pf_selection.active': 1 });
	}

	static get relationMappings() {
		return {
			categories: {
				relation: Model.HasManyRelation,
				modelClass: `${__dirname}/pf_category`,
				join: {
					from: 'pf_selection.id',
					to: 'pf_category.selection_id'
				}
			}
		}
	}
}

module.exports = Selection;
