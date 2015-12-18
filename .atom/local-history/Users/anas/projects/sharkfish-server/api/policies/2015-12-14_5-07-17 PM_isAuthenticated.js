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

  if (req.isAuthenticated() || (req.session && req.session.authenticated)) {
    return next();
  } else {
    console.log('req.session', req.session);

    return res.forbidden('IT\'s FORBIDDEN!!!! You are not allowed to see this page!');
  }
};
