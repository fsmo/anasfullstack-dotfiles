(function() {
  var $$, ClipboardHistoryView, SelectListView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  module.exports = ClipboardHistoryView = (function(_super) {
    __extends(ClipboardHistoryView, _super);

    function ClipboardHistoryView() {
      return ClipboardHistoryView.__super__.constructor.apply(this, arguments);
    }

    ClipboardHistoryView.prototype.editor = null;

    ClipboardHistoryView.prototype.forceClear = false;

    ClipboardHistoryView.prototype.workspaceView = atom.views.getView(atom.workspace);

    ClipboardHistoryView.prototype.initialize = function(history, editorView) {
      this.history = history;
      this.editorView = editorView;
      ClipboardHistoryView.__super__.initialize.apply(this, arguments);
      this.addClass('clipboard-history');
      return this._handleEvents();
    };

    ClipboardHistoryView.prototype.copy = function() {
      var originalPosition, selectedText;
      this.storeFocusedElement();
      this.editor = atom.workspace.getActiveTextEditor();
      if (this.editor) {
        selectedText = this.editor.getSelectedText();
        if (selectedText.length > 0) {
          return this._add(selectedText);
        } else if (atom.config.get('clipboard-history.enableCopyLine')) {
          originalPosition = this.editor.getCursorBufferPosition();
          this.editor.selectLinesContainingCursors();
          selectedText = this.editor.getSelectedText();
          this.editor.setCursorBufferPosition(originalPosition);
          if (selectedText.length > 0) {
            atom.clipboard.metadata = atom.clipboard.metadata || {};
            atom.clipboard.metadata.fullline = true;
            atom.clipboard.metadata.fullLine = true;
            return this._add(selectedText, atom.clipboard.metadata);
          }
        }
      }
    };

    ClipboardHistoryView.prototype.paste = function() {
      var clipboardItem, exists, item, _i, _len, _ref1;
      exists = false;
      clipboardItem = atom.clipboard.read();
      if (clipboardItem.length > 0 && !this.forceClear) {
        _ref1 = this.history;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          item = _ref1[_i];
          if (item.text === clipboardItem) {
            exists = true;
          }
        }
        if (!exists) {
          this._add(clipboardItem);
        }
      }
      if (this.history.length > 0) {
        this.setItems(this.history.slice(0).reverse());
      } else {
        this.setError("There are no items in your clipboard.");
      }
      return this._attach();
    };

    ClipboardHistoryView.prototype.viewForItem = function(_arg) {
      var clearHistory, date, text;
      text = _arg.text, date = _arg.date, clearHistory = _arg.clearHistory;
      if (clearHistory) {
        return $$(function() {
          return this.li({
            "class": 'two-lines text-center'
          }, (function(_this) {
            return function() {
              return _this.span(text);
            };
          })(this));
        });
      } else {
        text = this._limitString(text, 65);
        date = this._timeSince(date);
        return $$(function() {
          return this.li({
            "class": 'two-lines'
          }, (function(_this) {
            return function() {
              _this.div({
                "class": 'pull-right secondary-line'
              }, function() {
                return _this.span(date);
              });
              _this.span(text.limited);
              if (atom.config.get('clipboard-history.showSnippetForLargeItems')) {
                return _this.div({
                  "class": 'preview hidden panel-bottom padded'
                }, function() {
                  return _this.pre(text.initial);
                });
              }
            };
          })(this));
        });
      }
    };

    ClipboardHistoryView.prototype.selectItemView = function(view) {
      var preview;
      if (!view.length) {
        return;
      }
      this.list.find('.selected').removeClass('selected');
      view.addClass('selected');
      this.scrollToItemView(view);
      this.list.find('.preview').addClass('hidden');
      preview = view.find('.preview');
      if (preview.length !== 0 && preview.text().length > 65 && atom.config.get('clipboard-history.showSnippetForLargeItems')) {
        if (view.position().top !== 0) {
          preview.css({
            'top': (view.position().top - 5) + 'px'
          });
        }
        return preview.removeClass('hidden');
      }
    };

    ClipboardHistoryView.prototype.confirmed = function(item) {
      if (item.clearHistory != null) {
        this.history = [];
        this.forceClear = true;
      } else {
        this.history.splice(this.history.indexOf(item), 1);
        this.history.push(item);
        atom.clipboard.write(item.text);
        atom.workspace.getActivePaneItem().insertText(item.text, {
          select: true
        });
      }
      return this.cancel();
    };

    ClipboardHistoryView.prototype.getFilterKey = function() {
      return 'text';
    };

    ClipboardHistoryView.prototype.cancelled = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    ClipboardHistoryView.prototype._add = function(element, metadata) {
      if (metadata == null) {
        metadata = {};
      }
      atom.clipboard.write(element, metadata);
      this.forceClear = false;
      if (this.history.length === 0 && atom.config.get('clipboard-history.showClearHistoryButton')) {
        this.history.push({
          text: 'Clear History',
          clearHistory: true
        });
      }
      return this.history.push({
        'text': element,
        'date': Date.now()
      });
    };

    ClipboardHistoryView.prototype._handleEvents = function() {
      atom.commands.add('atom-workspace', {
        'clipboard-history:copy': (function(_this) {
          return function(event) {
            return _this.copy();
          };
        })(this)
      });
      return atom.commands.add('atom-workspace', {
        'clipboard-history:paste': (function(_this) {
          return function(event) {
            var _ref1;
            if ((_ref1 = _this.panel) != null ? _ref1.isVisible() : void 0) {
              return _this.cancel();
            } else {
              return _this.paste();
            }
          };
        })(this)
      });
    };

    ClipboardHistoryView.prototype._setPosition = function() {
      return this.panel.item.parent().css({
        'margin-left': 'auto',
        'margin-right': 'auto',
        top: 200,
        bottom: 'inherit'
      });
    };

    ClipboardHistoryView.prototype._attach = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this._setPosition();
      this.panel.show();
      return this.focusFilterEditor();
    };

    ClipboardHistoryView.prototype._timeSince = function(date) {
      var interval, seconds;
      if (date) {
        seconds = Math.floor((new Date() - date) / 1000);
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
          return interval + " hours ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
          return interval + " minutes ago";
        }
        if (seconds > 0) {
          return Math.floor(seconds) + " seconds ago";
        }
        return "now";
      }
    };

    ClipboardHistoryView.prototype._limitString = function(string, limit) {
      var text;
      text = {};
      text.initial = text.limited = string;
      if (string.length > limit) {
        text.limited = string.substr(0, limit) + ' ...';
      }
      return text;
    };

    return ClipboardHistoryView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvY2xpcGJvYXJkLWhpc3RvcnkvbGliL2NsaXBib2FyZC1oaXN0b3J5LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUF5QixPQUFBLENBQVEsc0JBQVIsQ0FBekIsRUFBRSxVQUFBLEVBQUYsRUFBTSxzQkFBQSxjQUFOLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUVNO0FBRUosMkNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLG1DQUFBLE1BQUEsR0FBUSxJQUFSLENBQUE7O0FBQUEsbUNBQ0EsVUFBQSxHQUFZLEtBRFosQ0FBQTs7QUFBQSxtQ0FFQSxhQUFBLEdBQWUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUZmLENBQUE7O0FBQUEsbUNBTUEsVUFBQSxHQUFZLFNBQUUsT0FBRixFQUFZLFVBQVosR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLFVBQUEsT0FDWixDQUFBO0FBQUEsTUFEcUIsSUFBQyxDQUFBLGFBQUEsVUFDdEIsQ0FBQTtBQUFBLE1BQUEsc0RBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsbUJBQVYsQ0FEQSxDQUFBO2FBRUEsSUFBQyxDQUFBLGFBQUQsQ0FBQSxFQUhVO0lBQUEsQ0FOWixDQUFBOztBQUFBLG1DQVdBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDSixVQUFBLDhCQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsbUJBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFYsQ0FBQTtBQUdBLE1B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

//# sourceURL=/Users/anas/.atom/packages/clipboard-history/lib/clipboard-history-view.coffee
