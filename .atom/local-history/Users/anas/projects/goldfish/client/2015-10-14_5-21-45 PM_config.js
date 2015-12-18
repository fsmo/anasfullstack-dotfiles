App.config(['$stateProvider', '$urlRouterProvider', '$mdIconProvider', '$mdThemingProvider',
  function($stateProvider, $urlRouterProvider, $mdIconProvider, $mdThemingProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/");
    //
    // Now set up the states
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'client/features/layout/layout.ng.html',
        controller: 'LayoutCtrl'
      })
      .state('main.edit', {
        url: 'edit',
        templateUrl: 'client/features/layout/layout-edit.ng.html'
      })
      .state('main.record', {
        url: 'record',
        templateUrl: 'client/features/record/record.ng.html',
        controller: 'recordCtrl'
      })
      .state('main.recordStream', {
        url: 'recordStream',
        templateUrl: 'client/features/record/record-stream.ng.html',
        controller: 'recordCtrl'
      })
      .state('state1', {
        url: "chat",
        templateUrl: 'client/features/chat/chat.ng.html',
        controller: 'ChatMessagesCtrl'
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
      .primaryPalette('blue')
      .accentPalette('orange');
  }
]);
