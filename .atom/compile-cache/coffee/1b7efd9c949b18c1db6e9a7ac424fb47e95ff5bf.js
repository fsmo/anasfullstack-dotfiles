(function() {
  var Disposable;

  Disposable = require('atom').Disposable;

  module.exports = {
    instance: null,
    config: {
      lintOnFly: {
        description: 'Lint files while typing, without the need to save them',
        type: 'boolean',
        "default": true,
        order: 1
      },
      lintOnFlyInterval: {
        description: 'Interval at which providers are triggered on the fly',
        type: 'integer',
        "default": 300,
        order: 1
      },
      ignoredMessageTypes: {
        description: 'Comma separated list of message types to completely ignore',
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        },
        order: 2
      },
      ignoreVCSIgnoredFiles: {
        title: 'Ignore VCS Ignored Files',
        description: 'Do not lint files ignored by VCS',
        type: 'boolean',
        "default": true,
        order: 2
      },
      showErrorInline: {
        title: 'Show Inline Tooltips',
        description: 'Show inline tooltips for errors',
        type: 'boolean',
        "default": true,
        order: 3
      },
      inlineTooltipInterval: {
        title: 'Inline tooltip interval',
        description: 'Interval at which inline tooltip is updated (in ms)',
        type: 'integer',
        "default": 60,
        order: 3
      },
      gutterEnabled: {
        title: 'Highlight error lines in gutter',
        type: 'boolean',
        "default": true,
        order: 3
      },
      gutterPosition: {
        title: 'Position of gutter highlights',
        "enum": ['Left', 'Right'],
        "default": 'Right',
        order: 3,
        type: 'string'
      },
      underlineIssues: {
        title: 'Underline Issues',
        type: 'boolean',
        "default": true,
        order: 3
      },
      showProviderName: {
        title: 'Show Provider Name (when available)',
        type: 'boolean',
        "default": true,
        order: 3
      },
      showErrorPanel: {
        title: 'Show Error Panel at the Bottom',
        description: 'Show the list of errors in a bottom panel',
        type: 'boolean',
        "default": true,
        order: 4
      },
      errorPanelHeight: {
        title: 'Error Panel Height',
        description: 'The error panel height in pixels',
        type: 'number',
        "default": 150,
        order: 4
      },
      alwaysTakeMinimumSpace: {
        title: 'Always Take Minimum Space',
        description: 'Resize the error panel smaller than the height where possible',
        type: 'boolean',
        "default": true,
        order: 4
      },
      displayLinterInfo: {
        title: 'Display Linter Info in Status Bar',
        description: 'Whether to show any linter information in the status bar',
        type: 'boolean',
        "default": true,
        order: 5
      },
      showErrorTabLine: {
        title: 'Show Line tab in Status Bar',
        type: 'boolean',
        "default": false,
        order: 5
      },
      showErrorTabFile: {
        title: 'Show File tab in Status Bar',
        type: 'boolean',
        "default": true,
        order: 5
      },
      showErrorTabProject: {
        title: 'Show Project tab in Status Bar',
        type: 'boolean',
        "default": true,
        order: 5
      },
      statusIconScope: {
        title: 'Scope of messages to show in status icon',
        type: 'string',
        "enum": ['File', 'Line', 'Project'],
        "default": 'Project',
        order: 5
      },
      statusIconPosition: {
        title: 'Position of Status Icon in Status Bar',
        "enum": ['Left', 'Right'],
        type: 'string',
        "default": 'Left',
        order: 5
      }
    },
    activate: function(state) {
      var LinterPlus;
      this.state = state;
      LinterPlus = require('./linter.coffee');
      return this.instance = new LinterPlus(state);
    },
    serialize: function() {
      return this.state;
    },
    consumeLinter: function(linters) {
      var linter, _i, _len;
      if (!(linters instanceof Array)) {
        linters = [linters];
      }
      for (_i = 0, _len = linters.length; _i < _len; _i++) {
        linter = linters[_i];
        this.instance.addLinter(linter);
      }
      return new Disposable((function(_this) {
        return function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = linters.length; _j < _len1; _j++) {
            linter = linters[_j];
            _results.push(_this.instance.deleteLinter(linter));
          }
          return _results;
        };
      })(this));
    },
    consumeStatusBar: function(statusBar) {
      return this.instance.views.attachBottom(statusBar);
    },
    provideLinter: function() {
      return this.instance;
    },
    deactivate: function() {
      var _ref;
      return (_ref = this.instance) != null ? _ref.deactivate() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxVQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxJQUFWO0FBQUEsSUFDQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFNBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLHdEQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLElBRlQ7QUFBQSxRQUdBLEtBQUEsRUFBTyxDQUhQO09BREY7QUFBQSxNQUtBLGlCQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSxzREFBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxHQUZUO0FBQUEsUUFHQSxLQUFBLEVBQU8sQ0FIUDtPQU5GO0FBQUEsTUFXQSxtQkFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsNERBQWI7QUFBQSxRQUNBLElBQUEsRUFBTSxPQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsRUFGVDtBQUFBLFFBR0EsS0FBQSxFQUNFO0FBQUEsVUFBQSxJQUFBLEVBQU0sUUFBTjtTQUpGO0FBQUEsUUFLQSxLQUFBLEVBQU8sQ0FMUDtPQVpGO0FBQUEsTUFrQkEscUJBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLDBCQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsa0NBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsSUFIVDtBQUFBLFFBSUEsS0FBQSxFQUFPLENBSlA7T0FuQkY7QUFBQSxNQXlCQSxlQUFB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

//# sourceURL=/Users/anas/.atom/packages/linter/lib/main.coffee
