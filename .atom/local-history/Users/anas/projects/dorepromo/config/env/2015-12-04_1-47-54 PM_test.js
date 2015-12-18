module.exports = {

  connections : {
       mongo: {
         adapter : 'sails-mongo',
         host    : 'localhost',
         port    : 27017,
         database: 'dorepromo_test'
      },
  },

  models: {
    connection: 'mongo',
    migrate   : 'drop'
  },
  
  port: 1337,
  
  log: {
    level: 'silent'
    // level: 'debug'
  }

};
