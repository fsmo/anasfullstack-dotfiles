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
  },

  session: {
    sessions: {
      secret: 'b8107e1eacffhg54dc5f467beba839eb',

      cookie: {
        maxAge: 24 * 60 * 60 * 1000
      },

      adapter: 'redis',

      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 24 * 60 * 60,
      db: process.env.REDIS_DB,
      pass: process.env.REDIS_PASS
    }
  }

};