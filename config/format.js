// configures which columns get returned to the frontend for each data type (ie. all columns not listed will be masked)
// very useful tool, if we wanted to return user id number with every user object we could do that by just unmasking it 
// here instead of performing an exhaustive search through all endpoints to add the field manually.  

//data types
const categoryFields = ['key', 'name', 'created_at', 'updated_at', 'tags'];
const conferenceFields = ['key', 'name', 'slug', 'created_at', 'updated_at', 'attendee_categories', 'interest_categories', 'offer_categories', 'dates', 'roles', 'selections', 'whitelabels'];
const dateFields = ['key', 'day', 'created_at', 'updated_at'];
const identityFields = ['key', 'email', 'created_at', 'updated_at'];
const imageFields = ['key', 'url', 'thumb_url', 'mime_type', 'size', 'avg_color', 'px_height', 'px_width', 'created_at', 'updated_at'];
const linkFields = ['key', 'url', 'created_at', 'updated_at'];
const meetingFields = ['key', 'message', 'location', 'status', 'start_time', 'end_time', 'created_at', 'updated_at', 'user', 'type'];
const messageFields = ['key', 'message', 'created_at', 'updated_at', 'user', 'meeting'];
const notificationFields = ['key', 'type', 'title', 'payload', 'seen', 'created_at', 'updated_at', 'user', 'image'];
const roleFields = ['key', 'name', 'created_at', 'updated_at'];
const selectionFields = ['key', 'name', 'button_text', 'created_at', 'updated_at', 'categories'];
const tagFields = ['key', 'name', 'created_at', 'updated_at'];
const threadFields = ['key', 'created_at', 'updated_at', 'message', 'messages', 'users', 'accepted']
const userFields = ['key', 'name', 'title', 'company', 'description', 'email', 'created_at', 'updated_at', 'attendee_categories', 'interest_categories', 'offer_categories', 'conference', 'image', 'links', 'meeting', 'meetings', 'roles', 'selections', 'tags', 'thread', 'threads'];
const whitelabelFields = ['key', 'name', 'type', 'url', 'created_at', 'updated_at', 'image'];

//matches data type name to its fields
const keysToFields = {
	attendee_categories: categoryFields, // to be removed soon and replaced with a generic 'category' field
	interest_categories: categoryFields,
	offer_categories: categoryFields,
	
	category: categoryFields,
	categories: categoryFields,
	conference: conferenceFields,
	conferences: conferenceFields,
	date: dateFields,
	dates: dateFields,
	identity: identityFields,
	identities: identityFields,
	image: imageFields,
	images: imageFields,
	link: linkFields,
	links: linkFields,
	meeting: meetingFields,
	meetings: meetingFields,
	message: messageFields,
	messages: messageFields,
	notification: notificationFields,
	notifications: notificationFields,
	role: roleFields,
	roles: roleFields,
	selection: selectionFields,
	selections: selectionFields,
	tag: tagFields,
	tags: tagFields,
	thread: threadFields,
	threads: threadFields,
	user: userFields,
	users: userFields,
	whitelabel: whitelabelFields,
	whitelabels: whitelabelFields
}

module.exports = keysToFields;