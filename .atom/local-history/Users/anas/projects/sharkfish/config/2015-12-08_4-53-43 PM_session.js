module.exports.session = {
  secret: 'b8107e1eacffhg54dc5f467beba839eb',

  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  },

  adapter: 'redis',

  url: process.env.REDISTOGO_URL
};
