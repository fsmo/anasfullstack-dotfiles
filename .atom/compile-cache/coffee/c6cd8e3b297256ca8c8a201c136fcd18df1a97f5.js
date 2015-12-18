(function() {
  var Aligner, alignLines, alignLinesMultiple;

  Aligner = require('./aligner');

  module.exports = {
    config: {
      alignmentSpaceChars: {
        type: 'array',
        "default": ['=>', ':=', '='],
        items: {
          type: "string"
        },
        description: "insert space in front of the character (a=1 > a =1)",
        order: 2
      },
      alignBy: {
        type: 'array',
        "default": ['=>', ':=', ':', '='],
        items: {
          type: "string"
        },
        description: "consider the order, the left most matching value is taken to compute the alignment",
        order: 1
      },
      addSpacePostfix: {
        type: 'boolean',
        "default": false,
        description: "insert space after the matching character (a=1 > a= 1) if character is part of the 'alignment space chars'",
        order: 3
      }
    },
    activate: function(state) {
      return atom.commands.add('atom-workspace', {
        'atom-alignment:align': function() {
          var editor;
          editor = atom.workspace.getActivePaneItem();
          return alignLines(editor);
        },
        'atom-alignment:alignMultiple': function() {
          var editor;
          editor = atom.workspace.getActivePaneItem();
          return alignLinesMultiple(editor);
        }
      });
    }
  };

  alignLines = function(editor) {
    var a, addSpacePostfix, matcher, spaceChars;
    spaceChars = atom.config.get('atom-alignment.alignmentSpaceChars');
    matcher = atom.config.get('atom-alignment.alignBy');
    addSpacePostfix = atom.config.get('atom-alignment.addSpacePostfix');
    a = new Aligner(editor, spaceChars, matcher, addSpacePostfix);
    a.align(false);
  };

  alignLinesMultiple = function(editor) {
    var a, addSpacePostfix, matcher, spaceChars;
    spaceChars = atom.config.get('atom-alignment.alignmentSpaceChars');
    matcher = atom.config.get('atom-alignment.alignBy');
    addSpacePostfix = atom.config.get('atom-alignment.addSpacePostfix');
    a = new Aligner(editor, spaceChars, matcher, addSpacePostfix);
    a.align(true);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXRvbS1hbGlnbm1lbnQvbGliL2F0b20tYWxpZ25tZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1Q0FBQTs7QUFBQSxFQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUFWLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNJO0FBQUEsSUFBQSxNQUFBLEVBQ0k7QUFBQSxNQUFBLG1CQUFBLEVBQ0k7QUFBQSxRQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLEdBQWIsQ0FEVDtBQUFBLFFBRUEsS0FBQSxFQUNJO0FBQUEsVUFBQSxJQUFBLEVBQU0sUUFBTjtTQUhKO0FBQUEsUUFJQSxXQUFBLEVBQWEscURBSmI7QUFBQSxRQUtBLEtBQUEsRUFBTyxDQUxQO09BREo7QUFBQSxNQU9BLE9BQUEsRUFDSTtBQUFBLFFBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsR0FBYixFQUFrQixHQUFsQixDQURUO0FBQUEsUUFFQSxLQUFBLEVBQ0k7QUFBQSxVQUFBLElBQUEsRUFBTSxRQUFOO1NBSEo7QUFBQSxRQUlBLFdBQUEsRUFBYSxvRkFKYjtBQUFBLFFBS0EsS0FBQSxFQUFPLENBTFA7T0FSSjtBQUFBLE1BY0EsZUFBQSxFQUNJO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSw0R0FGYjtBQUFBLFFBR0EsS0FBQSxFQUFPLENBSFA7T0FmSjtLQURKO0FBQUEsSUFxQkEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ04sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNJO0FBQUEsUUFBQSxzQkFBQSxFQUF3QixTQUFBLEdBQUE7QUFDcEIsY0FBQSxNQUFBO0FBQUEsVUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBZixDQUFBLENBQVQsQ0FBQTtpQkFDQSxVQUFBLENBQVcsTUFBWCxFQUZvQjtRQUFBLENBQXhCO0FBQUEsUUFJQSw4QkFBQSxFQUFnQyxTQUFBLEdBQUE7QUFDNUIsY0FBQSxNQUFBO0FBQUEsVUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBZixDQUFBLENBQVQsQ0FBQTtpQkFDQSxrQkFBQSxDQUFtQixNQUFuQixFQUY0QjtRQUFBLENBSmhDO09BREosRUFETTtJQUFBLENBckJWO0dBSEosQ0FBQTs7QUFBQSxFQWtDQSxVQUFBLEdBQWEsU0FBQyxNQUFELEdBQUE7QUFDVCxRQUFBLHVDQUFBO0FBQUEsSUFBQSxVQUFBLEdBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQ0FBaEIsQ0FBbkIsQ0FBQTtBQUFBLElBQ0EsT0FBQSxHQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCLENBRG5CLENBQUE7QUFBQSxJQUVBLGVBQUEsR0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQixDQUZuQixDQUFBO0FBQUEsSUFHQSxDQUFBLEdBQVEsSUFBQSxPQUFBLENBQVEsTUFBUixFQUFnQixVQUFoQixFQUE0QixPQUE1QixFQUFxQyxlQUFyQyxDQUhSLENBQUE7QUFBQSxJQUlBLENBQUMsQ0FBQyxLQUFGLENBQVEsS0FBUixDQUpBLENBRFM7RUFBQSxDQWxDYixDQUFBOztBQUFBLEVBMENBLGtCQUFBLEdBQXFCLFNBQUMsTUFBRCxHQUFBO0FBQ2pCLFFBQUEsdUNBQUE7QUFBQSxJQUFBLFVBQUEsR0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9DQUFoQixDQUFuQixDQUFBO0FBQUEsSUFDQSxPQUFBLEdBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsQ0FEbkIsQ0FBQTtBQUFBLElBRUEsZUFBQSxHQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCLENBRm5CLENBQUE7QUFBQSxJQUdBLENBQUEsR0FBUSxJQUFBLE9BQUEsQ0FBUSxNQUFSLEVBQWdCLFVBQWhCLEVBQTRCLE9BQTVCLEVBQXFDLGVBQXJDLENBSFIsQ0FBQTtBQUFBLElBSUEsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxJQUFSLENBSkEsQ0FEaUI7RUFBQSxDQTFDckIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/anas/.atom/packages/atom-alignment/lib/atom-alignment.coffee
