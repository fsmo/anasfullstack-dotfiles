(function() {
  var CompositeDisposable, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require('atom').CompositeDisposable;

  path = require('path');

  module.exports = {
    config: {
      executablePath: {
        type: 'string',
        "default": path.join(__dirname, '..', 'node_modules', 'jshint', 'bin', 'jshint'),
        description: 'Path of the `jshint` executable.'
      },
      lintInlineJavaScript: {
        type: 'boolean',
        "default": false,
        description: 'Lint JavaScript inside `<script>` blocks in HTML or PHP files.'
      },
      disableWhenNoJshintrcFileInPath: {
        type: 'boolean',
        "default": false,
        description: 'Disable linter when no `.jshintrc` is found in project.'
      }
    },
    activate: function() {
      var scopeEmbedded;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-jshint.executablePath', (function(_this) {
        return function(executablePath) {
          return _this.executablePath = executablePath;
        };
      })(this)));
      scopeEmbedded = 'source.js.embedded.html';
      this.scopes = ['source.js', 'source.js.jsx', 'source.js-semantic'];
      this.subscriptions.add(atom.config.observe('linter-jshint.lintInlineJavaScript', (function(_this) {
        return function(lintInlineJavaScript) {
          if (lintInlineJavaScript) {
            if (__indexOf.call(_this.scopes, scopeEmbedded) < 0) {
              return _this.scopes.push(scopeEmbedded);
            }
          } else {
            if (__indexOf.call(_this.scopes, scopeEmbedded) >= 0) {
              return _this.scopes.splice(_this.scopes.indexOf(scopeEmbedded), 1);
            }
          }
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter-jshint.disableWhenNoJshintrcFileInPath', (function(_this) {
        return function(disableWhenNoJshintrcFileInPath) {
          return _this.disableWhenNoJshintrcFileInPath = disableWhenNoJshintrcFileInPath;
        };
      })(this)));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      var helpers, provider, reporter;
      helpers = require('atom-linter');
      reporter = require('jshint-json');
      return provider = {
        name: 'JSHint',
        grammarScopes: this.scopes,
        scope: 'file',
        lintOnFly: true,
        lint: (function(_this) {
          return function(textEditor) {
            var filePath, parameters, text;
            filePath = textEditor.getPath();
            if (_this.disableWhenNoJshintrcFileInPath && !helpers.findFile(filePath, '.jshintrc')) {
              return [];
            }
            text = textEditor.getText();
            parameters = ['--reporter', reporter, '--filename', filePath];
            if (textEditor.getGrammar().scopeName.indexOf('text.html') !== -1 && __indexOf.call(_this.scopes, 'source.js.embedded.html') >= 0) {
              parameters.push('--extract', 'always');
            }
            parameters.push('-');
            return helpers.execNode(_this.executablePath, parameters, {
              stdin: text
            }).then(function(output) {
              if (!output.length) {
                return [];
              }
              output = JSON.parse(output).result;
              output = output.filter(function(entry) {
                return entry.error.id;
              });
              return output.map(function(entry) {
                var error, pointEnd, pointStart, type;
                error = entry.error;
                pointStart = [error.line - 1, error.character - 1];
                pointEnd = [error.line - 1, error.character];
                type = error.code.substr(0, 1);
                return {
                  type: type === 'E' ? 'Error' : type === 'W' ? 'Warning' : 'Info',
                  text: "" + error.code + " - " + error.reason,
                  filePath: filePath,
                  range: [pointStart, pointEnd]
                };
              });
            });
          };
        })(this)
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbGludGVyLWpzaGludC9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUJBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsY0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixJQUFyQixFQUEyQixjQUEzQixFQUEyQyxRQUEzQyxFQUFxRCxLQUFyRCxFQUE0RCxRQUE1RCxDQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsa0NBRmI7T0FERjtBQUFBLE1BSUEsb0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsZ0VBRmI7T0FMRjtBQUFBLE1BUUEsK0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEseURBRmI7T0FURjtLQURGO0FBQUEsSUFjQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBQSxhQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9B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

//# sourceURL=/Users/anas/.atom/packages/linter-jshint/lib/main.coffee
