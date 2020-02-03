const _ = require( 'lodash');
const jwt = require('jsonwebtoken');
const { Conference, db, Identity, Role, UserProfile } = cRequire( 'db');
const cleanup = lRequire('cleanup');
const emailLib = lRequire('email');
const customError = cRequire('customError');
const genJWT = lRequire('util').genJWT;

const moment = require('moment');

// log the user into a specific conference
async function login(req, res) {
	const identity = req.user;
	const { slug } = req.params;
	
	// check conference exists
	const conference = await Conference.active()
	.where({
		'pf_conference.slug': slug
	})
	.eager('[attendee_categories.[tags], interest_categories.[tags], offer_categories.[tags], dates(inOrder), whitelabels.[image]]')
	.first()
	if(!conference) throw new customError.ResourceNotFoundError('Conference');
	
	for(var i = 0; i < conference.dates.length; i++){ // parse datetime back into date
		conference.dates[i].day = moment(conference.dates[i].day).format('YYYY-MM-DD');
	}
	
	// check matching user exists for this conference
	const user = await UserProfile.active()
	.where({
		identity_id: identity.id,
		conference_id: conference.id
	})
	.eager('[roles, image, links, attendee_categories.[tags(mine)], interest_categories.[tags(mine)], offer_categories.[tags(mine)]]')
	.context({
		identityId: identity.id,
		conferenceId: conference.id
	})
	.first()
	if(!user) throw new customError.ResourceNotFoundError('User');
	
	// determine roles for this user and generate JWT access token
	const roleKeys = user.roles.map(role => role.key);
	const accessToken = await genJWT(identity.key, user.key, conference.key, roleKeys);
	
	const login = {
		access_token: accessToken,
		identity,
		user,
		conference
	}
	
	// cleanup data and send
	const data = await cleanup(login);
	res.jsend(data);
}

// sign a user up for a specific conference
async function signup(req, res) {
	const { slug } = req.params;
	const { email, password, name } = req.body;
	
	// check conference exists
	const conference = await Conference.active()
	.where({
		'pf_conference.slug': slug
	})
	.eager('[attendee_categories.[tags], interest_categories.[tags], offer_categories.[tags], dates(inOrder), whitelabels.[image]]')
	.first()
	if(!conference) throw new customError.ResourceNotFoundError('Conference');
	
	for(var i = 0; i < conference.dates.length; i++){ // parse datetime back into date
		conference.dates[i].day = moment(conference.dates[i].day).format('YYYY-MM-DD');
	}
	
	// verify email is not in use
	const alreadyRegistered = await Identity.lookupByEmail(email);
	if(alreadyRegistered) throw new customError.UnprocessableError('Email is already in use');
	
	const role = await Role.active()
	.where({
		name: "ATTENDEE",
		conference_id: conference.id
	})
	.first()
	if(!role) throw new customError.ResourceNotFoundError('Role');
	
	// prepare new login identity and hash password
	const hashedPassword = await Identity.hashPassword(password);
		
	const newIdentity = {
		email,
		password: hashedPassword,
		profile: {
			name
		},
		users: {
			conference_id: conference.id,
			roles: {
				"#dbRef": role.id // role already exists so it requires a relate instead of an insert. Hence the existing database id is referenced in the graph insert
			}
		},
		albums: {
			type: 'PROFILE'
		}
	}
	
	// insert identity & user profile
	const identity = await Identity.query()
	.insertGraphAndFetch(newIdentity)
	
	const user = await UserProfile.active()
	.where({
		identity_id: identity.id,
		conference_id: conference.id
	})
	.eager('[roles, image, links, attendee_categories.[tags(mine)], interest_categories.[tags(mine)], offer_categories.[tags(mine)]]')
	.context({
		identityId: identity.id,
		conferenceId: conference.id
	})
	.first()
	if(!user) throw new customError.ResourceNotFoundError('User');
	
	// determine roles for this user and generate JWT access token
	const roleKeys = user.roles.map(role => role.key);
	const accessToken = await genJWT(identity.key, user.key, conference.key, roleKeys);
	
	const login = {
		access_token: accessToken,
		identity,
		user,
		conference
	}
	
	// cleanup data and send
	const data = await cleanup(login);
	res.jsend(data);
	
	// send welcome email
	emailLib.generateWelcomeEmail(user.key); 
}

async function emailInUse(req, res) {
	const { email } = req.query;
	
	const alreadyRegistered = await Identity.lookupByEmail(email);
	if(alreadyRegistered)
		res.jsend({registered: 1, message: "Email is already registered"});
	else
		res.jsend({registered: 0, message: "Email is unregistered"});
}

module.exports = {
	emailInUse,
	login,
	signup
}
