function createSessionValue()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 16; i++ ){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
        
    return text;
}


if(Meteor.isClient) {
  App = angular.module('goldfish', ['angular-meteor', 'ui.router', 'ngMaterial', 'ngTouch']);

  var onReady = function onReady() {
    angular.bootstrap(document, ['goldfish']);
  };

  if (Meteor.isCordova)
    angular.element(document).on('deviceready', onReady);
  else
    angular.element(document).ready(onReady);
}
