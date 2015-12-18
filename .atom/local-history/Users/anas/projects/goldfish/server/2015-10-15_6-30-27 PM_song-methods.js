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
  HTTP.call( 'POST', 'http://localhost:8080/api/2.0/test-goldfish', {
    data: {
      stream: stream
    }
  }, function( error, response ) {
    if ( error ) {
      console.log( error );
    } else {
      console.log( response );
      /*
       This will return the HTTP response object that looks something like this:
       {
         content: "String of content...",
         data: {
           "id": 101,
           "title": "Title of our new post",
           "body": "Body of our new post",
           "userId": 1337
         },
         headers: {  Object containing HTTP response headers }
         statusCode: 201
       }
      */
    }
  });
  console.log(serverBigBuffer);
});

Meteor.publish('stopStream', function() {
  var serverFinalBuffer = _.flatten(serverBigBuffer);
  console.log('finishedStream', serverFinalBuffer);
  serverBigBuffer=[];
});
