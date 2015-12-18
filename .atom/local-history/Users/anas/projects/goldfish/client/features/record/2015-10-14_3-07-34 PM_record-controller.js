App.controller('recordCtrl', ['$scope', 'webRecorderService', '$meteor',
  function($scope, webRecorderService, $meteor){

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
            var buffer = webRecorderService.realAudioInput;
            Meteor.subscribe("getAudioStream", buffer);
            getAudioStream(buffer);
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
