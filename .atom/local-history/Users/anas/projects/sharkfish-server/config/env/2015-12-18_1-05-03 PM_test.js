module.exports = {

  connections: {
    mongo: {
      adapter: 'sails-mongo',
      host: 'localhost',
      port: 27017,
      database: 'sharkfish_test'
    }
  },

  models: {
    connection: 'mongo',
    migrate: 'drop'
  },

  log: {
    // level: 'silent'
    level: 'debug'
  }

};
