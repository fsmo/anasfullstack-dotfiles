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

  facebook: function(req, res) {
    passport.authenticate('facebook', {
      failureRedirect: '/login',
      scope: ['email']
    }, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          console.log(err);
          res.view('500');
          return;
        }

        res.redirect('/');
        return;
      });
    })(req, res);
  },

  twitter: function(req, res) {
    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          console.log(err);
          res.view('500');
          return;
        }

        res.redirect('/');
        return;
      });
    })(req, res);
  },
  
  logout: function(req, res) {
    'use strict';
    req.logout();
    res.redirect('/');
  }
};
