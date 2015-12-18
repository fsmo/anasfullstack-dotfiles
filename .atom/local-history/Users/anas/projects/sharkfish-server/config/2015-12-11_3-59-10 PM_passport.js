
module.exports.passport = {
  local: {
    strategy: require('passport-local').Strategy
  },

  basic: {
    strategy: require('passport-http').BasicStrategy,
    protocol: 'basic'
  },
  
  twitter: {
    name: 'Twitter',
    protocol: 'oauth',
    strategy: require('passport-twitter').Strategy,
    options: {
      consumerKey: 'your-consumer-key',
      consumerSecret: 'your-consumer-secret'
    }
  },

  facebook: {
    name: 'Facebook',
    protocol: 'oauth2',
    strategy: require('passport-facebook').Strategy,
    options: {
      clientID: 'your-client-id',
      clientSecret: 'your-client-secret'
    }
  }
  youtube: {
    name: 'Youtube',
    protocol: 'oauth2',
    strategy: require('passport-youtube').Strategy,
    options: {
      clientID: 'your-client-id',
      clientSecret: 'your-client-secret'
    },
  },
  'youtube-v3': {
    name: 'Youtube',
    protocol: 'oauth2',
    strategy: require('passport-youtube-v3').Strategy,
    options: {
      clientID: 'your-client-id',
      clientSecret: 'your-client-secret'
      // Scope: see https://developers.google.com/youtube/v3/guides/authentication
      scope: [ 'https://www.googleapis.com/auth/youtube.readonly' ],
    },
  },
  */

};
