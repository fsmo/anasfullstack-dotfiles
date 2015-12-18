(function() {
  var StyleText;

  StyleText = require("../../lib/commands/style-text");

  describe("StyleText", function() {
    describe(".isStyleOn", function() {
      it("check a style is added", function() {
        var cmd, fixture;
        cmd = new StyleText("bold");
        fixture = "**bold**";
        return expect(cmd.isStyleOn(fixture)).toBe(true);
      });
      it("check any bold style is in string", function() {
        var cmd, fixture;
        cmd = new StyleText("bold");
        fixture = "hello **bold** world";
        return expect(cmd.isStyleOn(fixture)).toBe(true);
      });
      it("check any italic is in string", function() {
        var cmd, fixture;
        cmd = new StyleText("italic");
        fixture = "_italic_ yah _text_";
        return expect(cmd.isStyleOn(fixture)).toBe(true);
      });
      it("check any strike is in string", function() {
        var cmd, fixture;
        cmd = new StyleText("strikethrough");
        fixture = "**bold** one ~~strike~~ two _italic_";
        return expect(cmd.isStyleOn(fixture)).toBe(true);
      });
      return it("check a style is not added", function() {
        var cmd, fixture;
        cmd = new StyleText("bold");
        fixture = "_not bold_";
        return expect(cmd.isStyleOn(fixture)).toBe(false);
      });
    });
    describe(".removeStyle", function() {
      it("remove a style from text", function() {
        var cmd, fixture;
        cmd = new StyleText("italic");
        fixture = "_italic text_";
        return expect(cmd.removeStyle(fixture)).toEqual("italic text");
      });
      it("remove bold style from text", function() {
        var cmd, fixture;
        cmd = new StyleText("bold");
        fixture = "**bold text** in a string";
        return expect(cmd.removeStyle(fixture)).toEqual("bold text in a string");
      });
      return it("remove italic styles from text", function() {
        var cmd, fixture;
        cmd = new StyleText("italic");
        fixture = "_italic_ yah _text_ loh _more_";
        return expect(cmd.removeStyle(fixture)).toEqual("italic yah text loh more");
      });
    });
    describe(".addStyle", function() {
      return it("add a style to text", function() {
        var cmd, fixture;
        cmd = new StyleText("bold");
        fixture = "bold text";
        return expect(cmd.addStyle(fixture)).toEqual("**bold text**");
      });
    });
    return describe(".trigger", function() {
      var editor;
      editor = null;
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open("empty.markdown");
        });
        return runs(function() {
          return editor = atom.workspace.getActiveTextEditor();
        });
      });
      it("insert empty bold style", function() {
        new StyleText("bold").trigger();
        expect(editor.getText()).toBe("****");
        return expect(editor.getCursorBufferPosition().column).toBe(2);
      });
      it("apply italic style to word", function() {
        editor.setText("italic");
        editor.setCursorBufferPosition([0, 2]);
        new StyleText("italic").trigger();
        expect(editor.getText()).toBe("_italic_");
        return expect(editor.getCursorBufferPosition().column).toBe(8);
      });
      it("remove italic style from word", function() {
        editor.setText("_italic_");
        editor.setCursorBufferPosition([0, 3]);
        new StyleText("italic").trigger();
        expect(editor.getText()).toBe("italic");
        return expect(editor.getCursorBufferPosition().column).toBe(6);
      });
      return it("toggle code style on selection", function() {
        editor.setText("some code here");
        editor.setSelectedBufferRange([[0, 5], [0, 9]]);
        new StyleText("code").trigger();
        expect(editor.getText()).toBe("some `code` here");
        return expect(editor.getCursorBufferPosition().column).toBe(11);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvY29tbWFuZHMvc3R5bGUtdGV4dC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxTQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSwrQkFBUixDQUFaLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsV0FBVCxFQUFzQixTQUFBLEdBQUE7QUFDcEIsSUFBQSxRQUFBLENBQVMsWUFBVCxFQUF1QixTQUFBLEdBQUE7QUFDckIsTUFBQSxFQUFBLENBQUcsd0JBQUgsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFlBQUEsWUFBQTtBQUFBLFFBQUEsR0FBQSxHQUFVLElBQUEsU0FBQSxDQUFVLE1BQVYsQ0FBVixDQUFBO0FBQUEsUUFDQSxPQUFBLEdBQVUsVUFEVixDQUFBO2VBRUEsTUFBQSxDQUFPLEdBQUcsQ0FBQyxTQUFKLENBQWMsT0FBZCxDQUFQLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsSUFBcEMsRUFIMkI7TUFBQSxDQUE3QixDQUFBLENBQUE7QUFBQSxNQUtBLEVBQUEsQ0FBRyxtQ0FBSCxFQUF3QyxTQUFBLEdBQUE7QUFDdEMsWUFBQSxZQUFBO0FBQUEsUUFBQSxHQUFBLEdBQVUsSUFBQSxTQUFBLENBQVUsTUFBVixDQUFWLENBQUE7QUFBQSxRQUNBLE9BQUEsR0FBVSxzQkFEVixDQUFBO2VBRUEsTUFBQSxDQUFPLEdBQUcsQ0FBQyxTQUFKLENBQWMsT0FBZCxDQUFQLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsSUFBcEMsRUFIc0M7TUFBQSxDQUF4QyxDQUxBLENBQUE7QUFBQSxNQVVBLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBLEdBQUE7QUFDbEMsWUFBQSxZQUFBO0FBQUEsUUFBQSxHQUFBLEdBQVUsSUFB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

//# sourceURL=/Users/anas/.atom/packages/markdown-writer/spec/commands/style-text-spec.coffee