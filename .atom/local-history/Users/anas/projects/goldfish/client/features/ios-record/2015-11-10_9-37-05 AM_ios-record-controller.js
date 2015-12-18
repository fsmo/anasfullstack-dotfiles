App.controller("iosrecordCtrl", ["$scope", "webRecorderService",
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

    window.addEventListener("load", function () {
      console.log("iOSRTCApp >>> DOM loaded");
      document.addEventListener("deviceready", function () {
        console.log("iOSRTCApp >>> deviceready event");
        // if iOS devices
        if (window.device.platform === "iOS") {
          cordova.plugins.iosrtc.debug.enable("*");
          // Pollute global namespace with WebRTC stuff.
          cordova.plugins.iosrtc.registerGlobals();
          window.addEventListener("orientationchange", function () {
            console.log("iOSRTCApp >>> orientationchange event");
            updateVideos();
          });
          window.updateVideos = function () {
            console.debug("iOSRTCApp >>> update iosrtc videos");
            // NOTE: hack, but needed due to CSS transitions and so on.
            [0, 500, 1000, 1500].forEach(function (delay) {
              setTimeout(function () {
                cordova.plugins.iosrtc.refreshVideos();
              }, delay);
            });
          };
        }
        // Non iOS devices.
        else {
          window.updateVideos = function () {};
        }
    $scope.record = function(){

    }
}])
