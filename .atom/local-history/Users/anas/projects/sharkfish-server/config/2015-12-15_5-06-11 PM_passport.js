/*global User */
var passport = require('passport');
var bcrypt = require('bcrypt');

var LocalStrategy = require('passport-local');




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
    callbackURL: sails.config.appsettings.BASE_URL + '/login/facebook/callback',
    enableProof: false
  },
  function(accessToken, refreshToken, profile, done) {
    'use strict';
    User.findOrCreate({facebookId: profile.id}, function(err, user) {
      return done(err, user);
    });
  }
));

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
