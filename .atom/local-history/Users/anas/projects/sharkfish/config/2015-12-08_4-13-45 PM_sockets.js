module.exports.sockets = {
  adapter: 'redis',
  host: '127.0.0.1',
  port: 6379,
  db: 'sails',
  pass: null,

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
