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
        description: 'Command or path to executable.'
      },
      pythonPath: {
        type: 'string',
        "default": '',
        description: 'Paths to be added to $PYTHONPATH.  Use %p for current project directory (no trailing /).'
      },
      rcFile: {
        type: 'string',
        "default": '',
        description: 'Path to .pylintrc file.'
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
              var args, cwd, env, format, pattern, projDir, pythonPath, value, _ref;
              projDir = _this.getProjDir(file);
              cwd = projDir;
              pythonPath = _this.pythonPath.replace(/%p/g, projDir);
              env = Object.create(process.env, {
                PYTHONPATH: {
                  value: _.compact([process.env.PYTHONPATH, projDir, pythonPath]).join(path.delimiter)
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
                args.push("--rcfile=" + _this.rcFile);
              }
              args.push(tmpFilename);
              return helpers.exec(_this.executable, args, {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbGludGVyLXB5bGludC9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsYUFBUixDQURWLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBSEosQ0FBQTs7QUFBQSxFQUlBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUpMLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxRQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsZ0NBRmI7T0FERjtBQUFBLE1BSUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEVBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSwwRkFGYjtPQUxGO0FBQUEsTUFRQSxNQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLHlCQUZiO09BVEY7QUFBQSxNQVlBLGFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxPQURUO0FBQUEsUUFFQSxXQUFBLEVBQ0UsK0pBSEY7T0FiRjtLQURGO0FBQUEsSUFxQkEsUUFBQSxFQUFV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

//# sourceURL=/Users/anas/.atom/packages/linter-pylint/lib/main.coffee
