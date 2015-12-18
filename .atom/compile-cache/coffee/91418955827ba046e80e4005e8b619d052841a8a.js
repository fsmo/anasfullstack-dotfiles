(function() {
  var MarkdownPreviewView, fs, markdownIt, pandocHelper, path, queryString, temp, url;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  MarkdownPreviewView = require('../lib/markdown-preview-view');

  markdownIt = require('../lib/markdown-it-helper');

  pandocHelper = require('../lib/pandoc-helper.coffee');

  url = require('url');

  queryString = require('querystring');

  require('./spec-helper');

  describe("MarkdownPreviewView when Pandoc is enabled", function() {
    var filePath, html, preview, _ref;
    _ref = [], html = _ref[0], preview = _ref[1], filePath = _ref[2];
    beforeEach(function() {
      var htmlPath;
      filePath = atom.project.getDirectories()[0].resolve('subdir/file.markdown');
      htmlPath = atom.project.getDirectories()[0].resolve('subdir/file-pandoc.html');
      html = fs.readFileSync(htmlPath, {
        encoding: 'utf-8'
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('markdown-preview-plus');
      });
      runs(function() {
        atom.config.set('markdown-preview-plus.enablePandoc', true);
        spyOn(pandocHelper, 'renderPandoc').andCallFake(function(text, filePath, renderMath, cb) {
          return cb(null, html);
        });
        preview = new MarkdownPreviewView({
          filePath: filePath
        });
        return jasmine.attachToDOM(preview.element);
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
    return describe("image resolving", function() {
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
          expect(markdownIt.decode).not.toHaveBeenCalled();
          return expect(image.attr('src')).toStartWith(atom.project.getDirectories()[0].resolve('subdir/image1.png'));
        });
      });
      describe("when the image uses an absolute path that does not exist", function() {
        return it("resolves to a path relative to the project root", function() {
          var image;
          image = preview.find("img[alt=Image2]");
          expect(markdownIt.decode).not.toHaveBeenCalled();
          return expect(image.attr('src')).toStartWith(atom.project.getDirectories()[0].resolve('tmp/image2.png'));
        });
      });
      describe("when the image uses an absolute path that exists", function() {
        return it("adds a query to the URL", function() {
          preview.destroy();
          filePath = path.join(temp.mkdirSync('atom'), 'foo.md');
          fs.writeFileSync(filePath, "![absolute](" + filePath + ")");
          jasmine.unspy(pandocHelper, 'renderPandoc');
          spyOn(pandocHelper, 'renderPandoc').andCallFake(function(text, filePath, renderMath, cb) {
            return cb(null, "<div class=\"figure\">\n<img src=\"" + filePath + "\" alt=\"absolute\"><p class=\"caption\">absolute</p>\n</div>");
          });
          preview = new MarkdownPreviewView({
            filePath: filePath
          });
          jasmine.attachToDOM(preview.element);
          waitsForPromise(function() {
            return preview.renderMarkdown();
          });
          return runs(function() {
            expect(markdownIt.decode).not.toHaveBeenCalled();
            return expect(preview.find("img[alt=absolute]").attr('src')).toStartWith("" + filePath + "?v=");
          });
        });
      });
      return describe("when the image uses a web URL", function() {
        return it("doesn't change the URL", function() {
          var image;
          image = preview.find("img[alt=Image3]");
          expect(markdownIt.decode).not.toHaveBeenCalled();
          return expect(image.attr('src')).toBe('https://raw.githubusercontent.com/Galadirith/markdown-preview-plus/master/assets/hr.png');
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24tcHJldmlldy1wbHVzL3NwZWMvbWFya2Rvd24tcHJldmlldy12aWV3LXBhbmRvYy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrRUFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSw4QkFBUixDQUh0QixDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSwyQkFBUixDQUpiLENBQUE7O0FBQUEsRUFLQSxZQUFBLEdBQWUsT0FBQSxDQUFRLDZCQUFSLENBTGYsQ0FBQTs7QUFBQSxFQU1BLEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUixDQU5OLENBQUE7O0FBQUEsRUFPQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGFBQVIsQ0FQZCxDQUFBOztBQUFBLEVBU0EsT0FBQSxDQUFRLGVBQVIsQ0FUQSxDQUFBOztBQUFBLEVBV0EsUUFBQSxDQUFTLDRDQUFULEVBQXVELFNBQUEsR0FBQTtBQUNyRCxRQUFBLDZCQUFBO0FBQUEsSUFBQSxPQUE0QixFQUE1QixFQUFDLGNBQUQsRUFBTyxpQkFBUCxFQUFnQixrQkFBaEIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsUUFBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYixDQUFBLENBQThCLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBakMsQ0FBeUMsc0JBQXpDLENBQVgs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

//# sourceURL=/Users/anas/.atom/packages/markdown-preview-plus/spec/markdown-preview-view-pandoc-spec.coffee
