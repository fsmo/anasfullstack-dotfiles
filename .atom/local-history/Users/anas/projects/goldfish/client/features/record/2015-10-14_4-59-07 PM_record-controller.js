App.controller('recordCtrl', ['$scope', 'webRecorderService', '$meteor',
  function($scope, webRecorderService, $meteor){
    navigator.getUserMedia('audio', gotAudio);
    var streamRecorder;
    function gotAudio(stream) {
        var microphone = context.createMediaStreamSource(stream);
        var backgroundMusic = context.createMediaElementSource(document.getElementById("back"));
        var analyser = context.createAnalyser();
        var mixedOutput = context.createMediaStreamDestination();
        microphone.connect(analyser);
        analyser.connect(mixedOutput);
        backgroundMusic.connect(mixedOutput);
        requestAnimationFrame(drawAnimation);

        streamRecorder = mixedOutput.stream.record();
        peerConnection.addStream(mixedOutput.stream);
    }

    
    $scope.isRecording = false;
    $scope.showAnalysis = false;
    $scope.isMobile = false;

    if(!Meteor.isCordova){webRecorderService.initAudio();}

    function toggleRecordingStatus(){
      $scope.isRecording = !$scope.isRecording;
    }

    function cordovaRecordAndUpload(){
      return navigator.device.capture.captureAudio(
        function(media) {
          window.resolveLocalFileSystemURI(media[0].localURL, function(fileEntry) {
            fileEntry.file(function(file) {
              AudioStore.insert(file, function(err, fileObj) {
                console.log('fileObj: ', fileObj);
                return ("Inserted Successfully");
              });
            });
          }, function(err) {
            console.error('err', err);
          });
        },
        function(err) {
          return alert(err);
        }
      );
    }

    $scope.uploadAudio = function(){
      var record = webRecorderService.blob;
      AudioStore.insert(record,function(err,file){
        console.log('file: ', file);
      });
    };

    $scope.record = function(btn){
      if(Meteor.isCordova){
        $scope.isMobile = true;
          cordovaRecordAndUpload();
      }else{
          if(!$scope.isRecording){
            webRecorderService.startRecording();
            webRecorderService.getStreamBuffers();
            toggleRecordingStatus();
            $scope.showAnalysis = false;
          }else{
            webRecorderService.stopRecording();
            toggleRecordingStatus();
            $scope.showAnalysis = true;
          }
      }
    };
}]);
