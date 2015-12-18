var global      = pRequire('/global');
var apiApp      = global.apiApp;
var idgen       = pRequire('/lib/idgen');
var spawn       = require('child_process').spawn;
var util        = pRequire('/lib/util');
var fs          = require('fs');
var path        = require('path');

function soxWrapper(stream, args) {
  console.log('soxWrapper');
  return 'bla';
  // var sox = spawn('sox', args);
  // try {
  //   stream.pipe(sox.stdin);
  //   return { promise: util.promisifyProcess(sox), stream: sox.stdout };
  // } catch (e) {
  //   console.log('e', e);
  // }
}

function pcmToOgg(stream) {
  var args = [
    '-r', '44100', '-e', 'signed', '-b', '16', '-c', '1', '-t', 's16', '-',
    '-C', '3.0', '-r', '44100', '-t', 'ogg', '-'
  ];
  return soxWrapper(stream, args);
}

apiApp.post('/test-goldfish', function(req, res) {
  idgen.generateId().then(function(id) {
    var chunkName = id;
    var jsonFileDir = path.normalize(__dirname + '/../record-analysis/' + chunkName + '.ogg');
    var writeStream = fs.createWriteStream(jsonFileDir);

    var convert = pcmToOgg(req);

    convert.stream.pipe(writeStream,{ end: false });

    convert.promise.then(function() {
      res.send('Write Stream End');
    });
  });
});

// apiApp.post('/test-goldfish', function(req, res) {
//   console.log('test goldfish api');
//   idgen.generateId().then(function(id) {
//     console.log('id ', id);
//
//     var currentStream = new stream.PassThrough();
//     var command = SoxCommand();
//     var chunkName = id;
//     var oggFileDir = path.normalize(__dirname + '/../record-analysis/' + chunkName + '.ogg');
//     var rawFileDir = path.normalize(__dirname + '/../record-analysis/' + 'd318927193a53cae85786be3355cffd9.raw');
//     var writeStream = fs.createWriteStream(oggFileDir);
//     var readStrean = fs.createReadStream(rawFileDir, {encoding: "utf16le"});
//
//       command.input(readStrean)
//         .inputSampleRate(44100)
//         .inputEncoding('signed')
//         .inputBits(16)
//         .inputChannels(1)
//         .inputFileType('raw');
//
//       command.output(writeStream)
//         .outputSampleRate(44100)
//         .outputEncoding('signed')
//         .outputBits(16)
//         .outputChannels(1)
//         .outputFileType('ogg');
//
//       command.on('start', function(commandLine) {
//         console.log('Spawned sox with command ' + commandLine);
//       });
//
//       command.on('progress', function(progress) {
//         console.log('Processing progress: ', progress);
//       });
//
//       command.on('error', function(err, stdout, stderr) {
//         console.log('Cannot process audio: ' + err.message);
//         console.log('Sox Command Stdout: ', stdout);
//         console.log('Sox Command Stderr: ', stderr)
//       });
//
//       command.on('end', function() {
//         console.log('Sox command succeeded!');
//       });
//   });
// });
