App.controller('recordStreamCtrl', [function(){
    function gotAudio(stream) {

      peerConnection.addStream(stream);
    }
    navigator.getUserMedia('audio', gotAudio);
     var streamRecorder;



  }]);
