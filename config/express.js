const bodyParser = require('body-parser');
const compress = require('compression');
const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const passport = require('passport');
cRequire('res'); // init custom response types to the express.response object

const routes = require('../app/routes');
const config = cRequire('env');
const httpStatus = require('http-status');
const { CustomError, ResourceNotFoundError } = cRequire('customError');
const { ValidationError } = require('express-validation');
cRequire('passport'); // init passport strategies

const app = express();

if (config.env === 'dev') {
	app.use(logger('dev'));
}

// secure apps by setting various HTTP headers
app.use(helmet());

// initialize passport
app.use(passport.initialize());

// parse body params and attach them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compress());

app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'x-requested-with,content-type,cache-control,accept,Authorization');
		
	if(req.method == 'OPTIONS') {
		res.jsend(200);
	} else {
		next();
	}
});

// mount all routes on /api/v1 path
app.use(function apiCall(req, res, next){
	console.log('API Request Recieved');
	next();
})
app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	throw new ResourceNotFoundError('Endpoint')
});

// catch all errors and handle based on type
app.use(function(err, req, res, next){
	const result = {};

	if(err instanceof CustomError){ // this error was thrown by a controller in an expected circumstance
		result.status = err.status;
		result.statusText = httpStatus[err.status];
		result.message = err.message;
	}else if(err instanceof ValidationError){ // this error was thrown by the express validator
		result.status = err.status;
		result.statusText = httpStatus[err.status];
		result.errors = err.errors;
	} else { // this error was thrown under unexpected circumstances
		result.status = 500;
		result.statusText = httpStatus[500];
		result.message = (config.env === 'dev') ? err.message : 'An error occured somewhere';
	}

	if (config.env === 'dev') {
		console.log(err, err.stack);
		result.stack = err.stack;
	}

	res.status(result.status).json(result);
});

module.exports = app;
