const _ = require( 'lodash');
const { db } = cRequire( 'db');
const cleanup = lRequire('cleanup');
const pagination = lRequire('pagination');
const sendMessageHelper = hRequire('sendMessage');
const customError = cRequire('customError');

async function sendMessage(req, res) {
	const identity = req.user;
	const { sendToUserKey } = req.params;
	const { message } = req.body;
	
	const thread = await sendMessageHelper(identity.userKey, sendToUserKey, message);
	
	const data = await cleanup(thread, 'thread');
	res.jsend(data);
}

module.exports = {
	sendMessage
}
