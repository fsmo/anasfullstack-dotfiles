var P          = require('bluebird');
var auth       = pRequire('/lib/auth');
var apiUtil    = pRequire('/lib/api-util');
var global     = pRequire('/global');
var apiApp     = global.apiApp;

var Apicache   = require('apicache');
var cache      = Apicache.middleware;

var TagManager = pRequire('/managers/tag-manager');

apiApp.get('/tags/suggest', cache('5 hours'),
  function (req, res) {
	console.log('here');
	apiUtil.sendResponse(res,
	TagManager.getTagsSuggestions(req.query)
	);
  });
