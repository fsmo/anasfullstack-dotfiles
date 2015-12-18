(function() {
  var $, MarkdownPreviewView, fs, path, temp, wrench;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  wrench = require('wrench');

  MarkdownPreviewView = require('../lib/markdown-preview-view');

  $ = require('atom-space-pen-views').$;

  require('./spec-helper');

  describe("Markdown preview plus package", function() {
    var expectPreviewInSplitPane, preview, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], preview = _ref[1];
    beforeEach(function() {
      var fixturesPath, tempPath;
      fixturesPath = path.join(__dirname, 'fixtures');
      tempPath = temp.mkdirSync('atom');
      wrench.copyDirSyncRecursive(fixturesPath, tempPath, {
        forceDelete: true
      });
      atom.project.setPaths([tempPath]);
      jasmine.useRealClock();
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      waitsForPromise(function() {
        return atom.packages.activatePackage("markdown-preview-plus");
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('language-gfm');
      });
    });
    afterEach(function() {
      if (preview instanceof MarkdownPreviewView) {
        preview.destroy();
      }
      return preview = null;
    });
    expectPreviewInSplitPane = function() {
      runs(function() {
        return expect(atom.workspace.getPanes()).toHaveLength(2);
      });
      waitsFor("markdown preview to be created", function() {
        return preview = atom.workspace.getPanes()[1].getActiveItem();
      });
      return runs(function() {
        expect(preview).toBeInstanceOf(MarkdownPreviewView);
        return expect(preview.getPath()).toBe(atom.workspace.getActivePaneItem().getPath());
      });
    };
    describe("when a preview has not been created for the file", function() {
      it("displays a markdown preview in a split pane", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/file.markdown");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          var editorPane;
          editorPane = atom.workspace.getPanes()[0];
          expect(editorPane.getItems()).toHaveLength(1);
          return expect(editorPane.isActive()).toBe(true);
        });
      });
      describe("when the editor's path does not exist", function() {
        return it("splits the current pane to the right with a markdown preview for the file", function() {
          waitsForPromise(function() {
            return atom.workspace.open("new.markdown");
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
          });
          return expectPreviewInSplitPane();
        });
      });
      describe("when the editor does not have a path", function() {
        return it("splits the current pane to the right with a markdown preview for the file", function() {
          waitsForPromise(function() {
            return atom.workspace.open("");
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
          });
          return expectPreviewInSplitPane();
        });
      });
      describe("when the path contains a space", function() {
        return it("renders the preview", function() {
          waitsForPromise(function() {
            return atom.workspace.open("subdir/file with space.md");
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
          });
          return expectPreviewInSplitPane();
        });
      });
      return describe("when the path contains accented characters", function() {
        return it("renders the preview", function() {
          waitsForPromise(function() {
            return atom.workspace.open("subdir/áccéntéd.md");
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
          });
          return expectPreviewInSplitPane();
        });
      });
    });
    describe("when a preview has been created for the file", function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/file.markdown");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        return expectPreviewInSplitPane();
      });
      it("closes the existing preview when toggle is triggered a second time on the editor and when the preview is its panes active item", function() {
        var editorPane, previewPane, _ref1;
        atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        _ref1 = atom.workspace.getPanes(), editorPane = _ref1[0], previewPane = _ref1[1];
        expect(editorPane.isActive()).toBe(true);
        return expect(previewPane.getActiveItem()).toBeUndefined();
      });
      it("activates the existing preview when toggle is triggered a second time on the editor and when the preview is not its panes active item #nottravis", function() {
        var editorPane, previewPane, _ref1;
        _ref1 = atom.workspace.getPanes(), editorPane = _ref1[0], previewPane = _ref1[1];
        editorPane.activate();
        waitsForPromise(function() {
          return atom.workspace.open("subdir/simple.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        waitsFor("second markdown preview to be created", function() {
          return previewPane.getItems().length === 2;
        });
        runs(function() {
          preview = previewPane.getActiveItem();
          expect(preview).toBeInstanceOf(MarkdownPreviewView);
          expect(previewPane.getActiveItemIndex()).toBe(1);
          expect(preview.getPath()).toBe(editorPane.getActiveItem().getPath());
          expect(preview.getPath()).toBe(atom.workspace.getActivePaneItem().getPath());
          editorPane.activate();
          editorPane.activateItemAtIndex(0);
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        waitsFor("first preview to be activated", function() {
          return previewPane.getActiveItemIndex() === 0;
        });
        return runs(function() {
          preview = previewPane.getActiveItem();
          expect(previewPane.getItems().length).toBe(2);
          expect(preview.getPath()).toBe(editorPane.getActiveItem().getPath());
          return expect(preview.getPath()).toBe(atom.workspace.getActivePaneItem().getPath());
        });
      });
      it("closes the existing preview when toggle is triggered on it and it has focus", function() {
        var editorPane, previewPane, _ref1;
        _ref1 = atom.workspace.getPanes(), editorPane = _ref1[0], previewPane = _ref1[1];
        previewPane.activate();
        atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        return expect(previewPane.getActiveItem()).toBeUndefined();
      });
      describe("when the editor is modified", function() {
        it("re-renders the preview", function() {
          var markdownEditor;
          spyOn(preview, 'showLoading');
          markdownEditor = atom.workspace.getActiveTextEditor();
          markdownEditor.setText("Hey!");
          waitsFor(function() {
            return preview.text().indexOf("Hey!") >= 0;
          });
          return runs(function() {
            return expect(preview.showLoading).not.toHaveBeenCalled();
          });
        });
        it("invokes ::onDidChangeMarkdown listeners", function() {
          var listener, markdownEditor;
          markdownEditor = atom.workspace.getActiveTextEditor();
          preview.onDidChangeMarkdown(listener = jasmine.createSpy('didChangeMarkdownListener'));
          runs(function() {
            return markdownEditor.setText("Hey!");
          });
          return waitsFor("::onDidChangeMarkdown handler to be called", function() {
            return listener.callCount > 0;
          });
        });
        describe("when the preview is in the active pane but is not the active item", function() {
          return it("re-renders the preview but does not make it active", function() {
            var markdownEditor, previewPane;
            markdownEditor = atom.workspace.getActiveTextEditor();
            previewPane = atom.workspace.getPanes()[1];
            previewPane.activate();
            waitsForPromise(function() {
              return atom.workspace.open();
            });
            runs(function() {
              return markdownEditor.setText("Hey!");
            });
            waitsFor(function() {
              return preview.text().indexOf("Hey!") >= 0;
            });
            return runs(function() {
              expect(previewPane.isActive()).toBe(true);
              return expect(previewPane.getActiveItem()).not.toBe(preview);
            });
          });
        });
        describe("when the preview is not the active item and not in the active pane", function() {
          return it("re-renders the preview and makes it active", function() {
            var editorPane, markdownEditor, previewPane, _ref1;
            markdownEditor = atom.workspace.getActiveTextEditor();
            _ref1 = atom.workspace.getPanes(), editorPane = _ref1[0], previewPane = _ref1[1];
            previewPane.splitRight({
              copyActiveItem: true
            });
            previewPane.activate();
            waitsForPromise(function() {
              return atom.workspace.open();
            });
            runs(function() {
              editorPane.activate();
              return markdownEditor.setText("Hey!");
            });
            waitsFor(function() {
              return preview.text().indexOf("Hey!") >= 0;
            });
            return runs(function() {
              expect(editorPane.isActive()).toBe(true);
              return expect(previewPane.getActiveItem()).toBe(preview);
            });
          });
        });
        return describe("when the liveUpdate config is set to false", function() {
          return it("only re-renders the markdown when the editor is saved, not when the contents are modified", function() {
            var didStopChangingHandler;
            atom.config.set('markdown-preview-plus.liveUpdate', false);
            didStopChangingHandler = jasmine.createSpy('didStopChangingHandler');
            atom.workspace.getActiveTextEditor().getBuffer().onDidStopChanging(didStopChangingHandler);
            atom.workspace.getActiveTextEditor().setText('ch ch changes');
            waitsFor(function() {
              return didStopChangingHandler.callCount > 0;
            });
            runs(function() {
              expect(preview.text()).not.toContain("ch ch changes");
              return atom.workspace.getActiveTextEditor().save();
            });
            return waitsFor(function() {
              return preview.text().indexOf("ch ch changes") >= 0;
            });
          });
        });
      });
      return describe("when a new grammar is loaded", function() {
        return it("re-renders the preview", function() {
          var grammarAdded;
          atom.workspace.getActiveTextEditor().setText("```javascript\nvar x = y;\n```");
          waitsFor("markdown to be rendered after its text changed", function() {
            return preview.find("atom-text-editor").data("grammar") === "text plain null-grammar";
          });
          grammarAdded = false;
          runs(function() {
            return atom.grammars.onDidAddGrammar(function() {
              return grammarAdded = true;
            });
          });
          waitsForPromise(function() {
            expect(atom.packages.isPackageActive('language-javascript')).toBe(false);
            return atom.packages.activatePackage('language-javascript');
          });
          waitsFor("grammar to be added", function() {
            return grammarAdded;
          });
          return waitsFor("markdown to be rendered after grammar was added", function() {
            return preview.find("atom-text-editor").data("grammar") !== "source js";
          });
        });
      });
    });
    describe("when the markdown preview view is requested by file URI", function() {
      return it("opens a preview editor and watches the file for changes", function() {
        waitsForPromise("atom.workspace.open promise to be resolved", function() {
          return atom.workspace.open("markdown-preview-plus://" + (atom.project.getDirectories()[0].resolve('subdir/file.markdown')));
        });
        runs(function() {
          preview = atom.workspace.getActivePaneItem();
          expect(preview).toBeInstanceOf(MarkdownPreviewView);
          spyOn(preview, 'renderMarkdownText');
          return preview.file.emitter.emit('did-change');
        });
        return waitsFor("markdown to be re-rendered after file changed", function() {
          return preview.renderMarkdownText.callCount > 0;
        });
      });
    });
    describe("when the editor's grammar it not enabled for preview", function() {
      return it("does not open the markdown preview", function() {
        atom.config.set('markdown-preview-plus.grammars', []);
        waitsForPromise(function() {
          return atom.workspace.open("subdir/file.markdown");
        });
        return runs(function() {
          spyOn(atom.workspace, 'open').andCallThrough();
          atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
          return expect(atom.workspace.open).not.toHaveBeenCalled();
        });
      });
    });
    describe("when the editor's path changes on #win32 and #darwin", function() {
      return it("updates the preview's title", function() {
        var titleChangedCallback;
        titleChangedCallback = jasmine.createSpy('titleChangedCallback');
        waitsForPromise(function() {
          return atom.workspace.open("subdir/file.markdown");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        expectPreviewInSplitPane();
        runs(function() {
          var filePath;
          expect(preview.getTitle()).toBe('file.markdown Preview');
          preview.onDidChangeTitle(titleChangedCallback);
          filePath = atom.workspace.getActiveTextEditor().getPath();
          return fs.renameSync(filePath, path.join(path.dirname(filePath), 'file2.md'));
        });
        waitsFor(function() {
          return preview.getTitle() === "file2.md Preview";
        });
        return runs(function() {
          expect(titleChangedCallback).toHaveBeenCalled();
          return preview.destroy();
        });
      });
    });
    describe("when the URI opened does not have a markdown-preview-plus protocol", function() {
      return it("does not throw an error trying to decode the URI (regression)", function() {
        waitsForPromise(function() {
          return atom.workspace.open('%');
        });
        return runs(function() {
          return expect(atom.workspace.getActiveTextEditor()).toBeTruthy();
        });
      });
    });
    describe("when markdown-preview-plus:copy-html is triggered", function() {
      it("copies the HTML to the clipboard", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/simple.md");
        });
        return runs(function() {
          atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:copy-html');
          expect(atom.clipboard.read()).toBe("<p><em>italic</em></p>\n<p><strong>bold</strong></p>\n<p>encoding \u2192 issue</p>");
          atom.workspace.getActiveTextEditor().setSelectedBufferRange([[0, 0], [1, 0]]);
          atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:copy-html');
          return expect(atom.clipboard.read()).toBe("<p><em>italic</em></p>");
        });
      });
      return describe("code block tokenization", function() {
        preview = null;
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.packages.activatePackage('language-ruby');
          });
          waitsForPromise(function() {
            return atom.packages.activatePackage('markdown-preview-plus');
          });
          waitsForPromise(function() {
            return atom.workspace.open("subdir/file.markdown");
          });
          return runs(function() {
            workspaceElement = atom.views.getView(atom.workspace);
            atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:copy-html');
            return preview = $('<div>').append(atom.clipboard.read());
          });
        });
        describe("when the code block's fence name has a matching grammar", function() {
          return it("tokenizes the code block with the grammar", function() {
            return expect(preview.find("pre span.entity.name.function.ruby")).toExist();
          });
        });
        describe("when the code block's fence name doesn't have a matching grammar", function() {
          return it("does not tokenize the code block", function() {
            return expect(preview.find("pre.lang-kombucha .line .null-grammar").children().length).toBe(2);
          });
        });
        describe("when the code block contains empty lines", function() {
          return it("doesn't remove the empty lines", function() {
            expect(preview.find("pre.lang-python").children().length).toBe(6);
            expect(preview.find("pre.lang-python div:nth-child(2)").text().trim()).toBe('');
            expect(preview.find("pre.lang-python div:nth-child(4)").text().trim()).toBe('');
            return expect(preview.find("pre.lang-python div:nth-child(5)").text().trim()).toBe('');
          });
        });
        return describe("when the code block is nested in a list", function() {
          return it("detects and styles the block", function() {
            return expect(preview.find("pre.lang-javascript")).toHaveClass('editor-colors');
          });
        });
      });
    });
    describe("when main::copyHtml() is called directly", function() {
      var mpp;
      mpp = null;
      beforeEach(function() {
        return mpp = atom.packages.getActivePackage('markdown-preview-plus').mainModule;
      });
      it("copies the HTML to the clipboard by default", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/simple.md");
        });
        return runs(function() {
          mpp.copyHtml();
          expect(atom.clipboard.read()).toBe("<p><em>italic</em></p>\n<p><strong>bold</strong></p>\n<p>encoding \u2192 issue</p>");
          atom.workspace.getActiveTextEditor().setSelectedBufferRange([[0, 0], [1, 0]]);
          mpp.copyHtml();
          return expect(atom.clipboard.read()).toBe("<p><em>italic</em></p>");
        });
      });
      it("passes the HTML to a callback if supplied as the first argument", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/simple.md");
        });
        return runs(function() {
          expect(mpp.copyHtml(function(html) {
            return html;
          })).toBe("<p><em>italic</em></p>\n<p><strong>bold</strong></p>\n<p>encoding \u2192 issue</p>");
          atom.workspace.getActiveTextEditor().setSelectedBufferRange([[0, 0], [1, 0]]);
          return expect(mpp.copyHtml(function(html) {
            return html;
          })).toBe("<p><em>italic</em></p>");
        });
      });
      return describe("when LaTeX rendering is enabled by default", function() {
        beforeEach(function() {
          spyOn(atom.clipboard, 'write').andCallThrough();
          waitsFor("LaTeX rendering to be enabled", function() {
            return atom.config.set('markdown-preview-plus.enableLatexRenderingByDefault', true);
          });
          waitsForPromise(function() {
            return atom.workspace.open("subdir/simple.md");
          });
          return runs(function() {
            return atom.workspace.getActiveTextEditor().setText('$$\\int_3^4$$');
          });
        });
        it("copies the HTML with maths blocks as svg's to the clipboard by default", function() {
          mpp.copyHtml();
          waitsFor("atom.clipboard.write to have been called", function() {
            return atom.clipboard.write.callCount === 1;
          });
          return runs(function() {
            var clipboard;
            clipboard = atom.clipboard.read();
            expect(clipboard.match(/MathJax\_SVG\_Hidden/).length).toBe(1);
            return expect(clipboard.match(/class\=\"MathJax\_SVG\"/).length).toBe(1);
          });
        });
        it("scales the svg's if the scaleMath parameter is passed", function() {
          mpp.copyHtml(null, 200);
          waitsFor("atom.clipboard.write to have been called", function() {
            return atom.clipboard.write.callCount === 1;
          });
          return runs(function() {
            var clipboard;
            clipboard = atom.clipboard.read();
            return expect(clipboard.match(/font\-size\: 200%/).length).toBe(1);
          });
        });
        return it("passes the HTML to a callback if supplied as the first argument", function() {
          var html;
          html = null;
          mpp.copyHtml(function(proHTML) {
            return html = proHTML;
          });
          waitsFor("markdown to be parsed and processed by MathJax", function() {
            return html != null;
          });
          return runs(function() {
            expect(html.match(/MathJax\_SVG\_Hidden/).length).toBe(1);
            return expect(html.match(/class\=\"MathJax\_SVG\"/).length).toBe(1);
          });
        });
      });
    });
    describe("sanitization", function() {
      it("removes script tags and attributes that commonly contain inline scripts", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/evil.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          return expect($(preview[0]).find("div.update-preview").html()).toBe("<p>hello</p>\n\n\n<p>sad\n<img>\nworld</p>");
        });
      });
      return it("remove the first <!doctype> tag at the beginning of the file", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/doctype-tag.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          return expect($(preview[0]).find("div.update-preview").html()).toBe("<p>content\n&lt;!doctype html&gt;</p>");
        });
      });
    });
    describe("when the markdown contains an <html> tag", function() {
      return it("does not throw an exception", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/html-tag.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          return expect($(preview[0]).find("div.update-preview").html()).toBe("content");
        });
      });
    });
    describe("when the markdown contains a <pre> tag", function() {
      return it("does not throw an exception", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/pre-tag.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          return expect(preview.find('atom-text-editor')).toExist();
        });
      });
    });
    return describe("GitHub style markdown preview", function() {
      beforeEach(function() {
        return atom.config.set('markdown-preview-plus.useGitHubStyle', false);
      });
      it("renders markdown using the default style when GitHub styling is disabled", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/simple.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          return expect(preview.element.getAttribute('data-use-github-style')).toBeNull();
        });
      });
      it("renders markdown using the GitHub styling when enabled", function() {
        atom.config.set('markdown-preview-plus.useGitHubStyle', true);
        waitsForPromise(function() {
          return atom.workspace.open("subdir/simple.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          return expect(preview.element.getAttribute('data-use-github-style')).toBe('');
        });
      });
      return it("updates the rendering style immediately when the configuration is changed", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/simple.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          expect(preview.element.getAttribute('data-use-github-style')).toBeNull();
          atom.config.set('markdown-preview-plus.useGitHubStyle', true);
          expect(preview.element.getAttribute('data-use-github-style')).not.toBeNull();
          atom.config.set('markdown-preview-plus.useGitHubStyle', false);
          return expect(preview.element.getAttribute('data-use-github-style')).toBeNull();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24tcHJldmlldy1wbHVzL3NwZWMvbWFya2Rvd24tcHJldmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4Q0FBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQUhULENBQUE7O0FBQUEsRUFJQSxtQkFBQSxHQUFzQixPQUFBLENBQVEsOEJBQVIsQ0FKdEIsQ0FBQTs7QUFBQSxFQUtDLElBQUssT0FBQSxDQUFRLHNCQUFSLEVBQUwsQ0FMRCxDQUFBOztBQUFBLEVBT0EsT0FBQSxDQUFRLGVBQVIsQ0FQQSxDQUFBOztBQUFBLEVBU0EsUUFBQSxDQUFTLCtCQUFULEVBQTBDLFNBQUEsR0FBQTtBQUN4QyxRQUFBLHlEQUFBO0FBQUEsSUFBQSxPQUE4QixFQUE5QixFQUFDLDBCQUFELEVBQW1CLGlCQUFuQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxzQkFBQTtBQUFBLE1BQUEsWUFBQSxHQUFlLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixVQUFyQixDQUFmLENBQUE7QUFBQSxNQUNBLFFBQUEsR0FBVyxJQUFJLENBQUMsU0FBTCxDQUFlLE1BQWYsQ0FEWCxDQUFBO0FBQUEsTUFFQSxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsWUFBNUIsRUFBMEMsUUFBMUMsRUFBb0Q7QUFBQSxRQUFBLFdBQUEsRUFBYSxJQUFiO09BQXBELENBRkEs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

//# sourceURL=/Users/anas/.atom/packages/markdown-preview-plus/spec/markdown-preview-spec.coffee
