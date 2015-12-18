(function() {
  var $, bibFile, cslFile, file, fs, pandocHelper, path, temp, tempPath, wrench;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  wrench = require('wrench');

  $ = require('atom-space-pen-views').$;

  pandocHelper = require('../lib/pandoc-helper.coffee');

  bibFile = 'test.bib';

  cslFile = 'foo.csl';

  tempPath = null;

  file = null;

  require('./spec-helper');

  describe("Markdown preview plus pandoc helper", function() {
    var preview, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], preview = _ref[1];
    beforeEach(function() {
      var fixturesPath;
      fixturesPath = path.join(__dirname, 'fixtures');
      tempPath = temp.mkdirSync('atom');
      wrench.copyDirSyncRecursive(fixturesPath, tempPath, {
        forceDelete: true
      });
      atom.project.setPaths([tempPath]);
      jasmine.useRealClock();
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      return waitsForPromise(function() {
        return atom.packages.activatePackage("markdown-preview-plus");
      });
    });
    describe("PandocHelper::findFileRecursive", function() {
      var fR;
      fR = pandocHelper.__testing__.findFileRecursive;
      it("should return bibFile in the same directory", function() {
        return runs(function() {
          var bibPath, found;
          bibPath = path.join(tempPath, 'subdir', bibFile);
          fs.writeFileSync(bibPath, '');
          found = fR(path.join(tempPath, 'subdir', 'simple.md'), bibFile);
          return expect(found).toEqual(bibPath);
        });
      });
      it("should return bibFile in a parent directory", function() {
        return runs(function() {
          var bibPath, found;
          bibPath = path.join(tempPath, bibFile);
          fs.writeFileSync(bibPath, '');
          found = fR(path.join(tempPath, 'subdir', 'simple.md'), bibFile);
          return expect(found).toEqual(bibPath);
        });
      });
      return it("shouldn't return bibFile in a out of scope directory", function() {
        return runs(function() {
          var found;
          fs.writeFileSync(path.join(tempPath, '..', bibFile), '');
          found = fR(path.join(tempPath, 'subdir', 'simple.md'), bibFile);
          return expect(found).toEqual(false);
        });
      });
    });
    describe("PandocHelper::getArguments", function() {
      var getArguments;
      getArguments = pandocHelper.__testing__.getArguments;
      it('should work with empty arguments', function() {
        var result;
        atom.config.set('markdown-preview-plus.pandocArguments', []);
        result = getArguments(null);
        return expect(result.length).toEqual(0);
      });
      it('should filter empty arguments', function() {
        var args, result;
        args = {
          foo: 'bar',
          empty: null,
          none: 'lala',
          empty2: false,
          empty3: void 0
        };
        result = getArguments(args);
        expect(result.length).toEqual(2);
        expect(result[0]).toEqual('--foo=bar');
        return expect(result[1]).toEqual('--none=lala');
      });
      it('should load user arguments', function() {
        var args, result;
        atom.config.set('markdown-preview-plus.pandocArguments', ['-v', '--smart', 'rem', '--filter=/foo/bar', '--filter-foo /foo/baz']);
        args = {};
        result = getArguments(args);
        expect(result.length).toEqual(4);
        expect(result[0]).toEqual('-v');
        expect(result[1]).toEqual('--smart');
        expect(result[2]).toEqual('--filter=/foo/bar');
        return expect(result[3]).toEqual('--filter-foo=/foo/baz');
      });
      return it('should combine user arguments and given arguments', function() {
        var args, result;
        atom.config.set('markdown-preview-plus.pandocArguments', ['-v', '--filter-foo /foo/baz']);
        args = {
          foo: 'bar',
          empty3: void 0
        };
        result = getArguments(args);
        expect(result.length).toEqual(3);
        expect(result[0]).toEqual('--foo=bar');
        expect(result[1]).toEqual('-v');
        return expect(result[2]).toEqual('--filter-foo=/foo/baz');
      });
    });
    return describe("PandocHelper::setPandocOptions", function() {
      var fallBackBib, fallBackCsl, setPandocOptions;
      fallBackBib = '/foo/fallback.bib';
      fallBackCsl = '/foo/fallback.csl';
      setPandocOptions = pandocHelper.__testing__.setPandocOptions;
      beforeEach(function() {
        file = path.join(tempPath, 'subdir', 'simple.md');
        atom.config.set('markdown-preview-plus.pandocBibliography', true);
        atom.config.set('markdown-preview-plus.pandocBIBFile', bibFile);
        atom.config.set('markdown-preview-plus.pandocBIBFileFallback', fallBackBib);
        atom.config.set('markdown-preview-plus.pandocCSLFile', cslFile);
        return atom.config.set('markdown-preview-plus.pandocCSLFileFallback', fallBackCsl);
      });
      it("shouldn't set pandoc bib options if citations are disabled", function() {
        return runs(function() {
          var config;
          atom.config.set('markdown-preview-plus.pandocBibliography', false);
          fs.writeFileSync(path.join(tempPath, bibFile), '');
          config = setPandocOptions(file);
          return expect(config.args.bibliography).toEqual(void 0);
        });
      });
      it("shouldn't set pandoc bib options if no fallback file exists", function() {
        return runs(function() {
          var config;
          atom.config.set('markdown-preview-plus.pandocBIBFileFallback');
          config = setPandocOptions(file);
          return expect(config.args.bibliography).toEqual(void 0);
        });
      });
      it("should set pandoc bib options if citations are enabled and project bibFile exists", function() {
        return runs(function() {
          var bibPath, config;
          bibPath = path.join(tempPath, bibFile);
          fs.writeFileSync(bibPath, '');
          config = setPandocOptions(file);
          return expect(config.args.bibliography).toEqual(bibPath);
        });
      });
      it("should set pandoc bib options if citations are enabled and use fallback", function() {
        return runs(function() {
          var config;
          config = setPandocOptions(file);
          return expect(config.args.bibliography).toEqual(fallBackBib);
        });
      });
      it("shouldn't set pandoc csl options if citations are disabled", function() {
        return runs(function() {
          var config;
          atom.config.set('markdown-preview-plus.pandocBibliography', false);
          fs.writeFileSync(path.join(tempPath, cslFile), '');
          config = setPandocOptions(file);
          return expect(config.args.csl).toEqual(void 0);
        });
      });
      it("shouldn't set pandoc csl options if no fallback file exists", function() {
        return runs(function() {
          var config;
          atom.config.set('markdown-preview-plus.pandocCSLFileFallback');
          config = setPandocOptions(file);
          return expect(config.args.csl).toEqual(void 0);
        });
      });
      it("should set pandoc csl options if citations are enabled and project cslFile exists", function() {
        return runs(function() {
          var config, cslPath;
          cslPath = path.join(tempPath, cslFile);
          fs.writeFileSync(cslPath, '');
          config = setPandocOptions(file);
          return expect(config.args.csl).toEqual(cslPath);
        });
      });
      return it("should set pandoc csl options if citations are enabled and use fallback", function() {
        return runs(function() {
          var config;
          config = setPandocOptions(file);
          return expect(config.args.csl).toEqual(fallBackCsl);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24tcHJldmlldy1wbHVzL3NwZWMvbWFya2Rvd24tcHJldmlldy1wYW5kb2MtaGVscGVyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlFQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBSFQsQ0FBQTs7QUFBQSxFQUlDLElBQUssT0FBQSxDQUFRLHNCQUFSLEVBQUwsQ0FKRCxDQUFBOztBQUFBLEVBS0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSw2QkFBUixDQUxmLENBQUE7O0FBQUEsRUFPQSxPQUFBLEdBQVUsVUFQVixDQUFBOztBQUFBLEVBUUEsT0FBQSxHQUFVLFNBUlYsQ0FBQTs7QUFBQSxFQVVBLFFBQUEsR0FBVyxJQVZYLENBQUE7O0FBQUEsRUFXQSxJQUFBLEdBQU8sSUFYUCxDQUFBOztBQUFBLEVBYUEsT0FBQSxDQUFRLGVBQVIsQ0FiQSxDQUFBOztBQUFBLEVBZUEsUUFBQSxDQUFTLHFDQUFULEVBQWdELFNBQUEsR0FBQTtBQUM5QyxRQUFBLCtCQUFBO0FBQUEsSUFBQSxPQUE4QixFQUE5QixFQUFDLDBCQUFELEVBQW1CLGlCQUFuQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxZQUFBO0FBQUEsTUFBQSxZQUFBLEdBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFVBQXJCLENBQWYsQ0FBQTtBQUFBLE1BQ0EsUUFB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

//# sourceURL=/Users/anas/.atom/packages/markdown-preview-plus/spec/markdown-preview-pandoc-helper-spec.coffee
