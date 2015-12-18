(function() {
  var CompositeDisposable, Mocha, ResultView, context, currentContext, mocha, path, resultView;

  path = require('path');

  context = require('./context');

  Mocha = require('./mocha');

  ResultView = require('./result-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  mocha = null;

  resultView = null;

  currentContext = null;

  module.exports = {
    config: {
      nodeBinaryPath: {
        type: 'string',
        "default": '/usr/local/bin/node',
        description: 'Path to the node executable'
      },
      textOnlyOutput: {
        type: 'boolean',
        "default": false,
        description: 'Remove any colors from the Mocha output'
      },
      showContextInformation: {
        type: 'boolean',
        "default": false,
        description: 'Display extra information for troubleshooting'
      },
      options: {
        type: 'string',
        "default": '',
        description: 'Append given options always to Mocha binary'
      },
      optionsForDebug: {
        type: 'string',
        "default": '--debug --debug-brk',
        description: 'Append given options to Mocha binary to enable debugging'
      },
      env: {
        type: 'string',
        "default": '',
        description: 'Append environment variables'
      }
    },
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      resultView = new ResultView(state);
      this.subscriptions.add(atom.commands.add(resultView, 'result-view:close', (function(_this) {
        return function() {
          return _this.close();
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'core:cancel', (function(_this) {
        return function() {
          return _this.close();
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'core:close', (function(_this) {
        return function() {
          return _this.close();
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'mocha-test-runner:run': (function(_this) {
          return function() {
            return _this.run();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'mocha-test-runner:debug': (function(_this) {
          return function() {
            return _this.run(true);
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'mocha-test-runner:run-previous', (function(_this) {
        return function() {
          return _this.runPrevious();
        };
      })(this)));
      return this.subscriptions.add(atom.commands.add('atom-workspace', 'mocha-test-runner:debug-previous', (function(_this) {
        return function() {
          return _this.runPrevious(true);
        };
      })(this)));
    },
    deactivate: function() {
      this.close();
      this.subscriptions.dispose();
      return resultView = null;
    },
    serialize: function() {
      return resultView.serialize();
    },
    close: function() {
      var _ref;
      if (mocha) {
        mocha.stop();
      }
      resultView.detach();
      return (_ref = this.resultViewPanel) != null ? _ref.destroy() : void 0;
    },
    run: function(inDebugMode) {
      var editor;
      if (inDebugMode == null) {
        inDebugMode = false;
      }
      editor = atom.workspace.getActivePaneItem();
      currentContext = context.find(editor);
      return this.execute(inDebugMode);
    },
    runPrevious: function(inDebugMode) {
      if (inDebugMode == null) {
        inDebugMode = false;
      }
      if (currentContext) {
        return this.execute(inDebugMode);
      } else {
        return this.displayError('No previous test run');
      }
    },
    execute: function(inDebugMode) {
      var editor, nodeBinary;
      if (inDebugMode == null) {
        inDebugMode = false;
      }
      resultView.reset();
      if (!resultView.hasParent()) {
        this.resultViewPanel = atom.workspace.addBottomPanel({
          item: resultView
        });
      }
      if (atom.config.get('mocha-test-runner.showContextInformation')) {
        nodeBinary = atom.config.get('mocha-test-runner.nodeBinaryPath');
        resultView.addLine("Node binary:    " + nodeBinary + "\n");
        resultView.addLine("Root folder:    " + currentContext.root + "\n");
        resultView.addLine("Path to mocha:  " + currentContext.mocha + "\n");
        resultView.addLine("Debug-Mode:     " + inDebugMode + "\n");
        resultView.addLine("Test file:      " + currentContext.test + "\n");
        resultView.addLine("Selected test:  " + currentContext.grep + "\n\n");
      }
      editor = atom.workspace.getActivePaneItem();
      mocha = new Mocha(currentContext, inDebugMode);
      mocha.on('success', function() {
        return resultView.success();
      });
      mocha.on('failure', function() {
        return resultView.failure();
      });
      mocha.on('updateSummary', function(stats) {
        return resultView.updateSummary(stats);
      });
      mocha.on('output', function(text) {
        return resultView.addLine(text);
      });
      mocha.on('error', function(err) {
        resultView.addLine('Failed to run Mocha\n' + err.message);
        return resultView.failure();
      });
      return mocha.run();
    },
    displayError: function(message) {
      resultView.reset();
      resultView.addLine(message);
      resultView.failure();
      if (!resultView.hasParent()) {
        return atom.workspace.addBottomPanel({
          item: resultView
        });
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbW9jaGEtdGVzdC1ydW5uZXIvbGliL21vY2hhLXRlc3QtcnVubmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3RkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBYyxPQUFBLENBQVEsTUFBUixDQUFkLENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQWMsT0FBQSxDQUFRLFdBQVIsQ0FEZCxDQUFBOztBQUFBLEVBRUEsS0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSLENBRmQsQ0FBQTs7QUFBQSxFQUdBLFVBQUEsR0FBYyxPQUFBLENBQVEsZUFBUixDQUhkLENBQUE7O0FBQUEsRUFLQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBTEQsQ0FBQTs7QUFBQSxFQU9BLEtBQUEsR0FBUSxJQVBSLENBQUE7O0FBQUEsRUFRQSxVQUFBLEdBQWEsSUFSYixDQUFBOztBQUFBLEVBU0EsY0FBQSxHQUFpQixJQVRqQixDQUFBOztBQUFBLEVBV0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMscUJBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSw2QkFGYjtPQURGO0FBQUEsTUFJQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLHlDQUZiO09BTEY7QUFBQSxNQVFBLHNCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLCtDQUZiO09BVEY7QUFBQSxNQVlBLE9B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

//# sourceURL=/Users/anas/.atom/packages/mocha-test-runner/lib/mocha-test-runner.coffee
