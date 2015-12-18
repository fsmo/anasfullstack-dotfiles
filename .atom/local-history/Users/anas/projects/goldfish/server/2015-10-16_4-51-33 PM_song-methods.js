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

// Meteor.publish('startStreaming')
// REQUEST();

Meteor.publish('stream', function(blob) {
//req.push(blob);

  console.log(blob);
  HTTP.call( 'POST', 'http://localhost:8080/api/2.0/test-goldfish', { data: blob }, function( error, response ) {
    if ( error ) {
      console.log( error );
    } else {
      // console.log( response );
    }
  });
  // console.log(serverBigBuffer);
});

Meteor.publish('stopStream', function() {
  // request.end()
  console.log('finishedStream');
});
