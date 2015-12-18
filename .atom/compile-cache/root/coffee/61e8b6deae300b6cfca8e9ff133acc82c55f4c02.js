(function() {
  var AtomFoldFunctions, CompositeDisposable,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = AtomFoldFunctions = {
    modalPanel: null,
    subscriptions: null,
    indentLevel: null,
    config: {
      autofold: {
        type: 'boolean',
        "default": false
      },
      shortfileCutoff: {
        type: 'integer',
        "default": 42
      },
      autofoldGrammars: {
        type: 'array',
        "default": []
      },
      autofoldIgnoreGrammars: {
        type: 'array',
        "default": ['SQL', 'CSV', 'JSON', 'CSON', 'Plain Text']
      }
    },
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'fold-functions:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'fold-functions:fold': (function(_this) {
          return function() {
            return _this.fold();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'fold-functions:unfold': (function(_this) {
          return function() {
            return _this.unfold();
          };
        })(this)
      }));
      if (atom.config.get('fold-functions.autofold')) {
        return atom.workspace.observeTextEditors((function(_this) {
          return function(editor) {
            return editor.displayBuffer.tokenizedBuffer.onDidTokenize(function() {
              var autofoldGrammars, autofoldIgnoreGrammars, grammar, shortfileCutoff, _ref, _ref1;
              autofoldGrammars = atom.config.get('fold-functions.autofoldGrammars');
              grammar = editor.getGrammar();
              if (autofoldGrammars.length > 0 && (_ref = grammar.name, __indexOf.call(autofoldGrammars, _ref) < 0)) {
                console.log('autofold grammar not whitelisted', grammar.name);
                return;
              }
              autofoldIgnoreGrammars = atom.config.get('fold-functions.autofoldIgnoreGrammars');
              if (autofoldIgnoreGrammars.length > 0 && (_ref1 = grammar.name, __indexOf.call(autofoldIgnoreGrammars, _ref1) >= 0)) {
                console.log('autofold ignored grammar', grammar.name);
                return;
              }
              if (shortfileCutoff = atom.config.get('fold-functions.shortfileCutoff')) {
                if (shortfileCutoff > 0 && editor.getLineCount() >= shortfileCutoff) {
                  return _this.fold('autofold', editor);
                }
              }
            });
          };
        })(this));
      }
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    fold: function(action, editor) {
      var foldable, hasFoldableLines, isCommented, isFolded, isFunction, row, thisIndentLevel, _i, _ref, _results;
      if (!action) {
        action = 'fold';
      }
      if (!editor) {
        editor = atom.workspace.getActiveTextEditor();
      }
      this.indentLevel = null;
      hasFoldableLines = false;
      _results = [];
      for (row = _i = 0, _ref = editor.getLastBufferRow(); 0 <= _ref ? _i <= _ref : _i >= _ref; row = 0 <= _ref ? ++_i : --_i) {
        foldable = editor.isFoldableAtBufferRow(row);
        isFolded = editor.isFoldedAtBufferRow(row);
        isCommented = editor.isBufferRowCommented(row);
        thisIndentLevel = editor.indentationForBufferRow(row);
        if (this.indentLevel && thisIndentLevel !== this.indentLevel) {
          continue;
        }
        if (action === 'unfold' && !isFolded) {
          continue;
        }
        if (isCommented) {
          continue;
        }
        if (foldable) {
          hasFoldableLines = true;
        }
        isFunction = this.hasScopeAtBufferRow(editor, row, 'meta.function', 'meta.method', 'storage.type.arrow', 'entity.name.function.constructor');
        if (foldable && isFunction && !isCommented) {
          if (this.indentLevel === null) {
            this.indentLevel = thisIndentLevel;
          }
          if (action === 'toggle') {
            _results.push(editor.toggleFoldAtBufferRow(row));
          } else if (action === 'unfold' && isFolded) {
            _results.push(editor.unfoldBufferRow(row));
          } else if (!editor.isFoldedAtBufferRow(row)) {
            _results.push(editor.foldBufferRow(row));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    toggle: function() {
      return this.fold('toggle');
    },
    unfold: function() {
      return this.fold('unfold');
    },
    hasScopeAtBufferRow: function() {
      var editor, row, scope, scopes, _i, _len;
      editor = arguments[0], row = arguments[1], scopes = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      for (_i = 0, _len = scopes.length; _i < _len; _i++) {
        scope = scopes[_i];
        if (this._hasScopeAtBufferRow(editor, row, scope)) {
          return true;
        }
      }
      return false;
    },
    _hasScopeAtBufferRow: function(editor, row, scope) {
      var found, item, pos, scopes, text, _i, _j, _len, _ref, _ref1;
      found = false;
      text = editor.lineTextForBufferRow(row).trim();
      if (text.length > 0) {
        for (pos = _i = 0, _ref = text.length; 0 <= _ref ? _i <= _ref : _i >= _ref; pos = 0 <= _ref ? ++_i : --_i) {
          scopes = editor.scopeDescriptorForBufferPosition([row, pos]);
          _ref1 = scopes.scopes;
          for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
            item = _ref1[_j];
            if (item.startsWith(scope)) {
              found = true;
            }
          }
          if (found) {
            break;
          }
        }
      }
      return found;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvZm9sZC1mdW5jdGlvbnMvbGliL2ZvbGQtZnVuY3Rpb25zLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzQ0FBQTtJQUFBO3NCQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQixpQkFBQSxHQUNmO0FBQUEsSUFBQSxVQUFBLEVBQVksSUFBWjtBQUFBLElBQ0EsYUFBQSxFQUFlLElBRGY7QUFBQSxJQUVBLFdBQUEsRUFBYSxJQUZiO0FBQUEsSUFJQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO09BREY7QUFBQSxNQUdBLGVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxFQURUO09BSkY7QUFBQSxNQU1BLGdCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtPQVBGO0FBQUEsTUFTQSxzQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sT0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLENBQUMsS0FBRCxFQUFRLEtBQVIsRUFBZSxNQUFmLEVBQXVCLE1BQXZCLEVBQStCLFlBQS9CLENBRFQ7T0FWRjtLQUxGO0FBQUEsSUFrQkEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBR1IsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFB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

//# sourceURL=/Users/anas/.atom/packages/fold-functions/lib/fold-functions.coffee
