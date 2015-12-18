module.exports.sockets = {
  adapter: 'redis',
url: process.env.REDISTOGO_URL

  grant3rdPartyCookie: true,

  beforeConnect: function(handshake, cb) {
    // `true` allows the connection
    return cb(null, true);

    // (`false` would reject the connection)
  },

  afterDisconnect: function(session, socket, cb) {
    // By default: do nothing.
    return cb();
  },

  transports: ['polling', 'websocket']

};
