

module.exports.connections = {
  connection : 'mongo',

  localMongodbServer: {
    adapter : 'sails-mongo',
    host    : 'localhost',
    port    : 27017,
    user    : 'dorepromoadmin',
    password: 'dorepromopassword',
    database: 'dorepromo'
  }
};
