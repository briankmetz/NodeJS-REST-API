const fs = require('fs');
const easyimg = require('easyimage');
const util = lRequire('util');
const s3 = lRequire('s3');
const config = cRequire('env');
const { db, Image } = cRequire( 'db');
const customError = cRequire('customError');

const s3Prefix = config.aws.s3.images.urlPrefix;

// Upload an Image
async function uploadImage(identityId, albumId, file) {
	if(!file) throw new customError.ResourceNotFoundError('File');
	
	// fix file orientation, create scaled and thumb image, retrieve scaled info
	await fixOrientation(file.path);
	const [scaledPath, thumbPath] =  await Promise.all([
		createScaled(file.path), createThumb(file.path)
	])
	const info = await imgInfo(scaledPath);
	
	const newImage = {
		mime_type: file.type,
		size: info.size,
		avg_color: info.avgColor,
		px_height: info.height,
		px_width: info.width,
		identity_id: identityId,
		album_id: albumId
	}
	
	// create an Image record for this file without urls yet
	const image = await Image.query()
	.insertGraphAndFetch(newImage)

	// concurrently upload scaled image and thumb image to S3, rollback completely if any error is encountered
	const patchedImage = await Promise.all([s3.uploadImage(scaledPath, image.key, file.type), s3.uploadImage(thumbPath, image.key+"_thumb2x", file.type)])
	.then(async () => {
		return await uploadSuccess(image, file.path);
	})
	.catch(async (err) => {
		await uploadFailed(image, file.path);
		throw new customError.InternalError(); // propogate error up the promise chain
	})
	
	return patchedImage;
}

async function uploadSuccess(image, tmpPath) {
	const key = image.key;
	const url = s3Prefix+key;
	const thumb_url = s3Prefix+key+"_thumb2x";
	
	// update the image record with urls
	return await image.$query() // instance operations use .$query as opposed to model operations which use .query
	.patchAndFetch({url, thumb_url})
	
	// delete tmp files
	fs.unlink(tmpPath, function (err) {console.log(err)});
	fs.unlink(tmpPath+"_scaled", function (err) {console.log(err)});
	fs.unlink(tmpPath+"_thumb2x", function (err) {console.log(err)});
};

async function uploadFailed(image, tmpPath) {
	const key = image.key;
	
	// delete s3 images if they exist
	s3.deleteImage(image.key);
	s3.deleteImage(image.key+"_thumb2x");

	// delete the image record
	return image.$query() // instance operations use .$query as opposed to model operations which use .query
	.delete()

	//delete tmp files
	fs.unlink(tmpPath, function (err) {console.log(err)});
	fs.unlink(tmpPath+"_scaled", function (err) {console.log(err)});
	fs.unlink(tmpPath+"_thumb2x", function (err) {console.log(err)});
};

// creates thumbnail of image
async function createThumb(srcPath){
	await easyimg.resize({src:srcPath, dst:srcPath+"_thumb2x", width:256, height:256, quality:75});
	return srcPath + "_thumb2x";
};

// scales image down so max side length is 1080 px
async function createScaled(srcPath){
	var img = await easyimg.info(srcPath);

	if(img.width > 1080 || img.height > 1080){
		var newWidth = Math.ceil(1080 * img.width/Math.max(img.width, img.height));
		var newHeight = Math.ceil(1080 * img.height/Math.max(img.width, img.height));
		await easyimg.resize({src:srcPath, dst:srcPath+"_scaled", width:newWidth, height:newHeight, quality:75});
		return srcPath + "_scaled";
	} else {
		return srcPath;
	}
};

// corrects orientation of photos taken by phone if needed
async function fixOrientation(image_path) {
	var orientation;

	var orientationResult = await util.run('identify -format %[EXIF:Orientation] ' + image_path);
	orientation = parseInt(orientationResult);

	if(orientation === 1) { // orientation is correct
		return;
	} else { // orientation needs to be fixed
		await util.run('mogrify -auto-orient ' + image_path);
		return;
	}
}

// returns height, width and average color
async function imgInfo(image_path){
	var width, height, size, avgColor;
	
	var img = await easyimg.info(image_path);
	width = img.width;
	height = img.height;
	size = img.size;

	var colors = await util.run('convert ' +image_path+ ' -scale 1x1 -format \'%[fx:int(255*r+.5)],%[fx:int(255*g+.5)],%[fx:int(255*b+.5)]\' info:');
	avgColor = colors.slice(1, colors.length-1).split(',').map(function(e){return parseInt(e).toString(16)}).join('');
	
	return {width, height, size, avgColor};
}

module.exports = {
	uploadImage
}
