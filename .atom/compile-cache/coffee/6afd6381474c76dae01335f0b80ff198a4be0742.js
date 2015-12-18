(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    activate: function(state) {
      this.disposables = new CompositeDisposable;
      return this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this._handleLoad(editor);
        };
      })(this)));
    },
    _handleLoad: function(editor) {
      this._loadSettingsForEditor(editor);
      return this.disposables.add(editor.buffer.onDidSave((function(_this) {
        return function() {
          return _this._loadSettingsForEditor(editor);
        };
      })(this)));
    },
    deactivate: function() {
      return this.disposables.dispose();
    },
    _loadSettingsForEditor: function(editor) {
      var firstSpaces, found, i, length, lineCount, numLinesWithSpaces, numLinesWithTabs, shortest, spaceChars, _i, _ref;
      lineCount = editor.getLineCount();
      shortest = 0;
      numLinesWithTabs = 0;
      numLinesWithSpaces = 0;
      found = false;
      for (i = _i = 0, _ref = lineCount - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (!(i < 100 || !found)) {
          continue;
        }
        firstSpaces = editor.lineTextForBufferRow(i).match(/^([ \t]+)[^ \t]/m);
        if (firstSpaces) {
          spaceChars = firstSpaces[1];
          if (spaceChars[0] === '\t') {
            numLinesWithTabs++;
          } else {
            length = spaceChars.length;
            if (length === 1) {
              continue;
            }
            numLinesWithSpaces++;
            if (length < shortest || shortest === 0) {
              shortest = length;
            }
          }
          found = true;
        }
      }
      if (found) {
        if (numLinesWithTabs > numLinesWithSpaces) {
          editor.setSoftTabs(false);
          return editor.setTabLength(atom.config.get("editor.tabLength", {
            scope: editor.getRootScopeDescriptor().scopes
          }));
        } else {
          editor.setSoftTabs(true);
          return editor.setTabLength(shortest);
        }
      } else {
        editor.setSoftTabs(atom.config.get("editor.softTabs", {
          scope: editor.getRootScopeDescriptor().scopes
        }));
        return editor.setTabLength(atom.config.get("editor.tabLength", {
          scope: editor.getRootScopeDescriptor().scopes
        }));
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXV0by1kZXRlY3QtaW5kZW50YXRpb24vbGliL2F1dG8tZGV0ZWN0LWluZGVudGF0aW9uLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQkFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLEdBQUEsQ0FBQSxtQkFBZixDQUFBO2FBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO2lCQUNqRCxLQUFDLENBQUEsV0FBRCxDQUFhLE1BQWIsRUFEaUQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxDQUFqQixFQUZRO0lBQUEsQ0FBVjtBQUFBLElBS0EsV0FBQSxFQUFhLFNBQUMsTUFBRCxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsc0JBQUQsQ0FBd0IsTUFBeEIsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBZCxDQUF3QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUN2QyxLQUFDLENBQUEsc0JBQUQsQ0FBd0IsTUFBeEIsRUFEdUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QixDQUFqQixFQUZXO0lBQUEsQ0FMYjtBQUFBLElBVUEsVUFBQSxFQUFZLFNB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

//# sourceURL=/Users/anas/.atom/packages/auto-detect-indentation/lib/auto-detect-indentation.coffee
