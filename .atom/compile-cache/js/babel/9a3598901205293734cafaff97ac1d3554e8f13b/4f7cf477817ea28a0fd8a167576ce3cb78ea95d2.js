Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _season = require('season');

var _season2 = _interopRequireDefault(_season);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

'use babel';

var DB = (function () {
  function DB() {
    var _this = this;

    var searchKey = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
    var searchValue = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    _classCallCheck(this, DB);

    this.setSearchQuery(searchKey, searchValue);
    this.emitter = new _atom.Emitter();

    _fs2['default'].exists(this.file(), function (exists) {
      if (exists) {
        _this.observeProjects();
      } else {
        _this.writeFile({});
      }
    });
  }

  _createClass(DB, [{
    key: 'setSearchQuery',
    value: function setSearchQuery() {
      var searchKey = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
      var searchValue = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      this.searchKey = searchKey;
      this.searchValue = searchValue;
    }
  }, {
    key: 'find',
    value: function find(callback) {
      var _this2 = this;

      this.readFile(function (results) {
        var found = false;
        var projects = [];
        var project = null;
        var result = null;
        var template = null;
        var key = undefined;

        for (key in results) {
          result = results[key];
          template = result.template || null;
          result._id = key;

          if (template && results[template] !== null) {
            result = _underscorePlus2['default'].deepExtend(result, results[template]);
          }

          projects.push(result);
        }

        if (_this2.searchKey && _this2.searchValue) {
          for (key in projects) {
            project = projects[key];
            if (_underscorePlus2['default'].isEqual(project[_this2.searchKey], _this2.searchValue)) {
              found = project;
            }
          }
        } else {
          found = projects;
        }

        callback(found);
      });
    }
  }, {
    key: 'add',
    value: function add(props, callback) {
      var _this3 = this;

      this.readFile(function (projects) {
        var id = _this3.generateID(props.title);
        projects[id] = props;

        _this3.writeFile(projects, function () {
          atom.notifications.addSuccess(props.title + ' has been added');
          callback(id);
        });
      });
    }
  }, {
    key: 'update',
    value: function update(props) {
      var _this4 = this;

      if (!props._id) {
        return false;
      }

      var project = null;
      var key = undefined;
      this.readFile(function (projects) {
        for (key in projects) {
          project = projects[key];
          if (key === props._id) {
            delete props._id;
            projects[key] = props;
          }

          _this4.writeFile(projects);
        }
      });
    }
  }, {
    key: 'delete',
    value: function _delete(id, callback) {
      var _this5 = this;

      this.readFile(function (projects) {
        for (var key in projects) {
          if (key === id) {
            delete projects[key];
          }
        }

        _this5.writeFile(projects, function () {
          if (callback) {
            callback();
          }
        });
      });
    }
  }, {
    key: 'onUpdate',
    value: function onUpdate(callback) {
      var _this6 = this;

      this.emitter.on('db-updated', function () {
        _this6.find(callback);
      });
    }
  }, {
    key: 'observeProjects',
    value: function observeProjects() {
      var _this7 = this;

      if (this.fileWatcher) {
        this.fileWatcher.close();
      }

      try {
        this.fileWatcher = _fs2['default'].watch(this.file(), function () {
          _this7.emitter.emit('db-updated');
        });
      } catch (error) {
        var url = 'https://github.com/atom/atom/blob/master/docs/';
        url += 'build-instructions/linux.md#typeerror-unable-to-watch-path';
        var filename = _path2['default'].basename(this.file());
        var errorMessage = '<b>Project Manager</b><br>Could not watch changes\n        to ' + filename + '. Make sure you have permissions to ' + this.file() + '.\n        On linux there can be problems with watch sizes.\n        See <a href=\'' + url + '\'> this document</a> for more info.>';
        this.notifyFailure(errorMessage);
      }
    }
  }, {
    key: 'updateFile',
    value: function updateFile() {
      var _this8 = this;

      _fs2['default'].exists(this.file(true), function (exists) {
        if (!exists) {
          _this8.writeFile({});
        }
      });
    }
  }, {
    key: 'generateID',
    value: function generateID(string) {
      return string.replace(/\s+/g, '').toLowerCase();
    }
  }, {
    key: 'file',
    value: function file() {
      var filename = 'projects.cson';
      var filedir = atom.getConfigDirPath();

      if (this.environmentSpecificProjects) {
        var hostname = _os2['default'].hostname().split('.').shift().toLowerCase();
        filename = 'projects.' + hostname + '.cson';
      }

      return filedir + '/' + filename;
    }
  }, {
    key: 'readFile',
    value: function readFile(callback) {
      var _this9 = this;

      _fs2['default'].exists(this.file(), function (exists) {
        if (exists) {
          try {
            var projects = _season2['default'].readFileSync(_this9.file()) || {};
            callback(projects);
          } catch (error) {
            var message = 'Failed to load ' + _path2['default'].basename(_this9.file());
            var detail = error.location != null ? error.stack : error.message;
            _this9.notifyFailure(message, detail);
          }
        } else {
          _fs2['default'].writeFile(_this9.file(), '{}', function () {
            return callback({});
          });
        }
      });
    }
  }, {
    key: 'writeFile',
    value: function writeFile(projects, callback) {
      _season2['default'].writeFileSync(this.file(), projects);
      if (callback) {
        callback();
      }
    }
  }, {
    key: 'notifyFailure',
    value: function notifyFailure(message) {
      var detail = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      atom.notifications.addError(message, {
        detail: detail,
        dismissable: true
      });
    }
  }], [{
    key: 'environmentSpecificProjects',
    get: function get() {
      return atom.config.get('project-manager.environmentSpecificProjects');
    }
  }]);

  return DB;
})();

exports['default'] = DB;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvZGIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFc0IsTUFBTTs7c0JBQ1gsUUFBUTs7OztrQkFDVixJQUFJOzs7O29CQUNGLE1BQU07Ozs7a0JBQ1IsSUFBSTs7Ozs4QkFDTCxpQkFBaUI7Ozs7QUFQL0IsV0FBVyxDQUFDOztJQVNTLEVBQUU7QUFDVixXQURRLEVBQUUsR0FDeUI7OztRQUFsQyxTQUFTLHlEQUFDLElBQUk7UUFBRSxXQUFXLHlEQUFDLElBQUk7OzBCQUR6QixFQUFFOztBQUVuQixRQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUM1QyxRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUM7O0FBRTdCLG9CQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsVUFBQyxNQUFNLEVBQUs7QUFDakMsVUFBSSxNQUFNLEVBQUU7QUFDVixjQUFLLGVBQWUsRUFBRSxDQUFDO09BQ3hCLE1BQU07QUFDTCxjQUFLLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztPQUNwQjtLQUNGLENBQUMsQ0FBQztHQUNKOztlQVprQixFQUFFOztXQWtCUCwwQkFBbUM7VUFBbEMsU0FBUyx5REFBQyxJQUFJO1VBQUUsV0FBVyx5REFBQyxJQUFJOztBQUM3QyxVQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUMzQixVQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztLQUNoQzs7O1dBRUcsY0FBQyxRQUFRLEVBQUU7OztBQUNiLFVBQUksQ0FBQyxRQUFRLENBQUMsVUFBQSxPQUFPLEVBQUk7QUFDdkIsWUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ2xCLFlBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNsQixZQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDbkIsWUFBSSxNQUFNLEdBQUcs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QUUsQ0FBQztXQUFBLENBQUMsQ0FBQztTQUNyRDtPQUNGLENBQUMsQ0FBQztLQUNKOzs7V0FFUSxtQkFBQyxRQUFRLEVBQUUsUUFBUSxFQUFFO0FBQzVCLDBCQUFLLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDMUMsVUFBSSxRQUFRLEVBQUU7QUFDWixnQkFBUSxFQUFFLENBQUM7T0FDWjtLQUNGOzs7V0FFWSx1QkFBQyxPQUFPLEVBQWU7VUFBYixNQUFNLHlEQUFDLElBQUk7O0FBQ2hDLFVBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtBQUNuQyxjQUFNLEVBQUUsTUFBTTtBQUNkLG1CQUFXLEVBQUUsSUFBSTtPQUNsQixDQUFDLENBQUM7S0FDSjs7O1NBN0txQyxlQUFHO0FBQ3ZDLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNkNBQTZDLENBQUMsQ0FBQztLQUN2RTs7O1NBaEJrQixFQUFFOzs7cUJBQUYsRUFBRSIsImZpbGUiOiIvVXNlcnMvYW5hcy8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL2RiLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7RW1pdHRlcn0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgQ1NPTiBmcm9tICdzZWFzb24nO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IG9zIGZyb20gJ29zJztcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUtcGx1cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERCIHtcbiAgY29uc3RydWN0b3Ioc2VhcmNoS2V5PW51bGwsIHNlYXJjaFZhbHVlPW51bGwpIHtcbiAgICB0aGlzLnNldFNlYXJjaFF1ZXJ5KHNlYXJjaEtleSwgc2VhcmNoVmFsdWUpO1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG5cbiAgICBmcy5leGlzdHModGhpcy5maWxlKCksIChleGlzdHMpID0+IHtcbiAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlUHJvamVjdHMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMud3JpdGVGaWxlKHt9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgZW52aXJvbm1lbnRTcGVjaWZpY1Byb2plY3RzKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ3Byb2plY3QtbWFuYWdlci5lbnZpcm9ubWVudFNwZWNpZmljUHJvamVjdHMnKTtcbiAgfVxuXG4gIHNldFNlYXJjaFF1ZXJ5KHNlYXJjaEtleT1udWxsLCBzZWFyY2hWYWx1ZT1udWxsKSB7XG4gICAgdGhpcy5zZWFyY2hLZXkgPSBzZWFyY2hLZXk7XG4gICAgdGhpcy5zZWFyY2hWYWx1ZSA9IHNlYXJjaFZhbHVlO1xuICB9XG5cbiAgZmluZChjYWxsYmFjaykge1xuICAgIHRoaXMucmVhZEZpbGUocmVzdWx0cyA9PiB7XG4gICAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICAgIGxldCBwcm9qZWN0cyA9IFtdO1xuICAgICAgbGV0IHByb2plY3QgPSBudWxsO1xuICAgICAgbGV0IHJlc3VsdCA9IG51bGw7XG4gICAgICBsZXQgdGVtcGxhdGUgPSBudWxsO1xuICAgICAgbGV0IGtleTtcblxuICAgICAgZm9yIChrZXkgaW4gcmVzdWx0cykge1xuICAgICAgICByZXN1bHQgPSByZXN1bHRzW2tleV07XG4gICAgICAgIHRlbXBsYXRlID0gcmVzdWx0LnRlbXBsYXRlIHx8IG51bGw7XG4gICAgICAgIHJlc3VsdC5faWQgPSBrZXk7XG5cbiAgICAgICAgaWYgKHRlbXBsYXRlICYmIHJlc3VsdHNbdGVtcGxhdGVdICE9PSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0ID0gXy5kZWVwRXh0ZW5kKHJlc3VsdCwgcmVzdWx0c1t0ZW1wbGF0ZV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvamVjdHMucHVzaChyZXN1bHQpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zZWFyY2hLZXkgJiYgdGhpcy5zZWFyY2hWYWx1ZSkge1xuICAgICAgICBmb3IgKGtleSBpbiBwcm9qZWN0cykge1xuICAgICAgICAgIHByb2plY3QgPSBwcm9qZWN0c1trZXldO1xuICAgICAgICAgIGlmIChfLmlzRXF1YWwocHJvamVjdFt0aGlzLnNlYXJjaEtleV0sIHRoaXMuc2VhcmNoVmFsdWUpKSB7XG4gICAgICAgICAgICBmb3VuZCA9IHByb2plY3Q7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3VuZCA9IHByb2plY3RzO1xuICAgICAgfVxuXG4gICAgICBjYWxsYmFjayhmb3VuZCk7XG4gICAgfSk7XG4gIH1cblxuICBhZGQocHJvcHMsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5yZWFkRmlsZShwcm9qZWN0cyA9PiB7XG4gICAgICBjb25zdCBpZCA9IHRoaXMuZ2VuZXJhdGVJRChwcm9wcy50aXRsZSk7XG4gICAgICBwcm9qZWN0c1tpZF0gPSBwcm9wcztcblxuICAgICAgdGhpcy53cml0ZUZpbGUocHJvamVjdHMsICgpID0+IHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoYCR7cHJvcHMudGl0bGV9IGhhcyBiZWVuIGFkZGVkYCk7XG4gICAgICAgIGNhbGxiYWNrKGlkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlKHByb3BzKSB7XG4gICAgaWYgKCFwcm9wcy5faWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgcHJvamVjdCA9IG51bGw7XG4gICAgbGV0IGtleTtcbiAgICB0aGlzLnJlYWRGaWxlKHByb2plY3RzID0+IHtcbiAgICAgIGZvciAoa2V5IGluIHByb2plY3RzKSB7XG4gICAgICAgIHByb2plY3QgPSBwcm9qZWN0c1trZXldO1xuICAgICAgICBpZiAoa2V5ID09PSBwcm9wcy5faWQpIHtcbiAgICAgICAgICBkZWxldGUocHJvcHMuX2lkKTtcbiAgICAgICAgICBwcm9qZWN0c1trZXldID0gcHJvcHM7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLndyaXRlRmlsZShwcm9qZWN0cyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBkZWxldGUoaWQsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5yZWFkRmlsZShwcm9qZWN0cyA9PiB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gcHJvamVjdHMpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gaWQpIHtcbiAgICAgICAgICBkZWxldGUocHJvamVjdHNba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy53cml0ZUZpbGUocHJvamVjdHMsICgpID0+IHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBvblVwZGF0ZShjYWxsYmFjaykge1xuICAgIHRoaXMuZW1pdHRlci5vbignZGItdXBkYXRlZCcsICgpID0+IHtcbiAgICAgIHRoaXMuZmluZChjYWxsYmFjayk7XG4gICAgfSk7XG4gIH1cblxuICBvYnNlcnZlUHJvamVjdHMoKSB7XG4gICAgaWYgKHRoaXMuZmlsZVdhdGNoZXIpIHtcbiAgICAgIHRoaXMuZmlsZVdhdGNoZXIuY2xvc2UoKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5maWxlV2F0Y2hlciA9IGZzLndhdGNoKHRoaXMuZmlsZSgpLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkYi11cGRhdGVkJyk7XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbGV0IHVybCA9ICdodHRwczovL2dpdGh1Yi5jb20vYXRvbS9hdG9tL2Jsb2IvbWFzdGVyL2RvY3MvJztcbiAgICAgIHVybCArPSAnYnVpbGQtaW5zdHJ1Y3Rpb25zL2xpbnV4Lm1kI3R5cGVlcnJvci11bmFibGUtdG8td2F0Y2gtcGF0aCc7XG4gICAgICBjb25zdCBmaWxlbmFtZSA9IHBhdGguYmFzZW5hbWUodGhpcy5maWxlKCkpO1xuICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYDxiPlByb2plY3QgTWFuYWdlcjwvYj48YnI+Q291bGQgbm90IHdhdGNoIGNoYW5nZXNcbiAgICAgICAgdG8gJHtmaWxlbmFtZX0uIE1ha2Ugc3VyZSB5b3UgaGF2ZSBwZXJtaXNzaW9ucyB0byAke3RoaXMuZmlsZSgpfS5cbiAgICAgICAgT24gbGludXggdGhlcmUgY2FuIGJlIHByb2JsZW1zIHdpdGggd2F0Y2ggc2l6ZXMuXG4gICAgICAgIFNlZSA8YSBocmVmPScke3VybH0nPiB0aGlzIGRvY3VtZW50PC9hPiBmb3IgbW9yZSBpbmZvLj5gO1xuICAgICAgdGhpcy5ub3RpZnlGYWlsdXJlKGVycm9yTWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlRmlsZSgpIHtcbiAgICBmcy5leGlzdHModGhpcy5maWxlKHRydWUpLCAoZXhpc3RzKSA9PiB7XG4gICAgICBpZiAoIWV4aXN0cykge1xuICAgICAgICB0aGlzLndyaXRlRmlsZSh7fSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZW5lcmF0ZUlEKHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZSgvXFxzKy9nLCAnJykudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIGZpbGUoKSB7XG4gICAgbGV0IGZpbGVuYW1lID0gJ3Byb2plY3RzLmNzb24nO1xuICAgIGNvbnN0IGZpbGVkaXIgPSBhdG9tLmdldENvbmZpZ0RpclBhdGgoKTtcblxuICAgIGlmICh0aGlzLmVudmlyb25tZW50U3BlY2lmaWNQcm9qZWN0cykge1xuICAgICAgbGV0IGhvc3RuYW1lID0gb3MuaG9zdG5hbWUoKS5zcGxpdCgnLicpLnNoaWZ0KCkudG9Mb3dlckNhc2UoKTtcbiAgICAgIGZpbGVuYW1lID0gYHByb2plY3RzLiR7aG9zdG5hbWV9LmNzb25gO1xuICAgIH1cblxuICAgIHJldHVybiBgJHtmaWxlZGlyfS8ke2ZpbGVuYW1lfWA7XG4gIH1cblxuICByZWFkRmlsZShjYWxsYmFjaykge1xuICAgIGZzLmV4aXN0cyh0aGlzLmZpbGUoKSwgKGV4aXN0cykgPT4ge1xuICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGxldCBwcm9qZWN0cyA9IENTT04ucmVhZEZpbGVTeW5jKHRoaXMuZmlsZSgpKSB8fCB7fTtcbiAgICAgICAgICBjYWxsYmFjayhwcm9qZWN0cyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGBGYWlsZWQgdG8gbG9hZCAke3BhdGguYmFzZW5hbWUodGhpcy5maWxlKCkpfWA7XG4gICAgICAgICAgY29uc3QgZGV0YWlsID0gZXJyb3IubG9jYXRpb24gIT0gbnVsbCA/IGVycm9yLnN0YWNrIDogZXJyb3IubWVzc2FnZTtcbiAgICAgICAgICB0aGlzLm5vdGlmeUZhaWx1cmUobWVzc2FnZSwgZGV0YWlsKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMud3JpdGVGaWxlKHRoaXMuZmlsZSgpLCAne30nLCAoKSA9PiBjYWxsYmFjayh7fSkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgd3JpdGVGaWxlKHByb2plY3RzLCBjYWxsYmFjaykge1xuICAgIENTT04ud3JpdGVGaWxlU3luYyh0aGlzLmZpbGUoKSwgcHJvamVjdHMpO1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnlGYWlsdXJlKG1lc3NhZ2UsIGRldGFpbD1udWxsKSB7XG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKG1lc3NhZ2UsIHtcbiAgICAgIGRldGFpbDogZGV0YWlsLFxuICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICB9KTtcbiAgfVxufVxuIl19
//# sourceURL=/Users/anas/.atom/packages/project-manager/lib/db.js
