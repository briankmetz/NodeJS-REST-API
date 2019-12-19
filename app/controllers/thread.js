const _ = require( 'lodash');
const { db, Message, Thread, UserProfile, UserThread } = cRequire( 'db');
const cleanup = lRequire('cleanup');
const pagination = lRequire('pagination');
const customError = cRequire('customError');

async function getMessages(req, res) {
	const identity = req.user;
	const { threadKey } = req.params;
	const { limit = 10, paging_token } = req.query;
	
	const threadId = await Thread.lookupAndVerifyByKey(threadKey, identity.userKey);
	if(!threadId) throw new customError.ResourceNotFoundError('Thread');
	
	const decodedToken = await pagination.decodePageToken(paging_token);
	let order, operator, pageBound;
	if(!decodedToken){
		order = 'desc';
		operator = '>';
		pageBound = 0;
	}else if(decodedToken.after){
		order = 'desc';
		operator = '<';
		pageBound = await Message.lookupByKey(decodedToken.after);
	}else if(decodedToken.before){
		order = 'asc';
		operator = '>';
		pageBound = await Message.lookupByKey(decodedToken.before);
	}

	
	const message = await Message.active()
	.where({
		'pf_message.thread_id': threadId
	})
	.where('pf_message.id', operator, pageBound)
	.eager('[user.[image], meeting]')
	.limit(limit)
	.orderBy('pf_message.id', order)
	
	
	var reversed = 0;
	if(order == 'asc')
		reversed = 1;
	
	const data = await cleanup(message, 'message');
	const paging = await pagination.encodePaging(data, reversed);
	
	res.jsend(data, paging);
}

async function acceptThread(req, res) {
	const identity = req.user;
	const { threadKey } = req.params;
	
	const threadId = await Thread.lookupAndVerifyByKey(threadKey, identity.userKey);
	if(!threadId) throw new customError.ResourceNotFoundError('Thread');
	
	const userId = await UserProfile.lookupByKey(identity.userKey);
	if(!userId) throw new customError.ResourceNotFoundError('User');
	
	await UserThread.query()
	.patch({ accepted: 1 })
	.where({
		user_id: userId,
		thread_id: threadId
	})
		
	res.jsend({accepted: 1, message: "Messages accepted"});
}

module.exports = {
	acceptThread,
	getMessages
}
