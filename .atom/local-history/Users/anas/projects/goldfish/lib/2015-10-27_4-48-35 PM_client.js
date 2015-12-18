
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
