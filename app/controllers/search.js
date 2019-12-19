const _ = require( 'lodash');
const { db, Tag, UserProfile } = cRequire( 'db');
const cleanup = lRequire('cleanup');
const pagination = lRequire('pagination');
const customError = cRequire('customError');

async function getAttendees(req, res) {
	const identity = req.user;
	const { query = '', tags, limit = 10, paging_token } = req.query;
	
	let tagIDs
	if(tags){
		tagIDs = await Tag.query()
		.select('id')
		.whereIn('pf_tag.key', tags)	
		.then((results) => {
			return results.map(tag => tag.id)
		})
	}
	
	const decodedToken = await pagination.decodePageToken(paging_token);
	let order, operator, pageBound;
	if(!decodedToken){
		order = 'asc';
		operator = '>';
		pageBound = {id: 0, name: ""}
	}else if(decodedToken.after){
		order = 'asc';
		operator = '>';
		pageBound = await UserProfile.getByKey(decodedToken.after);
	}else if(decodedToken.before){
		order = 'desc';
		operator = '<';
		pageBound = await UserProfile.getByKey(decodedToken.before);
	}
	
	const user = await UserProfile.active()
	.join('pf_conference', 'pf_conference.id', 'v_user_profile.conference_id')
	.leftJoin('j_user_tag', 'j_user_tag.user_id', 'v_user_profile.id')
	.where({
		'pf_conference.key': identity.conferenceKey
	})
	.whereNot('v_user_profile.key', identity.userKey)
	.where(function (builder) {
		builder
			.where('v_user_profile.name', operator, pageBound.name) // paginatation is determined by name
			.orWhere(function (builder) { // if names are equal then it is set by id number
				builder
					.where('v_user_profile.name', '=', pageBound.name)
					.andWhere('v_user_profile.id', operator, pageBound.id)
			})
	})
	.whereRaw("v_user_profile.name like ?", ['%'+query+'%'])
	.skipUndefined().whereIn('j_user_tag.tag_id', tagIDs)
	.groupBy('v_user_profile.id')
	.eager('[image, meeting(withMe), thread(withMe)]')
	.context({userKey: identity.userKey })
	.limit(limit)
	.orderBy('v_user_profile.name', order)
	.orderBy('v_user_profile.id', order)
	
	var reversed = 0;
	if(order == 'desc')
		reversed = 1;
	
	const data = await cleanup(user, 'user');
	const paging = await pagination.encodePaging(data, reversed);
	
	res.jsend(data, paging);
}

module.exports = {
	getAttendees
}
