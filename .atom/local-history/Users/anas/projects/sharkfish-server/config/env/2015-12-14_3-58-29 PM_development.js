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
    BASE_URL: 'http://127.0.0.1:1337'
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
  },

  sockets: {
    adapter: 'socket.io-adapter-mongo',
    adapterOptions: {
      host: 'localhost',
      port: 27017,
      db: 'sharkfish_test'
    },
  },

};
