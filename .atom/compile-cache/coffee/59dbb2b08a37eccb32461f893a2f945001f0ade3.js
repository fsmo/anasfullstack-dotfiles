(function() {
  var $, AskStack, EditorView, WorkspaceView, _ref;

  _ref = require('atom'), $ = _ref.$, EditorView = _ref.EditorView, WorkspaceView = _ref.WorkspaceView;

  AskStack = require('../lib/ask-stack');

  describe("AskStack", function() {
    var activationPromise;
    activationPromise = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return activationPromise = atom.packages.activatePackage('ask-stack');
    });
    return describe("when the ask-stack:ask-question event is triggered", function() {
      return it("attaches the view", function() {
        expect(atom.workspaceView.find('.ask-stack')).not.toExist();
        atom.workspaceView.trigger('ask-stack:ask-question');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          return expect(atom.workspaceView.find('.ask-stack')).toExist();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXNrLXN0YWNrL3NwZWMvYXNrLXN0YWNrLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRDQUFBOztBQUFBLEVBQUEsT0FBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQyxTQUFBLENBQUQsRUFBSSxrQkFBQSxVQUFKLEVBQWdCLHFCQUFBLGFBQWhCLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGtCQUFSLENBRlgsQ0FBQTs7QUFBQSxFQVNBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUNuQixRQUFBLGlCQUFBO0FBQUEsSUFBQSxpQkFBQSxHQUFvQixJQUFwQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFJLENBQUMsYUFBTCxHQUFxQixHQUFBLENBQUEsYUFBckIsQ0FBQTthQUNBLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixXQUE5QixFQUZYO0lBQUEsQ0FBWCxDQUZBLENBQUE7V0FNQSxRQUFBLENBQVMsb0RBQVQsRUFBK0QsU0FBQSxHQUFBO2FBQzdELEVBQUEsQ0FBRyxtQkFBSCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsUUFBQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFuQixDQUF3QixZQUF4QixDQUFQLENBQTZDLENBQUMsR0FBRyxDQUFDLE9BQWxELENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFJQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLHdCQUEzQixDQUpBLENBQUE7QUFBQSxRQU1BLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLGtCQURjO1FBQUEsQ0FBaEIsQ0FOQSxDQUFBO2VBU0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtpQkFDSCxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFuQixDQUF3QixZQUF4QixDQUFQLENBQTZDLENBQUMsT0FBOUMsQ0FBQSxFQURHO1FBQUEsQ0FBTCxFQVZzQjtNQUFBLENBQXhCLEVBRDZEO0lBQUEsQ0FBL0QsRUFQbUI7RUFBQSxDQUFyQixDQVRBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/anas/.atom/packages/ask-stack/spec/ask-stack-spec.coffee
