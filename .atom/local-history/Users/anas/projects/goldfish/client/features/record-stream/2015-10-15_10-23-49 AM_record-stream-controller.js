App.controller('recordStreamCtrl', ['$scope', 'webRecorderService', '$meteor',
  function($scope, webRecorderService, $meteor){

    navigator.getUserMedia('audio', gotAudio);
     var streamRecorder;
     function gotAudio(stream) {

       peerConnection.addStream(stream);
     }


  }]);
