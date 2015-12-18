module.exports = {
  
  ssl: {
    ca: require('fs').readFileSync(__dirname + './ssl/server.crt'),
    key: require('fs').readFileSync(__dirname + './ssl/server.key'),
    cert: require('fs').readFileSync(__dirname + './ssl/server.crt')
  },
  
  port: process.env.PORT || 1337,
  
  environment: process.env.NODE_ENV || 'development'

};
