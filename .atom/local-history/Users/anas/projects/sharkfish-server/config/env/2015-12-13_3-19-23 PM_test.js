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

  port: 1587,

  log: {
    level: 'silent'
      // level: 'debug'
  },

  session: {
    secret: 'b8107e1eacffhg54dc5f467beba839eb',

    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    },

    adapter: 'mongo',
    host: 'localhost',
    port: 27017,
    db: 'sharkfish_test',
    collection: 'sessions',

  }

};