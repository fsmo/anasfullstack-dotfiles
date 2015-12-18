/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 */
var passport = require('passport');

module.exports = {

  emailLogin: function(req, res) {
    'use strict';
    var middleware, req;

    if (req.isSocket) {
      req = _.extend(req, _.pick(require('http').IncomingMessage.prototype, 'login', 'logIn', 'logout', 'logOut', 'isAuthenticated', 'isUnauthenticated'));
    

    middleware = passport.authenticate('bearer', {
      session: false
    });

    return middleware(req, res, next);
    }
    
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
