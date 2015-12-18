(function() {
  var extractMatch, getTestName, localeval, path;

  path = require('path');

  localeval = require('localeval');

  exports.fromEditor = function(editor) {
    var line, row, test;
    row = editor.getCursorScreenPosition().row;
    line = editor.lineTextForBufferRow(row);
    test = getTestName(line);
    return test;
  };

  getTestName = function(line) {
    var describe, it, suite, test;
    describe = extractMatch(line, /describe\s*\(?\s*['"](.*)['"]/);
    suite = extractMatch(line, /suite\s*\(?\s*['"](.*)['"]/);
    it = extractMatch(line, /it\s*\(?\s*['"](.*)['"]/);
    test = extractMatch(line, /test\s*\(?\s*['"](.*)['"]/);
    return describe || suite || it || test || null;
  };

  extractMatch = function(line, regex) {
    var matches;
    matches = regex.exec(line);
    if (matches && matches.length >= 2) {
      return localeval("'" + matches[1] + "'");
    } else {
      return null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbW9jaGEtdGVzdC1ydW5uZXIvbGliL3NlbGVjdGVkLXRlc3QuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBDQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFZLE9BQUEsQ0FBUSxNQUFSLENBQVosQ0FBQTs7QUFBQSxFQUNBLFNBQUEsR0FBWSxPQUFBLENBQVEsV0FBUixDQURaLENBQUE7O0FBQUEsRUFHQSxPQUFPLENBQUMsVUFBUixHQUFxQixTQUFDLE1BQUQsR0FBQTtBQUNuQixRQUFBLGVBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFnQyxDQUFDLEdBQXZDLENBQUE7QUFBQSxJQUNBLElBQUEsR0FBTyxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsR0FBNUIsQ0FEUCxDQUFBO0FBQUEsSUFFQSxJQUFBLEdBQU8sV0FBQSxDQUFZLElBQVosQ0FGUCxDQUFBO0FBR0EsV0FBTyxJQUFQLENBSm1CO0VBQUEsQ0FIckIsQ0FBQTs7QUFBQSxFQVNBLFdBQUEsR0FBYyxTQUFDLElBQUQsR0FBQTtBQUNaLFFBQUEseUJBQUE7QUFBQSxJQUFBLFFBQUEsR0FBYSxZQUFBLENBQWEsSUFBYixFQUFtQiwrQkFBbkIsQ0FBYixDQUFBO0FBQUEsSUFDQSxLQUFBLEdBQWEsWUFBQSxDQUFhLElBQWIsRUFBbUIsNEJBQW5CLENBRGIsQ0FBQTtBQUFBLElBRUEsRUFBQSxHQUFhLFlBQUEsQ0FBYSxJQUFiLEVBQW1CLHlCQUFuQixDQUZiLENBQUE7QUFBQSxJQUdBLElBQUEsR0FBYSxZQUFBLENBQWEsSUFBYixFQUFtQiwyQkFBbkIsQ0FIYixDQUFBO1dBSUEsUUFBQSxJQUFZLEtBQVosSUFBcUIsRUFBckIsSUFBMkIsSUFBM0IsSUFBbUMsS0FMdkI7RUFBQSxDQVRkLENBQUE7O0FBQUEsRUFnQkEsWUFBQSxHQUFlLFNBQUMsSUFBRCxFQUFPLEtBQVAsR0FBQTtBQUNiLFFBQUEsT0FBQTtBQUFBLElBQUEsT0FBQSxHQUFVLEtBQUssQ0FBQyxJQUFOLENBQVcsSUFBWCxDQUFWLENBQUE7QUFDQSxJQUFBLElBQUcsT0FBQSxJQUFZLE9BQU8sQ0FBQyxNQUFSLElBQWtCLENBQWpDO2FBQ0UsU0FBQSxDQUFXLEdBQUEsR0FBRyxPQUFRLENBQUEsQ0FBQSxDQUFYLEdBQWMsR0FBekIsRUFERjtLQUFBLE1BQUE7YUFHRSxLQUhGO0tBRmE7RUFBQSxDQWhCZixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/anas/.atom/packages/mocha-test-runner/lib/selected-test.coffee
