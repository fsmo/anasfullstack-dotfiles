var getDataBaseName = function() {
  if (process.env.NODE_ENV === 'test') {
    return 'sharkfish_test';
  } else {
    return 'sharkfish';
  }
};

module.exports = {
  port: process.env.PORT || 1337,

  environment: process.env.NODE_ENV || 'development',

  socialIds: {

    facebook: {
      clientID: '1691653437712832',
      clientSecret: '9788c31fb307b47cc9a10da2c0b7ffbf'
    },

    twitter: {
      consumerKey: '7ncZ52FGPxEvjVCJDOeuL02xv',
      consumerSecret: 'ajGYqj0oPvJSqjuR8s0O6avk53MoWK4ka32BjL2RWtEbJaHgko'
    }
  },

  session: {
    adapter: 'mongo',
    host: 'localhost',
    port: 27017,
    db: getDataBaseName(),
    collection: 'sessions',
    secret: 'b8107e1eacffhg54dc5f467beba839eb',
    proxy: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: false
    },
  },

  sockets: {
    adapter: 'socket.io-adapter-mongo',
    adapterOptions: {
      host: 'localhost',
      port: 27017,
      db: getDataBaseName()
    },
  },

  sendGridAuth: {
    user: 'app44819385@heroku.com',
    pass: 'qj4pbfr64005'
  }
};
