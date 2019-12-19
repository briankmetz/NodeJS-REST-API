const _ = require( 'lodash');
const { Conference, db, Meeting, Message, Notification, Tag, Thread, User, UserProfile } = cRequire( 'db');
const cleanup = lRequire('cleanup');
const pagination = lRequire('pagination');
const customError = cRequire('customError');

async function getUser(req, res) {
	const identity = req.user;
	const { userKey } = (req.params.userKey) ? req.params : req.user;
	
	const user = await UserProfile.active()
	.where({
		'v_user_profile.key': userKey
	})
	.eager('[image, links, meeting(withMe), thread(withMe), attendee_categories.[tags(mine)], interest_categories.[tags(mine)], offer_categories.[tags(mine)]]')
	.context({userKey: identity.userKey })
	.first()
	if(!user) throw new customError.ResourceNotFoundError('User');
	
	const data = await cleanup(user, 'user');
	res.jsend(data);
}

async function editUser(req, res) {
	const identity = req.user;
	const { links, tags } = req.body;
	const profile = _.pick(req.body, ['name', 'title', 'company', 'description']);
	
	_.forOwn(profile, function(value, key){ // replace empty strings with null
		if(value === ""){
			profile[key] = null;
		}
	})
	
	const { id, profile_id } = await UserProfile.getByKey(identity.userKey);
	if(!id || !profile_id) throw new customError.ResourceNotFoundError('User');
	
	profile.id = profile_id;
	const userPatch = { id };
	
	if(Object.keys(profile).length > 1) // profile needs updating
		userPatch.profile = profile; // update profile by including the profile id in the profile object. Without an id, objection would try todelete the old profile and insert a new one
	if(links) // links need updating
		userPatch.links = links.map(link => ({url: link}) ); // by not including link ids, existing link relations will be deleted and new ones will be inserted in their place
	if(tags) // tags need updating
		userPatch.tags = (await Tag.lookupByKeys(tags)).map(tagId => ({id: tagId}) ); // by including tag ids and setting the right options, existing tags will be unrelated and then the new tags will be related
	
	const patchedUser = await User.query()
	.upsertGraphAndFetch(userPatch, {relate: ['tags'], unrelate: ['tags']}) // tags are universal so they need to be related/unrelated to the user object, not inserted/deleted directly
		
	const user = await UserProfile.active()
	.where({
		'v_user_profile.key': identity.userKey
	})
	.eager('[image, links, attendee_categories.[tags(mine)], interest_categories.[tags(mine)], offer_categories.[tags(mine)]]')
	.context({userKey: identity.userKey})
	.first()
	
	const data = await cleanup(user, 'user');
	res.jsend(data);
}

async function getCalendar(req, res) {
	const identity = req.user;
	const { time_min, time_max } = req.query;
	
	const meeting = await Meeting.active()
	.join('j_user_meeting', 'j_user_meeting.meeting_id', 'pf_meeting.id')
	.join('pf_user', 'pf_user.id', 'j_user_meeting.user_id')
	.where('pf_user.key', identity.userKey)
	.where('pf_meeting.status', 'ACCEPTED')
	.where('pf_meeting.start_time', '<', time_max)
	.where('pf_meeting.end_time', '>', time_min)
	.eager('[user(notMe).[image]]')
	.context({userKey: identity.userKey})
	.orderBy('pf_meeting.start_time', 'asc')
	
	const data = await cleanup(meeting, 'meeting');
	
	res.jsend(data);
}

async function getMeetings(req, res) {
	const identity = req.user;
	const { type = 'RECEIVED', limit = 10, paging_token } = req.query;
	
	const decodedToken = await pagination.decodePageToken(paging_token);
	let order, operator, pageBound;
	if(!decodedToken){
		order = 'desc';
		operator = '>';
		pageBound = 0;
	}else if(decodedToken.after){
		order = 'desc';
		operator = '<';
		pageBound = await Meeting.lookupByKey(decodedToken.after);
	}else if(decodedToken.before){
		order = 'asc';
		operator = '>';
		pageBound = await Meeting.lookupByKey(decodedToken.before);
	}
	
	const meeting = await Meeting.active()
	.join('j_user_meeting', 'j_user_meeting.meeting_id', 'pf_meeting.id')
	.join('pf_user', 'pf_user.id', 'j_user_meeting.user_id')	
	.where({
		'j_user_meeting.type': type,
		'pf_user.key': identity.userKey
	})
	.where('pf_meeting.id', operator, pageBound)
	.eager('[user(notMe).[image]]')
	.context({userKey: identity.userKey})
	.limit(limit)
	.orderBy('pf_meeting.id', order)
	
	var reversed = 0;
	if(order == 'asc')
		reversed = 1;
	
	const data = await cleanup(meeting, 'meeting');
	const paging = await pagination.encodePaging(data, reversed);
	
	res.jsend(data, paging);
}

async function getNotifications(req, res) {
	const identity = req.user;
	const { limit = 10, paging_token } = req.query;
	
	const decodedToken = await pagination.decodePageToken(paging_token);
	let order, operator, pageBound;
	if(!decodedToken){
		order = 'desc';
		operator = '>';
		pageBound = 0;
	}else if(decodedToken.after){
		order = 'desc';
		operator = '<';
		pageBound = await Notification.lookupByKey(decodedToken.after);
	}else if(decodedToken.before){
		order = 'asc';
		operator = '>';
		pageBound = await Notification.lookupByKey(decodedToken.before);
	}
	
	const notification = await Notification.active()
	.join('pf_user', 'pf_user.id', 'pf_notification.user_id')
	.where({
		'pf_user.key': identity.userKey
	})
	.where('pf_notification.id', operator, pageBound)
	.limit(limit)
	.orderBy('pf_notification.id', order)
	
	for(var i = 0; i < notification.length; i++){
		notification[i].payload = JSON.parse(notification[i].payload);
	}
	
	var reversed = 0;
	if(order == 'asc')
		reversed = 1;
	
	const data = await cleanup(notification, 'notification');
	const paging = await pagination.encodePaging(data, reversed);
	
	res.jsend(data, paging);
}

async function getThreads(req, res) {
	const identity = req.user;
	const { accepted = 1, limit = 10, paging_token } = req.query;
	
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
	
	// find the top message in each of the user's accepted or unaccepted threads
	const subQuery = Message.active()
	.select(db.raw('max(pf_message.id)'))
	.join('j_user_thread', 'pf_message.thread_id', 'j_user_thread.thread_id')
	.join('pf_user', 'pf_user.id', 'j_user_thread.user_id')
	.where({
		'pf_user.key': identity.userKey,
		'j_user_thread.accepted': accepted
	})
	.groupBy('pf_message.thread_id');
	
	// get user's threads
	const thread = await Thread.active()
	.join('pf_message', 'pf_message.thread_id', 'pf_thread.id')
	.whereIn('pf_message.id', subQuery)
	.where('pf_message.id', operator, pageBound)
	.eager('[message(topInThread), users(notMe).[image]]')
	.context({userKey: identity.userKey})
	.limit(limit)
	.orderBy('pf_message.id', order)
	
	var reversed = 0;
	if(order == 'asc')
		reversed = 1;
	
	const data = await cleanup(thread, 'thread');
	const paging = await pagination.encodePaging(data, reversed, 'message');
	
	res.jsend(data, paging);
}

module.exports = {
	editUser,
	getCalendar,
	getMeetings,
	getThreads,
	getNotifications,
	getUser
}
