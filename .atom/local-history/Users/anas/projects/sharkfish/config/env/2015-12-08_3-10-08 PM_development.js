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
  }

};
