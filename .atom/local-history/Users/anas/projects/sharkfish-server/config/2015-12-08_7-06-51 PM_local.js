module.exports = {
  ssl: {
    ca: require('fs').readFileSync(__dirname + '/ssl/server.crt'),
    key: require('fs').readFileSync(__dirname + '/ssl/server.key'),
    cert: require('fs').readFileSync(__dirname + '/ssl/server.crt')
  },

  port: process.env.PORT || 1337,

  environment: process.env.NODE_ENV || 'development',

  socialIds: {

    facebook: {
      clientID: '1691653437712832',
      clientSecret: '9788c31fb307b47cc9a10da2c0b7ffbf',
      callbackURL: 'https://127.0.0.1:1337/auth/facebook/callbackRemove'
    },

    twitter: {
      consumerKey: '7ncZ52FGPxEvjVCJDOeuL02xv',
      consumerSecret: 'ajGYqj0oPvJSqjuR8s0O6avk53MoWK4ka32BjL2RWtEbJaHgko',
      callbackURL: 'https://127.0.0.1:1337/auth/twitter/callback'
    },

    google: {
      clientID: '100263881852-t2p142dodk8dc753ge9e375qs8t6rkdh.apps.googleusercontent.com',
      clientSecret: 'fCWz2f8nLgRLXmCcmCQbMCg7',
      callbackURL: 'https://127.0.0.1:1337/auth/google/callback'
    }
  }
};
