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
            var url = URL.createObjectURL(stream);
            console.log('file Url', url);
            console.log(stream.getaudiot);
            // window.resolveLocalFileSystemURL(url, gotFile, fail);

            // function gotFile(file) {
            //   var reader = new FileReader();
            //   reader.onloadend = function(evt) {
            //     console.log('Read as data URL');
            //     console.log(evt);
            //     console.log(evt.target.result);
            //   };
            //   reader.readAsDataURL(file);
            // }

            // function fail(evt) {
            //   console.log('error', evt);
            //   console.log(evt.target.error.code);
            // }
          });
      }, 1000);
    };
  }
]);
