module.exports.bootstrap = function(cb) {

  var passport = require('passport');
  var  initialize = passport.initialize();
  var  session = passport.session();
  var  http = require('http');
  var  methods = ['login', 'logIn', 'logout', 'logOut', 'isAuthenticated', 'isUnauthenticated'];

  sails.removeAllListeners('router:request');
  sails.on('router:request', function(req, res) {
    initialize(req, res, function() {
      session(req, res, function(err) {
        if (err) {
          return sails.config[500](500, req, res);
        }
        for (var i = 0; i < methods.length; i++) {
          req[methods[i]] = http.IncomingMessage.prototype[methods[i]].bind(req);
        }
        sails.router.route(req, res);
      });
    });
  });
  cb();
};
