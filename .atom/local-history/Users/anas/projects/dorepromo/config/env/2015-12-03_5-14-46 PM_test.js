module.exports = {

  connections : {
       mongoTest: {
         adapter : 'sails-mongo',
         host    : 'localhost',
         port    : 27017,
         database: 'dorepromo_test'
      },
  },

  models: {
    connection: 'mongoTest'
  }

};
