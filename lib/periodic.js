const nodemailer = require("nodemailer");
const nodeSESTransport = require('nodemailer-ses-transport');

const config = cRequire('env');
const { db, EmailLog, EmailQueue } = cRequire('db');
const notify = lRequire('notify');

var SESTransport = null;

// TODO: Rewrite these functions using promises
async function sendNotifications() { //send out new push notifications 
	/*
	console.log('Sending notifications');
	notify.sendQueue();
	*/
};


async function getAndSendEmail(){
	console.log('Sending emails');
	
	const emails = await db.raw("CALL sp_gatherEmailForSend(?)", [config.aws.config.maxSendRate])
	.then((spResult)=>{
		if(!spResult && !spResult[0] && !spResult[0][0]){//no emails queued
			return [];
		}
		return spResult[0][0];
	})
	
	for(var i = 0; i < emails.length; i++){
		sendMail({
			id: emails[i].id,
			from: config.aws.config.sendingAddress, // sender address
			to: emails[i].to_address, // list of receivers
			subject: emails[i].subject_text, // Subject line
			text: emails[i].body_text, // plaintext body
			html: emails[i].body_html // html body
		})
	}
}

async function sendMail(mail){
	if(!SESTransport){ //SESTransport has not been instantiated yet
		SESTransport = nodemailer.createTransport(nodeSESTransport({
			AWSAccessKeyID: config.aws.config.accessKeyId,
			AWSSecretKey: config.aws.config.secretAccessKey,
			ServiceUrl: config.aws.config.SESServiceURL
		}))
	}
	
	SESTransport.sendMail(mail, function(error, response){
		let SESResponse;
		if(error){
			SESResponse = JSON.stringify(error);
		}else{
			SESResponse = JSON.stringify(response.message);
		}
		
		EmailLog.query()
		.insert({
			from_address: mail.from,
			to_address: mail.to,
			subject_text: mail.subject,
			body_text: mail.text,
			body_html: mail.html,
			server_response: SESResponse
		}).then((result) => {
			console.log('Email Sent')
		})

		EmailQueue.query()
		.delete()
		.where({id: mail.id})
		.then((result) => {
			//do nothing
		})
	})
}

module.exports = {
	sendNotifications,
	getAndSendEmail
}