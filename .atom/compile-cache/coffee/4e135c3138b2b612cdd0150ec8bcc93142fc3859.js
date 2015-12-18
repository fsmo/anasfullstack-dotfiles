(function() {
  var $$$, TextEditorView, View, _ref;

  _ref = require('atom-space-pen-views'), $$$ = _ref.$$$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  module.exports = function() {
    return this.div({
      tabIndex: -1,
      "class": 'atomts-rename-view'
    }, (function(_this) {
      return function() {
        _this.div({
          "class": 'block'
        }, function() {
          return _this.div(function() {
            _this.span({
              outlet: 'title'
            }, function() {
              return 'Rename Variable';
            });
            return _this.span({
              "class": 'subtle-info-message'
            }, function() {
              _this.span('Close this panel with ');
              _this.span({
                "class": 'highlight'
              }, 'esc');
              _this.span(' key. And commit with the ');
              _this.span({
                "class": 'highlight'
              }, 'enter');
              return _this.span('key.');
            });
          });
        });
        _this.div({
          "class": 'find-container block'
        }, function() {
          return _this.div({
            "class": 'editor-container'
          }, function() {
            return _this.subview('newNameEditor', new TextEditorView({
              mini: true,
              placeholderText: 'new name'
            }));
          });
        });
        _this.div({
          outlet: 'fileCount'
        }, function() {});
        _this.br({});
        return _this.div({
          "class": 'highlight-error',
          style: 'display:none',
          outlet: 'validationMessage'
        });
      };
    })(this));
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXRvbS10eXBlc2NyaXB0L3ZpZXdzL3JlbmFtZVZpZXcuaHRtbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0JBQUE7O0FBQUEsRUFBQSxPQUE4QixPQUFBLENBQVEsc0JBQVIsQ0FBOUIsRUFBQyxXQUFBLEdBQUQsRUFBTSxZQUFBLElBQU4sRUFBWSxzQkFBQSxjQUFaLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNJLFNBQUEsR0FBQTtXQUNJLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxNQUFBLFFBQUEsRUFBVSxDQUFBLENBQVY7QUFBQSxNQUFjLE9BQUEsRUFBTyxvQkFBckI7S0FBTCxFQUFnRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQSxHQUFBO0FBQzVDLFFBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFVBQUEsT0FBQSxFQUFPLE9BQVA7U0FBTCxFQUFxQixTQUFBLEdBQUE7aUJBQ2pCLEtBQUMsQ0FBQSxHQUFELENBQUssU0FBQSxHQUFBO0FBQ0QsWUFBQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsY0FBQyxNQUFBLEVBQVEsT0FBVDthQUFOLEVBQXlCLFNBQUEsR0FBQTtxQkFBRyxrQkFBSDtZQUFBLENBQXpCLENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsY0FBQSxPQUFBLEVBQU8scUJBQVA7YUFBTixFQUFvQyxTQUFBLEdBQUE7QUFDaEMsY0FBQSxLQUFDLENBQUEsSUFBRCxDQUFNLHdCQUFOLENBQUEsQ0FBQTtBQUFBLGNBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGdCQUFBLE9BQUEsRUFBTSxXQUFOO2VBQU4sRUFBeUIsS0FBekIsQ0FEQSxDQUFBO0FBQUEsY0FFQSxLQUFDLENBQUEsSUFBRCxDQUFNLDRCQUFOLENBRkEsQ0FBQTtBQUFBLGNBR0EsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGdCQUFBLE9BQUEsRUFBTSxXQUFOO2VBQU4sRUFBeUIsT0FBekIsQ0FIQSxDQUFBO3FCQUlBLEtBQUMsQ0FBQSxJQUFELENBQU0sTUFBTixFQUxnQztZQUFBLENBQXBDLEVBRkM7VUFBQSxDQUFMLEVBRGlCO1FBQUEsQ0FBckIsQ0FBQSxDQUFBO0FBQUEsUUFVQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsVUFBQSxPQUFBLEVBQU8sc0JBQVA7U0FBTCxFQUFvQyxTQUFBLEdBQUE7aUJBQ2hDLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxrQkFBUDtXQUFMLEVBQWdDLFNBQUEsR0FBQTttQkFDNUIsS0FBQyxDQUFBLE9BQUQsQ0FBUyxlQUFULEVBQThCLElBQUEsY0FBQSxDQUFlO0FBQUEsY0FBQSxJQUFBLEVBQU0sSUFBTjtBQUFBLGNBQVksZUFBQSxFQUFpQixVQUE3QjthQUFmLENBQTlCLEVBRDRCO1VBQUEsQ0FBaEMsRUFEZ0M7UUFBQSxDQUFwQyxDQVZBLENBQUE7QUFBQSxRQWNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxVQUFDLE1BQUEsRUFBTyxXQUFSO1NBQUwsRUFBMkIsU0FBQSxHQUFBLENBQTNCLENBZEEsQ0FBQTtBQUFBLFFBZUEsS0FBQyxDQUFBLEVBQUQsQ0FBSSxFQUFKLENBZkEsQ0FBQTtlQWdCQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsVUFBQyxPQUFBLEVBQU8saUJBQVI7QUFBQSxVQUEyQixLQUFBLEVBQU0sY0FBakM7QUFBQSxVQUFpRCxNQUFBLEVBQU8sbUJBQXhEO1NBQUwsRUFqQjRDO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEQsRUFESjtFQUFBLENBSEosQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/anas/.atom/packages/atom-typescript/views/renameView.html.coffee
