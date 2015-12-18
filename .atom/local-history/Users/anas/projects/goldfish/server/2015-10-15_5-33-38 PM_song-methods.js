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
var serverBigBuffer = [];

Meteor.publish('stream', function(stream) {
  serverBigBuffer.push(stream);
  console.log(serverBigBuffer);
});

Meteor.publish('stopStream', function() {
  var serverFinalBuffer = _.flatten(serverBigBuffer);
  console.log('finishedStream', serverFinalBuffer);
  serverBigBuffer=[];
});
