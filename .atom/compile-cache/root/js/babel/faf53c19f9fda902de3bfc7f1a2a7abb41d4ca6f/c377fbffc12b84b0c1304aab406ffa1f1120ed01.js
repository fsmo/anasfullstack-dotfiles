Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

'use babel';

var Settings = (function () {
  function Settings() {
    _classCallCheck(this, Settings);
  }

  _createClass(Settings, [{
    key: 'update',
    value: function update() {
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this.load(settings);
    }
  }, {
    key: 'load',
    value: function load() {
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if ('global' in settings) {
        settings['*'] = settings.global;
        delete settings.global;
      }

      if ('*' in settings) {
        var scopedSettings = settings;
        settings = settings['*'];
        delete scopedSettings['*'];

        var setting = undefined;
        var scope = undefined;
        for (scope in scopedSettings) {
          setting = scopedSettings[scope];
          this.set(setting, scope);
        }
      }

      this.set(settings);
    }
  }, {
    key: 'set',
    value: function set(settings, scope) {
      var flatSettings = {};
      var setting = undefined;
      var value = undefined;
      var valueOptions = undefined;
      var currentValue = undefined;
      var options = scope ? { scopeSelector: scope } : {};
      options.save = false;
      this.flatten(flatSettings, settings);

      for (setting in flatSettings) {
        value = flatSettings[setting];
        if (_underscorePlus2['default'].isArray(value)) {
          valueOptions = scope ? { scope: scope } : {};
          currentValue = atom.config.get(setting, valueOptions);
          value = _underscorePlus2['default'].union(currentValue, value);
        }

        atom.config.set(setting, value, options);
      }
    }
  }, {
    key: 'flatten',
    value: function flatten(root, dict, path) {
      var key = undefined;
      var value = undefined;
      var dotPath = undefined;
      var isObject = undefined;
      for (key in dict) {
        value = dict[key];
        dotPath = path ? path + '.' + key : key;
        isObject = !_underscorePlus2['default'].isArray(value) && _underscorePlus2['default'].isObject(value);

        if (isObject) {
          this.flatten(root, dict[key], dotPath);
        } else {
          root[dotPath] = value;
        }
      }
    }
  }]);

  return Settings;
})();

exports['default'] = Settings;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvc2V0dGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs4QkFFYyxpQkFBaUI7Ozs7QUFGL0IsV0FBVyxDQUFDOztJQUlTLFFBQVE7V0FBUixRQUFROzBCQUFSLFFBQVE7OztlQUFSLFFBQVE7O1dBRXJCLGtCQUFjO1VBQWIsUUFBUSx5REFBQyxFQUFFOztBQUNoQixVQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3JCOzs7V0FFRyxnQkFBYztVQUFiLFFBQVEseURBQUMsRUFBRTs7QUFFZCxVQUFJLFFBQVEsSUFBSSxRQUFRLEVBQUU7QUFDeEIsZ0JBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO0FBQ2hDLGVBQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQztPQUN4Qjs7QUFFRCxVQUFJLEdBQUcsSUFBSSxRQUFRLEVBQUU7QUFDbkIsWUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDO0FBQzlCLGdCQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLGVBQU8sY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUUzQixZQUFJLE9BQU8sWUFBQSxDQUFDO0FBQ1osWUFBSSxLQUFLLFlBQUEsQ0FBQztBQUNWLGFBQUssS0FBSyxJQUFJLGNBQWMsRUFBRTtBQUM1QixpQkFBTyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoQyxjQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUMxQjtPQUNGOztBQUVELFVBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDcEI7OztXQUVFLGFBQUMsUUFBUSxFQUFFLEtBQUssRUFBRTtBQUNuQixVQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDdEIsVUFBSSxPQUFPLFlBQUEsQ0FBQztBQUNaLFVBQUksS0FBSyxZQUFBLENBQUM7QUFDVixVQUFJLFlBQVksWUFBQSxDQUFDO0FBQ2pCLFVBQUksWUFBWSxZQUFBLENBQUM7QUFDakIsVUFBSSxPQUFPLEdBQUcsS0FBSyxHQUFHLEVBQUMsYUFBYSxFQUFFLEtBQUssRUFBQyxHQUFHLEVBQUUsQ0FBQztBQUNsRCxhQUFPLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztBQUNyQixVQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQzs7QUFFckMsV0FBSyxPQUFPLElBQUksWUFBWSxFQUFFO0FBQzVCLGFBQUssR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDOUIsWUFBSSw0QkFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDcEIsc0JBQVksR0FBRyxLQUFLLEdBQUcsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzNDLHNCQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ3RELGVBQUssR0FBRyw0QkFBRSxLQUFLLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3RDOztBQUVELFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7T0FDMUM7S0FDRjs7O1dBRU0saUJBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7QUFDeEIsVUFBSSxHQUFHLFlBQUEsQ0FBQztBQUNSLFVBQUksS0FBSyxZQUFBLENBQUM7QUFDVixVQUFJLE9BQU8sWUFBQSxDQUFDO0FBQ1osVUFBSSxRQUFRLFlBQUEsQ0FBQztBQUNiLFdBQUssR0FBRyxJQUFJLElBQUksRUFBRTtBQUNoQixhQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLGVBQU8sR0FBRyxJQUFJLEdBQU0sSUFBSSxTQUFJLEdBQUcsR0FBSyxHQUFHLENBQUM7QUFDeEMsZ0JBQVEsR0FBRyxDQUFDLDRCQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSw0QkFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRWxELFlBQUksUUFBUSxFQUFFO0FBQ1osY0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3hDLE1BQU07QUFDTCxjQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQ3ZCO09BQ0Y7S0FDRjs7O1NBbkVrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiIvVXNlcnMvYW5hcy8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3NldHRpbmdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUtcGx1cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNldHRpbmdzIHtcblxuICB1cGRhdGUoc2V0dGluZ3M9e30pIHtcbiAgICB0aGlzLmxvYWQoc2V0dGluZ3MpO1xuICB9XG5cbiAgbG9hZChzZXR0aW5ncz17fSkge1xuXG4gICAgaWYgKCdnbG9iYWwnIGluIHNldHRpbmdzKSB7XG4gICAgICBzZXR0aW5nc1snKiddID0gc2V0dGluZ3MuZ2xvYmFsO1xuICAgICAgZGVsZXRlIHNldHRpbmdzLmdsb2JhbDtcbiAgICB9XG5cbiAgICBpZiAoJyonIGluIHNldHRpbmdzKSB7XG4gICAgICBsZXQgc2NvcGVkU2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICAgIHNldHRpbmdzID0gc2V0dGluZ3NbJyonXTtcbiAgICAgIGRlbGV0ZSBzY29wZWRTZXR0aW5nc1snKiddO1xuXG4gICAgICBsZXQgc2V0dGluZztcbiAgICAgIGxldCBzY29wZTtcbiAgICAgIGZvciAoc2NvcGUgaW4gc2NvcGVkU2V0dGluZ3MpIHtcbiAgICAgICAgc2V0dGluZyA9IHNjb3BlZFNldHRpbmdzW3Njb3BlXTtcbiAgICAgICAgdGhpcy5zZXQoc2V0dGluZywgc2NvcGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2V0KHNldHRpbmdzKTtcbiAgfVxuXG4gIHNldChzZXR0aW5ncywgc2NvcGUpIHtcbiAgICBsZXQgZmxhdFNldHRpbmdzID0ge307XG4gICAgbGV0IHNldHRpbmc7XG4gICAgbGV0IHZhbHVlO1xuICAgIGxldCB2YWx1ZU9wdGlvbnM7XG4gICAgbGV0IGN1cnJlbnRWYWx1ZTtcbiAgICBsZXQgb3B0aW9ucyA9IHNjb3BlID8ge3Njb3BlU2VsZWN0b3I6IHNjb3BlfSA6IHt9O1xuICAgIG9wdGlvbnMuc2F2ZSA9IGZhbHNlO1xuICAgIHRoaXMuZmxhdHRlbihmbGF0U2V0dGluZ3MsIHNldHRpbmdzKTtcblxuICAgIGZvciAoc2V0dGluZyBpbiBmbGF0U2V0dGluZ3MpIHtcbiAgICAgIHZhbHVlID0gZmxhdFNldHRpbmdzW3NldHRpbmddO1xuICAgICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWVPcHRpb25zID0gc2NvcGUgPyB7c2NvcGU6IHNjb3BlfSA6IHt9O1xuICAgICAgICBjdXJyZW50VmFsdWUgPSBhdG9tLmNvbmZpZy5nZXQoc2V0dGluZywgdmFsdWVPcHRpb25zKTtcbiAgICAgICAgdmFsdWUgPSBfLnVuaW9uKGN1cnJlbnRWYWx1ZSwgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoc2V0dGluZywgdmFsdWUsIG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIGZsYXR0ZW4ocm9vdCwgZGljdCwgcGF0aCkge1xuICAgIGxldCBrZXk7XG4gICAgbGV0IHZhbHVlO1xuICAgIGxldCBkb3RQYXRoO1xuICAgIGxldCBpc09iamVjdDtcbiAgICBmb3IgKGtleSBpbiBkaWN0KSB7XG4gICAgICB2YWx1ZSA9IGRpY3Rba2V5XTtcbiAgICAgIGRvdFBhdGggPSBwYXRoID8gYCR7cGF0aH0uJHtrZXl9YCA6IGtleTtcbiAgICAgIGlzT2JqZWN0ID0gIV8uaXNBcnJheSh2YWx1ZSkgJiYgXy5pc09iamVjdCh2YWx1ZSk7XG5cbiAgICAgIGlmIChpc09iamVjdCkge1xuICAgICAgICB0aGlzLmZsYXR0ZW4ocm9vdCwgZGljdFtrZXldLCBkb3RQYXRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3RbZG90UGF0aF0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/anas/.atom/packages/project-manager/lib/settings.js
