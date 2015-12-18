App.controller('recordCtrl', ['$scope', 'webRecorderService',
  function ($scope, webRecorderService) {

    var recordSession;
    $scope.isRecording  = false;
    $scope.showAnalysis = false;
    $scope.isMobile     = false;
    $scope.timerRunning = false;

    function setUniqueSession() {
      var recordSession = Random.id();
      Session.set('goldfishRecordSession', recordSession);
      return recordSession;
    }

    function toggleRecordingStatus() {
      $scope.isRecording = !$scope.isRecording;
    }

    $scope.uploadAudio = function () {
      var record = webRecorderService.blob;
      AudioStore.insert(record, function (err, file) {
        console.log('file: ', file);
      });
    };

    $scope.startTimer = function (){
      $scope.$broadcast('timer-start');
      $scope.timerRunning = true;
    };

    $scope.stopTimer = function (){
      $scope.$broadcast('timer-stop');
      $scope.timerRunning = false;
    };

    $scope.record = function () {
        if (!$scope.isRecording) {
          recordSession       = setUniqueSession();
          
          webRecorderService.startRecording(recordSession);
          console.log('startRecording  ', recordSession);
          
          toggleRecordingStatus();
          $scope.startTimer();
          $scope.showAnalysis = false;
          
        } else {
          webRecorderService.stopRecording(recordSession);
          console.log('stopRecording  ', recordSession);
          
          toggleRecordingStatus();
          $scope.stopTimer();
          
          $scope.showAnalysis  = true;
          window.location.href = '#/melody';
        }
    };

  }]);
