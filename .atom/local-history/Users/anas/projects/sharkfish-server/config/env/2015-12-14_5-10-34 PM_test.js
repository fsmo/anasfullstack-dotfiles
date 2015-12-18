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

  port: 80,

  log: {
    level: 'silent'
    // level: 'debug'
  }

};
