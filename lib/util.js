const jwt = require('jsonwebtoken');
const config = cRequire('env');

async function genJWT(identityKey, userKey, conferenceKey, roleKeys) { // create a json web token
	const expiry = {expiresIn: config.jwtAccessTokenTTL};
	const payload = {identityKey, userKey, conferenceKey, roleKeys};
	const token = jwt.sign(payload, config.jwtSecret, expiry);
	
	return token;
}

async function run(cmd) { // run a bash command
	return new Promise((resolve, reject) => {
		cmd = cmd.split(' ');
		var args = cmd.slice(1, cmd.length);
		cmd = cmd[0];
		
		var spawn = require('child_process').spawn;
		var child = spawn(cmd, args, {stdio:'pipe'});
		var resp = '';
		var error = '';

		child.stdout.on('data', function(buffer) {
			resp += buffer.toString();
		})

		child.stderr.on('data', function(buffer) {
			error += "stderr: " + buffer.toString();
		})

		child.on('exit', function() {
			if(error){
				reject(error);
			}else{
				resolve(resp);
			}
		})
	})
}

module.exports = {
	genJWT,
	run
}
