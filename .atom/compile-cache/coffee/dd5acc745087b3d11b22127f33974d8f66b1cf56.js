(function() {
  var CompositeDisposable, helpers, os, path, _;

  CompositeDisposable = require('atom').CompositeDisposable;

  helpers = require('atom-linter');

  path = require('path');

  _ = require('lodash');

  os = require('os');

  module.exports = {
    config: {
      executable: {
        type: 'string',
        "default": 'pylint',
        description: 'Command or path to executable. Use %p for current project directory (no trailing /).'
      },
      pythonPath: {
        type: 'string',
        "default": '',
        description: 'Paths to be added to $PYTHONPATH. Use %p for current project directory.'
      },
      rcFile: {
        type: 'string',
        "default": '',
        description: 'Path to pylintrc file. Use %p for the current project directory or %f for the directory of the ' + 'current file.'
      },
      workingDirectory: {
        type: 'string',
        "default": '%p',
        description: 'Directory pylint is run from. Use %p for the current project directory or %f for the directory ' + 'of the current file.'
      },
      messageFormat: {
        type: 'string',
        "default": '%i %m',
        description: 'Format for Pylint messages where %m is the message, %i is the numeric mesasge ID (e.g. W0613) and %s is the human-readable message ID (e.g. unused-argument).'
      }
    },
    activate: function() {
      require('atom-package-deps').install();
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-pylint.executable', (function(_this) {
        return function(newExecutableValue) {
          return _this.executable = newExecutableValue;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-pylint.rcFile', (function(_this) {
        return function(newRcFileValue) {
          return _this.rcFile = newRcFileValue;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-pylint.messageFormat', (function(_this) {
        return function(newMessageFormatValue) {
          return _this.messageFormat = newMessageFormatValue;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-pylint.pythonPath', (function(_this) {
        return function(newPythonPathValue) {
          return _this.pythonPath = _.trim(newPythonPathValue, path.delimiter);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-pylint.workingDirectory', (function(_this) {
        return function(newCwd) {
          return _this.cwd = _.trim(newCwd, path.delimiter);
        };
      })(this)));
      this.regex = '^(?<line>\\d+),(?<col>\\d+),(?<type>\\w+),(\\w\\d+):(?<message>.*)$';
      return this.errorWhitelist = [/^No config file found, using default configuration$/];
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      var provider;
      return provider = {
        name: 'Pylint',
        grammarScopes: ['source.python'],
        scope: 'file',
        lintOnFly: true,
        lint: (function(_this) {
          return function(activeEditor) {
            var file;
            file = activeEditor.getPath();
            return helpers.tempFile(path.basename(file), activeEditor.getText(), function(tmpFilename) {
              var args, cwd, env, executable, format, pattern, projDir, pythonPath, rcFile, value, _ref;
              projDir = _this.getProjDir(file) || path.dirname(file);
              cwd = _this.cwd.replace(/%f/g, path.dirname(file)).replace(/%p/g, projDir);
              executable = _this.executable.replace(/%p/g, projDir);
              pythonPath = _this.pythonPath.replace(/%p/g, projDir);
              env = Object.create(process.env, {
                PYTHONPATH: {
                  value: _.compact([process.env.PYTHONPATH, projDir, pythonPath]).join(path.delimiter),
                  enumerable: true
                }
              });
              format = _this.messageFormat;
              _ref = {
                '%m': 'msg',
                '%i': 'msg_id',
                '%s': 'symbol'
              };
              for (pattern in _ref) {
                value = _ref[pattern];
                format = format.replace(new RegExp(pattern, 'g'), "{" + value + "}");
              }
              args = ["--msg-template='{line},{column},{category},{msg_id}:" + format + "'", '--reports=n', '--output-format=text'];
              if (_this.rcFile) {
                rcFile = _this.rcFile.replace(/%p/g, projDir).replace(/%f/g, path.dirname(file));
                args.push("--rcfile=" + rcFile);
              }
              args.push(tmpFilename);
              return helpers.exec(executable, args, {
                env: env,
                cwd: cwd,
                stream: 'both'
              }).then(function(data) {
                var filteredErrors;
                filteredErrors = _this.filterWhitelistedErrors(data.stderr);
                if (filteredErrors) {
                  throw new Error(filteredErrors);
                }
                return helpers.parse(data.stdout, _this.regex, {
                  filePath: file
                }).filter(function(lintIssue) {
                  return lintIssue.type !== 'info';
                }).map(function(lintIssue) {
                  var colEnd, colStart, lineEnd, lineStart, _ref1, _ref2, _ref3;
                  _ref1 = lintIssue.range, (_ref2 = _ref1[0], lineStart = _ref2[0], colStart = _ref2[1]), (_ref3 = _ref1[1], lineEnd = _ref3[0], colEnd = _ref3[1]);
                  if (lineStart === lineEnd && (colStart <= colEnd && colEnd <= 0)) {
                    return _.merge({}, lintIssue, {
                      range: helpers.rangeFromLineNumber(activeEditor, lineStart, colStart)
                    });
                  }
                  return lintIssue;
                });
              });
            });
          };
        })(this)
      };
    },
    getProjDir: function(filePath) {
      return atom.project.relativizePath(filePath)[0];
    },
    filterWhitelistedErrors: function(output) {
      var filteredOutputLines, outputLines;
      outputLines = _.compact(output.split(os.EOL));
      filteredOutputLines = _.reject(outputLines, (function(_this) {
        return function(outputLine) {
          return _.some(_this.errorWhitelist, function(errorRegex) {
            return errorRegex.test(outputLine);
          });
        };
      })(this));
      return filteredOutputLines.join(os.EOL);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbGludGVyLXB5bGludC9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsYUFBUixDQURWLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBSEosQ0FBQTs7QUFBQSxFQUlBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUpMLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxRQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsc0ZBRmI7T0FERjtBQUFBLE1BSUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEVBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSx5RUFGYjtPQUxGO0FBQUEsTUFRQSxNQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLGlHQUFBLEdBQ0EsZUFIYjtPQVRGO0FBQUEsTUFhQSxnQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSxpR0FBQSxHQUNBLHNCQUhiO09BZEY7QUFB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

//# sourceURL=/Users/anas/.atom/packages/linter-pylint/lib/main.coffee
