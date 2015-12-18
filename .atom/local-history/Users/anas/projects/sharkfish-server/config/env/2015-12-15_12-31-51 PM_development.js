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
    migrate: 'drop'
  },

  log: {
    level: 'verbose'
  },

  appsettings: {
    BASE_URL: 'http://127.0.0.1:1337'
  },
  io.sails.url:'http://localhost:1337'

};
