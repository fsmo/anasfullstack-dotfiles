/**
 *  api-server.js
 *
 *  Copyright (c) 2012 DoReMIR Music Research AB.
 *  All Rights Reserved.
 *
 *  Contributors:
 *      Soares Chen
 **/

require('./monkey-patch');
//require('longjohn')
require('./src/pRequire');

var http = require('http');
var cluster = require('cluster');
var domainLib = require('domain');
var nodeHandlerLib = require('quiver-node-handler');
var cpuCount = require('os').cpus().length;
var configure = require('./config');
var log = require('./src/lib/log');
var clusterLog = log.createLogger('[cluster]');

var fs = require('fs');
var childProcess = require('child_process');

var expressServer = require('./src/main');

var safeCallbackLib = require('quiver-safe-callback');

var requestHeadExtractor = require('./lib/requestHeadExtractor');

var startWorker = function(workerId) {
  clusterLog.info('starting new worker', workerId);

  configure.loadConfig(function(err, config) {
    if(err) { throw err; }

    var mainHandleableBuilder = config.quiverHandleableBuilders['modus main http handler'];

    var logger = config.logger;
    var server = null;
    var uncaughtExceptionHandler = function(err) {
      clusterLog.error('Uncaught exception in worker:', err.stack);

      if(server) server.close();
      cluster.worker.disconnect();

      setTimeout(function() {
        process.exit(1);
        clusterLog.info('exiting worker', workerId);
      }, 60000);
    };

    config.uncaughtExceptionHandler = uncaughtExceptionHandler;

    mainHandleableBuilder(config, function(err, handleable) {
      if(err) { throw err; }

      var options = {
        requestHeadExtractor: requestHeadExtractor
      };
      var httpHandler = handleable.toHttpHandler();
      var nodeHandler = nodeHandlerLib.createNodeHttpHandlerAdapter(httpHandler, options);

      expressServer.init(nodeHandler);

      process.addListener('uncaughtException', uncaughtExceptionHandler);
    });
  });
};

var startCluster = function() {
  if(cluster.isMaster) {
    for(var i=0; i<cpuCount; i++) {
      cluster.fork();
    }

    cluster.on('disconnect', function(worker) {
      clusterLog.info('worker disconnected', worker.id);
      cluster.fork();
    });

    cluster.on('exit', function(worker, code, signal) {
      clusterLog.info('worker exited', worker.id, code, signal);
    });

    var loadCredentials = require('./credentials').loadCredentials;

    loadCredentials(function(err, credentials) {
      if(err) { throw err; }

      var global = require('./src/global');
      global.setCredentials(credentials);

      var cronJobsProcess = childProcess.fork(__dirname + '/src/cronJobs.js');
      cronJobsProcess.send('Starting the cron job child process');
   });
   
  } else {
    startWorker(cluster.worker.id);
  }
};

if(process.argv.indexOf('--disable-cluster') !== -1) {
  startWorker(1);
} else {
  startCluster();
}
