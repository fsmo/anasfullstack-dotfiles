(function() {
  var AtomSpotifyStatusBarView;

  AtomSpotifyStatusBarView = require('./atom-spotify-status-bar-view');

  module.exports = {
    config: {
      displayOnLeftSide: {
        type: 'boolean',
        "default": true
      },
      showEqualizer: {
        type: 'boolean',
        "default": false
      },
      showPlayStatus: {
        type: 'boolean',
        "default": true
      },
      showPlayIconAsText: {
        type: 'boolean',
        "default": false
      }
    },
    activate: function() {
      return atom.packages.onDidActivateInitialPackages((function(_this) {
        return function() {
          _this.statusBar = document.querySelector('status-bar');
          _this.spotifyView = new AtomSpotifyStatusBarView();
          _this.spotifyView.initialize();
          if (atom.config.get('atom-spotify2.displayOnLeftSide')) {
            return _this.statusBar.addLeftTile({
              item: _this.spotifyView,
              priority: 100
            });
          } else {
            return _this.statusBar.addRightTile({
              item: _this.spotifyView,
              priority: 100
            });
          }
        };
      })(this));
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.spotifyView) != null) {
        _ref.destroy();
      }
      return this.spotifyView = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXRvbS1zcG90aWZ5Mi9saWIvYXRvbS1zcG90aWZ5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3QkFBQTs7QUFBQSxFQUFBLHdCQUFBLEdBQTJCLE9BQUEsQ0FBUSxnQ0FBUixDQUEzQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxpQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FERjtBQUFBLE1BR0EsYUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FKRjtBQUFBLE1BTUEsY0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FQRjtBQUFBLE1BU0Esa0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO09BVkY7S0FERjtBQUFBLElBY0EsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsNEJBQWQsQ0FBMkMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN6QyxVQUFBLEtBQUMsQ0FBQSxTQUFELEdBQWEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsWUFBdkIsQ0FBYixDQUFBO0FBQUEsVUFFQSxLQUFDLENBQUEsV0FBRCxHQUFtQixJQUFBLHdCQUFBLENBQUEsQ0FGbkIsQ0FBQTtBQUFBLFVBSUEsS0FBQyxDQUFBLFdBQVcsQ0FBQyxVQUFiLENBQUEsQ0FKQSxDQUFBO0FBTUEsVUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpQ0FBaEIsQ0FBSDttQkFDRSxLQUFDLENBQUEsU0FBUyxDQUFDLFdBQVgsQ0FBdUI7QUFBQSxjQUFBLElBQUEsRUFBTSxLQUFDLENBQUEsV0FBUDtBQUFBLGNBQW9CLFFBQUEsRUFBVSxHQUE5QjthQUF2QixFQURGO1dBQUEsTUFBQTttQkFHRSxLQUFDLENBQUEsU0FBUyxDQUFDLFlBQVgsQ0FBd0I7QUFBQSxjQUFBLElBQUEsRUFBTSxLQUFDLENBQUEsV0FBUDtBQUFBLGNBQW9CLFFBQUEsRUFBVSxHQUE5QjthQUF4QixFQUhGO1dBUHlDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0MsRUFEUTtJQUFBLENBZFY7QUFBQSxJQTJCQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxJQUFBOztZQUFZLENBQUUsT0FBZCxDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsV0FBRCxHQUFlLEtBRkw7SUFBQSxDQTNCWjtHQUhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/anas/.atom/packages/atom-spotify2/lib/atom-spotify.coffee
