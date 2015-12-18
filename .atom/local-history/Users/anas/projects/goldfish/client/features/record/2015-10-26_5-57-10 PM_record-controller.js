App.controller('recordCtrl', ['$scope', 'webRecorderService',
  function($scope, webRecorderService){

    $scope.isRecording = false;
    $scope.showAnalysis = false;
    $scope.isMobile = false;

    if(!Meteor.isCordova){webRecorderService.initAudio();}

    function toggleRecordingStatus(){
      $scope.isRecording = !$scope.isRecording;
    }

    function cordovaRecordAndUpload() {
      var pc = new cordova.plugins.iosrtc.RTCPeerConnection({
        iceServers: []
      });

      cordova.plugins.iosrtc.getUserMedia(
        // constraints
        {
          audio: true,
          video: false
        },
        // success callback
        function(stream) {
          console.log('got local MediaStream: ', stream);

          pc.addStream(stream);
        },
        // failure callback
        function(error) {
          console.error('getUserMedia failed: ', error);
        }
      );
    }
    // function cordovaRecordAndUpload(){
    //   return navigator.device.capture.captureAudio(
    //     function(media) {
    //       window.resolveLocalFileSystemURI(media[0].localURL, function(fileEntry) {
    //         fileEntry.file(function(file) {
    //           AudioStore.insert(file, function(err, fileObj) {
    //             return ('Inserted Successfully');
    //           });
    //         });
    //       }, function(err) {
    //         console.error('err', err);
    //       });
    //     },
    //     function(err) {
    //       return alert(err);
    //     }
    //   );
    // }

    $scope.uploadAudio = function(){
      var record = webRecorderService.blob;
      AudioStore.insert(record,function(err,file){
        console.log('file: ', file);
      });
    };

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
