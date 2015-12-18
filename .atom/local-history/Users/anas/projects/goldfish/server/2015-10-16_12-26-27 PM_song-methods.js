Meteor.methods({
  saveAudio: function(mediaObj){
    Audio.insert(mediaObj,function(err,fileObj){
      return fileObj;
    });
  },
  deleteAudio: function (AudioId) {
    Audio.remove(AudioId);
  },
});

Meteor.publish('stream', function(stream) {
  AnalysisStore.insert(stream);
  
  console.log(stream);
  HTTP.call('POST', 'http://localhost:8080/api/2.0/test-goldfish', stream, function(error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log(response);
    }
  });
});

Meteor.publish('stopStream', function() {
  console.log('finished Streaming');
});
