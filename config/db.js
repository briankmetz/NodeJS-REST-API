const Knex = require('knex');
const { Model } = require('objection');

const config = cRequire('env');
const db = cRequire('models');

const knex = Knex({
	client: 'mysql',
	connection: {
		host: config.db.host,
		user: config.db.username,
		password: config.db.password,
		database: config.db.database,
		charset: config.db.charset
	}
});

Model.knex(knex);

Model.raw('SELECT 1')
	.then((test)=>{
		if(test[0][0]['1'] === 1){
			console.log("Objection DB connection established");
		} else {
			console.log('Unexpected results from test query. Objection DB connection uncertain');
		}
	})
	.catch((err) => {
		console.log(`There may be something wrong with the DB connection:
			${JSON.stringify(err)}`);
	});

module.exports = db;
