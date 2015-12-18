/*global
User
*/
var passport = require('passport');
var bcrypt =  require('bcrypt');
// var config = require('./local.js').socialIds;
var LocalStrategy = require('passport-local');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var facebookAuth,
  twitterAuth,
  googleAuth;

if (process.env.FACEBOOK_AUTH) {
  facebookAuth = JSONj.parse(process.env.FACEBOOK_AUTH);
}

passport.serializeUser(function(user, done) {
  'use strict';
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  'use strict';
  User.findOne({id: id}, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  function(email, password, done) {
    'use strict';

    User.findOne({email: email}, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {message: 'Invalid Credintials!!'});
      }

      bcrypt.compare(password, user.password, function(err, res) {
        if (!res) {
          return done(null, false, {message: 'Invalid Credintials!!'});
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
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret,
  callbackURL: config.facebook.callbackURL
},
function(accessToken, refreshToken, profile, done) {
  'use strict';
  process.nextTick(function() {
    return done(null, profile);
  });
}
));

passport.use(new TwitterStrategy({
  consumerKey: config.twitter.consumerKey,
  consumerSecret: config.twitter.consumerSecret,
  callbackURL: config.twitter.callbackURL
},
function(accessToken, refreshToken, profile, done) {
  'use strict';
  process.nextTick(function() {
    return done(null, profile);
  });
}
));

passport.use(new GoogleStrategy({
  clientID: config.google.clientID,
  clientSecret: config.google.clientSecret,
  callbackURL: config.google.callbackURL,
  passReqToCallback: true
},
  function(request, accessToken, refreshToken, profile, done) {
    'use strict';
    process.nextTick(function() {
      return done(null, profile);
    });
  }
));
