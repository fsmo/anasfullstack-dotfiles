AudioStream.permissions.read(function(eventName) {
  return eventName == 'chat';
});

AudioStream.permissions.write(function(eventName) {
  return eventName == 'chat';
});
