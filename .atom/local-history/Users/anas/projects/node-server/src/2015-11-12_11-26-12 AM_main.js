
require('./pRequire');
require('monitor').start();

var loadCredentials = require('../credentials').loadCredentials;
var loadQuiverConfig = require('../config').loadConfig;
var CronJob = require('cron').CronJob;
var log  = pRequire('/lib/log');

function init(handler) {
  loadCredentials(function(err, credentials) {
    if(err) { throw err; }

    var global = require('./global');
    global.setCredentials(credentials);

    var server = require('./server');
    server.init(handler);
  });
}
exports.init = init;

if(!module.parent) {
  var http_proxy = require('http-proxy');
  var proxy = http_proxy.createProxyServer();

  proxy.on('error', function(e) {
    console.log('Proxy error: ' + e);
  });

  init(function(req, res) {
    proxy.web(req, res, {target: 'http://alpha-api.scorecloud.com:8080'});
  });
}
