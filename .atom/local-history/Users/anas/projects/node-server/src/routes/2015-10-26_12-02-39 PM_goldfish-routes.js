var global  = pRequire('/global');
var apiApp  = global.apiApp;
var idgen   = pRequire('/lib/idgen');
var spawn   = require('child_process').spawn;
var util    = pRequire('/lib/util');
var fs      = require('fs');
var path    = require('path');

function soxWrapper(stream, args) {
  var sox = spawn('sox', args);

  stream.pipe(sox.stdin);
  return { promise: util.promisifyProcess(sox), stream: sox.stdout };
}

function pcmToOgg(stream) {
  var args = [
    '--channels', '1','--bits', '16','--type', 'raw', '-',
    // '--rate', '44100', '--encoding', 'signed', '--bits', '16', '--channels', '1', '--type', 's16', '-',
    '--compression', '3.0', '--rate', '44100', '--type', 'ogg', '-'
  ];
  return soxWrapper(stream, args);
}

apiApp.post('/test-goldfish', function(req, res) {
  idgen.generateId().then(function(id) {
    var chunkName = id;
    var jsonFileDir = path.normalize(__dirname + '/../record-analysis/' + chunkName + '.ogg');
    var writeStream = fs.createWriteStream(jsonFileDir);

    var convert = pcmToOgg(req);

    convert.stream.pipe(writeStream);

    convert.promise.then(function() {
      res.send('Write Stream End');
    });
  });
});
