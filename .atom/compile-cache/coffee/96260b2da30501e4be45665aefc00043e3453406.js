(function() {
  var ColorMarker, CompositeDisposable, fill;

  CompositeDisposable = require('atom').CompositeDisposable;

  fill = require('./utils').fill;

  module.exports = ColorMarker = (function() {
    function ColorMarker(_arg) {
      this.marker = _arg.marker, this.color = _arg.color, this.text = _arg.text, this.invalid = _arg.invalid, this.colorBuffer = _arg.colorBuffer;
      this.id = this.marker.id;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.marker.onDidDestroy((function(_this) {
        return function() {
          return _this.markerWasDestroyed();
        };
      })(this)));
      this.subscriptions.add(this.marker.onDidChange((function(_this) {
        return function() {
          if (_this.marker.isValid()) {
            _this.invalidateScreenRangeCache();
            return _this.checkMarkerScope();
          } else {
            return _this.destroy();
          }
        };
      })(this)));
      this.checkMarkerScope();
    }

    ColorMarker.prototype.destroy = function() {
      if (this.destroyed) {
        return;
      }
      return this.marker.destroy();
    };

    ColorMarker.prototype.markerWasDestroyed = function() {
      var _ref;
      if (this.destroyed) {
        return;
      }
      this.subscriptions.dispose();
      _ref = {}, this.marker = _ref.marker, this.color = _ref.color, this.text = _ref.text, this.colorBuffer = _ref.colorBuffer;
      return this.destroyed = true;
    };

    ColorMarker.prototype.match = function(properties) {
      var bool;
      if (this.destroyed) {
        return false;
      }
      bool = true;
      if (properties.bufferRange != null) {
        bool && (bool = this.marker.getBufferRange().isEqual(properties.bufferRange));
      }
      if (properties.color != null) {
        bool && (bool = properties.color.isEqual(this.color));
      }
      if (properties.match != null) {
        bool && (bool = properties.match === this.text);
      }
      if (properties.text != null) {
        bool && (bool = properties.text === this.text);
      }
      return bool;
    };

    ColorMarker.prototype.serialize = function() {
      var out;
      if (this.destroyed) {
        return;
      }
      out = {
        markerId: String(this.marker.id),
        bufferRange: this.marker.getBufferRange().serialize(),
        color: this.color.serialize(),
        text: this.text,
        variables: this.color.variables
      };
      if (!this.color.isValid()) {
        out.invalid = true;
      }
      return out;
    };

    ColorMarker.prototype.checkMarkerScope = function(forceEvaluation) {
      var e, range, scope, scopeChain;
      if (forceEvaluation == null) {
        forceEvaluation = false;
      }
      if (this.destroyed || (this.colorBuffer == null)) {
        return;
      }
      range = this.marker.getBufferRange();
      try {
        scope = this.marker.displayBuffer.scopeDescriptorForBufferPosition(range.start);
        scopeChain = scope.getScopeChain();
        if (!scopeChain || (!forceEvaluation && scopeChain === this.lastScopeChain)) {
          return;
        }
        this.ignored = this.colorBuffer.ignoredScopes.some(function(scopeRegExp) {
          return scopeChain.match(scopeRegExp);
        });
        return this.lastScopeChain = scopeChain;
      } catch (_error) {
        e = _error;
        return console.error(e);
      }
    };

    ColorMarker.prototype.isIgnored = function() {
      return this.ignored;
    };

    ColorMarker.prototype.getScreenRange = function() {
      return this.screenRangeCache != null ? this.screenRangeCache : this.screenRangeCache = this.marker.getScreenRange();
    };

    ColorMarker.prototype.invalidateScreenRangeCache = function() {
      return this.screenRangeCache = null;
    };

    ColorMarker.prototype.convertContentToHex = function() {
      var hex;
      hex = '#' + fill(this.color.hex, 6);
      return this.marker.displayBuffer.buffer.setTextInRange(this.marker.getBufferRange(), hex);
    };

    ColorMarker.prototype.convertContentToRGB = function() {
      var rgba;
      rgba = "rgb(" + (Math.round(this.color.red)) + ", " + (Math.round(this.color.green)) + ", " + (Math.round(this.color.blue)) + ")";
      return this.marker.displayBuffer.buffer.setTextInRange(this.marker.getBufferRange(), rgba);
    };

    ColorMarker.prototype.convertContentToRGBA = function() {
      var rgba;
      rgba = "rgba(" + (Math.round(this.color.red)) + ", " + (Math.round(this.color.green)) + ", " + (Math.round(this.color.blue)) + ", " + this.color.alpha + ")";
      return this.marker.displayBuffer.buffer.setTextInRange(this.marker.getBufferRange(), rgba);
    };

    return ColorMarker;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLW1hcmtlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0NBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLFNBQVIsRUFBUixJQURELENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxxQkFBQyxJQUFELEdBQUE7QUFDWCxNQURhLElBQUMsQ0FBQSxjQUFBLFFBQVEsSUFBQyxDQUFBLGFBQUEsT0FBTyxJQUFDLENBQUEsWUFBQSxNQUFNLElBQUMsQ0FBQSxlQUFBLFNBQVMsSUFBQyxDQUFBLG1CQUFBLFdBQ2hELENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxFQUFELEdBQU0sSUFBQyxDQUFBLE1BQU0sQ0FBQyxFQUFkLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFEakIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsWUFBUixDQUFxQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxrQkFBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQixDQUFuQixDQUZBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBb0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNyQyxVQUFBLElBQUcsS0FBQyxDQUFB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

//# sourceURL=/Users/anas/.atom/packages/pigments/lib/color-marker.coffee
