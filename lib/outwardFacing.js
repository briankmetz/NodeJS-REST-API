// Module dependencies
const config = cRequire('env');
const { db } = cRequire('db');
const path = require('path');
const fs = require('fs');

// current state of the HTML templates
var currentHTMLActivateSuccess = "";
var currentHTMLActivateFailure = "";

// initialize HTML templates
fs.readFile(path.resolve("./outwardFacingTemplates/activateSuccess.html"), function (err, data) {
	if (err) {
		console.log('Error reading html template');
	} else {
		currentHTMLActivateSuccess = data.toString();
	}
})

fs.readFile(path.resolve("./outwardFacingTemplates/activateFailure.html"), function (err, data) {
	if (err) {
		console.log('Error reading html template');
	} else {
		currentHTMLActivateFailure = data.toString();
	}
})

async function activate(userId) {
	// confirm identity email account is verified and return landing page
};

module.exports = {
	activate
}