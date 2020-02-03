const https = require('https');
const http = require('http');
const fs = require('fs');
const CronJob = require('cron').CronJob;

require('./config/projectRequire'); // initialize cRequire, hRequire and lRequire global methods
const config = cRequire('env');
const app = cRequire('express');
const periodic = lRequire('periodic')

if (config.env === 'dev') {
	global.ENV_DEBUG_STATE = true;
}

process.setMaxListeners(200);


// initialize http/https server; only uses https if ssl certificate path is provided
let options;
if (config.sslKeyPath != null && config.sslKeyPath != '' && config.sslCertPath != null && config.sslCertPath != '') {
	options = { 
		cert: fs.readFileSync(config.sslCertPath),
		key: fs.readFileSync(config.sslKeyPath)
	};
}
const server = options != null ? https.createServer(options, app) : http.createServer(app);

// listen on port config.port
server.listen(config.port, () => {
	console.log(`server started on port ${config.port} (${config.env})`);
})


// queued emails are released periodically in batches in case of sudden bursts in traffic
const sendEmails = new CronJob('*/10 * * * * *', function(){
	periodic.getAndSendEmail().catch((err) => { console.log(err) })
})
sendEmails.start();