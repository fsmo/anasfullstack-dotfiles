(function() {
  var decimal, float, int, namePrefixes, percent, variables;

  int = '\\d+';

  decimal = "\\." + int;

  float = "(?:" + int + "|" + int + decimal + "|" + decimal + ")";

  percent = "" + float + "%";

  variables = '(@[a-zA-Z0-9\\-_]+|\\$[a-zA-Z0-9\\-_]+|[a-zA-Z_][a-zA-Z0-9\\-_]*)';

  namePrefixes = '^| |:|=|,|\\n|\'|"|\\(|\\[|\\{';

  module.exports = {
    int: int,
    float: float,
    percent: percent,
    optionalPercent: "" + float + "%?",
    intOrPercent: "(" + percent + "|" + int + ")",
    floatOrPercent: "(" + percent + "|" + float + ")",
    comma: '\\s*,\\s*',
    notQuote: "[^\"'\\n]+",
    hexadecimal: '[\\da-fA-F]',
    ps: '\\(\\s*',
    pe: '\\s*\\)',
    variables: variables,
    namePrefixes: namePrefixes,
    createVariableRegExpString: function(variables) {
      var v, variableNames, _i, _len;
      variableNames = [];
      for (_i = 0, _len = variables.length; _i < _len; _i++) {
        v = variables[_i];
        variableNames.push(v.name.replace(/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"));
      }
      variableNames = variableNames.join('|');
      return "(" + namePrefixes + ")(" + variableNames + ")(?!_|-|\\w|\\d|[ \\t]*[\\.:=])";
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL3JlZ2V4ZXMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFEQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE1BQU4sQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVyxLQUFBLEdBQUssR0FEaEIsQ0FBQTs7QUFBQSxFQUVBLEtBQUEsR0FBUyxLQUFBLEdBQUssR0FBTCxHQUFTLEdBQVQsR0FBWSxHQUFaLEdBQWtCLE9BQWxCLEdBQTBCLEdBQTFCLEdBQTZCLE9BQTdCLEdBQXFDLEdBRjlDLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQVUsRUFBQSxHQUFHLEtBQUgsR0FBUyxHQUhuQixDQUFBOztBQUFBLEVBSUEsU0FBQSxHQUFZLG1FQUpaLENBQUE7O0FBQUEsRUFLQSxZQUFBLEdBQWUsZ0NBTGYsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLEdBQUEsRUFBSyxHQUFMO0FBQUEsSUFDQSxLQUFBLEVBQU8sS0FEUDtBQUFBLElBRUEsT0FBQSxFQUFTLE9BRlQ7QUFBQSxJQUdBLGVBQUEsRUFBaUIsRUFBQSxHQUFHLEtBQUgsR0FBUyxJQUgxQjtBQUFBLElBSUEsWUFBQSxFQUFlLEdBQUEsR0FBRyxPQUFILEdBQVcsR0FBWCxHQUFjLEdBQWQsR0FBa0IsR0FKakM7QUFBQSxJQUtBLGNBQUEsRUFBaUIsR0FBQSxHQUFHLE9BQUgsR0FBVyxHQUFYLEdBQWMsS0FBZCxHQUFvQixHQUxyQztBQUFBLElBTUEsS0FBQSxFQUFPLFdBTlA7QUFBQSxJQU9BLFFBQUEsRUFBVSxZQVBWO0FBQUEsSUFRQSxXQUFBLEVBQWEsYUFSYjtBQUFBLElBU0EsRUFBQSxFQUFJLFNBVEo7QUFBQSxJQVVBLEVBQUEsRUFBSSxTQVZKO0FBQUEsSUFXQSxTQUFBLEVBQVcsU0FYWDtBQUFBLElBWUEsWUFBQSxFQUFjLFlBWmQ7QUFBQSxJQWFBLDBCQUFBLEVBQTRCLFNBQUMsU0FBRCxHQUFBO0FBQzFCLFVBQUEsMEJBQUE7QUFBQSxNQUFBLGFBQUEsR0FBZ0IsRUFBaEIsQ0FBQTtBQUNBLFdBQUEsZ0RBQUE7MEJBQUE7QUFDRSxRQUFBLGFBQWEsQ0FBQyxJQUFkLENBQW1CLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBUCxDQUFlLG9DQUFmLEVBQXFELE1BQXJELENBQW5CLENBQUEsQ0FERjtBQUFBLE9BREE7QUFBQSxNQUdBLGFBQUEsR0FBZ0IsYUFBYSxDQUFDLElBQWQsQ0FBbUIsR0FBbkIsQ0FIaEIsQ0FBQTthQUtDLEdBQUEsR0FBRyxZQUFILEdBQWdCLElBQWhCLEdBQW9CLGFBQXBCLEdBQWtDLGtDQU5UO0lBQUEsQ0FiNUI7R0FSRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/anas/.atom/packages/pigments/lib/regexes.coffee
