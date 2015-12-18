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
    connection: 'mongo'
  },
  
  log: {
  level: 'silent'
}

};
