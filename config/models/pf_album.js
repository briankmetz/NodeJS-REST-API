const { Model } = require('objection');

class Album extends Model {
	static get tableName() { return 'pf_album'; }
	
	static active() {
		return this.query().where({ 'pf_album.active': 1 });
	}
	
	static async lookupByKey(key) {
		const album = await Album.active()
		.select('id')
		.where({ key })
		.first()
		
		if(album)
			return album.id;
		else
			return null;
	}
	
	static async lookupProfileByIdentityKey(identityKey) {
		const album = await Album.active()
		.select('pf_album.id')
		.join('pf_identity', 'pf_identity.id', 'pf_album.identity_id')
		.where({ 
			'pf_album.type': 'PROFILE',
			'pf_identity.key': identityKey
		})
		.first()
		
		if(album)
			return album.id;
		else
			return null;
	}
}

module.exports = Album;
