// errors thrown by async functions do not automatically invoke express's next(error) functionality
// like synchronous functions do. This wrapper fixes that.
const asyncWrap = fn => (req, res, next) => {
	fn(req, res).catch((error) => next(error));
}

module.exports = asyncWrap;