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
      }
    )
    ]
});
