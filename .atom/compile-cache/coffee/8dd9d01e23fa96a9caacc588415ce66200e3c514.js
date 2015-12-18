(function() {
  var AtomSpotifyStatusBarView, spotify,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  spotify = require('spotify-node-applescript');

  Number.prototype.times = function(fn) {
    var _i, _ref;
    if (this.valueOf()) {
      for (_i = 1, _ref = this.valueOf(); 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--) {
        fn();
      }
    }
  };

  AtomSpotifyStatusBarView = (function(_super) {
    __extends(AtomSpotifyStatusBarView, _super);

    function AtomSpotifyStatusBarView() {
      return AtomSpotifyStatusBarView.__super__.constructor.apply(this, arguments);
    }

    AtomSpotifyStatusBarView.prototype.initialize = function() {
      var div;
      this.classList.add('spotify', 'inline-block');
      div = document.createElement('div');
      div.classList.add('spotify-container');
      this.soundBars = document.createElement('span');
      this.soundBars.classList.add('spotify-sound-bars');
      this.soundBars.data = {
        hidden: true,
        state: 'paused'
      };
      5..times((function(_this) {
        return function() {
          var soundBar;
          soundBar = document.createElement('span');
          soundBar.classList.add('spotify-sound-bar');
          return _this.soundBars.appendChild(soundBar);
        };
      })(this));
      div.appendChild(this.soundBars);
      this.trackInfo = document.createElement('span');
      this.trackInfo.classList.add('track-info');
      this.trackInfo.textContent = '';
      div.appendChild(this.trackInfo);
      this.appendChild(div);
      atom.commands.add('atom-workspace', 'atom-spotify:next', (function(_this) {
        return function() {
          return spotify.next(function() {
            return _this.updateTrackInfo();
          });
        };
      })(this));
      atom.commands.add('atom-workspace', 'atom-spotify:previous', (function(_this) {
        return function() {
          return spotify.previous(function() {
            return _this.updateTrackInfo();
          });
        };
      })(this));
      atom.commands.add('atom-workspace', 'atom-spotify:play', (function(_this) {
        return function() {
          return spotify.play(function() {
            return _this.updateTrackInfo();
          });
        };
      })(this));
      atom.commands.add('atom-workspace', 'atom-spotify:pause', (function(_this) {
        return function() {
          return spotify.pause(function() {
            return _this.updateTrackInfo();
          });
        };
      })(this));
      atom.commands.add('atom-workspace', 'atom-spotify:togglePlay', (function(_this) {
        return function() {
          return _this.togglePlay();
        };
      })(this));
      atom.config.observe('atom-spotify2.showEqualizer', (function(_this) {
        return function(newValue) {
          return _this.toggleShowEqualizer(newValue);
        };
      })(this));
      return setInterval((function(_this) {
        return function() {
          return _this.updateTrackInfo();
        };
      })(this), 5000);
    };

    AtomSpotifyStatusBarView.prototype.updateTrackInfo = function() {
      return spotify.isRunning((function(_this) {
        return function(err, isRunning) {
          if (isRunning) {
            return spotify.getState(function(err, state) {
              if (state) {
                return spotify.getTrack(function(error, track) {
                  var trackInfoText;
                  if (track) {
                    trackInfoText = "";
                    if (atom.config.get('atom-spotify2.showPlayStatus')) {
                      if (!atom.config.get('atom-spotify2.showPlayIconAsText')) {
                        trackInfoText = state.state === 'playing' ? '► ' : '|| ';
                      } else {
                        trackInfoText = state.state === 'playing' ? 'Now Playing: ' : 'Paused: ';
                      }
                    }
                    trackInfoText += "" + track.artist + " - " + track.name;
                    if (!atom.config.get('atom-spotify2.showEqualizer')) {
                      if (atom.config.get('atom-spotify2.showPlayStatus')) {
                        trackInfoText += " ♫";
                      } else {
                        trackInfoText = "♫ " + trackInfoText;
                      }
                    }
                    _this.trackInfo.textContent = trackInfoText;
                  } else {
                    _this.trackInfo.textContent = '';
                  }
                  return _this.updateEqualizer();
                });
              }
            });
          } else {
            return _this.trackInfo.textContent = '';
          }
        };
      })(this));
    };

    AtomSpotifyStatusBarView.prototype.updateEqualizer = function() {
      return spotify.isRunning((function(_this) {
        return function(err, isRunning) {
          return spotify.getState(function(err, state) {
            if (err) {
              return;
            }
            return _this.togglePauseEqualizer(state.state !== 'playing');
          });
        };
      })(this));
    };

    AtomSpotifyStatusBarView.prototype.togglePlay = function() {
      return spotify.isRunning((function(_this) {
        return function(err, isRunning) {
          if (isRunning) {
            return spotify.playPause(function() {
              return _this.updateEqualizer();
            });
          }
        };
      })(this));
    };

    AtomSpotifyStatusBarView.prototype.toggleShowEqualizer = function(shown) {
      if (shown) {
        return this.soundBars.removeAttribute('data-hidden');
      } else {
        return this.soundBars.setAttribute('data-hidden', true);
      }
    };

    AtomSpotifyStatusBarView.prototype.togglePauseEqualizer = function(paused) {
      if (paused) {
        return this.soundBars.setAttribute('data-state', 'paused');
      } else {
        return this.soundBars.removeAttribute('data-state');
      }
    };

    return AtomSpotifyStatusBarView;

  })(HTMLElement);

  module.exports = document.registerElement('status-bar-spotify', {
    prototype: AtomSpotifyStatusBarView.prototype,
    "extends": 'div'
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXRvbS1zcG90aWZ5Mi9saWIvYXRvbS1zcG90aWZ5LXN0YXR1cy1iYXItdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUNBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsMEJBQVIsQ0FBVixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFBLFNBQUUsQ0FBQSxLQUFSLEdBQWdCLFNBQUMsRUFBRCxHQUFBO0FBQ2QsUUFBQSxRQUFBO0FBQUEsSUFBQSxJQUE2QixJQUFDLENBQUEsT0FBRCxDQUFBLENBQTdCO0FBQUEsV0FBVSwyRkFBVixHQUFBO0FBQUEsUUFBRyxFQUFILENBQUEsQ0FBQSxDQUFBO0FBQUEsT0FBQTtLQURjO0VBQUEsQ0FGaEIsQ0FBQTs7QUFBQSxFQU1NO0FBQ0osK0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHVDQUFBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixVQUFBLEdBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLFNBQWYsRUFBMEIsY0FBMUIsQ0FBQSxDQUFBO0FBQUEsTUFFQSxHQUFBLEdBQU0sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FGTixDQUFBO0FBQUEsTUFHQSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQWQsQ0FBa0IsbUJBQWxCLENBSEEsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QixDQUxiLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQXJCLENBQXlCLG9CQUF6QixDQU5BLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxH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

//# sourceURL=/Users/anas/.atom/packages/atom-spotify2/lib/atom-spotify-status-bar-view.coffee
