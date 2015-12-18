App.controller('iosrecordCtrl', ['$scope', 'webRecorderService',
  function($scope, webRecorderService) {
    $scope.record = function() {
      cordova.plugins.iosrtc.registerGlobals();
      navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
      if (!navigator.cancelAnimationFrame) navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
      if (!navigator.requestAnimationFrame) navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;
      setInterval(function() {
        navigator.getUserMedia({
            'audio': true
          },
          function(stream) {
            console.log(stream);
            console.log('blob', new Blob(stream));
            console.log('buffer', new Buffer(stream));
          })
      }, 500);

    };
  }
]);