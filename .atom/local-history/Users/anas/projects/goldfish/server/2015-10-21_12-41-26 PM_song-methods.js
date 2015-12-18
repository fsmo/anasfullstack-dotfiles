
var currentStream;
// var request = Meteor.npmRequire('request');
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
    console.log('startStream');
    // console.log(request);
    var fs = Npm.require('fs');
    // currentStream = fs.createWriteStream('/tmp/test-file.txt');

    currentStream = new stream.PassThrough();

    currentStream.pipe(request.post('http://localhost:8080/api/2.0/test-goldfish',function (error, response, body) {
      // console.log('something happened!', error, response, body);
      if (!error && response.statusCode == 200) {
        console.log(body); // Show the HTML for the Google homepage.
      }
    }));
  },

  stream: function(data) {
    console.log('stream', data);
    currentStream.write(data);
    // currentStream.write(JSON.stringify(data));
  },

  endStream: function() {
    console.log('endStream');
    currentStream.end();
  }
});

Meteor.publish('startStream', function(stream) {

});

Meteor.publish('stream', function(stream) {
  HTTP.call( 'POST', 'http://localhost:8080/api/2.0/test-goldfish', {
    data:  stream
  }, function( error, response ) {
    if ( error ) {
      console.log( error );
    } else {
      console.log( response );
    }
  });
});

Meteor.publish('stopStream', function() {
  console.log('finishedStream');
});
