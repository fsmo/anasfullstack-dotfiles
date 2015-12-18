var passport = require('passport');

/**
 * Passport Middleware
 */
var http = require('http');
var methods = ['login', 'logIn', 'logout', 'logOut', 'isAuthenticated', 'isUnauthenticated'];

module.exports = function(req, res, next) {
  'use strict';
  // Initialize Passport

  console.log('Passport req session', req.session);

  passport.initialize()(req, res, function() {
    // Use the built-in sessions
    passport.session()(req, res, function() {

      // Make the request's passport methods available for socket
      if (req.isSocket) {
        _.each(methods, function(method) {
          req[method] = http.IncomingMessage.prototype[method].bind(req);
          console.log('req.isSocket');
        });
      }
      console.log('Passport req session', req.session);
      // Make the user available throughout the frontend (for views)
      res.locals.user = req.user;

      next();
    });
  });
};
