var request             = Npm.require('request');
var stream              = Npm.require('stream');
var currentStream       = {};
var currentStreamChunks = {};

/*
currentStreamChunks: {
  someSessionId: {
    lastChunk: 3
    5: {          //  some advanced chunk number which came early!
      some buffer data or what ever in the chunk
    }
  },
    someAnotherSessionId: {
    lastChunk: 45
    60: {        //  some advanced chunk number which came early!
      some buffer data or what ever in the chunk
    }
  },,,,,,,,,,
}
*/


function fixRightChunks(data, session, chunkNumber){
  currentStreamChunks[session][chunkNumber] = data;
  var correctChunk = currentStreamChunks[session][currentStreamChunks[session]+1];

  if (correctChunk){
    currentStream[session].write(new Buffer(correctChunk));
    correctChunk = null;
  }
}

Meteor.methods({
  saveAudio: function(mediaObj){
    Audio.insert(mediaObj,function(err,fileObj){
      return fileObj;
    });
  },

  deleteAudio: function (AudioId) {
    Audio.remove(AudioId);
  },

  startStream: function(session) {
    currentStream[session] = new stream.PassThrough();
    currentStreamChunks[session] = 0;

    console.log('startStream', session);

    currentStream[session].pipe(request.post('http://localhost:8080/api/2.0/test-goldfish?' + session,
      function(error, response, body) {
        if (!error && response.statusCode === 200) {
          console.log(body);
        }
      }));
  },

  stream: function(data, session, chunkNumber) {
    if (chunkNumber - currentStreamChunks[session] === 1){

      console.log('stream', session,'data length: ', data.length, 'chunkNumber', chunkNumber);

      currentStream[session].write(new Buffer(data));
      currentStreamChunks[session] = chunkNumber;

    } else if(chunkNumber) {

      fixRightChunks(data, session, chunkNumber);

      console.warn('stream', session,'data length: ', data.length, 'wrong chunkNumber = ', chunkNumber);
      console.log('Got the wrong chunk first!!');
    }
  },

  endStream: function(session) {
    console.log('endStream', session);
    currentStream[session].end();
    currentStream[session].unpipe(request.post('http://localhost:8080/api/2.0/test-goldfish'));
  }
});
