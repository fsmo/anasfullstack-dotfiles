(function() {
  var Range, configs, helper, operatorConfig, path;

  helper = require('../lib/helper');

  operatorConfig = require('../lib/operator-config');

  path = require('path');

  configs = require('../config');

  Range = require('atom').Range;

  describe("Helper", function() {
    var config, editor;
    editor = null;
    config = null;
    beforeEach(function() {
      atom.project.setPaths([path.join(__dirname, 'fixtures')]);
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-coffee-script');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('aligner');
      });
      waitsForPromise(function() {
        return atom.workspace.open('helper-sample.coffee').then(function(o) {
          return editor = o;
        });
      });
      return runs(function() {
        return config = operatorConfig.getConfig('=');
      });
    });
    describe("getSameIndentationRange", function() {
      describe("should include comments", function() {
        var offset, range, _ref;
        _ref = [], range = _ref[0], offset = _ref[1];
        beforeEach(function() {
          var _ref1;
          return _ref1 = helper.getSameIndentationRange(editor, 23, ':'), range = _ref1.range, offset = _ref1.offset, _ref1;
        });
        it("should get the valid start row", function() {
          return expect(range.start.row).toBe(22);
        });
        it("should get the valid end row", function() {
          return expect(range.end.row).toBe(32);
        });
        return it("should get the valid offset", function() {
          return expect(offset).toEqual([8]);
        });
      });
      describe("should return valid range object when cursor is in the middle", function() {
        var offset, range, _ref;
        _ref = [], range = _ref[0], offset = _ref[1];
        beforeEach(function() {
          var _ref1;
          return _ref1 = helper.getSameIndentationRange(editor, 2, "="), range = _ref1.range, offset = _ref1.offset, _ref1;
        });
        it("should get the valid start row", function() {
          return expect(range.start.row).toBe(1);
        });
        it("should get the valid end row", function() {
          return expect(range.end.row).toBe(3);
        });
        return it("should get the valid offset", function() {
          return expect(offset).toEqual([7]);
        });
      });
      describe("should return valid range object when cursor is on the last line", function() {
        var offset, range, _ref;
        _ref = [], range = _ref[0], offset = _ref[1];
        beforeEach(function() {
          var _ref1;
          return _ref1 = helper.getSameIndentationRange(editor, 3, "="), range = _ref1.range, offset = _ref1.offset, _ref1;
        });
        it("should get the valid start row", function() {
          return expect(range.start.row).toBe(1);
        });
        it("should get the valid end row", function() {
          return expect(range.end.row).toBe(3);
        });
        return it("should get the valid offset", function() {
          return expect(offset).toEqual([7]);
        });
      });
      return describe("should return valid range object when cursor is on the first line", function() {
        var offset, range, _ref;
        _ref = [], range = _ref[0], offset = _ref[1];
        beforeEach(function() {
          var _ref1;
          return _ref1 = helper.getSameIndentationRange(editor, 1, "="), range = _ref1.range, offset = _ref1.offset, _ref1;
        });
        it("should get the valid start row", function() {
          return expect(range.start.row).toBe(1);
        });
        it("should get the valid end row", function() {
          return expect(range.end.row).toBe(3);
        });
        return it("should get the valid offset", function() {
          return expect(offset).toEqual([7]);
        });
      });
    });
    describe("getAlignCharacter", function() {
      var grammar;
      grammar = null;
      beforeEach(function() {
        return grammar = editor.getGrammar();
      });
      it("should get the = character", function() {
        var character;
        character = helper.getAlignCharacter(editor, 1);
        return expect(character).toBe("=");
      });
      it("should get the : character", function() {
        var character;
        character = helper.getAlignCharacter(editor, 7);
        return expect(character).toBe(":");
      });
      it("should get the , character", function() {
        var character;
        character = helper.getAlignCharacter(editor, 13);
        return expect(character).toBe(",");
      });
      return it("should not find anything", function() {
        var character;
        character = helper.getAlignCharacter(editor, 4);
        return expect(character).not.toBeDefined();
      });
    });
    describe("getAlignCharacterInRanges", function() {
      var grammar;
      grammar = null;
      beforeEach(function() {
        return grammar = editor.getGrammar();
      });
      it("should get the = character", function() {
        var character, ranges;
        ranges = [new Range([1, 0], [3, 0])];
        character = helper.getAlignCharacterInRanges(editor, ranges);
        return expect(character).toBe("=");
      });
      it("should get the : character", function() {
        var character, ranges;
        ranges = [new Range([7, 0], [9, 0])];
        character = helper.getAlignCharacterInRanges(editor, ranges);
        return expect(character).toBe(":");
      });
      it("should get the , character", function() {
        var character, ranges;
        ranges = [new Range([13, 0], [15, 0])];
        character = helper.getAlignCharacterInRanges(editor, ranges);
        return expect(character).toBe(",");
      });
      return it("should not find anything", function() {
        var character, ranges;
        ranges = [new Range([34, 0], [35, 0])];
        character = helper.getAlignCharacterInRanges(editor, ranges);
        return expect(character).not.toBeDefined();
      });
    });
    return describe("parseTokenizedLine", function() {
      var grammar;
      grammar = null;
      beforeEach(function() {
        return grammar = editor.getGrammar();
      });
      describe("parsing a valid line", function() {
        var output;
        output = null;
        beforeEach(function() {
          var line;
          line = grammar.tokenizeLine(editor.lineTextForBufferRow(2));
          return output = helper.parseTokenizedLine(line, "=", config);
        });
        it("should get the text before = with right trimmed", function() {
          return expect(output[0].before).toBe("  hello");
        });
        it("should get the text after = with left trimmed", function() {
          return expect(output[0].after).toBe('"world"');
        });
        it("should get the offset", function() {
          return expect(output[0].offset).toBe(7);
        });
        it("should return no prefix", function() {
          return expect(output.prefix).toBe(false);
        });
        return it("should show the line is valid", function() {
          return expect(output.valid).toBeTruthy();
        });
      });
      describe("parsing an invalid line", function() {
        var output;
        output = null;
        beforeEach(function() {
          var line;
          grammar = editor.getGrammar();
          line = grammar.tokenizeLine(editor.lineTextForBufferRow(4));
          return output = helper.parseTokenizedLine(line, "=", config);
        });
        return it("should show the line is invalid", function() {
          return expect(output.valid).toBeFalsy();
        });
      });
      describe("parsing a line with prefix", function() {
        var output;
        output = null;
        beforeEach(function() {
          var line;
          grammar = editor.getGrammar();
          line = grammar.tokenizeLine(editor.lineTextForBufferRow(9));
          return output = helper.parseTokenizedLine(line, "-=", config);
        });
        it("should show the line is valid", function() {
          return expect(output.valid).toBeTruthy();
        });
        it("should return the correct prefix", function() {
          return expect(output.prefix).toBe(true);
        });
        it("should get the text before = with right trimmed", function() {
          return expect(output[0].before).toBe("prefix");
        });
        it("should get the text after = with left trimmed", function() {
          return expect(output[0].after).toBe('1');
        });
        return it("should get the offset", function() {
          return expect(output[0].offset).toBe(6);
        });
      });
      describe("parsing a line with leading and/or trailing whitespaces", function() {
        var output;
        output = null;
        beforeEach(function() {
          return atom.config.set('editor.showInvisibles', true);
        });
        afterEach(function() {
          atom.config.set('editor.showInvisibles', false);
          return atom.config.set('editor.softTabs', true);
        });
        it("should include leading whitespaces", function() {
          var line;
          line = editor.displayBuffer.tokenizedBuffer.tokenizedLineForRow(17);
          output = helper.parseTokenizedLine(line, "=", config);
          expect(output[0].before).toBe("        testing");
          return expect(output[0].after).toBe("123");
        });
        it("should include trailing whitespaces", function() {
          var line;
          line = editor.displayBuffer.tokenizedBuffer.tokenizedLineForRow(18);
          output = helper.parseTokenizedLine(line, "=", config);
          expect(output[0].before).toBe("        test");
          return expect(output[0].after).toBe("'abc'      ");
        });
        return it("should handle tabs correctly", function() {
          var line;
          line = editor.displayBuffer.tokenizedBuffer.tokenizedLineForRow(36);
          output = helper.parseTokenizedLine(line, "=", config);
          expect(output[0].before).toBe("				testing");
          return expect(output[0].after).toBe("123");
        });
      });
      return describe("parsing a line with multiple characters", function() {
        var output;
        output = null;
        beforeEach(function() {
          var commaConfig, line;
          commaConfig = {
            leftSpace: true,
            rightSpace: false,
            scope: "delimiter",
            multiple: {
              number: {
                alignment: "left"
              },
              string: {
                alignment: "right"
              }
            }
          };
          grammar = editor.getGrammar();
          line = grammar.tokenizeLine(editor.lineTextForBufferRow(13));
          return output = helper.parseTokenizedLine(line, ",", commaConfig);
        });
        it("should show the line is valid", function() {
          return expect(output.valid).toBeTruthy();
        });
        it("should parsed out 3 items", function() {
          return expect(output.length).toBe(3);
        });
        it("should not have any prefix", function() {
          return expect(output.prefix).toBe(false);
        });
        return it("should have content in before for all items", function() {
          var content;
          content = true;
          output.forEach(function(item) {
            if (item.before.length === 0) {
              return content = false;
            }
          });
          return expect(content).toBeTruthy();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYWxpZ25lci9zcGVjL2hlbHBlci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0Q0FBQTs7QUFBQSxFQUFBLE1BQUEsR0FBaUIsT0FBQSxDQUFRLGVBQVIsQ0FBakIsQ0FBQTs7QUFBQSxFQUNBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHdCQUFSLENBRGpCLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQWlCLE9BQUEsQ0FBUSxNQUFSLENBRmpCLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQWlCLE9BQUEsQ0FBUSxXQUFSLENBSGpCLENBQUE7O0FBQUEsRUFJQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FKRCxDQUFBOztBQUFBLEVBTUEsUUFBQSxDQUFTLFFBQVQsRUFBbUIsU0FBQSxHQUFBO0FBQ2pCLFFBQUEsY0FBQTtBQUFBLElBQUEsTUFBQSxHQUFTLElBQVQsQ0FBQTtBQUFBLElBQ0EsTUFBQSxHQUFTLElBRFQsQ0FBQTtBQUFBLElBR0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQXNCLENBQUMsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFVBQXJCLENBQUQsQ0FBdEIsQ0FBQSxDQUFBO0FBQUEsTUFFQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4Qix3QkFBOUIsRUFEYztNQUFBLENBQWhCLENBRkEsQ0FBQTtBQUFBLE1BS0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsU0FBOUIsRUFEYztNQUFBLENBQWhCLENBTEEsQ0FBQTtBQUFBLE1BUUEsZUFBQSxDQUFnQixT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

//# sourceURL=/Users/anas/.atom/packages/aligner/spec/helper-spec.coffee
