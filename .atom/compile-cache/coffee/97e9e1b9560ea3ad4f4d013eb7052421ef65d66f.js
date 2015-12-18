(function() {
  var $, Config, Fs, Mkdirp;

  $ = require('atom-space-pen-views').$;

  Fs = require('fs');

  Mkdirp = require('mkdirp');

  Config = require('./config');

  module.exports = {
    activate: function(buffers) {
      var saveFilePath;
      saveFilePath = Config.saveFile();
      Fs.exists(saveFilePath, (function(_this) {
        return function(exists) {
          if (exists) {
            return Fs.readFile(saveFilePath, {
              encoding: 'utf8'
            }, function(err, str) {
              buffers = JSON.parse(str);
              if (Config.restoreOpenFileContents()) {
                return _this.restore(buffers);
              }
            });
          }
        };
      })(this));
      return this.addListeners();
    },
    save: function() {
      var buffers, file, folder;
      buffers = [];
      atom.workspace.getTextEditors().map((function(_this) {
        return function(editor) {
          var buffer;
          buffer = {};
          if (editor.getBuffer().isModified()) {
            buffer.text = editor.getBuffer().cachedText;
            buffer.diskText = Config.hashMyStr(editor.getBuffer().cachedDiskContents);
          }
          buffer.path = editor.getPath();
          return buffers.push(buffer);
        };
      })(this));
      file = Config.saveFile();
      folder = file.substring(0, file.lastIndexOf(Config.pathSeparator()));
      return Mkdirp(folder, (function(_this) {
        return function(err) {
          return Fs.writeFile(file, JSON.stringify(buffers));
        };
      })(this));
    },
    restore: function(buffers) {
      var buffer, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = buffers.length; _i < _len; _i++) {
        buffer = buffers[_i];
        _results.push(this.restoreText(buffer));
      }
      return _results;
    },
    restoreText: function(buffer) {
      var buf, editors;
      if (buffer.path === void 0) {
        editors = atom.workspace.getTextEditors().filter((function(_this) {
          return function(editor) {
            return editor.buffer.file === null && editor.buffer.cachedText === '';
          };
        })(this));
        if (editors.length > 0) {
          buf = editors[0].getBuffer();
        }
      } else {
        editors = atom.workspace.getTextEditors().filter((function(_this) {
          return function(editor) {
            var _ref;
            return ((_ref = editor.buffer.file) != null ? _ref.path : void 0) === buffer.path;
          };
        })(this));
        if (editors.length > 0) {
          buf = editors[0].getBuffer();
        }
      }
      if (Config.restoreOpenFileContents() && (buffer.text != null) && (buf != null) && buf.getText() !== buffer.text && Config.hashMyStr(buf.cachedDiskContents) === buffer.diskText) {
        return buf.setText(buffer.text);
      }
    },
    addListeners: function() {
      atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          editor.onDidStopChanging(function() {
            return setTimeout((function() {
              return _this.save();
            }), Config.extraDelay());
          });
          return editor.onDidSave(function() {
            return _this.save();
          });
        };
      })(this));
      return window.onbeforeunload = (function(_this) {
        return function() {
          return _this.save();
        };
      })(this);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvc2F2ZS1zZXNzaW9uL2xpYi9maWxlcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUJBQUE7O0FBQUEsRUFBQyxJQUFLLE9BQUEsQ0FBUSxzQkFBUixFQUFMLENBQUQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFFQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FGVCxDQUFBOztBQUFBLEVBR0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBSFQsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFDLE9BQUQsR0FBQTtBQUNSLFVBQUEsWUFBQTtBQUFBLE1BQUEsWUFBQSxHQUFlLE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FBZixDQUFBO0FBQUEsTUFFQSxFQUFFLENBQUMsTUFBSCxDQUFVLFlBQVYsRUFBd0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO0FBQ3RCLFVBQUEsSUFBRyxNQUFIO21CQUNFLEVBQUUsQ0FBQyxRQUFILENBQVksWUFBWixFQUEwQjtBQUFBLGNBQUEsUUFBQSxFQUFVLE1BQVY7YUFBMUIsRUFBNEMsU0FBQyxHQUFELEVBQU0sR0FBTixHQUFBO0FBQzFDLGNBQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBWCxDQUFWLENBQUE7QUFDQSxjQUFBLElBQUcsTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBSDt1QkFDRSxLQUFDLENBQUEsT0FBRCxDQUFTLE9BQVQsRUFERjtlQUYwQztZQUFBLENBQTVDLEVBREY7V0FEc0I7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QixDQUZBLENBQUE7YUFTQSxJQUFDLENBQUEsWUFBRCxDQUFBLEVBVlE7SUFBQSxDQUFWO0FBQUEsSUFZQSxJQUFBLEVBQU0sU0FBQSxHQUFBO0FBQ0osVUFBQSxxQkFBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLEVBQVYsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFmLENBQUEsQ0FBK0IsQ0FBQyxHQUFoQyxDQUFvQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7QUFDbEMsY0FBQSxNQUFBO0FBQUEsVUFBQSxNQUFBLEdBQVMsRUFBVCxDQUFBO0FBQ0EsVUFBQSxJQUFHLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxVQUFuQixDQUFBLENBQUg7QUFDRSxZQUFBLE1BQU0sQ0FBQyxJQUFQLEdBQWMsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFrQixDQUFDLFVBQWpDLENBQUE7QUFBQSxZQUNBLE1BQU0sQ0FBQyxRQUFQLEdBQWtCLE1BQU0sQ0FBQyxTQUFQLENBQWlCLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxrQkFBcEMsQ0FEbEIsQ0FERjtXQURBO0FBQUEsVUFJQSxNQUFNLENBQUMsSUFBUCxHQUFjLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FKZCxDQUFBO2lCQU1BLE9BQU8sQ0FBQyxJQUFSLENBQWEsTUFBYixFQVBrQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBDLENBRkEsQ0FBQTtBQUFBLE1BV0EsSUFBQSxHQUFPLE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FYUCxDQUFBO0FBQUEsTUFZQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLElBQUksQ0FBQyxXQUFMLENBQWlCLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBakIsQ0FBbEIsQ0FaVCxDQUFBO2FBYUEsTUFBQSxDQUFPLE1BQVAsRUFBZSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxHQUFELEdBQUE7aUJBQ2QsRUFBRSxDQUFDLFNBQUgsQ0FBYSxJQUFiLEVBQW1CLElBQUksQ0FBQyxTQUFMLENBQWUsT0FBZixDQUFuQixFQURjO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZixFQWRJO0lBQUEsQ0FaTjtBQUFBLElBOEJBLE9BQUEsRUFBUyxTQUFDLE9BQUQsR0FBQTtBQUNQLFVBQUEsMEJBQUE7QUFBQTtXQUFBLDhDQUFBOzZCQUFBO0FBQ0Usc0JBQUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxNQUFiLEVBQUEsQ0FERjtBQUFBO3NCQURPO0lBQUEsQ0E5QlQ7QUFBQSxJQW1DQSxXQUFBLEVBQWEsU0FBQyxNQUFELEdBQUE7QUFDWCxVQUFBLFlBQUE7QUFBQSxNQUFBLElBQUcsTUFBTSxDQUFDLElBQVAsS0FBZSxNQUFsQjtBQUNFLFFBQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBZixDQUFBLENBQStCLENBQUMsTUFBaEMsQ0FBdUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLE1BQUQsR0FBQTttQkFDL0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFkLEtBQXNCLElBQXRCLElBQStCLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBZCxLQUE0QixHQURaO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkMsQ0FBVixDQUFBO0FBR0EsUUFBQSxJQUFHLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLENBQXBCO0FBQ0UsVUFBQSxHQUFBLEdBQU0sT0FBUSxDQUFBLENBQUEsQ0FBRSxDQUFDLFNBQVgsQ0FBQSxDQUFOLENBREY7U0FKRjtPQUFBLE1BQUE7QUFRRSxRQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWYsQ0FBQSxDQUErQixDQUFDLE1BQWhDLENBQXVDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxNQUFELEdBQUE7QUFDL0MsZ0JBQUEsSUFBQTs4REFBa0IsQ0FBRSxjQUFwQixLQUE0QixNQUFNLENBQUMsS0FEWTtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZDLENBQVYsQ0FBQTtBQUdBLFFBQUEsSUFBRyxPQUFPLENBQUMsTUFBUixHQUFpQixDQUFwQjtBQUNFLFVBQUEsR0FBQSxHQUFNLE9BQVEsQ0FBQSxDQUFBLENBQUUsQ0FBQyxTQUFYLENBQUEsQ0FBTixDQURGO1NBWEY7T0FBQTtBQWVBLE1BQUEsSUFBRyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFBLElBQXFDLHFCQUFyQyxJQUFzRCxhQUF0RCxJQUNELEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBQSxLQUFtQixNQUFNLENBQUMsSUFEekIsSUFDa0MsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsR0FBRyxDQUFDLGtCQUFyQixDQUFBLEtBQTRDLE1BQU0sQ0FBQyxRQUR4RjtlQUVJLEdBQUcsQ0FBQyxPQUFKLENBQVksTUFBTSxDQUFDLElBQW5CLEVBRko7T0FoQlc7SUFBQSxDQW5DYjtBQUFBLElBdURBLFlBQUEsRUFBYyxTQUFBLEdBQUE7QUFFWixNQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO0FBQ2hDLFVBQUEsTUFBTSxDQUFDLGlCQUFQLENBQXlCLFNBQUEsR0FBQTttQkFDdkIsVUFBQSxDQUFXLENBQUMsU0FBQSxHQUFBO3FCQUFFLEtBQUMsQ0FBQSxJQUFELENBQUEsRUFBRjtZQUFBLENBQUQsQ0FBWCxFQUF3QixNQUFNLENBQUMsVUFBUCxDQUFBLENBQXhCLEVBRHVCO1VBQUEsQ0FBekIsQ0FBQSxDQUFBO2lCQUVBLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFNBQUEsR0FBQTttQkFDZixLQUFDLENBQUEsSUFBRCxDQUFBLEVBRGU7VUFBQSxDQUFqQixFQUhnQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQUEsQ0FBQTthQU1BLE1BQU0sQ0FBQyxjQUFQLEdBQXdCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ3RCLEtBQUMsQ0FBQSxJQUFELENBQUEsRUFEc0I7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxFQVJaO0lBQUEsQ0F2RGQ7R0FQRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/anas/.atom/packages/save-session/lib/files.coffee
