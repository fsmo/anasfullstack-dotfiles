(function() {
  var PathScanner, VariableScanner, async, fs;

  async = require('async');

  fs = require('fs');

  VariableScanner = require('../variable-scanner');

  PathScanner = (function() {
    function PathScanner(path) {
      this.path = path;
      this.scanner = new VariableScanner;
    }

    PathScanner.prototype.load = function(done) {
      var currentChunk, currentLine, currentOffset, lastIndex, line, readStream, results;
      currentChunk = '';
      currentLine = 0;
      currentOffset = 0;
      lastIndex = 0;
      line = 0;
      results = [];
      readStream = fs.createReadStream(this.path);
      readStream.on('data', (function(_this) {
        return function(chunk) {
          var index, lastLine, result, v, _i, _len;
          currentChunk += chunk.toString();
          index = lastIndex;
          while (result = _this.scanner.search(currentChunk, lastIndex)) {
            result.range[0] += index;
            result.range[1] += index;
            for (_i = 0, _len = result.length; _i < _len; _i++) {
              v = result[_i];
              v.path = _this.path;
              v.range[0] += index;
              v.range[1] += index;
              v.definitionRange = result.range;
              v.line += line;
              lastLine = v.line;
            }
            results = results.concat(result);
            lastIndex = result.lastIndex;
          }
          if (result != null) {
            currentChunk = currentChunk.slice(lastIndex);
            line = lastLine;
            return lastIndex = 0;
          }
        };
      })(this));
      return readStream.on('end', function() {
        emit('scan-paths:path-scanned', results);
        return done();
      });
    };

    return PathScanner;

  })();

  module.exports = function(paths) {
    return async.each(paths, function(path, next) {
      return new PathScanner(path).load(next);
    }, this.async());
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3Rhc2tzL3NjYW4tcGF0aHMtaGFuZGxlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUNBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSLENBRmxCLENBQUE7O0FBQUEsRUFJTTtBQUNTLElBQUEscUJBQUUsSUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsT0FBQSxJQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLGVBQVgsQ0FEVztJQUFBLENBQWI7O0FBQUEsMEJBR0EsSUFBQSxHQUFNLFNBQUMsSUFBRCxHQUFBO0FBQ0osVUFBQSw4RUFBQTtBQUFBLE1BQUEsWUFBQSxHQUFlLEVBQWYsQ0FBQTtBQUFBLE1BQ0EsV0FBQSxHQUFjLENBRGQsQ0FBQTtBQUFBLE1BRUEsYUFBQSxHQUFnQixDQUZoQixDQUFBO0FBQUEsTUFHQSxTQUFBLEdBQVksQ0FIWixDQUFBO0FBQUEsTUFJQSxJQUFBLEdBQU8sQ0FKUCxDQUFBO0FBQUEsTUFLQSxPQUFBLEdBQVUsRUFMVixDQUFBO0FBQUEsTUFPQSxVQUFBLEdBQWEsRUFBRSxDQUFDLGdCQUFILENBQW9CLElBQUMsQ0FBQSxJQUFyQixDQVBiLENBQUE7QUFBQSxNQVNBLFVBQVUsQ0FBQyxFQUFYLENBQWMsTUFBZCxFQUFzQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEdBQUE7QUFDcEIsY0FBQSxvQ0FBQTtBQUFBLFVBQUEsWUFBQSxJQUFnQixLQUFLLENBQUMsUUFBTixDQUFBLENBQWhCLENBQUE7QUFBQSxVQUVBLEtBQUEsR0FBUSxTQUZSLENBQUE7QUFJQSxpQkFBTSxNQUFBLEdBQVMsS0FBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQWdCLFlBQWhCLEVBQThCLFNBQTlCLENBQWYsR0FBQTtBQUNFLFlBQUEsTUFBTSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQWIsSUFBbUIsS0FBbkIsQ0FBQTtBQUFBLFlBQ0EsTUFBTSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQWIsSUFBbUIsS0FEbkIsQ0FBQTtBQUdBLGlCQUFBLDZDQUFBOzZCQUFBO0FBQ0UsY0FBQSxDQUFDLENBQUMsSUFBRixHQUFTLEtBQUMsQ0FBQSxJQUFWLENBQUE7QUFBQSxjQUNBLENBQUMsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFSLElBQWMsS0FEZCxDQUFBO0FBQUEsY0FFQSxDQUFDLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBUixJQUFjLEtBRmQsQ0FBQTtBQUFBLGNBR0EsQ0FBQyxDQUFDLGVBQUYsR0FBb0IsTUFBTSxDQUFDLEtBSDNCLENBQUE7QUFBQSxjQUlBLENBQUMsQ0FBQyxJQUFGLElBQVUsSUFKVixDQUFBO0FBQUEsY0FLQSxRQUFBLEdBQVcsQ0FBQyxDQUFDLElBTGIsQ0FERjtBQUFBLGFBSEE7QUFBQSxZQVdBLE9BQUEsR0FBVSxPQUFPLENBQUMsTUFBUixDQUFlLE1BQWYsQ0FYVixDQUFBO0FBQUEsWUFZQyxZQUFhLE9BQWIsU0FaRCxDQURGO1VBQUEsQ0FKQTtBQW1CQSxVQUFBLElBQUcsY0FBSDtBQUNFLFlBQUEsWUFBQSxHQUFlLFlBQWEsaUJBQTVCLENBQUE7QUFBQSxZQUNBLElBQUEsR0FBTyxRQURQLENBQUE7bUJBRUEsU0FBQSxHQUFZLEVBSGQ7V0FwQm9CO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEIsQ0FUQSxDQUFBO2FBa0NBLFVBQVUsQ0FBQyxFQUFYLENBQWMsS0FBZCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsUUFBQSxJQUFBLENBQUsseUJBQUwsRUFBZ0MsT0FBaEMsQ0FBQSxDQUFBO2VBQ0EsSUFBQSxDQUFBLEVBRm1CO01BQUEsQ0FBckIsRUFuQ0k7SUFBQSxDQUhOLENBQUE7O3VCQUFBOztNQUxGLENBQUE7O0FBQUEsRUErQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxLQUFELEdBQUE7V0FDZixLQUFLLENBQUMsSUFBTixDQUNFLEtBREYsRUFFRSxTQUFDLElBQUQsRUFBTyxJQUFQLEdBQUE7YUFDTSxJQUFBLFdBQUEsQ0FBWSxJQUFaLENBQWlCLENBQUMsSUFBbEIsQ0FBdUIsSUFBdkIsRUFETjtJQUFBLENBRkYsRUFJRSxJQUFDLENBQUEsS0FBRCxDQUFBLENBSkYsRUFEZTtFQUFBLENBL0NqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/anas/.atom/packages/pigments/lib/tasks/scan-paths-handler.coffee
