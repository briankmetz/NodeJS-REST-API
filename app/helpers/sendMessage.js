const { db, Message, Thread, UserProfile, UserThread } = cRequire( 'db');
const customError = cRequire('customError');

async function sendMessage(userKey, sendToUserKey, message, meetingId) { // send a message, checking if a thread already exists
	if(userKey == sendToUserKey) throw new customError.UnprocessableError('Cannot send messages to yourself');
	
	const userId = await UserProfile.lookupByKey(userKey);
	const sendToUserId = await UserProfile.lookupByKey(sendToUserKey);
	if(!userId || !sendToUserId) throw new customError.ResourceNotFoundError('User');
	
	const threadId = await Thread.existingThread(userKey, sendToUserKey);
	
	let thread
	if(threadId){
		// create message in thread
		const newMessage = {
			id: threadId, // thread already exists so it requires a relate instead of an insert. Hence the existing database id is referenced in the graph insert
			message: {
				message,
				thread_id: threadId,
				user_id: userId
			}
		}
		
		thread = await Thread.query() // insert new message into existing Thread model
		.upsertGraphAndFetch(newMessage, {noDelete: true}) // upsert so Thread + Message are fetched in the same query. No delete set to true so other messages in thread aren't deleted
		
		// auto accept thread when a reply is sent
		await UserThread.query()
		.patch({accepted: 1})
		.where({
			user_id: userId,
			thread_id: threadId
		})
	}else{
		// create new thread with message
		const newThread = {
			message: {
				message,
				thread_id: threadId,
				user_id: userId
			},
			user_threads: [
				{user_id: userId, accepted: 1},
				{user_id: sendToUserId}
			]
		}
		
		thread = await Thread.query()
		.insertGraphAndFetch(newThread)
	}
	
	if(meetingId){ // send meeting request as a message
		const newMessage = {
			message,
			thread_id: thread.id,
			user_id: userId,
			meeting_id: meetingId
		}
		
		await Message.query() // insert message, no need to bother with upserts or threads since we don't intend to return this data
		.insertGraph(newMessage)
	}
	
	return thread;
}

module.exports = sendMessage;