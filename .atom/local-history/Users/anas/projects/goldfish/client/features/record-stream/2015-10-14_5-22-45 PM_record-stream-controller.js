App.controller('recordStreamCtrl', ['$scope', 'webRecorderService', '$meteor',
  function($scope, webRecorderService, $meteor){
    navigator.getUserMedia('audio', gotAudio);
  var streamRecorder;
  function gotAudio(stream) {
    var worker = new Worker("visualizer.js");
    var processed = stream.createWorkerProcessor(worker);
    worker.onmessage = function(event) {
      drawSpectrumToCanvas(event.data, document.getElementById("c"));
    };
    streamRecorder = processed.record();
    peerConnection.addStream(processed);
  }
  }]);
