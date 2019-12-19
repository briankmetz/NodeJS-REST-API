const bcrypt = require('bcryptjs');
const { Model } = require('objection');

class Identity extends Model {
	static get tableName() { return 'pf_identity'; }
	
	static active() {
		return this.query().where({ 'pf_identity.active': 1 });
	}
	
	static async hashPassword(password) {
		return await bcrypt.hash(password, bcrypt.genSaltSync(10), null);
	}
	
	static async comparePassword(password, hashedPassword) {
		return await bcrypt.compare(password, hashedPassword);
	}
	
	static async lookupByKey(key) {
		const identity = await Identity.active()
		.select('id')
		.where({ key })
		.first()
		
		if(identity)
			return identity.id;
		else
			return null;
	}
	
	static async getByKey(key) {
		const identity = await Identity.active()
		.where({ key })
		.first()
		
		if(identity)
			return identity;
		else
			return null;
	}
	
	static async lookupByEmail(email) {
		const identity = await Identity.query()
		.select('id')
		.where({ email })
		.first()
		
		if(identity)
			return identity.id;
		else
			return null;
	}

	static get relationMappings() {
		return {
			albums: {
				relation: Model.HasManyRelation,
				modelClass: `${__dirname}/pf_album`,
				join: {
					from: 'pf_identity.id',
					to: 'pf_album.identity_id'
				}
			},
			profile: {
				relation: Model.HasOneRelation,
				modelClass: `${__dirname}/pf_profile`,
				join: {
					from: 'pf_identity.id',
					to: 'pf_profile.identity_id'
				}
			},
			users: {
				relation: Model.HasManyRelation,
				modelClass: `${__dirname}/pf_user`,
				join: {
					from: 'pf_identity.id',
					to: 'pf_user.identity_id'
				}
			}
		}
	}
}

module.exports = Identity;
