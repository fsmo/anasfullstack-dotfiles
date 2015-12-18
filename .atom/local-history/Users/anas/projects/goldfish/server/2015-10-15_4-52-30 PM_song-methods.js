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
  console.log(serverBigBuffer.length);
});

Meteor.publish('stopStream', function(stream) {
  console.log('finishedStream', serverBigBuffer.length);
});
