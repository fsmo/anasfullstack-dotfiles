(function() {
  var AtomRunner, AtomRunnerView, ConfigObserver, fs, p, spawn, url,
    __slice = [].slice;

  ConfigObserver = require('atom').ConfigObserver;

  spawn = require('child_process').spawn;

  fs = require('fs');

  url = require('url');

  p = require('path');

  AtomRunnerView = require('./atom-runner-view');

  AtomRunner = (function() {
    function AtomRunner() {}

    AtomRunner.prototype.config = {
      showOutputWindow: {
        title: 'Show Output Window',
        description: 'Displays the output window when running commands. Uncheck to hide output.',
        type: 'boolean',
        "default": true,
        order: 1
      }
    };

    AtomRunner.prototype.cfg = {
      ext: 'runner.extensions',
      scope: 'runner.scopes'
    };

    AtomRunner.prototype.defaultExtensionMap = {
      'spec.coffee': 'mocha',
      'ps1': 'c:\\windows\\sysnative\\windowspowershell\\v1.0\\powershell.exe -file',
      '_test.go': 'go test'
    };

    AtomRunner.prototype.defaultScopeMap = {
      coffee: 'coffee',
      js: 'node',
      ruby: 'ruby',
      python: 'python',
      go: 'go run',
      shell: 'bash',
      powershell: 'c:\\windows\\sysnative\\windowspowershell\\v1.0\\powershell.exe -noninteractive -noprofile -c -'
    };

    AtomRunner.prototype.extensionMap = null;

    AtomRunner.prototype.scopeMap = null;

    AtomRunner.prototype.debug = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return console.debug.apply(console, ['[atom-runner]'].concat(__slice.call(args)));
    };

    AtomRunner.prototype.initEnv = function() {
      var out, pid, shell, _ref;
      if (process.platform === 'darwin') {
        _ref = [process.env.SHELL || 'bash', ''], shell = _ref[0], out = _ref[1];
        this.debug('Importing ENV from', shell);
        pid = spawn(shell, ['--login', '-c', 'env']);
        pid.stdout.on('data', function(chunk) {
          return out += chunk;
        });
        pid.on('error', (function(_this) {
          return function() {
            return _this.debug('Failed to import ENV from', shell);
          };
        })(this));
        pid.on('close', (function(_this) {
          return function() {
            var line, match, _i, _len, _ref1, _results;
            _ref1 = out.split('\n');
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              line = _ref1[_i];
              match = line.match(/^(\S+?)=(.+)/);
              if (match) {
                _results.push(process.env[match[1]] = match[2]);
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          };
        })(this));
        return pid.stdin.end();
      }
    };

    AtomRunner.prototype.destroy = function() {
      atom.config.unobserve(this.cfg.ext);
      return atom.config.unobserve(this.cfg.scope);
    };

    AtomRunner.prototype.activate = function() {
      this.initEnv();
      atom.config.setDefaults(this.cfg.ext, this.defaultExtensionMap);
      atom.config.setDefaults(this.cfg.scope, this.defaultScopeMap);
      atom.config.observe(this.cfg.ext, (function(_this) {
        return function() {
          return _this.extensionMap = atom.config.get(_this.cfg.ext);
        };
      })(this));
      atom.config.observe(this.cfg.scope, (function(_this) {
        return function() {
          return _this.scopeMap = atom.config.get(_this.cfg.scope);
        };
      })(this));
      atom.commands.add('atom-workspace', 'run:file', (function(_this) {
        return function() {
          return _this.run(false);
        };
      })(this));
      atom.commands.add('atom-workspace', 'run:selection', (function(_this) {
        return function() {
          return _this.run(true);
        };
      })(this));
      atom.commands.add('atom-workspace', 'run:stop', (function(_this) {
        return function() {
          return _this.stop();
        };
      })(this));
      atom.commands.add('atom-workspace', 'run:close', (function(_this) {
        return function() {
          return _this.stopAndClose();
        };
      })(this));
      return atom.commands.add('.atom-runner', 'run:copy', (function(_this) {
        return function() {
          return atom.clipboard.write(window.getSelection().toString());
        };
      })(this));
    };

    AtomRunner.prototype.run = function(selection) {
      var cmd, editor, pane, panes, path, view, _ref;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      path = editor.getPath();
      cmd = this.commandFor(editor, selection);
      if (cmd == null) {
        console.warn("No registered executable for file '" + path + "'");
        return;
      }
      if (atom.config.get('atom-runner.showOutputWindow')) {
        _ref = this.runnerView(), pane = _ref.pane, view = _ref.view;
        if (view == null) {
          view = new AtomRunnerView(editor.getTitle());
          panes = atom.workspace.getPanes();
          pane = panes[panes.length - 1].splitRight(view);
        }
      } else {
        view = {
          mocked: true,
          append: function(text, type) {
            if (type === 'stderr') {
              return console.error(text);
            } else {
              return console.log(text);
            }
          },
          scrollToBottom: function() {},
          clear: function() {},
          footer: function() {}
        };
      }
      if (!view.mocked) {
        view.setTitle(editor.getTitle());
        pane.activateItem(view);
      }
      return this.execute(cmd, editor, view, selection);
    };

    AtomRunner.prototype.stop = function(view) {
      if (this.child) {
        if (view == null) {
          view = this.runnerView().view;
        }
        if (view && (view.isOnDom() != null)) {
          view.append('^C', 'stdin');
        } else {
          this.debug('Killed child', child.pid);
        }
        this.child.kill('SIGINT');
        if (this.child.killed) {
          return this.child = null;
        }
      }
    };

    AtomRunner.prototype.stopAndClose = function() {
      var pane, view, _ref;
      _ref = this.runnerView(), pane = _ref.pane, view = _ref.view;
      if (pane != null) {
        pane.removeItem(view);
      }
      return this.stop(view);
    };

    AtomRunner.prototype.execute = function(cmd, editor, view, selection) {
      var args, dir, err, splitCmd, startTime;
      view.clear();
      this.stop();
      args = [];
      if (editor.getPath()) {
        editor.save();
        if (!selection) {
          args.push(editor.getPath());
        }
      }
      splitCmd = cmd.split(/\s+/);
      if (splitCmd.length > 1) {
        cmd = splitCmd[0];
        args = splitCmd.slice(1).concat(args);
      }
      try {
        dir = atom.project.path || '.';
        if (!fs.statSync(dir).isDirectory()) {
          dir = p.dirname(dir);
        }
        this.child = spawn(cmd, args, {
          cwd: dir
        });
        this.child.on('error', (function(_this) {
          return function(err) {
            if (err.message.match(/\bENOENT$/)) {
              view.append('Unable to find command: ' + cmd + '\n', 'stderr');
              view.append('Are you sure PATH is configured correctly?\n\n', 'stderr');
              view.append('ENV PATH: ' + process.env.PATH + '\n\n', 'stderr');
            }
            view.append(err.stack, 'stderr');
            view.scrollToBottom();
            return _this.child = null;
          };
        })(this));
        this.child.stderr.on('data', (function(_this) {
          return function(data) {
            view.append(data, 'stderr');
            return view.scrollToBottom();
          };
        })(this));
        this.child.stdout.on('data', (function(_this) {
          return function(data) {
            view.append(data, 'stdout');
            return view.scrollToBottom();
          };
        })(this));
        this.child.on('close', (function(_this) {
          return function(code, signal) {
            view.footer('Exited with code=' + code + ' in ' + ((new Date - startTime) / 1000) + ' seconds');
            return _this.child = null;
          };
        })(this));
      } catch (_error) {
        err = _error;
        view.append(err.stack, 'stderr');
        view.scrollToBottom();
        this.stop();
      }
      startTime = new Date;
      if (selection) {
        this.child.stdin.write(editor.getSelection().getText());
      } else if (!editor.getPath()) {
        this.child.stdin.write(editor.getText());
      }
      this.child.stdin.end();
      return view.footer('Running: ' + cmd + ' ' + editor.getPath());
    };

    AtomRunner.prototype.commandFor = function(editor, selection) {
      var boundary, ext, name, scope, shebang, _i, _j, _len, _len1, _ref, _ref1;
      shebang = this.commandForShebang(editor);
      if (shebang != null) {
        return shebang;
      }
      if (!selection) {
        if (editor.getPath() != null) {
          _ref = Object.keys(this.extensionMap).sort(function(a, b) {
            return b.length - a.length;
          });
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            ext = _ref[_i];
            boundary = ext.match(/^\b/) ? '' : '\\b';
            if (editor.getPath().match(boundary + ext + '$')) {
              return this.extensionMap[ext];
            }
          }
        }
      }
      scope = editor.getLastCursor().getScopeDescriptor().scopes[0];
      _ref1 = Object.keys(this.scopeMap);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        name = _ref1[_j];
        if (scope.match('^source\\.' + name + '\\b')) {
          return this.scopeMap[name];
        }
      }
    };

    AtomRunner.prototype.commandForShebang = function(editor) {
      var match;
      match = editor.lineTextForBufferRow(0).match(/^#!\s*(.+)/);
      return match && match[1];
    };

    AtomRunner.prototype.runnerView = function() {
      var pane, view, _i, _j, _len, _len1, _ref, _ref1;
      _ref = atom.workspace.getPanes();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pane = _ref[_i];
        _ref1 = pane.getItems();
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          view = _ref1[_j];
          if (view instanceof AtomRunnerView) {
            return {
              pane: pane,
              view: view
            };
          }
        }
      }
      return {
        pane: null,
        view: null
      };
    };

    return AtomRunner;

  })();

  module.exports = new AtomRunner;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXRvbS1ydW5uZXIvbGliL2F0b20tcnVubmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2REFBQTtJQUFBLGtCQUFBOztBQUFBLEVBQUMsaUJBQWtCLE9BQUEsQ0FBUSxNQUFSLEVBQWxCLGNBQUQsQ0FBQTs7QUFBQSxFQUVBLEtBQUEsR0FBUSxPQUFBLENBQVEsZUFBUixDQUF3QixDQUFDLEtBRmpDLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FITCxDQUFBOztBQUFBLEVBSUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSLENBSk4sQ0FBQTs7QUFBQSxFQUtBLENBQUEsR0FBSSxPQUFBLENBQVEsTUFBUixDQUxKLENBQUE7O0FBQUEsRUFPQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQVBqQixDQUFBOztBQUFBLEVBU007NEJBQ0o7O0FBQUEseUJBQUEsTUFBQSxHQUNFO0FBQUEsTUFBQSxnQkFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sb0JBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSwyRUFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxJQUhUO0FBQUEsUUFJQSxLQUFBLEVBQU8sQ0FKUDtPQURGO0tBREYsQ0FBQTs7QUFBQSx5QkFRQSxHQUFBLEdBQ0U7QUFBQSxNQUFBLEdBQUEsRUFBSyxtQkFBTDtBQUFBLE1BQ0EsS0FBQSxFQUFPLGVBRFA7S0FURixDQUFBOztBQUFBLHlCQVlBLG1CQUFBLEdBQ0U7QUFBQSxNQUFBLGFBQUEsRUFBZSxPQUFmO0FBQUEsTUFDQSxLQUFBLEVBQU8sdUVBRFA7QUFBQSxNQUVBLFVBQUEsRUFBWSxTQUZaO0tBYkYsQ0FBQTs7QUFBQSx5QkFp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

//# sourceURL=/Users/anas/.atom/packages/atom-runner/lib/atom-runner.coffee
