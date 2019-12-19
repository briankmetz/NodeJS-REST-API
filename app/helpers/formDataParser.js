const formidable = require('formidable');

// attaches incoming form data fields and files to req.body
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