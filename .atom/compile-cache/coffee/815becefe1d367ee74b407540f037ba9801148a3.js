(function() {
  var DB, OpenRecent;

  DB = function(key) {
    this.key = key;
    return this;
  };

  DB.prototype.getData = function() {
    var data;
    data = localStorage[this.key];
    data = data != null ? JSON.parse(data) : {};
    return data;
  };

  DB.prototype.setData = function(data) {
    return localStorage[this.key] = JSON.stringify(data);
  };

  DB.prototype.get = function(name) {
    var data;
    data = this.getData();
    return data[name];
  };

  DB.prototype.set = function(name, value) {
    var data;
    data = this.getData();
    data[name] = value;
    return this.setData(data);
  };

  OpenRecent = function() {
    this.db = new DB('openRecent');
    this.commandListenerDisposables = [];
    return this;
  };

  OpenRecent.prototype.onLocalStorageEvent = function(e) {
    if (e.key === this.db.key) {
      return this.update();
    }
  };

  OpenRecent.prototype.onUriOpened = function() {
    var editor, filePath, _ref, _ref1;
    editor = atom.workspace.getActiveTextEditor();
    filePath = editor != null ? (_ref = editor.buffer) != null ? (_ref1 = _ref.file) != null ? _ref1.path : void 0 : void 0 : void 0;
    if (!filePath) {
      return;
    }
    if (!filePath.indexOf('://' === -1)) {
      return;
    }
    if (filePath) {
      return this.insertFilePath(filePath);
    }
  };

  OpenRecent.prototype.onProjectPathChange = function(projectPaths) {
    return this.insertCurrentPaths();
  };

  OpenRecent.prototype.addCommandListeners = function() {
    var disposable, index, path, _fn, _fn1, _ref, _ref1;
    _ref = this.db.get('files');
    _fn = (function(_this) {
      return function(path) {
        var disposable;
        disposable = atom.commands.add("atom-workspace", "open-recent:open-recent-file-" + index, function() {
          return _this.openFile(path);
        });
        return _this.commandListenerDisposables.push(disposable);
      };
    })(this);
    for (index in _ref) {
      path = _ref[index];
      _fn(path);
    }
    _ref1 = this.db.get('paths');
    _fn1 = (function(_this) {
      return function(path) {
        var disposable;
        disposable = atom.commands.add("atom-workspace", "open-recent:open-recent-path-" + index, function() {
          return _this.openPath(path);
        });
        return _this.commandListenerDisposables.push(disposable);
      };
    })(this);
    for (index in _ref1) {
      path = _ref1[index];
      _fn1(path);
    }
    disposable = atom.commands.add("atom-workspace", "open-recent:clear", (function(_this) {
      return function() {
        _this.db.set('files', []);
        _this.db.set('paths', []);
        return _this.update();
      };
    })(this));
    return this.commandListenerDisposables.push(disposable);
  };

  OpenRecent.prototype.getProjectPath = function(path) {
    var _ref;
    return (_ref = atom.project.getPaths()) != null ? _ref[0] : void 0;
  };

  OpenRecent.prototype.openFile = function(path) {
    return atom.workspace.open(path);
  };

  OpenRecent.prototype.openPath = function(path) {
    var options, replaceCurrentProject, workspaceElement;
    replaceCurrentProject = false;
    options = {};
    if (!this.getProjectPath() && atom.config.get('open-recent.replaceNewWindowOnOpenDirectory')) {
      replaceCurrentProject = true;
    } else if (this.getProjectPath() && atom.config.get('open-recent.replaceProjectOnOpenDirectory')) {
      replaceCurrentProject = true;
    }
    if (replaceCurrentProject) {
      atom.project.setPaths([path]);
      if (workspaceElement = atom.views.getView(atom.workspace)) {
        return atom.commands.dispatch(workspaceElement, 'tree-view:toggle-focus');
      }
    } else {
      return atom.open({
        pathsToOpen: [path],
        newWindow: !atom.config.get('open-recent.replaceNewWindowOnOpenDirectory')
      });
    }
  };

  OpenRecent.prototype.addListeners = function() {
    this.addCommandListeners();
    this.onUriOpenedDisposable = atom.workspace.onDidOpen(this.onUriOpened.bind(this));
    this.onDidChangePathsDisposable = atom.project.onDidChangePaths(this.onProjectPathChange.bind(this));
    return window.addEventListener("storage", this.onLocalStorageEvent.bind(this));
  };

  OpenRecent.prototype.removeCommandListeners = function() {
    var disposable, _i, _len, _ref;
    _ref = this.commandListenerDisposables;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      disposable = _ref[_i];
      disposable.dispose();
    }
    return this.commandListenerDisposables = [];
  };

  OpenRecent.prototype.removeListeners = function() {
    this.removeCommandListeners();
    if (this.onUriOpenedDisposable) {
      this.onUriOpenedDisposable.dispose();
      this.onUriOpenedDisposable = null;
    }
    if (this.onDidChangePathsDisposable) {
      this.onDidChangePathsDisposable.dispose();
      this.onDidChangePathsDisposable = null;
    }
    return window.removeEventListener('storage', this.onLocalStorageEvent.bind(this));
  };

  OpenRecent.prototype.init = function() {
    this.addListeners();
    if (!this.db.get('paths')) {
      this.db.set('paths', []);
    }
    if (!this.db.get('files')) {
      this.db.set('files', []);
    }
    this.insertCurrentPaths();
    return this.update();
  };

  OpenRecent.prototype.insertCurrentPaths = function() {
    var index, maxRecentDirectories, path, projectDirectory, recentPaths, _i, _len, _ref;
    if (!(atom.project.getDirectories().length > 0)) {
      return;
    }
    recentPaths = this.db.get('paths');
    _ref = atom.project.getDirectories();
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      projectDirectory = _ref[index];
      if (index > 0 && !atom.config.get('open-recent.listDirectoriesAddedToProject')) {
        continue;
      }
      path = projectDirectory.path;
      index = recentPaths.indexOf(path);
      if (index !== -1) {
        recentPaths.splice(index, 1);
      }
      recentPaths.splice(0, 0, path);
      maxRecentDirectories = atom.config.get('open-recent.maxRecentDirectories');
      if (recentPaths.length > maxRecentDirectories) {
        recentPaths.splice(maxRecentDirectories, recentPaths.length - maxRecentDirectories);
      }
    }
    this.db.set('paths', recentPaths);
    return this.update();
  };

  OpenRecent.prototype.insertFilePath = function(path) {
    var index, maxRecentFiles, recentFiles;
    recentFiles = this.db.get('files');
    index = recentFiles.indexOf(path);
    if (index !== -1) {
      recentFiles.splice(index, 1);
    }
    recentFiles.splice(0, 0, path);
    maxRecentFiles = atom.config.get('open-recent.maxRecentFiles');
    if (recentFiles.length > maxRecentFiles) {
      recentFiles.splice(maxRecentFiles, recentFiles.length - maxRecentFiles);
    }
    this.db.set('files', recentFiles);
    return this.update();
  };

  OpenRecent.prototype.createSubmenu = function() {
    var index, menuItem, path, recentFiles, recentPaths, submenu;
    submenu = [];
    submenu.push({
      command: "pane:reopen-closed-item",
      label: "Reopen Closed File"
    });
    submenu.push({
      type: "separator"
    });
    recentFiles = this.db.get('files');
    if (recentFiles.length) {
      for (index in recentFiles) {
        path = recentFiles[index];
        menuItem = {
          label: path,
          command: "open-recent:open-recent-file-" + index
        };
        if (path.length > 100) {
          menuItem.label = path.substr(-60);
          menuItem.sublabel = path;
        }
        submenu.push(menuItem);
      }
      submenu.push({
        type: "separator"
      });
    }
    recentPaths = this.db.get('paths');
    if (recentPaths.length) {
      for (index in recentPaths) {
        path = recentPaths[index];
        menuItem = {
          label: path,
          command: "open-recent:open-recent-path-" + index
        };
        if (path.length > 100) {
          menuItem.label = path.substr(-60);
          menuItem.sublabel = path;
        }
        submenu.push(menuItem);
      }
      submenu.push({
        type: "separator"
      });
    }
    submenu.push({
      command: "open-recent:clear",
      label: "Clear List"
    });
    return submenu;
  };

  OpenRecent.prototype.updateMenu = function() {
    var dropdown, item, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = atom.menu.template;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dropdown = _ref[_i];
      if (dropdown.label === "File" || dropdown.label === "&File") {
        _ref1 = dropdown.submenu;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          item = _ref1[_j];
          if (item.command === "pane:reopen-closed-item" || item.label === "Open Recent") {
            delete item.accelerator;
            delete item.command;
            delete item.click;
            item.label = "Open Recent";
            item.enabled = true;
            if (item.metadata == null) {
              item.metadata = {};
            }
            item.metadata.windowSpecific = false;
            item.submenu = this.createSubmenu();
            atom.menu.update();
            break;
          }
        }
        break;
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  OpenRecent.prototype.update = function() {
    this.removeCommandListeners();
    this.updateMenu();
    return this.addCommandListeners();
  };

  OpenRecent.prototype.destroy = function() {
    return this.removeListeners();
  };

  module.exports = {
    config: {
      maxRecentFiles: {
        type: 'number',
        "default": 8
      },
      maxRecentDirectories: {
        type: 'number',
        "default": 8
      },
      replaceNewWindowOnOpenDirectory: {
        type: 'boolean',
        "default": true,
        description: 'When checked, opening a recent directory will "open" in the current window, but only if the window does not have a project path set. Eg: The window that appears when doing File > New Window.'
      },
      replaceProjectOnOpenDirectory: {
        type: 'boolean',
        "default": false,
        description: 'When checked, opening a recent directory will "open" in the current window, replacing the current project.'
      },
      listDirectoriesAddedToProject: {
        type: 'boolean',
        "default": false,
        description: 'When checked, the all root directories in a project will be added to the history and not just the 1st root directory.'
      }
    },
    model: null,
    activate: function() {
      this.model = new OpenRecent();
      return this.model.init();
    },
    deactivate: function() {
      this.model.destroy();
      return this.model = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvb3Blbi1yZWNlbnQvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssU0FBQyxHQUFELEdBQUE7QUFDSCxJQUFBLElBQUMsQ0FBQSxHQUFELEdBQU8sR0FBUCxDQUFBO0FBQ0EsV0FBTyxJQUFQLENBRkc7RUFBQSxDQUFMLENBQUE7O0FBQUEsRUFHQSxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQWIsR0FBdUIsU0FBQSxHQUFBO0FBQ3JCLFFBQUEsSUFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLFlBQWEsQ0FBQSxJQUFDLENBQUEsR0FBRCxDQUFwQixDQUFBO0FBQUEsSUFDQSxJQUFBLEdBQVUsWUFBSCxHQUFjLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWCxDQUFkLEdBQW9DLEVBRDNDLENBQUE7QUFFQSxXQUFPLElBQVAsQ0FIcUI7RUFBQSxDQUh2QixDQUFBOztBQUFBLEVBT0EsRUFBRSxDQUFDLFNBQVMsQ0FBQyxPQUFiLEdBQXVCLFNBQUMsSUFBRCxHQUFBO1dBQ3JCLFlBQWEsQ0FBQSxJQUFDLENBQUEsR0FBRCxDQUFiLEdBQXFCLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBZixFQURBO0VBQUEsQ0FQdkIsQ0FBQTs7QUFBQSxFQVNBLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBYixHQUFtQixTQUFDLElBQUQsR0FBQTtBQUNqQixRQUFBLElBQUE7QUFBQSxJQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsT0FBRCxDQUFBLENBQVAsQ0FBQTtBQUNBLFdBQU8sSUFBSyxDQUFBLElBQUEsQ0FBWixDQUZpQjtFQUFBLENBVG5CLENBQUE7O0FBQUEsRUFZQSxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQWIsR0FBbUIsU0FBQyxJ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

//# sourceURL=/Users/anas/.atom/packages/open-recent/lib/main.coffee
