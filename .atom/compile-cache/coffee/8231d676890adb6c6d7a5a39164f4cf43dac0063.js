(function() {
  var Config;

  Config = require('./config');

  module.exports = {
    activate: function() {
      return this.addListeners();
    },
    enableTemp: function(pane) {
      return pane.promptToSaveItem = function(item) {
        var save;
        save = pane.promptToSaveItem2(item);
        pane.promptToSaveItem = function(item) {
          return true;
        };
        return save;
      };
    },
    addListeners: function() {
      Config.observe('skipSavePrompt', function(val) {
        return atom.workspace.getPanes().map(function(pane) {
          if (val) {
            return pane.promptToSaveItem = function(item) {
              return true;
            };
          } else if (pane.promptToSaveItem2) {
            return pane.promptToSaveItem = function(item) {
              return pane.promptToSaveItem2(item);
            };
          }
        });
      });
      return atom.workspace.observePanes((function(_this) {
        return function(pane) {
          pane.promptToSaveItem2 = pane.promptToSaveItem;
          if (Config.skipSavePrompt()) {
            pane.promptToSaveItem = function(item) {
              return true;
            };
          }
          return pane.onWillDestroyItem(function(event) {
            if (Config.skipSavePrompt()) {
              return _this.enableTemp(pane);
            } else {
              return pane.promptToSaveItem = function(item) {
                return pane.promptToSaveItem2(item);
              };
            }
          });
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvc2F2ZS1zZXNzaW9uL2xpYi9zYXZlLXByb21wdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsTUFBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFULENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLFlBQUQsQ0FBQSxFQURRO0lBQUEsQ0FBVjtBQUFBLElBR0EsVUFBQSxFQUFZLFNBQUMsSUFBRCxHQUFBO2FBQ1YsSUFBSSxDQUFDLGdCQUFMLEdBQXdCLFNBQUMsSUFBRCxHQUFBO0FBQ3RCLFlBQUEsSUFBQTtBQUFBLFFBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxpQkFBTCxDQUF1QixJQUF2QixDQUFQLENBQUE7QUFBQSxRQUNBLElBQUksQ0FBQyxnQkFBTCxHQUF3QixTQUFDLElBQUQsR0FBQTtpQkFDdEIsS0FEc0I7UUFBQSxDQUR4QixDQUFBO2VBR0EsS0FKc0I7TUFBQSxFQURkO0lBQUEsQ0FIWjtBQUFBLElBVUEsWUFBQSxFQUFjLFNBQUEsR0FBQTtBQUVaLE1BQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxnQkFBZixFQUFpQyxTQUFDLEdBQUQsR0FBQTtlQUMvQixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQWYsQ0FBQSxDQUF5QixDQUFDLEdBQTFCLENBQThCLFNBQUMsSUFBRCxHQUFBO0FBQzVCLFVBQUEsSUFBRyxHQUFIO21CQUNFLElBQUksQ0FBQyxnQkFBTCxHQUF3QixTQUFDLElBQUQsR0FBQTtxQkFDdEIsS0FEc0I7WUFBQSxFQUQxQjtXQUFBLE1BR0ssSUFBRyxJQUFJLENBQUMsaUJBQVI7bUJBQ0gsSUFBSSxDQUFDLGdCQUFMLEdBQXdCLFNBQUMsSUFBRCxHQUFBO3FCQUN0QixJQUFJLENBQUMsaUJBQUwsQ0FBdUIsSUFBdkIsRUFEc0I7WUFBQSxFQURyQjtXQUp1QjtRQUFBLENBQTlCLEVBRCtCO01BQUEsQ0FBakMsQ0FBQSxDQUFBO2FBVUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFmLENBQTRCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtBQUMxQixVQUFBLElBQUksQ0FBQyxpQkFBTCxHQUF5QixJQUFJLENBQUMsZ0JBQTlCLENBQUE7QUFFQSxVQUFBLElBQUcsTUFBTSxDQUFDLGNBQVAsQ0FBQSxDQUFIO0FBQ0UsWUFBQSxJQUFJLENBQUMsZ0JBQUwsR0FBd0IsU0FBQyxJQUFELEdBQUE7cUJBQ3RCLEtBRHNCO1lBQUEsQ0FBeEIsQ0FERjtXQUZBO2lCQU1BLElBQUksQ0FBQyxpQkFBTCxDQUF1QixTQUFDLEtBQUQsR0FBQTtBQUNyQixZQUFBLElBQUcsTUFBTSxDQUFDLGNBQVAsQ0FBQSxDQUFIO3FCQUNFLEtBQUMsQ0FBQSxVQUFELENBQVksSUFBWixFQURGO2FBQUEsTUFBQTtxQkFHRSxJQUFJLENBQUMsZ0JBQUwsR0FBd0IsU0FBQyxJQUFELEdBQUE7dUJBQ3RCLElBQUksQ0FBQyxpQkFBTCxDQUF1QixJQUF2QixFQURzQjtjQUFBLEVBSDFCO2FBRHFCO1VBQUEsQ0FBdkIsRUFQMEI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1QixFQVpZO0lBQUEsQ0FWZDtHQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/anas/.atom/packages/save-session/lib/save-prompt.coffee
