/*global User*/
var facebookAuth;
var twitterAuth;
var googleAuth;

var passport = require('passport');
var bcrypt = require('bcrypt');

var LocalStrategy = require('passport-local');
// var FacebookStrategy = require('passport-facebook').Strategy;
// var TwitterStrategy  = require('passport-twitter').Strategy;
// var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

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
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  'use strict';
  User.findOne({
    id: id
  }, function(err, user) {
    done(err, user);
  });
});

passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  },
  function(req, email, password, done) {

    'use strict';

    User.findOne({
      email: email
    }, function(err, user) {
      if (err) {
        sails.log.error(err);
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

  }));

passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  },
  function(req, email, password, done) {
    'use strict';
    // asynchronous
    process.nextTick(function() {

      //  Whether we're signing up or connecting an account, we'll need
      //  to know if the email address is in use.
      User.findOne({
        'local.email': email
      }, function(err, existingUser) {

        // if there are any errors, return the error
        if (err) {
          sails.log.error(err);
          return done(err);
        }

        // check to see if there's already a user with that email
        if (existingUser) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        }

        //  If we're logged in, we're connecting a new local account.
        if (req.user) {
          var user = req.user;
          user.email = email;
          user.password = password;

          user.save(function(err) {
            if (err) {
              sails.log.error(err);
              return done(err);
            }

            return done(null, user);
          });
        }
        //  We're not logged in, so we're creating a brand new user.
        else {
          // create the user
          var newUser = new User();

          newUser.email = email;
          newUser.password = password;

          newUser.save(function(err) {
            if (err) {
              sails.log.error(err);
              return done(err);
            }

            return done(null, newUser);
          });
        }
      });
    });
  }));
