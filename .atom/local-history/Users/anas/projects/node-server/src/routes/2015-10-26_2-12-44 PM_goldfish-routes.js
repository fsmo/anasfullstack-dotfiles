var global  = pRequire('/global');
var apiApp  = global.apiApp;
var idgen   = pRequire('/lib/idgen');
var spawn   = require('child_process').spawn;
var util    = pRequire('/lib/util');
var fs      = require('fs');
var path    = require('path');
var stream = require('stream');

function soxWrapper(stream, args) {
  var sox = spawn('sox', args);

  stream.pipe(sox.stdin);
  return { promise: util.promisifyProcess(sox), stream: sox.stdout };
}

function pcmToOgg(stream) {
  var args = [
    '-V3', '-r', '44100', '-e', 'signed-integer', '-b', '16', '-c', '2', '-t', 's16', '-',
    '-C', '3.0', '-r', '44100', '-t', 'ogg', '-'
  ];
  return soxWrapper(stream, args);
}

apiApp.post('/test-goldfish', function(req, res) {
  console.log('goldfish route');
  idgen.generateId().then(function(id) {
    var chunkName = id;
    var jsonFileDir = path.normalize(__dirname + '/../record-analysis/' + chunkName + '.ogg');
    var writeStream = fs.createWriteStream(jsonFileDir);

    var dataStream = new stream.PassThrough();
    req.pipe(dataStream);

    var convert = pcmToOgg(dataStream);

    convert.stream.pipe(writeStream);

    convert.promise.then(function() {
      res.send('Write Stream End');
    });
  });
});
