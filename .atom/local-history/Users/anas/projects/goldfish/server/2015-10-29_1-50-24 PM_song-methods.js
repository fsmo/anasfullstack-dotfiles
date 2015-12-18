var request             = Npm.require('request');
var stream              = Npm.require('stream');
var crrStrm             = {};   // currentStream
var strmChnks        = {};  // currentStreamChunks

/*
currentStreamChunks: {  // strmChnks
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


function fixRightChunks(data, session, chnkNum){
  crrStrmChnks[session][chnkNum] = data;
  var correctChunk = crrStrmChnks[session][crrStrmChnks[session]['lastChunk']+1];

  if (correctChunk){
    crrStrm[session].write(new Buffer(correctChunk));
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
    crrStrm[session] = new stream.PassThrough();
    crrStrmChnks[session] = 0;

    console.log('startStream', session);

    crrStrm[session].pipe(request.post('http://localhost:8080/api/2.0/test-goldfish?' + session,
      function(error, response, body) {
        if (!error && response.statusCode === 200) {
          console.log(body);
        }
      }));
  },

  stream: function(data, session, chnkNum) {
    if (chnkNum - crrStrmChnks[session] === 1){

      console.log('stream', session,'data length: ', data.length, 'chunkNumber', chnkNum);

      crrStrm[session].write(new Buffer(data));
      crrStrmChnks[session] = chnkNum;

    } else if(chnkNum) {

      fixRightChunks(data, session, chnkNum);

      console.warn('stream', session,'data length: ', data.length, 'wrong chunkNumber = ', chnkNum);
      console.log('Got the wrong chunk first!!');
    }
  },

  endStream: function(session) {
    console.log('endStream', session);
    crrStrm[session].end();
    crrStrm[session].unpipe(request.post('http://localhost:8080/api/2.0/test-goldfish'));
  }
});
