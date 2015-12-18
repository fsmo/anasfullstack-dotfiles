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
            window.resolveLocalFileSystemURL(window.URL.createObjectURL(stream), function(fileEntry) {
              fileEntry.file(function(file) {
                console.log(file);
                // AudioStore.insert(file, function(err, fileObj) {
                //   return ('Inserted Successfully');
                // });
              });
            }, function(err) {
              console.error('err', err);
            });
          })
      }, 500);
    };
  }
]);
