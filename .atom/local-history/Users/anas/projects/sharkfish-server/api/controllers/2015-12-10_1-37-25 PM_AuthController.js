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
    'use strict';

    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }, function(err, user) {

      if (user) {
        req.logIn(user, function(err) {

          if (err) {
            sails.log.error('Auth Error', err);
            return res.serverError(err);
          }

          return res.ok();

        });
      } else {
        return res.redirect('/login');
      }

    })(req, res);
  },

  facebookLogin: function(req, res) {
    'use strict';

    passport.authenticate('facebook', {scope: 'email'});
  },

  logout: function(req, res) {
    'use strict';
    req.logout();
    res.redirect('/');
  }
};
