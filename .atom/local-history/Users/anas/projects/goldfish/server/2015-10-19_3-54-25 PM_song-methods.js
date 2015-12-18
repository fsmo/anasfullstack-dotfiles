Meteor.methods({
  saveAudio: function(mediaObj) {
    Audio.insert(mediaObj, function(err, fileObj) {
      return fileObj;
    });
  },
  deleteAudio: function(AudioId) {
    Audio.remove(AudioId);
  },
  uploadFile: function(stream) {
    HTTP.call('POST', 'http://localhost:8080/api/2.0/test-goldfish', {
      data: {
        stream: stream
      }
    }, function(error, response) {
      if (error) {
        console.log(error);
      } else {
        console.log(response);
      }
    });
    // console.log(serverBigBuffer);
  }
});

Meteor.publish('uploadFile', function(stream) {
  HTTP.call( 'POST', 'http://localhost:8080/api/2.0/test-goldfish', {
    data: {
      stream: stream
    }
  }, function( error, response ) {
    if ( error ) {
      console.log( error );
    } else {
      console.log( response );
    }
  });
  // console.log(serverBigBuffer);
});

Meteor.publish('stopStream', function() {
  console.log('finishedStream');
});
