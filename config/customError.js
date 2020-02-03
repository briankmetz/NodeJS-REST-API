const httpStatus = require('http-status');

// create custom error classes. error responses should be consistent accross the entire project
// in production it should be impossible for the user to recieve an error that doesn't match one of these classes
class CustomError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name; // Ensure the name of this error is the same as the class name
		Error.captureStackTrace(this, this.constructor); // Clips the constructor invocation from the stack trace.
	}
}

class InternalError extends CustomError {
	constructor() {
		super('An error occured');
		this.code = httpStatus.INTERNAL_SERVER_ERROR;
		this.status = httpStatus.INTERNAL_SERVER_ERROR;
	}
}

class ResourceNotFoundError extends CustomError {
	constructor(resource) {
		super(`${resource} not found.`);
		this.code = httpStatus.NOT_FOUND;
		this.status = httpStatus.NOT_FOUND;
	}
}

class UnauthorizedError extends CustomError {
	constructor(){
		super('Unauthorized Access');
		this.code = httpStatus.UNAUTHORIZED;
		this.status = httpStatus.UNAUTHORIZED;
	}
}

class UnprocessableError extends CustomError {
	constructor(message){
		super(message);
		this.code = httpStatus.UNPROCESSABLE_ENTITY;
		this.status = httpStatus.UNPROCESSABLE_ENTITY;
	}
}

module.exports = {
	CustomError,
	InternalError,
	ResourceNotFoundError,
	UnauthorizedError,
	UnprocessableError
};