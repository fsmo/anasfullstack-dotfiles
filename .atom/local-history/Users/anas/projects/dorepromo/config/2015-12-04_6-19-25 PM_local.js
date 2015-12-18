module.exports = {

  ssl: {
    ca  : require('fs').readFileSync(__dirname + '/ssl/server.crt'),
    key : require('fs').readFileSync(__dirname + '/ssl/server.key'),
    cert: require('fs').readFileSync(__dirname + '/ssl/server.crt')
  },

  port       : process.env.PORT || 1337,

  environment: process.env.NODE_ENV || 'development'

  googleAuth:{
    clientID: '412303073361-5p19r3s794utvsgp26n20ut0jm7cmvob.apps.googleusercontent.com'
clientSecret: \
  }

};
