
Meteor.startup(function () {

  var BinaryServer = Meteor.npmRequire('binaryjs').BinaryServer;
    var fs = Meteor.npmRequire('fs');
    var server = BinaryServer({port: 9000});

    server.on('connection', function(client){
      var audioFile = fs.createWriteStream('Sweden_Stockholm.jpg');
      client.send(file);
    });

  if (Meteor.users.find().count() === 0) {
    Accounts.createUser({
      username: 'admin',
      password: '123456',
      profile: {
        firstName: 'the amazing',
        lastName: 'bla bla'
      }
    });
  }

});
