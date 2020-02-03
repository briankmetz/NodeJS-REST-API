// encodes paging data for any API so future results can be generated efficiently (instead of using inefficient limit/offset)
async function encodePaging(data, reversed, subObj){
	if(data.length === 0){
		return {previous: "", next: ""};
	}
	
	let firstObj, lastObj;
	if(subObj){
		firstObj = data[0][subObj];
		lastObj = data[data.length - 1][subObj];
	}else{
		firstObj = data[0];
		lastObj = data[data.length - 1];
	}
	
	let previous, next;
	if(reversed){
		previous = {'before': lastObj.key};
		next = {'after': firstObj.key};
	}else{
		previous = {'before': firstObj.key};
		next = {'after': lastObj.key};
	}
	
	const previousString = Buffer.from(JSON.stringify(previous)).toString("base64");
	const nextString = Buffer.from(JSON.stringify(next)).toString("base64");
	
	return {previous: previousString, next: nextString};
}

// parses encoded token so an API knows how to pull next page of data efficiently
async function decodePageToken(token){
	if(!token){
		return null;
	}
	const decodedToken = JSON.parse(Buffer.from(token, "base64").toString());
	
	return decodedToken;
}

module.exports = {
	decodePageToken,
	encodePaging
}