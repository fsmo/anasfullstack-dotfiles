App = angular.module('goldfish', ['angular-meteor', 'ui.router','ngMaterial', 'ngTouch', 'timer']);
App.config(['$stateProvider', '$urlRouterProvider', '$mdIconProvider', '$mdThemingProvider',
  function ($stateProvider, $urlRouterProvider, $mdIconProvider, $mdThemingProvider) {
    //
    // For any unmatched url, redirect to /main
    $urlRouterProvider.otherwise("/");
    //
    // Now set up the states
    $stateProvider
      .state('main', {
        url        : '/',
        templateUrl: 'client/features/record/record.ng.html',
        controller : 'recordCtrl'
      })
      .state('melody', {
        url        : '/melody',
        templateUrl: 'client/features/layout/layout.ng.html',
        controller : 'layoutCtrl'
      })
      .state('jsaudio', {
        url        : "/jsaudio",
        templateUrl: 'client/features/jsaudio/jsaudio.ng.html'
      });

    $mdIconProvider
      .iconSet("av", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-av.svg")
      .iconSet("social", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-social.svg")
      .iconSet("action", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg")
      .iconSet("communication", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-communication.svg")
      .iconSet("content", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-content.svg")
      .iconSet("toggle", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-toggle.svg")
      .iconSet("navigation", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-navigation.svg")
      .iconSet("image", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-image.svg")
      .iconSet("file", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-file.svg");

    $mdThemingProvider.theme('default')
      .primaryPalette('deep-orange', {
        'default': '500',
        'hue-1'  : '100', // use shade 100 for the <code>md-hue-1</code> class
        'hue-2'  : '600', // use shade 600 for the <code>md-hue-2</code> class
        'hue-3'  : 'A100' // use shade A100 for the <code>md-hue-3</code> class
      })
      .accentPalette('light-blue', {
        'default': '500',
        'hue-1'  : '100', // use shade 100 for the <code>md-hue-1</code> class
        'hue-2'  : '600', // use shade 600 for the <code>md-hue-2</code> class
        'hue-3'  : 'A100' // use shade A100 for the <code>md-hue-3</code> class
      });
  }
]);
