var res = require('express').response;

res.jsend = function(data, paging) {
	if(!paging)
		this.send({status: 'success', data: data});
 	else
		this.send({status: 'success', data: data, 'paging': paging});
}
