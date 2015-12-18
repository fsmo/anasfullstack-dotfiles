(function() {
  var $, $$$, CompositeDisposable, Disposable, Emitter, File, Grim, MarkdownPreviewView, ScrollView, UpdatePreview, fs, imageWatcher, markdownIt, path, renderer, _, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  _ref = require('atom'), Emitter = _ref.Emitter, Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable;

  _ref1 = require('atom-space-pen-views'), $ = _ref1.$, $$$ = _ref1.$$$, ScrollView = _ref1.ScrollView;

  Grim = require('grim');

  _ = require('underscore-plus');

  fs = require('fs-plus');

  File = require('atom').File;

  renderer = require('./renderer');

  UpdatePreview = require('./update-preview');

  markdownIt = null;

  imageWatcher = null;

  module.exports = MarkdownPreviewView = (function(_super) {
    __extends(MarkdownPreviewView, _super);

    MarkdownPreviewView.content = function() {
      return this.div({
        "class": 'markdown-preview native-key-bindings',
        tabindex: -1
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'update-preview'
          });
        };
      })(this));
    };

    function MarkdownPreviewView(_arg) {
      this.editorId = _arg.editorId, this.filePath = _arg.filePath;
      this.syncPreview = __bind(this.syncPreview, this);
      this.getPathToToken = __bind(this.getPathToToken, this);
      this.syncSource = __bind(this.syncSource, this);
      this.getPathToElement = __bind(this.getPathToElement, this);
      this.updatePreview = null;
      this.renderLaTeX = atom.config.get('markdown-preview-plus.enableLatexRenderingByDefault');
      MarkdownPreviewView.__super__.constructor.apply(this, arguments);
      this.emitter = new Emitter;
      this.disposables = new CompositeDisposable;
      this.loaded = true;
    }

    MarkdownPreviewView.prototype.attached = function() {
      if (this.isAttached) {
        return;
      }
      this.isAttached = true;
      if (this.editorId != null) {
        return this.resolveEditor(this.editorId);
      } else {
        if (atom.workspace != null) {
          return this.subscribeToFilePath(this.filePath);
        } else {
          return this.disposables.add(atom.packages.onDidActivateInitialPackages((function(_this) {
            return function() {
              return _this.subscribeToFilePath(_this.filePath);
            };
          })(this)));
        }
      }
    };

    MarkdownPreviewView.prototype.serialize = function() {
      return {
        deserializer: 'MarkdownPreviewView',
        filePath: this.getPath(),
        editorId: this.editorId
      };
    };

    MarkdownPreviewView.prototype.destroy = function() {
      if (imageWatcher == null) {
        imageWatcher = require('./image-watch-helper');
      }
      imageWatcher.removeFile(this.getPath());
      return this.disposables.dispose();
    };

    MarkdownPreviewView.prototype.onDidChangeTitle = function(callback) {
      return this.emitter.on('did-change-title', callback);
    };

    MarkdownPreviewView.prototype.onDidChangeModified = function(callback) {
      return new Disposable;
    };

    MarkdownPreviewView.prototype.onDidChangeMarkdown = function(callback) {
      return this.emitter.on('did-change-markdown', callback);
    };

    MarkdownPreviewView.prototype.subscribeToFilePath = function(filePath) {
      this.file = new File(filePath);
      this.emitter.emit('did-change-title');
      this.handleEvents();
      return this.renderMarkdown();
    };

    MarkdownPreviewView.prototype.resolveEditor = function(editorId) {
      var resolve;
      resolve = (function(_this) {
        return function() {
          var _ref2, _ref3;
          _this.editor = _this.editorForId(editorId);
          if (_this.editor != null) {
            if (_this.editor != null) {
              _this.emitter.emit('did-change-title');
            }
            _this.handleEvents();
            return _this.renderMarkdown();
          } else {
            return (_ref2 = atom.workspace) != null ? (_ref3 = _ref2.paneForItem(_this)) != null ? _ref3.destroyItem(_this) : void 0 : void 0;
          }
        };
      })(this);
      if (atom.workspace != null) {
        return resolve();
      } else {
        return this.disposables.add(atom.packages.onDidActivateInitialPackages(resolve));
      }
    };

    MarkdownPreviewView.prototype.editorForId = function(editorId) {
      var editor, _i, _len, _ref2, _ref3;
      _ref2 = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        editor = _ref2[_i];
        if (((_ref3 = editor.id) != null ? _ref3.toString() : void 0) === editorId.toString()) {
          return editor;
        }
      }
      return null;
    };

    MarkdownPreviewView.prototype.handleEvents = function() {
      var changeHandler;
      this.disposables.add(atom.grammars.onDidAddGrammar((function(_this) {
        return function() {
          return _.debounce((function() {
            return _this.renderMarkdown();
          }), 250);
        };
      })(this)));
      this.disposables.add(atom.grammars.onDidUpdateGrammar(_.debounce(((function(_this) {
        return function() {
          return _this.renderMarkdown();
        };
      })(this)), 250)));
      atom.commands.add(this.element, {
        'core:move-up': (function(_this) {
          return function() {
            return _this.scrollUp();
          };
        })(this),
        'core:move-down': (function(_this) {
          return function() {
            return _this.scrollDown();
          };
        })(this),
        'core:save-as': (function(_this) {
          return function(event) {
            event.stopPropagation();
            return _this.saveAs();
          };
        })(this),
        'core:copy': (function(_this) {
          return function(event) {
            if (_this.copyToClipboard()) {
              return event.stopPropagation();
            }
          };
        })(this),
        'markdown-preview-plus:zoom-in': (function(_this) {
          return function() {
            var zoomLevel;
            zoomLevel = parseFloat(_this.css('zoom')) || 1;
            return _this.css('zoom', zoomLevel + .1);
          };
        })(this),
        'markdown-preview-plus:zoom-out': (function(_this) {
          return function() {
            var zoomLevel;
            zoomLevel = parseFloat(_this.css('zoom')) || 1;
            return _this.css('zoom', zoomLevel - .1);
          };
        })(this),
        'markdown-preview-plus:reset-zoom': (function(_this) {
          return function() {
            return _this.css('zoom', 1);
          };
        })(this),
        'markdown-preview-plus:sync-source': (function(_this) {
          return function(event) {
            return _this.getMarkdownSource().then(function(source) {
              if (source == null) {
                return;
              }
              return _this.syncSource(source, event.target);
            });
          };
        })(this)
      });
      changeHandler = (function(_this) {
        return function() {
          var pane, _base, _ref2;
          _this.renderMarkdown();
          pane = (_ref2 = typeof (_base = atom.workspace).paneForItem === "function" ? _base.paneForItem(_this) : void 0) != null ? _ref2 : atom.workspace.paneForURI(_this.getURI());
          if ((pane != null) && pane !== atom.workspace.getActivePane()) {
            return pane.activateItem(_this);
          }
        };
      })(this);
      if (this.file != null) {
        this.disposables.add(this.file.onDidChange(changeHandler));
      } else if (this.editor != null) {
        this.disposables.add(this.editor.getBuffer().onDidStopChanging(function() {
          if (atom.config.get('markdown-preview-plus.liveUpdate')) {
            return changeHandler();
          }
        }));
        this.disposables.add(this.editor.onDidChangePath((function(_this) {
          return function() {
            return _this.emitter.emit('did-change-title');
          };
        })(this)));
        this.disposables.add(this.editor.getBuffer().onDidSave(function() {
          if (!atom.config.get('markdown-preview-plus.liveUpdate')) {
            return changeHandler();
          }
        }));
        this.disposables.add(this.editor.getBuffer().onDidReload(function() {
          if (!atom.config.get('markdown-preview-plus.liveUpdate')) {
            return changeHandler();
          }
        }));
        this.disposables.add(atom.commands.add(atom.views.getView(this.editor), {
          'markdown-preview-plus:sync-preview': (function(_this) {
            return function(event) {
              return _this.getMarkdownSource().then(function(source) {
                if (source == null) {
                  return;
                }
                return _this.syncPreview(source, _this.editor.getCursorBufferPosition().row);
              });
            };
          })(this)
        }));
      }
      this.disposables.add(atom.config.onDidChange('markdown-preview-plus.breakOnSingleNewline', changeHandler));
      this.disposables.add(atom.commands.add('atom-workspace', {
        'markdown-preview-plus:toggle-render-latex': (function(_this) {
          return function() {
            if ((atom.workspace.getActivePaneItem() === _this) || (atom.workspace.getActiveTextEditor() === _this.editor)) {
              _this.renderLaTeX = !_this.renderLaTeX;
              changeHandler();
            }
          };
        })(this)
      }));
      return this.disposables.add(atom.config.observe('markdown-preview-plus.useGitHubStyle', (function(_this) {
        return function(useGitHubStyle) {
          if (useGitHubStyle) {
            return _this.element.setAttribute('data-use-github-style', '');
          } else {
            return _this.element.removeAttribute('data-use-github-style');
          }
        };
      })(this)));
    };

    MarkdownPreviewView.prototype.renderMarkdown = function() {
      if (!this.loaded) {
        this.showLoading();
      }
      return this.getMarkdownSource().then((function(_this) {
        return function(source) {
          if (source != null) {
            return _this.renderMarkdownText(source);
          }
        };
      })(this));
    };

    MarkdownPreviewView.prototype.getMarkdownSource = function() {
      if (this.file != null) {
        return this.file.read();
      } else if (this.editor != null) {
        return Promise.resolve(this.editor.getText());
      } else {
        return Promise.resolve(null);
      }
    };

    MarkdownPreviewView.prototype.getHTML = function(callback) {
      return this.getMarkdownSource().then((function(_this) {
        return function(source) {
          if (source == null) {
            return;
          }
          return renderer.toHTML(source, _this.getPath(), _this.getGrammar(), _this.renderLaTeX, false, callback);
        };
      })(this));
    };

    MarkdownPreviewView.prototype.renderMarkdownText = function(text) {
      return renderer.toDOMFragment(text, this.getPath(), this.getGrammar(), this.renderLaTeX, (function(_this) {
        return function(error, domFragment) {
          if (error) {
            return _this.showError(error);
          } else {
            _this.loading = false;
            _this.loaded = true;
            if (!_this.updatePreview) {
              _this.updatePreview = new UpdatePreview(_this.find("div.update-preview")[0]);
            }
            _this.updatePreview.update(domFragment, _this.renderLaTeX);
            _this.emitter.emit('did-change-markdown');
            return _this.originalTrigger('markdown-preview-plus:markdown-changed');
          }
        };
      })(this));
    };

    MarkdownPreviewView.prototype.getTitle = function() {
      if (this.file != null) {
        return "" + (path.basename(this.getPath())) + " Preview";
      } else if (this.editor != null) {
        return "" + (this.editor.getTitle()) + " Preview";
      } else {
        return "Markdown Preview";
      }
    };

    MarkdownPreviewView.prototype.getIconName = function() {
      return "markdown";
    };

    MarkdownPreviewView.prototype.getURI = function() {
      if (this.file != null) {
        return "markdown-preview-plus://" + (this.getPath());
      } else {
        return "markdown-preview-plus://editor/" + this.editorId;
      }
    };

    MarkdownPreviewView.prototype.getPath = function() {
      if (this.file != null) {
        return this.file.getPath();
      } else if (this.editor != null) {
        return this.editor.getPath();
      }
    };

    MarkdownPreviewView.prototype.getGrammar = function() {
      var _ref2;
      return (_ref2 = this.editor) != null ? _ref2.getGrammar() : void 0;
    };

    MarkdownPreviewView.prototype.getDocumentStyleSheets = function() {
      return document.styleSheets;
    };

    MarkdownPreviewView.prototype.getTextEditorStyles = function() {
      var textEditorStyles;
      textEditorStyles = document.createElement("atom-styles");
      textEditorStyles.setAttribute("context", "atom-text-editor");
      document.body.appendChild(textEditorStyles);
      textEditorStyles.initialize();
      return Array.prototype.slice.apply(textEditorStyles.childNodes).map(function(styleElement) {
        return styleElement.innerText;
      });
    };

    MarkdownPreviewView.prototype.getMarkdownPreviewCSS = function() {
      var cssUrlRefExp, markdowPreviewRules, rule, ruleRegExp, stylesheet, _i, _j, _len, _len1, _ref2, _ref3, _ref4;
      markdowPreviewRules = [];
      ruleRegExp = /\.markdown-preview/;
      cssUrlRefExp = /url\(atom:\/\/markdown-preview-plus\/assets\/(.*)\)/;
      _ref2 = this.getDocumentStyleSheets();
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        stylesheet = _ref2[_i];
        if (stylesheet.rules != null) {
          _ref3 = stylesheet.rules;
          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
            rule = _ref3[_j];
            if (((_ref4 = rule.selectorText) != null ? _ref4.match(ruleRegExp) : void 0) != null) {
              markdowPreviewRules.push(rule.cssText);
            }
          }
        }
      }
      return markdowPreviewRules.concat(this.getTextEditorStyles()).join('\n').replace(/atom-text-editor/g, 'pre.editor-colors').replace(/:host/g, '.host').replace(cssUrlRefExp, function(match, assetsName, offset, string) {
        var assetPath, base64Data, originalData;
        assetPath = path.join(__dirname, '../assets', assetsName);
        originalData = fs.readFileSync(assetPath, 'binary');
        base64Data = new Buffer(originalData, 'binary').toString('base64');
        return "url('data:image/jpeg;base64," + base64Data + "')";
      });
    };

    MarkdownPreviewView.prototype.showError = function(result) {
      var failureMessage;
      failureMessage = result != null ? result.message : void 0;
      return this.html($$$(function() {
        this.h2('Previewing Markdown Failed');
        if (failureMessage != null) {
          return this.h3(failureMessage);
        }
      }));
    };

    MarkdownPreviewView.prototype.showLoading = function() {
      this.loading = true;
      return this.html($$$(function() {
        return this.div({
          "class": 'markdown-spinner'
        }, 'Loading Markdown\u2026');
      }));
    };

    MarkdownPreviewView.prototype.copyToClipboard = function() {
      var selectedNode, selectedText, selection;
      if (this.loading) {
        return false;
      }
      selection = window.getSelection();
      selectedText = selection.toString();
      selectedNode = selection.baseNode;
      if (selectedText && (selectedNode != null) && (this[0] === selectedNode || $.contains(this[0], selectedNode))) {
        return false;
      }
      this.getHTML(function(error, html) {
        if (error != null) {
          return console.warn('Copying Markdown as HTML failed', error);
        } else {
          return atom.clipboard.write(html);
        }
      });
      return true;
    };

    MarkdownPreviewView.prototype.saveAs = function() {
      var filePath, htmlFilePath, projectPath, title;
      if (this.loading) {
        return;
      }
      filePath = this.getPath();
      title = 'Markdown to HTML';
      if (filePath) {
        title = path.parse(filePath).name;
        filePath += '.html';
      } else {
        filePath = 'untitled.md.html';
        if (projectPath = atom.project.getPaths()[0]) {
          filePath = path.join(projectPath, filePath);
        }
      }
      if (htmlFilePath = atom.showSaveDialogSync(filePath)) {
        return this.getHTML((function(_this) {
          return function(error, htmlBody) {
            var html, mathjaxScript;
            if (error != null) {
              return console.warn('Saving Markdown as HTML failed', error);
            } else {
              if (_this.renderLaTeX) {
                mathjaxScript = "\n<script type=\"text/x-mathjax-config\">\n  MathJax.Hub.Config({\n    jax: [\"input/TeX\",\"output/HTML-CSS\"],\n    extensions: [],\n    TeX: {\n      extensions: [\"AMSmath.js\",\"AMSsymbols.js\",\"noErrors.js\",\"noUndefined.js\"]\n    },\n    showMathMenu: false\n  });\n</script>\n<script type=\"text/javascript\" src=\"http://cdn.mathjax.org/mathjax/latest/MathJax.js\">\n</script>";
              } else {
                mathjaxScript = "";
              }
              html = ("<!DOCTYPE html>\n<html>\n  <head>\n      <meta charset=\"utf-8\" />\n      <title>" + title + "</title>" + mathjaxScript + "\n      <style>" + (_this.getMarkdownPreviewCSS()) + "</style>\n  </head>\n  <body class='markdown-preview'>" + htmlBody + "</body>\n</html>") + "\n";
              fs.writeFileSync(htmlFilePath, html);
              return atom.workspace.open(htmlFilePath);
            }
          };
        })(this));
      }
    };

    MarkdownPreviewView.prototype.isEqual = function(other) {
      return this[0] === (other != null ? other[0] : void 0);
    };

    MarkdownPreviewView.prototype.bubbleToContainerElement = function(element) {
      var parent, testElement;
      testElement = element;
      while (testElement !== document.body) {
        parent = testElement.parentNode;
        if (parent.classList.contains('MathJax_Display')) {
          return parent.parentNode;
        }
        if (parent.classList.contains('atom-text-editor')) {
          return parent;
        }
        testElement = parent;
      }
      return element;
    };

    MarkdownPreviewView.prototype.bubbleToContainerToken = function(pathToToken) {
      var i, _i, _ref2;
      for (i = _i = 0, _ref2 = pathToToken.length - 1; _i <= _ref2; i = _i += 1) {
        if (pathToToken[i].tag === 'table') {
          return pathToToken.slice(0, i + 1);
        }
      }
      return pathToToken;
    };

    MarkdownPreviewView.prototype.encodeTag = function(element) {
      if (element.classList.contains('math')) {
        return 'math';
      }
      if (element.classList.contains('atom-text-editor')) {
        return 'code';
      }
      return element.tagName.toLowerCase();
    };

    MarkdownPreviewView.prototype.decodeTag = function(token) {
      if (token.tag === 'math') {
        return 'span';
      }
      if (token.tag === 'code') {
        return 'span';
      }
      if (token.tag === "") {
        return null;
      }
      return token.tag;
    };

    MarkdownPreviewView.prototype.getPathToElement = function(element) {
      var pathToElement, sibling, siblingTag, siblings, siblingsCount, tag, _i, _len;
      if (element.classList.contains('markdown-preview')) {
        return [
          {
            tag: 'div',
            index: 0
          }
        ];
      }
      element = this.bubbleToContainerElement(element);
      tag = this.encodeTag(element);
      siblings = element.parentNode.childNodes;
      siblingsCount = 0;
      for (_i = 0, _len = siblings.length; _i < _len; _i++) {
        sibling = siblings[_i];
        siblingTag = sibling.nodeType === 1 ? this.encodeTag(sibling) : null;
        if (sibling === element) {
          pathToElement = this.getPathToElement(element.parentNode);
          pathToElement.push({
            tag: tag,
            index: siblingsCount
          });
          return pathToElement;
        } else if (siblingTag === tag) {
          siblingsCount++;
        }
      }
    };

    MarkdownPreviewView.prototype.syncSource = function(text, element) {
      var finalToken, level, pathToElement, token, tokens, _i, _len, _ref2;
      pathToElement = this.getPathToElement(element);
      pathToElement.shift();
      pathToElement.shift();
      if (!pathToElement.length) {
        return;
      }
      if (markdownIt == null) {
        markdownIt = require('./markdown-it-helper');
      }
      tokens = markdownIt.getTokens(text, this.renderLaTeX);
      finalToken = null;
      level = 0;
      for (_i = 0, _len = tokens.length; _i < _len; _i++) {
        token = tokens[_i];
        if (token.level < level) {
          break;
        }
        if (token.hidden) {
          continue;
        }
        if (token.tag === pathToElement[0].tag && token.level === level) {
          if (token.nesting === 1) {
            if (pathToElement[0].index === 0) {
              if (token.map != null) {
                finalToken = token;
              }
              pathToElement.shift();
              level++;
            } else {
              pathToElement[0].index--;
            }
          } else if (token.nesting === 0 && ((_ref2 = token.tag) === 'math' || _ref2 === 'code' || _ref2 === 'hr')) {
            if (pathToElement[0].index === 0) {
              finalToken = token;
              break;
            } else {
              pathToElement[0].index--;
            }
          }
        }
        if (pathToElement.length === 0) {
          break;
        }
      }
      if (finalToken != null) {
        this.editor.setCursorBufferPosition([finalToken.map[0], 0]);
        return finalToken.map[0];
      } else {
        return null;
      }
    };

    MarkdownPreviewView.prototype.getPathToToken = function(tokens, line) {
      var level, pathToToken, token, tokenTagCount, _i, _len, _ref2, _ref3;
      pathToToken = [];
      tokenTagCount = [];
      level = 0;
      for (_i = 0, _len = tokens.length; _i < _len; _i++) {
        token = tokens[_i];
        if (token.level < level) {
          break;
        }
        if (token.hidden) {
          continue;
        }
        if (token.nesting === -1) {
          continue;
        }
        token.tag = this.decodeTag(token);
        if (token.tag == null) {
          continue;
        }
        if ((token.map != null) && line >= token.map[0] && line <= (token.map[1] - 1)) {
          if (token.nesting === 1) {
            pathToToken.push({
              tag: token.tag,
              index: (_ref2 = tokenTagCount[token.tag]) != null ? _ref2 : 0
            });
            tokenTagCount = [];
            level++;
          } else if (token.nesting === 0) {
            pathToToken.push({
              tag: token.tag,
              index: (_ref3 = tokenTagCount[token.tag]) != null ? _ref3 : 0
            });
            break;
          }
        } else if (token.level === level) {
          if (tokenTagCount[token.tag] != null) {
            tokenTagCount[token.tag]++;
          } else {
            tokenTagCount[token.tag] = 1;
          }
        }
      }
      pathToToken = this.bubbleToContainerToken(pathToToken);
      return pathToToken;
    };

    MarkdownPreviewView.prototype.syncPreview = function(text, line) {
      var candidateElement, element, maxScrollTop, pathToToken, token, tokens, _i, _len;
      if (markdownIt == null) {
        markdownIt = require('./markdown-it-helper');
      }
      tokens = markdownIt.getTokens(text, this.renderLaTeX);
      pathToToken = this.getPathToToken(tokens, line);
      element = this.find('.update-preview').eq(0);
      for (_i = 0, _len = pathToToken.length; _i < _len; _i++) {
        token = pathToToken[_i];
        candidateElement = element.children(token.tag).eq(token.index);
        if (candidateElement.length !== 0) {
          element = candidateElement;
        } else {
          break;
        }
      }
      if (element[0].classList.contains('update-preview')) {
        return null;
      }
      if (!element[0].classList.contains('update-preview')) {
        element[0].scrollIntoView();
      }
      maxScrollTop = this.element.scrollHeight - this.innerHeight();
      if (!(this.scrollTop() >= maxScrollTop)) {
        this.element.scrollTop -= this.innerHeight() / 4;
      }
      element.addClass('flash');
      setTimeout((function() {
        return element.removeClass('flash');
      }), 1000);
      return element[0];
    };

    return MarkdownPreviewView;

  })(ScrollView);

  if (Grim.includeDeprecatedAPIs) {
    MarkdownPreviewView.prototype.on = function(eventName) {
      if (eventName === 'markdown-preview:markdown-changed') {
        Grim.deprecate("Use MarkdownPreviewView::onDidChangeMarkdown instead of the 'markdown-preview:markdown-changed' jQuery event");
      }
      return MarkdownPreviewView.__super__.on.apply(this, arguments);
    };
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24tcHJldmlldy1wbHVzL2xpYi9tYXJrZG93bi1wcmV2aWV3LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBLQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUVBLE9BQTZDLE9BQUEsQ0FBUSxNQUFSLENBQTdDLEVBQUMsZUFBQSxPQUFELEVBQVUsa0JBQUEsVUFBVixFQUFzQiwyQkFBQSxtQkFGdEIsQ0FBQTs7QUFBQSxFQUdBLFFBQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFVBQUEsQ0FBRCxFQUFJLFlBQUEsR0FBSixFQUFTLG1CQUFBLFVBSFQsQ0FBQTs7QUFBQSxFQUlBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUpQLENBQUE7O0FBQUEsRUFLQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBTEosQ0FBQTs7QUFBQSxFQU1BLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQU5MLENBQUE7O0FBQUEsRUFPQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFQRCxDQUFBOztBQUFBLEVBU0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBVFgsQ0FBQTs7QUFBQSxFQVVBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBVmhCLENBQUE7O0FBQUEsRUFXQSxVQUFBLEdBQWEsSUFYYixDQUFBOztBQUFBLEVBWUEsWUFBQSxHQUFlLElBWmYsQ0FBQTs7QUFBQSxFQWNBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiwwQ0FBQSxDQUFBOztBQUFBLElBQUEsbUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdB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

//# sourceURL=/Users/anas/.atom/packages/markdown-preview-plus/lib/markdown-preview-view.coffee
