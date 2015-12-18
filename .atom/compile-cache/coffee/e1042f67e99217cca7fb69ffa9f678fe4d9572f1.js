(function() {
  var MarkdownPreviewView, createMarkdownPreviewView, isMarkdownPreviewView, mathjaxHelper, renderer, url,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  url = require('url');

  MarkdownPreviewView = null;

  renderer = null;

  mathjaxHelper = null;

  createMarkdownPreviewView = function(state) {
    if (MarkdownPreviewView == null) {
      MarkdownPreviewView = require('./markdown-preview-view');
    }
    return new MarkdownPreviewView(state);
  };

  isMarkdownPreviewView = function(object) {
    if (MarkdownPreviewView == null) {
      MarkdownPreviewView = require('./markdown-preview-view');
    }
    return object instanceof MarkdownPreviewView;
  };

  atom.deserializers.add({
    name: 'MarkdownPreviewView',
    deserialize: function(state) {
      if (state.constructor === Object) {
        return createMarkdownPreviewView(state);
      }
    }
  });

  module.exports = {
    config: {
      breakOnSingleNewline: {
        type: 'boolean',
        "default": false,
        order: 0
      },
      liveUpdate: {
        type: 'boolean',
        "default": true,
        order: 10
      },
      openPreviewInSplitPane: {
        type: 'boolean',
        "default": true,
        order: 20
      },
      grammars: {
        type: 'array',
        "default": ['source.gfm', 'source.litcoffee', 'text.html.basic', 'text.plain', 'text.plain.null-grammar'],
        order: 30
      },
      enableLatexRenderingByDefault: {
        title: 'Enable Math Rendering By Default',
        type: 'boolean',
        "default": false,
        order: 40
      },
      useLazyHeaders: {
        title: 'Use Lazy Headers',
        description: 'Require no space after headings #',
        type: 'boolean',
        "default": true,
        order: 45
      },
      useGitHubStyle: {
        title: 'Use GitHub.com style',
        type: 'boolean',
        "default": false,
        order: 50
      },
      enablePandoc: {
        type: 'boolean',
        "default": false,
        title: 'Enable Pandoc Parser',
        order: 100
      },
      pandocPath: {
        type: 'string',
        "default": 'pandoc',
        title: 'Pandoc Options: Path',
        description: 'Please specify the correct path to your pandoc executable',
        dependencies: ['enablePandoc'],
        order: 110
      },
      pandocArguments: {
        type: 'array',
        "default": [],
        title: 'Pandoc Options: Commandline Arguments',
        description: 'Comma separated pandoc arguments e.g. `--smart, --filter=/bin/exe`. Please use long argument names.',
        dependencies: ['enablePandoc'],
        order: 120
      },
      pandocMarkdownFlavor: {
        type: 'string',
        "default": 'markdown-raw_tex+tex_math_single_backslash',
        title: 'Pandoc Options: Markdown Flavor',
        description: 'Enter the pandoc markdown flavor you want',
        dependencies: ['enablePandoc'],
        order: 130
      },
      pandocBibliography: {
        type: 'boolean',
        "default": false,
        title: 'Pandoc Options: Citations',
        description: 'Enable this for bibliography parsing',
        dependencies: ['enablePandoc'],
        order: 140
      },
      pandocRemoveReferences: {
        type: 'boolean',
        "default": true,
        title: 'Pandoc Options: Remove References',
        description: 'Removes references at the end of the HTML preview',
        dependencies: ['pandocBibliography'],
        order: 150
      },
      pandocBIBFile: {
        type: 'string',
        "default": 'bibliography.bib',
        title: 'Pandoc Options: Bibliography (bibfile)',
        description: 'Name of bibfile to search for recursivly',
        dependencies: ['pandocBibliography'],
        order: 160
      },
      pandocBIBFileFallback: {
        type: 'string',
        "default": '',
        title: 'Pandoc Options: Fallback Bibliography (bibfile)',
        description: 'Full path to fallback bibfile',
        dependencies: ['pandocBibliography'],
        order: 165
      },
      pandocCSLFile: {
        type: 'string',
        "default": 'custom.csl',
        title: 'Pandoc Options: Bibliography Style (cslfile)',
        description: 'Name of cslfile to search for recursivly',
        dependencies: ['pandocBibliography'],
        order: 170
      },
      pandocCSLFileFallback: {
        type: 'string',
        "default": '',
        title: 'Pandoc Options: Fallback Bibliography Style (cslfile)',
        description: 'Full path to fallback cslfile',
        dependencies: ['pandocBibliography'],
        order: 175
      }
    },
    activate: function() {
      var previewFile;
      atom.commands.add('atom-workspace', {
        'markdown-preview-plus:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'markdown-preview-plus:copy-html': (function(_this) {
          return function() {
            return _this.copyHtml();
          };
        })(this),
        'markdown-preview-plus:toggle-break-on-single-newline': function() {
          var keyPath;
          keyPath = 'markdown-preview-plus.breakOnSingleNewline';
          return atom.config.set(keyPath, !atom.config.get(keyPath));
        }
      });
      previewFile = this.previewFile.bind(this);
      atom.commands.add('.tree-view .file .name[data-name$=\\.markdown]', 'markdown-preview-plus:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.md]', 'markdown-preview-plus:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.mdown]', 'markdown-preview-plus:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.mkd]', 'markdown-preview-plus:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.mkdown]', 'markdown-preview-plus:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.ron]', 'markdown-preview-plus:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.txt]', 'markdown-preview-plus:preview-file', previewFile);
      return atom.workspace.addOpener(function(uriToOpen) {
        var error, host, pathname, protocol, _ref;
        try {
          _ref = url.parse(uriToOpen), protocol = _ref.protocol, host = _ref.host, pathname = _ref.pathname;
        } catch (_error) {
          error = _error;
          return;
        }
        if (protocol !== 'markdown-preview-plus:') {
          return;
        }
        try {
          if (pathname) {
            pathname = decodeURI(pathname);
          }
        } catch (_error) {
          error = _error;
          return;
        }
        if (host === 'editor') {
          return createMarkdownPreviewView({
            editorId: pathname.substring(1)
          });
        } else {
          return createMarkdownPreviewView({
            filePath: pathname
          });
        }
      });
    },
    toggle: function() {
      var editor, grammars, _ref, _ref1;
      if (isMarkdownPreviewView(atom.workspace.getActivePaneItem())) {
        atom.workspace.destroyActivePaneItem();
        return;
      }
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      grammars = (_ref = atom.config.get('markdown-preview-plus.grammars')) != null ? _ref : [];
      if (_ref1 = editor.getGrammar().scopeName, __indexOf.call(grammars, _ref1) < 0) {
        return;
      }
      if (!this.removePreviewForEditor(editor)) {
        return this.addPreviewForEditor(editor);
      }
    },
    uriForEditor: function(editor) {
      return "markdown-preview-plus://editor/" + editor.id;
    },
    removePreviewForEditor: function(editor) {
      var preview, previewPane, uri;
      uri = this.uriForEditor(editor);
      previewPane = atom.workspace.paneForURI(uri);
      if (previewPane != null) {
        preview = previewPane.itemForURI(uri);
        if (preview !== previewPane.getActiveItem()) {
          previewPane.activateItem(preview);
          return false;
        }
        previewPane.destroyItem(preview);
        return true;
      } else {
        return false;
      }
    },
    addPreviewForEditor: function(editor) {
      var options, previousActivePane, uri;
      uri = this.uriForEditor(editor);
      previousActivePane = atom.workspace.getActivePane();
      options = {
        searchAllPanes: true
      };
      if (atom.config.get('markdown-preview-plus.openPreviewInSplitPane')) {
        options.split = 'right';
      }
      return atom.workspace.open(uri, options).done(function(markdownPreviewView) {
        if (isMarkdownPreviewView(markdownPreviewView)) {
          return previousActivePane.activate();
        }
      });
    },
    previewFile: function(_arg) {
      var editor, filePath, target, _i, _len, _ref;
      target = _arg.target;
      filePath = target.dataset.path;
      if (!filePath) {
        return;
      }
      _ref = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        editor = _ref[_i];
        if (!(editor.getPath() === filePath)) {
          continue;
        }
        this.addPreviewForEditor(editor);
        return;
      }
      return atom.workspace.open("markdown-preview-plus://" + (encodeURI(filePath)), {
        searchAllPanes: true
      });
    },
    copyHtml: function(callback, scaleMath) {
      var editor, renderLaTeX, text;
      if (callback == null) {
        callback = atom.clipboard.write.bind(atom.clipboard);
      }
      if (scaleMath == null) {
        scaleMath = 100;
      }
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      if (renderer == null) {
        renderer = require('./renderer');
      }
      text = editor.getSelectedText() || editor.getText();
      renderLaTeX = atom.config.get('markdown-preview-plus.enableLatexRenderingByDefault');
      return renderer.toHTML(text, editor.getPath(), editor.getGrammar(), renderLaTeX, true, function(error, html) {
        if (error) {
          return console.warn('Copying Markdown as HTML failed', error);
        } else if (renderLaTeX) {
          if (mathjaxHelper == null) {
            mathjaxHelper = require('./mathjax-helper');
          }
          return mathjaxHelper.processHTMLString(html, function(proHTML) {
            proHTML = proHTML.replace(/MathJax\_SVG.*?font\-size\: 100%/g, function(match) {
              return match.replace(/font\-size\: 100%/, "font-size: " + scaleMath + "%");
            });
            return callback(proHTML);
          });
        } else {
          return callback(html);
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24tcHJldmlldy1wbHVzL2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtR0FBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUVBLG1CQUFBLEdBQXNCLElBRnRCLENBQUE7O0FBQUEsRUFHQSxRQUFBLEdBQVcsSUFIWCxDQUFBOztBQUFBLEVBSUEsYUFBQSxHQUFnQixJQUpoQixDQUFBOztBQUFBLEVBTUEseUJBQUEsR0FBNEIsU0FBQyxLQUFELEdBQUE7O01BQzFCLHNCQUF1QixPQUFBLENBQVEseUJBQVI7S0FBdkI7V0FDSSxJQUFBLG1CQUFBLENBQW9CLEtBQXBCLEVBRnNCO0VBQUEsQ0FONUIsQ0FBQTs7QUFBQSxFQVVBLHFCQUFBLEdBQXdCLFNBQUMsTUFBRCxHQUFBOztNQUN0QixzQkFBdUIsT0FBQSxDQUFRLHlCQUFSO0tBQXZCO1dBQ0EsTUFBQSxZQUFrQixvQkFGSTtFQUFBLENBVnhCLENBQUE7O0FBQUEsRUFjQSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQW5CLENBQ0U7QUFBQSxJQUFBLElBQUEsRUFBTSxxQkFBTjtBQUFBLElBQ0EsV0FBQSxFQUFhLFNBQUMsS0FBRCxHQUFBO0FBQ1gsTUFBQSxJQUFvQyxLQUFLLENBQUMsV0FBTixLQUFxQixNQUF6RDtlQUFBLHlCQUFBLENBQTBCLEtBQTFCLEVBQUE7T0FEVztJQUFBLENBRGI7R0FERixDQWRBLENBQUE7O0FBQUEsRUFtQkEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxvQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7QUFBQSxRQUVBLEtBQUEsRUFBTyxDQUZQO09BREY7QUFBQSxNQUlBLFVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO0FBQUEsUUFFQSxLQUFBLEVBQU8sRUFGUDtPQUxGO0FBQUEsTUFRQSxzQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLEtBQUEsRUFBTyxFQUZQO09BVEY7QUFBQSxNQVlBLFFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxDQUNQLFlBRE8sRUFFUCxrQkFGTyxFQUdQLGlCQUhPLEVBSVAsWUFKTyxFQUtQLHlCQUxPLENBRFQ7QUFBQSxRQVFBLEtBQUEsRUFBTyxFQVJQO09BYkY7QUFBQSxNQXNCQSw2QkFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sa0NBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsS0FGVDtBQUFBLFFBR0EsS0FBQSxFQUFPLEVBSFA7T0F2QkY7QUFBQSxNQTJCQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxrQkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLG1DQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLElBSFQ7QUFBQSxRQUlBLEtBQUEsRUFBTyxFQUpQO09BNUJGO0FBQUEsTUFpQ0EsY0FBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sc0JBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsS0FGVDtBQUFBLFFBR0EsS0FBQSxFQUFPLEVBSFA7T0FsQ0Y7QUFBQSxNQXNDQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsS0FBQSxFQUFPLHNCQUZQO0FBQUEsUUFHQSxLQUFBLEVBQU8sR0FIUDtPQXZDRjtBQUFBLE1BMkNBLFVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxRQURUO0FBQUEsUUFFQSxLQUFBLEVBQU8sc0JBRlA7QUFBQSxRQUdBLFdBQUEsRUFBYSwyREFIYjtBQUFBLFFBSUEsWUFBQSxFQUFjLENBQUMsY0FBRCxDQUpkO0FBQUEsUUFLQSxLQUFBLEVBQU8sR0FMUDtPQTVDRjtBQUFBLE1Ba0RBLGVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxFQURUO0FBQUEsUUFFQSxLQUFBLEVBQU8sdUNBRlA7QUFBQSxRQUdBLFdBQUEsRUFBYSxxR0FIYjtBQUFBLFFBSUEsWUFBQSxFQUFjLENBQUMsY0FBRCxDQUpkO0FBQUEsUUFLQSxLQUFBLEVBQU8sR0FMUDtPQW5ERjtBQUFBLE1BeURBLG9CQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsNENBRFQ7QUFBQSxRQUVBLEtBQUEsRUFBTyxpQ0FGUDtBQUFBLFFBR0EsV0FBQSxFQUFhLDJDQUhiO0FBQUEsUUFJQSxZQUFBLEVBQWMsQ0FBQyxjQUFELENBSmQ7QUFBQSxRQUtBLEtBQUEsRUFBTyxHQUxQO09BMURGO0FBQUEsTUFnRUEsa0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO0FBQUEsUUFFQSxLQUFBLEVBQU8sMkJBRlA7QUFBQSxRQUdBLFdBQUEsRUFBYSxzQ0FIYjtBQUFBLFFBSUEsWUFBQSxFQUFjLENBQUMsY0FBRCxDQUpkO0FBQUEsUUFLQSxLQUFBLEVBQU8sR0FMUDtPQWpFRjtBQUFBLE1BdUVBLHNCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsS0FBQSxFQUFPLG1DQUZQO0FBQUEsUUFHQSxXQUFBLEVBQWEsbURBSGI7QUFBQSxRQUlBLFlBQUEsRUFBYyxDQUFDLG9CQUFELENBSmQ7QUFBQSxRQUtBLEtBQUEsRUFBTyxHQUxQO09BeEVGO0FBQUEsTUE4RUEsYUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLGtCQURUO0FBQUEsUUFFQSxLQUFBLEVBQU8sd0NBRlA7QUFBQSxRQUdBLFdBQUEsRUFBYSwwQ0FIYjtBQUFBLFFBSUEsWUFBQSxFQUFjLENBQUMsb0JBQUQsQ0FKZDtBQUFBLFFBS0EsS0FBQSxFQUFPLEdBTFA7T0EvRUY7QUFBQSxNQXFGQSxxQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEVBRFQ7QUFBQSxRQUVBLEtBQUEsRUFBTyxpREFGUDtBQUFBLFFBR0EsV0FBQSxFQUFhLCtCQUhiO0FBQUEsUUFJQSxZQUFBLEVBQWMsQ0FBQyxvQkFBRCxDQUpkO0FBQUEsUUFLQSxLQUFBLEVBQU8sR0FMUDtPQXRGRjtBQUFBLE1BNEZBLGFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxZQURUO0FBQUEsUUFFQSxLQUFBLEVBQU8sOENBRlA7QUFBQSxRQUdBLFdBQUEsRUFBYSwwQ0FIYjtBQUFBLFFBSUEsWUFBQSxFQUFjLENBQUMsb0JBQUQsQ0FKZDtBQUFBLFFBS0EsS0FBQSxFQUFPLEdBTFA7T0E3RkY7QUFBQSxNQW1HQSxxQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEVBRFQ7QUFBQSxRQUVBLEtBQUEsRUFBTyx1REFGUDtBQUFBLFFBR0EsV0FBQSxFQUFhLCtCQUhiO0FBQUEsUUFJQSxZQUFBLEVBQWMsQ0FBQyxvQkFBRCxDQUpkO0FBQUEsUUFLQSxLQUFBLEVBQU8sR0FMUDtPQXBHRjtLQURGO0FBQUEsSUE2R0EsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsV0FBQTtBQUFBLE1BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNFO0FBQUEsUUFBQSw4QkFBQSxFQUFnQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFDOUIsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUQ4QjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhDO0FBQUEsUUFFQSxpQ0FBQSxFQUFtQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFDakMsS0FBQyxDQUFBLFFBQUQsQ0FBQSxFQURpQztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRm5DO0FBQUEsUUFJQSxzREFBQSxFQUF3RCxTQUFBLEdBQUE7QUFDdEQsY0FBQSxPQUFBO0FBQUEsVUFBQSxPQUFBLEdBQVUsNENBQVYsQ0FBQTtpQkFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsT0FBaEIsRUFBeUIsQ0FBQSxJQUFRLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsT0FBaEIsQ0FBN0IsRUFGc0Q7UUFBQSxDQUp4RDtPQURGLENBQUEsQ0FBQTtBQUFBLE1BU0EsV0FBQSxHQUFjLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixJQUFsQixDQVRkLENBQUE7QUFBQSxNQVVBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnREFBbEIsRUFBb0Usb0NBQXBFLEVBQTBHLFdBQTFHLENBVkEsQ0FBQTtBQUFBLE1BV0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLDBDQUFsQixFQUE4RCxvQ0FBOUQsRUFBb0csV0FBcEcsQ0FYQSxDQUFBO0FBQUEsTUFZQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsNkNBQWxCLEVBQWlFLG9DQUFqRSxFQUF1RyxXQUF2RyxDQVpBLENBQUE7QUFBQSxNQWFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQiwyQ0FBbEIsRUFBK0Qsb0NBQS9ELEVBQXFHLFdBQXJHLENBYkEsQ0FBQTtBQUFBLE1BY0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLDhDQUFsQixFQUFrRSxvQ0FBbEUsRUFBd0csV0FBeEcsQ0FkQSxDQUFBO0FBQUEsTUFlQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsMkNBQWxCLEVBQStELG9DQUEvRCxFQUFxRyxXQUFyRyxDQWZBLENBQUE7QUFBQSxNQWdCQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsMkNBQWxCLEVBQStELG9DQUEvRCxFQUFxRyxXQUFyRyxDQWhCQSxDQUFBO2FBa0JBLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBZixDQUF5QixTQUFDLFNBQUQsR0FBQTtBQUN2QixZQUFBLHFDQUFBO0FBQUE7QUFDRSxVQUFBLE9BQTZCLEdBQUcsQ0FBQyxLQUFKLENBQVUsU0FBVixDQUE3QixFQUFDLGdCQUFBLFFBQUQsRUFBVyxZQUFBLElBQVgsRUFBaUIsZ0JBQUEsUUFBakIsQ0FERjtTQUFBLGNBQUE7QUFHRSxVQURJLGNBQ0osQ0FBQTtBQUFBLGdCQUFBLENBSEY7U0FBQTtBQUtBLFFBQUEsSUFBYyxRQUFBLEtBQVksd0JBQTFCO0FBQUEsZ0JBQUEsQ0FBQTtTQUxBO0FBT0E7QUFDRSxVQUFBLElBQWtDLFFBQWxDO0FBQUEsWUFBQSxRQUFBLEdBQVcsU0FBQSxDQUFVLFFBQVYsQ0FBWCxDQUFBO1dBREY7U0FBQSxjQUFBO0FBR0UsVUFESSxjQUNKLENBQUE7QUFBQSxnQkFBQSxDQUhGO1NBUEE7QUFZQSxRQUFBLElBQUcsSUFBQSxLQUFRLFFBQVg7aUJBQ0UseUJBQUEsQ0FBMEI7QUFBQSxZQUFBLFFBQUEsRUFBVSxRQUFRLENBQUMsU0FBVCxDQUFtQixDQUFuQixDQUFWO1dBQTFCLEVBREY7U0FBQSxNQUFBO2lCQUdFLHlCQUFBLENBQTBCO0FBQUEsWUFBQSxRQUFBLEVBQVUsUUFBVjtXQUExQixFQUhGO1NBYnVCO01BQUEsQ0FBekIsRUFuQlE7SUFBQSxDQTdHVjtBQUFBLElBa0pBLE1BQUEsRUFBUSxTQUFBLEdBQUE7QUFDTixVQUFBLDZCQUFBO0FBQUEsTUFBQSxJQUFHLHFCQUFBLENBQXNCLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWYsQ0FBQSxDQUF0QixDQUFIO0FBQ0UsUUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFmLENBQUEsQ0FBQSxDQUFBO0FBQ0EsY0FBQSxDQUZGO09BQUE7QUFBQSxNQUlBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FKVCxDQUFBO0FBS0EsTUFBQSxJQUFjLGNBQWQ7QUFBQSxjQUFBLENBQUE7T0FMQTtBQUFBLE1BT0EsUUFBQSwrRUFBK0QsRUFQL0QsQ0FBQTtBQVFBLE1BQUEsWUFBYyxNQUFNLENBQUMsVUFBUCxDQUFBLENBQW1CLENBQUMsU0FBcEIsRUFBQSxlQUFpQyxRQUFqQyxFQUFBLEtBQUEsS0FBZDtBQUFBLGNBQUEsQ0FBQTtPQVJBO0FBVUEsTUFBQSxJQUFBLENBQUEsSUFBcUMsQ0FBQSxzQkFBRCxDQUF3QixNQUF4QixDQUFwQztlQUFBLElBQUMsQ0FBQSxtQkFBRCxDQUFxQixNQUFyQixFQUFBO09BWE07SUFBQSxDQWxKUjtBQUFBLElBK0pBLFlBQUEsRUFBYyxTQUFDLE1BQUQsR0FBQTthQUNYLGlDQUFBLEdBQWlDLE1BQU0sQ0FBQyxHQUQ3QjtJQUFBLENBL0pkO0FBQUEsSUFrS0Esc0JBQUEsRUFBd0IsU0FBQyxNQUFELEdBQUE7QUFDdEIsVUFBQSx5QkFBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLElBQUMsQ0FBQSxZQUFELENBQWMsTUFBZCxDQUFOLENBQUE7QUFBQSxNQUNBLFdBQUEsR0FBYyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQWYsQ0FBMEIsR0FBMUIsQ0FEZCxDQUFBO0FBRUEsTUFBQSxJQUFHLG1CQUFIO0FBQ0UsUUFBQSxPQUFBLEdBQVUsV0FBVyxDQUFDLFVBQVosQ0FBdUIsR0FBdkIsQ0FBVixDQUFBO0FBQ0EsUUFBQSxJQUFHLE9BQUEsS0FBYSxXQUFXLENBQUMsYUFBWixDQUFBLENBQWhCO0FBQ0UsVUFBQSxXQUFXLENBQUMsWUFBWixDQUF5QixPQUF6QixDQUFBLENBQUE7QUFDQSxpQkFBTyxLQUFQLENBRkY7U0FEQTtBQUFBLFFBSUEsV0FBVyxDQUFDLFdBQVosQ0FBd0IsT0FBeEIsQ0FKQSxDQUFBO2VBS0EsS0FORjtPQUFBLE1BQUE7ZUFRRSxNQVJGO09BSHNCO0lBQUEsQ0FsS3hCO0FBQUEsSUErS0EsbUJBQUEsRUFBcUIsU0FBQyxNQUFELEdBQUE7QUFDbkIsVUFBQSxnQ0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLElBQUMsQ0FBQSxZQUFELENBQWMsTUFBZCxDQUFOLENBQUE7QUFBQSxNQUNBLGtCQUFBLEdBQXFCLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBRHJCLENBQUE7QUFBQSxNQUVBLE9BQUEsR0FDRTtBQUFBLFFBQUEsY0FBQSxFQUFnQixJQUFoQjtPQUhGLENBQUE7QUFJQSxNQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDhDQUFoQixDQUFIO0FBQ0UsUUFBQSxPQUFPLENBQUMsS0FBUixHQUFnQixPQUFoQixDQURGO09BSkE7YUFNQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsR0FBcEIsRUFBeUIsT0FBekIsQ0FBaUMsQ0FBQyxJQUFsQyxDQUF1QyxTQUFDLG1CQUFELEdBQUE7QUFDckMsUUFBQSxJQUFHLHFCQUFBLENBQXNCLG1CQUF0QixDQUFIO2lCQUNFLGtCQUFrQixDQUFDLFFBQW5CLENBQUEsRUFERjtTQURxQztNQUFBLENBQXZDLEVBUG1CO0lBQUEsQ0EvS3JCO0FBQUEsSUEwTEEsV0FBQSxFQUFhLFNBQUMsSUFBRCxHQUFBO0FBQ1gsVUFBQSx3Q0FBQTtBQUFBLE1BRGEsU0FBRCxLQUFDLE1BQ2IsQ0FBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBMUIsQ0FBQTtBQUNBLE1BQUEsSUFBQSxDQUFBLFFBQUE7QUFBQSxjQUFBLENBQUE7T0FEQTtBQUdBO0FBQUEsV0FBQSwyQ0FBQTswQkFBQTtjQUFtRCxNQUFNLENBQUMsT0FBUCxDQUFBLENBQUEsS0FBb0I7O1NBQ3JFO0FBQUEsUUFBQSxJQUFDLENBQUEsbUJBQUQsQ0FBcUIsTUFBckIsQ0FBQSxDQUFBO0FBQ0EsY0FBQSxDQUZGO0FBQUEsT0FIQTthQU9BLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFxQiwwQkFBQSxHQUF5QixDQUFDLFNBQUEsQ0FBVSxRQUFWLENBQUQsQ0FBOUMsRUFBc0U7QUFBQSxRQUFBLGNBQUEsRUFBZ0IsSUFBaEI7T0FBdEUsRUFSVztJQUFBLENBMUxiO0FBQUEsSUFvTUEsUUFBQSxFQUFVLFNBQUMsUUFBRCxFQUF1RCxTQUF2RCxHQUFBO0FBQ1IsVUFBQSx5QkFBQTs7UUFEUyxXQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQXJCLENBQTBCLElBQUksQ0FBQyxTQUEvQjtPQUNwQjs7UUFEK0QsWUFBWTtPQUMzRTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFDQSxNQUFBLElBQWMsY0FBZDtBQUFBLGNBQUEsQ0FBQTtPQURBOztRQUdBLFdBQVksT0FBQSxDQUFRLFlBQVI7T0FIWjtBQUFBLE1BSUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxlQUFQLENBQUEsQ0FBQSxJQUE0QixNQUFNLENBQUMsT0FBUCxDQUFBLENBSm5DLENBQUE7QUFBQSxNQUtBLFdBQUEsR0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscURBQWhCLENBTGQsQ0FBQTthQU1BLFFBQVEsQ0FBQyxNQUFULENBQWdCLElBQWhCLEVBQXNCLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBdEIsRUFBd0MsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUF4QyxFQUE2RCxXQUE3RCxFQUEwRSxJQUExRSxFQUFnRixTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDOUUsUUFBQSxJQUFHLEtBQUg7aUJBQ0UsT0FBTyxDQUFDLElBQVIsQ0FBYSxpQ0FBYixFQUFnRCxLQUFoRCxFQURGO1NBQUEsTUFFSyxJQUFHLFdBQUg7O1lBQ0gsZ0JBQWlCLE9BQUEsQ0FBUSxrQkFBUjtXQUFqQjtpQkFDQSxhQUFhLENBQUMsaUJBQWQsQ0FBZ0MsSUFBaEMsRUFBc0MsU0FBQyxPQUFELEdBQUE7QUFDcEMsWUFBQSxPQUFBLEdBQVUsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsbUNBQWhCLEVBQXFELFNBQUMsS0FBRCxHQUFBO3FCQUM3RCxLQUFLLENBQUMsT0FBTixDQUFjLG1CQUFkLEVBQW9DLGFBQUEsR0FBYSxTQUFiLEdBQXVCLEdBQTNELEVBRDZEO1lBQUEsQ0FBckQsQ0FBVixDQUFBO21CQUVBLFFBQUEsQ0FBUyxPQUFULEVBSG9DO1VBQUEsQ0FBdEMsRUFGRztTQUFBLE1BQUE7aUJBT0gsUUFBQSxDQUFTLElBQVQsRUFQRztTQUh5RTtNQUFBLENBQWhGLEVBUFE7SUFBQSxDQXBNVjtHQXBCRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/anas/.atom/packages/markdown-preview-plus/lib/main.coffee
