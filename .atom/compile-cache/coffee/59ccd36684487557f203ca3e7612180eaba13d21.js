(function() {
  var AtomSpotifyStatusBarView, WorkspaceView;

  AtomSpotifyStatusBarView = require('../lib/atom-spotify-status-bar-view');

  WorkspaceView = require('atom').WorkspaceView;

  describe("AtomSpotifyStatusBarView", function() {
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return waitsForPromise(function() {
        return atom.packages.activatePackage('atom-spotify');
      });
    });
    return describe("when rocking out", function() {
      return it("renders the current song's info", function() {
        return runs(function() {
          var statusBar;
          statusBar = atom.workspaceView.statusBar;
          return setTimeout((function(_this) {
            return function() {
              return expect(statusBar.find('a.atom-spotify-status').text()).toBe('');
            };
          })(this), 500);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXRvbS1zcG90aWZ5Mi9zcGVjL2F0b20tc3BvdGlmeS1zdGF0dXMtYmFyLXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUNBQUE7O0FBQUEsRUFBQSx3QkFBQSxHQUEyQixPQUFBLENBQVEscUNBQVIsQ0FBM0IsQ0FBQTs7QUFBQSxFQUNDLGdCQUFpQixPQUFBLENBQVEsTUFBUixFQUFqQixhQURELENBQUE7O0FBQUEsRUFHQSxRQUFBLENBQVMsMEJBQVQsRUFBcUMsU0FBQSxHQUFBO0FBQ25DLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBSSxDQUFDLGFBQUwsR0FBcUIsR0FBQSxDQUFBLGFBQXJCLENBQUE7YUFFQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixjQUE5QixFQURjO01BQUEsQ0FBaEIsRUFIUztJQUFBLENBQVgsQ0FBQSxDQUFBO1dBTUEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTthQUMzQixFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQSxHQUFBO2VBQ3BDLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxjQUFBLFNBQUE7QUFBQSxVQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQS9CLENBQUE7aUJBQ0EsVUFBQSxDQUFXLENBQUEsU0FBQSxLQUFBLEdBQUE7bUJBQUEsU0FBQSxHQUFBO3FCQUNULE1BQUEsQ0FBTyxTQUFTLENBQUMsSUFBVixDQUFlLHVCQUFmLENBQXVDLENBQUMsSUFBeEMsQ0FBQSxDQUFQLENBQXNELENBQUMsSUFBdkQsQ0FBNEQsRUFBNUQsRUFEUztZQUFBLEVBQUE7VUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVgsRUFFRSxHQUZGLEVBRkc7UUFBQSxDQUFMLEVBRG9DO01BQUEsQ0FBdEMsRUFEMkI7SUFBQSxDQUE3QixFQVBtQztFQUFBLENBQXJDLENBSEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/anas/.atom/packages/atom-spotify2/spec/atom-spotify-status-bar-view-spec.coffee
