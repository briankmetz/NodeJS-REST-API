const _ = require( 'lodash');
const needsFormatting = cRequire('format');

async function formatRecursive(obj, objType){
	if(!obj || !needsFormatting[objType]){
		return obj; // nothing to format	
	}
	
	if(Array.isArray(obj)){ // format the array of objects
		for(var i = 0; i < obj.length; i++){
			for(key in obj[i]){ // check if the keys in this object need to be formatted
				if(obj[i][key] && needsFormatting[key] != undefined){ // this key needs formatting
					obj[i][key] = await formatRecursive(obj[i][key], key);
				}
			}
			obj[i] = Object.assign({}, _.pick(obj[i], needsFormatting[objType])) //creates deep copy of this object
		}
	}else if(typeof obj === 'object'){ // format the object
		for(key in obj){ // check if the keys in this object need to be formatted
			if(obj[key] && needsFormatting[key] != undefined){ // this key needs formatting
				obj[key] = await formatRecursive(obj[key], key);
			}
		}
		obj = Object.assign({}, _.pick(obj, needsFormatting[objType])) //creates deep copy of this object
	}
	
	return obj;
}

async function format(obj, objType){
	if(objType){ // if objType is provided, recursively format top level object and all sub level objects
		return await formatRecursive(obj, objType);
	}
	
	// if objType is not provided, do not format top level object. Only format sub level objects
	if(Array.isArray(obj)){ // format the keys in this array of objects
		for(var i = 0; i < obj.length; i++){
			for(key in obj[i]){ // check if the keys in this object need to be formatted
				if(obj[i][key] && needsFormatting[key] != undefined){ // this key needs formatting
					obj[i][key] = await formatRecursive(obj[i][key], key);
				}
			}
		}
	}else if(typeof obj === 'object'){ // format the keys in this object
		for(key in obj){ // check if the keys in this object need to be formatted
			if(obj[key] && needsFormatting[key] != undefined){ // this key needs formatting
				obj[key] = await formatRecursive(obj[key], key);
			}
		}
	}
	
	return obj;
}


module.exports = format;