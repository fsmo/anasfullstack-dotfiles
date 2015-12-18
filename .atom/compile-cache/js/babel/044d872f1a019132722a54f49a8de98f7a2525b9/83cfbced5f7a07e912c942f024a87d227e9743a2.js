Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

var _project = require('./project');

var _project2 = _interopRequireDefault(_project);

'use babel';

var Projects = (function () {
  function Projects() {
    var _this = this;

    _classCallCheck(this, Projects);

    this.emitter = new _atom.Emitter();
    this.db = new _db2['default']();
    this.db.onUpdate(function () {
      return _this.emitter.emit('projects-updated');
    });
  }

  _createClass(Projects, [{
    key: 'onUpdate',
    value: function onUpdate(callback) {
      this.emitter.on('projects-updated', callback);
    }
  }, {
    key: 'getAll',
    value: function getAll(callback) {
      this.db.find(function (projectSettings) {
        var projects = [];
        var setting = undefined;
        var project = undefined;
        var key = undefined;
        for (key in projectSettings) {
          setting = projectSettings[key];
          if (setting.paths) {
            project = new _project2['default'](setting);
            projects.push(project);
          }
        }

        callback(projects);
      });
    }
  }, {
    key: 'getCurrent',
    value: function getCurrent(callback) {
      this.getAll(function (projects) {
        projects.forEach(function (project) {
          if (project.isCurrent()) {
            callback(project);
          }
        });
      });
    }
  }]);

  return Projects;
})();

exports['default'] = Projects;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFc0IsTUFBTTs7a0JBQ2IsTUFBTTs7Ozt1QkFDRCxXQUFXOzs7O0FBSi9CLFdBQVcsQ0FBQzs7SUFNUyxRQUFRO0FBQ2hCLFdBRFEsUUFBUSxHQUNiOzs7MEJBREssUUFBUTs7QUFFekIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxFQUFFLEdBQUcscUJBQVEsQ0FBQztBQUNuQixRQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQzthQUFNLE1BQUssT0FBTyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztLQUFBLENBQUMsQ0FBQztHQUMvRDs7ZUFMa0IsUUFBUTs7V0FPbkIsa0JBQUMsUUFBUSxFQUFFO0FBQ2pCLFVBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQy9DOzs7V0FFSyxnQkFBQyxRQUFRLEVBQUU7QUFDZixVQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLGVBQWUsRUFBSTtBQUM5QixZQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbEIsWUFBSSxPQUFPLFlBQUEsQ0FBQztBQUNaLFlBQUksT0FBTyxZQUFBLENBQUM7QUFDWixZQUFJLEdBQUcsWUFBQSxDQUFDO0FBQ1IsYUFBSyxHQUFHLElBQUksZUFBZSxFQUFFO0FBQzNCLGlCQUFPLEdBQUcsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQy9CLGNBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtBQUNqQixtQkFBTyxHQUFHLHlCQUFZLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLG9CQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1dBQ3hCO1NBQ0Y7O0FBRUQsZ0JBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUNwQixDQUFDLENBQUM7S0FDSjs7O1dBRVMsb0JBQUMsUUFBUSxFQUFFO0FBQ25CLFVBQUksQ0FBQyxNQUFNLENBQUMsVUFBQSxRQUFRLEVBQUk7QUFDdEIsZ0JBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPLEVBQUk7QUFDMUIsY0FBSSxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUU7QUFDdkIsb0JBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztXQUNuQjtTQUNGLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7U0FyQ2tCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHtFbWl0dGVyfSBmcm9tICdhdG9tJztcbmltcG9ydCBEQiBmcm9tICcuL2RiJztcbmltcG9ydCBQcm9qZWN0IGZyb20gJy4vcHJvamVjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2plY3RzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgICB0aGlzLmRiID0gbmV3IERCKCk7XG4gICAgdGhpcy5kYi5vblVwZGF0ZSgoKSA9PiB0aGlzLmVtaXR0ZXIuZW1pdCgncHJvamVjdHMtdXBkYXRlZCcpKTtcbiAgfVxuXG4gIG9uVXBkYXRlKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5lbWl0dGVyLm9uKCdwcm9qZWN0cy11cGRhdGVkJywgY2FsbGJhY2spO1xuICB9XG5cbiAgZ2V0QWxsKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5kYi5maW5kKHByb2plY3RTZXR0aW5ncyA9PiB7XG4gICAgICBsZXQgcHJvamVjdHMgPSBbXTtcbiAgICAgIGxldCBzZXR0aW5nO1xuICAgICAgbGV0IHByb2plY3Q7XG4gICAgICBsZXQga2V5O1xuICAgICAgZm9yIChrZXkgaW4gcHJvamVjdFNldHRpbmdzKSB7XG4gICAgICAgIHNldHRpbmcgPSBwcm9qZWN0U2V0dGluZ3Nba2V5XTtcbiAgICAgICAgaWYgKHNldHRpbmcucGF0aHMpIHtcbiAgICAgICAgICBwcm9qZWN0ID0gbmV3IFByb2plY3Qoc2V0dGluZyk7XG4gICAgICAgICAgcHJvamVjdHMucHVzaChwcm9qZWN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjYWxsYmFjayhwcm9qZWN0cyk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRDdXJyZW50KGNhbGxiYWNrKSB7XG4gICAgdGhpcy5nZXRBbGwocHJvamVjdHMgPT4ge1xuICAgICAgcHJvamVjdHMuZm9yRWFjaChwcm9qZWN0ID0+IHtcbiAgICAgICAgaWYgKHByb2plY3QuaXNDdXJyZW50KCkpIHtcbiAgICAgICAgICBjYWxsYmFjayhwcm9qZWN0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/anas/.atom/packages/project-manager/lib/projects.js
