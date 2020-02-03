const _ = require( 'lodash');
const { Album, db, Identity, Profile } = cRequire( 'db');
const cleanup = lRequire('cleanup');
const uploadLib = lRequire('upload');
const customError = cRequire('customError');

// upload an image to the user's album
async function uploadImage(req, res) {
	const identity = req.user;
	const { type, image } = req.body;
	
	const identityId = await Identity.lookupByKey(identity.identityKey);
	const albumId = await Album.lookupProfileByIdentityKey(identity.identityKey);
	if(!identityId || !albumId) throw new customError.ResourceNotFoundError('Profile');
	
	const newImage = await uploadLib.uploadImage(identityId, albumId, image);
	
	if(type == 'PROFILE'){ // update user profile with the image
		await Profile.query()
		.patch({image_id: newImage.id})
		.where({identity_id: identityId})
	}
	
	const data = await cleanup(newImage, 'image');
	res.jsend(data);
}

module.exports = {
	uploadImage
}
