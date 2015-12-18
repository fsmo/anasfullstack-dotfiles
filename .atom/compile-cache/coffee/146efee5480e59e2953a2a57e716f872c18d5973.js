(function() {
  var $, FrontMatter, PublishDraft, config, fs, path, shell, utils;

  $ = require("atom-space-pen-views").$;

  fs = require("fs-plus");

  path = require("path");

  shell = require("shell");

  config = require("../config");

  utils = require("../utils");

  FrontMatter = require("../helpers/front-matter");

  module.exports = PublishDraft = (function() {
    function PublishDraft() {
      this.editor = atom.workspace.getActiveTextEditor();
      this.frontMatter = new FrontMatter(this.editor);
    }

    PublishDraft.prototype.trigger = function(e) {
      this.updateFrontMatter();
      this.draftPath = this.editor.getPath();
      this.postPath = this.getPostPath();
      return this.confirmPublish((function(_this) {
        return function() {
          var error;
          try {
            _this.editor.saveAs(_this.postPath);
            if (_this.draftPath) {
              return shell.moveItemToTrash(_this.draftPath);
            }
          } catch (_error) {
            error = _error;
            return atom.confirm({
              message: "[Markdown Writer] Error!",
              detailedMessage: "Publish Draft:\n" + error.message,
              buttons: ['OK']
            });
          }
        };
      })(this));
    };

    PublishDraft.prototype.confirmPublish = function(callback) {
      if (fs.existsSync(this.postPath)) {
        return atom.confirm({
          message: "Do you want to overwrite file?",
          detailedMessage: "Another file already exists at:\n" + this.postPath,
          buttons: {
            "Confirm": callback,
            "Cancel": null
          }
        });
      } else if (this.draftPath === this.postPath) {
        return atom.confirm({
          message: "This file is published!",
          detailedMessage: "This file already published at:\n" + this.draftPath,
          buttons: ['OK']
        });
      } else {
        return callback();
      }
    };

    PublishDraft.prototype.updateFrontMatter = function() {
      if (this.frontMatter.isEmpty) {
        return;
      }
      this.frontMatter.setIfExists("published", true);
      this.frontMatter.setIfExists("date", "" + (utils.getDateStr()) + " " + (utils.getTimeStr()));
      return this.frontMatter.save();
    };

    PublishDraft.prototype.getPostPath = function() {
      var localDir, postsDir;
      localDir = utils.getRootPath();
      postsDir = utils.dirTemplate(config.get("sitePostsDir"));
      return path.join(localDir, postsDir, this._getPostName());
    };

    PublishDraft.prototype._getPostName = function() {
      var date, info, template;
      template = config.get("newPostFileName");
      date = utils.getDate();
      info = {
        title: this._getPostTitle(),
        extension: this._getPostExtension()
      };
      return utils.template(template, $.extend(info, date));
    };

    PublishDraft.prototype._getPostTitle = function() {
      var title, useFrontMatter;
      useFrontMatter = !this.draftPath || !!config.get("publishRenameBasedOnTitle");
      if (useFrontMatter) {
        title = utils.dasherize(this.frontMatter.get("title"));
      }
      return title || utils.getTitleSlug(this.draftPath) || utils.dasherize("New Post");
    };

    PublishDraft.prototype._getPostExtension = function() {
      var extname;
      if (!!config.get("publishKeepFileExtname")) {
        extname = path.extname(this.draftPath);
      }
      return extname || config.get("fileExtension");
    };

    return PublishDraft;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9jb21tYW5kcy9wdWJsaXNoLWRyYWZ0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0REFBQTs7QUFBQSxFQUFDLElBQUssT0FBQSxDQUFRLHNCQUFSLEVBQUwsQ0FBRCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FIUixDQUFBOztBQUFBLEVBS0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSLENBTFQsQ0FBQTs7QUFBQSxFQU1BLEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUixDQU5SLENBQUE7O0FBQUEsRUFPQSxXQUFBLEdBQWMsT0FBQSxDQUFRLHlCQUFSLENBUGQsQ0FBQTs7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLHNCQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVYsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFdBQUQsR0FBbUIsSUFBQSxXQUFBLENBQVksSUFBQyxDQUFBLE1BQWIsQ0FEbkIsQ0FEVztJQUFBLENBQWI7O0FBQUEsMkJBSUEsT0FBQSxHQUFTLFNBQUMsQ0FBRCxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQUEsQ0FGYixDQUFBO0FBQUEsTUFHQSxJQUFDLENB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

//# sourceURL=/Users/anas/.atom/packages/markdown-writer/lib/commands/publish-draft.coffee
