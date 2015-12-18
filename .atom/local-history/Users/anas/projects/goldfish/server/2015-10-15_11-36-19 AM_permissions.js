AudioStream.permissions.read(function(eventName) {
  return eventName == 'clientStreaming';
});

AudioStream.permissions.write(function(eventName) {
  return eventName == 'clientStreaming';
});
