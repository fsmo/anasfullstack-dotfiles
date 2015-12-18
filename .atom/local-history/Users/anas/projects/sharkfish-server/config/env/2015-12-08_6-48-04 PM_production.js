module.exports = {

  models: {
    connection: 'mongo',
    url: process.env.MONGOLAB_URI
  },

  port: 80,

  log: {
    level: 'error'
  }

};
