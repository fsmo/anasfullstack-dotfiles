module.exports = {

	connections: {
		mongo: {
			adapter: 'sails-mongo',
			host: 'localhost',
			port: 27017,
			database: 'dorepromo_test'
		}
	},

	models: {
		connection: 'mongo',
		migrate: 'drop'
	},

	port: 1587,

	log: {
		//level: 'silent'
		level: 'verboose'
	}

};
