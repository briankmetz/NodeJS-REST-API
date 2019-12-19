const _ = require( 'lodash');
const jwt = require('jsonwebtoken');
const { Conference, db, Identity, Role, UserProfile } = cRequire( 'db');
const cleanup = lRequire('cleanup');
const emailLib = lRequire('email');
const customError = cRequire('customError');
const genJWT = lRequire('util').genJWT;

const moment = require('moment');

async function login(req, res) {
	const identity = req.user;
	const { slug } = req.params;

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

	const roleKeys = user.roles.map(role => role.key);
	const accessToken = await genJWT(identity.key, user.key, conference.key, roleKeys);
	
	const login = {
		access_token: accessToken,
		identity,
		user,
		conference
	}
	
	const data = await cleanup(login);
	res.jsend(data);
}

async function signup(req, res) {
	const { slug } = req.params;
	const { email, password, name } = req.body;
	
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
	
	const alreadyRegistered = await Identity.lookupByEmail(email);
	if(alreadyRegistered) throw new customError.UnprocessableError('Email is already in use');
	
	const role = await Role.active()
	.where({
		name: "ATTENDEE",
		conference_id: conference.id
	})
	.first()
	if(!role) throw new customError.ResourceNotFoundError('Role');
	
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
	
	const roleKeys = user.roles.map(role => role.key);
	const accessToken = await genJWT(identity.key, user.key, conference.key, roleKeys);
	
	const login = {
		access_token: accessToken,
		identity,
		user,
		conference
	}
	
	const data = await cleanup(login);
	res.jsend(data);
	
	emailLib.generateWelcomeEmail(user.key); // send welcome email
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
