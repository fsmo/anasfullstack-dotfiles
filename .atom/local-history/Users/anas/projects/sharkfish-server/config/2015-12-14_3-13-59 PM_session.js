module.exports.session = {
  secret: 'b8107e1eacffhg54dc5f467beba839eb',

  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  },
  adapter: 'mongo',
  host: 'localhost',
  port: 27017,
  db: 'page',
  collection: 'sessions',
  // adapter: 'redis',
  //
  // host: process.env.REDIS_HOST,
  // port: process.env.REDIS_PORT,
  // ttl: 24 * 60 * 60,
  // db: process.env.REDIS_DB,
  // pass: process.env.REDIS_PASS
};
