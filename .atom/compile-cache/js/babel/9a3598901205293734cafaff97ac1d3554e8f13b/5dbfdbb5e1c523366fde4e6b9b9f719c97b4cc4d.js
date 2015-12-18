Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _projects = require('./projects');

var _projects2 = _interopRequireDefault(_projects);

var _project = require('./project');

var _project2 = _interopRequireDefault(_project);

'use babel';

var ProjectsListView = (function (_SelectListView) {
  _inherits(ProjectsListView, _SelectListView);

  function ProjectsListView() {
    _classCallCheck(this, ProjectsListView);

    _get(Object.getPrototypeOf(ProjectsListView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ProjectsListView, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(ProjectsListView.prototype), 'initialize', this).call(this);
      this.addClass('project-manager');
      this.projects = new _projects2['default']();
    }
  }, {
    key: 'activate',
    value: function activate() {
      // return new ProjectListView();
    }
  }, {
    key: 'getFilterKey',
    value: function getFilterKey() {
      var input = this.filterEditorView.getText();
      var inputArr = input.split(':');
      var isFilterKey = _underscorePlus2['default'].contains(this.possibleFilterKeys, inputArr[0]);
      var filter = this.defaultFilterKey;

      if (inputArr.length > 1 && isFilterKey) {
        filter = inputArr[0];
      }

      return filter;
    }
  }, {
    key: 'getFilterQuery',
    value: function getFilterQuery() {
      var input = this.filterEditorView.getText();
      var inputArr = input.split(':');
      var filter = input;

      if (inputArr.length > 1) {
        filter = inputArr[1];
      }

      return filter;
    }
  }, {
    key: 'getEmptyMessage',
    value: function getEmptyMessage(itemCount, filteredItemCount) {
      if (itemCount === 0) {
        return 'No projects saved yet';
      } else {
        _get(Object.getPrototypeOf(ProjectsListView.prototype), 'getEmptyMessage', this).call(this, itemCount, filteredItemCount);
      }
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      var _this = this;

      if (this.panel && this.panel.isVisible()) {
        this.close();
      } else {
        this.projects.getAll(function (projects) {
          return _this.show(projects);
        });
      }
    }
  }, {
    key: 'show',
    value: function show(projects) {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({ item: this });
      }

      this.panel.show();

      var items = [];
      var project = undefined;
      for (project of projects) {
        items.push(project.props);
      }

      items = this.sortItems(items);
      this.setItems(items);
      this.focusFilterEditor();
    }
  }, {
    key: 'confirmed',
    value: function confirmed(props) {
      if (props) {
        var project = new _project2['default'](props);
        project.open();
        this.close();
      }
    }
  }, {
    key: 'close',
    value: function close() {
      if (this.panel) {
        this.panel.destroy();
      }
    }
  }, {
    key: 'cancelled',
    value: function cancelled() {
      this.close();
    }
  }, {
    key: 'viewForItem',
    value: function viewForItem(_ref) {
      var _id = _ref._id;
      var title = _ref.title;
      var group = _ref.group;
      var icon = _ref.icon;
      var devMode = _ref.devMode;
      var paths = _ref.paths;

      var showPath = this.showPath;
      return (0, _atomSpacePenViews.$$)(function () {
        var _this2 = this;

        this.li({ 'class': 'two-lines' }, { 'data-project-id': _id }, function () {
          _this2.div({ 'class': 'primary-line' }, function () {
            if (devMode) {
              _this2.span({ 'class': 'project-manager-devmode' });
            }

            _this2.div({ 'class': 'icon ' + icon }, function () {
              _this2.span(title);
              if (group != null) {
                _this2.span({ 'class': 'project-manager-list-group' }, group);
              }
            });
          });
          _this2.div({ 'class': 'secondary-line' }, function () {
            if (showPath) {
              var path = undefined;
              for (path of paths) {
                _this2.div({ 'class': 'no-icon' }, path);
              }
            }
          });
        });
      });
    }
  }, {
    key: 'sortItems',
    value: function sortItems(items) {
      var key = this.sortBy;
      if (key !== 'default') {
        items.sort(function (a, b) {
          a = (a[key] || '￿').toUpperCase();
          b = (b[key] || '￿').toUpperCase();

          return a > b ? 1 : -1;
        });
      }

      return items;
    }
  }, {
    key: 'possibleFilterKeys',
    get: function get() {
      return ['title', 'group', 'template'];
    }
  }, {
    key: 'defaultFilterKey',
    get: function get() {
      return 'title';
    }
  }, {
    key: 'sortBy',
    get: function get() {
      return atom.config.get('project-manager.sortBy');
    }
  }, {
    key: 'showPath',
    get: function get() {
      return atom.config.get('project-manager.showPath');
    }
  }]);

  return ProjectsListView;
})(_atomSpacePenViews.SelectListView);

exports['default'] = ProjectsListView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdHMtbGlzdC12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O2lDQUVpQyxzQkFBc0I7OzhCQUN6QyxpQkFBaUI7Ozs7d0JBQ1YsWUFBWTs7Ozt1QkFDYixXQUFXOzs7O0FBTC9CLFdBQVcsQ0FBQzs7SUFPUyxnQkFBZ0I7WUFBaEIsZ0JBQWdCOztXQUFoQixnQkFBZ0I7MEJBQWhCLGdCQUFnQjs7K0JBQWhCLGdCQUFnQjs7O2VBQWhCLGdCQUFnQjs7V0FDekIsc0JBQUc7QUFDWCxpQ0FGaUIsZ0JBQWdCLDRDQUVkO0FBQ25CLFVBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUNqQyxVQUFJLENBQUMsUUFBUSxHQUFHLDJCQUFjLENBQUM7S0FDaEM7OztXQUVPLG9CQUFHOztLQUVWOzs7V0FrQlcsd0JBQUc7QUFDYixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDOUMsVUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxVQUFNLFdBQVcsR0FBRyw0QkFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JFLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQzs7QUFFbkMsVUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxXQUFXLEVBQUU7QUFDdEMsY0FBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUN0Qjs7QUFFRCxhQUFPLE1BQU0sQ0FBQztLQUNmOzs7V0FFYSwwQkFBRztBQUNmLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM5QyxVQUFN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Q0FBQztPQUVKOztBQUVELGFBQU8sS0FBSyxDQUFDO0tBQ2Q7OztTQXRJcUIsZUFBRztBQUN2QixhQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztLQUN2Qzs7O1NBRW1CLGVBQUc7QUFDckIsYUFBTyxPQUFPLENBQUM7S0FDaEI7OztTQUVTLGVBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7S0FDbEQ7OztTQUVXLGVBQUc7QUFDYixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7S0FDcEQ7OztTQXpCa0IsZ0JBQWdCOzs7cUJBQWhCLGdCQUFnQiIsImZpbGUiOiIvVXNlcnMvYW5hcy8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3Byb2plY3RzLWxpc3Qtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQge1NlbGVjdExpc3RWaWV3LCAkJH0gZnJvbSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnO1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcbmltcG9ydCBQcm9qZWN0cyBmcm9tICcuL3Byb2plY3RzJztcbmltcG9ydCBQcm9qZWN0IGZyb20gJy4vcHJvamVjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2plY3RzTGlzdFZpZXcgZXh0ZW5kcyBTZWxlY3RMaXN0VmlldyB7XG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuYWRkQ2xhc3MoJ3Byb2plY3QtbWFuYWdlcicpO1xuICAgIHRoaXMucHJvamVjdHMgPSBuZXcgUHJvamVjdHMoKTtcbiAgfVxuXG4gIGFjdGl2YXRlKCkge1xuICAgIC8vIHJldHVybiBuZXcgUHJvamVjdExpc3RWaWV3KCk7XG4gIH1cblxuICBnZXQgcG9zc2libGVGaWx0ZXJLZXlzKCkge1xuICAgIHJldHVybiBbJ3RpdGxlJywgJ2dyb3VwJywgJ3RlbXBsYXRlJ107XG4gIH1cblxuICBnZXQgZGVmYXVsdEZpbHRlcktleSgpIHtcbiAgICByZXR1cm4gJ3RpdGxlJztcbiAgfVxuXG4gIGdldCBzb3J0QnkoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgncHJvamVjdC1tYW5hZ2VyLnNvcnRCeScpO1xuICB9XG5cbiAgZ2V0IHNob3dQYXRoKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ3Byb2plY3QtbWFuYWdlci5zaG93UGF0aCcpO1xuICB9XG5cbiAgZ2V0RmlsdGVyS2V5KCkge1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5maWx0ZXJFZGl0b3JWaWV3LmdldFRleHQoKTtcbiAgICBjb25zdCBpbnB1dEFyciA9IGlucHV0LnNwbGl0KCc6Jyk7XG4gICAgY29uc3QgaXNGaWx0ZXJLZXkgPSBfLmNvbnRhaW5zKHRoaXMucG9zc2libGVGaWx0ZXJLZXlzLCBpbnB1dEFyclswXSk7XG4gICAgbGV0IGZpbHRlciA9IHRoaXMuZGVmYXVsdEZpbHRlcktleTtcblxuICAgIGlmIChpbnB1dEFyci5sZW5ndGggPiAxICYmIGlzRmlsdGVyS2V5KSB7XG4gICAgICBmaWx0ZXIgPSBpbnB1dEFyclswXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmlsdGVyO1xuICB9XG5cbiAgZ2V0RmlsdGVyUXVlcnkoKSB7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLmZpbHRlckVkaXRvclZpZXcuZ2V0VGV4dCgpO1xuICAgIGNvbnN0IGlucHV0QXJyID0gaW5wdXQuc3BsaXQoJzonKTtcbiAgICBsZXQgZmlsdGVyID0gaW5wdXQ7XG5cbiAgICBpZiAoaW5wdXRBcnIubGVuZ3RoID4gMSkge1xuICAgICAgZmlsdGVyID0gaW5wdXRBcnJbMV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbHRlcjtcbiAgfVxuXG4gIGdldEVtcHR5TWVzc2FnZShpdGVtQ291bnQsIGZpbHRlcmVkSXRlbUNvdW50KSB7XG4gICAgaWYgKGl0ZW1Db3VudCA9PT0gMCkge1xuICAgICAgcmV0dXJuICdObyBwcm9qZWN0cyBzYXZlZCB5ZXQnO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdXBlci5nZXRFbXB0eU1lc3NhZ2UoaXRlbUNvdW50LCBmaWx0ZXJlZEl0ZW1Db3VudCk7XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlKCkge1xuICAgIGlmICh0aGlzLnBhbmVsICYmIHRoaXMucGFuZWwuaXNWaXNpYmxlKCkpIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcm9qZWN0cy5nZXRBbGwoKHByb2plY3RzKSA9PiB0aGlzLnNob3cocHJvamVjdHMpKTtcbiAgICB9XG4gIH1cblxuICBzaG93KHByb2plY3RzKSB7XG4gICAgaWYgKHRoaXMucGFuZWwgPT0gbnVsbCkge1xuICAgICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe2l0ZW06IHRoaXN9KTtcbiAgICB9XG5cbiAgICB0aGlzLnBhbmVsLnNob3coKTtcblxuICAgIGxldCBpdGVtcyA9IFtdO1xuICAgIGxldCBwcm9qZWN0O1xuICAgIGZvciAocHJvamVjdCBvZiBwcm9qZWN0cykge1xuICAgICAgaXRlbXMucHVzaChwcm9qZWN0LnByb3BzKTtcbiAgICB9XG5cbiAgICBpdGVtcyA9IHRoaXMuc29ydEl0ZW1zKGl0ZW1zKTtcbiAgICB0aGlzLnNldEl0ZW1zKGl0ZW1zKTtcbiAgICB0aGlzLmZvY3VzRmlsdGVyRWRpdG9yKCk7XG4gIH1cblxuICBjb25maXJtZWQocHJvcHMpIHtcbiAgICBpZiAocHJvcHMpIHtcbiAgICAgIGNvbnN0IHByb2plY3QgPSBuZXcgUHJvamVjdChwcm9wcyk7XG4gICAgICBwcm9qZWN0Lm9wZW4oKTtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICBpZiAodGhpcy5wYW5lbCkge1xuICAgICAgdGhpcy5wYW5lbC5kZXN0cm95KCk7XG4gICAgfVxuICB9XG5cbiAgY2FuY2VsbGVkKCkge1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgfVxuXG4gIHZpZXdGb3JJdGVtKHtfaWQsIHRpdGxlLCBncm91cCwgaWNvbiwgZGV2TW9kZSwgcGF0aHN9KSB7XG4gICAgbGV0IHNob3dQYXRoID0gdGhpcy5zaG93UGF0aDtcbiAgICByZXR1cm4gJCQoZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmxpKHtjbGFzczogJ3R3by1saW5lcyd9LCB7J2RhdGEtcHJvamVjdC1pZCc6IF9pZH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5kaXYoe2NsYXNzOiAncHJpbWFyeS1saW5lJ30sICgpID0+IHtcbiAgICAgICAgICBpZiAoZGV2TW9kZSkge1xuICAgICAgICAgICAgdGhpcy5zcGFuKHtjbGFzczogJ3Byb2plY3QtbWFuYWdlci1kZXZtb2RlJ30pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuZGl2KHtjbGFzczogYGljb24gJHtpY29ufWB9LCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNwYW4odGl0bGUpO1xuICAgICAgICAgICAgaWYgKGdyb3VwICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgdGhpcy5zcGFuKHtjbGFzczogJ3Byb2plY3QtbWFuYWdlci1saXN0LWdyb3VwJ30sIGdyb3VwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZGl2KHtjbGFzczogJ3NlY29uZGFyeS1saW5lJ30sICgpID0+IHtcbiAgICAgICAgICBpZiAoc2hvd1BhdGgpIHtcbiAgICAgICAgICAgIGxldCBwYXRoO1xuICAgICAgICAgICAgZm9yIChwYXRoIG9mIHBhdGhzKSB7XG4gICAgICAgICAgICAgIHRoaXMuZGl2KHtjbGFzczogJ25vLWljb24nfSwgcGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc29ydEl0ZW1zKGl0ZW1zKSB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5zb3J0Qnk7XG4gICAgaWYgKGtleSAhPT0gJ2RlZmF1bHQnKSB7XG4gICAgICBpdGVtcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGEgPSAoYVtrZXldIHx8ICdcXHVmZmZmJykudG9VcHBlckNhc2UoKTtcbiAgICAgICAgYiA9IChiW2tleV0gfHwgJ1xcdWZmZmYnKS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICAgIHJldHVybiBhID4gYiA/IDEgOiAtMTtcbiAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZW1zO1xuICB9XG59XG4iXX0=
//# sourceURL=/Users/anas/.atom/packages/project-manager/lib/projects-list-view.js
