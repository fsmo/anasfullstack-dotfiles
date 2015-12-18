/*global
User
*/
var passport = require('passport');
var bcrypt = require('bcrypt');

var LocalStrategy = require('passport-local');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

var facebookAuth;
var twitterAuth;
var googleAuth;

if (process.env.FACEBOOK_AUTH) {
  facebookAuth = JSON.parse(process.env.FACEBOOK_AUTH);
} else {
  facebookAuth = require('./local.js').socialIds.facebook;
}

if (process.env.GOOGLE_AUTH) {
  googleAuth = JSON.parse(process.env.GOOGLE_AUTH);
} else {
  googleAuth = require('./local.js').socialIds.google;
}

if (process.env.TWITTER_AUTH) {
  twitterAuth = JSON.parse(process.env.TWITTER_AUTH);
} else {
  twitterAuth = require('./local.js').socialIds.twitter;
}

passport.serializeUser(function(user, done) {
  'use strict';
  console.warn(user);
  done(null, user.id || user.facebookId);
});

passport.deserializeUser(function(id, done) {
  'use strict';
  User.findOne({
    id: id
  }, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
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

passport.use(new FacebookStrategy({
  clientID: facebookAuth.clientID,
  clientSecret: facebookAuth.clientSecret,
  callbackURL: facebookAuth.callbackURL
},
  function(accessToken, refreshToken, profile, done) {
    'use strict';
    process.nextTick(function() {
      return done(null, profile);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: facebookAuth.clientID,
    clientSecret: facebookAuth.clientSecret,
    callbackURL: '/login/facebook/callback'
  },

  // facebook will send back the tokens and profile
  function(accessToken, refreshToken, profile, done) {
    'use strict';
    process.nextTick(function() {
      return done(null, profile);
    });
  }));

passport.use(new TwitterStrategy({
    consumerKey: twitterAuth.consumerKey,
    consumerSecret: twitterAuth.consumerSecret,
    callbackURL: '/login/facebook/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    'use strict';
    process.nextTick(function() {
      return done(null, profile);
    });
  }
));

passport.use(new GoogleStrategy({
    clientID: googleAuth.clientID,
    clientSecret: googleAuth.clientSecret,
    callbackURL: '/login/google/callback',
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    'use strict';
    process.nextTick(function() {
      return done(null, profile);
    });
  }
));
