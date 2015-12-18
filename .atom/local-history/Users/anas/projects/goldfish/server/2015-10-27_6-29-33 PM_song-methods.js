var currentStream = {};
var request = Npm.require('request');
var stream = Npm.require('stream');
var

function checkLoggedIn() {
  if (!Meteor.userId()) {
    throw new Meteor.Error('You must login first!');
  }
}

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
    if (!Meteor.userId()) {
      throw new Meteor.Error('You must login first!');
    } else {
      var userId = Meteor.userId();
      currentStream = new stream.PassThrough();
      currentStream.pipe(request.post('http://localhost:8080/api/2.0/test-goldfish', function(error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);
        }
      }));
    }
  },

  stream: function(data) {
    checkLoggedIn();
    console.log('stream', data.length);
    currentStream.write(new Buffer(data));
  },

  endStream: function() {
    checkLoggedIn()
    console.log('endStream');
    currentStream.end();
  },

  test: function(data){
    console.log(data);
    console.log(Meteor.userId());
  }
});
