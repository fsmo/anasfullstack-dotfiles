App.controller("iosrecordCtrl", ["$scope", "webRecorderService",
  function ($scope, webRecorderService) {

    window.addEventListener("load", function () {
      console.log("iOSRTCApp >>> DOM loaded");
      document.addEventListener("deviceready", function () {
        console.log("iOSRTCApp >>> deviceready event");
        // if iOS devices
        if (window.device.platform === "iOS") {
          // Pollute global namespace with WebRTC stuff.
          cordova.plugins.iosrtc.registerGlobals();
          window.addEventListener("orientationchange", function () {
            console.log("iOSRTCApp >>> orientationchange event");
            updateVideos();
          });
        }
        // Non iOS devices.
        else {
          window.updateVideos = function () {};
        }
      });
    });
    $scope.record = function() {
      navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
      if (!navigator.cancelAnimationFrame) navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
      if (!navigator.requestAnimationFrame) navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;
      navigator.getUserMedia({
          "audio": {
            "mandatory": {
              "googEchoCancellation": "false",
              "googAutoGainControl": "false",
              "googNoiseSuppression": "false",
              "googHighpassFilter": "false"
            },
            "optional": []
          },
        },
        function(stream) {
          console.log(stream);
        })
    };
    }
}])
