var passport = require('passport');

/**
 * Passport Middleware
 */
var http = require('http');
var methods = ['login', 'logIn', 'logout', 'logOut', 'isAuthenticated', 'isUnauthenticated'];

module.exports = function(req, res, next) {
  'use strict';
  // Initialize Passport
  passport.initialize()(req, res, function() {
    // Use the built-in sessions
    passport.session()(req, res, function() {

      // Make the request's passport methods available for socket
      if (req.isSocket) {
        _.each(methods, function(method) {
          req[method] = http.IncomingMessage.prototype[method].bind(req);
        });
      }

      // Make the user available throughout the frontend (for views)
      res.locals.user = req.user;

      next();
    });
  });
};


if req.isSocket
        req = _.extend req, _.pick(require('http').IncomingMessage.prototype, 'login', 'logIn', 'logout', 'logOut', 'isAuthenticated', 'isUnauthenticated')
    middleware = passport.authenticate('bearer', { session: false })
    middleware(req, res, next)