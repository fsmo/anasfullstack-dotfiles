(function() {
  var MarkdownPreviewView, fs, markdownIt, mathjaxHelper, path, queryString, temp, url;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  MarkdownPreviewView = require('../lib/markdown-preview-view');

  markdownIt = require('../lib/markdown-it-helper');

  mathjaxHelper = require('../lib/mathjax-helper');

  url = require('url');

  queryString = require('querystring');

  require('./spec-helper');

  describe("MarkdownPreviewView", function() {
    var expectPreviewInSplitPane, filePath, preview, _ref;
    _ref = [], filePath = _ref[0], preview = _ref[1];
    beforeEach(function() {
      filePath = atom.project.getDirectories()[0].resolve('subdir/file.markdown');
      preview = new MarkdownPreviewView({
        filePath: filePath
      });
      jasmine.attachToDOM(preview.element);
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-ruby');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-javascript');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('markdown-preview-plus');
      });
      return this.addMatchers({
        toStartWith: function(expected) {
          return this.actual.slice(0, expected.length) === expected;
        }
      });
    });
    afterEach(function() {
      return preview.destroy();
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
    describe("::constructor", function() {
      return it("shows an error message when there is an error", function() {
        preview.showError("Not a real file");
        return expect(preview.text()).toContain("Failed");
      });
    });
    describe("serialization", function() {
      var newPreview;
      newPreview = null;
      afterEach(function() {
        return newPreview.destroy();
      });
      it("recreates the file when serialized/deserialized", function() {
        newPreview = atom.deserializers.deserialize(preview.serialize());
        jasmine.attachToDOM(newPreview.element);
        return expect(newPreview.getPath()).toBe(preview.getPath());
      });
      return it("serializes the editor id when opened for an editor", function() {
        preview.destroy();
        waitsForPromise(function() {
          return atom.workspace.open('new.markdown');
        });
        return runs(function() {
          preview = new MarkdownPreviewView({
            editorId: atom.workspace.getActiveTextEditor().id
          });
          jasmine.attachToDOM(preview.element);
          expect(preview.getPath()).toBe(atom.workspace.getActiveTextEditor().getPath());
          newPreview = atom.deserializers.deserialize(preview.serialize());
          jasmine.attachToDOM(newPreview.element);
          return expect(newPreview.getPath()).toBe(preview.getPath());
        });
      });
    });
    describe("header rendering", function() {
      it("should render headings with and without space", function() {
        waitsForPromise(function() {
          return preview.renderMarkdown();
        });
        return runs(function() {
          var headlines;
          headlines = preview.find('h2');
          expect(headlines).toExist();
          expect(headlines.length).toBe(2);
          expect(headlines[0].outerHTML).toBe("<h2>Level two header without space</h2>");
          return expect(headlines[1].outerHTML).toBe("<h2>Level two header with space</h2>");
        });
      });
      return it("should render headings with and without space", function() {
        atom.config.set('markdown-preview-plus.useLazyHeaders', false);
        waitsForPromise(function() {
          return preview.renderMarkdown();
        });
        return runs(function() {
          var headlines;
          headlines = preview.find('h2');
          expect(headlines).toExist();
          expect(headlines.length).toBe(1);
          return expect(headlines[0].outerHTML).toBe("<h2>Level two header with space</h2>");
        });
      });
    });
    describe("code block conversion to atom-text-editor tags", function() {
      beforeEach(function() {
        return waitsForPromise(function() {
          return preview.renderMarkdown();
        });
      });
      it("removes line decorations on rendered code blocks", function() {
        var decorations, editor;
        editor = preview.find("atom-text-editor[data-grammar='text plain null-grammar']");
        decorations = editor[0].getModel().getDecorations({
          "class": 'cursor-line',
          type: 'line'
        });
        return expect(decorations.length).toBe(0);
      });
      describe("when the code block's fence name has a matching grammar", function() {
        return it("assigns the grammar on the atom-text-editor", function() {
          var jsEditor, rubyEditor;
          rubyEditor = preview.find("atom-text-editor[data-grammar='source ruby']");
          expect(rubyEditor).toExist();
          expect(rubyEditor[0].getModel().getText()).toBe("def func\n  x = 1\nend");
          jsEditor = preview.find("atom-text-editor[data-grammar='source js']");
          expect(jsEditor).toExist();
          return expect(jsEditor[0].getModel().getText()).toBe("if a === 3 {\n  b = 5\n}");
        });
      });
      return describe("when the code block's fence name doesn't have a matching grammar", function() {
        return it("does not assign a specific grammar", function() {
          var plainEditor;
          plainEditor = preview.find("atom-text-editor[data-grammar='text plain null-grammar']");
          expect(plainEditor).toExist();
          return expect(plainEditor[0].getModel().getText()).toBe("function f(x) {\n  return x++;\n}");
        });
      });
    });
    describe("image resolving", function() {
      beforeEach(function() {
        spyOn(markdownIt, 'decode').andCallThrough();
        return waitsForPromise(function() {
          return preview.renderMarkdown();
        });
      });
      describe("when the image uses a relative path", function() {
        return it("resolves to a path relative to the file", function() {
          var image;
          image = preview.find("img[alt=Image1]");
          expect(markdownIt.decode).toHaveBeenCalled();
          return expect(image.attr('src')).toStartWith(atom.project.getDirectories()[0].resolve('subdir/image1.png'));
        });
      });
      describe("when the image uses an absolute path that does not exist", function() {
        return it("resolves to a path relative to the project root", function() {
          var image;
          image = preview.find("img[alt=Image2]");
          expect(markdownIt.decode).toHaveBeenCalled();
          return expect(image.attr('src')).toStartWith(atom.project.getDirectories()[0].resolve('tmp/image2.png'));
        });
      });
      describe("when the image uses an absolute path that exists", function() {
        return it("adds a query to the URL", function() {
          preview.destroy();
          filePath = path.join(temp.mkdirSync('atom'), 'foo.md');
          fs.writeFileSync(filePath, "![absolute](" + filePath + ")");
          preview = new MarkdownPreviewView({
            filePath: filePath
          });
          jasmine.attachToDOM(preview.element);
          waitsForPromise(function() {
            return preview.renderMarkdown();
          });
          return runs(function() {
            expect(markdownIt.decode).toHaveBeenCalled();
            return expect(preview.find("img[alt=absolute]").attr('src')).toStartWith("" + filePath + "?v=");
          });
        });
      });
      return describe("when the image uses a web URL", function() {
        return it("doesn't change the URL", function() {
          var image;
          image = preview.find("img[alt=Image3]");
          expect(markdownIt.decode).toHaveBeenCalled();
          return expect(image.attr('src')).toBe('https://raw.githubusercontent.com/Galadirith/markdown-preview-plus/master/assets/hr.png');
        });
      });
    });
    describe("image modification", function() {
      var dirPath, getImageVersion, img1Path, workspaceElement, _ref1;
      _ref1 = [], dirPath = _ref1[0], filePath = _ref1[1], img1Path = _ref1[2], workspaceElement = _ref1[3];
      beforeEach(function() {
        preview.destroy();
        jasmine.useRealClock();
        dirPath = temp.mkdirSync('atom');
        filePath = path.join(dirPath, 'image-modification.md');
        img1Path = path.join(dirPath, 'img1.png');
        fs.writeFileSync(filePath, "![img1](" + img1Path + ")");
        fs.writeFileSync(img1Path, "clearly not a png but good enough for tests");
        workspaceElement = atom.views.getView(atom.workspace);
        jasmine.attachToDOM(workspaceElement);
        return waitsForPromise(function() {
          return atom.packages.activatePackage("markdown-preview-plus");
        });
      });
      getImageVersion = function(imagePath, imageURL) {
        var urlQuery, urlQueryStr;
        expect(imageURL).toStartWith("" + imagePath + "?v=");
        urlQueryStr = url.parse(imageURL).query;
        urlQuery = queryString.parse(urlQueryStr);
        return urlQuery.v;
      };
      describe("when a local image is previewed", function() {
        return it("adds a timestamp query to the URL", function() {
          waitsForPromise(function() {
            return atom.workspace.open(filePath);
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
          });
          expectPreviewInSplitPane();
          return runs(function() {
            var imageURL, imageVer;
            imageURL = preview.find("img[alt=img1]").attr('src');
            imageVer = getImageVersion(img1Path, imageURL);
            return expect(imageVer).not.toEqual('deleted');
          });
        });
      });
      describe("when a local image is modified during a preview #notwercker", function() {
        return it("rerenders the image with a more recent timestamp query", function() {
          var imageURL, imageVer, _ref2;
          _ref2 = [], imageURL = _ref2[0], imageVer = _ref2[1];
          waitsForPromise(function() {
            return atom.workspace.open(filePath);
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
          });
          expectPreviewInSplitPane();
          runs(function() {
            imageURL = preview.find("img[alt=img1]").attr('src');
            imageVer = getImageVersion(img1Path, imageURL);
            expect(imageVer).not.toEqual('deleted');
            return fs.writeFileSync(img1Path, "still clearly not a png ;D");
          });
          waitsFor("image src attribute to update", function() {
            imageURL = preview.find("img[alt=img1]").attr('src');
            return !imageURL.endsWith(imageVer);
          });
          return runs(function() {
            var newImageVer;
            newImageVer = getImageVersion(img1Path, imageURL);
            expect(newImageVer).not.toEqual('deleted');
            return expect(parseInt(newImageVer)).toBeGreaterThan(parseInt(imageVer));
          });
        });
      });
      describe("when three images are previewed and all are modified #notwercker", function() {
        return it("rerenders the images with a more recent timestamp as they are modified", function() {
          var expectQueryValues, getImageElementsURL, img1URL, img1Ver, img2Path, img2URL, img2Ver, img3Path, img3URL, img3Ver, _ref2, _ref3, _ref4;
          _ref2 = [], img2Path = _ref2[0], img3Path = _ref2[1];
          _ref3 = [], img1Ver = _ref3[0], img2Ver = _ref3[1], img3Ver = _ref3[2];
          _ref4 = [], img1URL = _ref4[0], img2URL = _ref4[1], img3URL = _ref4[2];
          runs(function() {
            preview.destroy();
            img2Path = path.join(dirPath, 'img2.png');
            img3Path = path.join(dirPath, 'img3.png');
            fs.writeFileSync(img2Path, "i'm not really a png ;D");
            fs.writeFileSync(img3Path, "neither am i ;D");
            return fs.writeFileSync(filePath, "![img1](" + img1Path + ")\n![img2](" + img2Path + ")\n![img3](" + img3Path + ")");
          });
          waitsForPromise(function() {
            return atom.workspace.open(filePath);
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
          });
          expectPreviewInSplitPane();
          getImageElementsURL = function() {
            return [preview.find("img[alt=img1]").attr('src'), preview.find("img[alt=img2]").attr('src'), preview.find("img[alt=img3]").attr('src')];
          };
          expectQueryValues = function(queryValues) {
            var _ref5;
            _ref5 = getImageElementsURL(), img1URL = _ref5[0], img2URL = _ref5[1], img3URL = _ref5[2];
            if (queryValues.img1 != null) {
              expect(img1URL).toStartWith("" + img1Path + "?v=");
              expect(img1URL).toBe("" + img1Path + "?v=" + queryValues.img1);
            }
            if (queryValues.img2 != null) {
              expect(img2URL).toStartWith("" + img2Path + "?v=");
              expect(img2URL).toBe("" + img2Path + "?v=" + queryValues.img2);
            }
            if (queryValues.img3 != null) {
              expect(img3URL).toStartWith("" + img3Path + "?v=");
              return expect(img3URL).toBe("" + img3Path + "?v=" + queryValues.img3);
            }
          };
          runs(function() {
            var _ref5;
            _ref5 = getImageElementsURL(), img1URL = _ref5[0], img2URL = _ref5[1], img3URL = _ref5[2];
            img1Ver = getImageVersion(img1Path, img1URL);
            img2Ver = getImageVersion(img2Path, img2URL);
            img3Ver = getImageVersion(img3Path, img3URL);
            return fs.writeFileSync(img1Path, "still clearly not a png ;D");
          });
          waitsFor("img1 src attribute to update", function() {
            img1URL = preview.find("img[alt=img1]").attr('src');
            return !img1URL.endsWith(img1Ver);
          });
          runs(function() {
            var newImg1Ver;
            expectQueryValues({
              img2: img2Ver,
              img3: img3Ver
            });
            newImg1Ver = getImageVersion(img1Path, img1URL);
            expect(newImg1Ver).not.toEqual('deleted');
            expect(parseInt(newImg1Ver)).toBeGreaterThan(parseInt(img1Ver));
            img1Ver = newImg1Ver;
            return fs.writeFileSync(img2Path, "still clearly not a png either ;D");
          });
          waitsFor("img2 src attribute to update", function() {
            img2URL = preview.find("img[alt=img2]").attr('src');
            return !img2URL.endsWith(img2Ver);
          });
          runs(function() {
            var newImg2Ver;
            expectQueryValues({
              img1: img1Ver,
              img3: img3Ver
            });
            newImg2Ver = getImageVersion(img2Path, img2URL);
            expect(newImg2Ver).not.toEqual('deleted');
            expect(parseInt(newImg2Ver)).toBeGreaterThan(parseInt(img2Ver));
            img2Ver = newImg2Ver;
            return fs.writeFileSync(img3Path, "you better believe i'm not a png ;D");
          });
          waitsFor("img3 src attribute to update", function() {
            img3URL = preview.find("img[alt=img3]").attr('src');
            return !img3URL.endsWith(img3Ver);
          });
          return runs(function() {
            var newImg3Ver;
            expectQueryValues({
              img1: img1Ver,
              img2: img2Ver
            });
            newImg3Ver = getImageVersion(img3Path, img3URL);
            expect(newImg3Ver).not.toEqual('deleted');
            return expect(parseInt(newImg3Ver)).toBeGreaterThan(parseInt(img3Ver));
          });
        });
      });
      describe("when a previewed image is deleted then restored", function() {
        return it("removes the query timestamp and restores the timestamp after a rerender", function() {
          var imageURL, imageVer, _ref2;
          _ref2 = [], imageURL = _ref2[0], imageVer = _ref2[1];
          waitsForPromise(function() {
            return atom.workspace.open(filePath);
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
          });
          expectPreviewInSplitPane();
          runs(function() {
            imageURL = preview.find("img[alt=img1]").attr('src');
            imageVer = getImageVersion(img1Path, imageURL);
            expect(imageVer).not.toEqual('deleted');
            return fs.unlinkSync(img1Path);
          });
          waitsFor("image src attribute to update", function() {
            imageURL = preview.find("img[alt=img1]").attr('src');
            return !imageURL.endsWith(imageVer);
          });
          runs(function() {
            expect(imageURL).toBe(img1Path);
            fs.writeFileSync(img1Path, "clearly not a png but good enough for tests");
            return preview.renderMarkdown();
          });
          waitsFor("image src attribute to update", function() {
            imageURL = preview.find("img[alt=img1]").attr('src');
            return imageURL !== img1Path;
          });
          return runs(function() {
            var newImageVer;
            newImageVer = getImageVersion(img1Path, imageURL);
            return expect(parseInt(newImageVer)).toBeGreaterThan(parseInt(imageVer));
          });
        });
      });
      return describe("when a previewed image is renamed and then restored with its original name", function() {
        return it("removes the query timestamp and restores the timestamp after a rerender", function() {
          var imageURL, imageVer, _ref2;
          _ref2 = [], imageURL = _ref2[0], imageVer = _ref2[1];
          waitsForPromise(function() {
            return atom.workspace.open(filePath);
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
          });
          expectPreviewInSplitPane();
          runs(function() {
            imageURL = preview.find("img[alt=img1]").attr('src');
            imageVer = getImageVersion(img1Path, imageURL);
            expect(imageVer).not.toEqual('deleted');
            return fs.renameSync(img1Path, img1Path + "trol");
          });
          waitsFor("image src attribute to update", function() {
            imageURL = preview.find("img[alt=img1]").attr('src');
            return !imageURL.endsWith(imageVer);
          });
          runs(function() {
            expect(imageURL).toBe(img1Path);
            fs.renameSync(img1Path + "trol", img1Path);
            return preview.renderMarkdown();
          });
          waitsFor("image src attribute to update", function() {
            imageURL = preview.find("img[alt=img1]").attr('src');
            return imageURL !== img1Path;
          });
          return runs(function() {
            var newImageVer;
            newImageVer = getImageVersion(img1Path, imageURL);
            return expect(parseInt(newImageVer)).toBeGreaterThan(parseInt(imageVer));
          });
        });
      });
    });
    describe("gfm newlines", function() {
      describe("when gfm newlines are not enabled", function() {
        return it("creates a single paragraph with <br>", function() {
          atom.config.set('markdown-preview-plus.breakOnSingleNewline', false);
          waitsForPromise(function() {
            return preview.renderMarkdown();
          });
          return runs(function() {
            return expect(preview.find("p:last-child br").length).toBe(0);
          });
        });
      });
      return describe("when gfm newlines are enabled", function() {
        return it("creates a single paragraph with no <br>", function() {
          atom.config.set('markdown-preview-plus.breakOnSingleNewline', true);
          waitsForPromise(function() {
            return preview.renderMarkdown();
          });
          return runs(function() {
            return expect(preview.find("p:last-child br").length).toBe(1);
          });
        });
      });
    });
    describe("when core:save-as is triggered", function() {
      beforeEach(function() {
        preview.destroy();
        filePath = atom.project.getDirectories()[0].resolve('subdir/code-block.md');
        preview = new MarkdownPreviewView({
          filePath: filePath
        });
        return jasmine.attachToDOM(preview.element);
      });
      it("saves the rendered HTML and opens it", function() {
        var atomTextEditorStyles, createRule, expectedFilePath, expectedOutput, markdownPreviewStyles, outputPath;
        outputPath = temp.path({
          suffix: '.html'
        });
        expectedFilePath = atom.project.getDirectories()[0].resolve('saved-html.html');
        expectedOutput = fs.readFileSync(expectedFilePath).toString();
        createRule = function(selector, css) {
          return {
            selectorText: selector,
            cssText: "" + selector + " " + css
          };
        };
        markdownPreviewStyles = [
          {
            rules: [createRule(".markdown-preview", "{ color: orange; }")]
          }, {
            rules: [createRule(".not-included", "{ color: green; }"), createRule(".markdown-preview :host", "{ color: purple; }")]
          }
        ];
        atomTextEditorStyles = ["atom-text-editor .line { color: brown; }\natom-text-editor .number { color: cyan; }", "atom-text-editor :host .something { color: black; }", "atom-text-editor .hr { background: url(atom://markdown-preview-plus/assets/hr.png); }"];
        expect(fs.isFileSync(outputPath)).toBe(false);
        waitsForPromise(function() {
          return preview.renderMarkdown();
        });
        runs(function() {
          spyOn(atom, 'showSaveDialogSync').andReturn(outputPath);
          spyOn(preview, 'getDocumentStyleSheets').andReturn(markdownPreviewStyles);
          spyOn(preview, 'getTextEditorStyles').andReturn(atomTextEditorStyles);
          return atom.commands.dispatch(preview.element, 'core:save-as');
        });
        waitsFor(function() {
          var _ref1;
          return fs.existsSync(outputPath) && ((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0) === fs.realpathSync(outputPath);
        });
        return runs(function() {
          var savedHTML;
          expect(fs.isFileSync(outputPath)).toBe(true);
          savedHTML = atom.workspace.getActiveTextEditor().getText().replace(/<body class='markdown-preview'><div>/, '<body class=\'markdown-preview\'>').replace(/\n<\/div><\/body>/, '</body>');
          return expect(savedHTML).toBe(expectedOutput.replace(/\r\n/g, '\n'));
        });
      });
      return describe("text editor style extraction", function() {
        var extractedStyles, textEditorStyle, unrelatedStyle;
        extractedStyles = [][0];
        textEditorStyle = ".editor-style .extraction-test { color: blue; }";
        unrelatedStyle = ".something else { color: red; }";
        beforeEach(function() {
          atom.styles.addStyleSheet(textEditorStyle, {
            context: 'atom-text-editor'
          });
          atom.styles.addStyleSheet(unrelatedStyle, {
            context: 'unrelated-context'
          });
          return extractedStyles = preview.getTextEditorStyles();
        });
        it("returns an array containing atom-text-editor css style strings", function() {
          return expect(extractedStyles.indexOf(textEditorStyle)).toBeGreaterThan(-1);
        });
        return it("does not return other styles", function() {
          return expect(extractedStyles.indexOf(unrelatedStyle)).toBe(-1);
        });
      });
    });
    describe("when core:copy is triggered", function() {
      return it("writes the rendered HTML to the clipboard", function() {
        preview.destroy();
        preview.element.remove();
        filePath = atom.project.getDirectories()[0].resolve('subdir/code-block.md');
        preview = new MarkdownPreviewView({
          filePath: filePath
        });
        jasmine.attachToDOM(preview.element);
        waitsForPromise(function() {
          return preview.renderMarkdown();
        });
        runs(function() {
          return atom.commands.dispatch(preview.element, 'core:copy');
        });
        waitsFor(function() {
          return atom.clipboard.read() !== "initial clipboard content";
        });
        return runs(function() {
          return expect(atom.clipboard.read()).toBe("<h1>Code Block</h1>\n<pre class=\"editor-colors lang-javascript\"><div class=\"line\"><span class=\"source js\"><span class=\"keyword control js\"><span>if</span></span><span>&nbsp;a&nbsp;</span><span class=\"keyword operator js\"><span>===</span></span><span>&nbsp;</span><span class=\"constant numeric js\"><span>3</span></span><span>&nbsp;</span><span class=\"meta brace curly js\"><span>{</span></span></span></div><div class=\"line\"><span class=\"source js\"><span>&nbsp;&nbsp;b&nbsp;</span><span class=\"keyword operator js\"><span>=</span></span><span>&nbsp;</span><span class=\"constant numeric js\"><span>5</span></span></span></div><div class=\"line\"><span class=\"source js\"><span class=\"meta brace curly js\"><span>}</span></span></span></div></pre>\n<p>encoding \u2192 issue</p>");
        });
      });
    });
    return describe("when maths rendering is enabled by default", function() {
      return it("notifies the user MathJax is loading when first preview is opened", function() {
        var workspaceElement;
        workspaceElement = [][0];
        preview.destroy();
        waitsForPromise(function() {
          return atom.packages.activatePackage('notifications');
        });
        runs(function() {
          workspaceElement = atom.views.getView(atom.workspace);
          return jasmine.attachToDOM(workspaceElement);
        });
        waitsForPromise(function() {
          return atom.workspace.open(filePath);
        });
        runs(function() {
          mathjaxHelper.resetMathJax();
          atom.config.set('markdown-preview-plus.enableLatexRenderingByDefault', true);
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        expectPreviewInSplitPane();
        waitsFor("notification", function() {
          return workspaceElement.querySelector('atom-notification');
        });
        return runs(function() {
          var notification;
          notification = workspaceElement.querySelector('atom-notification.info');
          return expect(notification).toExist();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24tcHJldmlldy1wbHVzL3NwZWMvbWFya2Rvd24tcHJldmlldy12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdGQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLDhCQUFSLENBSHRCLENBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLDJCQUFSLENBSmIsQ0FBQTs7QUFBQSxFQUtBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLHVCQUFSLENBTGhCLENBQUE7O0FBQUEsRUFNQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVIsQ0FOTixDQUFBOztBQUFBLEVBT0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxhQUFSLENBUGQsQ0FBQTs7QUFBQSxFQVNBLE9BQUEsQ0FBUSxlQUFSLENBVEEsQ0FBQTs7QUFBQSxFQVdBLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBLEdBQUE7QUFDOUIsUUFBQSxpREFBQTtBQUFBLElBQUEsT0FBc0IsRUFBdEIsRUFBQyxrQkFBRCxFQUFXLGlCQUFYLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBQSxDQUE4QixDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQWpDLENBQXlDLHNCQUF6QyxDQUFYLENBQUE7QUFBQSxNQUNBLE9BQUEsR0FBYyxJQUFBLG1CQUFBLENBQW9CO0FBQUEsUUFBQyxVQUFBLFFBQUQ7T0FBcEIsQ0FEZCxDQUFBO0FBQUEsTUFFQSxPQUFPLENBQUMsV0FBUixDQUFvQixPQUFPLENBQUMsT0FBNUIsQ0FGQSxDQUFBO0FBQUEsTUFJQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixlQUE5QixFQURjO01BQUEsQ0FBaEIsQ0FKQSxDQUFBO0FBQUEsTUFPQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixxQkFBOUIsRUFEYztNQUFBLENBQWhCLENBUEEsQ0FBQTtBQUFBLE1BVUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsdUJBQTlCLEVBRGM7TUFBQSxDQUFoQixDQVZBLENBQUE7YUFhQSxJQUFJLENBQUMsV0FBTCxDQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsU0FBQyxRQUFELEdBQUE7aUJBQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFaLENBQWtCLENBQWxCLEVBQXFCLFFBQVEsQ0FBQyxNQUE5QixDQUFBLEtBQXlDLFNBRDlCO1FBQUEsQ0FBYjtPQURGLEVBZFM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBb0JBLFNBQUEsQ0FBVSxTQUFBLEdBQUE7YUFDUixPQUFPLENBQUMsT0FBUixDQUFBLEVBRFE7SUFBQSxDQUFWLENBcEJBLENBQUE7QUFBQSxJQXVCQSx3QkFBQSxHQUEyQixTQUFBLEdBQUE7QUFDekIsTUFBQSxJQUFBLENBQUssU0FBQSxHQUFBO2VBQ0gsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBZixDQUFBLENBQVAsQ0FBaUMsQ0FBQyxZQUFsQyxDQUErQyxDQUEvQyxFQURHO01BQUEsQ0FBTCxDQUFBLENBQUE7QUFBQSxNQUdBLFFBQUEsQ0FBUyxnQ0FBVCxFQUEyQyxTQUFBLEdBQUE7ZUFDekMsT0FBQSxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBZixDQUFBLENBQTBCLENBQUEsQ0FBQSxDQUFFLENBQUMsYUFBN0IsQ0FBQSxFQUQrQjtNQUFBLENBQTNDLENBSEEsQ0FBQTthQU1BLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxRQUFBLE1BQUEsQ0FBTyxPQUFQLENBQWUsQ0FBQyxjQUFoQixDQUErQixtQkFBL0IsQ0FBQSxDQUFBO2VBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBUCxDQUF5QixDQUFDLElBQTFCLENBQStCLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWYsQ0FBQSxDQUFrQyxDQUFDLE9BQW5DLENBQUEsQ0FBL0IsRUFGRztNQUFBLENBQUwsRUFQeUI7SUFBQSxDQXZCM0IsQ0FBQTtBQUFBLElBa0NBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUEsR0FBQTthQWV4QixFQUFBLENBQUcsK0NBQUgsRUFBb0QsU0FBQSxHQUFBO0FBQ2xELFFBQUEsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsaUJBQWxCLENBQUEsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxPQUFPLENBQUMsSUFBUixDQUFBLENBQVAsQ0FBc0IsQ0FBQyxTQUF2QixDQUFpQyxRQUFqQyxFQUZrRDtNQUFBLENBQXBELEVBZndCO0lBQUEsQ0FBMUIsQ0FsQ0EsQ0FBQTtBQUFBLElBcURBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUEsR0FBQTtBQUN4QixVQUFBLFVBQUE7QUFBQSxNQUFBLFVBQUEsR0FBYSxJQUFiLENBQUE7QUFBQSxNQUVBLFNBQUEsQ0FBVSxTQUFBLEdBQUE7ZUFDUixVQUFVLENBQUMsT0FBWCxDQUFBLEVBRFE7TUFBQSxDQUFWLENBRkEsQ0FBQTtBQUFBLE1BS0EsRUFBQSxDQUFHLGlEQUFILEVBQXNELFNBQUEsR0FBQTtBQUNwRCxRQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQW5CLENBQStCLE9BQU8sQ0FBQyxTQUFSLENBQUEsQ0FBL0IsQ0FBYixDQUFBO0FBQUEsUUFDQSxPQUFPLENBQUMsV0FBUixDQUFvQixVQUFVLENBQUMsT0FBL0IsQ0FEQSxDQUFBO2VBRUEsTUFBQSxDQUFPLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBbEMsRUFIb0Q7TUFBQSxDQUF0RCxDQUxBLENBQUE7YUFVQSxFQUFBLENBQUcsb0RBQUgsRUFBeUQsU0FBQSxHQUFBO0FBQ3ZELFFBQUEsT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixjQUFwQixFQURjO1FBQUEsQ0FBaEIsQ0FGQSxDQUFBO2VBS0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFVBQUEsT0FBQSxHQUFjLElBQUEsbUJBQUEsQ0FBb0I7QUFBQSxZQUFDLFFBQUEsRUFBVSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBb0MsQ0FBQyxFQUFoRDtXQUFwQixDQUFkLENBQUE7QUFBQSxVQUVBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLE9BQU8sQ0FBQyxPQUE1QixDQUZBLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxPQUFPLENBQUMsT0FBUixDQUFBLENBQVAsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBb0MsQ0FBQyxPQUFyQyxDQUFBLENBQS9CLENBSEEsQ0FBQTtBQUFBLFVBS0EsVUFBQSxHQUFhLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBbkIsQ0FBK0IsT0FBTyxDQUFDLFNBQVIsQ0FBQSxDQUEvQixDQUxiLENBQUE7QUFBQSxVQU1BLE9BQU8sQ0FBQyxXQUFSLENBQW9CLFVBQVUsQ0FBQyxPQUEvQixDQU5BLENBQUE7aUJBT0EsTUFBQSxDQUFPLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBbEMsRUFSRztRQUFBLENBQUwsRUFOdUQ7TUFBQSxDQUF6RCxFQVh3QjtJQUFBLENBQTFCLENBckRBLENBQUE7QUFBQSxJQWdGQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBRTNCLE1BQUEsRUFBQSxDQUFHLCtDQUFILEVBQW9ELFNBQUEsR0FBQTtBQUVsRCxRQUFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUFHLE9BQU8sQ0FBQyxjQUFSLENBQUEsRUFBSDtRQUFBLENBQWhCLENBQUEsQ0FBQTtlQUVBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxjQUFBLFNBQUE7QUFBQSxVQUFBLFNBQUEsR0FBWSxPQUFPLENBQUMsSUFBUixDQUFhLElBQWIsQ0FBWixDQUFBO0FBQUEsVUFDQSxNQUFBLENBQU8sU0FBUCxDQUFpQixDQUFDLE9BQWxCLENBQUEsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sU0FBUyxDQUFDLE1BQWpCLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsQ0FBOUIsQ0FGQSxDQUFBO0FBQUEsVUFHQSxNQUFBLENBQU8sU0FBVSxDQUFBLENBQUEsQ0FBRSxDQUFDLFNBQXBCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MseUNBQXBDLENBSEEsQ0FBQTtpQkFJQSxNQUFBLENBQU8sU0FBVSxDQUFBLENBQUEsQ0FBRSxDQUFDLFNBQXBCLENBQThCLENBQUMsSUFBL0IsQ0FBb0Msc0NBQXBDLEVBTEc7UUFBQSxDQUFMLEVBSmtEO01BQUEsQ0FBcEQsQ0FBQSxDQUFBO2FBV0EsRUFBQSxDQUFHLCtDQUFILEVBQW9ELFNBQUEsR0FBQTtBQUNsRCxRQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEIsRUFBd0QsS0FBeEQsQ0FBQSxDQUFBO0FBQUEsUUFFQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFBRyxPQUFPLENBQUMsY0FBUixDQUFBLEVBQUg7UUFBQSxDQUFoQixDQUZBLENBQUE7ZUFJQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsY0FBQSxTQUFBO0FBQUEsVUFBQSxTQUFBLEdBQVksT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFiLENBQVosQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLFNBQVAsQ0FBaUIsQ0FBQyxPQUFsQixDQUFBLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBQSxDQUFPLFNBQVMsQ0FBQyxNQUFqQixDQUF3QixDQUFDLElBQXpCLENBQThCLENBQTlCLENBRkEsQ0FBQTtpQkFHQSxNQUFBLENBQU8sU0FBVSxDQUFBLENBQUEsQ0FBRSxDQUFDLFNBQXBCLENBQThCLENBQUMsSUFBL0IsQ0FBb0Msc0NBQXBDLEVBSkc7UUFBQSxDQUFMLEVBTGtEO01BQUEsQ0FBcEQsRUFiMkI7SUFBQSxDQUE3QixDQWhGQSxDQUFBO0FBQUEsSUF5R0EsUUFBQSxDQUFTLGdEQUFULEVBQTJELFNBQUEsR0FBQTtBQUN6RCxNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxPQUFPLENBQUMsY0FBUixDQUFBLEVBRGM7UUFBQSxDQUFoQixFQURTO01BQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxNQUlBLEVBQUEsQ0FBRyxrREFBSCxFQUF1RCxTQUFBLEdBQUE7QUFDckQsWUFBQSxtQkFBQTtBQUFBLFFBQUEsTUFBQSxHQUFTLE9BQU8sQ0FBQyxJQUFSLENBQWEsMERBQWIsQ0FBVCxDQUFBO0FBQUEsUUFDQSxXQUFBLEdBQWMsTUFBTyxDQUFBLENBQUEsQ0FBRSxDQUFDLFFBQVYsQ0FBQSxDQUFvQixDQUFDLGNBQXJCLENBQW9DO0FBQUEsVUFBQSxPQUFBLEVBQU8sYUFBUDtBQUFBLFVBQXNCLElBQUEsRUFBTSxNQUE1QjtTQUFwQyxDQURkLENBQUE7ZUFFQSxNQUFBLENBQU8sV0FBVyxDQUFDLE1BQW5CLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsQ0FBaEMsRUFIcUQ7TUFBQSxDQUF2RCxDQUpBLENBQUE7QUFBQSxNQVNBLFFBQUEsQ0FBUyx5REFBVCxFQUFvRSxTQUFBLEdBQUE7ZUFDbEUsRUFBQSxDQUFHLDZDQUFILEVBQWtELFNBQUEsR0FBQTtBQUNoRCxjQUFBLG9CQUFBO0FBQUEsVUFBQSxVQUFBLEdBQWEsT0FBTyxDQUFDLElBQVIsQ0FBYSw4Q0FBYixDQUFiLENBQUE7QUFBQSxVQUNBLE1BQUEsQ0FBTyxVQUFQLENBQWtCLENBQUMsT0FBbkIsQ0FBQSxDQURBLENBQUE7QUFBQSxVQUVBLE1BQUEsQ0FBTyxVQUFXLENBQUEsQ0FBQSxDQUFFLENBQUMsUUFBZCxDQUFBLENBQXdCLENBQUMsT0FBekIsQ0FBQSxDQUFQLENBQTBDLENBQUMsSUFBM0MsQ0FBZ0Qsd0JBQWhELENBRkEsQ0FBQTtBQUFBLFVBU0EsUUFBQSxHQUFXLE9BQU8sQ0FBQyxJQUFSLENBQWEsNENBQWIsQ0FUWCxDQUFBO0FBQUEsVUFVQSxNQUFBLENBQU8sUUFBUCxDQUFnQixDQUFDLE9BQWpCLENBQUEsQ0FWQSxDQUFBO2lCQVdBLE1BQUEsQ0FBTyxRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUMsUUFBWixDQUFBLENBQXNCLENBQUMsT0FBdkIsQ0FBQSxDQUFQLENBQXdDLENBQUMsSUFBekMsQ0FBOEMsMEJBQTlDLEVBWmdEO1FBQUEsQ0FBbEQsRUFEa0U7TUFBQSxDQUFwRSxDQVRBLENBQUE7YUE0QkEsUUFBQSxDQUFTLGtFQUFULEVBQTZFLFNBQUEsR0FBQTtlQUMzRSxFQUFBLENBQUcsb0NBQUgsRUFBeUMsU0FBQSxHQUFBO0FBQ3ZDLGNBQUEsV0FBQTtBQUFBLFVBQUEsV0FBQSxHQUFjLE9BQU8sQ0FBQyxJQUFSLENBQWEsMERBQWIsQ0FBZCxDQUFBO0FBQUEsVUFDQSxNQUFBLENBQU8sV0FBUCxDQUFtQixDQUFDLE9BQXBCLENBQUEsQ0FEQSxDQUFBO2lCQUVBLE1BQUEsQ0FBTyxXQUFZLENBQUEsQ0FBQSxDQUFFLENBQUMsUUFBZixDQUFBLENBQXlCLENBQUMsT0FBMUIsQ0FBQSxDQUFQLENBQTJDLENBQUMsSUFBNUMsQ0FBaUQsbUNBQWpELEVBSHVDO1FBQUEsQ0FBekMsRUFEMkU7TUFBQSxDQUE3RSxFQTdCeUQ7SUFBQSxDQUEzRCxDQXpHQSxDQUFBO0FBQUEsSUFnSkEsUUFBQSxDQUFTLGlCQUFULEVBQTRCLFNBQUEsR0FBQTtBQUMxQixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLEtBQUEsQ0FBTSxVQUFOLEVBQWtCLFFBQWxCLENBQTJCLENBQUMsY0FBNUIsQ0FBQSxDQUFBLENBQUE7ZUFDQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxPQUFPLENBQUMsY0FBUixDQUFBLEVBRGM7UUFBQSxDQUFoQixFQUZTO01BQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxNQUtBLFFBQUEsQ0FBUyxxQ0FBVCxFQUFnRCxTQUFBLEdBQUE7ZUFDOUMsRUFBQSxDQUFHLHlDQUFILEVBQThDLFNBQUEsR0FBQTtBQUM1QyxjQUFBLEtBQUE7QUFBQSxVQUFBLEtBQUEsR0FBUSxPQUFPLENBQUMsSUFBUixDQUFhLGlCQUFiLENBQVIsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLFVBQVUsQ0FBQyxNQUFsQixDQUF5QixDQUFDLGdCQUExQixDQUFBLENBREEsQ0FBQTtpQkFFQSxNQUFBLENBQU8sS0FBSyxDQUFDLElBQU4sQ0FBVyxLQUFYLENBQVAsQ0FBeUIsQ0FBQyxXQUExQixDQUFzQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBQSxDQUE4QixDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQWpDLENBQXlDLG1CQUF6QyxDQUF0QyxFQUg0QztRQUFBLENBQTlDLEVBRDhDO01BQUEsQ0FBaEQsQ0FMQSxDQUFBO0FBQUEsTUFXQSxRQUFBLENBQVMsMERBQVQsRUFBcUUsU0FBQSxHQUFBO2VBQ25FLEVBQUEsQ0FBRyxpREFBSCxFQUFzRCxTQUFBLEdBQUE7QUFDcEQsY0FBQSxLQUFBO0FBQUEsVUFBQSxLQUFBLEdBQVEsT0FBTyxDQUFDLElBQVIsQ0FBYSxpQkFBYixDQUFSLENBQUE7QUFBQSxVQUNBLE1BQUEsQ0FBTyxVQUFVLENBQUMsTUFBbEIsQ0FBeUIsQ0FBQyxnQkFBMUIsQ0FBQSxDQURBLENBQUE7aUJBRUEsTUFBQSxDQUFPLEtBQUssQ0FBQyxJQUFOLENBQVcsS0FBWCxDQUFQLENBQXlCLENBQUMsV0FBMUIsQ0FBc0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQUEsQ0FBOEIsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFqQyxDQUF5QyxnQkFBekMsQ0FBdEMsRUFIb0Q7UUFBQSxDQUF0RCxFQURtRTtNQUFBLENBQXJFLENBWEEsQ0FBQTtBQUFBLE1BaUJBLFFBQUEsQ0FBUyxrREFBVCxFQUE2RCxTQUFBLEdBQUE7ZUFDM0QsRUFBQSxDQUFHLHlCQUFILEVBQThCLFNBQUEsR0FBQTtBQUM1QixVQUFBLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBQSxDQUFBO0FBQUEsVUFFQSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsU0FBTCxDQUFlLE1BQWYsQ0FBVixFQUFrQyxRQUFsQyxDQUZYLENBQUE7QUFBQSxVQUdBLEVBQUUsQ0FBQyxhQUFILENBQWlCLFFBQWpCLEVBQTRCLGNBQUEsR0FBYyxRQUFkLEdBQXVCLEdBQW5ELENBSEEsQ0FBQTtBQUFBLFVBSUEsT0FBQSxHQUFjLElBQUEsbUJBQUEsQ0FBb0I7QUFBQSxZQUFDLFVBQUEsUUFBRDtXQUFwQixDQUpkLENBQUE7QUFBQSxVQUtBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLE9BQU8sQ0FBQyxPQUE1QixDQUxBLENBQUE7QUFBQSxVQU9BLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO21CQUNkLE9BQU8sQ0FBQyxjQUFSLENBQUEsRUFEYztVQUFBLENBQWhCLENBUEEsQ0FBQTtpQkFVQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsWUFBQSxNQUFBLENBQU8sVUFBVSxDQUFDLE1BQWxCLENBQXlCLENBQUMsZ0JBQTFCLENBQUEsQ0FBQSxDQUFBO21CQUNBLE1BQUEsQ0FBTyxPQUFPLENBQUMsSUFBUixDQUFhLG1CQUFiLENBQWlDLENBQUMsSUFBbEMsQ0FBdUMsS0FBdkMsQ0FBUCxDQUFxRCxDQUFDLFdBQXRELENBQWtFLEVBQUEsR0FBRyxRQUFILEdBQVksS0FBOUUsRUFGRztVQUFBLENBQUwsRUFYNEI7UUFBQSxDQUE5QixFQUQyRDtNQUFBLENBQTdELENBakJBLENBQUE7YUFpQ0EsUUFBQSxDQUFTLCtCQUFULEVBQTBDLFNBQUEsR0FBQTtlQUN4QyxFQUFBLENBQUcsd0JBQUgsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLGNBQUEsS0FBQTtBQUFBLFVBQUEsS0FBQSxHQUFRLE9BQU8sQ0FBQyxJQUFSLENBQWEsaUJBQWIsQ0FBUixDQUFBO0FBQUEsVUFDQSxNQUFBLENBQU8sVUFBVSxDQUFDLE1BQWxCLENBQXlCLENBQUMsZ0JBQTFCLENBQUEsQ0FEQSxDQUFBO2lCQUVBLE1BQUEsQ0FBTyxLQUFLLENBQUMsSUFBTixDQUFXLEtBQVgsQ0FBUCxDQUF5QixDQUFDLElBQTFCLENBQStCLHlGQUEvQixFQUgyQjtRQUFBLENBQTdCLEVBRHdDO01BQUEsQ0FBMUMsRUFsQzBCO0lBQUEsQ0FBNUIsQ0FoSkEsQ0FBQTtBQUFBLElBd0xBLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBLEdBQUE7QUFDN0IsVUFBQSwyREFBQTtBQUFBLE1BQUEsUUFBa0QsRUFBbEQsRUFBQyxrQkFBRCxFQUFVLG1CQUFWLEVBQW9CLG1CQUFwQixFQUE4QiwyQkFBOUIsQ0FBQTtBQUFBLE1BRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUVBLE9BQU8sQ0FBQyxZQUFSLENBQUEsQ0FGQSxDQUFBO0FBQUEsUUFJQSxPQUFBLEdBQVksSUFBSSxDQUFDLFNBQUwsQ0FBZSxNQUFmLENBSlosQ0FBQTtBQUFBLFFBS0EsUUFBQSxHQUFZLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBVixFQUFtQix1QkFBbkIsQ0FMWixDQUFBO0FBQUEsUUFNQSxRQUFBLEdBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLEVBQW1CLFVBQW5CLENBTlosQ0FBQTtBQUFBLFFBUUEsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsUUFBakIsRUFBNEIsVUFBQSxHQUFVLFFBQVYsR0FBbUIsR0FBL0MsQ0FSQSxDQUFBO0FBQUEsUUFTQSxFQUFFLENBQUMsYUFBSCxDQUFpQixRQUFqQixFQUEyQiw2Q0FBM0IsQ0FUQSxDQUFBO0FBQUEsUUFXQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBWG5CLENBQUE7QUFBQSxRQVlBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQixDQVpBLENBQUE7ZUFjQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsdUJBQTlCLEVBRGM7UUFBQSxDQUFoQixFQWZTO01BQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxNQW9CQSxlQUFBLEdBQWtCLFNBQUMsU0FBRCxFQUFZLFFBQVosR0FBQTtBQUNoQixZQUFBLHFCQUFBO0FBQUEsUUFBQSxNQUFBLENBQU8sUUFBUCxDQUFnQixDQUFDLFdBQWpCLENBQTZCLEVBQUEsR0FBRyxTQUFILEdBQWEsS0FBMUMsQ0FBQSxDQUFBO0FBQUEsUUFDQSxXQUFBLEdBQWMsR0FBRyxDQUFDLEtBQUosQ0FBVSxRQUFWLENBQW1CLENBQUMsS0FEbEMsQ0FBQTtBQUFBLFFBRUEsUUFBQSxHQUFjLFdBQVcsQ0FBQyxLQUFaLENBQWtCLFdBQWxCLENBRmQsQ0FBQTtlQUdBLFFBQVEsQ0FBQyxFQUpPO01BQUEsQ0FwQmxCLENBQUE7QUFBQSxNQTBCQSxRQUFBLENBQVMsaUNBQVQsRUFBNEMsU0FBQSxHQUFBO2VBQzFDLEVBQUEsQ0FBRyxtQ0FBSCxFQUF3QyxTQUFBLEdBQUE7QUFDdEMsVUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTttQkFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsUUFBcEIsRUFBSDtVQUFBLENBQWhCLENBQUEsQ0FBQTtBQUFBLFVBQ0EsSUFBQSxDQUFLLFNBQUEsR0FBQTttQkFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDhCQUF6QyxFQUFIO1VBQUEsQ0FBTCxDQURBLENBQUE7QUFBQSxVQUVBLHdCQUFBLENBQUEsQ0FGQSxDQUFBO2lCQUlBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxnQkFBQSxrQkFBQTtBQUFBLFlBQUEsUUFBQSxHQUFXLE9BQU8sQ0FBQyxJQUFSLENBQWEsZUFBYixDQUE2QixDQUFDLElBQTlCLENBQW1DLEtBQW5DLENBQVgsQ0FBQTtBQUFBLFlBQ0EsUUFBQSxHQUFXLGVBQUEsQ0FBZ0IsUUFBaEIsRUFBMEIsUUFBMUIsQ0FEWCxDQUFBO21CQUVBLE1BQUEsQ0FBTyxRQUFQLENBQWdCLENBQUMsR0FBRyxDQUFDLE9BQXJCLENBQTZCLFNBQTdCLEVBSEc7VUFBQSxDQUFMLEVBTHNDO1FBQUEsQ0FBeEMsRUFEMEM7TUFBQSxDQUE1QyxDQTFCQSxDQUFBO0FBQUEsTUFxQ0EsUUFBQSxDQUFTLDZEQUFULEVBQXdFLFNBQUEsR0FBQTtlQUN0RSxFQUFBLENBQUcsd0RBQUgsRUFBNkQsU0FBQSxHQUFBO0FBQzNELGNBQUEseUJBQUE7QUFBQSxVQUFBLFFBQXVCLEVBQXZCLEVBQUMsbUJBQUQsRUFBVyxtQkFBWCxDQUFBO0FBQUEsVUFFQSxlQUFBLENBQWdCLFNBQUEsR0FBQTttQkFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsUUFBcEIsRUFBSDtVQUFBLENBQWhCLENBRkEsQ0FBQTtBQUFBLFVBR0EsSUFBQSxDQUFLLFNBQUEsR0FBQTttQkFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDhCQUF6QyxFQUFIO1VBQUEsQ0FBTCxDQUhBLENBQUE7QUFBQSxVQUlBLHdCQUFBLENBQUEsQ0FKQSxDQUFBO0FBQUEsVUFNQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsWUFBQSxRQUFBLEdBQVcsT0FBTyxDQUFDLElBQVIsQ0FBYSxlQUFiLENBQTZCLENBQUMsSUFBOUIsQ0FBbUMsS0FBbkMsQ0FBWCxDQUFBO0FBQUEsWUFDQSxRQUFBLEdBQVcsZUFBQSxDQUFnQixRQUFoQixFQUEwQixRQUExQixDQURYLENBQUE7QUFBQSxZQUVBLE1BQUEsQ0FBTyxRQUFQLENBQWdCLENBQUMsR0FBRyxDQUFDLE9BQXJCLENBQTZCLFNBQTdCLENBRkEsQ0FBQTttQkFJQSxFQUFFLENBQUMsYUFBSCxDQUFpQixRQUFqQixFQUEyQiw0QkFBM0IsRUFMRztVQUFBLENBQUwsQ0FOQSxDQUFBO0FBQUEsVUFhQSxRQUFBLENBQVMsK0JBQVQsRUFBMEMsU0FBQSxHQUFBO0FBQ3hDLFlBQUEsUUFBQSxHQUFXLE9BQU8sQ0FBQyxJQUFSLENBQWEsZUFBYixDQUE2QixDQUFDLElBQTlCLENBQW1DLEtBQW5DLENBQVgsQ0FBQTttQkFDQSxDQUFBLFFBQVksQ0FBQyxRQUFULENBQWtCLFFBQWxCLEVBRm9DO1VBQUEsQ0FBMUMsQ0FiQSxDQUFBO2lCQWlCQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsZ0JBQUEsV0FBQTtBQUFBLFlBQUEsV0FBQSxHQUFjLGVBQUEsQ0FBZ0IsUUFBaEIsRUFBMEIsUUFBMUIsQ0FBZCxDQUFBO0FBQUEsWUFDQSxNQUFBLENBQU8sV0FBUCxDQUFtQixDQUFDLEdBQUcsQ0FBQyxPQUF4QixDQUFnQyxTQUFoQyxDQURBLENBQUE7bUJBRUEsTUFBQSxDQUFPLFFBQUEsQ0FBUyxXQUFULENBQVAsQ0FBNkIsQ0FBQyxlQUE5QixDQUE4QyxRQUFBLENBQVMsUUFBVCxDQUE5QyxFQUhHO1VBQUEsQ0FBTCxFQWxCMkQ7UUFBQSxDQUE3RCxFQURzRTtNQUFBLENBQXhFLENBckNBLENBQUE7QUFBQSxNQTZEQSxRQUFBLENBQVMsa0VBQVQsRUFBNkUsU0FBQSxHQUFBO2VBQzNFLEVBQUEsQ0FBRyx3RUFBSCxFQUE2RSxTQUFBLEdBQUE7QUFDM0UsY0FBQSxxSUFBQTtBQUFBLFVBQUEsUUFBdUIsRUFBdkIsRUFBQyxtQkFBRCxFQUFXLG1CQUFYLENBQUE7QUFBQSxVQUNBLFFBQThCLEVBQTlCLEVBQUMsa0JBQUQsRUFBVSxrQkFBVixFQUFtQixrQkFEbkIsQ0FBQTtBQUFBLFVBRUEsUUFBOEIsRUFBOUIsRUFBQyxrQkFBRCxFQUFVLGtCQUFWLEVBQW1CLGtCQUZuQixDQUFBO0FBQUEsVUFJQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsWUFBQSxPQUFPLENBQUMsT0FBUixDQUFBLENBQUEsQ0FBQTtBQUFBLFlBRUEsUUFBQSxHQUFZLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBVixFQUFtQixVQUFuQixDQUZaLENBQUE7QUFBQSxZQUdBLFFBQUEsR0FBWSxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsRUFBbUIsVUFBbkIsQ0FIWixDQUFBO0FBQUEsWUFLQSxFQUFFLENBQUMsYUFBSCxDQUFpQixRQUFqQixFQUEyQix5QkFBM0IsQ0FMQSxDQUFBO0FBQUEsWUFNQSxFQUFFLENBQUMsYUFBSCxDQUFpQixRQUFqQixFQUEyQixpQkFBM0IsQ0FOQSxDQUFBO21CQU9BLEVBQUUsQ0FBQyxhQUFILENBQWlCLFFBQWpCLEVBQ1YsVUFBQSxHQUFVLFFBQVYsR0FBbUIsYUFBbkIsR0FBK0IsUUFBL0IsR0FDTyxhQURQLEdBQ21CLFFBRG5CLEdBQzRCLEdBRmxCLEVBUkc7VUFBQSxDQUFMLENBSkEsQ0FBQTtBQUFBLFVBa0JBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO21CQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixRQUFwQixFQUFIO1VBQUEsQ0FBaEIsQ0FsQkEsQ0FBQTtBQUFBLFVBbUJBLElBQUEsQ0FBSyxTQUFBLEdBQUE7bUJBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyw4QkFBekMsRUFBSDtVQUFBLENBQUwsQ0FuQkEsQ0FBQTtBQUFBLFVBb0JBLHdCQUFBLENBQUEsQ0FwQkEsQ0FBQTtBQUFBLFVBc0JBLG1CQUFBLEdBQXNCLFNBQUEsR0FBQTtBQUNwQixtQkFBTyxDQUNMLE9BQU8sQ0FBQyxJQUFSLENBQWEsZUFBYixDQUE2QixDQUFDLElBQTlCLENBQW1DLEtBQW5DLENBREssRUFFTCxPQUFPLENBQUMsSUFBUixDQUFhLGVBQWIsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxLQUFuQyxDQUZLLEVBR0wsT0FBTyxDQUFDLElBQVIsQ0FBYSxlQUFiLENBQTZCLENBQUMsSUFBOUIsQ0FBbUMsS0FBbkMsQ0FISyxDQUFQLENBRG9CO1VBQUEsQ0F0QnRCLENBQUE7QUFBQSxVQTZCQSxpQkFBQSxHQUFvQixTQUFDLFdBQUQsR0FBQTtBQUNsQixnQkFBQSxLQUFBO0FBQUEsWUFBQSxRQUE4QixtQkFBQSxDQUFBLENBQTlCLEVBQUMsa0JBQUQsRUFBVSxrQkFBVixFQUFtQixrQkFBbkIsQ0FBQTtBQUNBLFlBQUEsSUFBRyx3QkFBSDtBQUNFLGNBQUEsTUFBQSxDQUFPLE9BQVAsQ0FBZSxDQUFDLFdBQWhCLENBQTRCLEVBQUEsR0FBRyxRQUFILEdBQVksS0FBeEMsQ0FBQSxDQUFBO0FBQUEsY0FDQSxNQUFBLENBQU8sT0FBUCxDQUFlLENBQUMsSUFBaEIsQ0FBcUIsRUFBQSxHQUFHLFFBQUgsR0FBWSxLQUFaLEdBQWlCLFdBQVcsQ0FBQyxJQUFsRCxDQURBLENBREY7YUFEQTtBQUlBLFlBQUEsSUFBRyx3QkFBSDtBQUNFLGNBQUEsTUFBQSxDQUFPLE9BQVAsQ0FBZSxDQUFDLFdBQWhCLENBQTRCLEVBQUEsR0FBRyxRQUFILEdBQVksS0FBeEMsQ0FBQSxDQUFBO0FBQUEsY0FDQSxNQUFBLENBQU8sT0FBUCxDQUFlLENBQUMsSUFBaEIsQ0FBcUIsRUFBQSxHQUFHLFFBQUgsR0FBWSxLQUFaLEdBQWlCLFdBQVcsQ0FBQyxJQUFsRCxDQURBLENBREY7YUFKQTtBQU9BLFlBQUEsSUFBRyx3QkFBSDtBQUNFLGNBQUEsTUFBQSxDQUFPLE9BQVAsQ0FBZSxDQUFDLFdBQWhCLENBQTRCLEVBQUEsR0FBRyxRQUFILEdBQVksS0FBeEMsQ0FBQSxDQUFBO3FCQUNBLE1BQUEsQ0FBTyxPQUFQLENBQWUsQ0FBQyxJQUFoQixDQUFxQixFQUFBLEdBQUcsUUFBSCxHQUFZLEtBQVosR0FBaUIsV0FBVyxDQUFDLElBQWxELEVBRkY7YUFSa0I7VUFBQSxDQTdCcEIsQ0FBQTtBQUFBLFVBeUNBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxnQkFBQSxLQUFBO0FBQUEsWUFBQSxRQUE4QixtQkFBQSxDQUFBLENBQTlCLEVBQUMsa0JBQUQsRUFBVSxrQkFBVixFQUFtQixrQkFBbkIsQ0FBQTtBQUFBLFlBRUEsT0FBQSxHQUFVLGVBQUEsQ0FBZ0IsUUFBaEIsRUFBMEIsT0FBMUIsQ0FGVixDQUFBO0FBQUEsWUFHQSxPQUFBLEdBQVUsZUFBQSxDQUFnQixRQUFoQixFQUEwQixPQUExQixDQUhWLENBQUE7QUFBQSxZQUlBLE9BQUEsR0FBVSxlQUFBLENBQWdCLFFBQWhCLEVBQTBCLE9BQTFCLENBSlYsQ0FBQTttQkFNQSxFQUFFLENBQUMsYUFBSCxDQUFpQixRQUFqQixFQUEyQiw0QkFBM0IsRUFQRztVQUFBLENBQUwsQ0F6Q0EsQ0FBQTtBQUFBLFVBa0RBLFFBQUEsQ0FBUyw4QkFBVCxFQUF5QyxTQUFBLEdBQUE7QUFDdkMsWUFBQSxPQUFBLEdBQVUsT0FBTyxDQUFDLElBQVIsQ0FBYSxlQUFiLENBQTZCLENBQUMsSUFBOUIsQ0FBbUMsS0FBbkMsQ0FBVixDQUFBO21CQUNBLENBQUEsT0FBVyxDQUFDLFFBQVIsQ0FBaUIsT0FBakIsRUFGbUM7VUFBQSxDQUF6QyxDQWxEQSxDQUFBO0FBQUEsVUFzREEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGdCQUFBLFVBQUE7QUFBQSxZQUFBLGlCQUFBLENBQ0U7QUFBQSxjQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsY0FDQSxJQUFBLEVBQU0sT0FETjthQURGLENBQUEsQ0FBQTtBQUFBLFlBSUEsVUFBQSxHQUFhLGVBQUEsQ0FBZ0IsUUFBaEIsRUFBMEIsT0FBMUIsQ0FKYixDQUFBO0FBQUEsWUFLQSxNQUFBLENBQU8sVUFBUCxDQUFrQixDQUFDLEdBQUcsQ0FBQyxPQUF2QixDQUErQixTQUEvQixDQUxBLENBQUE7QUFBQSxZQU1BLE1BQUEsQ0FBTyxRQUFBLENBQVMsVUFBVCxDQUFQLENBQTRCLENBQUMsZUFBN0IsQ0FBNkMsUUFBQSxDQUFTLE9BQVQsQ0FBN0MsQ0FOQSxDQUFBO0FBQUEsWUFPQSxPQUFBLEdBQVUsVUFQVixDQUFBO21CQVNBLEVBQUUsQ0FBQyxhQUFILENBQWlCLFFBQWpCLEVBQTJCLG1DQUEzQixFQVZHO1VBQUEsQ0FBTCxDQXREQSxDQUFBO0FBQUEsVUFrRUEsUUFBQSxDQUFTLDhCQUFULEVBQXlDLFNBQUEsR0FBQTtBQUN2QyxZQUFBLE9BQUEsR0FBVSxPQUFPLENBQUMsSUFBUixDQUFhLGVBQWIsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxLQUFuQyxDQUFWLENBQUE7bUJBQ0EsQ0FBQSxPQUFXLENBQUMsUUFBUixDQUFpQixPQUFqQixFQUZtQztVQUFBLENBQXpDLENBbEVBLENBQUE7QUFBQSxVQXNFQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsZ0JBQUEsVUFBQTtBQUFBLFlBQUEsaUJBQUEsQ0FDRTtBQUFBLGNBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxjQUNBLElBQUEsRUFBTSxPQUROO2FBREYsQ0FBQSxDQUFBO0FBQUEsWUFJQSxVQUFBLEdBQWEsZUFBQSxDQUFnQixRQUFoQixFQUEwQixPQUExQixDQUpiLENBQUE7QUFBQSxZQUtBLE1BQUEsQ0FBTyxVQUFQLENBQWtCLENBQUMsR0FBRyxDQUFDLE9BQXZCLENBQStCLFNBQS9CLENBTEEsQ0FBQTtBQUFBLFlBTUEsTUFBQSxDQUFPLFFBQUEsQ0FBUyxVQUFULENBQVAsQ0FBNEIsQ0FBQyxlQUE3QixDQUE2QyxRQUFBLENBQVMsT0FBVCxDQUE3QyxDQU5BLENBQUE7QUFBQSxZQU9BLE9BQUEsR0FBVSxVQVBWLENBQUE7bUJBU0EsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsUUFBakIsRUFBMkIscUNBQTNCLEVBVkc7VUFBQSxDQUFMLENBdEVBLENBQUE7QUFBQSxVQWtGQSxRQUFBLENBQVMsOEJBQVQsRUFBeUMsU0FBQSxHQUFBO0FBQ3ZDLFlBQUEsT0FBQSxHQUFVLE9BQU8sQ0FBQyxJQUFSLENBQWEsZUFBYixDQUE2QixDQUFDLElBQTlCLENBQW1DLEtBQW5DLENBQVYsQ0FBQTttQkFDQSxDQUFBLE9BQVcsQ0FBQyxRQUFSLENBQWlCLE9BQWpCLEVBRm1DO1VBQUEsQ0FBekMsQ0FsRkEsQ0FBQTtpQkFzRkEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGdCQUFBLFVBQUE7QUFBQSxZQUFBLGlCQUFBLENBQ0U7QUFBQSxjQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsY0FDQSxJQUFBLEVBQU0sT0FETjthQURGLENBQUEsQ0FBQTtBQUFBLFlBSUEsVUFBQSxHQUFjLGVBQUEsQ0FBZ0IsUUFBaEIsRUFBMEIsT0FBMUIsQ0FKZCxDQUFBO0FBQUEsWUFLQSxNQUFBLENBQU8sVUFBUCxDQUFrQixDQUFDLEdBQUcsQ0FBQyxPQUF2QixDQUErQixTQUEvQixDQUxBLENBQUE7bUJBTUEsTUFBQSxDQUFPLFFBQUEsQ0FBUyxVQUFULENBQVAsQ0FBNEIsQ0FBQyxlQUE3QixDQUE2QyxRQUFBLENBQVMsT0FBVCxDQUE3QyxFQVBHO1VBQUEsQ0FBTCxFQXZGMkU7UUFBQSxDQUE3RSxFQUQyRTtNQUFBLENBQTdFLENBN0RBLENBQUE7QUFBQSxNQThKQSxRQUFBLENBQVMsaURBQVQsRUFBNEQsU0FBQSxHQUFBO2VBQzFELEVBQUEsQ0FBRyx5RUFBSCxFQUE4RSxTQUFBLEdBQUE7QUFDNUUsY0FBQSx5QkFBQTtBQUFBLFVBQUEsUUFBdUIsRUFBdkIsRUFBQyxtQkFBRCxFQUFXLG1CQUFYLENBQUE7QUFBQSxVQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO21CQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixRQUFwQixFQUFIO1VBQUEsQ0FBaEIsQ0FGQSxDQUFBO0FBQUEsVUFHQSxJQUFBLENBQUssU0FBQSxHQUFBO21CQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsOEJBQXpDLEVBQUg7VUFBQSxDQUFMLENBSEEsQ0FBQTtBQUFBLFVBSUEsd0JBQUEsQ0FBQSxDQUpBLENBQUE7QUFBQSxVQU1BLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxZQUFBLFFBQUEsR0FBVyxPQUFPLENBQUMsSUFBUixDQUFhLGVBQWIsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxLQUFuQyxDQUFYLENBQUE7QUFBQSxZQUNBLFFBQUEsR0FBVyxlQUFBLENBQWdCLFFBQWhCLEVBQTBCLFFBQTFCLENBRFgsQ0FBQTtBQUFBLFlBRUEsTUFBQSxDQUFPLFFBQVAsQ0FBZ0IsQ0FBQyxHQUFHLENBQUMsT0FBckIsQ0FBNkIsU0FBN0IsQ0FGQSxDQUFBO21CQUlBLEVBQUUsQ0FBQyxVQUFILENBQWMsUUFBZCxFQUxHO1VBQUEsQ0FBTCxDQU5BLENBQUE7QUFBQSxVQWFBLFFBQUEsQ0FBUywrQkFBVCxFQUEwQyxTQUFBLEdBQUE7QUFDeEMsWUFBQSxRQUFBLEdBQVcsT0FBTyxDQUFDLElBQVIsQ0FBYSxlQUFiLENBQTZCLENBQUMsSUFBOUIsQ0FBbUMsS0FBbkMsQ0FBWCxDQUFBO21CQUNBLENBQUEsUUFBWSxDQUFDLFFBQVQsQ0FBa0IsUUFBbEIsRUFGb0M7VUFBQSxDQUExQyxDQWJBLENBQUE7QUFBQSxVQWlCQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsWUFBQSxNQUFBLENBQU8sUUFBUCxDQUFnQixDQUFDLElBQWpCLENBQXNCLFFBQXRCLENBQUEsQ0FBQTtBQUFBLFlBQ0EsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsUUFBakIsRUFBMkIsNkNBQTNCLENBREEsQ0FBQTttQkFFQSxPQUFPLENBQUMsY0FBUixDQUFBLEVBSEc7VUFBQSxDQUFMLENBakJBLENBQUE7QUFBQSxVQXNCQSxRQUFBLENBQVMsK0JBQVQsRUFBMEMsU0FBQSxHQUFBO0FBQ3hDLFlBQUEsUUFBQSxHQUFXLE9BQU8sQ0FBQyxJQUFSLENBQWEsZUFBYixDQUE2QixDQUFDLElBQTlCLENBQW1DLEtBQW5DLENBQVgsQ0FBQTttQkFDQSxRQUFBLEtBQWMsU0FGMEI7VUFBQSxDQUExQyxDQXRCQSxDQUFBO2lCQTBCQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsZ0JBQUEsV0FBQTtBQUFBLFlBQUEsV0FBQSxHQUFjLGVBQUEsQ0FBZ0IsUUFBaEIsRUFBMEIsUUFBMUIsQ0FBZCxDQUFBO21CQUNBLE1BQUEsQ0FBTyxRQUFBLENBQVMsV0FBVCxDQUFQLENBQTZCLENBQUMsZUFBOUIsQ0FBOEMsUUFBQSxDQUFTLFFBQVQsQ0FBOUMsRUFGRztVQUFBLENBQUwsRUEzQjRFO1FBQUEsQ0FBOUUsRUFEMEQ7TUFBQSxDQUE1RCxDQTlKQSxDQUFBO2FBOExBLFFBQUEsQ0FBUyw0RUFBVCxFQUF1RixTQUFBLEdBQUE7ZUFDckYsRUFBQSxDQUFHLHlFQUFILEVBQThFLFNBQUEsR0FBQTtBQUM1RSxjQUFBLHlCQUFBO0FBQUEsVUFBQSxRQUF1QixFQUF2QixFQUFDLG1CQUFELEVBQVcsbUJBQVgsQ0FBQTtBQUFBLFVBRUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFFBQXBCLEVBQUg7VUFBQSxDQUFoQixDQUZBLENBQUE7QUFBQSxVQUdBLElBQUEsQ0FBSyxTQUFBLEdBQUE7bUJBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyw4QkFBekMsRUFBSDtVQUFBLENBQUwsQ0FIQSxDQUFBO0FBQUEsVUFJQSx3QkFBQSxDQUFBLENBSkEsQ0FBQTtBQUFBLFVBTUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFlBQUEsUUFBQSxHQUFXLE9BQU8sQ0FBQyxJQUFSLENBQWEsZUFBYixDQUE2QixDQUFDLElBQTlCLENBQW1DLEtBQW5DLENBQVgsQ0FBQTtBQUFBLFlBQ0EsUUFBQSxHQUFXLGVBQUEsQ0FBZ0IsUUFBaEIsRUFBMEIsUUFBMUIsQ0FEWCxDQUFBO0FBQUEsWUFFQSxNQUFBLENBQU8sUUFBUCxDQUFnQixDQUFDLEdBQUcsQ0FBQyxPQUFyQixDQUE2QixTQUE3QixDQUZBLENBQUE7bUJBSUEsRUFBRSxDQUFDLFVBQUgsQ0FBYyxRQUFkLEVBQXdCLFFBQUEsR0FBVyxNQUFuQyxFQUxHO1VBQUEsQ0FBTCxDQU5BLENBQUE7QUFBQSxVQWFBLFFBQUEsQ0FBUywrQkFBVCxFQUEwQyxTQUFBLEdBQUE7QUFDeEMsWUFBQSxRQUFBLEdBQVcsT0FBTyxDQUFDLElBQVIsQ0FBYSxlQUFiLENBQTZCLENBQUMsSUFBOUIsQ0FBbUMsS0FBbkMsQ0FBWCxDQUFBO21CQUNBLENBQUEsUUFBWSxDQUFDLFFBQVQsQ0FBa0IsUUFBbEIsRUFGb0M7VUFBQSxDQUExQyxDQWJBLENBQUE7QUFBQSxVQWlCQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsWUFBQSxNQUFBLENBQU8sUUFBUCxDQUFnQixDQUFDLElBQWpCLENBQXNCLFFBQXRCLENBQUEsQ0FBQTtBQUFBLFlBQ0EsRUFBRSxDQUFDLFVBQUgsQ0FBYyxRQUFBLEdBQVcsTUFBekIsRUFBaUMsUUFBakMsQ0FEQSxDQUFBO21CQUVBLE9BQU8sQ0FBQyxjQUFSLENBQUEsRUFIRztVQUFBLENBQUwsQ0FqQkEsQ0FBQTtBQUFBLFVBc0JBLFFBQUEsQ0FBUywrQkFBVCxFQUEwQyxTQUFBLEdBQUE7QUFDeEMsWUFBQSxRQUFBLEdBQVcsT0FBTyxDQUFDLElBQVIsQ0FBYSxlQUFiLENBQTZCLENBQUMsSUFBOUIsQ0FBbUMsS0FBbkMsQ0FBWCxDQUFBO21CQUNBLFFBQUEsS0FBYyxTQUYwQjtVQUFBLENBQTFDLENBdEJBLENBQUE7aUJBMEJBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxnQkFBQSxXQUFBO0FBQUEsWUFBQSxXQUFBLEdBQWMsZUFBQSxDQUFnQixRQUFoQixFQUEwQixRQUExQixDQUFkLENBQUE7bUJBQ0EsTUFBQSxDQUFPLFFBQUEsQ0FBUyxXQUFULENBQVAsQ0FBNkIsQ0FBQyxlQUE5QixDQUE4QyxRQUFBLENBQVMsUUFBVCxDQUE5QyxFQUZHO1VBQUEsQ0FBTCxFQTNCNEU7UUFBQSxDQUE5RSxFQURxRjtNQUFBLENBQXZGLEVBL0w2QjtJQUFBLENBQS9CLENBeExBLENBQUE7QUFBQSxJQXVaQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsTUFBQSxRQUFBLENBQVMsbUNBQVQsRUFBOEMsU0FBQSxHQUFBO2VBQzVDLEVBQUEsQ0FBRyxzQ0FBSCxFQUEyQyxTQUFBLEdBQUE7QUFDekMsVUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNENBQWhCLEVBQThELEtBQTlELENBQUEsQ0FBQTtBQUFBLFVBRUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsT0FBTyxDQUFDLGNBQVIsQ0FBQSxFQURjO1VBQUEsQ0FBaEIsQ0FGQSxDQUFBO2lCQUtBLElBQUEsQ0FBSyxTQUFBLEdBQUE7bUJBQ0gsTUFBQSxDQUFPLE9BQU8sQ0FBQyxJQUFSLENBQWEsaUJBQWIsQ0FBK0IsQ0FBQyxNQUF2QyxDQUE4QyxDQUFDLElBQS9DLENBQW9ELENBQXBELEVBREc7VUFBQSxDQUFMLEVBTnlDO1FBQUEsQ0FBM0MsRUFENEM7TUFBQSxDQUE5QyxDQUFBLENBQUE7YUFVQSxRQUFBLENBQVMsK0JBQVQsRUFBMEMsU0FBQSxHQUFBO2VBQ3hDLEVBQUEsQ0FBRyx5Q0FBSCxFQUE4QyxTQUFBLEdBQUE7QUFDNUMsVUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNENBQWhCLEVBQThELElBQTlELENBQUEsQ0FBQTtBQUFBLFVBRUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQ2QsT0FBTyxDQUFDLGNBQVIsQ0FBQSxFQURjO1VBQUEsQ0FBaEIsQ0FGQSxDQUFBO2lCQUtBLElBQUEsQ0FBSyxTQUFBLEdBQUE7bUJBQ0gsTUFBQSxDQUFPLE9BQU8sQ0FBQyxJQUFSLENBQWEsaUJBQWIsQ0FBK0IsQ0FBQyxNQUF2QyxDQUE4QyxDQUFDLElBQS9DLENBQW9ELENBQXBELEVBREc7VUFBQSxDQUFMLEVBTjRDO1FBQUEsQ0FBOUMsRUFEd0M7TUFBQSxDQUExQyxFQVh1QjtJQUFBLENBQXpCLENBdlpBLENBQUE7QUFBQSxJQTRhQSxRQUFBLENBQVMsZ0NBQVQsRUFBMkMsU0FBQSxHQUFBO0FBQ3pDLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUNBLFFBQUEsR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBQSxDQUE4QixDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQWpDLENBQXlDLHNCQUF6QyxDQURYLENBQUE7QUFBQSxRQUVBLE9BQUEsR0FBYyxJQUFBLG1CQUFBLENBQW9CO0FBQUEsVUFBQyxVQUFBLFFBQUQ7U0FBcEIsQ0FGZCxDQUFBO2VBR0EsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsT0FBTyxDQUFDLE9BQTVCLEVBSlM7TUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLE1BTUEsRUFBQSxDQUFHLHNDQUFILEVBQTJDLFNBQUEsR0FBQTtBQUN6QyxZQUFBLHFHQUFBO0FBQUEsUUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLElBQUwsQ0FBVTtBQUFBLFVBQUEsTUFBQSxFQUFRLE9BQVI7U0FBVixDQUFiLENBQUE7QUFBQSxRQUNBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYixDQUFBLENBQThCLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBakMsQ0FBeUMsaUJBQXpDLENBRG5CLENBQUE7QUFBQSxRQUVBLGNBQUEsR0FBaUIsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsZ0JBQWhCLENBQWlDLENBQUMsUUFBbEMsQ0FBQSxDQUZqQixDQUFBO0FBQUEsUUFJQSxVQUFBLEdBQWEsU0FBQyxRQUFELEVBQVcsR0FBWCxHQUFBO0FBQ1gsaUJBQU87QUFBQSxZQUNMLFlBQUEsRUFBYyxRQURUO0FBQUEsWUFFTCxPQUFBLEVBQVMsRUFBQSxHQUFHLFFBQUgsR0FBWSxHQUFaLEdBQWUsR0FGbkI7V0FBUCxDQURXO1FBQUEsQ0FKYixDQUFBO0FBQUEsUUFVQSxxQkFBQSxHQUF3QjtVQUN0QjtBQUFBLFlBQ0UsS0FBQSxFQUFPLENBQ0wsVUFBQSxDQUFXLG1CQUFYLEVBQWdDLG9CQUFoQyxDQURLLENBRFQ7V0FEc0IsRUFLbkI7QUFBQSxZQUNELEtBQUEsRUFBTyxDQUNMLFVBQUEsQ0FBVyxlQUFYLEVBQTRCLG1CQUE1QixDQURLLEVBRUwsVUFBQSxDQUFXLHlCQUFYLEVBQXNDLG9CQUF0QyxDQUZLLENBRE47V0FMbUI7U0FWeEIsQ0FBQTtBQUFBLFFBdUJBLG9CQUFBLEdBQXVCLENBQ3JCLHFGQURxQixFQUVyQixxREFGcUIsRUFHckIsdUZBSHFCLENBdkJ2QixDQUFBO0FBQUEsUUE2QkEsTUFBQSxDQUFPLEVBQUUsQ0FBQyxVQUFILENBQWMsVUFBZCxDQUFQLENBQWlDLENBQUMsSUFBbEMsQ0FBdUMsS0FBdkMsQ0E3QkEsQ0FBQTtBQUFBLFFBK0JBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLE9BQU8sQ0FBQyxjQUFSLENBQUEsRUFEYztRQUFBLENBQWhCLENBL0JBLENBQUE7QUFBQSxRQWtDQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsVUFBQSxLQUFBLENBQU0sSUFBTixFQUFZLG9CQUFaLENBQWlDLENBQUMsU0FBbEMsQ0FBNEMsVUFBNUMsQ0FBQSxDQUFBO0FBQUEsVUFDQSxLQUFBLENBQU0sT0FBTixFQUFlLHdCQUFmLENBQXdDLENBQUMsU0FBekMsQ0FBbUQscUJBQW5ELENBREEsQ0FBQTtBQUFBLFVBRUEsS0FBQSxDQUFNLE9BQU4sRUFBZSxxQkFBZixDQUFxQyxDQUFDLFNBQXRDLENBQWdELG9CQUFoRCxDQUZBLENBQUE7aUJBR0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLE9BQU8sQ0FBQyxPQUEvQixFQUF3QyxjQUF4QyxFQUpHO1FBQUEsQ0FBTCxDQWxDQSxDQUFBO0FBQUEsUUF3Q0EsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLGNBQUEsS0FBQTtpQkFBQSxFQUFFLENBQUMsVUFBSCxDQUFjLFVBQWQsQ0FBQSxtRUFBa0UsQ0FBRSxPQUF0QyxDQUFBLFdBQUEsS0FBbUQsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsVUFBaEIsRUFEMUU7UUFBQSxDQUFULENBeENBLENBQUE7ZUEyQ0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGNBQUEsU0FBQTtBQUFBLFVBQUEsTUFBQSxDQUFPLEVBQUUsQ0FBQyxVQUFILENBQWMsVUFBZCxDQUFQLENBQWlDLENBQUMsSUFBbEMsQ0FBdUMsSUFBdkMsQ0FBQSxDQUFBO0FBQUEsVUFDQSxTQUFBLEdBQVksSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQW9DLENBQUMsT0FBckMsQ0FBQSxDQUNWLENBQUMsT0FEUyxDQUNELHNDQURDLEVBQ3VDLG1DQUR2QyxDQUVWLENBQUMsT0FGUyxDQUVELG1CQUZDLEVBRW9CLFNBRnBCLENBRFosQ0FBQTtpQkFJQSxNQUFBLENBQU8sU0FBUCxDQUFpQixDQUFDLElBQWxCLENBQXVCLGNBQWMsQ0FBQyxPQUFmLENBQXVCLE9BQXZCLEVBQWdDLElBQWhDLENBQXZCLEVBTEc7UUFBQSxDQUFMLEVBNUN5QztNQUFBLENBQTNDLENBTkEsQ0FBQTthQXlEQSxRQUFBLENBQVMsOEJBQVQsRUFBeUMsU0FBQSxHQUFBO0FBRXZDLFlBQUEsZ0RBQUE7QUFBQSxRQUFDLGtCQUFtQixLQUFwQixDQUFBO0FBQUEsUUFFQSxlQUFBLEdBQWtCLGlEQUZsQixDQUFBO0FBQUEsUUFHQSxjQUFBLEdBQWtCLGlDQUhsQixDQUFBO0FBQUEsUUFLQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQVosQ0FBMEIsZUFBMUIsRUFDRTtBQUFBLFlBQUEsT0FBQSxFQUFTLGtCQUFUO1dBREYsQ0FBQSxDQUFBO0FBQUEsVUFHQSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQVosQ0FBMEIsY0FBMUIsRUFDRTtBQUFBLFlBQUEsT0FBQSxFQUFTLG1CQUFUO1dBREYsQ0FIQSxDQUFBO2lCQU1BLGVBQUEsR0FBa0IsT0FBTyxDQUFDLG1CQUFSLENBQUEsRUFQVDtRQUFBLENBQVgsQ0FMQSxDQUFBO0FBQUEsUUFjQSxFQUFBLENBQUcsZ0VBQUgsRUFBcUUsU0FBQSxHQUFBO2lCQUNuRSxNQUFBLENBQU8sZUFBZSxDQUFDLE9BQWhCLENBQXdCLGVBQXhCLENBQVAsQ0FBZ0QsQ0FBQyxlQUFqRCxDQUFpRSxDQUFBLENBQWpFLEVBRG1FO1FBQUEsQ0FBckUsQ0FkQSxDQUFBO2VBaUJBLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7aUJBQ2pDLE1BQUEsQ0FBTyxlQUFlLENBQUMsT0FBaEIsQ0FBd0IsY0FBeEIsQ0FBUCxDQUErQyxDQUFDLElBQWhELENBQXFELENBQUEsQ0FBckQsRUFEaUM7UUFBQSxDQUFuQyxFQW5CdUM7TUFBQSxDQUF6QyxFQTFEeUM7SUFBQSxDQUEzQyxDQTVhQSxDQUFBO0FBQUEsSUE0ZkEsUUFBQSxDQUFTLDZCQUFULEVBQXdDLFNBQUEsR0FBQTthQUN0QyxFQUFBLENBQUcsMkNBQUgsRUFBZ0QsU0FBQSxHQUFBO0FBQzlDLFFBQUEsT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUNBLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBaEIsQ0FBQSxDQURBLENBQUE7QUFBQSxRQUdBLFFBQUEsR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBQSxDQUE4QixDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQWpDLENBQXlDLHNCQUF6QyxDQUhYLENBQUE7QUFBQSxRQUlBLE9BQUEsR0FBYyxJQUFBLG1CQUFBLENBQW9CO0FBQUEsVUFBQyxVQUFBLFFBQUQ7U0FBcEIsQ0FKZCxDQUFBO0FBQUEsUUFLQSxPQUFPLENBQUMsV0FBUixDQUFvQixPQUFPLENBQUMsT0FBNUIsQ0FMQSxDQUFBO0FBQUEsUUFPQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxPQUFPLENBQUMsY0FBUixDQUFBLEVBRGM7UUFBQSxDQUFoQixDQVBBLENBQUE7QUFBQSxRQVVBLElBQUEsQ0FBSyxTQUFBLEdBQUE7aUJBQ0gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLE9BQU8sQ0FBQyxPQUEvQixFQUF3QyxXQUF4QyxFQURHO1FBQUEsQ0FBTCxDQVZBLENBQUE7QUFBQSxRQWFBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7aUJBQ1AsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQUEsQ0FBQSxLQUEyQiw0QkFEcEI7UUFBQSxDQUFULENBYkEsQ0FBQTtlQWdCQSxJQUFBLENBQUssU0FBQSxHQUFBO2lCQUNILE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBQSxDQUFQLENBQTZCLENBQUMsSUFBOUIsQ0FBbUMsNnhCQUFuQyxFQURHO1FBQUEsQ0FBTCxFQWpCOEM7TUFBQSxDQUFoRCxFQURzQztJQUFBLENBQXhDLENBNWZBLENBQUE7V0FxaEJBLFFBQUEsQ0FBUyw0Q0FBVCxFQUF1RCxTQUFBLEdBQUE7YUFDckQsRUFBQSxDQUFHLG1FQUFILEVBQXdFLFNBQUEsR0FBQTtBQUN0RSxZQUFBLGdCQUFBO0FBQUEsUUFBQyxtQkFBb0IsS0FBckIsQ0FBQTtBQUFBLFFBRUEsT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUZBLENBQUE7QUFBQSxRQUlBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixlQUE5QixFQUFIO1FBQUEsQ0FBaEIsQ0FKQSxDQUFBO0FBQUEsUUFNQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsVUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7aUJBQ0EsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsZ0JBQXBCLEVBRkc7UUFBQSxDQUFMLENBTkEsQ0FBQTtBQUFBLFFBVUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFFBQXBCLEVBQUg7UUFBQSxDQUFoQixDQVZBLENBQUE7QUFBQSxRQVlBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxVQUFBLGFBQWEsQ0FBQyxZQUFkLENBQUEsQ0FBQSxDQUFBO0FBQUEsVUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscURBQWhCLEVBQXVFLElBQXZFLENBREEsQ0FBQTtpQkFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDhCQUF6QyxFQUhHO1FBQUEsQ0FBTCxDQVpBLENBQUE7QUFBQSxRQWlCQSx3QkFBQSxDQUFBLENBakJBLENBQUE7QUFBQSxRQW1CQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBLEdBQUE7aUJBQ3ZCLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLG1CQUEvQixFQUR1QjtRQUFBLENBQXpCLENBbkJBLENBQUE7ZUFzQkEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGNBQUEsWUFBQTtBQUFBLFVBQUEsWUFBQSxHQUFlLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLHdCQUEvQixDQUFmLENBQUE7aUJBQ0EsTUFBQSxDQUFPLFlBQVAsQ0FBb0IsQ0FBQyxPQUFyQixDQUFBLEVBRkc7UUFBQSxDQUFMLEVBdkJzRTtNQUFBLENBQXhFLEVBRHFEO0lBQUEsQ0FBdkQsRUF0aEI4QjtFQUFBLENBQWhDLENBWEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/anas/.atom/packages/markdown-preview-plus/spec/markdown-preview-view-spec.coffee
