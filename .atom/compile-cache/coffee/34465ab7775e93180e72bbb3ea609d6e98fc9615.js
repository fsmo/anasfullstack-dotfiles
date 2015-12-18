(function() {
  var $, InsertImageView, TextEditorView, View, config, dialog, fs, lastInsertImageDir, path, remote, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  path = require("path");

  fs = require("fs-plus");

  remote = require("remote");

  dialog = remote.require("dialog");

  config = require("../config");

  utils = require("../utils");

  lastInsertImageDir = null;

  module.exports = InsertImageView = (function(_super) {
    __extends(InsertImageView, _super);

    function InsertImageView() {
      return InsertImageView.__super__.constructor.apply(this, arguments);
    }

    InsertImageView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-dialog"
      }, (function(_this) {
        return function() {
          _this.label("Insert Image", {
            "class": "icon icon-device-camera"
          });
          _this.div(function() {
            _this.label("Image Path (src)", {
              "class": "message"
            });
            _this.subview("imageEditor", new TextEditorView({
              mini: true
            }));
            _this.div({
              "class": "dialog-row"
            }, function() {
              _this.button("Choose Local Image", {
                outlet: "openImageButton",
                "class": "btn"
              });
              return _this.label({
                outlet: "message",
                "class": "side-label"
              });
            });
            _this.label("Title (alt)", {
              "class": "message"
            });
            _this.subview("titleEditor", new TextEditorView({
              mini: true
            }));
            _this.div({
              "class": "col-1"
            }, function() {
              _this.label("Width (px)", {
                "class": "message"
              });
              return _this.subview("widthEditor", new TextEditorView({
                mini: true
              }));
            });
            _this.div({
              "class": "col-1"
            }, function() {
              _this.label("Height (px)", {
                "class": "message"
              });
              return _this.subview("heightEditor", new TextEditorView({
                mini: true
              }));
            });
            return _this.div({
              "class": "col-2"
            }, function() {
              _this.label("Alignment", {
                "class": "message"
              });
              return _this.subview("alignEditor", new TextEditorView({
                mini: true
              }));
            });
          });
          _this.div({
            outlet: "copyImagePanel",
            "class": "hidden dialog-row"
          }, function() {
            return _this.label({
              "for": "markdown-writer-copy-image-checkbox"
            }, function() {
              _this.input({
                id: "markdown-writer-copy-image-checkbox"
              }, {
                type: "checkbox",
                outlet: "copyImageCheckbox"
              });
              return _this.span("Copy Image to Site Image Directory", {
                "class": "side-label"
              });
            });
          });
          return _this.div({
            "class": "image-container"
          }, function() {
            return _this.img({
              outlet: 'imagePreview'
            });
          });
        };
      })(this));
    };

    InsertImageView.prototype.initialize = function() {
      utils.setTabIndex([this.imageEditor, this.openImageButton, this.titleEditor, this.widthEditor, this.heightEditor, this.alignEditor, this.copyImageCheckbox]);
      this.imageEditor.on("blur", (function(_this) {
        return function() {
          return _this.updateImageSource(_this.imageEditor.getText().trim());
        };
      })(this));
      this.openImageButton.on("click", (function(_this) {
        return function() {
          return _this.openImageDialog();
        };
      })(this));
      return atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function() {
            return _this.onConfirm();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function() {
            return _this.detach();
          };
        })(this)
      });
    };

    InsertImageView.prototype.onConfirm = function() {
      var callback, imgSource;
      imgSource = this.imageEditor.getText().trim();
      if (!imgSource) {
        return;
      }
      callback = (function(_this) {
        return function() {
          _this.insertImageTag();
          return _this.detach();
        };
      })(this);
      if (!this.copyImageCheckbox.hasClass('hidden') && this.copyImageCheckbox.prop("checked")) {
        return this.copyImage(this.resolveImagePath(imgSource), callback);
      } else {
        return callback();
      }
    };

    InsertImageView.prototype.display = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.editor = atom.workspace.getActiveTextEditor();
      this.setFieldsFromSelection();
      this.panel.show();
      return this.imageEditor.focus();
    };

    InsertImageView.prototype.detach = function() {
      var _ref1;
      if (!this.panel.isVisible()) {
        return;
      }
      this.panel.hide();
      if ((_ref1 = this.previouslyFocusedElement) != null) {
        _ref1.focus();
      }
      return InsertImageView.__super__.detach.apply(this, arguments);
    };

    InsertImageView.prototype.setFieldsFromSelection = function() {
      var img, selection;
      this.range = utils.getTextBufferRange(this.editor, "link");
      selection = this.editor.getTextInRange(this.range);
      if (!selection) {
        return;
      }
      if (utils.isImage(selection)) {
        img = utils.parseImage(selection);
      } else if (utils.isImageTag(selection)) {
        img = utils.parseImageTag(selection);
      } else {
        img = {
          alt: selection
        };
      }
      this.titleEditor.setText(img.alt || "");
      this.widthEditor.setText(img.width || "");
      this.heightEditor.setText(img.height || "");
      this.imageEditor.setText(img.src || "");
      return this.updateImageSource(img.src);
    };

    InsertImageView.prototype.openImageDialog = function() {
      var files;
      files = dialog.showOpenDialog({
        properties: ['openFile'],
        defaultPath: lastInsertImageDir || utils.getRootPath()
      });
      if (!(files && files.length > 0)) {
        return;
      }
      this.imageEditor.setText(files[0]);
      this.updateImageSource(files[0]);
      if (!utils.isUrl(files[0])) {
        lastInsertImageDir = path.dirname(files[0]);
      }
      return this.titleEditor.focus();
    };

    InsertImageView.prototype.updateImageSource = function(file) {
      if (!file) {
        return;
      }
      this.displayImagePreview(file);
      if (utils.isUrl(file) || this.isInSiteDir(this.resolveImagePath(file))) {
        return this.copyImagePanel.addClass("hidden");
      } else {
        return this.copyImagePanel.removeClass("hidden");
      }
    };

    InsertImageView.prototype.displayImagePreview = function(file) {
      if (this.imageOnPreview === file) {
        return;
      }
      if (utils.isImageFile(file)) {
        this.message.text("Opening Image Preview ...");
        this.imagePreview.attr("src", this.resolveImagePath(file));
        this.imagePreview.load((function(_this) {
          return function() {
            _this.message.text("");
            return _this.setImageContext();
          };
        })(this));
        this.imagePreview.error((function(_this) {
          return function() {
            _this.message.text("Error: Failed to Load Image.");
            return _this.imagePreview.attr("src", "");
          };
        })(this));
      } else {
        if (file) {
          this.message.text("Error: Invalid Image File.");
        }
        this.imagePreview.attr("src", "");
        this.widthEditor.setText("");
        this.heightEditor.setText("");
        this.alignEditor.setText("");
      }
      return this.imageOnPreview = file;
    };

    InsertImageView.prototype.setImageContext = function() {
      var naturalHeight, naturalWidth, position, _ref1;
      _ref1 = this.imagePreview.context, naturalWidth = _ref1.naturalWidth, naturalHeight = _ref1.naturalHeight;
      this.widthEditor.setText("" + naturalWidth);
      this.heightEditor.setText("" + naturalHeight);
      position = naturalWidth > 300 ? "center" : "right";
      return this.alignEditor.setText(position);
    };

    InsertImageView.prototype.insertImageTag = function() {
      var img, imgSource, text;
      imgSource = this.imageEditor.getText().trim();
      img = {
        rawSrc: imgSource,
        src: this.generateImageSrc(imgSource),
        relativeFileSrc: this.generateRelativeImageSrc(imgSource, this.currentFileDir()),
        relativeSiteSrc: this.generateRelativeImageSrc(imgSource, utils.getRootPath()),
        alt: this.titleEditor.getText(),
        width: this.widthEditor.getText(),
        height: this.heightEditor.getText(),
        align: this.alignEditor.getText(),
        slug: utils.getTitleSlug(this.editor.getPath()),
        site: config.get("siteUrl")
      };
      if (img.src) {
        text = utils.template(config.get("imageTag"), img);
      } else {
        text = img.alt;
      }
      return this.editor.setTextInBufferRange(this.range, text);
    };

    InsertImageView.prototype.copyImage = function(file, callback) {
      var destFile, error;
      if (utils.isUrl(file) || !fs.existsSync(file)) {
        return callback();
      }
      try {
        destFile = path.join(utils.getRootPath(), this.siteImagesDir(), path.basename(file));
        if (fs.existsSync(destFile)) {
          return atom.confirm({
            message: "File already exists!",
            detailedMessage: "Another file already exists at:\n" + destPath,
            buttons: ['OK']
          });
        } else {
          return fs.copy(file, destFile, (function(_this) {
            return function() {
              _this.imageEditor.setText(destFile);
              return callback();
            };
          })(this));
        }
      } catch (_error) {
        error = _error;
        return atom.confirm({
          message: "[Markdown Writer] Error!",
          detailedMessage: "Copy Image:\n" + error.message,
          buttons: ['OK']
        });
      }
    };

    InsertImageView.prototype.siteImagesDir = function() {
      return utils.dirTemplate(config.get("siteImagesDir"));
    };

    InsertImageView.prototype.currentFileDir = function() {
      return path.dirname(this.editor.getPath() || "");
    };

    InsertImageView.prototype.isInSiteDir = function(file) {
      return file && file.startsWith(utils.getRootPath());
    };

    InsertImageView.prototype.resolveImagePath = function(file) {
      var absolutePath;
      if (!file) {
        return "";
      }
      if (utils.isUrl(file) || fs.existsSync(file)) {
        return file;
      }
      absolutePath = path.join(utils.getRootPath(), file);
      if (fs.existsSync(absolutePath)) {
        return absolutePath;
      }
      return file;
    };

    InsertImageView.prototype.generateImageSrc = function(file) {
      if (!file) {
        return "";
      }
      if (utils.isUrl(file)) {
        return file;
      }
      if (config.get('relativeImagePath')) {
        return path.relative(this.currentFileDir(), file);
      }
      if (this.isInSiteDir(file)) {
        return path.relative(utils.getRootPath(), file);
      }
      return path.join("/", this.siteImagesDir(), path.basename(file));
    };

    InsertImageView.prototype.generateRelativeImageSrc = function(file, basePath) {
      if (!file) {
        return "";
      }
      if (utils.isUrl(file)) {
        return file;
      }
      return path.relative(basePath || "~", file);
    };

    return InsertImageView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi92aWV3cy9pbnNlcnQtaW1hZ2Utdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkdBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFBSixFQUFVLHNCQUFBLGNBQVYsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBSFQsQ0FBQTs7QUFBQSxFQUlBLE1BQUEsR0FBUyxNQUFNLENBQUMsT0FBUCxDQUFlLFFBQWYsQ0FKVCxDQUFBOztBQUFBLEVBTUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSLENBTlQsQ0FBQTs7QUFBQSxFQU9BLEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUixDQVBSLENBQUE7O0FBQUEsRUFTQSxrQkFBQSxHQUFxQixJQVRyQixDQUFBOztBQUFBLEVBV0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHNDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHdDQUFQO09BQUwsRUFBc0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNwRCxVQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sY0FBUCxFQUF1QjtBQUFBLFlBQUEsT0FBQSxFQUFPLHlCQUFQO1dBQXZCLENBQUEs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

//# sourceURL=/Users/anas/.atom/packages/markdown-writer/lib/views/insert-image-view.coffee
