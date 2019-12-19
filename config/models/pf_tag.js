const { Model } = require('objection');

class Tag extends Model {
	static get tableName() { return 'pf_tag'; }

	static active() {
		return this.query().where({ 'pf_tag.active': 1 });
	}
	
	static async lookupByKey(key) {
		const tag = await Tag.active()
		.select('id')
		.where({ key })
		.first()
		
		if(tag)
			return tag.id;
		else
			return null;
	}
	
	static async lookupByKeys(keys) {
		const tags = await Tag.active()
		.select('id')
		.whereIn('pf_tag.key', keys)
		
		if(tags && tags.length > 0)
			return tags.map(tag => tag.id);
		else
			return [];
	}
	
	static get modifiers() {
		return {
			// modifies eager to only return tags for one user. userKey must be set by adding .context({userKey: 'my_key'}) to query builder
			mine: (builder) => {
				if(builder.context().userKey){
					builder
						.join('j_user_tag as j_ut2', 'j_ut2.tag_id', 'pf_tag.id')
						.join('v_user_profile as v_up2', 'v_up2.id', 'j_ut2.user_id')
						.where('v_up2.key', builder.context().userKey)
				}else{ // for login, so we don't have to look up user key first
					builder
						.join('j_user_tag as j_ut2', 'j_ut2.tag_id', 'pf_tag.id')
						.join('v_user_profile as v_up2', 'v_up2.id', 'j_ut2.user_id')
						.where('v_up2.identity_id', builder.context().identityId)
						.where('v_up2.conference_id', builder.context().conferenceId)
				}
			}
		}
	}
}

module.exports = Tag;
