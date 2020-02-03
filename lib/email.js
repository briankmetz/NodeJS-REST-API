// Module dependencies
const { Conference, db, EmailQueue, UserProfile } = cRequire('db');
const config = cRequire('env');
const path = require('path');
const fs = require('fs');

// current state of the HTML templates
var currentHTMLWelcome = "";

// initialize HTML templates
fs.readFile(path.resolve("lib/emailTemplates/welcome.html"), function (err, data) {
	if (err) {
		console.log('Error reading html template');
	} else {
		currentHTMLWelcome = data.toString();
	}
})

// queues a welcome email for a specific user
async function generateWelcomeEmail(userKey) {
	const user = await UserProfile.getByKey(userKey);
	const conference = await Conference.getById(user.conference_id);
	
	const name = user.name;
	const loginUrl = config.baseWebAppUrl + '/' + conference.slug + '/login';
	
	var HTMLBody = currentHTMLWelcome;
	var textBody = 'Welcome to Summit Agenda!\nHere you can check on the event scheduler, find attendees, and network through the app to set up meetings.';
	HTMLBody = HTMLBody.replace('[NAME]', name).replace('[URL]', loginUrl);
	
	var mailOptions = {
		to_address: user.email,
		subject_text: "Welcome to Summit Agenda",
		body_text: textBody,
		body_html: HTMLBody
	}
	
	queueMail(mailOptions);
};

async function queueMail(mailOptions){
	// from_address should be specified in config file
	EmailQueue.query()
	.insert(mailOptions)
	.then((result) => {
		console.log('Email Queued');
	})
};

module.exports = {
	generateWelcomeEmail
};