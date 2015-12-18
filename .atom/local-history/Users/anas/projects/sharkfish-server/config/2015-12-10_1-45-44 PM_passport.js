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
    callbackURL: '/login/facebook/callback'
  },

  // facebook will send back the tokens and profile
  function(accessToken, refreshToken, profile, done) {
    // asynchronous
    process.nextTick(function() {

      // find the user in the database based on their facebook id
      User.findOne({'id': profile.id}, function(err, user) {

        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err) {return done(err);}

        // if the user is found, then log them in
        if (user) {
          return done(null, user); // user found, return that user
        } else {
          // if there is no user found with that facebook id, create them
          var newUser = new User();

          // set all of the facebook information in our user model
          newUser.fb.id    = profile.id; // set the users facebook id
          newUser.fb.accessToken = accessToken; // we will save the token that facebook provides to the user
          newUser.fb.firstName  = profile.name.givenName;
          newUser.fb.lastName = profile.name.familyName; // look at the passport user profile to see how names are returned
          newUser.fb.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

          // save our user to the database
          newUser.save(function(err) {
              if (err)
                throw err;

              // if successful, return the new user
              return done(null, newUser);
            });
        }
      });
    });
  }));

passport.use(new TwitterStrategy({
    consumerKey: twitterAuth.consumerKey,
    consumerSecret: twitterAuth.consumerSecret,
    callbackURL: '/login/twirtter/callbacks'
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
