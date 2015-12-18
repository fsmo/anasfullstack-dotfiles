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
    operatorConfig.add('aligner', configs);
    beforeEach(function() {
      atom.project.setPaths([path.join(__dirname, 'fixtures')]);
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-coffee-script');
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
    afterEach(function() {
      return atom.config.unset('aligner');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYWxpZ25lci9zcGVjL2hlbHBlci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0Q0FBQTs7QUFBQSxFQUFBLE1BQUEsR0FBaUIsT0FBQSxDQUFRLGVBQVIsQ0FBakIsQ0FBQTs7QUFBQSxFQUNBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHdCQUFSLENBRGpCLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQWlCLE9BQUEsQ0FBUSxNQUFSLENBRmpCLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQWlCLE9BQUEsQ0FBUSxXQUFSLENBSGpCLENBQUE7O0FBQUEsRUFJQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FKRCxDQUFBOztBQUFBLEVBTUEsUUFBQSxDQUFTLFFBQVQsRUFBbUIsU0FBQSxHQUFBO0FBQ2pCLFFBQUEsY0FBQTtBQUFBLElBQUEsTUFBQSxHQUFTLElBQVQsQ0FBQTtBQUFBLElBQ0EsTUFBQSxHQUFTLElBRFQsQ0FBQTtBQUFBLElBRUEsY0FBYyxDQUFDLEdBQWYsQ0FBbUIsU0FBbkIsRUFBOEIsT0FBOUIsQ0FGQSxDQUFBO0FBQUEsSUFJQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBc0IsQ0FBQyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsVUFBckIsQ0FBRCxDQUF0QixDQUFBLENBQUE7QUFBQSxNQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLHdCQUE5QixFQURjO01BQUEsQ0FBaEIsQ0FGQSxDQUFBO0FBQUEsTUFLQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixD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

//# sourceURL=/Users/anas/.atom/packages/aligner/spec/helper-spec.coffee
