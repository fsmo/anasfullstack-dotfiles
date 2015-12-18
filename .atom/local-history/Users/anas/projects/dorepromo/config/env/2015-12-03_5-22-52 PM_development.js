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
  
  port: 80,

  log: {
    level: 'verbose'
  }

};
