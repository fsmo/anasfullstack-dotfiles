(function() {
  var InsertImageView, config;

  InsertImageView = require("../../lib/views/insert-image-view");

  config = require("../../lib/config");

  describe("InsertImageView", function() {
    var editor, insertImageView, _ref;
    _ref = [], editor = _ref[0], insertImageView = _ref[1];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
      return runs(function() {
        insertImageView = new InsertImageView({});
        return editor = atom.workspace.getActiveTextEditor();
      });
    });
    describe(".isInSiteDir", function() {
      beforeEach(function() {
        return atom.config.set("markdown-writer.siteLocalDir", editor.getPath().replace("empty.markdown", ""));
      });
      it("check a file is in site local dir", function() {
        var fixture;
        fixture = "" + (config.get("siteLocalDir")) + "/image.jpg";
        return expect(insertImageView.isInSiteDir(fixture)).toBe(true);
      });
      return it("check a file is not in site local dir", function() {
        var fixture;
        fixture = 'some/random/path/image.jpg';
        return expect(insertImageView.isInSiteDir(fixture)).toBe(false);
      });
    });
    describe(".resolveImagePath", function() {
      it("return empty image path", function() {
        var fixture;
        fixture = "";
        return expect(insertImageView.resolveImagePath(fixture)).toBe(fixture);
      });
      it("return URL image path", function() {
        var fixture;
        fixture = "https://assets-cdn.github.com/images/icons/emoji/octocat.png";
        return expect(insertImageView.resolveImagePath(fixture)).toBe(fixture);
      });
      it("return relative image path", function() {
        var fixture;
        insertImageView.editor = editor;
        fixture = editor.getPath().replace("empty.markdown", "octocat.png");
        return expect(insertImageView.resolveImagePath(fixture)).toBe(fixture);
      });
      return it("return absolute image path", function() {
        var expected, fixture;
        insertImageView.editor = editor;
        atom.config.set("markdown-writer.siteLocalDir", editor.getPath().replace("empty.markdown", ""));
        fixture = "octocat.png";
        expected = editor.getPath().replace("empty.markdown", "octocat.png");
        return expect(insertImageView.resolveImagePath(fixture)).toBe(expected);
      });
    });
    return describe(".generateImageSrc", function() {
      it("return empty image path", function() {
        var fixture;
        fixture = "";
        return expect(insertImageView.generateImageSrc(fixture)).toBe(fixture);
      });
      it("return URL image path", function() {
        var fixture;
        fixture = "https://assets-cdn.github.com/images/icons/emoji/octocat.png";
        return expect(insertImageView.generateImageSrc(fixture)).toBe(fixture);
      });
      it("return relative image path from file", function() {
        var fixture;
        insertImageView.editor = editor;
        atom.config.set("markdown-writer.relativeImagePath", true);
        fixture = editor.getPath().replace("empty.markdown", "octocat.png");
        return expect(insertImageView.generateImageSrc(fixture)).toBe("octocat.png");
      });
      it("return relative image path from site", function() {
        var fixture;
        atom.config.set("markdown-writer.siteLocalDir", "/assets/images/icons/emoji");
        fixture = "/assets/images/icons/emoji/octocat.png";
        return expect(insertImageView.generateImageSrc(fixture)).toBe("octocat.png");
      });
      return it("return image dir path", function() {
        var fixture;
        fixture = "octocat.png";
        return expect(insertImageView.generateImageSrc(fixture)).toMatch(/\d{4}\/\d{2}\/octocat\.png/);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvdmlld3MvaW5zZXJ0LWltYWdlLXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUJBQUE7O0FBQUEsRUFBQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxtQ0FBUixDQUFsQixDQUFBOztBQUFBLEVBRUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxrQkFBUixDQUZULENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQSxHQUFBO0FBQzFCLFFBQUEsNkJBQUE7QUFBQSxJQUFBLE9BQTRCLEVBQTVCLEVBQUMsZ0JBQUQsRUFBUyx5QkFBVCxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixnQkFBcEIsRUFBSDtNQUFBLENBQWhCLENBQUEsQ0FBQTthQUVBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxRQUFBLGVBQUEsR0FBc0IsSUFBQSxlQUFBLENBQWdCLEVBQWhCLENBQXRCLENBQUE7ZUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLEVBRk47TUFBQSxDQUFMLEVBSFM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBU0EsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw4QkFBaEIsRUFBZ0QsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLE9BQWpCLENBQXlCLGdCQUF6QixFQUEyQyxFQUEzQyxDQUFo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

//# sourceURL=/Users/anas/.atom/packages/markdown-writer/spec/views/insert-image-view-spec.coffee
