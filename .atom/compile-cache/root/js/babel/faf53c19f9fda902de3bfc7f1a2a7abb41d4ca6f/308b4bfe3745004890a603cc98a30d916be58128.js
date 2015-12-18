Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _settings = require('./settings');

var _settings2 = _interopRequireDefault(_settings);

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

'use babel';

var Project = (function () {
  function Project() {
    var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Project);

    this.props = {};
    this.emitter = new _atom.Emitter();
    this.db = new _db2['default']();
    this.updateProps(props);
    this.lookForUpdates();
  }

  _createClass(Project, [{
    key: 'updateProps',
    value: function updateProps(props) {
      this.props = _underscorePlus2['default'].deepExtend(this.defaultProps, props);
    }
  }, {
    key: 'getPropsToSave',
    value: function getPropsToSave() {
      var saveProps = {};
      var value = undefined;
      var key = undefined;
      for (key in this.props) {
        value = this.props[key];
        if (!this.isDefaultProp(key, value)) {
          saveProps[key] = value;
        }
      }

      return saveProps;
    }
  }, {
    key: 'isDefaultProp',
    value: function isDefaultProp(key, value) {
      if (!this.defaultProps.hasOwnProperty(key)) {
        return false;
      }

      var defaultProp = this.defaultProps[key];
      if (typeof defaultProp === 'object' && _underscorePlus2['default'].isEqual(defaultProp, value)) {
        return true;
      }

      if (defaultProp === value) {
        return true;
      }

      return false;
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      if (typeof key === 'object') {
        for (var i in key) {
          value = key[i];
          this.props[i] = value;
        }

        this.save();
      } else {
        this.props[key] = value;
        this.save();
      }
    }
  }, {
    key: 'unset',
    value: function unset(key) {
      if (_underscorePlus2['default'].has(this.defaultProps, key)) {
        this.props[key] = this.defaultProps[key];
      } else {
        this.props[key] = null;
      }

      this.save();
    }
  }, {
    key: 'lookForUpdates',
    value: function lookForUpdates() {
      var _this = this;

      if (this.props._id) {
        this.db.setSearchQuery('_id', this.props._id);
        this.db.onUpdate(function (props) {
          if (props) {
            var updatedProps = _underscorePlus2['default'].deepExtend(_this.defaultProps, props);
            if (!_underscorePlus2['default'].isEqual(_this.props, updatedProps)) {
              _this.updateProps(props);
              _this.emitter.emit('updated');
              if (_this.isCurrent()) {
                _this.load();
              }
            }
          } else {
            _this.db.setSearchQuery('paths', _this.props.paths);
            _this.db.find(function (props) {
              _this.updateProps(props);
              _this.db.setSearchQuery('_id', _this.props._id);
              _this.emitter.emit('updated');
              if (_this.isCurrent()) {
                _this.load();
              }
            });
          }
        });
      }
    }
  }, {
    key: 'isCurrent',
    value: function isCurrent() {
      var activePath = atom.project.getPaths()[0];
      var mainPath = this.props.paths[0];
      if (activePath === mainPath) {
        return true;
      }

      return false;
    }
  }, {
    key: 'isValid',
    value: function isValid() {
      var _this2 = this;

      var valid = true;
      this.requiredProperties.forEach(function (key) {
        if (!_this2.props[key] || !_this2.props[key].length) {
          valid = false;
        }
      });

      return valid;
    }
  }, {
    key: 'load',
    value: function load() {
      if (this.isCurrent()) {
        var projectSettings = new _settings2['default']();
        projectSettings.load(this.props.settings);
      }
    }
  }, {
    key: 'save',
    value: function save() {
      var _this3 = this;

      if (this.isValid()) {
        if (this.props._id) {
          this.db.update(this.getPropsToSave());
        } else {
          this.db.add(this.getPropsToSave(), function (id) {
            _this3.props._id = id;
            _this3.lookForUpdates();
          });
        }

        return true;
      }

      return false;
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.db['delete'](this.props._id);
    }
  }, {
    key: 'open',
    value: function open() {
      atom.open({
        pathsToOpen: this.props.paths,
        devMode: this.props.devMode
      });
    }
  }, {
    key: 'onUpdate',
    value: function onUpdate(callback) {
      this.emitter.on('updated', function () {
        return callback();
      });
    }
  }, {
    key: 'requiredProperties',
    get: function get() {
      return ['title', 'paths'];
    }
  }, {
    key: 'defaultProps',
    get: function get() {
      return {
        title: '',
        paths: [],
        icon: 'icon-chevron-right',
        settings: {},
        group: null,
        devMode: false,
        template: null
      };
    }
  }]);

  return Project;
})();

exports['default'] = Project;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVzQixNQUFNOzs4QkFDZCxpQkFBaUI7Ozs7d0JBQ1YsWUFBWTs7OztrQkFDbEIsTUFBTTs7OztBQUxyQixXQUFXLENBQUM7O0lBT1MsT0FBTztBQUVmLFdBRlEsT0FBTyxHQUVKO1FBQVYsS0FBSyx5REFBQyxFQUFFOzswQkFGRCxPQUFPOztBQUd4QixRQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNoQixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUM7QUFDN0IsUUFBSSxDQUFDLEVBQUUsR0FBRyxxQkFBUSxDQUFDO0FBQ25CLFFBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEIsUUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0dBQ3ZCOztlQVJrQixPQUFPOztXQTBCZixxQkFBQyxLQUFLLEVBQUU7QUFDakIsVUFBSSxDQUFDLEtBQUssR0FBRyw0QkFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNyRDs7O1dBRWEsMEJBQUc7QUFDZixVQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDbkIsVUFBSSxLQUFLLFlBQUEsQ0FBQztBQUNWLFVBQUksR0FBRyxZQUFBLENBQUM7QUFDUixXQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ3RCLGFBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLFlBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRTtBQUNuQyxtQkFBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUN4QjtPQUNGOztBQUVELGFBQU8sU0FBUyxDQUFDO0tBQ2xCOzs7V0FFWSx1QkFB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QUUsVUFBQSxFQUFFLEVBQUk7QUFDdkMsbUJBQUssS0FBSyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDcEIsbUJBQUssY0FBYyxFQUFFLENBQUM7V0FDdkIsQ0FBQyxDQUFDO1NBQ0o7O0FBRUQsZUFBTyxJQUFJLENBQUM7T0FDYjs7QUFFRCxhQUFPLEtBQUssQ0FBQztLQUNkOzs7V0FFSyxrQkFBRztBQUNQLFVBQUksQ0FBQyxFQUFFLFVBQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2hDOzs7V0FFRyxnQkFBRztBQUNMLFVBQUksQ0FBQyxJQUFJLENBQUM7QUFDUixtQkFBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztBQUM3QixlQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPO09BQzVCLENBQUMsQ0FBQztLQUNKOzs7V0FFTyxrQkFBQyxRQUFRLEVBQUU7QUFDakIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFO2VBQU0sUUFBUSxFQUFFO09BQUEsQ0FBQyxDQUFDO0tBQzlDOzs7U0FqS3FCLGVBQUc7QUFDdkIsYUFBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztLQUMzQjs7O1NBRWUsZUFBRztBQUNqQixhQUFPO0FBQ0wsYUFBSyxFQUFFLEVBQUU7QUFDVCxhQUFLLEVBQUUsRUFBRTtBQUNULFlBQUksRUFBRSxvQkFBb0I7QUFDMUIsZ0JBQVEsRUFBRSxFQUFFO0FBQ1osYUFBSyxFQUFFLElBQUk7QUFDWCxlQUFPLEVBQUUsS0FBSztBQUNkLGdCQUFRLEVBQUUsSUFBSTtPQUNmLENBQUM7S0FDSDs7O1NBeEJrQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiIvVXNlcnMvYW5hcy8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3Byb2plY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHtFbWl0dGVyfSBmcm9tICdhdG9tJztcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUtcGx1cyc7XG5pbXBvcnQgU2V0dGluZ3MgZnJvbSAnLi9zZXR0aW5ncyc7XG5pbXBvcnQgREIgZnJvbSAnLi9kYic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2plY3Qge1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzPXt9KSB7XG4gICAgdGhpcy5wcm9wcyA9IHt9O1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gICAgdGhpcy5kYiA9IG5ldyBEQigpO1xuICAgIHRoaXMudXBkYXRlUHJvcHMocHJvcHMpO1xuICAgIHRoaXMubG9va0ZvclVwZGF0ZXMoKTtcbiAgfVxuXG4gIGdldCByZXF1aXJlZFByb3BlcnRpZXMoKSB7XG4gICAgcmV0dXJuIFsndGl0bGUnLCAncGF0aHMnXTtcbiAgfVxuXG4gIGdldCBkZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRpdGxlOiAnJyxcbiAgICAgIHBhdGhzOiBbXSxcbiAgICAgIGljb246ICdpY29uLWNoZXZyb24tcmlnaHQnLFxuICAgICAgc2V0dGluZ3M6IHt9LFxuICAgICAgZ3JvdXA6IG51bGwsXG4gICAgICBkZXZNb2RlOiBmYWxzZSxcbiAgICAgIHRlbXBsYXRlOiBudWxsXG4gICAgfTtcbiAgfVxuXG4gIHVwZGF0ZVByb3BzKHByb3BzKSB7XG4gICAgdGhpcy5wcm9wcyA9IF8uZGVlcEV4dGVuZCh0aGlzLmRlZmF1bHRQcm9wcywgcHJvcHMpO1xuICB9XG5cbiAgZ2V0UHJvcHNUb1NhdmUoKSB7XG4gICAgbGV0IHNhdmVQcm9wcyA9IHt9O1xuICAgIGxldCB2YWx1ZTtcbiAgICBsZXQga2V5O1xuICAgIGZvciAoa2V5IGluIHRoaXMucHJvcHMpIHtcbiAgICAgIHZhbHVlID0gdGhpcy5wcm9wc1trZXldO1xuICAgICAgaWYgKCF0aGlzLmlzRGVmYXVsdFByb3Aoa2V5LCB2YWx1ZSkpIHtcbiAgICAgICAgc2F2ZVByb3BzW2tleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2F2ZVByb3BzO1xuICB9XG5cbiAgaXNEZWZhdWx0UHJvcChrZXksIHZhbHVlKSB7XG4gICAgaWYgKCF0aGlzLmRlZmF1bHRQcm9wcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgZGVmYXVsdFByb3AgPSB0aGlzLmRlZmF1bHRQcm9wc1trZXldO1xuICAgIGlmICh0eXBlb2YgZGVmYXVsdFByb3AgPT09ICdvYmplY3QnICYmIF8uaXNFcXVhbChkZWZhdWx0UHJvcCwgdmFsdWUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZGVmYXVsdFByb3AgPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzZXQoa2V5LCB2YWx1ZSkge1xuICAgIGlmICh0eXBlb2Yga2V5ID09PSAnb2JqZWN0Jykge1xuICAgICAgZm9yIChsZXQgaSBpbiBrZXkpIHtcbiAgICAgICAgdmFsdWUgPSBrZXlbaV07XG4gICAgICAgIHRoaXMucHJvcHNbaV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zYXZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJvcHNba2V5XSA9IHZhbHVlO1xuICAgICAgdGhpcy5zYXZlKCk7XG4gICAgfVxuICB9XG5cbiAgdW5zZXQoa2V5KSB7XG4gICAgaWYgKF8uaGFzKHRoaXMuZGVmYXVsdFByb3BzLCBrZXkpKSB7XG4gICAgICB0aGlzLnByb3BzW2tleV0gPSB0aGlzLmRlZmF1bHRQcm9wc1trZXldO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb3BzW2tleV0gPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuc2F2ZSgpO1xuICB9XG5cbiAgbG9va0ZvclVwZGF0ZXMoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuX2lkKSB7XG4gICAgICB0aGlzLmRiLnNldFNlYXJjaFF1ZXJ5KCdfaWQnLCB0aGlzLnByb3BzLl9pZCk7XG4gICAgICB0aGlzLmRiLm9uVXBkYXRlKChwcm9wcykgPT4ge1xuICAgICAgICBpZiAocHJvcHMpIHtcbiAgICAgICAgICBjb25zdCB1cGRhdGVkUHJvcHMgPSBfLmRlZXBFeHRlbmQodGhpcy5kZWZhdWx0UHJvcHMsIHByb3BzKTtcbiAgICAgICAgICBpZiAoIV8uaXNFcXVhbCh0aGlzLnByb3BzLCB1cGRhdGVkUHJvcHMpKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByb3BzKHByb3BzKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCd1cGRhdGVkJyk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0N1cnJlbnQoKSkge1xuICAgICAgICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5kYi5zZXRTZWFyY2hRdWVyeSgncGF0aHMnLCB0aGlzLnByb3BzLnBhdGhzKTtcbiAgICAgICAgICB0aGlzLmRiLmZpbmQoKHByb3BzKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByb3BzKHByb3BzKTtcbiAgICAgICAgICAgIHRoaXMuZGIuc2V0U2VhcmNoUXVlcnkoJ19pZCcsIHRoaXMucHJvcHMuX2lkKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCd1cGRhdGVkJyk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0N1cnJlbnQoKSkge1xuICAgICAgICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgaXNDdXJyZW50KCkge1xuICAgIGNvbnN0IGFjdGl2ZVBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXTtcbiAgICBjb25zdCBtYWluUGF0aCA9IHRoaXMucHJvcHMucGF0aHNbMF07XG4gICAgaWYgKGFjdGl2ZVBhdGggPT09IG1haW5QYXRoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpc1ZhbGlkKCkge1xuICAgIGxldCB2YWxpZCA9IHRydWU7XG4gICAgdGhpcy5yZXF1aXJlZFByb3BlcnRpZXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnByb3BzW2tleV0gfHwgIXRoaXMucHJvcHNba2V5XS5sZW5ndGgpIHtcbiAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB2YWxpZDtcbiAgfVxuXG4gIGxvYWQoKSB7XG4gICAgaWYgKHRoaXMuaXNDdXJyZW50KCkpIHtcbiAgICAgIGxldCBwcm9qZWN0U2V0dGluZ3MgPSBuZXcgU2V0dGluZ3MoKTtcbiAgICAgIHByb2plY3RTZXR0aW5ncy5sb2FkKHRoaXMucHJvcHMuc2V0dGluZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHNhdmUoKSB7XG4gICAgaWYgKHRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy5faWQpIHtcbiAgICAgICAgdGhpcy5kYi51cGRhdGUodGhpcy5nZXRQcm9wc1RvU2F2ZSgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGIuYWRkKHRoaXMuZ2V0UHJvcHNUb1NhdmUoKSwgaWQgPT4ge1xuICAgICAgICAgIHRoaXMucHJvcHMuX2lkID0gaWQ7XG4gICAgICAgICAgdGhpcy5sb29rRm9yVXBkYXRlcygpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmVtb3ZlKCkge1xuICAgIHRoaXMuZGIuZGVsZXRlKHRoaXMucHJvcHMuX2lkKTtcbiAgfVxuXG4gIG9wZW4oKSB7XG4gICAgYXRvbS5vcGVuKHtcbiAgICAgIHBhdGhzVG9PcGVuOiB0aGlzLnByb3BzLnBhdGhzLFxuICAgICAgZGV2TW9kZTogdGhpcy5wcm9wcy5kZXZNb2RlXG4gICAgfSk7XG4gIH1cblxuICBvblVwZGF0ZShjYWxsYmFjaykge1xuICAgIHRoaXMuZW1pdHRlci5vbigndXBkYXRlZCcsICgpID0+IGNhbGxiYWNrKCkpO1xuICB9XG59XG4iXX0=
//# sourceURL=/Users/anas/.atom/packages/project-manager/lib/project.js
