(function() {
  var helper, operatorConfig;

  helper = require('./helper');

  operatorConfig = require('./operator-config');

  module.exports = {
    formatRange: function(editor, range, character, offsets) {
      var alignment, before, canAlignWith, config, currentLine, currentRow, i, indentLevel, j, leftSpace, lineCharacter, newSpace, offset, parsed, parsedItem, rightSpace, scope, textBlock, tokenizedLine, type, _i, _j, _k, _len, _len1, _ref, _ref1, _ref2;
      scope = editor.getRootScopeDescriptor().getScopeChain();
      config = operatorConfig.getConfig(character, scope);
      textBlock = "";
      _ref = range.getRows();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        currentRow = _ref[_i];
        indentLevel = editor.indentationForBufferRow(currentRow);
        tokenizedLine = helper.getTokenizedLineForBufferRow(editor, currentRow);
        lineCharacter = helper.getAlignCharacter(editor, currentRow);
        canAlignWith = operatorConfig.canAlignWith(character, lineCharacter, config);
        if (!lineCharacter || !canAlignWith || tokenizedLine.isComment()) {
          textBlock += editor.lineTextForBufferRow(currentRow);
          if (currentRow !== range.end.row) {
            textBlock += "\n";
          }
          continue;
        }
        parsed = helper.parseTokenizedLine(tokenizedLine, lineCharacter, config);
        currentLine = "";
        for (i = _j = 0, _len1 = parsed.length; _j < _len1; i = ++_j) {
          parsedItem = parsed[i];
          offset = parsedItem.offset + (parsed.prefix ? 1 : 0);
          newSpace = "";
          for (j = _k = 1, _ref1 = offsets[i] - offset; _k <= _ref1; j = _k += 1) {
            newSpace += " ";
          }
          if (config.multiple) {
            type = isNaN(+parsedItem.before) ? "string" : "number";
            alignment = ((_ref2 = config.multiple[type]) != null ? _ref2.alignment : void 0) || "left";
          } else {
            alignment = config.alignment;
          }
          leftSpace = alignment === "left" ? newSpace : "";
          if (config.leftSpace) {
            leftSpace += " ";
          }
          rightSpace = alignment === "right" ? newSpace : "";
          if (config.rightSpace && !(config.multiple && i === 0)) {
            rightSpace += " ";
          }
          if (config.multiple) {
            before = parsedItem.before;
            if (i > 0) {
              before = before.trim();
            }
            currentLine += rightSpace + before;
            if (i !== parsed.length - 1) {
              currentLine += leftSpace + lineCharacter;
            }
          } else {
            currentLine += parsedItem.before;
            currentLine += leftSpace + lineCharacter + rightSpace;
            currentLine += parsedItem.after;
          }
        }
        textBlock += currentLine;
        if (currentRow !== range.end.row) {
          textBlock += "\n";
        }
      }
      range.start.column = 0;
      range.end.column = Infinity;
      editor.setTextInBufferRange(range, textBlock);
      editor.setCursorBufferPosition(range.end);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYWxpZ25lci9saWIvZm9ybWF0dGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzQkFBQTs7QUFBQSxFQUFBLE1BQUEsR0FBaUIsT0FBQSxDQUFRLFVBQVIsQ0FBakIsQ0FBQTs7QUFBQSxFQUNBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG1CQUFSLENBRGpCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxXQUFBLEVBQWEsU0FBQyxNQUFELEVBQVMsS0FBVCxFQUFnQixTQUFoQixFQUEyQixPQUEzQixHQUFBO0FBQ1gsVUFBQSxtUEFBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLE1BQU0sQ0FBQyxzQkFBUCxDQUFBLENBQStCLENBQUMsYUFBaEMsQ0FBQSxDQUFaLENBQUE7QUFBQSxNQUNBLE1BQUEsR0FBWSxjQUFjLENBQUMsU0FBZixDQUF5QixTQUF6QixFQUFvQyxLQUFwQyxDQURaLENBQUE7QUFBQSxNQUVBLFNBQUEsR0FBWSxFQUZaLENBQUE7QUFJQTtBQUFBLFdBQUEsMkNBQUE7OEJBQUE7QUFDRSxRQUFBLFdBQUEsR0FBZ0IsTUFBTSxDQUFDLHVCQUFQLENBQStCLFVBQS9CLENBQWhCLENBQUE7QUFBQSxRQUNBLGFBQUEsR0FBZ0IsTUFBTSxDQUFDLDRCQUFQLENBQW9DLE1BQXBDLEVBQTRDLFVBQTVDLENBRGhCLENBQUE7QUFBQSxRQUVBLGFBQUEsR0FBZ0IsTUFBTSxDQUFDLGlCQUFQLENBQXlCLE1BQXpCLEVBQWlDLFVBQWpDLENBRmhCLENBQUE7QUFBQSxRQUdBLFlBQUEsR0FBZ0IsY0FBYyxDQUFDLFlBQWYsQ0FBNEIsU0FBNUIsRUFBdUMsYUFBdkMsRUFBc0QsTUFBdEQsQ0FIaEIsQ0FBQTtBQUtBLFFBQUEsSUFBRyxD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

//# sourceURL=/Users/anas/.atom/packages/aligner/lib/formatter.coffee
