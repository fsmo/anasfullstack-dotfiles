module.exports.http = {
  passportInit: require('passport').initialize(),
  passportSession: require('passport').session(),

  passportAuth: function(app) {
    passport.use(new FacebookStrategy({
        clientID: 'YOUR_CLIENT_ID',
        clientSecret: 'YOUR_CLIENT_SECRET',
        callbackURL: 'http://localhost:1337/auth/facebook/callback'
      }, verifyHandler));

    passport.use(new GoogleStrategy({
        clientID: 'YOUR_CLIENT_ID',
        clientSecret: 'YOUR_CLIENT_SECRET',
        callbackURL: 'http://localhost:1337/auth/google/callback'
      }, verifyHandler));

    passport.use(new TwitterStrategy({
        consumerKey: 'YOUR_CLIENT_ID',
        consumerSecret: 'YOUR_CLIENT_SECRET',
        callbackURL: 'http://localhost:1337/auth/twitter/callback'
      }, verifyHandler));
  },

  middleware: {
    order: [
    'startRequestTimer',
    'cookieParser',
    'session',
    'passportInit',
    'passportSession',
    'myRequestLogger',
    'bodyParser',
    'handleBodyParserError',
    'compress',
    'methodOverride',
    'poweredBy',
    'router',
    'www',
    'favicon',
    '404',
    '500'
    ],

    myRequestLogger: function(req, res, next) {
      'use strict';
      sails.log.info('Requested :: ', req.method, req.url);
      return next();
    }

    // bodyParser: require('skipper')

  },

  cache: 31557600000
};
