App.controller('recordCtrl', ['$scope', 'webRecorderService', '$meteor',
  function($scope, webRecorderService, $meteor){

    $scope.isRecording = false;
    // $scope.isStreaming = false;
    $scope.showAnalysis = false;
    $scope.isMobile = false;

    if(!Meteor.isCordova){webRecorderService.initAudio();}

    function toggleRecordingStatus(){
      $scope.isRecording = !$scope.isRecording;
    }
    function toggleStreamingStatus(){
      $scope.isStreaming = !$scope.isStreaming;
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
    
    $scope.uploadAudioToNodeServer = function(){
      var record = webRecorderService.blob;
      
      AudioStreamStore.insert(record,function(err,file){
        console.log('file: ', file);
      });
    };

    // $scope.stream = function(){
    //   if(!$scope.isStreaming){
    //         webRecorderService.startStreaming();
    //         toggleStreamingStatus();
    //         $scope.showAnalysis = false;
    //       }else{
    //         webRecorderService.stopStreaming();
    //         toggleStreamingStatus();
    //         $scope.showAnalysis = true;
    //       }
    //   webRecorderService.startStreaming();
    // };

    $scope.record = function(){
      if(Meteor.isCordova){
        $scope.isMobile = true;
          cordovaRecordAndUpload();
      }else{
          if(!$scope.isRecording){
            webRecorderService.startRecording();
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
