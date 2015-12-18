module.exports = function(req, res, next) {
  'use strict';
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.forbidden('You are not allowed to see this page!');
  }
};
