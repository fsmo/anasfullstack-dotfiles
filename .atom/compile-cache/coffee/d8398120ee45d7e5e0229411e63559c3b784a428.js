(function() {
  var TermView, capitalize, path;

  path = require('path');

  TermView = require('./lib/TermView');

  capitalize = function(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  };

  module.exports = {
    termViews: [],
    focusedTerminal: false,
    config: {
      autoRunCommand: {
        type: 'string',
        "default": ''
      },
      titleTemplate: {
        type: 'string',
        "default": "Terminal ({{ bashName }})"
      },
      fontFamily: {
        type: 'string',
        "default": ''
      },
      fontSize: {
        type: 'string',
        "default": ''
      },
      colors: {
        type: 'object',
        properties: {
          normalBlack: {
            type: 'color',
            "default": '#2e3436'
          },
          normalRed: {
            type: 'color',
            "default": '#cc0000'
          },
          normalGreen: {
            type: 'color',
            "default": '#4e9a06'
          },
          normalYellow: {
            type: 'color',
            "default": '#c4a000'
          },
          normalBlue: {
            type: 'color',
            "default": '#3465a4'
          },
          normalPurple: {
            type: 'color',
            "default": '#75507b'
          },
          normalCyan: {
            type: 'color',
            "default": '#06989a'
          },
          normalWhite: {
            type: 'color',
            "default": '#d3d7cf'
          },
          brightBlack: {
            type: 'color',
            "default": '#555753'
          },
          brightRed: {
            type: 'color',
            "default": '#ef2929'
          },
          brightGreen: {
            type: 'color',
            "default": '#8ae234'
          },
          brightYellow: {
            type: 'color',
            "default": '#fce94f'
          },
          brightBlue: {
            type: 'color',
            "default": '#729fcf'
          },
          brightPurple: {
            type: 'color',
            "default": '#ad7fa8'
          },
          brightCyan: {
            type: 'color',
            "default": '#34e2e2'
          },
          brightWhite: {
            type: 'color',
            "default": '#eeeeec'
          },
          background: {
            type: 'color',
            "default": '#000000'
          },
          foreground: {
            type: 'color',
            "default": '#f0f0f0'
          }
        }
      },
      scrollback: {
        type: 'integer',
        "default": 1000
      },
      cursorBlink: {
        type: 'boolean',
        "default": true
      },
      shellOverride: {
        type: 'string',
        "default": ''
      },
      shellArguments: {
        type: 'string',
        "default": (function(_arg) {
          var HOME, SHELL;
          SHELL = _arg.SHELL, HOME = _arg.HOME;
          switch (path.basename(SHELL.toLowerCase())) {
            case 'bash':
              return "--init-file " + (path.join(HOME, '.bash_profile'));
            case 'zsh':
              return "";
            default:
              return '';
          }
        })(process.env)
      },
      openPanesInSameSplit: {
        type: 'boolean',
        "default": false
      }
    },
    activate: function(state) {
      this.state = state;
      ['up', 'right', 'down', 'left'].forEach((function(_this) {
        return function(direction) {
          return atom.commands.add("atom-workspace", "term2:open-split-" + direction, _this.splitTerm.bind(_this, direction));
        };
      })(this));
      atom.commands.add("atom-workspace", "term2:open", this.newTerm.bind(this));
      atom.commands.add("atom-workspace", "term2:pipe-path", this.pipeTerm.bind(this, 'path'));
      return atom.commands.add("atom-workspace", "term2:pipe-selection", this.pipeTerm.bind(this, 'selection'));
    },
    getColors: function() {
      var background, brightBlack, brightBlue, brightCyan, brightGreen, brightPurple, brightRed, brightWhite, brightYellow, foreground, normalBlack, normalBlue, normalCyan, normalGreen, normalPurple, normalRed, normalWhite, normalYellow, _ref;
      _ref = (atom.config.getAll('term2.colors'))[0].value, normalBlack = _ref.normalBlack, normalRed = _ref.normalRed, normalGreen = _ref.normalGreen, normalYellow = _ref.normalYellow, normalBlue = _ref.normalBlue, normalPurple = _ref.normalPurple, normalCyan = _ref.normalCyan, normalWhite = _ref.normalWhite, brightBlack = _ref.brightBlack, brightRed = _ref.brightRed, brightGreen = _ref.brightGreen, brightYellow = _ref.brightYellow, brightBlue = _ref.brightBlue, brightPurple = _ref.brightPurple, brightCyan = _ref.brightCyan, brightWhite = _ref.brightWhite, background = _ref.background, foreground = _ref.foreground;
      return [normalBlack, normalRed, normalGreen, normalYellow, normalBlue, normalPurple, normalCyan, normalWhite, brightBlack, brightRed, brightGreen, brightYellow, brightBlue, brightPurple, brightCyan, brightWhite, background, foreground];
    },
    createTermView: function() {
      var opts, termView, _base;
      opts = {
        runCommand: atom.config.get('term2.autoRunCommand'),
        shellOverride: atom.config.get('term2.shellOverride'),
        shellArguments: atom.config.get('term2.shellArguments'),
        titleTemplate: atom.config.get('term2.titleTemplate'),
        cursorBlink: atom.config.get('term2.cursorBlink'),
        fontFamily: atom.config.get('term2.fontFamily'),
        fontSize: atom.config.get('term2.fontSize'),
        colors: this.getColors()
      };
      termView = new TermView(opts);
      termView.on('remove', this.handleRemoveTerm.bind(this));
      if (typeof (_base = this.termViews).push === "function") {
        _base.push(termView);
      }
      return termView;
    },
    splitTerm: function(direction) {
      var activePane, item, openPanesInSameSplit, pane, splitter, termView;
      openPanesInSameSplit = atom.config.get('term2.openPanesInSameSplit');
      termView = this.createTermView();
      termView.on("click", (function(_this) {
        return function() {
          termView.term.element.focus();
          termView.term.focus();
          return _this.focusedTerminal = termView;
        };
      })(this));
      direction = capitalize(direction);
      splitter = (function(_this) {
        return function() {
          var pane;
          pane = activePane["split" + direction]({
            items: [termView]
          });
          activePane.termSplits[direction] = pane;
          return _this.focusedTerminal = [pane, pane.items[0]];
        };
      })(this);
      activePane = atom.workspace.getActivePane();
      activePane.termSplits || (activePane.termSplits = {});
      if (openPanesInSameSplit) {
        if (activePane.termSplits[direction] && activePane.termSplits[direction].items.length > 0) {
          pane = activePane.termSplits[direction];
          item = pane.addItem(termView);
          pane.activateItem(item);
          return this.focusedTerminal = [pane, item];
        } else {
          return splitter();
        }
      } else {
        return splitter();
      }
    },
    newTerm: function() {
      var item, pane, termView;
      termView = this.createTermView();
      pane = atom.workspace.getActivePane();
      item = pane.addItem(termView);
      return pane.activateItem(item);
    },
    pipeTerm: function(action) {
      var editor, item, pane, stream, _ref;
      editor = this.getActiveEditor();
      stream = (function() {
        switch (action) {
          case 'path':
            return editor.getBuffer().file.path;
          case 'selection':
            return editor.getSelectedText();
        }
      })();
      if (stream && this.focusedTerminal) {
        if (Array.isArray(this.focusedTerminal)) {
          _ref = this.focusedTerminal, pane = _ref[0], item = _ref[1];
          pane.activateItem(item);
        } else {
          item = this.focusedTerminal;
        }
        item.pty.write(stream.trim());
        return item.term.focus();
      }
    },
    handleRemoveTerm: function(termView) {
      return this.termViews.splice(this.termViews.indexOf(termView), 1);
    },
    deactivate: function() {
      return this.termViews.forEach(function(view) {
        return view.deactivate();
      });
    },
    serialize: function() {
      var termViewsState;
      termViewsState = this.termViews.map(function(view) {
        return view.serialize();
      });
      return {
        termViews: termViewsState
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvdGVybTIvaW5kZXguY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBCQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsZ0JBQVIsQ0FEWCxDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLFNBQUMsR0FBRCxHQUFBO1dBQVEsR0FBSSxDQUFBLENBQUEsQ0FBRSxDQUFDLFdBQVAsQ0FBQSxDQUFBLEdBQXVCLEdBQUksU0FBSSxDQUFDLFdBQVQsQ0FBQSxFQUEvQjtFQUFBLENBSGIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBRUk7QUFBQSxJQUFBLFNBQUEsRUFBVyxFQUFYO0FBQUEsSUFDQSxlQUFBLEVBQWlCLEtBRGpCO0FBQUEsSUFHQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLGNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxFQURUO09BREY7QUFBQSxNQUdBLGFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUywyQkFEVDtPQUpGO0FBQUEsTUFNQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtPQVBGO0FBQUEsTUFTQSxRQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtPQVZGO0FBQUEsTUFZQSxNQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxVQUFBLEVBQ0U7QUFBQSxVQUFBLFdBQUEsRUFDRTtBQUFBLFlBQUEs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

//# sourceURL=/Users/anas/.atom/packages/term2/index.coffee
