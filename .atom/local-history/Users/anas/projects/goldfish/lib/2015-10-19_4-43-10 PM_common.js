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

AudioStreamStore = new FS.Collection("AudioStream",{
    Stores:[
        new Fs.Store.FileSystem("AudioStream",{
            beforeWrite: function(fileObj) {
                HTTP.call( 'POST', 'http://localhost:8080/api/2.0/test-goldfish', {
          data: {
            stream: fileObj
          }
        }, function( error, response ) {
          if ( error ) {
            console.log( error );
          } else {
            console.log( response );
          }
        });
         }
        })
    ]
});
