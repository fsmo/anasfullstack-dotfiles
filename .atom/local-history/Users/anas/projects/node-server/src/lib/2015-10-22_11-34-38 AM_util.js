
var P = require('bluebird');
var child_process = require('child_process');
var log = pRequire('/lib/log');

function dateToSeconds(date) {
  return '' + Math.floor((new Date(date)).getTime() / 1000);
}
exports.dateToSeconds = dateToSeconds;

function daysBetweenDates(date1, date2) {
  var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
  return Math.round(Math.abs((date1.getTime() - date2.getTime())/oneDay));
}
exports.daysBetweenDates = daysBetweenDates;

function promisifyProcess(childProcess) {
  return new P(function(resolve, reject) {
    // childProcess.stderr.on('data', function(data) {
    //   log.warning('Error in child process:', data.toString());
    // });
    // 
    // childProcess.on('error', function(err) {
    //   reject(err);
    // });

    childProcess.on('exit', function(code) {
      if(code === 0) {
        resolve();
      } else {
        reject(new Error('child process failed with code ' + code));
      }
    });
  });
}
exports.promisifyProcess = promisifyProcess;

function runCommand(cmd, args, options) {
  var childProcess = child_process.spawn(cmd, args, options);

  return promisifyProcess(childProcess);
}
exports.runCommand = runCommand;

function promisifyStream(stream) {
  return new P(function(resolve, reject) {
    stream.on('end', function() {
      resolve();
    });

    stream.on('finish', function() {
      resolve();
    });

    stream.on('error', function(err) {
      reject(err);
    });
  });
}
exports.promisifyStream = promisifyStream;
