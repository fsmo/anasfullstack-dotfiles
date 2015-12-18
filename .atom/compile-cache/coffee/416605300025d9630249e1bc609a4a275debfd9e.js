(function() {
  var AskStackView, WorkspaceView;

  AskStackView = require('../lib/ask-stack-view');

  WorkspaceView = require('atom').WorkspaceView;

  describe("AskStackView", function() {
    var askStackView;
    askStackView = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return askStackView = new AskStackView();
    });
    return describe("when the panel is presented", function() {
      return it("displays all the components", function() {
        askStackView.presentPanel();
        return runs(function() {
          expect(askStackView.questionField).toExist();
          expect(askStackView.tagsField).toExist();
          expect(askStackView.sortByVote).toExist();
          return expect(askStackView.askButton).toExist();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXNrLXN0YWNrL3NwZWMvYXNrLXN0YWNrLXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkJBQUE7O0FBQUEsRUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHVCQUFSLENBQWYsQ0FBQTs7QUFBQSxFQUNDLGdCQUFpQixPQUFBLENBQVEsTUFBUixFQUFqQixhQURELENBQUE7O0FBQUEsRUFHQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsUUFBQSxZQUFBO0FBQUEsSUFBQSxZQUFBLEdBQWUsSUFBZixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFJLENBQUMsYUFBTCxHQUFxQixHQUFBLENBQUEsYUFBckIsQ0FBQTthQUVBLFlBQUEsR0FBbUIsSUFBQSxZQUFBLENBQUEsRUFIVjtJQUFBLENBQVgsQ0FGQSxDQUFBO1dBT0EsUUFBQSxDQUFTLDZCQUFULEVBQXdDLFNBQUEsR0FBQTthQUN0QyxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLFFBQUEsWUFBWSxDQUFDLFlBQWIsQ0FBQSxDQUFBLENBQUE7ZUFFQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsVUFBQSxNQUFBLENBQU8sWUFBWSxDQUFDLGFBQXBCLENBQWtDLENBQUMsT0FBbkMsQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUNBLE1BQUEsQ0FBTyxZQUFZLENBQUMsU0FBcEIsQ0FBOEIsQ0FBQyxPQUEvQixDQUFBLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBQSxDQUFPLFlBQVksQ0FBQyxVQUFwQixDQUErQixDQUFDLE9BQWhDLENBQUEsQ0FGQSxDQUFBO2lCQUdBLE1BQUEsQ0FBTyxZQUFZLENBQUMsU0FBcEIsQ0FBOEIsQ0FBQyxPQUEvQixDQUFBLEVBSkc7UUFBQSxDQUFMLEVBSGdDO01BQUEsQ0FBbEMsRUFEc0M7SUFBQSxDQUF4QyxFQVJ1QjtFQUFBLENBQXpCLENBSEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/anas/.atom/packages/ask-stack/spec/ask-stack-view-spec.coffee
