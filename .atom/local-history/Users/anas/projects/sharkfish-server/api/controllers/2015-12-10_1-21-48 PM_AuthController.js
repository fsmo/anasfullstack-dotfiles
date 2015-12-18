/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 */
var passport = require('passport');

module.exports = {

  emailLogin: function(req, res) {
    'use strict';

    passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user)) {
        return res.send({
          message: info.message,
          user: user
        });
      }

      req.logIn(user, function(err) {
        if (err) {
          res.send(err);
        }

        return res.send({
          message: info.message,
          user: user
        });
      });
    })(req, res);
  },

  twitterLogin: function(req, res) {

    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }, function(err, user) {

      if (user) {
        req.logIn(user, function(err) {

          if (err) {
            sails.log.error('Auth Error', err);
            return res.serverError(err);
          }

          return res.redirect('/login');

        });
      } else {
        return res.redirect('/');
      }

    })(req, res);
  },

  // Facebook login screen
  facebook: function(req, res) {

    console.log('+ AUTH.FACEBOOK');
    passport.authenticate('facebook', {
      failureRedirect: '/login'
    }, function(err, user) {

      console.log('Facebook Auth Response error=', err, 'user=', user);

      if (user) {
        req.logIn(user, function(err) {

          if (err) {
            console.log('Auth Error', err);
            return res.view('500');
          }

          return res.redirect('/account');

        });
      } else {
        return res.redirect('/');
      }

    })(req, res);
  }

  logout: function(req, res) {
    'use strict';
    req.logout();
    res.redirect('/');
  }
};
