(function() {
  var Point, Range, operatorConfig, _ref, _traverseRanges;

  operatorConfig = require('./operator-config');

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  _traverseRanges = function(ranges, callback, context) {
    var line, output, range, _i, _j, _len, _len1, _ref1;
    if (context == null) {
      context = this;
    }
    for (_i = 0, _len = ranges.length; _i < _len; _i++) {
      range = ranges[_i];
      _ref1 = range.getRows();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        line = _ref1[_j];
        if ((output = callback.call(context, line))) {
          return output;
        }
      }
    }
  };

  module.exports = {

    /*
    @name getAlignCharacter
    @description
    Get the character to align based on text
    @param {Editor} editor
    @param {number} row
    @returns {String} Alignment character
     */
    getAlignCharacter: function(editor, row) {
      var config, languageScope, token, tokenScope, tokenValue, tokenized, _i, _j, _len, _len1, _ref1, _ref2;
      tokenized = this.getTokenizedLineForBufferRow(editor, row);
      languageScope = editor.getRootScopeDescriptor().getScopeChain() || 'base';
      if (!tokenized) {
        return null;
      }
      _ref1 = tokenized.tokens;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        token = _ref1[_i];
        tokenValue = token.value.trim();
        config = operatorConfig.getConfig(tokenValue, languageScope);
        if (!config) {
          continue;
        }
        _ref2 = token.scopes;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          tokenScope = _ref2[_j];
          if (tokenScope.match(config.scope) != null) {
            return tokenValue;
          }
        }
      }
    },

    /*
    @name getAlignCharacterInRanges
    @description
    Get the character to align within certain ranges
    @param {Editor} editor
    @param {Array.<Range>} ranges
    @returns {String} Alignment character
     */
    getAlignCharacterInRanges: function(editor, ranges) {
      return _traverseRanges(ranges, function(line) {
        var character;
        character = this.getAlignCharacter(editor, line);
        if (character) {
          return character;
        }
      }, this);
    },

    /*
    @name getOffsets
    @description
    Get alignment offset based on character and selections
    @param {Editor} editor
    @param {String} character
    @param {Array.<Range>} ranges
     */
    getOffsets: function(editor, character, ranges) {
      var offsets, scope;
      scope = editor.getRootScopeDescriptor().getScopeChain();
      offsets = [];
      _traverseRanges(ranges, function(line) {
        var config, parsed, tokenized;
        tokenized = this.getTokenizedLineForBufferRow(editor, line);
        config = operatorConfig.getConfig(character, scope);
        parsed = this.parseTokenizedLine(tokenized, character, config);
        if (parsed.valid) {
          this.setOffsets(offsets, parsed);
        }
      }, this);
      return offsets;
    },

    /*
    @name parseTokenizedLine
    @description
    Parsing line with operator
    @param {Object} tokenizedLine Tokenized line object from editor display buffer
    @param {String} character Character to align
    @param {Object} config Character config
    @returns {Object} Information about the tokenized line including text before character,
                      text after character, character prefix, offset and if the line is
                      valid
     */
    parseTokenizedLine: function(tokenizedLine, character, config) {
      var addToParsed, afterCharacter, parsed, section, token, tokenValue, variable, _i, _len, _ref1;
      afterCharacter = false;
      parsed = [];
      parsed.prefix = null;
      section = {
        before: "",
        after: ""
      };
      addToParsed = function() {
        section.before = section.before.trimRight();
        section.after = section.after.trimLeft();
        section.offset = section.before.length;
        parsed.push(section);
        return section = {
          before: "",
          after: ""
        };
      };
      _ref1 = tokenizedLine.tokens;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        token = _ref1[_i];
        tokenValue = this._formatTokenValue(token.value, token, tokenizedLine.invisibles);
        if (operatorConfig.canAlignWith(character, tokenValue.trim(), config) && (!afterCharacter || config.multiple)) {
          parsed.prefix = operatorConfig.isPrefixed(tokenValue.trim(), config);
          if (config.multiple) {
            addToParsed();
          }
          afterCharacter = true;
          continue;
        }
        variable = afterCharacter && !config.multiple ? "after" : "before";
        section[variable] += tokenValue;
      }
      addToParsed();
      parsed.valid = afterCharacter;
      return parsed;
    },

    /*
    @name setOffsets
    @description
    Set alignment offset for each section
    @param {Array.<Integer>} offsets
    @param {Array.<Object>} parsedObjects
     */
    setOffsets: function(offsets, parsedObjects) {
      var i, parsedObject, _i, _len, _results;
      _results = [];
      for (i = _i = 0, _len = parsedObjects.length; _i < _len; i = ++_i) {
        parsedObject = parsedObjects[i];
        if (offsets[i] == null) {
          offsets[i] = parsedObject.offset;
        }
        if (parsedObject.offset > offsets[i]) {
          _results.push(offsets[i] = parsedObject.offset);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },

    /*
    @name getSameIndentationRange
    @description To get the start and end line number of the same indentation
    @param {Editor} editor Active editor
    @param {Integer} row Row to match
    @returns {Object} An object with the start and end line
     */
    getSameIndentationRange: function(editor, row, character) {
      var config, end, endLine, endPoint, hasPrefix, indent, offsets, parsed, scope, start, startLine, startPoint, tokenized, total;
      start = row - 1;
      end = row + 1;
      tokenized = this.getTokenizedLineForBufferRow(editor, row);
      scope = editor.getRootScopeDescriptor().getScopeChain();
      config = operatorConfig.getConfig(character, scope);
      parsed = this.parseTokenizedLine(tokenized, character, config);
      indent = editor.indentationForBufferRow(row);
      total = editor.getLineCount();
      hasPrefix = parsed.prefix;
      offsets = [];
      startPoint = new Point(row, 0);
      endPoint = new Point(row, Infinity);
      this.setOffsets(offsets, parsed);
      while (start > -1 || end < total) {
        if (start > -1) {
          startLine = this.getTokenizedLineForBufferRow(editor, start);
          if ((startLine != null) && editor.indentationForBufferRow(start) === indent) {
            if (startLine.isComment()) {
              start -= 1;
            } else if ((parsed = this.parseTokenizedLine(startLine, character, config)) && parsed.valid) {
              this.setOffsets(offsets, parsed);
              startPoint.row = start;
              if (!hasPrefix && parsed.prefix) {
                hasPrefix = true;
              }
              start -= 1;
            } else {
              start = -1;
            }
          } else {
            start = -1;
          }
        }
        if (end < total + 1) {
          endLine = this.getTokenizedLineForBufferRow(editor, end);
          if ((endLine != null) && editor.indentationForBufferRow(end) === indent) {
            if (endLine.isComment()) {
              end += 1;
            } else if ((parsed = this.parseTokenizedLine(endLine, character, config)) && parsed.valid) {
              this.setOffsets(offsets, parsed);
              endPoint.row = end;
              if (!hasPrefix && parsed.prefix) {
                hasPrefix = true;
              }
              end += 1;
            } else {
              end = total + 1;
            }
          } else {
            end = total + 1;
          }
        }
      }
      if (hasPrefix) {
        offsets = offsets.map(function(item) {
          return item + 1;
        });
      }
      return {
        range: new Range(startPoint, endPoint),
        offset: offsets
      };
    },

    /*
    @name getTokenizedLineForBufferRow
    @description
    Get tokenized line
    @param {Editor} editor
    @param {Integer} row
    @returns {Array}
     */
    getTokenizedLineForBufferRow: function(editor, row) {
      return editor.displayBuffer.tokenizedBuffer.tokenizedLineForRow(row);
    },

    /*
    @name _formatTokenValue
    @description
    Convert invisibles in token to spaces or tabs
    @param {String} value
    @param {Token} token
    @param {Object} invisibles
    @returns {String}
    @private
     */
    _formatTokenValue: function(value, token, invisibles) {
      var leading, trailing;
      if (!token.hasInvisibleCharacters) {
        return value;
      }
      if (token.isHardTab) {
        return "\t";
      }
      if (token.firstNonWhitespaceIndex != null) {
        leading = value.substring(0, token.firstNonWhitespaceIndex);
        leading = this._formatInvisibleSpaces(leading, invisibles);
        value = leading + value.substring(token.firstNonWhitespaceIndex);
      }
      if (token.firstTrailingWhitespaceIndex != null) {
        trailing = value.substring(token.firstTrailingWhitespaceIndex);
        trailing = this._formatInvisibleSpaces(trailing, invisibles);
        value = value.substring(0, token.firstTrailingWhitespaceIndex) + trailing;
      }
      return value;
    },
    _formatInvisibleSpaces: function(string, invisibles) {
      if (invisibles.space != null) {
        string = string.replace(new RegExp(invisibles.space, 'g'), " ");
      }
      if (invisibles.tab != null) {
        string = string.replace(new RegExp(invisibles.tab, 'g'), "\t");
      }
      return string;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYWxpZ25lci9saWIvaGVscGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtREFBQTs7QUFBQSxFQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG1CQUFSLENBQWpCLENBQUE7O0FBQUEsRUFDQSxPQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FEUixDQUFBOztBQUFBLEVBR0EsZUFBQSxHQUFrQixTQUFDLE1BQUQsRUFBUyxRQUFULEVBQW1CLE9BQW5CLEdBQUE7QUFDaEIsUUFBQSwrQ0FBQTs7TUFEbUMsVUFBVTtLQUM3QztBQUFBLFNBQUEsNkNBQUE7eUJBQUE7QUFDRTtBQUFBLFdBQUEsOENBQUE7eUJBQUE7QUFDRSxRQUFBLElBQWlCLENBQUMsTUFBQSxHQUFTLFFBQVEsQ0FBQyxJQUFULENBQWMsT0FBZCxFQUF1QixJQUF2QixDQUFWLENBQWpCO0FBQUEsaUJBQU8sTUFBUCxDQUFBO1NBREY7QUFBQSxPQURGO0FBQUEsS0FEZ0I7RUFBQSxDQUhsQixDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FDQTtBQUFBO0FBQUE7Ozs7Ozs7T0FBQTtBQUFBLElBUUEsaUJBQUEsRUFBbUIsU0FBQyxNQUFELEVBQVMsR0FBVCxHQUFBO0FBQ2pCLFVBQUEsa0dBQUE7QUFBQSxNQUFBLFNBQUEsR0FBZ0IsSUFBQyxDQUFBLDRCQUFELENBQThCLE1BQTlCLEVBQXNDLEdBQXRDLENBQWhCLENBQUE7QUFBQSxNQUNBLGFBQUEsR0FBZ0IsTUFBTSxDQUFDLHNCQUFQLENBQUEsQ0FBK0IsQ0FBQyxhQUFoQyxDQUFBLENBQUEsSUFBbUQsTUFEbkUsQ0FBQTtBQUdBLE1BQUEsSUFBQSxDQUFBLFNBQUE7QUFBQSxlQUFPLElB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

//# sourceURL=/Users/anas/.atom/packages/aligner/lib/helper.coffee
