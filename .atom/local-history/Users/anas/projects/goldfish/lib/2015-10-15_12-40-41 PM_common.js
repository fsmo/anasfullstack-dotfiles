AudioStore = new FS.Collection("Audio", {
    stores: [
      new FS.Store.GridFS("Audio", {
        beforeWrite: function(fileObj) {
          fileObj.name("goldFish");
          // return {
          //   extension: 'wav',
          //   type: 'audio/wav'
          // };
         }
      }
    )
    ]
});



AudioStream.on('clientStreaming', function(message) {
  console.log('userStreaming ', message);
});
