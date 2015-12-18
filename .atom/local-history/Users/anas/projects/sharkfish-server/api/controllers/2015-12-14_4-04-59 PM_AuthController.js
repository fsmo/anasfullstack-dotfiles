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
        sails.log.info('user', user, 'authenticated successfully');

        return res.send({
          message: info.message,
          user: user
        });
      });
    })(req, res);
  },

  logout: function(req, res) {
    'use strict';
    console.log('req.user', req.user);
    console.log('req.session', req.session);
    req.logout();
    delete req.user;
    delete req.session.passport;
    req.session.authenticated = false;

    res.ok('Log out successfully!!');
  }

};
