var currentStream;
var request = Npm.require('request');
var stream = Npm.require('stream');

Meteor.methods({
  saveAudio: function(mediaObj){
    Audio.insert(mediaObj,function(err,fileObj){
      return fileObj;
    });
  },

  deleteAudio: function (AudioId) {
    Audio.remove(AudioId);
  },

  startStream: function() {
    currentStream = new stream.PassThrough();

    currentStream.pipe(request.post('http://localhost:8080/api/2.0/test-goldfish', function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
    }));
  },

  stream: function(data) {
    console.log('stream', data.length);
    currentStream.write(new Buffer(data));
  },

  endStream: function() {
    console.log('endStream');
    currentStream.end();
  },
  test:function(){
    return Meteor.userId();
  }
});
