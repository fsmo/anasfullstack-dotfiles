(function() {
  var MochaWrapper, STATS_MATCHER, ansi, clickablePaths, escape, events, fs, kill, killTree, path, psTree, spawn, util,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = require('fs');

  path = require('path');

  util = require('util');

  events = require('events');

  escape = require('jsesc');

  ansi = require('ansi-html-stream');

  psTree = require('ps-tree');

  spawn = require('child_process').spawn;

  kill = require('tree-kill');

  clickablePaths = require('./clickable-paths');

  STATS_MATCHER = /\d+\s+(?:failing|passing|pending)/g;

  module.exports = MochaWrapper = (function(_super) {
    __extends(MochaWrapper, _super);

    function MochaWrapper(context, debugMode) {
      var optionsForDebug;
      this.context = context;
      if (debugMode == null) {
        debugMode = false;
      }
      this.mocha = null;
      this.node = atom.config.get('mocha-test-runner.nodeBinaryPath');
      this.textOnly = atom.config.get('mocha-test-runner.textOnlyOutput');
      this.options = atom.config.get('mocha-test-runner.options');
      this.env = atom.config.get('mocha-test-runner.env');
      if (debugMode) {
        optionsForDebug = atom.config.get('mocha-test-runner.optionsForDebug');
        this.options = "" + this.options + " " + optionsForDebug;
      }
      this.resetStatistics();
    }

    MochaWrapper.prototype.stop = function() {
      if (this.mocha != null) {
        killTree(this.mocha.pid);
        return this.mocha = null;
      }
    };

    MochaWrapper.prototype.run = function() {
      var env, flags, index, key, name, opts, stream, value, _ref, _ref1;
      flags = [this.context.test];
      env = {
        PATH: path.dirname(this.node)
      };
      if (this.env) {
        _ref = this.env.split(' ');
        for (index in _ref) {
          name = _ref[index];
          _ref1 = name.split('='), key = _ref1[0], value = _ref1[1];
          env[key] = value;
        }
      }
      if (this.textOnly) {
        flags.push('--no-colors');
      } else {
        flags.push('--colors');
      }
      if (this.context.grep) {
        flags.push('--grep');
        flags.push(escape(this.context.grep, {
          escapeEverything: true
        }));
      }
      if (this.options) {
        Array.prototype.push.apply(flags, this.options.split(' '));
      }
      opts = {
        cwd: this.context.root,
        env: env
      };
      this.resetStatistics();
      this.mocha = spawn(this.context.mocha, flags, opts);
      if (this.textOnly) {
        this.mocha.stdout.on('data', (function(_this) {
          return function(data) {
            _this.parseStatistics(data);
            return _this.emit('output', data.toString());
          };
        })(this));
        this.mocha.stderr.on('data', (function(_this) {
          return function(data) {
            _this.parseStatistics(data);
            return _this.emit('output', data.toString());
          };
        })(this));
      } else {
        stream = ansi({
          chunked: false
        });
        this.mocha.stdout.pipe(stream);
        this.mocha.stderr.pipe(stream);
        stream.on('data', (function(_this) {
          return function(data) {
            _this.parseStatistics(data);
            return _this.emit('output', clickablePaths.link(data.toString()));
          };
        })(this));
      }
      this.mocha.on('error', (function(_this) {
        return function(err) {
          return _this.emit('error', err);
        };
      })(this));
      return this.mocha.on('exit', (function(_this) {
        return function(code) {
          if (code === 0) {
            return _this.emit('success', _this.stats);
          } else {
            return _this.emit('failure', _this.stats);
          }
        };
      })(this));
    };

    MochaWrapper.prototype.resetStatistics = function() {
      return this.stats = [];
    };

    MochaWrapper.prototype.parseStatistics = function(data) {
      var matches, stat, _results;
      _results = [];
      while (matches = STATS_MATCHER.exec(data)) {
        stat = matches[0];
        this.stats.push(stat);
        _results.push(this.emit('updateSummary', this.stats));
      }
      return _results;
    };

    return MochaWrapper;

  })(events.EventEmitter);

  killTree = function(pid, signal, callback) {
    signal = signal || 'SIGKILL';
    callback = callback || (function() {});
    return psTree(pid, function(err, children) {
      var childrenPid;
      childrenPid = children.map(function(p) {
        return p.PID;
      });
      [pid].concat(childrenPid).forEach(function(tpid) {
        var ex;
        try {
          return kill(tpid, signal);
        } catch (_error) {
          ex = _error;
          return console.log("Failed to " + signal + " " + tpid);
        }
      });
      return callback();
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbW9jaGEtdGVzdC1ydW5uZXIvbGliL21vY2hhLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnSEFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFTLE9BQUEsQ0FBUSxJQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBUyxPQUFBLENBQVEsTUFBUixDQURULENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQVMsT0FBQSxDQUFRLE1BQVIsQ0FGVCxDQUFBOztBQUFBLEVBR0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBSFQsQ0FBQTs7QUFBQSxFQUlBLE1BQUEsR0FBUyxPQUFBLENBQVEsT0FBUixDQUpULENBQUE7O0FBQUEsRUFLQSxJQUFBLEdBQVMsT0FBQSxDQUFRLGtCQUFSLENBTFQsQ0FBQTs7QUFBQSxFQU1BLE1BQUEsR0FBUyxPQUFBLENBQVEsU0FBUixDQU5ULENBQUE7O0FBQUEsRUFPQSxLQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsQ0FBQyxLQVBsQyxDQUFBOztBQUFBLEVBUUEsSUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSLENBUlQsQ0FBQTs7QUFBQSxFQVVBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG1CQUFSLENBVmpCLENBQUE7O0FBQUEsRUFZQSxhQUFBLEdBQWdCLG9DQVpoQixDQUFBOztBQUFBLEVBY0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFFckIsbUNBQUEsQ0FBQTs7QUFBYSxJQUFBLHNCQUFFLE9BQUYsRUFBVyxTQUFYLEdBQUE7QUFDWCxVQUFBLGVBQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxVQUFBLE9BQ2IsQ0FBQTs7UUFEc0IsWUFBWTtPQUNsQztBQUFBLE1BQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFU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

//# sourceURL=/Users/anas/.atom/packages/mocha-test-runner/lib/mocha.coffee
