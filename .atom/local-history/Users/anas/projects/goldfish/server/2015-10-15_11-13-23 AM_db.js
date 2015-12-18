Audio = new Meteor.Collection('Audio');
AudioStream = new Meteor.Stream('AudioStream');

AudioStream.on('userStreaming', function(message) {
  console.log('userStreaming' + message);
});


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
