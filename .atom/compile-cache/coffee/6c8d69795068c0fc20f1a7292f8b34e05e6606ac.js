(function() {
  var $, NewFileView, TextEditorView, View, config, fs, path, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  path = require("path");

  fs = require("fs-plus");

  config = require("../config");

  utils = require("../utils");

  module.exports = NewFileView = (function(_super) {
    __extends(NewFileView, _super);

    function NewFileView() {
      return NewFileView.__super__.constructor.apply(this, arguments);
    }

    NewFileView.fileType = "File";

    NewFileView.pathConfig = "siteFilesDir";

    NewFileView.fileNameConfig = "newFileFileName";

    NewFileView.content = function() {
      return this.div({
        "class": "markdown-writer"
      }, (function(_this) {
        return function() {
          _this.label("Add New " + _this.fileType, {
            "class": "icon icon-file-add"
          });
          _this.div(function() {
            _this.label("Directory", {
              "class": "message"
            });
            _this.subview("pathEditor", new TextEditorView({
              mini: true
            }));
            _this.label("Date", {
              "class": "message"
            });
            _this.subview("dateEditor", new TextEditorView({
              mini: true
            }));
            _this.label("Title", {
              "class": "message"
            });
            return _this.subview("titleEditor", new TextEditorView({
              mini: true
            }));
          });
          _this.p({
            "class": "message",
            outlet: "message"
          });
          return _this.p({
            "class": "error",
            outlet: "error"
          });
        };
      })(this));
    };

    NewFileView.prototype.initialize = function() {
      utils.setTabIndex([this.titleEditor, this.pathEditor, this.dateEditor]);
      this.pathEditor.getModel().onDidChange((function(_this) {
        return function() {
          return _this.updatePath();
        };
      })(this));
      this.dateEditor.getModel().onDidChange((function(_this) {
        return function() {
          return _this.updatePath();
        };
      })(this));
      this.titleEditor.getModel().onDidChange((function(_this) {
        return function() {
          return _this.updatePath();
        };
      })(this));
      return atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function() {
            return _this.createPost();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function() {
            return _this.detach();
          };
        })(this)
      });
    };

    NewFileView.prototype.display = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.dateEditor.setText(utils.getDateStr());
      this.pathEditor.setText(utils.dirTemplate(config.get(this.constructor.pathConfig)));
      this.panel.show();
      return this.titleEditor.focus();
    };

    NewFileView.prototype.detach = function() {
      var _ref1;
      if (this.panel.isVisible()) {
        this.panel.hide();
        if ((_ref1 = this.previouslyFocusedElement) != null) {
          _ref1.focus();
        }
      }
      return NewFileView.__super__.detach.apply(this, arguments);
    };

    NewFileView.prototype.createPost = function() {
      var error, post;
      try {
        post = this.getFullPath();
        if (fs.existsSync(post)) {
          return this.error.text("File " + (this.getFullPath()) + " already exists!");
        } else {
          fs.writeFileSync(post, this.generateFrontMatter(this.getFrontMatter()));
          atom.workspace.open(post);
          return this.detach();
        }
      } catch (_error) {
        error = _error;
        return this.error.text("" + error.message);
      }
    };

    NewFileView.prototype.updatePath = function() {
      return this.message.html("<b>Site Directory:</b> " + (utils.getRootPath()) + "/<br/>\n<b>Create " + this.constructor.fileType + " At:</b> " + (this.getPostPath()));
    };

    NewFileView.prototype.getFullPath = function() {
      return path.join(utils.getRootPath(), this.getPostPath());
    };

    NewFileView.prototype.getPostPath = function() {
      return path.join(this.pathEditor.getText(), this.getFileName());
    };

    NewFileView.prototype.getFileName = function() {
      var info, template;
      template = config.get(this.constructor.fileNameConfig);
      info = {
        title: utils.dasherize(this.getTitle()),
        extension: config.get("fileExtension")
      };
      return utils.template(template, $.extend(info, this.getDate()));
    };

    NewFileView.prototype.getTitle = function() {
      return this.titleEditor.getText() || ("New " + this.constructor.fileType);
    };

    NewFileView.prototype.getDate = function() {
      return utils.parseDateStr(this.dateEditor.getText());
    };

    NewFileView.prototype.getPublished = function() {
      return this.constructor.fileType === 'Post';
    };

    NewFileView.prototype.generateFrontMatter = function(data) {
      return utils.template(config.get("frontMatter"), data);
    };

    NewFileView.prototype.getFrontMatter = function() {
      return {
        layout: "post",
        published: this.getPublished(),
        title: this.getTitle(),
        slug: utils.dasherize(this.getTitle()),
        date: "" + (this.dateEditor.getText()) + " " + (utils.getTimeStr()),
        dateTime: this.getDate()
      };
    };

    return NewFileView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi92aWV3cy9uZXctZmlsZS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtRUFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLEVBQVUsc0JBQUEsY0FBVixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUZMLENBQUE7O0FBQUEsRUFJQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVIsQ0FKVCxDQUFBOztBQUFBLEVBS0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSLENBTFIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixrQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxXQUFDLENBQUEsUUFBRCxHQUFZLE1BQVosQ0FBQTs7QUFBQSxJQUNBLFdBQUMsQ0FBQSxVQUFELEdBQWMsY0FEZCxDQUFBOztBQUFBLElBRUEsV0FBQyxDQUFBLGNBQUQsR0FBa0IsaUJBRmxCLENBQUE7O0FBQUEsSUFJQSxXQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxpQkFBUDtPQUFMLEVBQStCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDN0IsVUFBQSxLQUFDLENBQUEsS0FBRCxDQUFRLFVBQUEsR0FBVSxLQUFDLENBQUEsUUFBbkIsRUFBK0I7QUFBQSxZQUFBLE9BQUEsRUFBTyxvQkFBUDtXQUEv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

//# sourceURL=/Users/anas/.atom/packages/markdown-writer/lib/views/new-file-view.coffee
