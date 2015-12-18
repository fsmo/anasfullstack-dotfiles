
var global = {};

var commander = require('commander');
var path = require('path');
var braintree = require('braintree');

commander
  .option('--port <number>', 'Set server port. [1234]', 1234)
  .option('--disable-cluster', 'Disable clustering')
  .option('--debug')
  .parse(process.argv);

global.port = commander.port;
global.disableCluster = Boolean(commander.disableCluster);
global.debug = commander.debug;
global.sessionSecret = 'mAnBtjC1dpzfHeDt7vNM';

var baseDir = path.normalize(path.join(__dirname, '..'));

global.dirs = {
  root: baseDir,
  resources: path.join(baseDir, 'resources'),
  cache: path.join(baseDir, 'storage_cache', 'expressjs')
};

function initBraintree(config) {
  global.BTgateway = braintree.connect({
    environment:  config.sandbox ? braintree.Environment.Sandbox : braintree.Environment.Production,
    merchantId: config.merchantId,
    publicKey: config.publicKey,
    privateKey: config.privateKey
  });
}

global.setCredentials = function(credentials) {
  global.credentials = credentials;
  global.dev = !!credentials.dev;
  global.production = !global.dev;

  process.env.NODE_ENV = global.dev ? 'development' : 'production';
  initBraintree(credentials.braintree);
};

var express = require('express');
global.app = express();
global.apiApp = express();

var bodyParser = require('body-parser');
global.parseFormData = [
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true })
];

module.exports = global;
