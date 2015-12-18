'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var CompositeDisposable = undefined;
var ProjectsListView = undefined;
var Projects = undefined;
var SaveDialog = undefined;
var DB = undefined;

var ProjectManager = (function () {
  function ProjectManager() {
    _classCallCheck(this, ProjectManager);
  }

  _createClass(ProjectManager, null, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      CompositeDisposable = require('atom').CompositeDisposable;
      this.disposables = new CompositeDisposable();

      this.disposables.add(atom.commands.add('atom-workspace', {
        'project-manager:list-projects': function projectManagerListProjects() {
          ProjectsListView = require('./projects-list-view');
          var projectsListView = new ProjectsListView();
          projectsListView.toggle();
        },

        'project-manager:save-project': function projectManagerSaveProject() {
          SaveDialog = require('./save-dialog');
          var saveDialog = new SaveDialog();
          saveDialog.attach();
        },

        'project-manager:edit-projects': function projectManagerEditProjects() {
          DB = require('./db');
          var db = new DB();
          atom.workspace.open(db.file());
        }
      }));

      atom.project.onDidChangePaths(function () {
        return _this.updatePaths();
      });
      this.loadProject();
    }
  }, {
    key: 'loadProject',
    value: function loadProject() {
      var _this2 = this;

      Projects = require('./projects');
      this.projects = new Projects();
      this.projects.getCurrent(function (project) {
        if (project) {
          _this2.project = project;
          _this2.project.load();
        }
      });
    }
  }, {
    key: 'updatePaths',
    value: function updatePaths() {
      var paths = atom.project.getPaths();
      if (this.project && paths.length) {
        this.project.set('paths', paths);
      }
    }
  }, {
    key: 'provideProjects',
    value: function provideProjects() {
      Projects = require('./projects');
      return {
        projects: new Projects()
      };
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.disposables.dispose();
    }
  }, {
    key: 'config',
    get: function get() {
      return {
        showPath: {
          type: 'boolean',
          'default': true
        },
        closeCurrent: {
          type: 'boolean',
          'default': false,
          description: 'Currently disabled since it\'s broken.\n          Waiting for a better way to implement it.'
        },
        environmentSpecificProjects: {
          type: 'boolean',
          'default': false
        },
        sortBy: {
          type: 'string',
          description: 'Default sorting is the order in which the projects are',
          'default': 'default',
          'enum': ['default', 'title', 'group']
        }
      };
    }
  }]);

  return ProjectManager;
})();

exports['default'] = ProjectManager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdC1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7OztBQUVaLElBQUksbUJBQW1CLFlBQUEsQ0FBQztBQUN4QixJQUFJLGdCQUFnQixZQUFBLENBQUM7QUFDckIsSUFBSSxRQUFRLFlBQUEsQ0FBQztBQUNiLElBQUksVUFBVSxZQUFBLENBQUM7QUFDZixJQUFJLEVBQUUsWUFBQSxDQUFDOztJQUVjLGNBQWM7V0FBZCxjQUFjOzBCQUFkLGNBQWM7OztlQUFkLGNBQWM7O1dBMkJsQixvQkFBRzs7O0FBQ2hCLHlCQUFtQixHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQztBQUMxRCxVQUFJLENBQUMsV0FBVyxHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQzs7QUFFN0MsVUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDdkQsdUNBQStCLEVBQUUsc0NBQU07QUFDckMsMEJBQWdCLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDbkQsY0FBSSxnQkFBZ0IsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7QUFDOUMsMEJBQWdCLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDM0I7O0FBRUQsc0NBQThCLEVBQUUscUNBQU07QUFDcEMsb0JBQVUsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDdEMsY0FBSSxVQUFVLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztBQUNsQyxvQkFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3JCOztBQUVELHVDQUErQixFQUFFLHNDQUFNO0FBQ3JDLFlBQUUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDckIsY0FBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQztBQUNsQixjQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUNoQztPQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVKLFVBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7ZUFBTSxNQUFLLFdBQVcsRUFBRTtPQUFBLENBQUMsQ0FBQztBQUN4RCxVQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7S0FDcEI7OztXQUVpQix1QkFBRzs7O0FBQ25CLGNBQVEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDakMsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO0FBQy9CLFVBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQ2xDLFlBQUksT0FBTyxFQUFFO0FBQ1gsaUJBQUssT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixpQkFBSyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDckI7T0FDRixDQUFDLENBQUM7S0FDSjs7O1dBRWlCLHVCQUFHO0FBQ25CLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDcEMsVUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDaEMsWUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQ2xDO0tBQ0Y7OztXQUVxQiwyQkFBRztBQUN2QixjQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2pDLGFBQU87QUFDTCxnQkFBUSxFQUFFLElBQUksUUFBUSxFQUFFO09BQ3pCLENBQUM7S0FDSDs7O1dBRWdCLHNCQUFHO0FBQ2xCLFVBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDNUI7OztTQWhGZ0IsZUFBRztBQUNsQixhQUFPO0FBQ0wsZ0JBQVEsRUFBRTtBQUNSLGNBQUksRUFBRSxTQUFTO0FBQ2YscUJBQVMsSUFBSTtTQUNkO0FBQ0Qsb0JBQVksRUFBRTtBQUNaLGNBQUksRUFBRSxTQUFTO0FBQ2YscUJBQVMsS0FBSztBQUNkLHFCQUFXLCtGQUNpQztTQUM3QztBQUNELG1DQUEyQixFQUFFO0FBQzNCLGNBQUksRUFBRSxTQUFTO0FBQ2YscUJBQVMsS0FBSztTQUNmO0FBQ0QsY0FBTSxFQUFFO0FBQ04sY0FBSSxFQUFFLFFBQVE7QUFDZCxxQkFBVyxFQUFFLHdEQUF3RDtBQUNyRSxxQkFBUyxTQUFTO0FBQ2xCLGtCQUFNLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7U0FDcEM7T0FDRixDQUFDO0tBQ0g7OztTQXpCa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9wcm9qZWN0LW1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxubGV0IENvbXBvc2l0ZURpc3Bvc2FibGU7XG5sZXQgUHJvamVjdHNMaXN0VmlldztcbmxldCBQcm9qZWN0cztcbmxldCBTYXZlRGlhbG9nO1xubGV0IERCO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm9qZWN0TWFuYWdlciB7XG5cbiAgc3RhdGljIGdldCBjb25maWcoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNob3dQYXRoOiB7XG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGNsb3NlQ3VycmVudDoge1xuICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICBkZXNjcmlwdGlvbjogYEN1cnJlbnRseSBkaXNhYmxlZCBzaW5jZSBpdFxcJ3MgYnJva2VuLlxuICAgICAgICAgIFdhaXRpbmcgZm9yIGEgYmV0dGVyIHdheSB0byBpbXBsZW1lbnQgaXQuYFxuICAgICAgfSxcbiAgICAgIGVudmlyb25tZW50U3BlY2lmaWNQcm9qZWN0czoge1xuICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICB9LFxuICAgICAgc29ydEJ5OiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0RlZmF1bHQgc29ydGluZyBpcyB0aGUgb3JkZXIgaW4gd2hpY2ggdGhlIHByb2plY3RzIGFyZScsXG4gICAgICAgIGRlZmF1bHQ6ICdkZWZhdWx0JyxcbiAgICAgICAgZW51bTogWydkZWZhdWx0JywgJ3RpdGxlJywgJ2dyb3VwJ11cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGFjdGl2YXRlKCkge1xuICAgIENvbXBvc2l0ZURpc3Bvc2FibGUgPSByZXF1aXJlKCdhdG9tJykuQ29tcG9zaXRlRGlzcG9zYWJsZTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdwcm9qZWN0LW1hbmFnZXI6bGlzdC1wcm9qZWN0cyc6ICgpID0+IHtcbiAgICAgICAgUHJvamVjdHNMaXN0VmlldyA9IHJlcXVpcmUoJy4vcHJvamVjdHMtbGlzdC12aWV3Jyk7XG4gICAgICAgIGxldCBwcm9qZWN0c0xpc3RWaWV3ID0gbmV3IFByb2plY3RzTGlzdFZpZXcoKTtcbiAgICAgICAgcHJvamVjdHNMaXN0Vmlldy50b2dnbGUoKTtcbiAgICAgIH0sXG5cbiAgICAgICdwcm9qZWN0LW1hbmFnZXI6c2F2ZS1wcm9qZWN0JzogKCkgPT4ge1xuICAgICAgICBTYXZlRGlhbG9nID0gcmVxdWlyZSgnLi9zYXZlLWRpYWxvZycpO1xuICAgICAgICBsZXQgc2F2ZURpYWxvZyA9IG5ldyBTYXZlRGlhbG9nKCk7XG4gICAgICAgIHNhdmVEaWFsb2cuYXR0YWNoKCk7XG4gICAgICB9LFxuXG4gICAgICAncHJvamVjdC1tYW5hZ2VyOmVkaXQtcHJvamVjdHMnOiAoKSA9PiB7XG4gICAgICAgIERCID0gcmVxdWlyZSgnLi9kYicpO1xuICAgICAgICBsZXQgZGIgPSBuZXcgREIoKTtcbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihkYi5maWxlKCkpO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzKCgpID0+IHRoaXMudXBkYXRlUGF0aHMoKSk7XG4gICAgdGhpcy5sb2FkUHJvamVjdCgpO1xuICB9XG5cbiAgc3RhdGljIGxvYWRQcm9qZWN0KCkge1xuICAgIFByb2plY3RzID0gcmVxdWlyZSgnLi9wcm9qZWN0cycpO1xuICAgIHRoaXMucHJvamVjdHMgPSBuZXcgUHJvamVjdHMoKTtcbiAgICB0aGlzLnByb2plY3RzLmdldEN1cnJlbnQocHJvamVjdCA9PiB7XG4gICAgICBpZiAocHJvamVjdCkge1xuICAgICAgICB0aGlzLnByb2plY3QgPSBwcm9qZWN0O1xuICAgICAgICB0aGlzLnByb2plY3QubG9hZCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIHVwZGF0ZVBhdGhzKCkge1xuICAgIGxldCBwYXRocyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpO1xuICAgIGlmICh0aGlzLnByb2plY3QgJiYgcGF0aHMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnByb2plY3Quc2V0KCdwYXRocycsIHBhdGhzKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgcHJvdmlkZVByb2plY3RzKCkge1xuICAgIFByb2plY3RzID0gcmVxdWlyZSgnLi9wcm9qZWN0cycpO1xuICAgIHJldHVybiB7XG4gICAgICBwcm9qZWN0czogbmV3IFByb2plY3RzKClcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKCk7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/anas/.atom/packages/project-manager/lib/project-manager.js
