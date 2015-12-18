var global      = pRequire('/global');
var apiApp      = global.apiApp;
var idgen       = pRequire('/lib/idgen');
var fs          = require('fs');
var path        = require('path');
var stream      = require('stream');
var SoxCommand  = require('sox-audio');
var P = require('bluebird');

var busboy = require('connect-busboy');

function rawToOgg(inputStream, writeStream) {
  var command     = SoxCommand();

  command.input(inputStream)
    .inputSampleRate(44100)
    .inputEncoding('signed')
    .inputBits(16)
    .inputChannels(1)
    .inputFileType('raw');

  command.output(writeStream)
    .outputSampleRate(44100)
    .outputEncoding('signed')
    .outputBits(16)
    .outputChannels(1)
    .outputFileType('ogg');

  command.on('start', function(commandLine) {
    console.log('Spawned sox with command ' + commandLine);
  });

  command.on('progress', function(progress) {
    console.log('Processing progress: ', progress);
  });

  return new P(function(resolve, reject) {
    command.on('error', function(err, stdout, stderr) {
      console.log('Cannot process audio: ' + err.message);
      console.log('Sox Command Stdout: ', stdout);
      console.log('Sox Command Stderr: ', stderr);
      reject(err);
    });

    command.on('end', function() {
      console.log('Sox command Ended!');
      resolve();
      // res.status(200).json({ Sox: 'Sox command Ended!' });
      // res.end();
    });

    command.run();
  });
}

apiApp.post('/test-goldfish', function(req, res) {
  idgen.generateId().then(function(id) {
    var currentStream = new stream.PassThrough();

    var chunkName     = id;
    var oggFileDir    = path.normalize(__dirname + '/../record-analysis/' + chunkName + '.ogg');
    var writeStream   = fs.createWriteStream(oggFileDir);

    currentStream.on('end', function() {
      console.log('currentStream end');
    });

    req.pipe(currentStream);
    rawToOgg(currentStream, writeStream).then(function() {
      res.send();
    });
  });
});
