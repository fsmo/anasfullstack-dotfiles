(function() {
  var helpers,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  helpers = require('./spec-helper');

  describe("Vim Surround activation", function() {
    var chars, configPairs, editor, editorElement, names, pairs, vimSurround, _ref;
    _ref = [], editor = _ref[0], pairs = _ref[1], editorElement = _ref[2], vimSurround = _ref[3], configPairs = _ref[4], chars = _ref[5], names = _ref[6];
    beforeEach(function() {
      pairs = ['()', '{}', '[]', '""', "''"];
      atom.config.set('vim-surround.pairs', pairs);
      vimSurround = atom.packages.loadPackage('vim-surround');
      vimSurround.activate();
      configPairs = atom.config.get('vim-surround.pairs');
      return helpers.getEditorElement(function(element) {
        var editorClassList;
        editorElement = element;
        editor = editorElement.getModel();
        editorClassList = editorElement.classList;
        editorClassList.add('editor');
        editorClassList.add('vim-mode');
        return editorClassList.add('visual-mode');
      });
    });
    return describe("When the vim-surround module loads", function() {
      beforeEach(function() {
        var commands;
        chars = [];
        pairs.forEach(function(pair) {
          var char, i, _i, _ref1, _results;
          _results = [];
          for (i = _i = 0, _ref1 = pair.length - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
            char = pair[i];
            if (__indexOf.call(chars, char) < 0) {
              _results.push(chars.push(char));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        });
        commands = atom.commands.findCommands({
          target: editorElement
        });
        names = [];
        return commands.forEach(function(command) {
          return names.push(command.name);
        });
      });
      it("Creates a surround command for each configured pair character", function() {
        return chars.forEach(function(char) {
          return expect(names).toContain("vim-surround:surround-" + char);
        });
      });
      describe("and the list of pairs changes", function() {
        beforeEach(function() {
          var command, commands;
          pairs = ['()', '{}', '[]', '""', "-+"];
          atom.config.set('vim-surround.pairs', pairs);
          commands = atom.commands.findCommands({
            target: editorElement
          });
          names = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = commands.length; _i < _len; _i++) {
              command = commands[_i];
              _results.push(command.name);
            }
            return _results;
          })();
          chars = [];
          return pairs.forEach(function(pair) {
            var char, i, _i, _ref1, _results;
            _results = [];
            for (i = _i = 0, _ref1 = pair.length - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
              char = pair[i];
              if (__indexOf.call(chars, char) < 0) {
                _results.push(chars.push(char));
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          });
        });
        it("should add any new pairs.", function() {
          return chars.forEach(function(char) {
            return expect(names).toContain("vim-surround:surround-" + char);
          });
        });
        return it("should remove any old pairs.", function() {
          return expect(names).not.toContain("vim-surround:surround-'");
        });
      });
      return describe("and then deactivates", function() {
        beforeEach(function() {
          var command, commands;
          vimSurround.deactivate();
          commands = atom.commands.findCommands({
            target: editorElement
          });
          return names = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = commands.length; _i < _len; _i++) {
              command = commands[_i];
              _results.push(command.name);
            }
            return _results;
          })();
        });
        return it("should clear out all commands from the registry", function() {
          return chars.forEach(function(char) {
            return expect(names).not.toContain("vim-surround:surround-" + char);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvdmltLXN1cnJvdW5kL3NwZWMvdmltLXN1cnJvdW5kLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLE9BQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsZUFBUixDQUFWLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMseUJBQVQsRUFBb0MsU0FBQSxHQUFBO0FBQ2xDLFFBQUEsMEVBQUE7QUFBQSxJQUFBLE9BQXlFLEVBQXpFLEVBQUMsZ0JBQUQsRUFBUyxlQUFULEVBQWdCLHVCQUFoQixFQUErQixxQkFBL0IsRUFBNEMscUJBQTVDLEVBQXlELGVBQXpELEVBQWdFLGVBQWhFLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLEtBQUEsR0FBUSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixFQUF5QixJQUF6QixDQUFSLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQkFBaEIsRUFBc0MsS0FBdEMsQ0FEQSxDQUFBO0FBQUEsTUFHQSxXQUFBLEdBQWMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFkLENBQTBCLGNBQTFCLENBSGQsQ0FBQTtBQUFBLE1BSUEsV0FBVyxDQUFDLFFBQVosQ0FBQSxDQUpBLENBQUE7QUFBQSxNQU1BLFdBQUEsR0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0JBQWhCLENBTmQsQ0FBQTthQVFBLE9BQU8sQ0FBQyxnQkFBUixDQUF5QixTQUFDLE9BQUQsR0FBQTtBQUN2QixZQUFBLGVBQUE7QUFBQSxRQUFBLGFBQUEsR0FBZ0IsT0FBaEIsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxHQUFTLGFBQWEsQ0FBQyxRQUFkLENBQUEsQ0FEVCxDQUFBO0FBQUEsUUFHQSxlQUFBLEdBQWtCLGFBQWEsQ0FBQyxTQUhoQyxDQUFBO0FBQUEsUUFLQSxlQUFlLENBQUMsR0FBaEIsQ0FBb0IsUUFBcEIsQ0FMQSxDQUFBO0FBQUEsUUFNQSxlQUFlLENBQUMsR0FBaEIsQ0FBb0IsVUFBcEIsQ0FOQSxDQUFBO2VBT0EsZUFBZSxDQUFDLEdBQWhCLENBQW9CLGFBQXBCLEVBUnVCO01BQUEsQ0FBekIsRUFUUztJQUFBLENBQVgsQ0FGQSxDQUFBO1dBc0JBLFFBQUEsQ0FBUyxvQ0FBVCxFQUErQyxTQUFBLEdBQUE7QUFDN0MsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsWUFBQSxRQUFBO0FBQUEsUUFBQSxLQUFBLEdBQVEsRUFBUixDQUFBO0FBQUEsUUFDQSxLQUFLLENBQUMsT0FBTixDQUFjLFNBQUMsSUFBRCxHQUFBO0FBQ1osY0FBQSw0QkFBQTtBQUFBO2VBQVMseUdBQVQsR0FBQTtBQUNFLFlBQUEsSUFBQSxHQUFPLElBQUssQ0FBQSxDQUFBLENBQVosQ0FBQTtBQUNBLFlBQUEsSUFBdUIsZUFBUSxLQUFSLEVBQUEsSUFBQSxLQUF2Qjs0QkFBQSxLQUFLLENBQUMsSUFBTixDQUFXLElBQVgsR0FBQTthQUFBLE1BQUE7b0NBQUE7YUFGRjtBQUFBOzBCQURZO1FBQUEsQ0FBZCxDQURBLENBQUE7QUFBQSxRQU1BLFFBQUEsR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQWQsQ0FBMkI7QUFBQSxVQUFBLE1BQUEsRUFBUSxhQUFSO1NBQTNCLENBTlgsQ0FBQTtBQUFBLFFBUUEsS0FBQSxHQUFRLEVBUlIsQ0FBQTtlQVNBLFFBQVEsQ0FBQyxPQUFULENBQWlCLFNBQUMsT0FBRCxHQUFBO2lCQUNmLEtBQUssQ0FBQyxJQUFOLENBQVcsT0FBTyxDQUFDLElBQW5CLEVBRGU7UUFBQSxDQUFqQixFQVZTO01BQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxNQWFBLEVBQUEsQ0FBRywrREFBSCxFQUFvRSxTQUFBLEdBQUE7ZUFDbEUsS0FBSyxDQUFDLE9BQU4sQ0FBYyxTQUFDLElBQUQsR0FBQTtpQkFDWixNQUFBLENBQU8sS0FBUCxDQUFhLENBQUMsU0FBZCxDQUF5Qix3QkFBQSxHQUF3QixJQUFqRCxFQURZO1FBQUEsQ0FBZCxFQURrRTtNQUFBLENBQXBFLENBYkEsQ0FBQTtBQUFBLE1BaUJBLFFBQUEsQ0FBUywrQkFBVCxFQUEwQyxTQUFBLEdBQUE7QUFDeEMsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsY0FBQSxpQkFBQTtBQUFBLFVBQUEsS0FBQSxHQUFRLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLEVBQXlCLElBQXpCLENBQVIsQ0FBQTtBQUFBLFVBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9CQUFoQixFQUFzQyxLQUF0QyxDQURBLENBQUE7QUFBQSxVQUVBLFFBQUEsR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQWQsQ0FBMkI7QUFBQSxZQUFBLE1BQUEsRUFBUSxhQUFSO1dBQTNCLENBRlgsQ0FBQTtBQUFBLFVBR0EsS0FBQTs7QUFBUztpQkFBQSwrQ0FBQTtxQ0FBQTtBQUFBLDRCQUFBLE9BQU8sQ0FBQyxLQUFSLENBQUE7QUFBQTs7Y0FIVCxDQUFBO0FBQUEsVUFJQSxLQUFBLEdBQVEsRUFKUixDQUFBO2lCQUtBLEtBQUssQ0FBQyxPQUFOLENBQWMsU0FBQyxJQUFELEdBQUE7QUFDWixnQkFBQSw0QkFBQTtBQUFBO2lCQUFTLHlHQUFULEdBQUE7QUFDRSxjQUFBLElBQUEsR0FBTyxJQUFLLENBQUEsQ0FBQSxDQUFaLENBQUE7QUFDQSxjQUFBLElBQXVCLGVBQVEsS0FBUixFQUFBLElBQUEsS0FBdkI7OEJBQUEsS0FBSyxDQUFDLElBQU4sQ0FBVyxJQUFYLEdBQUE7ZUFBQSxNQUFBO3NDQUFBO2VBRkY7QUFBQTs0QkFEWTtVQUFBLENBQWQsRUFOUztRQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsUUFXQSxFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQSxHQUFBO2lCQUM5QixLQUFLLENBQUMsT0FBTixDQUFjLFNBQUMsSUFBRCxHQUFBO21CQUNaLE1BQUEsQ0FBTyxLQUFQLENBQWEsQ0FBQyxTQUFkLENBQXlCLHdCQUFBLEdBQXdCLElBQWpELEVBRFk7VUFBQSxDQUFkLEVBRDhCO1FBQUEsQ0FBaEMsQ0FYQSxDQUFBO2VBZUEsRUFBQSxDQUFHLDhCQUFILEVBQW1DLFNBQUEsR0FBQTtpQkFDakMsTUFBQSxDQUFPLEtBQVAsQ0FBYSxDQUFDLEdBQUcsQ0FBQyxTQUFsQixDQUE0Qix5QkFBNUIsRUFEaUM7UUFBQSxDQUFuQyxFQWhCd0M7TUFBQSxDQUExQyxDQWpCQSxDQUFBO2FBb0NBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBLEdBQUE7QUFFL0IsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsY0FBQSxpQkFBQTtBQUFBLFVBQUEsV0FBVyxDQUFDLFVBQVosQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUNBLFFBQUEsR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQWQsQ0FBMkI7QUFBQSxZQUFBLE1BQUEsRUFBUSxhQUFSO1dBQTNCLENBRFgsQ0FBQTtpQkFFQSxLQUFBOztBQUFTO2lCQUFBLCtDQUFBO3FDQUFBO0FBQUEsNEJBQUEsT0FBTyxDQUFDLEtBQVIsQ0FBQTtBQUFBOztlQUhBO1FBQUEsQ0FBWCxDQUFBLENBQUE7ZUFLQSxFQUFBLENBQUcsaURBQUgsRUFBc0QsU0FBQSxHQUFBO2lCQUNwRCxLQUFLLENBQUMsT0FBTixDQUFjLFNBQUMsSUFBRCxHQUFBO21CQUNaLE1BQUEsQ0FBTyxLQUFQLENBQWEsQ0FBQyxHQUFHLENBQUMsU0FBbEIsQ0FBNkIsd0JBQUEsR0FBd0IsSUFBckQsRUFEWTtVQUFBLENBQWQsRUFEb0Q7UUFBQSxDQUF0RCxFQVArQjtNQUFBLENBQWpDLEVBckM2QztJQUFBLENBQS9DLEVBdkJrQztFQUFBLENBQXBDLENBRkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/anas/.atom/packages/vim-surround/spec/vim-surround-spec.coffee
