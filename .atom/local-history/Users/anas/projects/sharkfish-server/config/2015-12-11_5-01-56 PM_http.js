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
    passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
module.exports.passport = {
  local: {
    strategy: require('passport-local').Strategy
},
  function(email, password, done) {
    'use strict';

    User.findOne({
      email: email
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: 'Invalid Credintials!!'
        });
      }

      bcrypt.compare(password, user.password, function(err, res) {
        if (!res) {
          return done(null, false, {
            message: 'Invalid Credintials!!'
          });
        }
        var returnUser = {
          email: user.email,
          createdAt: user.createdAt,
          id: user.id
        };
        return done(null, returnUser, {
          message: 'Logged In Successfully'
        });
      });
    });
  }
));
-
    passport.use(new FacebookStrategy({
      clientID: facebookAuth.clientID,
      clientSecret: facebookAuth.clientSecret,
      callbackURL: sails.config.appsettings.BASE_URL + '/auth/facebook/callback'
    }, verifyHandler));

    passport.use(new TwitterStrategy({
      consumerKey: twitterAuth.consumerKey,
      consumerSecret: twitterAuth.consumerSecret,
      callbackURL: sails.config.appsettings.BASE_URL + '/auth/twitter/callback'
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
