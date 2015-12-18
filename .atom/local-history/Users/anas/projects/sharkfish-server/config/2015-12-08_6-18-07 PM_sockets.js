module.exports.sockets = {
  adapter: 'redis',

    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    db: process.env.REDIS_DB,
    pass: process.env.REDIS_PASS,

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
