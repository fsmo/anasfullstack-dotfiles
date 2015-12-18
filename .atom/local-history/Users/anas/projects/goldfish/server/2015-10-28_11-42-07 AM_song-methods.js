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

  initializeStream: function(){
    if(Meteor.userId()){
      var userId = Meteor.userId();
      if(!currentStream[userId]){
        currentStream[userId] = new stream.PassThrough();
        console.log('Session initialized now!');
      }else {
        console.log('Session already initialized!');
      }
    }
  },

  startStream: function() {
    if (!Meteor.userId()) {
      throw new Meteor.Error('You must login first!');
    } else {
      var userId = Meteor.userId();
      console.log('currentStream[userId]', currentStream[userId]);
      currentStream[userId].pipe(request.post('http://localhost:8080/api/2.0/test-goldfish', function(error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);
        }
      }));
    }
  },

  stream: function(data) {
      var userId = Meteor.userId();
      console.log('stream', data.length);
      currentStream[userId].write(new Buffer(data));
  },

  endStream: function() {
      console.log('endStream');
      var userId = Meteor.userId();
      currentStream[userId].end();
      currentStream[userId] = null;
  },
});
