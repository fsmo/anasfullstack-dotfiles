module.exports = {

  connections: {
    mongo: {
      adapter: 'sails-mongo',
      host: 'localhost',
      port: 27017,
      database: 'sharkfish'
    },
  },

  models: {
    connection: 'mongo',
    migrate: 'alter'
  },

  log: {
    level: 'verbose'
  },
  
  appsettings: {
    BASE_URL: 'https://127.0.0.1:1337'
  }

};
