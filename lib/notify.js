// Modules not installed, will we ever need android/iOS push notifcations
//const PushNotifications = require('node-pushnotifications');
//const FCM = require('fcm-push');
const _ = require( 'lodash');
const { db, Meeting, Notification, UserProfile } = cRequire('db');
const config = cRequire('env');
const cleanup = lRequire('cleanup');
const customError = cRequire('customError');

//const apn = new PushNotifications(config.applePushNotificationSettings);
//const fcm = new FCM(config.googlePushNotificationSettings.serverKey)
//const appleBundleID = config.appleBundleID;

async function send(deviceToken, note) { //iOS
	/*
	apn.send(deviceToken, note) 
		.then((results) => {
			console.log('APN Success');
			console.log(JSON.stringify(results));
		})
		.catch((err) => {
			console.log('APN Failure');
			console.log(JSON.stringify(err));
		})
	*/
}

async function sendAndroid(note) { //Android
	/*
	console.log('**ATTEMPTING FCM SEND**');
	fcm.send(note) 
		.then((results) => {
			console.log('FCM Success');
			console.log(JSON.stringify(results));
		})
		.catch((err) => {
			console.log('FCM Failure');
			console.log(JSON.stringify(err));
		})
	*/
}

async function meetingAccepted(id) {
	const meeting = await Meeting.active()
	.where({ id })
	.eager('[sender.[image], recipient.[image]]')
	.first()
	
	const newNotification = {
		type: 'MEETING_ACCEPTED',
		title: meeting.recipient.name + ' accepted your Meeting Request',
		payload: JSON.stringify({
			user: await cleanup(meeting.recipient, 'user'),
			meeting: await cleanup(meeting, 'meeting')
		}),
		user_id: meeting.sender.id
	}
	
	await Notification.query()
	.insertGraphAndFetch(newNotification)
}

async function meetingCancelled(id, sendToUserKey) {
	const meeting = await Meeting.active()
	.where({ id })
	.eager('[user(notMe).[image]]')
	.context({userKey: sendToUserKey})
	.first()
	
	const userId = await UserProfile.lookupByKey(sendToUserKey);
	
	const newNotification = {
		type: 'MEETING_CANCELLED',
		title: meeting.user.name + ' cancelled your Meeting Request',
		payload: JSON.stringify({
			user: await cleanup(meeting.user, 'user'),
			meeting: await cleanup(_.omit(meeting, ['user']), 'meeting')
		}),
		user_id: userId
	}
	
	await Notification.query()
	.insertGraphAndFetch(newNotification)
}

async function meetingDeclined(id) {
	const meeting = await Meeting.active()
	.where({ id })
	.eager('[sender.[image], recipient.[image]]')
	.first()
	
	const newNotification = {
		type: 'MEETING_DECLINED',
		title: meeting.recipient.name + ' declined your Meeting Request',
		payload: JSON.stringify({
			user: await cleanup(meeting.recipient, 'user'),
			meeting: await cleanup(meeting, 'meeting')
		}),
		user_id: meeting.sender.id
	}
	
	await Notification.query()
	.insertGraphAndFetch(newNotification)
}

async function meetingSent(id) {
	const meeting = await Meeting.active()
	.where({ id })
	.eager('[sender.[image], recipient.[image]]')
	.first()
	
	const newNotification = {
		type: 'NEW_MEETING',
		title: meeting.sender.name + ' sent you a Meeting Request',
		payload: JSON.stringify({
			user: await cleanup(meeting.sender, 'user'),
			meeting: await cleanup(meeting, 'meeting')
		}),
		user_id: meeting.recipient.id
	}
	
	await Notification.query()
	.insertGraphAndFetch(newNotification)
}

async function sendQueue() {
	/*
	Notification.query()
	.select(...['id', 'title', 'body', 'payload']
		.map(field => `pf_notification.${field}`)
		.concat(['pf_device_token.device_type', 'pf_device_token.token as device_token']))
	.leftJoin('pf_device_token', 'pf_device_token.user_id', 'pf_notification.user_id')
	.where('pf_notification.sent', 0)
	.then((results)=>{
		const NotificationIDs = results.map(notification => notification.id);
		Notification.query()
		.patch({sent:1})
		.whereIn('id', NotificationIDs)
		.then(() => {
			// do nothing
		})
		
		for(var i = 0; i < results.length; i++){
			if(!results[i].device_token){
				continue;
			}else if(results[i].device_type == 'iOS'){
				const note = {
					title: results[i].title,
					body: results[i].body,
					custom: JSON.parse(results[i].payload),
					retries: 3,
					sound: 'ping.aiff',
					timeToLive: 28 * 86400,
					topic: appleBundleID
				}
				send([results[i].device_token], note);
			}else{ //Android
				const note = {
					to: results[i].device_token,
					data: JSON.parse(results[i].payload)
				}
				sendAndroid(note);
			}
		}
	})
	*/
}

module.exports = {
	meetingAccepted,
	meetingCancelled,
	meetingDeclined,
	meetingSent,
	sendQueue
}




