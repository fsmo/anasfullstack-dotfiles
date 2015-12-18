/*global User */
var passport = require('passport');
var bcrypt = require('bcrypt');
var LocalStrategy = require('passport-local');
var FacebookStrategy = require('passport-facebook').Strategy;

var facebookAuth;
var twitterAuth;
var facebookCallbackUrl;

if (process.env.FACEBOOK_AUTH) {
  facebookAuth = JSON.parse(process.env.FACEBOOK_AUTH);
} else {
  facebookAuth = require('./local.js').socialIds.facebook;
}

if (process.env.BASE_URL) {
  facebookCallbackUrl = process.env.BASE_URL + '/login/facebook/callback';
} else {
  facebookCallbackUrl = require('./local.js').baseUrl + '/login/facebook/callback';
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

passport.use('local', new LocalStrategy({
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

// passport.use('local-facebook', new LocalStrategy({
//     passReqToCallback: true
//   },
//
//   function(req, done) {
//     'use strict';
//     console.log('email ....... local-facebook', req);
//
//     User.findOne({
//       facebookId: facebookId
//     }, function(err, user) {
//       if (err) {
//         return done(err);
//       }
//
//       if (!user) {
//         return done(null, false, {
//           message: 'Invalid Credintials!!'
//         });
//       }
//
//       return done(null, user, {
//         message: 'Logged In Successfully'
//       });
//     });
//   }
// ));
//
passport.use(new FacebookStrategy({
    clientID: facebookAuth.clientID,
    clientSecret: facebookAuth.clientSecret,
    callbackURL: facebookCallbackUrl,
    enableProof: false
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      
      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
    // console.log('in the Strategy');
    // User.findOrCreate({
    //   facebookId: profile.id
    // }, function(err, user) {
    //   return done(err, user);
    // });
  }
));
