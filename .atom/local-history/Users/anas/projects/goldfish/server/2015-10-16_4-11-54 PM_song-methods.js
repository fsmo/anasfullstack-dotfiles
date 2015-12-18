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

Meteor.publish('stream', function(blob) {
  console.log(blob);
  HTTP.call( 'POST', 'http://localhost:8080/api/2.0/test-goldfish', blob, function( error, response ) {
    if ( error ) {
      console.log( error );
    } else {
      console.log( response );
    }
  });
  // console.log(serverBigBuffer);
});

Meteor.publish('stopStream', function() {
  console.log('finishedStream', serverFinalBuffer);
});
