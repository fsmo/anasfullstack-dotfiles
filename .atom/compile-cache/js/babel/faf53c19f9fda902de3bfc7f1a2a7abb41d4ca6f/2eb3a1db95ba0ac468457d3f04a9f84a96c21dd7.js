Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _atom = require('atom');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

'use babel';

exports['default'] = {
  config: _config2['default'],
  activate: function activate() {
    atom.commands.add('atom-workspace', 'jscs-fixer:fix', fixFile);
  }
};

var fixFile = function fixFile() {
  var _atom$project$getPaths = atom.project.getPaths();

  var _atom$project$getPaths2 = _slicedToArray(_atom$project$getPaths, 1);

  var rootDir = _atom$project$getPaths2[0];

  var editor = atom.workspace.getActiveTextEditor();
  var configuration = atom.config.get('jscs-fixer');

  if (rootDir && editor && editor.getPath) {
    var filePath = editor.getPath();
    var rulesFilePath = _path2['default'].join(rootDir, '.jscsrc');

    if (!filePath) {
      return atom.notifications.addWarning('Save the file before fixing it.', { dismissable: true });
    }

    var command = configuration.jscsPath;
    var args = ['' + filePath, '--fix'];
    var options = { cwd: _path2['default'].dirname(filePath) };

    if (_fs2['default'].existsSync(rulesFilePath)) {
      args.push('--config ' + rulesFilePath);
    } else {
      args.push('--preset=' + configuration.defaultPreset);
    }

    if (atom.config.get('jscs-fixer.esprima')) {
      args.push('--esprima=' + configuration.esprimaPath);
    }

    new _atom.BufferedNodeProcess({ command: command, args: args, options: options, stdout: stdout, stderr: stderr, exit: exit });
  }
};

var stdout = function stdout(msg) {
  if (atom.config.get('jscs-fixer.notifications')) {
    atom.notifications.addWarning(msg, { dismissable: true });
  }
};
var stderr = function stderr(msg) {
  if (atom.config.get('jscs-fixer.notifications')) {
    atom.notifications.addError(msg, { dismissable: true });
  }
};
var exit = function exit(code) {
  if (atom.config.get('jscs-fixer.notifications') && code === 0) {
    atom.notifications.addInfo('File Fixed', { dismissable: true });
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2pzY3MtZml4ZXIvbGliL2pzY3NmaXhlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFaUIsTUFBTTs7OztrQkFDUixJQUFJOzs7O29CQUNlLE1BQU07O3NCQUNyQixVQUFVOzs7O0FBTDdCLFdBQVcsQ0FBQzs7cUJBT0c7QUFDYixRQUFNLHFCQUFBO0FBQ04sVUFBUSxFQUFBLG9CQUFHO0FBQUMsUUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUE7R0FBQztDQUM1RTs7QUFFRCxJQUFNLE9BQU8sR0FBRyxTQUFWLE9BQU8sR0FBUzsrQkFDRixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRTs7OztNQUFsQyxPQUFPOztBQUNkLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtBQUNuRCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQTs7QUFFbkQsTUFBSSxPQUFPLElBQUssTUFBTSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEFBQUMsRUFBRTtBQUN6QyxRQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDL0IsUUFBSSxhQUFhLEdBQUcsa0JBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQTs7QUFFakQsUUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNiLGFBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsaUNBQWlDLEVBQ3hDLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7S0FDbkQ7O0FBRUQsUUFBSSxPQUFPLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQTtBQUNwQyxRQUFJLElBQUksR0FBRyxNQUFJLFFBQVEsRUFBSSxPQUFPLENBQUMsQ0FBQTtBQUNuQyxRQUFJLE9BQU8sR0FBRyxFQUFDLEdBQUcsRUFBRSxrQkFBSyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUMsQ0FBQTs7QUFFM0MsUUFBSSxnQkFBRyxVQUFVLENBQUMsYUFBYSxDQUFDLEVBQUU7QUFDaEMsVUFBSSxDQUFDLElBQUksZUFBYSxhQUFhLENBQUcsQ0FBQTtLQUN2QyxNQUFNO0FBQ0wsVUFBSSxDQUFDLElBQUksZUFBYSxhQUFhLENBQUMsYUFBYSxDQUFHLENBQUE7S0FDckQ7O0FBRUQsUUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFO0FBQ3pDLFVBQUksQ0FBQyxJQUFJLGdCQUFjLGFBQWEsQ0FBQyxXQUFXLENBQUcsQ0FBQTtLQUNwRDs7QUFFRCxrQ0FBd0IsRUFBQyxPQUFPLEVBQVAsT0FBTyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBQyxDQUFDLENBQUE7R0FDeEU7Q0FDRixDQUFBOztBQUVELElBQU0sTUFBTSxHQUFHLFNBQVQsTUFBTSxDQUFJLEdBQUcsRUFBSztBQUN0QixNQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLEVBQUU7QUFDL0MsUUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7R0FDeEQ7Q0FDRixDQUFBO0FBQ0QsSUFBTSxNQUFNLEdBQUcsU0FBVCxNQUFNLENBQUksR0FBRyxFQUFLO0FBQ3RCLE1BQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsRUFBRTtBQUMvQyxRQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtHQUN0RDtDQUNGLENBQUE7QUFDRCxJQUFNLElBQUksR0FBRyxTQUFQLElBQUksQ0FBSSxJQUFJLEVBQUs7QUFDckIsTUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLEVBQUU7QUFDN0QsUUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7R0FDOUQ7Q0FDRixDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2pzY3MtZml4ZXIvbGliL2pzY3NmaXhlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHtCdWZmZXJlZE5vZGVQcm9jZXNzfSBmcm9tICdhdG9tJ1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZydcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb25maWcsXG4gIGFjdGl2YXRlKCkge2F0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdqc2NzLWZpeGVyOmZpeCcsIGZpeEZpbGUpfVxufVxuXG5jb25zdCBmaXhGaWxlID0gKCkgPT4ge1xuICBjb25zdCBbcm9vdERpcl0gPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgY29uc3QgY29uZmlndXJhdGlvbiA9IGF0b20uY29uZmlnLmdldCgnanNjcy1maXhlcicpXG5cbiAgaWYgKHJvb3REaXIgJiYgKGVkaXRvciAmJiBlZGl0b3IuZ2V0UGF0aCkpIHtcbiAgICBsZXQgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgbGV0IHJ1bGVzRmlsZVBhdGggPSBwYXRoLmpvaW4ocm9vdERpciwgJy5qc2NzcmMnKVxuXG4gICAgaWYgKCFmaWxlUGF0aCkge1xuICAgICAgcmV0dXJuIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdTYXZlIHRoZSBmaWxlIGJlZm9yZSBmaXhpbmcgaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtkaXNtaXNzYWJsZTogdHJ1ZX0pXG4gICAgfVxuXG4gICAgbGV0IGNvbW1hbmQgPSBjb25maWd1cmF0aW9uLmpzY3NQYXRoXG4gICAgbGV0IGFyZ3MgPSBbYCR7ZmlsZVBhdGh9YCwgJy0tZml4J11cbiAgICBsZXQgb3B0aW9ucyA9IHtjd2Q6IHBhdGguZGlybmFtZShmaWxlUGF0aCl9XG5cbiAgICBpZiAoZnMuZXhpc3RzU3luYyhydWxlc0ZpbGVQYXRoKSkge1xuICAgICAgYXJncy5wdXNoKGAtLWNvbmZpZyAke3J1bGVzRmlsZVBhdGh9YClcbiAgICB9IGVsc2Uge1xuICAgICAgYXJncy5wdXNoKGAtLXByZXNldD0ke2NvbmZpZ3VyYXRpb24uZGVmYXVsdFByZXNldH1gKVxuICAgIH1cblxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2pzY3MtZml4ZXIuZXNwcmltYScpKSB7XG4gICAgICBhcmdzLnB1c2goYC0tZXNwcmltYT0ke2NvbmZpZ3VyYXRpb24uZXNwcmltYVBhdGh9YClcbiAgICB9XG5cbiAgICBuZXcgQnVmZmVyZWROb2RlUHJvY2Vzcyh7Y29tbWFuZCwgYXJncywgb3B0aW9ucywgc3Rkb3V0LCBzdGRlcnIsIGV4aXR9KVxuICB9XG59XG5cbmNvbnN0IHN0ZG91dCA9IChtc2cpID0+IHtcbiAgaWYgKGF0b20uY29uZmlnLmdldCgnanNjcy1maXhlci5ub3RpZmljYXRpb25zJykpIHtcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhtc2csIHtkaXNtaXNzYWJsZTogdHJ1ZX0pXG4gIH1cbn1cbmNvbnN0IHN0ZGVyciA9IChtc2cpID0+IHtcbiAgaWYgKGF0b20uY29uZmlnLmdldCgnanNjcy1maXhlci5ub3RpZmljYXRpb25zJykpIHtcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IobXNnLCB7ZGlzbWlzc2FibGU6IHRydWV9KVxuICB9XG59XG5jb25zdCBleGl0ID0gKGNvZGUpID0+IHtcbiAgaWYgKGF0b20uY29uZmlnLmdldCgnanNjcy1maXhlci5ub3RpZmljYXRpb25zJykgJiYgY29kZSA9PT0gMCkge1xuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdGaWxlIEZpeGVkJywge2Rpc21pc3NhYmxlOiB0cnVlfSlcbiAgfVxufVxuIl19
//# sourceURL=/Users/anas/.atom/packages/jscs-fixer/lib/jscsfixer.js
