const _ = require( 'lodash');
const { db, Meeting, Thread, UserProfile } = cRequire( 'db');
const cleanup = lRequire('cleanup');
const notify = lRequire('notify');
const pagination = lRequire('pagination');
const sendMessageHelper = hRequire('sendMessage');
const customError = cRequire('customError');

const moment = require('moment');

async function sendMeetingRequest(req, res) {
	const identity = req.user;
	const { sendToUserKey } = req.params;
	const { location, start_time, end_time, message } = req.body;
	
	if(identity.userKey == sendToUserKey) throw new customError.UnprocessableError('Cannot request meetings with yourself');
	
	const userId = await UserProfile.lookupByKey(identity.userKey);
	const sendToUserId = await UserProfile.lookupByKey(sendToUserKey);
	if(!userId || !sendToUserId) throw new customError.ResourceNotFoundError('User');
	
	const meetingId = await Meeting.existingMeeting(identity.userKey, sendToUserKey);
	if(meetingId) throw new customError.UnprocessableError('Cannot request multiple meetings with a user');
	
	const newMeeting = {
		message,
		location,
		start_time: moment(start_time).format('YYYY-MM-DDTHH:mm:ss'),
		end_time: moment(end_time).format('YYYY-MM-DDTHH:mm:ss'),
		user_meetings: [
			{user_id: userId, type: "SENDER"},
			{user_id: sendToUserId, type: "RECIPIENT"}
		]
	}
	
	const meeting = await Meeting.query() // create new meeting request
	.insertGraphAndFetch(newMeeting)
	.eager('[user(notMe).[image]]')
	.context({userKey: identity.userKey})
	
	const thread = await sendMessageHelper(identity.userKey, sendToUserKey, message, meeting.id);
	
	const data = await cleanup({meeting, thread});
	res.jsend(data);
	
	await notify.meetingSent(meeting.id); // send notification for meeting request
}

async function cancelMeeting(req, res) {
	const identity = req.user;
	const { meetingKey } = req.params;
	
	const meetingId = await Meeting.lookupAndVerifyByKey(meetingKey, identity.userKey);
	if(!meetingId) throw new customError.ResourceNotFoundError('Meeting');
	
	const meeting = await Meeting.query()
	.patchAndFetchById(meetingId, {status: 'CANCELLED'})
	.eager('[user(notMe).[image]]')
	.context({userKey: identity.userKey})
		
	const data = await cleanup(meeting, 'meeting');
	res.jsend(data);
	
	await notify.meetingCancelled(meeting.id, meeting.user.key); // send notification for cancelled meeting request
}

async function setMeetingStatus(req, res) {
	const identity = req.user;
	const { meetingKey } = req.params;
	const { status } = req.body;
	
	const meetingId = await Meeting.lookupAndVerifyRecipientByKey(meetingKey, identity.userKey);
	if(!meetingId) throw new customError.ResourceNotFoundError('Meeting');
	
	const meeting = await Meeting.query()
	.patchAndFetchById(meetingId, {status})
	.eager('[user(notMe).[image]]')
	.context({userKey: identity.userKey})
	
	const data = await cleanup(meeting, 'meeting');
	res.jsend(data);
	
	if(status == 'ACCEPTED')
		await notify.meetingAccepted(meeting.id); // send notification for accepted meeting request
	else if(status == 'DECLINED')
		await notify.meetingDeclined(meeting.id); // send notification for declined meeting request
}

module.exports = {
	cancelMeeting,
	sendMeetingRequest,
	setMeetingStatus
}
