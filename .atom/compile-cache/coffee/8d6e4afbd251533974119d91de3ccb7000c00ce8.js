(function() {
  var CSON, DB, Emitter, fs, path, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Emitter = require('atom').Emitter;

  CSON = require('season');

  fs = require('fs');

  path = require('path');

  _ = require('underscore-plus');

  module.exports = DB = (function() {
    DB.prototype.filepath = null;

    function DB(searchKey, searchValue) {
      this.searchKey = searchKey;
      this.searchValue = searchValue;
      this.subscribeToProjectsFile = __bind(this.subscribeToProjectsFile, this);
      this.lookForChanges = __bind(this.lookForChanges, this);
      this.find = __bind(this.find, this);
      this.emitter = new Emitter;
      fs.exists(this.file(), (function(_this) {
        return function(exists) {
          if (!exists) {
            return _this.writeFile({});
          } else {
            return _this.subscribeToProjectsFile();
          }
        };
      })(this));
    }

    DB.prototype.setSearchQuery = function(searchKey, searchValue) {
      this.searchKey = searchKey;
      this.searchValue = searchValue;
    };

    DB.prototype.find = function(callback) {
      return this.readFile((function(_this) {
        return function(results) {
          var found, key, project, projects, result;
          found = false;
          projects = [];
          for (key in results) {
            result = results[key];
            result._id = key;
            if ((result.template != null) && (results[result.template] != null)) {
              result = _.deepExtend(result, results[result.template]);
            }
            projects.push(result);
          }
          if (_this.searchKey && _this.searchValue) {
            for (key in projects) {
              project = projects[key];
              if (_.isEqual(project[_this.searchKey], _this.searchValue)) {
                found = project;
              }
            }
          } else {
            found = projects;
          }
          return typeof callback === "function" ? callback(found) : void 0;
        };
      })(this));
    };

    DB.prototype.add = function(props, callback) {
      return this.readFile((function(_this) {
        return function(projects) {
          var id;
          id = _this.generateID(props.title);
          projects[id] = props;
          return _this.writeFile(projects, function() {
            var _ref;
            if ((_ref = atom.notifications) != null) {
              _ref.addSuccess("" + props.title + " has been added");
            }
            return typeof callback === "function" ? callback(id) : void 0;
          });
        };
      })(this));
    };

    DB.prototype.update = function(props, callback) {
      if (!props._id) {
        return false;
      }
      return this.readFile((function(_this) {
        return function(projects) {
          var data, key;
          for (key in projects) {
            data = projects[key];
            if (key === props._id) {
              delete props._id;
              projects[key] = props;
            }
          }
          return _this.writeFile(projects, function() {
            return typeof callback === "function" ? callback() : void 0;
          });
        };
      })(this));
    };

    DB.prototype["delete"] = function(id, callback) {
      return this.readFile((function(_this) {
        return function(projects) {
          var data, key;
          for (key in projects) {
            data = projects[key];
            if (key === id) {
              delete projects[key];
            }
          }
          return _this.writeFile(projects, function() {
            return typeof callback === "function" ? callback() : void 0;
          });
        };
      })(this));
    };

    DB.prototype.onUpdate = function(callback) {
      return this.emitter.on('db-updated', (function(_this) {
        return function() {
          return _this.find(callback);
        };
      })(this));
    };

    DB.prototype.lookForChanges = function() {
      return atom.config.observe('project-manager.environmentSpecificProjects', (function(_this) {
        return function(newValue, obj) {
          var previous;
          if (obj == null) {
            obj = {};
          }
          previous = obj.previous != null ? obj.previous : newValue;
          if (newValue !== previous) {
            _this.subscribeToProjectsFile();
            return _this.updateFile();
          }
        };
      })(this));
    };

    DB.prototype.subscribeToProjectsFile = function() {
      var error, watchErrorUrl, _ref;
      if (this.fileWatcher != null) {
        this.fileWatcher.close();
      }
      try {
        return this.fileWatcher = fs.watch(this.file(), (function(_this) {
          return function(event, filename) {
            return _this.emitter.emit('db-updated');
          };
        })(this));
      } catch (_error) {
        error = _error;
        watchErrorUrl = 'https://github.com/atom/atom/blob/master/docs/build-instructions/linux.md#typeerror-unable-to-watch-path';
        return (_ref = atom.notifications) != null ? _ref.addError("<b>Project Manager</b><br>\nCould not watch for changes to `" + (path.basename(this.file())) + "`.\nMake sure you have permissions to `" + (this.file()) + "`. On linux there\ncan be problems with watch sizes. See <a href='" + watchErrorUrl + "'>\nthis document</a> for more info.", {
          dismissable: true
        }) : void 0;
      }
    };

    DB.prototype.updateFile = function() {
      return fs.exists(this.file(true), (function(_this) {
        return function(exists) {
          if (!exists) {
            return fs.writeFile(_this.file(), '{}', function(error) {
              var options, _ref;
              if (error) {
                return (_ref = atom.notifications) != null ? _ref.addError("Project Manager", options = {
                  details: "Could not create the file for storing projects"
                }) : void 0;
              }
            });
          }
        };
      })(this));
    };

    DB.prototype.generateID = function(string) {
      return string.replace(/\s+/g, '').toLowerCase();
    };

    DB.prototype.file = function(update) {
      var filedir, filename, hostname, os;
      if (update == null) {
        update = false;
      }
      if (update) {
        this.filepath = null;
      }
      if (this.filepath == null) {
        filename = 'projects.cson';
        filedir = atom.getConfigDirPath();
        if (atom.config.get('project-manager.environmentSpecificProjects')) {
          os = require('os');
          hostname = os.hostname().split('.').shift().toLowerCase();
          filename = "projects." + hostname + ".cson";
        }
        this.filepath = "" + filedir + "/" + filename;
      }
      return this.filepath;
    };

    DB.prototype.readFile = function(callback) {
      return fs.exists(this.file(), (function(_this) {
        return function(exists) {
          var detail, error, message, projects;
          if (exists) {
            try {
              projects = CSON.readFileSync(_this.file()) || {};
              return typeof callback === "function" ? callback(projects) : void 0;
            } catch (_error) {
              error = _error;
              message = "Failed to load " + (path.basename(_this.file()));
              detail = error.location != null ? error.stack : error.message;
              return _this.notifyFailure(message, detail);
            }
          } else {
            return fs.writeFile(_this.file(), '{}', function(error) {
              return typeof callback === "function" ? callback({}) : void 0;
            });
          }
        };
      })(this));
    };

    DB.prototype.writeFile = function(projects, callback) {
      CSON.writeFileSync(this.file(), projects);
      return typeof callback === "function" ? callback() : void 0;
    };

    DB.prototype.notifyFailure = function(message, detail) {
      return atom.notifications.addError(message, {
        detail: detail,
        dismissable: true
      });
    };

    return DB;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9kYi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOEJBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQUFELENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFJQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBSkosQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixpQkFBQSxRQUFBLEdBQVUsSUFBVixDQUFBOztBQUVhLElBQUEsWUFBRSxTQUFGLEVBQWMsV0FBZCxHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsWUFBQSxTQUNiLENBQUE7QUFBQSxNQUR3QixJQUFDLENBQUEsY0FBQSxXQUN6QixDQUFBO0FBQUEsK0VBQUEsQ0FBQTtBQUFBLDZEQUFBLENBQUE7QUFBQSx5Q0FBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUFYLENBQUE7QUFBQSxNQUVBLEVBQUUsQ0FBQyxNQUFILENBQVUsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFWLEVBQW1CLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtBQUNqQixVQUFBLElBQUEsQ0FBQSxNQUFBO21CQUNFLEtBQUMsQ0FBQSxTQUFELENBQVcsRUFBWCxFQURGO1dBQUEsTUFBQTttQkFHRSxLQUFDLENBQUEsdUJBQUQsQ0FBQSxFQUhG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

//# sourceURL=/Users/anas/.atom/packages/project-manager/lib/db.coffee
