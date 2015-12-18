App.controller('recordStreamCtrl', ['$scope', 'webRecorderService', '$meteor',
  function($scope, webRecorderService, $meteor){
    function gotAudio(stream) {

      peerConnection.addStream(stream);
    }
    navigator.getUserMedia('audio', gotAudio);
     var streamRecorder;



  }]);
