var P       = require('bluebird');
var auth    = pRequire('/lib/auth');
var apiUtil = pRequire('/lib/api-util');
var global  = pRequire('/global');
var apiApp  = global.apiApp;

var TagManager = pRequire('/managers/tag-manager');


apiApp.get('/tags/suggest',
  function(req, res) {
    apiUtil.sendResponse(res,
      TagManager.getUserFlags(req.user.user_id)
    );
  });