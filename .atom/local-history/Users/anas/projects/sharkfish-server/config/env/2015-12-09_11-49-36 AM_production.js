module.exports = {
  connections: {
    mongo: {
      adapter: 'sails-mongo',
      url: process.env.MONGOLAB_URI
    },
  },
  models: {
    connection: 'mongo',
    migrate: 'alter'
  },

  port: 443,

  log: {
    level: 'error'
  }

};
