const { Model } = require('objection');
const Album = require('./pf_album');
const Category = require('./pf_category');
const Conference = require('./pf_conference');
const Date = require('./pf_date');
const EmailLog = require('./sys_email_log');
const EmailQueue = require('./sys_email_queue');
const ErrorLog = require('./sys_err_log');
const Feedback = require('./sys_feedback');
const Identity = require('./pf_identity');
const Image = require('./pf_image');
const Link = require('./pf_link');
const Meeting = require('./pf_meeting');
const Message = require('./pf_message');
const Notification = require('./pf_notification');
const Profile = require('./pf_profile');
const Role = require('./pf_role');
const Selection = require('./pf_selection');
const Tag = require('./pf_tag');
const Thread = require('./pf_thread');
const User = require('./pf_user');
const UserMeeting = require('./j_user_meeting');
const UserProfile = require('./v_user_profile');
const UserRole = require('./j_user_role');
const UserTag = require('./j_user_tag');
const UserThread = require('./j_user_thread');
const Whitelabel = require('./pf_whitelabel');

const db = Model;

module.exports = {
	Album,
	Category,
	Conference,
	Date,
	db,
	EmailLog,
	EmailQueue,
	ErrorLog,
	Feedback,
	Identity,
	Image,
	Link,
	Meeting,
	Message,
	Notification,
	Profile,
	Role,
	Selection,
	Tag,
	Thread,
	User,
	UserMeeting,
	UserProfile,
	UserRole,
	UserTag,
	UserThread,
	Whitelabel
}
