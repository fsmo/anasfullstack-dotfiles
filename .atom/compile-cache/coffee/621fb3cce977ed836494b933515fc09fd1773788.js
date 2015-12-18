(function() {
  var $, AskStackResultView, EditorView, WorkspaceView, _ref;

  _ref = require('atom'), $ = _ref.$, EditorView = _ref.EditorView, WorkspaceView = _ref.WorkspaceView;

  AskStackResultView = require('../lib/ask-stack-result-view');

  describe("AskStackResultView", function() {
    var resultView;
    resultView = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return resultView = new AskStackResultView();
    });
    describe("when search returns no result", function() {
      return it("displays a proper messaged is displayed", function() {
        var json;
        json = require('./data/no_matches.json');
        resultView.renderAnswers(json, false);
        return runs(function() {
          var text;
          text = resultView.text();
          return expect(text).toBe("Your search returned no matches.");
        });
      });
    });
    return describe("when search returns a list of results", function() {
      return it("only shows a maximum of 5 results", function() {
        var json;
        json = require('./data/data.json');
        resultView.renderAnswers(json, false);
        return runs(function() {
          var results;
          results = resultView.find("#results-view").children().length;
          return expect(results).toBe(5);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXNrLXN0YWNrL3NwZWMvYXNrLXN0YWNrLXJlc3VsdC12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNEQUFBOztBQUFBLEVBQUEsT0FBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQyxTQUFBLENBQUQsRUFBSSxrQkFBQSxVQUFKLEVBQWdCLHFCQUFBLGFBQWhCLENBQUE7O0FBQUEsRUFFQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsOEJBQVIsQ0FGckIsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBLEdBQUE7QUFDN0IsUUFBQSxVQUFBO0FBQUEsSUFBQSxVQUFBLEdBQWEsSUFBYixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFJLENBQUMsYUFBTCxHQUFxQixHQUFBLENBQUEsYUFBckIsQ0FBQTthQUVBLFVBQUEsR0FBaUIsSUFBQSxrQkFBQSxDQUFBLEVBSFI7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBT0EsUUFBQSxDQUFTLCtCQUFULEVBQTBDLFNBQUEsR0FBQTthQUN4QyxFQUFBLENBQUcseUNBQUgsRUFBOEMsU0FBQSxHQUFBO0FBQzVDLFlBQUEsSUFBQTtBQUFBLFFBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSx3QkFBUixDQUFQLENBQUE7QUFBQSxRQUVBLFVBQVUsQ0FBQyxhQUFYLENBQXlCLElBQXpCLEVBQStCLEtBQS9CLENBRkEsQ0FBQTtlQUlBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxjQUFBLElBQUE7QUFBQSxVQUFBLElBQUEsR0FBTyxVQUFVLENBQUMsSUFBWCxDQUFBLENBQVAsQ0FBQTtpQkFDQSxNQUFBLENBQU8sSUFBUCxDQUFZLENBQUMsSUFBYixDQUFrQixrQ0FBbEIsRUFGRztRQUFBLENBQUwsRUFMNEM7TUFBQSxDQUE5QyxFQUR3QztJQUFBLENBQTFDLENBUEEsQ0FBQTtXQWlCQSxRQUFBLENBQVMsdUNBQVQsRUFBa0QsU0FBQSxHQUFBO2FBQ2hELEVBQUEsQ0FBRyxtQ0FBSCxFQUF3QyxTQUFBLEdBQUE7QUFDdEMsWUFBQSxJQUFBO0FBQUEsUUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGtCQUFSLENBQVAsQ0FBQTtBQUFBLFFBRUEsVUFBVSxDQUFDLGFBQVgsQ0FBeUIsSUFBekIsRUFBK0IsS0FBL0IsQ0FGQSxDQUFBO2VBSUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGNBQUEsT0FBQTtBQUFBLFVBQUEsT0FBQSxHQUFVLFVBQVUsQ0FBQyxJQUFYLENBQWdCLGVBQWhCLENBQWdDLENBQUMsUUFBakMsQ0FBQSxDQUEyQyxDQUFDLE1BQXRELENBQUE7aUJBQ0EsTUFBQSxDQUFPLE9BQVAsQ0FBZSxDQUFDLElBQWhCLENBQXFCLENBQXJCLEVBRkc7UUFBQSxDQUFMLEVBTHNDO01BQUEsQ0FBeEMsRUFEZ0Q7SUFBQSxDQUFsRCxFQWxCNkI7RUFBQSxDQUEvQixDQUpBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/anas/.atom/packages/ask-stack/spec/ask-stack-result-view-spec.coffee
