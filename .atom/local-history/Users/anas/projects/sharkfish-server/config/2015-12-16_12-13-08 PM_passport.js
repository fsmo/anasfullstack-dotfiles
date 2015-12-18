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
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    enableProof: false
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
