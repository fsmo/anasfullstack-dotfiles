var request = Npm.require('request');
var stream = Npm.require('stream');
var currentStream = {};

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
    console.log('startStream', session);
    currentStream[session] = new stream.PassThrough();

    currentStream[session].pipe(request.post('http://localhost:8080/api/2.0/test-goldfish?' + session, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
    }));
  },

  stream: function(data, session) {
    console.log('stream', session,'data length: ', data.length);
    currentStream[session].write(new Buffer(data));
  },

  endStream: function(session) {
    console.log('endStream', session);
    currentStream[session].end();
    currentStream[session].unpipe(request.post('http://localhost:8080/api/2.0/test-goldfish'));
  }
});