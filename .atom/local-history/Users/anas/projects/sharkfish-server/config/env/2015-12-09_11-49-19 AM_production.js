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
    url: process.env.MONGOLAB_URI
  },

  port: 443,

  log: {
    level: 'error'
  }

};
