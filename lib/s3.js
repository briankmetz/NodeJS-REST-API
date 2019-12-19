const aws = require('aws-sdk');
const fs = require('fs');
const awsConfig = cRequire('env').aws;

aws.config.update(awsConfig.config);
const s3 = new aws.S3({apiVersion: '2006-03-01'});

const imgBucket = awsConfig.s3.images.bucket;

async function uploadImage(filePath, filename, mime_type) {
	var fileBuffer = fs.readFileSync(filePath);

	var params = {
		ACL: 'public-read',
		Bucket: imgBucket,
		Key: 'images/'+filename,
		Body: fileBuffer,
		ContentType: mime_type
	}
	
	return await s3.putObject(params).promise();
}

async function deleteFile(bucket, key){
	var params = {
		Bucket: bucket,
		Key: key
	}

	return await s3.deleteObject(params).promise();
}

async function deleteImage(key){
	return await deleteFile(imgBucket, 'images/'+key);
}

module.exports = {
	deleteImage,
	uploadImage
}
