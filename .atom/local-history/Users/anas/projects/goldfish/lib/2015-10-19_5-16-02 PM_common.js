AudioStore = new FS.Collection("Audio", {
  stores: [
    new FS.Store.FileSystem("Audio", {
      beforeWrite: function(fileObj) {
        fileObj.name("goldFish");
        // return {
        //   extension: 'wav',
        //   type: 'audio/wav'
        // };
      }
    })
  ]
});

AudioStreamStore = new FS.Collection("AudioStream", {
  stores: [
    new FS.Store.FileSystem("AudioStream", {

      transformWrite: function(fileObj, readStream, writeStream) {

        HTTP.call('POST', 'http://localhost:8080/api/2.0/test-goldfish', {
          data:  readStream
        }, function(error, response) {
          if (error) {
            console.log(error);
          } else {
            console.log(response);
          }
        });
        // readStream.pipe(writeStream);
      }



      
      // beforeWrite: function(fileObj) {
      //   console.log(fileObj);
      //   HTTP.call('POST', 'http://localhost:8080/api/2.0/test-goldfish', {
      //     data:  fileObj
      //   }, function(error, response) {
      //     if (error) {
      //       console.log(error);
      //     } else {
      //       console.log(response);
      //     }
      //   });
      // }
    })
  ]
});
