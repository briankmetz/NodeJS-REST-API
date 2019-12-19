const _ = require( 'lodash');
const { db, Feedback, Identity } = cRequire( 'db');
const cleanup = lRequire('cleanup');
const customError = cRequire('customError');

async function sendFeedback(req, res) {
	const { name, email, feedback } = req.body;
	
	const newFeedback = {
		name,
		email,
		feedback
	}
	
	await Feedback.query()
	.insertGraph(newFeedback)
		
	res.jsend({message: "Feedback sent"});
}

async function resetEmail(req, res) {
	const identity = req.user;
	const { email } = req.body;
	
	const alreadyRegistered = await Identity.lookupByEmail(email);
	if(alreadyRegistered) throw new customError.UnprocessableError('Email is already in use');
	
	await Identity.query()
	.patch({ email })
	.where({
		key: identity.identityKey
	})
		
	res.jsend({message: "Email changed"});
}

async function resetPassword(req, res) {
	const identity = req.user;
	const { old_password, new_password } = req.body;
	
	const { password } = await Identity.getByKey(identity.identityKey);
	if(!password) throw new customError.ResourceNotFoundError('Account');
	
	const isMatch = await Identity.comparePassword(old_password, password);
	if(!isMatch) throw new customError.UnprocessableError('Old Password is incorrect');
	
	const hashedPassword = await Identity.hashPassword(new_password);
	
	await Identity.query()
	.patch({ password: hashedPassword })
	.where({
		key: identity.identityKey
	})
		
	res.jsend({message: "Password changed"});
}

module.exports = {
	resetEmail,
	resetPassword,
	sendFeedback
}
