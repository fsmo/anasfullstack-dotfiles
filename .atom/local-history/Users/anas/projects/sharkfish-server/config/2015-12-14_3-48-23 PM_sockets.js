module.exports.sockets = {
  adapter: 'socket.io-adapter-mongo', adapterOptions: {host: 'localhost', port: 27017, db: 'mubsub'},

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
