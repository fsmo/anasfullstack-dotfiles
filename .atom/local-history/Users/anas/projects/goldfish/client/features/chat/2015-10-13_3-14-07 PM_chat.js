console.log('hello!');
Session.setDefault('username', 'guest-' + Random.id());

App.controller('ChatMessagesCtrl', ['$scope', '$meteor',
  function($scope, $meteor) {
    $scope.newMessageText = '';

    $scope.newMessage = {
      text: ''
    };

    $scope.chat_messages = $meteor.collection(function() {
      return Messages.find({}, { sort: { createdAt: -1 }});
    });

    $scope.sendMessage = function (newTask) {
      var text = $scope.newMessage.text;

      if(!text) {
        return;
      }

      $scope.chat_messages.push({
        username: Session.get('username'),
        message: text,
        createdAt: new Date()
      });

      $scope.newMessage.text = '';
    };
  }
]);
