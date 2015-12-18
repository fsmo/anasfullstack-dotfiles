(function() {
  var Runner, ScriptOptions;

  Runner = require('../lib/runner');

  ScriptOptions = require('../lib/script-options');

  describe('Runner', function() {
    beforeEach(function() {
      this.command = 'node';
      this.runOptions = new ScriptOptions;
      this.runOptions.cmd = this.command;
      return this.runner = new Runner(this.runOptions);
    });
    afterEach(function() {
      return this.runner.destroy();
    });
    return describe('run', function() {
      it('with no input', function() {
        runs((function(_this) {
          return function() {
            _this.output = null;
            _this.runner.onDidWriteToStdout(function(output) {
              return _this.output = output;
            });
            return _this.runner.run(_this.command, ['./outputTest.js'], {});
          };
        })(this));
        waitsFor((function(_this) {
          return function() {
            return _this.output !== null;
          };
        })(this), "File should execute", 500);
        return runs((function(_this) {
          return function() {
            return expect(_this.output).toEqual({
              message: 'hello\n'
            });
          };
        })(this));
      });
      it('with an input string', function() {
        runs((function(_this) {
          return function() {
            _this.output = null;
            _this.runner.onDidWriteToStdout(function(output) {
              return _this.output = output;
            });
            return _this.runner.run(_this.command, ['./ioTest.js'], {}, 'hello');
          };
        })(this));
        waitsFor((function(_this) {
          return function() {
            return _this.output !== null;
          };
        })(this), "File should execute", 500);
        return runs((function(_this) {
          return function() {
            return expect(_this.output).toEqual({
              message: 'TEST: hello\n'
            });
          };
        })(this));
      });
      it('exits', function() {
        runs((function(_this) {
          return function() {
            _this.exited = false;
            _this.runner.onDidExit(function() {
              return _this.exited = true;
            });
            return _this.runner.run(_this.command, ['./outputTest.js'], {});
          };
        })(this));
        return waitsFor((function(_this) {
          return function() {
            return _this.exited;
          };
        })(this), "Should receive exit callback", 500);
      });
      return it('notifies about writing to stderr', function() {
        runs((function(_this) {
          return function() {
            _this.failedEvent = null;
            _this.runner.onDidWriteToStderr(function(event) {
              return _this.failedEvent = event;
            });
            return _this.runner.run(_this.command, ['./throw.js'], {});
          };
        })(this));
        waitsFor((function(_this) {
          return function() {
            return _this.failedEvent;
          };
        })(this), "Should receive failure callback", 500);
        return runs((function(_this) {
          return function() {
            return expect(_this.failedEvent.message).toMatch(/kaboom/);
          };
        })(this));
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvc2NyaXB0L3NwZWMvcnVubmVyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFCQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxlQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLHVCQUFSLENBRGhCLENBQUE7O0FBQUEsRUFHQSxRQUFBLENBQVMsUUFBVCxFQUFtQixTQUFBLEdBQUE7QUFDakIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLE1BQVgsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxHQUFBLENBQUEsYUFEZCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsVUFBVSxDQUFDLEdBQVosR0FBa0IsSUFBQyxDQUFBLE9BRm5CLENBQUE7YUFHQSxJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsTUFBQSxDQUFPLElBQUMsQ0FBQSxVQUFSLEVBSkw7SUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLElBTUEsU0FBQSxDQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBLEVBRFE7SUFBQSxDQUFWLENBTkEsQ0FBQTtXQVNBLFFBQUEsQ0FBUyxLQUFULEVBQWdCLFNBQUEsR0FBQTtBQUNkLE1BQUEsRUFBQSxDQUFHLGVBQUgsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLFFBQUEsSUFBQSxDQUFLLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBQ0gsWUFBQSxLQUFDLENBQUEsTUFBRCxHQUFVLElBQVYsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLE1BQU0sQ0FBQyxrQkFBUixDQUEyQixTQUFDLE1B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

//# sourceURL=/Users/anas/.atom/packages/script/spec/runner-spec.coffee
