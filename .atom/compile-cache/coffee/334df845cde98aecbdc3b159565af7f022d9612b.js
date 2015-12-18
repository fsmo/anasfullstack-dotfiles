(function() {
  var BufferedNodeProcess, BufferedProcess, Helpers, TextEditor, XRegExp, fs, path, tmp, xcache, _ref;

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, BufferedNodeProcess = _ref.BufferedNodeProcess, TextEditor = _ref.TextEditor;

  path = require('path');

  fs = require('fs');

  path = require('path');

  tmp = require('tmp');

  xcache = new Map;

  XRegExp = null;

  module.exports = Helpers = {
    exec: function(command, args, options) {
      if (args == null) {
        args = [];
      }
      if (options == null) {
        options = {};
      }
      if (!arguments.length) {
        throw new Error("Nothing to execute.");
      }
      return this._exec(command, args, options, false);
    },
    execNode: function(filePath, args, options) {
      if (args == null) {
        args = [];
      }
      if (options == null) {
        options = {};
      }
      if (!arguments.length) {
        throw new Error("Nothing to execute.");
      }
      return this._exec(filePath, args, options, true);
    },
    _exec: function(command, args, options, isNodeExecutable) {
      if (args == null) {
        args = [];
      }
      if (options == null) {
        options = {};
      }
      if (isNodeExecutable == null) {
        isNodeExecutable = false;
      }
      if (options.stream == null) {
        options.stream = 'stdout';
      }
      if (options.throwOnStdErr == null) {
        options.throwOnStdErr = true;
      }
      return new Promise(function(resolve, reject) {
        var data, exit, prop, spawnedProcess, stderr, stdout, value, _ref1;
        data = {
          stdout: [],
          stderr: []
        };
        stdout = function(output) {
          return data.stdout.push(output.toString());
        };
        stderr = function(output) {
          return data.stderr.push(output.toString());
        };
        exit = function() {
          if (options.stream === 'stdout') {
            if (data.stderr.length && options.throwOnStdErr) {
              return reject(new Error(data.stderr.join('')));
            } else {
              return resolve(data.stdout.join(''));
            }
          } else if (options.stream === 'both') {
            return resolve({
              stdout: data.stdout.join(''),
              stderr: data.stderr.join('')
            });
          } else {
            return resolve(data.stderr.join(''));
          }
        };
        if (isNodeExecutable) {
          if (options.env == null) {
            options.env = {};
          }
          _ref1 = process.env;
          for (prop in _ref1) {
            value = _ref1[prop];
            if (prop !== 'OS') {
              options.env[prop] = value;
            }
          }
          spawnedProcess = new BufferedNodeProcess({
            command: command,
            args: args,
            options: options,
            stdout: stdout,
            stderr: stderr,
            exit: exit
          });
        } else {
          spawnedProcess = new BufferedProcess({
            command: command,
            args: args,
            options: options,
            stdout: stdout,
            stderr: stderr,
            exit: exit
          });
        }
        spawnedProcess.onWillThrowError((function(_this) {
          return function(_arg) {
            var error, handle;
            error = _arg.error, handle = _arg.handle;
            if (error && error.code === 'ENOENT') {
              return reject(error);
            }
            handle();
            if (error.code === 'EACCES') {
              error = new Error("Failed to spawn command `" + command + "`. Make sure it's a file, not a directory and it's executable.");
              error.name = 'BufferedProcessError';
            }
            return reject(error);
          };
        })(this));
        if (options.stdin) {
          spawnedProcess.process.stdin.write(options.stdin.toString());
          return spawnedProcess.process.stdin.end();
        }
      });
    },
    rangeFromLineNumber: function(textEditor, lineNumber, colStart) {
      if (!(textEditor instanceof TextEditor)) {
        throw new Error('Provided text editor is invalid');
      }
      if (typeof lineNumber === 'undefined') {
        throw new Error('Invalid lineNumber provided');
      }
      if (typeof colStart !== 'number') {
        colStart = textEditor.indentationForBufferRow(lineNumber) * textEditor.getTabLength();
      }
      return [[lineNumber, colStart], [lineNumber, textEditor.getBuffer().lineLengthForRow(lineNumber)]];
    },
    parse: function(data, rawRegex, options) {
      var colEnd, colStart, filePath, line, lineEnd, lineStart, match, regex, toReturn, _i, _len, _ref1;
      if (options == null) {
        options = {};
      }
      if (!arguments.length) {
        throw new Error("Nothing to parse");
      }
      if (XRegExp == null) {
        XRegExp = require('xregexp').XRegExp;
      }
      if (options.baseReduction == null) {
        options.baseReduction = 1;
      }
      if (options.flags == null) {
        options.flags = "";
      }
      toReturn = [];
      if (xcache.has(rawRegex)) {
        regex = xcache.get(rawRegex);
      } else {
        xcache.set(rawRegex, regex = XRegExp(rawRegex, options.flags));
      }
      if (typeof data !== 'string') {
        throw new Error("Input must be a string");
      }
      _ref1 = data.split(/\r?\n/);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        line = _ref1[_i];
        match = XRegExp.exec(line, regex);
        if (match) {
          if (!options.baseReduction) {
            options.baseReduction = 1;
          }
          lineStart = 0;
          if (match.line) {
            lineStart = match.line - options.baseReduction;
          }
          if (match.lineStart) {
            lineStart = match.lineStart - options.baseReduction;
          }
          colStart = 0;
          if (match.col) {
            colStart = match.col - options.baseReduction;
          }
          if (match.colStart) {
            colStart = match.colStart - options.baseReduction;
          }
          lineEnd = 0;
          if (match.line) {
            lineEnd = match.line - options.baseReduction;
          }
          if (match.lineEnd) {
            lineEnd = match.lineEnd - options.baseReduction;
          }
          colEnd = 0;
          if (match.col) {
            colEnd = match.col - options.baseReduction;
          }
          if (match.colEnd) {
            colEnd = match.colEnd - options.baseReduction;
          }
          filePath = match.file;
          if (options.filePath) {
            filePath = options.filePath;
          }
          toReturn.push({
            type: match.type,
            text: match.message,
            filePath: filePath,
            range: [[lineStart, colStart], [lineEnd, colEnd]]
          });
        }
      }
      return toReturn;
    },
    findFile: function(startDir, names) {
      var currentDir, filePath, name, _i, _len;
      if (!arguments.length) {
        throw new Error("Specify a filename to find");
      }
      if (!(names instanceof Array)) {
        names = [names];
      }
      startDir = startDir.split(path.sep);
      while (startDir.length && startDir.join(path.sep)) {
        currentDir = startDir.join(path.sep);
        for (_i = 0, _len = names.length; _i < _len; _i++) {
          name = names[_i];
          filePath = path.join(currentDir, name);
          try {
            fs.accessSync(filePath, fs.R_OK);
            return filePath;
          } catch (_error) {}
        }
        startDir.pop();
      }
      return null;
    },
    tempFile: function(fileName, fileContents, callback) {
      if (typeof fileName !== 'string') {
        throw new Error('Invalid fileName provided');
      }
      if (typeof fileContents !== 'string') {
        throw new Error('Invalid fileContent provided');
      }
      if (typeof callback !== 'function') {
        throw new Error('Invalid Callback provided');
      }
      return new Promise(function(resolve, reject) {
        return tmp.dir({
          prefix: 'atom-linter_'
        }, function(err, dirPath, cleanupCallback) {
          var filePath;
          if (err) {
            return reject(err);
          }
          filePath = path.join(dirPath, fileName);
          return fs.writeFile(filePath, fileContents, function(err) {
            if (err) {
              cleanupCallback();
              return reject(err);
            }
            return (new Promise(function(resolve) {
              return resolve(callback(filePath));
            })).then(function(result) {
              fs.unlink(filePath, function() {
                return fs.rmdir(dirPath);
              });
              return result;
            }).then(resolve, reject);
          });
        });
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbGludGVyLWpzaGludC9ub2RlX21vZHVsZXMvYXRvbS1saW50ZXIvbGliL2hlbHBlcnMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtGQUFBOztBQUFBLEVBQUEsT0FBcUQsT0FBQSxDQUFRLE1BQVIsQ0FBckQsRUFBQyx1QkFBQSxlQUFELEVBQWtCLDJCQUFBLG1CQUFsQixFQUF1QyxrQkFBQSxVQUF2QyxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSLENBSk4sQ0FBQTs7QUFBQSxFQU1BLE1BQUEsR0FBUyxHQUFBLENBQUEsR0FOVCxDQUFBOztBQUFBLEVBT0EsT0FBQSxHQUFVLElBUFYsQ0FBQTs7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BQUEsR0FJZjtBQUFBLElBQUEsSUFBQSxFQUFNLFNBQUMsT0FBRCxFQUFVLElBQVYsRUFBcUIsT0FBckIsR0FBQTs7UUFBVSxPQUFPO09BQ3JCOztRQUR5QixVQUFVO09BQ25DO0FBQUEsTUFBQSxJQUFBLENBQUEsU0FBc0QsQ0FBQyxNQUF2RDtBQUFBLGNBQVUsSUFBQSxLQUFBLENBQU0scUJBQU4sQ0FBVixDQUFBO09BQUE7QUFDQSxhQUFPLElBQUMsQ0FBQSxLQUFELENBQU8sT0FBUCxFQUFnQixJQUFoQixFQUFzQixPQUF0QixFQUErQixLQUEvQixDQUFQLENBRkk7SUFBQSxDQUFOO0FBQUEsSUFJQSxRQUFBLEVBQVUsU0FBQyxR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

//# sourceURL=/Users/anas/.atom/packages/linter-jshint/node_modules/atom-linter/lib/helpers.coffee
