Meteor.startup(function() {
  console.log('Client Started');
  Meteor.npmRequire('binaryjs');

  client = new BinaryClient('ws://localhost:9000');
  console.log(client);

  client.on('stream', function(stream, meta) {
    var parts = [];
    stream.on('data', function(data) {
      console.log(data);
      parts.push(data);
    });

    stream.on('end', function() {
      var img = document.createElement("img");
      img.src = (window.URL || window.webkitURL).createObjectURL(new Blob(parts));
      document.body.appendChild(img);
    }); // on end
  }); // on stream
}); // startup