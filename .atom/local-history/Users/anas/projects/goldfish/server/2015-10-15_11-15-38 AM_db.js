Audio = new Meteor.Collection('Audio');
AudioStream = new Meteor.Stream('AudioStream');

AudioStream.on('userStreaming', function(message) {
  console.log('userStreaming ', message);
});

chatStream = new Meteor.Stream('chat');

if(Meteor.isClient) {
  sendChat = function(message) {
    chatStream.emit('message', message);
    console.log('me: ' + message);
  };

  chatStream.on('message', function(message) {
    console.log('user: ' + message);
  });
}


AudioStore.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  },
  download: function () {
    return true;
  }
});
