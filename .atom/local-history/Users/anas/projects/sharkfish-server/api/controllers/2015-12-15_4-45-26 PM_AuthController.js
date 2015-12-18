/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 */
/*globals User*/
var passport = require('passport');

module.exports = {

  emailLogin: function(req, res) {
    'use strict';
    passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user)) {
        sails.log.error(info.message);
        return res.forbidden();
      }

      req.logIn(user, function(err) {
        if (err) {
          sails.log.error(err);
          res.serverError();
        }

        req.session.authenticated = true;
        req.session.userId = user.id;

        sails.log.debug('emailLogin req session', req.session);
        sails.log.info('user', user.email, 'authenticated successfully');

        return res.send({
          message: info.message,
          user: user
        });
      });
    })(req, res);
  },

  facebookLogin: function(req, res) {
    'use strict';
    passport.authenticate('facebook', function(err, user, info) {
      if ((err) || (!user)) {
        sails.log.error(info.message);
        return res.forbidden();
      }

      User.findOne({
        facebookId: user.id
      }, function(err, dbUser) {
        if (err) {
          sails.log.error(err);
          res.serverError();
        }

        if (dbUser === undefined) {
          var newUser = {
            facebookId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          };

          User.create(newUser, function(err, createdUser) {
            if (err) {
              sails.log.error(err);
              res.serverError();
            }

            req.logIn(createdUser, function(err) {
              if (err) {
                sails.log.error(err);
                res.serverError();
              }

              req.session.authenticated = true;
              req.session.userId = createdUser.id;

              sails.log.info('user', user.email, 'authenticated successfully');

              return res.send({
                message: info.message,
                user: createdUser
              });
            });
          });
        }

      });
      req.login();
    });
  },

  logout: function(req, res) {
    'use strict';
    req.logout();
    delete req.user;
    delete req.session.passport;
    req.session.authenticated = false;

    res.ok('Log out successfully!!');
  }

};
