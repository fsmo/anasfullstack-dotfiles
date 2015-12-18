(function() {
  var Aligner, Range, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Range = require('atom').Range;

  _ = require('lodash');

  module.exports = Aligner = (function() {
    function Aligner(editor, spaceChars, matcher, addSpacePostfix) {
      this.editor = editor;
      this.spaceChars = spaceChars;
      this.matcher = matcher;
      this.addSpacePostfix = addSpacePostfix;
      this.align = __bind(this.align, this);
      this.__computeRows = __bind(this.__computeRows, this);
      this.__computeLength = __bind(this.__computeLength, this);
      this.__generateAlignmentList = __bind(this.__generateAlignmentList, this);
      this.__getRows = __bind(this.__getRows, this);
      this.rows = [];
      this.alignments = [];
    }

    Aligner.prototype.__getRows = function() {
      var allCursors, cursor, cursors, l, o, range, ranges, row, rowNums, t, _i, _j, _k, _len, _len1, _len2;
      rowNums = [];
      allCursors = [];
      cursors = _.filter(this.editor.getCursors(), function(cursor) {
        var row;
        allCursors.push(cursor);
        row = cursor.getBufferRow();
        if (cursor.visible && !_.contains(rowNums, row)) {
          rowNums.push(row);
          return true;
        }
      });
      if (cursors.length > 1) {
        this.mode = "cursor";
        for (_i = 0, _len = cursors.length; _i < _len; _i++) {
          cursor = cursors[_i];
          row = cursor.getBufferRow();
          t = this.editor.lineTextForBufferRow(row);
          l = this.__computeLength(t.substring(0, cursor.getBufferColumn()));
          o = {
            text: t,
            length: t.length,
            row: row,
            column: l,
            virtualColumn: cursor.getBufferColumn()
          };
          this.rows.push(o);
        }
      } else {
        ranges = this.editor.getSelectedBufferRanges();
        for (_j = 0, _len1 = ranges.length; _j < _len1; _j++) {
          range = ranges[_j];
          rowNums = rowNums.concat(range.getRows());
          if (range.end.column === 0) {
            rowNums.pop();
          }
        }
        for (_k = 0, _len2 = rowNums.length; _k < _len2; _k++) {
          row = rowNums[_k];
          o = {
            text: this.editor.lineTextForBufferRow(row),
            length: this.editor.lineTextForBufferRow(row).length,
            row: row
          };
          this.rows.push(o);
        }
        this.mode = "align";
      }
      if (this.mode !== "cursor") {
        return this.rows.forEach(function(o) {
          var firstCharIdx;
          t = o.text.replace(/\s/g, '');
          if (t.length > 0) {
            firstCharIdx = o.text.indexOf(t.charAt(0));
            return o.text = o.text.substr(0, firstCharIdx) + o.text.substring(firstCharIdx).replace(/\ {2,}/g, ' ');
          }
        });
      }
    };

    Aligner.prototype.__getAllIndexes = function(string, val, indexes) {
      var found, i;
      found = [];
      i = 0;
      while (true) {
        i = string.indexOf(val, i);
        if (i !== -1 && !_.some(indexes, {
          index: i
        })) {
          found.push({
            found: val,
            index: i
          });
        }
        if (i === -1) {
          break;
        }
        i++;
      }
      return found;
    };

    Aligner.prototype.__generateAlignmentList = function() {
      if (this.mode === "cursor") {
        return _.forEach(this.rows, (function(_this) {
          return function(o) {
            var part;
            part = o.text.substring(o.virtualColumn);
            _.forEach(_this.spaceChars, function(char) {
              var idx;
              idx = part.indexOf(char);
              if (idx === 0 && o.text.charAt(o.virtualColumn) !== " ") {
                o.addSpacePrefix = true;
                o.spaceCharLength = char.length;
                return false;
              }
            });
          };
        })(this));
      } else {
        _.forEach(this.rows, (function(_this) {
          return function(o) {
            _.forEach(_this.matcher, function(possibleMatcher) {
              return _this.alignments = _this.alignments.concat(_this.__getAllIndexes(o.text, possibleMatcher, _this.alignments));
            });
            if (_this.alignments.length > 0) {
              return false;
            } else {
              return true;
            }
          };
        })(this));
        this.alignments = this.alignments.sort(function(a, b) {
          return a.index - b.index;
        });
        this.alignments = _.pluck(this.alignments, "found");
      }
    };

    Aligner.prototype.__computeLength = function(s) {
      var char, diff, idx, tabLength, tabs, _i, _len;
      diff = tabs = idx = 0;
      tabLength = this.editor.getTabLength();
      for (_i = 0, _len = s.length; _i < _len; _i++) {
        char = s[_i];
        if (char === "\t") {
          diff += tabLength - (idx % tabLength);
          idx += tabLength - (idx % tabLength);
          tabs++;
        } else {
          idx++;
        }
      }
      return s.length + diff - tabs;
    };

    Aligner.prototype.__computeRows = function() {
      var addSpacePrefix, idx, matched, max, possibleMatcher;
      max = 0;
      if (this.mode === "align" || this.mode === "break") {
        matched = null;
        idx = -1;
        possibleMatcher = this.alignments.shift();
        addSpacePrefix = this.spaceChars.indexOf(possibleMatcher) > -1;
        this.rows.forEach((function(_this) {
          return function(o) {
            var backslash, blankPos, c, charFound, doubleQuotationMark, found, l, len, line, next, quotationMark, splitString;
            o.splited = null;
            if (!o.done) {
              line = o.text;
              if (line.indexOf(possibleMatcher, o.nextPos) !== -1) {
                matched = possibleMatcher;
                idx = line.indexOf(matched, o.nextPos);
                len = matched.length;
                if (_this.mode === "break") {
                  idx += len - 1;
                  c = "";
                  blankPos = -1;
                  quotationMark = doubleQuotationMark = 0;
                  backslash = charFound = false;
                  while (true) {
                    if (c === void 0) {
                      break;
                    }
                    c = line[++idx];
                    if (c === "'" && !backslash) {
                      quotationMark++;
                    }
                    if (c === '"' && !backslash) {
                      doubleQuotationMark++;
                    }
                    backslash = c === "\\" && !backslash ? true : false;
                    charFound = c !== " " && !charFound ? true : charFound;
                    if (c === " " && quotationMark % 2 === 0 && doubleQuotationMark % 2 === 0 && charFound) {
                      blankPos = idx;
                      break;
                    }
                  }
                  idx = blankPos;
                }
                next = _this.mode === "break" ? 1 : len;
                if (idx !== -1) {
                  splitString = [line.substring(0, idx), line.substring(idx + next)];
                  o.splited = splitString;
                  l = _this.__computeLength(splitString[0]);
                  if (max <= l) {
                    max = l;
                    if (l > 0 && addSpacePrefix && splitString[0].charAt(splitString[0].length - 1) !== " ") {
                      max++;
                    }
                  }
                }
              }
              found = false;
              _.forEach(_this.alignments, function(nextPossibleMatcher) {
                if (line.indexOf(nextPossibleMatcher, idx + len) !== -1) {
                  found = true;
                  return false;
                }
              });
              o.stop = !found;
            }
          };
        })(this));
        if (max >= 0) {
          if (max > 0) {
            max++;
          }
          this.rows.forEach((function(_this) {
            return function(o) {
              var diff, splitString;
              if (!o.done && o.splited && matched) {
                splitString = o.splited;
                diff = max - _this.__computeLength(splitString[0]);
                if (diff > 0) {
                  splitString[0] = splitString[0] + Array(diff).join(' ');
                }
                if (_this.addSpacePostfix && addSpacePrefix) {
                  splitString[1] = " " + splitString[1].trim();
                }
                if (_this.mode === "break") {
                  _.forEach(splitString, function(s, i) {
                    return splitString[i] = s.trim();
                  });
                  o.text = splitString.join("\n");
                } else {
                  o.text = splitString.join(matched);
                }
                o.done = o.stop;
                o.nextPos = splitString[0].length + matched.length;
              }
            };
          })(this));
        }
        return this.alignments.length > 0;
      } else {
        this.rows.forEach(function(o) {
          var part;
          if (max <= o.column) {
            max = o.column;
            part = o.text.substring(0, o.virtualColumn);
            if (part.length > 0 && o.addSpacePrefix && part.charAt(part.length - 1) !== " ") {
              max++;
            }
          }
        });
        max++;
        this.rows.forEach((function(_this) {
          return function(o) {
            var diff, line, splitString;
            line = o.text;
            splitString = [line.substring(0, o.virtualColumn), line.substring(o.virtualColumn)];
            diff = max - _this.__computeLength(splitString[0]);
            if (diff > 0) {
              splitString[0] = splitString[0] + Array(diff).join(' ');
            }
            if (o.spaceCharLength == null) {
              o.spaceCharLength = 0;
            }
            splitString[1] = splitString[1].substring(0, o.spaceCharLength) + splitString[1].substr(o.spaceCharLength).trim();
            if (_this.addSpacePostfix && o.addSpacePrefix) {
              splitString[1] = splitString[1].substring(0, o.spaceCharLength) + " " + splitString[1].substr(o.spaceCharLength);
            }
            o.text = splitString.join("");
          };
        })(this));
        return false;
      }
    };

    Aligner.prototype.align = function(multiple) {
      var cont;
      this.__getRows();
      this.__generateAlignmentList();
      if (this.rows.length === 1 && multiple) {
        this.mode = "break";
      }
      if (multiple || this.mode === "break") {
        while (true) {
          cont = this.__computeRows();
          if (!cont) {
            break;
          }
        }
      } else {
        this.__computeRows();
      }
      return this.rows.forEach((function(_this) {
        return function(o) {
          return _this.editor.setTextInBufferRange([[o.row, 0], [o.row, o.length]], o.text);
        };
      })(this));
    };

    return Aligner;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXRvbS1hbGlnbm1lbnQvbGliL2FsaWduZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlCQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBRkosQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ1U7QUFFVyxJQUFBLGlCQUFFLE1BQUYsRUFBVyxVQUFYLEVBQXdCLE9BQXhCLEVBQWtDLGVBQWxDLEdBQUE7QUFDVCxNQURVLElBQUMsQ0FBQSxTQUFBLE1BQ1gsQ0FBQTtBQUFBLE1BRG1CLElBQUMsQ0FBQSxhQUFBLFVBQ3BCLENBQUE7QUFBQSxNQURnQyxJQUFDLENBQUEsVUFBQSxPQUNqQyxDQUFBO0FBQUEsTUFEMEMsSUFBQyxDQUFBLGtCQUFBLGVBQzNDLENBQUE7QUFBQSwyQ0FBQSxDQUFBO0FBQUEsMkRBQUEsQ0FBQTtBQUFBLCtEQUFBLENBQUE7QUFBQSwrRUFBQSxDQUFBO0FBQUEsbURBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxFQUFSLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxVQUFELEdBQWMsRUFEZCxDQURTO0lBQUEsQ0FBYjs7QUFBQSxzQkFLQSxTQUFBLEdBQVcsU0FBQSxHQUFBO0FBQ1AsVUFBQSxpR0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLEVBQVYsQ0FBQTtBQUFBLE1BQ0EsVUFBQSxHQUFhLEVBRGIsQ0FBQTtBQUFBLE1BRUEsT0FBQSxHQUFVLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQUEsQ0FBVCxFQUErQixTQUFDLE1BQUQs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

//# sourceURL=/Users/anas/.atom/packages/atom-alignment/lib/aligner.coffee
