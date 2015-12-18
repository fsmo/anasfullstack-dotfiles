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
    'use strict';
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

  // https://developers.google.com/
  // https://developers.google.com/accounts/docs/OAuth2Login#scope-param
  google: function(req, res) {
    'use strict';
    passport.authenticate('google', {
      failureRedirect: '/login',
      scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read']
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

  // https://apps.twitter.com/
  // https://apps.twitter.com/app/new
  twitter: function(req, res) {
    'use strict';
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
      req.logout();
      delete req.user;
      delete req.session.passport;
      req.session.authenticated = false;

      if (!req.isSocket) {
        res.redirect(req.query.next || '/');
      } else {
        res.ok();
      }
    },
};
