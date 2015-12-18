module.exports.session = {
  secret: 'b8107e1eacff3a31dc5f467beba839eb',

  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  },

  adapter: 'redis',

  host: 'localhost',
  port: 6379,
  ttl: <redis session TTL in seconds>,
  db: 0,
  pass: <redis auth password>,
  prefix: 'sess:',

  /***************************************************************************
  *                                                                          *
  * Uncomment the following lines to use your Mongo adapter as a session     *
  * store                                                                    *
  *                                                                          *
  ***************************************************************************/

  // adapter: 'mongo',
  // host: 'localhost',
  // port: 27017,
  // db: 'sails',
  // collection: 'sessions',

  /***************************************************************************
  *                                                                          *
  * Optional Values:                                                         *
  *                                                                          *
  * # Note: url will override other connection settings url:                 *
  * 'mongodb://user:pass@host:port/database/collection',                     *
  *                                                                          *
  ***************************************************************************/

  // username: '',
  // password: '',
  // auto_reconnect: false,
  // ssl: false,
  // stringify: true

};
