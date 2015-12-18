module.exports = {

  models: {
    connection:     mongo: {
      adapter: 'sails-mongo',
      url: process.env.MONGOLAB_URI}

  },

  port: 443,

  log: {
    level: 'error'
  }

};
