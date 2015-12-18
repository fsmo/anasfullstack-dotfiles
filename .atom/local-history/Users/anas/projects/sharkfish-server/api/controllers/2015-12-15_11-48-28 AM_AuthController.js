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
        return res.forbidden(info.message);
      }

      req.logIn(user, function(err) {
        if (err) {
          res.serverError(err);
        }

        req.session.authenticated = true;
        req.session.userId = user.id;
        console.log('req session', req.session);
        sails.log.info('user', user.email, 'authenticated successfully');

        return res.send({
          message: info.message,
          user: user
        });
      });
    })(req, res);
  },

  logout: function(req, res) {
    'use strict';
    req.logout();
    delete req.user;
    delete req.session.passport;
    req.session.authenticated = false;

    if (!req.isSocket) {
      res.ok('Log out successfully!!');
    } else {
      res.ok('Log out successfully!!');
    }
  }

};
