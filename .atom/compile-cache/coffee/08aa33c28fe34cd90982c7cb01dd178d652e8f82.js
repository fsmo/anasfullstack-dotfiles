(function() {
  var AtomFixPath;

  AtomFixPath = require('../lib/atom-fix-path');

  describe("AtomFixPath", function() {
    beforeEach(function() {
      return this.activationPromise = atom.packages.activatePackage('atom-fix-path');
    });
    return it('activates', function() {
      return waitsForPromise((function(_this) {
        return function() {
          return _this.activationPromise;
        };
      })(this));
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXRvbS1maXgtcGF0aC9zcGVjL2F0b20tZml4LXBhdGgtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsV0FBQTs7QUFBQSxFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsc0JBQVIsQ0FBZCxDQUFBOztBQUFBLEVBT0EsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBRXRCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsZUFBOUIsRUFEWjtJQUFBLENBQVgsQ0FBQSxDQUFBO1dBR0EsRUFBQSxDQUFHLFdBQUgsRUFBZ0IsU0FBQSxHQUFBO2FBQ2QsZUFBQSxDQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNkLEtBQUMsQ0FBQSxrQkFEYTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhCLEVBRGM7SUFBQSxDQUFoQixFQUxzQjtFQUFBLENBQXhCLENBUEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/anas/.atom/packages/atom-fix-path/spec/atom-fix-path-spec.coffee
