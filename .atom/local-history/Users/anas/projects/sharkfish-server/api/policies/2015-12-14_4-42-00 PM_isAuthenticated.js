module.exports = function(req, res, next) {
  'use strict';
  (req, res, next) ->
    if req.isSocket
        req = _.extend req, _.pick(require('http').IncomingMessage.prototype, 'login', 'logIn', 'logout', 'logOut', 'isAuthenticated', 'isUnauthenticated')
    middleware = passport.authenticate('bearer', { session: false })
    middleware(req, res, next)
  if (req.isAuthenticated() || (req.session && req.session.authenticated)) {
    return next();
  } else {
    console.log('req.session', req.session);

    return res.forbidden('IT\'s FORBIDDEN!!!! You are not allowed to see this page!');
  }
};
