const formidable = require('formidable');

// attaches incoming form data fields and files to req.body
// makes it easier to work with api that must use form-data encoding instead of x-www-form-urlencoded
function formidableParser(req, res, next) {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
    }else{
    	Object.assign(req.body, fields, files);
    	next();
    }
  })
}

module.exports = formidableParser;