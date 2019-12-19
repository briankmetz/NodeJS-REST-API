const config = require('./env');

// Config folder
global.cRequire = function(module) {
	return require(config.root + '/config/' + module);
};

// Helper folder
global.hRequire = function(module) {
	return require(config.root + '/app/helpers/' + module);
};

// Lib folder
global.lRequire = function(module) {
	return require(config.root + '/lib/' + module);
};