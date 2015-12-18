(function() {
  var closestPackage, fs, isWindows, path, selectedTest, util;

  fs = require('fs');

  path = require('path');

  util = require('util');

  selectedTest = require('./selected-test');

  isWindows = /^win/.test(process.platform);

  exports.find = function(editor) {
    var mochaBinary, mochaCommand, root;
    root = closestPackage(editor.getPath());
    if (root) {
      mochaCommand = isWindows ? 'mocha.cmd' : 'mocha';
      mochaBinary = path.join(root, 'node_modules', '.bin', mochaCommand);
      if (!fs.existsSync(mochaBinary)) {
        mochaBinary = 'mocha';
      }
      return {
        root: root,
        test: path.relative(root, editor.getPath()),
        grep: selectedTest.fromEditor(editor),
        mocha: mochaBinary
      };
    } else {
      return {
        root: path.dirname(editor.getPath()),
        test: path.basename(editor.getPath()),
        grep: selectedTest.fromEditor(editor),
        mocha: 'mocha'
      };
    }
  };

  closestPackage = function(folder) {
    var pkg;
    pkg = path.join(folder, 'package.json');
    if (fs.existsSync(pkg)) {
      return folder;
    } else if (folder === '/') {
      return null;
    } else {
      return closestPackage(path.dirname(folder));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbW9jaGEtdGVzdC1ydW5uZXIvbGliL2NvbnRleHQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVEQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFPLE9BQUEsQ0FBUSxJQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQUhmLENBQUE7O0FBQUEsRUFJQSxTQUFBLEdBQVksTUFBVSxDQUFDLElBQVgsQ0FBZ0IsT0FBTyxDQUFDLFFBQXhCLENBSlosQ0FBQTs7QUFBQSxFQU1BLE9BQU8sQ0FBQyxJQUFSLEdBQWUsU0FBQyxNQUFELEdBQUE7QUFDYixRQUFBLCtCQUFBO0FBQUEsSUFBQSxJQUFBLEdBQU8sY0FBQSxDQUFlLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZixDQUFQLENBQUE7QUFDQSxJQUFBLElBQUcsSUFBSDtBQUNFLE1BQUEsWUFBQSxHQUFrQixTQUFILEdBQWtCLFdBQWxCLEdBQW1DLE9BQWxELENBQUE7QUFBQSxNQUNBLFdBQUEsR0FBYyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsRUFBZ0IsY0FBaEIsRUFBZ0MsTUFBaEMsRUFBd0MsWUFBeEMsQ0FEZCxDQUFBO0FBRUEsTUFBQSxJQUFHLENBQUEsRUFBTSxDQUFDLFVBQUgsQ0FBYyxXQUFkLENBQVA7QUFDRSxRQUFBLFdBQUEsR0FBYyxPQUFkLENBREY7T0FGQTthQUlBO0FBQUEsUUFBQSxJQUFBLEVBQU0sSUFBTjtBQUFBLFFBQ0EsSUFBQSxFQUFNLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBZCxFQUFvQixNQUFNLENBQUMsT0FBUCxDQUFBLENBQXBCLENBRE47QUFBQSxRQUVBLElBQUEsRUFBTSxZQUFZLENBQUMsVUFBYixDQUF3QixNQUF4QixDQUZOO0FBQUEsUUFHQSxLQUFBLEVBQU8sV0FIUDtRQUxGO0tBQUEsTUFBQTthQVVFO0FBQUEsUUFBQSxJQUFBLEVBQU0sSUFBSSxDQUFDLE9BQUwsQ0FBYSxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWIsQ0FBTjtBQUFBLFFBQ0EsSUFBQSxFQUFNLElBQUksQ0FBQyxRQUFMLENBQWMsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFkLENBRE47QUFBQSxRQUVBLElBQUEsRUFBTSxZQUFZLENBQUMsVUFBYixDQUF3QixNQUF4QixDQUZOO0FBQUEsUUFHQSxLQUFBLEVBQU8sT0FIUDtRQVZGO0tBRmE7RUFBQSxDQU5mLENBQUE7O0FBQUEsRUF1QkEsY0FBQSxHQUFpQixTQUFDLE1BQUQsR0FBQTtBQUNmLFFBQUEsR0FBQTtBQUFBLElBQUEsR0FBQSxHQUFNLElBQUksQ0FBQyxJQUFMLENBQVUsTUFBVixFQUFrQixjQUFsQixDQUFOLENBQUE7QUFDQSxJQUFBLElBQUcsRUFBRSxDQUFDLFVBQUgsQ0FBYyxHQUFkLENBQUg7YUFDRSxPQURGO0tBQUEsTUFFSyxJQUFHLE1BQUEsS0FBVSxHQUFiO2FBQ0gsS0FERztLQUFBLE1BQUE7YUFHSCxjQUFBLENBQWUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxNQUFiLENBQWYsRUFIRztLQUpVO0VBQUEsQ0F2QmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/anas/.atom/packages/mocha-test-runner/lib/context.coffee