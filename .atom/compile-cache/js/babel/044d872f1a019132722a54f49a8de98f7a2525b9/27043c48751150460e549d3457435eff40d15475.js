Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

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
        this.panel.emitter.emit('did-destroy');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdHMtbGlzdC12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O2lDQUVpQyxzQkFBc0I7OzhCQUN6QyxpQkFBaUI7Ozs7d0JBQ1YsWUFBWTs7Ozt1QkFDYixXQUFXOzs7O0FBTC9CLFdBQVcsQ0FBQzs7SUFPUyxnQkFBZ0I7WUFBaEIsZ0JBQWdCOztXQUFoQixnQkFBZ0I7MEJBQWhCLGdCQUFnQjs7K0JBQWhCLGdCQUFnQjs7O2VBQWhCLGdCQUFnQjs7V0FDekIsc0JBQUc7QUFDWCxpQ0FGaUIsZ0JBQWdCLDRDQUVkO0FBQ25CLFVBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUNqQyxVQUFJLENBQUMsUUFBUSxHQUFHLDJCQUFjLENBQUM7S0FDaEM7OztXQUVPLG9CQUFHOztLQUVWOzs7V0FrQlcsd0JBQUc7QUFDYixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDOUMsVUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxVQUFNLFdBQVcsR0FBRyw0QkFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JFLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQzs7QUFFbkMsVUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxXQUFXLEVBQUU7QUFDdEMsY0FBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUN0Qjs7QUFFRCxhQUFPLE1BQU0sQ0FBQztLQUNmOzs7V0FFYSwwQkFBRztBQUNmLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM5QyxVQUFN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QUFDLENBQUM7U0FDdkIsQ0FBQyxDQUFDO09BRUo7O0FBRUQsYUFBTyxLQUFLLENBQUM7S0FDZDs7O1NBdElxQixlQUFHO0FBQ3ZCLGFBQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0tBQ3ZDOzs7U0FFbUIsZUFBRztBQUNyQixhQUFPLE9BQU8sQ0FBQztLQUNoQjs7O1NBRVMsZUFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztLQUNsRDs7O1NBRVcsZUFBRztBQUNiLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztLQUNwRDs7O1NBekJrQixnQkFBZ0I7OztxQkFBaEIsZ0JBQWdCIiwiZmlsZSI6Ii9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdHMtbGlzdC12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7U2VsZWN0TGlzdFZpZXcsICQkfSBmcm9tICdhdG9tLXNwYWNlLXBlbi12aWV3cyc7XG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlLXBsdXMnO1xuaW1wb3J0IFByb2plY3RzIGZyb20gJy4vcHJvamVjdHMnO1xuaW1wb3J0IFByb2plY3QgZnJvbSAnLi9wcm9qZWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvamVjdHNMaXN0VmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3IHtcbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5hZGRDbGFzcygncHJvamVjdC1tYW5hZ2VyJyk7XG4gICAgdGhpcy5wcm9qZWN0cyA9IG5ldyBQcm9qZWN0cygpO1xuICB9XG5cbiAgYWN0aXZhdGUoKSB7XG4gICAgLy8gcmV0dXJuIG5ldyBQcm9qZWN0TGlzdFZpZXcoKTtcbiAgfVxuXG4gIGdldCBwb3NzaWJsZUZpbHRlcktleXMoKSB7XG4gICAgcmV0dXJuIFsndGl0bGUnLCAnZ3JvdXAnLCAndGVtcGxhdGUnXTtcbiAgfVxuXG4gIGdldCBkZWZhdWx0RmlsdGVyS2V5KCkge1xuICAgIHJldHVybiAndGl0bGUnO1xuICB9XG5cbiAgZ2V0IHNvcnRCeSgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdwcm9qZWN0LW1hbmFnZXIuc29ydEJ5Jyk7XG4gIH1cblxuICBnZXQgc2hvd1BhdGgoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgncHJvamVjdC1tYW5hZ2VyLnNob3dQYXRoJyk7XG4gIH1cblxuICBnZXRGaWx0ZXJLZXkoKSB7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLmZpbHRlckVkaXRvclZpZXcuZ2V0VGV4dCgpO1xuICAgIGNvbnN0IGlucHV0QXJyID0gaW5wdXQuc3BsaXQoJzonKTtcbiAgICBjb25zdCBpc0ZpbHRlcktleSA9IF8uY29udGFpbnModGhpcy5wb3NzaWJsZUZpbHRlcktleXMsIGlucHV0QXJyWzBdKTtcbiAgICBsZXQgZmlsdGVyID0gdGhpcy5kZWZhdWx0RmlsdGVyS2V5O1xuXG4gICAgaWYgKGlucHV0QXJyLmxlbmd0aCA+IDEgJiYgaXNGaWx0ZXJLZXkpIHtcbiAgICAgIGZpbHRlciA9IGlucHV0QXJyWzBdO1xuICAgIH1cblxuICAgIHJldHVybiBmaWx0ZXI7XG4gIH1cblxuICBnZXRGaWx0ZXJRdWVyeSgpIHtcbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuZmlsdGVyRWRpdG9yVmlldy5nZXRUZXh0KCk7XG4gICAgY29uc3QgaW5wdXRBcnIgPSBpbnB1dC5zcGxpdCgnOicpO1xuICAgIGxldCBmaWx0ZXIgPSBpbnB1dDtcblxuICAgIGlmIChpbnB1dEFyci5sZW5ndGggPiAxKSB7XG4gICAgICBmaWx0ZXIgPSBpbnB1dEFyclsxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmlsdGVyO1xuICB9XG5cbiAgZ2V0RW1wdHlNZXNzYWdlKGl0ZW1Db3VudCwgZmlsdGVyZWRJdGVtQ291bnQpIHtcbiAgICBpZiAoaXRlbUNvdW50ID09PSAwKSB7XG4gICAgICByZXR1cm4gJ05vIHByb2plY3RzIHNhdmVkIHlldCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1cGVyLmdldEVtcHR5TWVzc2FnZShpdGVtQ291bnQsIGZpbHRlcmVkSXRlbUNvdW50KTtcbiAgICB9XG4gIH1cblxuICB0b2dnbGUoKSB7XG4gICAgaWYgKHRoaXMucGFuZWwgJiYgdGhpcy5wYW5lbC5pc1Zpc2libGUoKSkge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb2plY3RzLmdldEFsbCgocHJvamVjdHMpID0+IHRoaXMuc2hvdyhwcm9qZWN0cykpO1xuICAgIH1cbiAgfVxuXG4gIHNob3cocHJvamVjdHMpIHtcbiAgICBpZiAodGhpcy5wYW5lbCA9PSBudWxsKSB7XG4gICAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7aXRlbTogdGhpc30pO1xuICAgIH1cblxuICAgIHRoaXMucGFuZWwuc2hvdygpO1xuXG4gICAgbGV0IGl0ZW1zID0gW107XG4gICAgbGV0IHByb2plY3Q7XG4gICAgZm9yIChwcm9qZWN0IG9mIHByb2plY3RzKSB7XG4gICAgICBpdGVtcy5wdXNoKHByb2plY3QucHJvcHMpO1xuICAgIH1cblxuICAgIGl0ZW1zID0gdGhpcy5zb3J0SXRlbXMoaXRlbXMpO1xuICAgIHRoaXMuc2V0SXRlbXMoaXRlbXMpO1xuICAgIHRoaXMuZm9jdXNGaWx0ZXJFZGl0b3IoKTtcbiAgfVxuXG4gIGNvbmZpcm1lZChwcm9wcykge1xuICAgIGlmIChwcm9wcykge1xuICAgICAgY29uc3QgcHJvamVjdCA9IG5ldyBQcm9qZWN0KHByb3BzKTtcbiAgICAgIHByb2plY3Qub3BlbigpO1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIGlmICh0aGlzLnBhbmVsKSB7XG4gICAgICB0aGlzLnBhbmVsLmVtaXR0ZXIuZW1pdCgnZGlkLWRlc3Ryb3knKTtcbiAgICB9XG4gIH1cblxuICBjYW5jZWxsZWQoKSB7XG4gICAgdGhpcy5jbG9zZSgpO1xuICB9XG5cbiAgdmlld0Zvckl0ZW0oe19pZCwgdGl0bGUsIGdyb3VwLCBpY29uLCBkZXZNb2RlLCBwYXRoc30pIHtcbiAgICBsZXQgc2hvd1BhdGggPSB0aGlzLnNob3dQYXRoO1xuICAgIHJldHVybiAkJChmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMubGkoe2NsYXNzOiAndHdvLWxpbmVzJ30sIHsnZGF0YS1wcm9qZWN0LWlkJzogX2lkfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLmRpdih7Y2xhc3M6ICdwcmltYXJ5LWxpbmUnfSwgKCkgPT4ge1xuICAgICAgICAgIGlmIChkZXZNb2RlKSB7XG4gICAgICAgICAgICB0aGlzLnNwYW4oe2NsYXNzOiAncHJvamVjdC1tYW5hZ2VyLWRldm1vZGUnfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5kaXYoe2NsYXNzOiBgaWNvbiAke2ljb259YH0sICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3Bhbih0aXRsZSk7XG4gICAgICAgICAgICBpZiAoZ3JvdXAgIT0gbnVsbCkge1xuICAgICAgICAgICAgICB0aGlzLnNwYW4oe2NsYXNzOiAncHJvamVjdC1tYW5hZ2VyLWxpc3QtZ3JvdXAnfSwgZ3JvdXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kaXYoe2NsYXNzOiAnc2Vjb25kYXJ5LWxpbmUnfSwgKCkgPT4ge1xuICAgICAgICAgIGlmIChzaG93UGF0aCkge1xuICAgICAgICAgICAgbGV0IHBhdGg7XG4gICAgICAgICAgICBmb3IgKHBhdGggb2YgcGF0aHMpIHtcbiAgICAgICAgICAgICAgdGhpcy5kaXYoe2NsYXNzOiAnbm8taWNvbid9LCBwYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzb3J0SXRlbXMoaXRlbXMpIHtcbiAgICBjb25zdCBrZXkgPSB0aGlzLnNvcnRCeTtcbiAgICBpZiAoa2V5ICE9PSAnZGVmYXVsdCcpIHtcbiAgICAgIGl0ZW1zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgYSA9IChhW2tleV0gfHwgJ1xcdWZmZmYnKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICBiID0gKGJba2V5XSB8fCAnXFx1ZmZmZicpLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgcmV0dXJuIGEgPiBiID8gMSA6IC0xO1xuICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICByZXR1cm4gaXRlbXM7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/anas/.atom/packages/project-manager/lib/projects-list-view.js
