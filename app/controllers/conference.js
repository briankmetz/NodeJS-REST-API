const _ = require( 'lodash');
const { Conference, db } = cRequire( 'db');
const cleanup = lRequire('cleanup');
const pagination = lRequire('pagination');
const customError = cRequire('customError');

// retrieve public conference data
async function getConference(req, res) {
	const identity = req.user;
	
	const conference = await Conference.active()
	.where({
		'pf_conference.key': identity.conferenceKey
	})
	.eager('[attendee_categories.[tags], interest_categories.[tags], offer_categories.[tags], dates(inOrder), whitelabels.[image]]')
	.first()
	if(!conference) throw new customError.ResourceNotFoundError('Conference');
	
	// cleanup data and send		
	const data = await cleanup(conference, 'conference');
	res.jsend(data);
}

module.exports = {
	getConference
}
