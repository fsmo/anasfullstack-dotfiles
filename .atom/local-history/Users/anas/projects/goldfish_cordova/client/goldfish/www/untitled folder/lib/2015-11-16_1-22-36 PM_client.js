
if(Meteor.isClient) {
  

  var onReady = function onReady() {
    angular.bootstrap(document, ['goldfish']);
  };

  if (Meteor.isCordova)
    angular.element(document).on('deviceready', onReady);
  else
    angular.element(document).ready(onReady);
}
