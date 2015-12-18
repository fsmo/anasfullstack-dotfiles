var P = require('bluebird');
var auth = pRequire('/lib/auth');
var apiUtil = pRequire('/lib/api-util');
var global = pRequire('/global');
var apiApp = global.apiApp;

var userFlagsManager = pRequire('/managers/user-flags-manager');


apiApp.get('/current-user/get-flags',
  auth.requireLogin,
  function(req, res) {
    apiUtil.sendResponse(res,
      userFlagsManager.getUserFlags(req.user.user_id)
    );
  });

apiApp.post('/current-user/set-flag/:flagName',
  auth.requireLogin,
  function(req, res) {
    apiUtil.sendResponse(res,
      userFlagsManager.setUserFlag(req.user.user_id, req.params.flagName)
    );
  });

apiApp.post('/admin/add-new-flag/:flagName',
  function(req, res) {
    apiUtil.sendResponse(res,
      userFlagsManager.addNewFlag(req.params.flagName)
    );
  });
