App.controller('iosrecordCtrl', ['$scope', 'webRecorderService',
  function ($scope, webRecorderService) {
    $scope.record = function() {
      cordova.plugins.iosrtc.registerGlobals();
      navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
      if (!navigator.cancelAnimationFrame) navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
      if (!navigator.requestAnimationFrame) navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;
      navigator.getUserMedia({
          'audio': true
        },
        function(stream) {
          console.log(stream);
          var reader = new FileReader();
          reader.addEventListener("loadend", function() {
             // reader.result contains the contents of blob as a typed array
          });
          reader.readAsArrayBuffer(stream);
        })
    };
    }
]);
