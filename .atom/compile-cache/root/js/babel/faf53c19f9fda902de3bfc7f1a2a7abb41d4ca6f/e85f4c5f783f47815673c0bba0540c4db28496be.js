Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jscsLibCliConfig = require('jscs/lib/cli-config');

var _jscsLibCliConfig2 = _interopRequireDefault(_jscsLibCliConfig);

'use babel';

var grammarScopes = ['source.js', 'source.js.jsx'];

var LinterJSCS = (function () {
  function LinterJSCS() {
    _classCallCheck(this, LinterJSCS);
  }

  _createClass(LinterJSCS, null, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      // Install dependencies using atom-package-deps
      require('atom-package-deps').install('linter-jscs');

      this.observer = atom.workspace.observeTextEditors(function (editor) {
        editor.getBuffer().onWillSave(function () {
          if (grammarScopes.indexOf(editor.getGrammar().scopeName) !== -1 && _this.fixOnSave) {
            process.nextTick(function () {
              _this.fixString();
            });
          }
        });
      });
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.observer.dispose();
    }
  }, {
    key: 'provideLinter',
    value: function provideLinter() {
      var _this2 = this;

      return {
        name: 'JSCS',
        grammarScopes: grammarScopes,
        scope: 'file',
        lintOnFly: true,
        lint: function lint(editor) {
          var JSCS = require('jscs');

          // We need re-initialize JSCS before every lint
          // or it will looses the errors, didn't trace the error
          // must be something with new 2.0.0 JSCS
          _this2.jscs = new JSCS();
          _this2.jscs.registerDefaultRules();

          var filePath = editor.getPath();
          var config = _jscsLibCliConfig2['default'].load(false, _path2['default'].join(_path2['default'].dirname(filePath), _this2.configPath));

          // Options passed to `jscs` from package configuration
          var options = { esnext: _this2.esnext, preset: _this2.preset };

          _this2.jscs.configure(config || options);

          // We don't have a config file present in project directory
          // let's return an empty array of errors
          if (!config && _this2.onlyConfig) return [];

          var text = editor.getText();
          var errors = _this2.jscs.checkString(text, filePath).getErrorList();

          return errors.map(function (_ref) {
            var rule = _ref.rule;
            var message = _ref.message;
            var line = _ref.line;
            var column = _ref.column;

            // Calculate range to make the error whole line
            // without the indentation at begining of line
            var indentLevel = editor.indentationForBufferRow(line - 1);
            var startCol = editor.getTabLength() * indentLevel;
            var endCol = editor.getBuffer().lineLengthForRow(line - 1);
            var range = [[line - 1, startCol], [line - 1, endCol]];

            var type = _this2.displayAs;
            var html = '<span class=\'badge badge-flexible\'>' + rule + '</span> ' + message;

            return { type: type, html: html, filePath: filePath, range: range };
          });
        }
      };
    }
  }, {
    key: 'fixString',
    value: function fixString() {
      if (this.isMissingConfig && this.onlyConfig) return;

      var editor = atom.workspace.getActiveTextEditor();
      var path = editor.getPath();
      var text = editor.getText();
      var fixedText = this.jscs.fixString(text, path).output;
      if (text === fixedText) return;

      var cursorPosition = editor.getCursorScreenPosition();
      editor.setText(fixedText);
      editor.setCursorScreenPosition(cursorPosition);
    }
  }, {
    key: 'config',
    value: {
      preset: {
        title: 'Preset',
        description: 'Preset option is ignored if a config file is found for the linter.',
        type: 'string',
        'default': 'airbnb',
        'enum': ['airbnb', 'crockford', 'google', 'grunt', 'idiomatic', 'jquery', 'mdcs', 'node-style-guide', 'wikimedia', 'wordpress', 'yandex']
      },
      esnext: {
        description: 'Attempts to parse your code as ES6+, JSX, and Flow using the babel-jscs package as the parser.',
        type: 'boolean',
        'default': false
      },
      onlyConfig: {
        title: 'Only Config',
        description: 'Disable linter if there is no config file found for the linter.',
        type: 'boolean',
        'default': false
      },
      fixOnSave: {
        title: 'Fix on save',
        description: 'Fix JavaScript on save',
        type: 'boolean',
        'default': false
      },
      displayAs: {
        title: 'Display errors as',
        type: 'string',
        'default': 'error',
        'enum': ['error', 'warning', 'jscs Warning', 'jscs Error']
      },
      configPath: {
        title: 'Config file path (Use relative path to your project)',
        type: 'string',
        'default': ''
      }
    },
    enumerable: true
  }, {
    key: 'preset',
    get: function get() {
      return atom.config.get('linter-jscs.preset');
    }
  }, {
    key: 'esnext',
    get: function get() {
      return atom.config.get('linter-jscs.esnext');
    }
  }, {
    key: 'onlyConfig',
    get: function get() {
      return atom.config.get('linter-jscs.onlyConfig');
    }
  }, {
    key: 'fixOnSave',
    get: function get() {
      return atom.config.get('linter-jscs.fixOnSave');
    }
  }, {
    key: 'displayAs',
    get: function get() {
      return atom.config.get('linter-jscs.displayAs');
    }
  }, {
    key: 'configPath',
    get: function get() {
      return atom.config.get('linter-jscs.configPath');
    }
  }]);

  return LinterJSCS;
})();

exports['default'] = LinterJSCS;
;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1qc2NzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRWlCLE1BQU07Ozs7Z0NBQ0EscUJBQXFCOzs7O0FBSDVDLFdBQVcsQ0FBQzs7QUFLWixJQUFNLGFBQWEsR0FBRyxDQUFDLFdBQVcsRUFBRSxlQUFlLENBQUMsQ0FBQzs7SUFFaEMsVUFBVTtXQUFWLFVBQVU7MEJBQVYsVUFBVTs7O2VBQVYsVUFBVTs7V0FnRWQsb0JBQUc7Ozs7QUFFaEIsYUFBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDOztBQUVwRCxVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsVUFBQyxNQUFNLEVBQUs7QUFDNUQsY0FBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFNO0FBQ2xDLGNBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksTUFBSyxTQUFTLEVBQUU7QUFDakYsbUJBQU8sQ0FBQyxRQUFRLENBQUMsWUFBTTtBQUNyQixvQkFBSyxTQUFTLEVBQUUsQ0FBQzthQUNsQixDQUFDLENBQUM7V0FDSjtTQUNGLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7V0FFZ0Isc0JBQUc7QUFDbEIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUN6Qjs7O1dBRW1CLHlCQUFHOzs7QUFDckIsYUFBTztBQUNMLFlBQUksRUFBRSxNQUFNO0FBQ1oscUJBQWEsRUFBYixhQUFhO0FBQ2IsYUFBSyxFQUFFLE1BQU07QUFDYixpQkFBUyxFQUFFLElBQUk7QUFDZixZQUFJLEVBQUUsY0FBQyxNQUFNLEVBQUs7QUFDaEIsY0FBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FB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O0tBQzlDOzs7U0FFb0IsZUFBRztBQUN0QixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7S0FDbEQ7OztTQUVtQixlQUFHO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztLQUNqRDs7O1NBRW1CLGVBQUc7QUFDckIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0tBQ2pEOzs7U0FFb0IsZUFBRztBQUN0QixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7S0FDbEQ7OztTQTlEa0IsVUFBVTs7O3FCQUFWLFVBQVU7QUFtSjlCLENBQUMiLCJmaWxlIjoiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3MvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgY29uZmlnRmlsZSBmcm9tICdqc2NzL2xpYi9jbGktY29uZmlnJztcblxuY29uc3QgZ3JhbW1hclNjb3BlcyA9IFsnc291cmNlLmpzJywgJ3NvdXJjZS5qcy5qc3gnXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGludGVySlNDUyB7XG5cbiAgc3RhdGljIGNvbmZpZyA9IHtcbiAgICBwcmVzZXQ6IHtcbiAgICAgIHRpdGxlOiAnUHJlc2V0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUHJlc2V0IG9wdGlvbiBpcyBpZ25vcmVkIGlmIGEgY29uZmlnIGZpbGUgaXMgZm91bmQgZm9yIHRoZSBsaW50ZXIuJyxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ2FpcmJuYicsXG4gICAgICBlbnVtOiBbJ2FpcmJuYicsICdjcm9ja2ZvcmQnLCAnZ29vZ2xlJywgJ2dydW50JywgJ2lkaW9tYXRpYycsICdqcXVlcnknLCAnbWRjcycsICdub2RlLXN0eWxlLWd1aWRlJywgJ3dpa2ltZWRpYScsICd3b3JkcHJlc3MnLCAneWFuZGV4J11cbiAgICB9LFxuICAgIGVzbmV4dDoge1xuICAgICAgZGVzY3JpcHRpb246ICdBdHRlbXB0cyB0byBwYXJzZSB5b3VyIGNvZGUgYXMgRVM2KywgSlNYLCBhbmQgRmxvdyB1c2luZyB0aGUgYmFiZWwtanNjcyBwYWNrYWdlIGFzIHRoZSBwYXJzZXIuJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBvbmx5Q29uZmlnOiB7XG4gICAgICB0aXRsZTogJ09ubHkgQ29uZmlnJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGlzYWJsZSBsaW50ZXIgaWYgdGhlcmUgaXMgbm8gY29uZmlnIGZpbGUgZm91bmQgZm9yIHRoZSBsaW50ZXIuJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBmaXhPblNhdmU6IHtcbiAgICAgIHRpdGxlOiAnRml4IG9uIHNhdmUnLFxuICAgICAgZGVzY3JpcHRpb246ICdGaXggSmF2YVNjcmlwdCBvbiBzYXZlJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBkaXNwbGF5QXM6IHtcbiAgICAgIHRpdGxlOiAnRGlzcGxheSBlcnJvcnMgYXMnLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnZXJyb3InLFxuICAgICAgZW51bTogWydlcnJvcicsICd3YXJuaW5nJywgJ2pzY3MgV2FybmluZycsICdqc2NzIEVycm9yJ11cbiAgICB9LFxuICAgIGNvbmZpZ1BhdGg6IHtcbiAgICAgIHRpdGxlOiAnQ29uZmlnIGZpbGUgcGF0aCAoVXNlIHJlbGF0aXZlIHBhdGggdG8geW91ciBwcm9qZWN0KScsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICcnXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldCBwcmVzZXQoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGludGVyLWpzY3MucHJlc2V0Jyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGVzbmV4dCgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanNjcy5lc25leHQnKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgb25seUNvbmZpZygpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanNjcy5vbmx5Q29uZmlnJyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGZpeE9uU2F2ZSgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanNjcy5maXhPblNhdmUnKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgZGlzcGxheUFzKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1qc2NzLmRpc3BsYXlBcycpO1xuICB9XG5cbiAgc3RhdGljIGdldCBjb25maWdQYXRoKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1qc2NzLmNvbmZpZ1BhdGgnKTtcbiAgfVxuXG4gIHN0YXRpYyBhY3RpdmF0ZSgpIHtcbiAgICAvLyBJbnN0YWxsIGRlcGVuZGVuY2llcyB1c2luZyBhdG9tLXBhY2thZ2UtZGVwc1xuICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLWpzY3MnKTtcblxuICAgIHRoaXMub2JzZXJ2ZXIgPSBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKGVkaXRvcikgPT4ge1xuICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLm9uV2lsbFNhdmUoKCkgPT4ge1xuICAgICAgICBpZiAoZ3JhbW1hclNjb3Blcy5pbmRleE9mKGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lKSAhPT0gLTEgJiYgdGhpcy5maXhPblNhdmUpIHtcbiAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZml4U3RyaW5nKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5vYnNlcnZlci5kaXNwb3NlKCk7XG4gIH1cblxuICBzdGF0aWMgcHJvdmlkZUxpbnRlcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ0pTQ1MnLFxuICAgICAgZ3JhbW1hclNjb3BlcyxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50T25GbHk6IHRydWUsXG4gICAgICBsaW50OiAoZWRpdG9yKSA9PiB7XG4gICAgICAgIGNvbnN0IEpTQ1MgPSByZXF1aXJlKCdqc2NzJyk7XG5cbiAgICAgICAgLy8gV2UgbmVlZCByZS1pbml0aWFsaXplIEpTQ1MgYmVmb3JlIGV2ZXJ5IGxpbnRcbiAgICAgICAgLy8gb3IgaXQgd2lsbCBsb29zZXMgdGhlIGVycm9ycywgZGlkbid0IHRyYWNlIHRoZSBlcnJvclxuICAgICAgICAvLyBtdXN0IGJlIHNvbWV0aGluZyB3aXRoIG5ldyAyLjAuMCBKU0NTXG4gICAgICAgIHRoaXMuanNjcyA9IG5ldyBKU0NTKCk7XG4gICAgICAgIHRoaXMuanNjcy5yZWdpc3RlckRlZmF1bHRSdWxlcygpO1xuXG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgY29uc3QgY29uZmlnID0gY29uZmlnRmlsZS5sb2FkKGZhbHNlLFxuICAgICAgICAgIHBhdGguam9pbihwYXRoLmRpcm5hbWUoZmlsZVBhdGgpLCB0aGlzLmNvbmZpZ1BhdGgpKTtcblxuICAgICAgICAvLyBPcHRpb25zIHBhc3NlZCB0byBganNjc2AgZnJvbSBwYWNrYWdlIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHsgZXNuZXh0OiB0aGlzLmVzbmV4dCwgcHJlc2V0OiB0aGlzLnByZXNldCB9O1xuXG4gICAgICAgIHRoaXMuanNjcy5jb25maWd1cmUoY29uZmlnIHx8IG9wdGlvbnMpO1xuXG4gICAgICAgIC8vIFdlIGRvbid0IGhhdmUgYSBjb25maWcgZmlsZSBwcmVzZW50IGluIHByb2plY3QgZGlyZWN0b3J5XG4gICAgICAgIC8vIGxldCdzIHJldHVybiBhbiBlbXB0eSBhcnJheSBvZiBlcnJvcnNcbiAgICAgICAgaWYgKCFjb25maWcgJiYgdGhpcy5vbmx5Q29uZmlnKSByZXR1cm4gW107XG5cbiAgICAgICAgY29uc3QgdGV4dCA9IGVkaXRvci5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IGVycm9ycyA9IHRoaXMuanNjc1xuICAgICAgICAgIC5jaGVja1N0cmluZyh0ZXh0LCBmaWxlUGF0aClcbiAgICAgICAgICAuZ2V0RXJyb3JMaXN0KCk7XG5cbiAgICAgICAgcmV0dXJuIGVycm9ycy5tYXAoKHsgcnVsZSwgbWVzc2FnZSwgbGluZSwgY29sdW1uIH0pID0+IHtcblxuICAgICAgICAgIC8vIENhbGN1bGF0ZSByYW5nZSB0byBtYWtlIHRoZSBlcnJvciB3aG9sZSBsaW5lXG4gICAgICAgICAgLy8gd2l0aG91dCB0aGUgaW5kZW50YXRpb24gYXQgYmVnaW5pbmcgb2YgbGluZVxuICAgICAgICAgIGNvbnN0IGluZGVudExldmVsID0gZWRpdG9yLmluZGVudGF0aW9uRm9yQnVmZmVyUm93KGxpbmUgLSAxKTtcbiAgICAgICAgICBjb25zdCBzdGFydENvbCA9IGVkaXRvci5nZXRUYWJMZW5ndGgoKSAqIGluZGVudExldmVsO1xuICAgICAgICAgIGNvbnN0IGVuZENvbCA9IGVkaXRvci5nZXRCdWZmZXIoKS5saW5lTGVuZ3RoRm9yUm93KGxpbmUgLSAxKTtcbiAgICAgICAgICBjb25zdCByYW5nZSA9IFtbbGluZSAtIDEsIHN0YXJ0Q29sXSwgW2xpbmUgLSAxLCBlbmRDb2xdXTtcblxuICAgICAgICAgIGNvbnN0IHR5cGUgPSB0aGlzLmRpc3BsYXlBcztcbiAgICAgICAgICBjb25zdCBodG1sID0gYDxzcGFuIGNsYXNzPSdiYWRnZSBiYWRnZS1mbGV4aWJsZSc+JHtydWxlfTwvc3Bhbj4gJHttZXNzYWdlfWA7XG5cbiAgICAgICAgICByZXR1cm4geyB0eXBlLCBodG1sLCBmaWxlUGF0aCwgcmFuZ2UgfTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBmaXhTdHJpbmcoKSB7XG4gICAgaWYgKHRoaXMuaXNNaXNzaW5nQ29uZmlnICYmIHRoaXMub25seUNvbmZpZykgcmV0dXJuO1xuXG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgIGNvbnN0IHBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpO1xuICAgIGNvbnN0IHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpO1xuICAgIGNvbnN0IGZpeGVkVGV4dCA9IHRoaXMuanNjcy5maXhTdHJpbmcodGV4dCwgcGF0aCkub3V0cHV0O1xuICAgIGlmICh0ZXh0ID09PSBmaXhlZFRleHQpIHJldHVybjtcblxuICAgIGNvbnN0IGN1cnNvclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCk7XG4gICAgZWRpdG9yLnNldFRleHQoZml4ZWRUZXh0KTtcbiAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oY3Vyc29yUG9zaXRpb24pO1xuICB9XG59O1xuIl19
//# sourceURL=/Users/anas/.atom/packages/linter-jscs/index.js
