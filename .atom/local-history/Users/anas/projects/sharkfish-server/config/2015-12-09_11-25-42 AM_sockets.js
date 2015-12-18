
module.exports.sockets = {

  if (process.env.REDISTOGO_URL) {
    var rtg   = require('url').parse(process.env.REDISTOGO_URL);
    var redis = require('redis').createClient(rtg.port, rtg.hostname);
    redis.auth(rtg.auth.split(':')[1]);
  } else {
    var redis = require('redis').createClient();
  }
  
  adapter: 'socket.io-redis',

  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  db: process.env.REDIS_DB,
  pass: process.env.REDIS_PASS,

  grant3rdPartyCookie: true,

  beforeConnect: function(handshake, cb) {
    'use strict';
    // `true` allows the connection
    return cb(null, true);

    // (`false` would reject the connection)
  },

  afterDisconnect: function(session, socket, cb) {
    'use strict';
    // By default: do nothing.
    return cb();
  },

  transports: ['websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']

};
