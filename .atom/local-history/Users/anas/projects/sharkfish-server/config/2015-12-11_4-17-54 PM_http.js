/* globals User*/
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

var facebookAuth;
var twitterAuth;

if (process.env.FACEBOOK_AUTH) {
  facebookAuth = JSON.parse(process.env.FACEBOOK_AUTH);
} else {
  facebookAuth = require('./local.js').socialIds.facebook;
}

if (process.env.TWITTER_AUTH) {
  twitterAuth = JSON.parse(process.env.TWITTER_AUTH);
} else {
  twitterAuth = require('./local.js').socialIds.twitter;
}

var verifyHandler = function(token, tokenSecret, profile, done) {
  process.nextTick(function() {

    User.findOne({
      uid: profile.id
    }, function(err, user) {
      if (user) {
        return done(null, user);
      } else {

        var data = {
          provider: profile.provider,
          uid: profile.id,
          name: profile.displayName
        };

        if (profile.emails && profile.emails[0] && profile.emails[0].value) {
          data.email = profile.emails[0].value;
        }
        if (profile.name && profile.name.givenName) {
          data.firstname = profile.name.givenName;
        }
        if (profile.name && profile.name.familyName) {
          data.lastname = profile.name.familyName;
        }

        User.create(data, function(err, user) {
          return done(err, user);
        });
      }
    });
  });
};

passport.serializeUser(function(user, done) {
  done(null, user.uid);
});

passport.deserializeUser(function(uid, done) {
  User.findOne({
    uid: uid
  }, function(err, user) {
    done(err, user);
  });
});

module.exports.http = {

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

    app.use(passport.initialize());
    app.use(passport.session());
  },

  middleware: {
    order: [
      'startRequestTimer',
      'cookieParser',
      'session',
      'passportAuth',
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
