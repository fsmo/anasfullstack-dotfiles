(function() {
  var Helpers, Range, child_process, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Range = require('atom').Range;

  path = require('path');

  child_process = require('child_process');

  Helpers = module.exports = {
    error: function(e) {
      return atom.notifications.addError(e.toString(), {
        detail: e.stack || '',
        dismissable: true
      });
    },
    shouldTriggerLinter: function(linter, onChange, scopes) {
      if (onChange && !linter.lintOnFly) {
        return false;
      }
      if (!scopes.some(function(entry) {
        return __indexOf.call(linter.grammarScopes, entry) >= 0;
      })) {
        return false;
      }
      return true;
    },
    requestUpdateFrame: function(callback) {
      return setTimeout(callback, 100);
    },
    debounce: function(callback, delay) {
      var timeout;
      timeout = null;
      return function(arg) {
        clearTimeout(timeout);
        return timeout = setTimeout((function(_this) {
          return function() {
            return callback.call(_this, arg);
          };
        })(this), delay);
      };
    },
    isPathIgnored: function(filePath) {
      var i, projectPath, repo, _i, _len, _ref;
      repo = null;
      _ref = atom.project.getPaths();
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        projectPath = _ref[i];
        if (filePath.indexOf(projectPath + path.sep) === 0) {
          repo = atom.project.getRepositories()[i];
          break;
        }
      }
      if (repo && repo.isProjectAtRoot() && repo.isPathIgnored(filePath)) {
        return true;
      }
      return false;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9oZWxwZXJzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQ0FBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUMsUUFBUyxPQUFBLENBQVEsTUFBUixFQUFULEtBQUQsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxlQUFSLENBRmhCLENBQUE7O0FBQUEsRUFJQSxPQUFBLEdBQVUsTUFBTSxDQUFDLE9BQVAsR0FDUjtBQUFBLElBQUEsS0FBQSxFQUFPLFNBQUMsQ0FBRCxHQUFBO2FBQ0wsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE0QixDQUFDLENBQUMsUUFBRixDQUFBLENBQTVCLEVBQTBDO0FBQUEsUUFBQyxNQUFBLEVBQVEsQ0FBQyxDQUFDLEtBQUYsSUFBVyxFQUFwQjtBQUFBLFFBQXdCLFdBQUEsRUFBYSxJQUFyQztPQUExQyxFQURLO0lBQUEsQ0FBUDtBQUFBLElBRUEsbUJBQUEsRUFBcUIsU0FBQyxNQUFELEVBQVMsUUFBVCxFQUFtQixNQUFuQixHQUFBO0FBSW5CLE1BQUEsSUFBZ0IsUUFBQSxJQUFhLENBQUEsTUFBVSxDQUFDLFNBQXhDO0FBQUEsZUFBTyxLQUFQLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBQSxDQUFBLE1BQTBCLENBQUMsSUFBUCxDQUFZLFNBQUMsS0FBRCxHQUFBO2VBQVcsZUFBUyxNQUFNLENBQUMsYUFBaEIsRUFBQSxLQUFBLE9BQVg7TUFBQSxDQUFaLENBQXBCO0FBQUEsZUFBTyxLQUFQLENBQUE7T0FEQTtBQUVBLGFBQU8sSUFBUCxDQU5tQjtJQUFBLENBRnJCO0FBQUEsSUFTQSxrQkFBQSxFQUFvQixTQUFDLFFBQUQsR0FBQTthQUNsQixVQUFBLENBQVcsUUFBWCxFQUFxQixHQUFyQixFQURrQjtJQUFBLENBVHBCO0FBQUEsSUFXQSxRQUFBLEVBQVUsU0FBQyxRQUFELEVBQVcsS0FBWCxHQUFBO0FBQ1IsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBO0FBQ0EsYUFBTyxTQUFDLEdBQUQsR0FBQTtBQUNMLFFBQUEsWUFBQSxDQUFhLE9BQWIsQ0FBQSxDQUFBO2VBQ0EsT0FBQSxHQUFVLFVBQUEsQ0FBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFDbkIsUUFBUSxDQUFDLElBQVQsQ0FBYyxLQUFkLEVBQW9CLEdBQXBCLEVBRG1CO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxFQUVSLEtBRlEsRUFGTDtNQUFBLENBQVAsQ0FGUTtJQUFBLENBWFY7QUFBQSxJQWtCQSxhQUFBLEVBQWUsU0FBQyxRQUFELEdBQUE7QUFDYixVQUFBLG9DQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBUCxDQUFBO0FBQ0E7QUFBQSxXQUFBLG1EQUFBOzhCQUFBO0FBQ0UsUUFBQSxJQUFHLFFBQVEsQ0FBQyxPQUFULENBQWlCLFdBQUEsR0FBYyxJQUFJLENBQUMsR0FBcEMsQ0FBQSxLQUE0QyxDQUEvQztBQUNFLFVBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBYixDQUFBLENBQStCLENBQUEsQ0FBQSxDQUF0QyxDQUFBO0FBQ0EsZ0JBRkY7U0FERjtBQUFBLE9BREE7QUFLQSxNQUFBLElBQWUsSUFBQSxJQUFTLElBQUksQ0FBQyxlQUFMLENBQUEsQ0FBVCxJQUFvQyxJQUFJLENBQUMsYUFBTCxDQUFtQixRQUFuQixDQUFuRDtBQUFBLGVBQU8sSUFBUCxDQUFBO09BTEE7QUFNQSxhQUFPLEtBQVAsQ0FQYTtJQUFBLENBbEJmO0dBTEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/anas/.atom/packages/linter/lib/helpers.coffee
