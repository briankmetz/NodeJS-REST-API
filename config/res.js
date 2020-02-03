var res = require('express').response;

// overloads express.jsend method to add 'paging' field to successful http responses in addition to 'data' field
// this keeps data and metadata seperate in out api responses
res.jsend = function(data, paging) {
	if(!paging)
		this.send({status: 'success', data: data});
 	else
		this.send({status: 'success', data: data, 'paging': paging});
}
