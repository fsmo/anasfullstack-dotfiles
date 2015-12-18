(function() {
  var AngularjsHelper, WorkspaceView;

  WorkspaceView = require('atom-space-pen-views').WorkspaceView;

  AngularjsHelper = require('../lib/angularjs-helper');

  describe("AngularjsHelper", function() {
    var activationPromise;
    activationPromise = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return activationPromise = atom.packages.activatePackage('angularjs-helper');
    });
    return describe("when the angularjs-helper:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(atom.workspaceView.find('.angularjs-helper')).not.toExist();
        atom.workspaceView.trigger('angularjs-helper:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(atom.workspaceView.find('.angularjs-helper')).toExist();
          atom.workspaceView.trigger('angularjs-helper:toggle');
          return expect(atom.workspaceView.find('.angularjs-helper')).not.toExist();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYW5ndWxhcmpzLWhlbHBlci9zcGVjL2FuZ3VsYXJqcy1oZWxwZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOEJBQUE7O0FBQUEsRUFBQyxnQkFBaUIsT0FBQSxDQUFRLHNCQUFSLEVBQWpCLGFBQUQsQ0FBQTs7QUFBQSxFQUNBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHlCQUFSLENBRGxCLENBQUE7O0FBQUEsRUFRQSxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQSxHQUFBO0FBQzFCLFFBQUEsaUJBQUE7QUFBQSxJQUFBLGlCQUFBLEdBQW9CLElBQXBCLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLElBQUksQ0FBQyxhQUFMLEdBQXFCLEdBQUEsQ0FBQSxhQUFyQixDQUFBO2FBQ0EsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGtCQUE5QixFQUZYO0lBQUEsQ0FBWCxDQUZBLENBQUE7V0FNQSxRQUFBLENBQVMscURBQVQsRUFBZ0UsU0FBQSxHQUFBO2FBQzlELEVBQUEsQ0FBRyxxQ0FBSCxFQUEwQyxTQUFBLEdBQUE7QUFDeEMsUUFBQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFuQixDQUF3QixtQkFBeEIsQ0FBUCxDQUFvRCxDQUFDLEdBQUcsQ0FBQyxPQUF6RCxDQUFBLENBQUEsQ0FBQTtBQUFBLFFBSUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQix5QkFBM0IsQ0FKQSxDQUFBO0FBQUEsUUFNQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxrQkFEYztRQUFBLENBQWhCLENBTkEsQ0FBQTtlQVNBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxVQUFBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQW5CLENBQXdCLG1CQUF4QixDQUFQLENBQW9ELENBQUMsT0FBckQsQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUNBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIseUJBQTNCLENBREEsQ0FBQTtpQkFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFuQixDQUF3QixtQkFBeEIsQ0FBUCxDQUFvRCxDQUFDLEdBQUcsQ0FBQyxPQUF6RCxDQUFBLEVBSEc7UUFBQSxDQUFMLEVBVndDO01BQUEsQ0FBMUMsRUFEOEQ7SUFBQSxDQUFoRSxFQVAwQjtFQUFBLENBQTVCLENBUkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/anas/.atom/packages/angularjs-helper/spec/angularjs-helper-spec.coffee
