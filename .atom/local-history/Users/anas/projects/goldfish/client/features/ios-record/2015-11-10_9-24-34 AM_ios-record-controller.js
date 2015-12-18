App.controller('recordCtrl', ['$scope', 'webRecorderService',
  function ($scope, webRecorderService) {
    setTimeout(function () {
          // Avoid iOS WebSocket crash:
          //   https://github.com/eface2face/cordova-plugin-iosrtc/issues/12
          // Also looad the original AppRTC JS scripts once Cordova is ready (so the iosrtc plugin
          // has polluted the window namespace with WebRTC class/functions).
          ["js/ios-websocket-hack.js", "js/apprtc.debug.js", "js/appwindow.js"].forEach(function (path) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = path;
            script.async = false;
            document.getElementsByTagName("head")[0].appendChild(script);
          });
        }, 1000);
    $scope.record = function(){
      
    }
}])
