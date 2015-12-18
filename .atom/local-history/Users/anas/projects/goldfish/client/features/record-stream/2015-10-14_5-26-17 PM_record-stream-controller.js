App.controller('recordStreamCtrl', ['$scope', 'webRecorderService', '$meteor',
  function($scope, webRecorderService, $meteor){
    navigator.getUserMedia('audio', gotAudio);
        function gotAudio(stream) {
            var microphone = context.createMediaStreamSource(stream);
            var filter = context.createBiquadFilter();
            var peer = context.createMediaStreamDestination();
            microphone.connect(filter);
            filter.connect(peer);
            peerConnection.addStream(peer.stream);
        }
  }]);
