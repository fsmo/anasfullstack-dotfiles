module.exports = {
  connections: {
    mongo: {
      adapter: 'sails-mongo',
      url: process.env.MONGOLAB_URI
    },
  },

  models: {
    connection: 'mongo',
    migrate: 'safe'
  },

  port: 443,

  log: {
    level: 'error'
  },

  appsettings: {
    BASE_URL: 'http://sharkfish.herokuapp.com/'
  }

};
