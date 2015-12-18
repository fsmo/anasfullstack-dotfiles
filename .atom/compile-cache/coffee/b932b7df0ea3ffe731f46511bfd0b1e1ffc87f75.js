(function() {
  var $, MarkdownPreviewView, cson, markdownIt, mathjaxHelper, path, temp;

  $ = require('atom-space-pen-views').$;

  path = require('path');

  temp = require('temp').track();

  cson = require('season');

  markdownIt = require('../lib/markdown-it-helper');

  mathjaxHelper = require('../lib/mathjax-helper');

  MarkdownPreviewView = require('../lib/markdown-preview-view');

  describe("Syncronization of source and preview", function() {
    var expectPreviewInSplitPane, fixturesPath, generateSelector, preview, waitsForQueuedMathJax, workspaceElement, _ref;
    _ref = [], preview = _ref[0], workspaceElement = _ref[1], fixturesPath = _ref[2];
    beforeEach(function() {
      var configDirPath;
      fixturesPath = path.join(__dirname, 'fixtures');
      jasmine.useRealClock();
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      configDirPath = temp.mkdirSync('atom-config-dir-');
      spyOn(atom, 'getConfigDirPath').andReturn(configDirPath);
      mathjaxHelper.resetMathJax();
      waitsForPromise(function() {
        return atom.packages.activatePackage("markdown-preview-plus");
      });
      waitsFor("LaTeX rendering to be enabled", function() {
        return atom.config.set('markdown-preview-plus.enableLatexRenderingByDefault', true);
      });
      waitsForPromise(function() {
        return atom.workspace.open(path.join(fixturesPath, 'sync.md'));
      });
      runs(function() {
        spyOn(mathjaxHelper, 'mathProcessor').andCallThrough();
        return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
      });
      expectPreviewInSplitPane();
      waitsFor("mathjaxHelper.mathProcessor to be called", function() {
        return mathjaxHelper.mathProcessor.calls.length;
      });
      waitsFor("MathJax to load", function() {
        return typeof MathJax !== "undefined" && MathJax !== null;
      });
      return waitsForQueuedMathJax();
    });
    afterEach(function() {
      preview.destroy();
      return mathjaxHelper.resetMathJax();
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
    waitsForQueuedMathJax = function() {
      var callback, done;
      done = [][0];
      callback = function() {
        return done = true;
      };
      runs(function() {
        return MathJax.Hub.Queue([callback]);
      });
      return waitsFor("queued MathJax operations to complete", function() {
        return done;
      });
    };
    generateSelector = function(token) {
      var element, selector, _i, _len, _ref1;
      selector = null;
      _ref1 = token.path;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        element = _ref1[_i];
        if (selector === null) {
          selector = ".update-preview > " + element.tag + ":eq(" + element.index + ")";
        } else {
          selector = "" + selector + " > " + element.tag + ":eq(" + element.index + ")";
        }
      }
      return selector;
    };
    describe("Syncronizing preview with source", function() {
      var sourceMap, tokens, _ref1;
      _ref1 = [], sourceMap = _ref1[0], tokens = _ref1[1];
      beforeEach(function() {
        sourceMap = cson.readFileSync(path.join(fixturesPath, 'sync-preview.cson'));
        return tokens = markdownIt.getTokens(preview.editor.getText(), true);
      });
      it("identifies the correct HTMLElement path", function() {
        var elementPath, i, sourceLine, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = sourceMap.length; _i < _len; _i++) {
          sourceLine = sourceMap[_i];
          elementPath = preview.getPathToToken(tokens, sourceLine.line);
          _results.push((function() {
            var _j, _ref2, _results1;
            _results1 = [];
            for (i = _j = 0, _ref2 = elementPath.length - 1; _j <= _ref2; i = _j += 1) {
              expect(elementPath[i].tag).toBe(sourceLine.path[i].tag);
              _results1.push(expect(elementPath[i].index).toBe(sourceLine.path[i].index));
            }
            return _results1;
          })());
        }
        return _results;
      });
      return it("scrolls to the correct HTMLElement", function() {
        var element, selector, sourceLine, syncElement, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = sourceMap.length; _i < _len; _i++) {
          sourceLine = sourceMap[_i];
          selector = generateSelector(sourceLine);
          if (selector != null) {
            element = preview.find(selector)[0];
          } else {
            continue;
          }
          syncElement = preview.syncPreview(preview.editor.getText(), sourceLine.line);
          _results.push(expect(element).toBe(syncElement));
        }
        return _results;
      });
    });
    return describe("Syncronizing source with preview", function() {
      return it("sets the editors cursor buffer location to the correct line", function() {
        var element, selector, sourceElement, sourceMap, syncLine, _i, _len, _results;
        sourceMap = cson.readFileSync(path.join(fixturesPath, 'sync-source.cson'));
        _results = [];
        for (_i = 0, _len = sourceMap.length; _i < _len; _i++) {
          sourceElement = sourceMap[_i];
          selector = generateSelector(sourceElement);
          if (selector != null) {
            element = preview.find(selector)[0];
          } else {
            continue;
          }
          syncLine = preview.syncSource(preview.editor.getText(), element);
          if (syncLine) {
            _results.push(expect(syncLine).toBe(sourceElement.line));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24tcHJldmlldy1wbHVzL3NwZWMvc3luYy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtRUFBQTs7QUFBQSxFQUFDLElBQWUsT0FBQSxDQUFRLHNCQUFSLEVBQWYsQ0FBRCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFnQixPQUFBLENBQVEsTUFBUixDQURoQixDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFnQixPQUFBLENBQVEsTUFBUixDQUFlLENBQUMsS0FBaEIsQ0FBQSxDQUZoQixDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFnQixPQUFBLENBQVEsUUFBUixDQUhoQixDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFnQixPQUFBLENBQVEsMkJBQVIsQ0FKaEIsQ0FBQTs7QUFBQSxFQUtBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLHVCQUFSLENBTGhCLENBQUE7O0FBQUEsRUFNQSxtQkFBQSxHQUFzQixPQUFBLENBQVEsOEJBQVIsQ0FOdEIsQ0FBQTs7QUFBQSxFQVFBLFFBQUEsQ0FBUyxzQ0FBVCxFQUFpRCxTQUFBLEdBQUE7QUFDL0MsUUFBQSxnSEFBQTtBQUFBLElBQUEsT0FBNEMsRUFBNUMsRUFBQyxpQkFBRCxFQUFVLDBCQUFWLEVBQTRCLHNCQUE1QixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxhQUFBO0FBQUEsTUFBQSxZQUFBLEdBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFVBQXJCLENBQWYsQ0FBQTtBQUFBLE1BR0EsT0FBTyxDQUFDLFlBQVIsQ0FBQSxDQUhBLENBQUE7QUFBQSxNQUlBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FB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

//# sourceURL=/Users/anas/.atom/packages/markdown-preview-plus/spec/sync-spec.coffee
