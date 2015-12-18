(function() {
  var pty;

  pty = require('pty.js');

  module.exports = function(ptyCwd, sh, cols, rows, args) {
    var callback, path, ptyProcess, shell;
    callback = this.async();
    if (sh) {
      shell = sh;
    } else {
      if (process.platform === 'win32') {
        path = require('path');
        shell = path.resolve(process.env.SystemRoot, 'WindowsPowerShell', 'v1.0', 'powershell.exe');
      } else {
        shell = process.env.SHELL;
      }
    }
    ptyProcess = pty.fork(shell, args, {
      name: 'xterm-256color',
      cols: cols,
      rows: rows,
      cwd: ptyCwd,
      env: process.env
    });
    ptyProcess.on('data', function(data) {
      return emit('term3:data', new Buffer(data).toString("base64"));
    });
    ptyProcess.on('exit', function() {
      emit('term3:exit');
      return callback();
    });
    return process.on('message', function(_arg) {
      var cols, event, rows, text, _ref;
      _ref = _arg != null ? _arg : {}, event = _ref.event, cols = _ref.cols, rows = _ref.rows, text = _ref.text;
      switch (event) {
        case 'resize':
          return ptyProcess.resize(cols, rows);
        case 'input':
          return ptyProcess.write(new Buffer(text, "base64").toString("utf-8"));
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvdGVybTMvbGliL3B0eS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFFQTtBQUFBLE1BQUEsR0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLE1BQUQsRUFBUyxFQUFULEVBQWEsSUFBYixFQUFtQixJQUFuQixFQUF5QixJQUF6QixHQUFBO0FBQ2YsUUFBQSxpQ0FBQTtBQUFBLElBQUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBWCxDQUFBO0FBQ0EsSUFBQSxJQUFHLEVBQUg7QUFDSSxNQUFBLEtBQUEsR0FBUSxFQUFSLENBREo7S0FBQSxNQUFBO0FBR0ksTUFBQSxJQUFHLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLE9BQXZCO0FBQ0UsUUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBO0FBQUEsUUFDQSxLQUFBLEdBQVEsSUFBSSxDQUFDLE9BQUwsQ0FBYSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQXpCLEVBQXFDLG1CQUFyQyxFQUEwRCxNQUExRCxFQUFrRSxnQkFBbEUsQ0FEUixDQURGO09BQUEsTUFBQTtBQUlFLFFBQUEsS0FBQSxHQUFRLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBcEIsQ0FKRjtPQUhKO0tBREE7QUFBQSxJQVVBLFVBQUEsR0FBYSxHQUFHLENBQUMsSUFBSixDQUFTLEtBQVQsRUFBZ0IsSUFBaEIsRUFDWDtBQUFBLE1BQUEsSUFBQSxFQUFNLGdCQUFOO0FBQUEsTUFDQSxJQUFBLEVBQU0sSUFETjtBQUFBLE1BRUEsSUFBQSxFQUFNLElBRk47QUFBQSxNQUdBLEdBQUEsRUFBSyxNQUhMO0FBQUEsTUFJQSxHQUFBLEVBQUssT0FBTyxDQUFDLEdBSmI7S0FEVyxDQVZiLENBQUE7QUFBQSxJQWlCQSxVQUFVLENBQUMsRUFBWCxDQUFjLE1BQWQsRUFBc0IsU0FBQyxJQUFELEdBQUE7YUFDcEIsSUFBQSxDQUFLLFlBQUwsRUFBdUIsSUFBQSxNQUFBLENBQU8sSUFBUCxDQUFZLENBQUMsUUFBYixDQUFzQixRQUF0QixDQUF2QixFQURvQjtJQUFBLENBQXRCLENBakJBLENBQUE7QUFBQSxJQW9CQSxVQUFVLENBQUMsRUFBWCxDQUFjLE1BQWQsRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLE1BQUEsSUFBQSxDQUFLLFlBQUwsQ0FBQSxDQUFBO2FBQ0EsUUFBQSxDQUFBLEVBRm9CO0lBQUEsQ0FBdEIsQ0FwQkEsQ0FBQTtXQXdCQSxPQUFPLENBQUMsRUFBUixDQUFXLFNBQVgsRUFBc0IsU0FBQyxJQUFELEdBQUE7QUFDcEIsVUFBQSw2QkFBQTtBQUFBLDRCQURxQixPQUEwQixJQUF6QixhQUFBLE9BQU8sWUFBQSxNQUFNLFlBQUEsTUFBTSxZQUFBLElBQ3pDLENBQUE7QUFBQSxjQUFPLEtBQVA7QUFBQSxhQUNPLFFBRFA7aUJBQ3FCLFVBQVUsQ0FBQyxNQUFYLENBQWtCLElBQWxCLEVBQXdCLElBQXhCLEVBRHJCO0FBQUEsYUFFTyxPQUZQO2lCQUVvQixVQUFVLENBQUMsS0FBWCxDQUFxQixJQUFBLE1BQUEsQ0FBTyxJQUFQLEVBQWEsUUFBYixDQUFzQixDQUFDLFFBQXZCLENBQWdDLE9BQWhDLENBQXJCLEVBRnBCO0FBQUEsT0FEb0I7SUFBQSxDQUF0QixFQXpCZTtFQUFBLENBRmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/anas/.atom/packages/term3/lib/pty.coffee
