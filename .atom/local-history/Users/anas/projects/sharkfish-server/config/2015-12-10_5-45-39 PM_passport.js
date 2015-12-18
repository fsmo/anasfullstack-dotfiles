/*global User*/
var facebookAuth;
var twitterAuth;
var googleAuth;

var passport = require('passport');
var bcrypt = require('bcrypt');

var LocalStrategy = require('passport-local');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

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

passport.use(new FacebookStrategy({

  clientID: facebookAuth.clientID,
  clientSecret: facebookAuth.clientSecret,
  callbackURL: 'https://127.0.0.1:1337/login/facebook/callback',
  passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

},
  function(req, token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(function() {
      console.log(profile);
      console.log(req.user);
      // check if the user is already logged in
      if (!req.user) {

        User.findOne({'facebook.id': profile.id}, function(err, user) {
          if (err) {
            sails.log.error(err);
            return done(err);
          }

          if (user) {

            // if there is a user id already but no token (user was linked at one point and then removed)
            if (!user.facebook.token) {
              user.facebook.token = token;
              user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
              user.facebook.email = profile.emails[0].value;

              user.save(function(err) {
                if (err) {
                  sails.log.error(err);
                  return done(err);
                }
                return done(null, user);
              });
            }

            return done(null, user); // user found, return that user
          } else {
            // if there is no user, create them
            var newUser = {
              facebook: {
                id: profile.id,
                token: token,
                name: profile.name ,
                email: profile.email
              }
            };

            User.create(newUser, function(err, newUserResult) {
              if (err) {
                sails.log.error(err);
                return done(err);
              }
              return done(null, newUserResult);
            });
          }
        });

      } else {
        // user already exists and is logged in, we have to link accounts
        var user = req.user; // pull the user out of the session

        user.facebook.id = profile.id;
        user.facebook.token = token;
        user.facebook.name = profile.name;
        user.facebook.email = profile.email;

        user.save(function(err) {
          if (err) {
            sails.log.error(err);
          }
          return done(null, user);
        });
      }
    });
  }));

// passport.use(new TwitterStrategy({
//
//   consumerKey: configAuth.twitterAuth.consumerKey,
//   consumerSecret: configAuth.twitterAuth.consumerSecret,
//   callbackURL: configAuth.twitterAuth.callbackURL,
//   passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
//
// },
//   function(req, token, tokenSecret, profile, done) {
//
//     // asynchronous
//     process.nextTick(function() {
//
//       // check if the user is already logged in
//       if (!req.user) {
//
//         User.findOne({
//           'twitter.id': profile.id
//         }, function(err, user) {
//           if (err) {
//             sails.log.error(err);
//             return done(err);
//           }
//
//           if (user) {
//             // if there is a user id already but no token (user was linked at one point and then removed)
//             if (!user.twitter.token) {
//               user.twitter.token = token;
//               user.twitter.username = profile.username;
//               user.twitter.displayName = profile.displayName;
//
//               user.save(function(err) {
//                 if (err) {
//                   sails.log.error(err);
//                 }
//                 return done(null, user);
//               });
//             }
//
//             return done(null, user); // user found, return that user
//           } else {
//             // if there is no user, create them
//             var newUser = new User();
//
//             newUser.twitter.id = profile.id;
//             newUser.twitter.token = token;
//             newUser.twitter.username = profile.username;
//             newUser.twitter.displayName = profile.displayName;
//
//             newUser.save(function(err) {
//               if (err)
//                 throw err;
//               return done(null, newUser);
//             });
//           }
//         });
//
//       } else {
//         // user already exists and is logged in, we have to link accounts
//         var user = req.user; // pull the user out of the session
//
//         user.twitter.id = profile.id;
//         user.twitter.token = token;
//         user.twitter.username = profile.username;
//         user.twitter.displayName = profile.displayName;
//
//         user.save(function(err) {
//           if (err)
//             throw err;
//           return done(null, user);
//         });
//       }
//
//     });
//
//   }));
//
// passport.use(new GoogleStrategy({
//
//   clientID: configAuth.googleAuth.clientID,
//   clientSecret: configAuth.googleAuth.clientSecret,
//   callbackURL: configAuth.googleAuth.callbackURL,
//   passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
//
// },
//   function(req, token, refreshToken, profile, done) {
//
//     // asynchronous
//     process.nextTick(function() {
//
//       // check if the user is already logged in
//       if (!req.user) {
//
//         User.findOne({
//           'google.id': profile.id
//         }, function(err, user) {
//           if (err)
//             return done(err);
//
//           if (user) {
//
//             // if there is a user id already but no token (user was linked at one point and then removed)
//             if (!user.google.token) {
//               user.google.token = token;
//               user.google.name = profile.displayName;
//               user.google.email = profile.emails[0].value; // pull the first email
//
//               user.save(function(err) {
//                 if (err)
//                   throw err;
//                 return done(null, user);
//               });
//             }
//
//             return done(null, user);
//           } else {
//             var newUser = new User();
//
//             newUser.google.id = profile.id;
//             newUser.google.token = token;
//             newUser.google.name = profile.displayName;
//             newUser.google.email = profile.emails[0].value; // pull the first email
//
//             newUser.save(function(err) {
//               if (err)
//                 throw err;
//               return done(null, newUser);
//             });
//           }
//         });
//
//       } else {
//         // user already exists and is logged in, we have to link accounts
//         var user = req.user; // pull the user out of the session
//
//         user.google.id = profile.id;
//         user.google.token = token;
//         user.google.name = profile.displayName;
//         user.google.email = profile.emails[0].value; // pull the first email
//
//         user.save(function(err) {
//           if (err)
//             throw err;
//           return done(null, user);
//         });
//       }
//     });
//
//   }));
