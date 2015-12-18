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
      clientSecret: '9788c31fb307b47cc9a10da2c0b7ffbf'
    },

    twitter: {
      consumerKey: '7ncZ52FGPxEvjVCJDOeuL02xv',
      consumerSecret: 'ajGYqj0oPvJSqjuR8s0O6avk53MoWK4ka32BjL2RWtEbJaHgko'
    }
  },

  session: {
    adapter: 'memory'
  },

  sockets: {
    adapter: 'memory'
  },

  sendGridAuth: {
    user: 'app44819385@heroku.com',
    pass: 'qj4pbfr64005'
  },

  permissions: {
    adminUsername: 'admin',
    adminEmail: 'admin@example.com',
    adminPassword: 'admin1234'
  }
};
