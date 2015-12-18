var currentStream = {};
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
    if (!Meteor.userId()) {
      throw new Meteor.Error('You must login first!');
    } else {
      var userId = Meteor.userId();
      console.log(userId);
      currentStream[userId] = new stream.PassThrough();
      currentStream[userId].pipe(request.post('http://localhost:8080/api/2.0/test-goldfish', function(error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);
        }
      }));
    }
  },

  stream: function(data) {
    console.log(data.length);
    if (!Meteor.userId()) {
      throw new Meteor.Error('You must login first!');
    } else {
      var userId = Meteor.userId();
      console.log('stream', data.length);
      currentStream[userId].write(new Buffer(data));
      console.log(currentStream);
    }
  },

  endStream: function() {
    if (!Meteor.userId()) {
      throw new Meteor.Error('You must login first!');
    } else {
      console.log('endStream');
      var userId = Meteor.userId();
      currentStream[userId].end();
    }
  },
});
