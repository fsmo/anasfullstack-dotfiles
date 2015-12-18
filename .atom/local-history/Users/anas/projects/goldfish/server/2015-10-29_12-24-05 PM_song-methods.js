var request             = Npm.require('request');
var stream              = Npm.require('stream');
var currentStream       = {};
var currentStreamChunks = {};

Meteor.methods({
  saveAudio: function(mediaObj){
    Audio.insert(mediaObj,function(err,fileObj){
      return fileObj;
    });
  },

  deleteAudio: function (AudioId) {
    Audio.remove(AudioId);
  },

  startStream: function(session) {
    currentStream[session] = new stream.PassThrough();
    currentStreamChunks[session] = 0;

    console.log('startStream', session);

    currentStream[session].pipe(request.post('http://localhost:8080/api/2.0/test-goldfish?' + session,
      function(error, response, body) {
        if (!error && response.statusCode === 200) {
          console.log(body);
        }
      }));
  },

  stream: function(data, session, chunkNumber) {
    if (chunkNumber - currentStreamChunks[session] === 1){
      console.log('stream', session,'data length: ', data.length);
      currentStream[session].write(new Buffer(data));
      currentStreamChunks[session] = chunkNumber;
    } else {
      currentStreamChunks[session]
      console.error('Got the wrong chunk first!!');
    }
  },

  endStream: function(session) {
    console.log('endStream', session);
    currentStream[session].end();
    currentStream[session].unpipe(request.post('http://localhost:8080/api/2.0/test-goldfish'));
  }
});
