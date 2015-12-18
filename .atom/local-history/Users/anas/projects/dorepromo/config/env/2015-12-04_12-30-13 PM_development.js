module.exports = {

  connections : {
       mongo: {
         adapter : 'sails-mongo',
         host    : 'localhost',
         port    : 27017,
         database: 'dorepromo'
      },
  },

  models: {
    connection: 'mongo',
    migrate   : 'alter'
  },

  port: 1599,

  log: {
    level: 'error'
  }

};
