angular.module('goldfish').controller('streamCtrl',['$scope', function($scope){

  navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  if (navigator.getUserMedia) {
   console.log('getUserMedia supported.');
   navigator.getUserMedia (
      // constraints - only audio needed for this app
      {
         audio: true
      },

      // Success callback
      function(stream) {
        var mediaRecorder = new MediaRecorder(stream);
        $scope.record = function() {
          mediaRecorder.start(1000);
          console.log(mediaRecorder.state);
          console.log("recorder started");
        };
        $scope.stop = function() {
          mediaRecorder.stop();
          console.log(mediaRecorder.state);
          console.log("recorder stopped");
        };
        mediaRecorder.ondataavailable = function(e) {
          console.log("data available");
        };

      },

      // Error callback
      function(err) {
         console.log('The following gUM error occured: ' + err);
      }
   );
} else {
   console.log('getUserMedia not supported on your browser!');
}
}]);
