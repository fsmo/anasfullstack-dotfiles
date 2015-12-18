module.exports = {

  connections : {
       mongoTest: {
         adapter : 'sails-mongo',
         host    : 'localhost',
         port    : 27017,
         database: 'dorepromo'
      },
  },

  models: {
    connection: 'mongoTest'
  }

};
