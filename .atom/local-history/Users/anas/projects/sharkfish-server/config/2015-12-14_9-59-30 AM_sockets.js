module.exports.sockets = {
  // adapter: 'mongo',
  // host: 'localhost',
  // port: 27017,
  // db: 'sharkfish_test',
  adapter: 'socket.io-redis',
  
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  db: process.env.REDIS_DB,
  pass: process.env.REDIS_PASS,
  
  // grant3rdPartyCookie: true,

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
