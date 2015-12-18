var global      = pRequire('/global');
var apiApp      = global.apiApp;
var idgen       = pRequire('/lib/idgen');
var fs          = require('fs');
var path        = require('path');
var stream      = require('stream');
var SoxCommand  = require('sox-audio');

apiApp.post('/test-goldfish', function(req, res) {
  idgen.generateId().then(function(id) {

    var currentStream = new stream.PassThrough();
    var command       = SoxCommand();
    var chunkName     = id;
    var oggFileDir    = path.normalize(__dirname + '/../record-analysis/' + chunkName + '.ogg');
    var writeStream   = fs.createWriteStream(oggFileDir);

    req.pipe(currentStream);

    command.input(req)
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

    req.on('end', function() {
      command.end();
    });


    command.on('start', function(commandLine) {
      console.log('Spawned sox with command ' + commandLine);
    });

    command.on('progress', function(progress) {
      console.log('Processing progress: ', progress);
    });

    command.on('error', function(err, stdout, stderr) {
      console.log('Cannot process audio: ' + err.message);
      console.log('Sox Command Stdout: ', stdout);
      console.log('Sox Command Stderr: ', stderr);
    });

    command.on('end', function() {
      console.log('Sox command Ended!');
      currentStream.emit('finish');
      res.status(200).json({ Sox: 'Sox command Ended!' });
    });

    command.run();
  });
});
