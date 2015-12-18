(function() {
  var ClipboardHistory, WorkspaceView;

  WorkspaceView = require('atom').WorkspaceView;

  ClipboardHistory = require('../lib/clipboard-history');

  describe("ClipboardHistory", function() {
    var activationPromise;
    activationPromise = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return activationPromise = atom.packages.activatePackage('clipboard-history');
    });
    return describe("when the clipboard-history:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(atom.workspaceView.find('.clipboard-history')).not.toExist();
        atom.workspaceView.trigger('clipboard-history:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(atom.workspaceView.find('.clipboard-history')).toExist();
          atom.workspaceView.trigger('clipboard-history:toggle');
          return expect(atom.workspaceView.find('.clipboard-history')).not.toExist();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvY2xpcGJvYXJkLWhpc3Rvcnkvc3BlYy9jbGlwYm9hcmQtaGlzdG9yeS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrQkFBQTs7QUFBQSxFQUFDLGdCQUFpQixPQUFBLENBQVEsTUFBUixFQUFqQixhQUFELENBQUE7O0FBQUEsRUFDQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsMEJBQVIsQ0FEbkIsQ0FBQTs7QUFBQSxFQVFBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsUUFBQSxpQkFBQTtBQUFBLElBQUEsaUJBQUEsR0FBb0IsSUFBcEIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBSSxDQUFDLGFBQUwsR0FBcUIsR0FBQSxDQUFBLGFBQXJCLENBQUE7YUFDQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsbUJBQTlCLEVBRlg7SUFBQSxDQUFYLENBRkEsQ0FBQTtXQU1BLFFBQUEsQ0FBUyxzREFBVCxFQUFpRSxTQUFBLEdBQUE7YUFDL0QsRUFBQSxDQUFHLHFDQUFILEVBQTBDLFNBQUEsR0FBQTtBQUN4QyxRQUFBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQW5CLENBQXdCLG9CQUF4QixDQUFQLENBQXFELENBQUMsR0FBRyxDQUFDLE9BQTFELENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFJQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLDBCQUEzQixDQUpBLENBQUE7QUFBQSxRQU1BLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLGtCQURjO1FBQUEsQ0FBaEIsQ0FOQSxDQUFBO2VBU0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFVBQUEsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBbkIsQ0FBd0Isb0JBQXhCLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUFBLENBQUEsQ0FBQTtBQUFBLFVBQ0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQiwwQkFBM0IsQ0FEQSxDQUFBO2lCQUVBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQW5CLENBQXdCLG9CQUF4QixDQUFQLENBQXFELENBQUMsR0FBRyxDQUFDLE9BQTFELENBQUEsRUFIRztRQUFBLENBQUwsRUFWd0M7TUFBQSxDQUExQyxFQUQrRDtJQUFBLENBQWpFLEVBUDJCO0VBQUEsQ0FBN0IsQ0FSQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/anas/.atom/packages/clipboard-history/spec/clipboard-history-spec.coffee
