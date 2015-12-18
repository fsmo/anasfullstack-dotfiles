(function() {
  var AskStackView;

  AskStackView = require('./ask-stack-view');

  module.exports = {
    config: {
      autoDetectLanguage: true
    },
    askStackView: null,
    activate: function(state) {
      return this.askStackView = new AskStackView(state.askStackViewState);
    },
    deactivate: function() {
      return this.askStackView.destroy();
    },
    serialize: function() {
      return {
        askStackViewState: this.askStackView.serialize()
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXNrLXN0YWNrL2xpYi9hc2stc3RhY2suY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFlBQUE7O0FBQUEsRUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGtCQUFSLENBQWYsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsa0JBQUEsRUFBb0IsSUFBcEI7S0FERjtBQUFBLElBRUEsWUFBQSxFQUFjLElBRmQ7QUFBQSxJQUlBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxZQUFELEdBQW9CLElBQUEsWUFBQSxDQUFhLEtBQUssQ0FBQyxpQkFBbkIsRUFEWjtJQUFBLENBSlY7QUFBQSxJQU9BLFVBQUEsRUFBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBQSxFQURVO0lBQUEsQ0FQWjtBQUFBLElBVUEsU0FBQSxFQUFXLFNBQUEsR0FBQTthQUNUO0FBQUEsUUFBQSxpQkFBQSxFQUFtQixJQUFDLENBQUEsWUFBWSxDQUFDLFNBQWQsQ0FBQSxDQUFuQjtRQURTO0lBQUEsQ0FWWDtHQUhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/anas/.atom/packages/ask-stack/lib/ask-stack.coffee
