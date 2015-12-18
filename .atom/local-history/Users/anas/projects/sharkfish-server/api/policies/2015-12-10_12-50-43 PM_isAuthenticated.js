module.exports = function(req, res, next) {
  'use strict';
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.forbiddeb('you are no authenticated for this action');
  }
};
