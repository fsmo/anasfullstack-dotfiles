(function() {
  var $, fs, mathjaxHelper, path, temp;

  $ = require('atom-space-pen-views').$;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp').track();

  mathjaxHelper = require('../lib/mathjax-helper');

  describe("MathJax helper module", function() {
    return describe("loading MathJax TeX macros", function() {
      var configDirPath, macros, macrosPath, waitsForMacrosToLoad, _ref;
      _ref = [], configDirPath = _ref[0], macrosPath = _ref[1], macros = _ref[2];
      beforeEach(function() {
        configDirPath = temp.mkdirSync('atom-config-dir-');
        macrosPath = path.join(configDirPath, 'markdown-preview-plus.cson');
        spyOn(atom, 'getConfigDirPath').andReturn(configDirPath);
        jasmine.useRealClock();
        return mathjaxHelper.resetMathJax();
      });
      afterEach(function() {
        return mathjaxHelper.resetMathJax();
      });
      waitsForMacrosToLoad = function() {
        var span;
        span = [][0];
        waitsForPromise(function() {
          return atom.packages.activatePackage("markdown-preview-plus");
        });
        runs(function() {
          return mathjaxHelper.loadMathJax();
        });
        waitsFor("MathJax to load", function() {
          return typeof MathJax !== "undefined" && MathJax !== null;
        });
        runs(function() {
          var equation;
          span = document.createElement("span");
          equation = document.createElement("script");
          equation.type = "math/tex; mode=display";
          equation.textContent = "\\int_1^2";
          span.appendChild(equation);
          return mathjaxHelper.mathProcessor(span);
        });
        waitsFor("MathJax macros to be defined", function() {
          var _ref1, _ref2, _ref3;
          return macros = (_ref1 = MathJax.InputJax) != null ? (_ref2 = _ref1.TeX) != null ? (_ref3 = _ref2.Definitions) != null ? _ref3.macros : void 0 : void 0 : void 0;
        });
        return waitsFor("MathJax to process span", function() {
          return span.childElementCount === 2;
        });
      };
      describe("when a macros file exists", function() {
        beforeEach(function() {
          var fixturesFile, fixturesPath;
          fixturesPath = path.join(__dirname, 'fixtures/macros.cson');
          fixturesFile = fs.readFileSync(fixturesPath, 'utf8');
          return fs.writeFileSync(macrosPath, fixturesFile);
        });
        it("loads valid macros", function() {
          waitsForMacrosToLoad();
          return runs(function() {
            expect(macros.macroOne).toBeDefined();
            return expect(macros.macroParamOne).toBeDefined();
          });
        });
        return it("doesn't load invalid macros", function() {
          waitsForMacrosToLoad();
          return runs(function() {
            expect(macros.macro1).toBeUndefined();
            expect(macros.macroTwo).toBeUndefined();
            expect(macros.macroParam1).toBeUndefined();
            return expect(macros.macroParamTwo).toBeUndefined();
          });
        });
      });
      return describe("when a macros file doesn't exist", function() {
        return it("creates a template macros file", function() {
          expect(fs.isFileSync(macrosPath)).toBe(false);
          waitsForMacrosToLoad();
          return runs(function() {
            return expect(fs.isFileSync(macrosPath)).toBe(true);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24tcHJldmlldy1wbHVzL3NwZWMvbWF0aGpheC1oZWxwZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0NBQUE7O0FBQUEsRUFBQyxJQUFlLE9BQUEsQ0FBUSxzQkFBUixFQUFmLENBQUQsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBZ0IsT0FBQSxDQUFRLE1BQVIsQ0FEaEIsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBZ0IsT0FBQSxDQUFRLFNBQVIsQ0FGaEIsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBZ0IsT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLEtBQWhCLENBQUEsQ0FIaEIsQ0FBQTs7QUFBQSxFQUlBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLHVCQUFSLENBSmhCLENBQUE7O0FBQUEsRUFNQSxRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQSxHQUFBO1dBQ2hDLFFBQUEsQ0FBUyw0QkFBVCxFQUF1QyxTQUFBLEdBQUE7QUFDckMsVUFBQSw2REFBQTtBQUFBLE1BQUEsT0FBc0MsRUFBdEMsRUFBQyx1QkFBRCxFQUFnQixvQkFBaEIsRUFBNEIsZ0JBQTVCLENBQUE7QUFBQSxNQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLFNBQUwsQ0FBZSxrQkFBZixDQUFoQixDQUFBO0FBQUEsUUFDQSxVQUFBLEdBQWEsSUFBSSxDQUFDLElBQUwsQ0FBVSxhQUFWLEVBQXlCLDRCQUF6QixDQURiLENBQUE7QUFBQSxRQUdBLEtBQUEsQ0FBTSxJQUFOLEVBQVksa0JBQVosQ0FBK0IsQ0FBQyxTQUFoQyxDQUEwQyxhQUExQyxDQUhBLENBQUE7QUFBQSxRQUlBLE9BQU8sQ0FBQyxZQUFSLENBQUEsQ0FKQSxD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

//# sourceURL=/Users/anas/.atom/packages/markdown-preview-plus/spec/mathjax-helper-spec.coffee
