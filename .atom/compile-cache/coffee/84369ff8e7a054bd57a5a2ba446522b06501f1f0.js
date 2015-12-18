(function() {
  var MarkdownPreviewView, fs, imageRegister, isMarkdownPreviewView, path, pathWatcher, pathWatcherPath, renderPreviews, srcClosure, _;

  fs = require('fs-plus');

  _ = require('lodash');

  path = require('path');

  pathWatcherPath = path.join(atom.packages.resourcePath, '/node_modules/pathwatcher/lib/main');

  pathWatcher = require(pathWatcherPath);

  imageRegister = {};

  MarkdownPreviewView = null;

  isMarkdownPreviewView = function(object) {
    if (MarkdownPreviewView == null) {
      MarkdownPreviewView = require('./markdown-preview-view');
    }
    return object instanceof MarkdownPreviewView;
  };

  renderPreviews = _.debounce((function() {
    var item, _i, _len, _ref;
    if (atom.workspace != null) {
      _ref = atom.workspace.getPaneItems();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (isMarkdownPreviewView(item)) {
          item.renderMarkdown();
        }
      }
    }
  }), 250);

  srcClosure = function(src) {
    return function(event, path) {
      if (event === 'change' && fs.isFileSync(src)) {
        imageRegister[src].version = Date.now();
      } else {
        imageRegister[src].version = void 0;
      }
      renderPreviews();
    };
  };

  module.exports = {
    removeFile: function(file) {
      return imageRegister = _.mapValues(imageRegister, function(image) {
        image.files = _.without(image.files, file);
        image.files = _.filter(image.files, fs.isFileSync);
        if (_.isEmpty(image.files)) {
          image.watched = false;
          image.watcher.close();
        }
        return image;
      });
    },
    getVersion: function(image, file) {
      var files, i, version;
      i = _.get(imageRegister, image, {});
      if (_.isEmpty(i)) {
        if (fs.isFileSync(image)) {
          version = Date.now();
          imageRegister[image] = {
            path: image,
            watched: true,
            files: [file],
            version: version,
            watcher: pathWatcher.watch(image, srcClosure(image))
          };
          return version;
        } else {
          return false;
        }
      }
      files = _.get(i, 'files');
      if (!_.contains(files, file)) {
        imageRegister[image].files.push(file);
      }
      version = _.get(i, 'version');
      if (!version && fs.isFileSync(image)) {
        version = Date.now();
        imageRegister[image].version = version;
      }
      return version;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24tcHJldmlldy1wbHVzL2xpYi9pbWFnZS13YXRjaC1oZWxwZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdJQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQURKLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsZUFBQSxHQUFrQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBeEIsRUFBc0Msb0NBQXRDLENBSGxCLENBQUE7O0FBQUEsRUFJQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGVBQVIsQ0FKZCxDQUFBOztBQUFBLEVBTUEsYUFBQSxHQUFnQixFQU5oQixDQUFBOztBQUFBLEVBUUEsbUJBQUEsR0FBc0IsSUFSdEIsQ0FBQTs7QUFBQSxFQVNBLHFCQUFBLEdBQXdCLFNBQUMsTUFBRCxHQUFBOztNQUN0QixzQkFBdUIsT0FBQSxDQUFRLHlCQUFSO0tBQXZCO1dBQ0EsTUFBQSxZQUFrQixvQkFGSTtFQUFBLENBVHhCLENBQUE7O0FBQUEsRUFhQSxjQUFBLEdBQWlCLENBQUMsQ0FBQyxRQUFGLENBQVcsQ0FBQyxTQUFBLEdBQUE7QUFDM0IsUUFBQSxvQkFBQTtBQUFBLElBQUEsSUFBRyxzQkFBSDtBQUNFO0FBQUEsV0FBQSwyQ0FBQTt3QkFBQTtBQUNFLFFBQUEsSUFBRyxxQkFBQSxDQUFzQixJQUF0QixDQUFIO0FBQ0UsVUFBQSxJQUFJLENBQUMsY0FBTCxDQUFBLENBQUEsQ0FERjtTQURGO0FBQUEsT0FERjtLQUQyQjtFQUFBLENBQUQsQ0FBWCxF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

//# sourceURL=/Users/anas/.atom/packages/markdown-preview-plus/lib/image-watch-helper.coffee
