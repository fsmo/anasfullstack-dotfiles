(function() {
  var operatorConfig, providerManager;

  providerManager = require('../lib/provider-manager');

  operatorConfig = require('../lib/operator-config');

  describe('ProviderManager', function() {
    var provider;
    provider = {
      selector: ['.source.coffee'],
      id: 'aligner-coffee',
      config: {
        ':-alignment': 'left'
      }
    };
    describe('registering a provider', function() {
      var disposable;
      disposable = null;
      beforeEach(function() {
        spyOn(operatorConfig, 'add').andCallThrough();
        spyOn(atom.config, 'observe').andCallThrough();
        return disposable = providerManager.register(provider);
      });
      afterEach(function() {
        return disposable.dispose();
      });
      it('should add provider to operator config', function() {
        return expect(operatorConfig.add).toHaveBeenCalled();
      });
      return it('should add atom config listener', function() {
        return expect(atom.config.observe).toHaveBeenCalled();
      });
    });
    return describe('registering and deactivating', function() {
      it('should work fine', function() {
        var disposable;
        spyOn(console, 'error');
        disposable = providerManager.register(provider);
        disposable.dispose();
        providerManager.register(provider);
        return expect(console.error).not.toHaveBeenCalled();
      });
      return xit('should work fine with the package', function() {
        spyOn(console, 'error');
        waitsForPromise(function() {
          return atom.packages.activatePackage('aligner');
        });
        runs(function() {
          return atom.packages.deactivatePackage('aligner');
        });
        waitsForPromise(function() {
          return atom.packages.activatePackage('aligner');
        });
        return runs(function() {
          return expect(console.error).not.toHaveBeenCalled();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYWxpZ25lci9zcGVjL3Byb3ZpZGVyLW1hbmFnZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0JBQUE7O0FBQUEsRUFBQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSx5QkFBUixDQUFsQixDQUFBOztBQUFBLEVBQ0EsY0FBQSxHQUFpQixPQUFBLENBQVEsd0JBQVIsQ0FEakIsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsUUFBQSxRQUFBO0FBQUEsSUFBQSxRQUFBLEdBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxDQUFDLGdCQUFELENBQVY7QUFBQSxNQUNBLEVBQUEsRUFBVSxnQkFEVjtBQUFBLE1BRUEsTUFBQSxFQUNFO0FBQUEsUUFBQSxhQUFBLEVBQWUsTUFBZjtPQUhGO0tBREYsQ0FBQTtBQUFBLElBTUEsUUFBQSxDQUFTLHdCQUFULEVBQW1DLFNBQUEsR0FBQTtBQUNqQyxVQUFBLFVBQUE7QUFBQSxNQUFBLFVBQUEsR0FBYSxJQUFiLENBQUE7QUFBQSxNQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLEtBQUEsQ0FBTSxjQUFOLEVBQXNCLEtBQXRCLENBQTRCLENBQUMsY0FBN0IsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUNBLEtBQUEsQ0FBTSxJQUFJLENBQUMsTUFBWCxFQUFtQixTQUFuQixDQUE2QixDQUFDLGNBQTlCLENBQUEsQ0FEQSxDQUFBO2VBRUEsVUFBQSxHQUFhLGVBQWUsQ0FBQyxRQUFoQixDQUF5QixRQUF6QixFQUhKO01BQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxNQU9BLFNBQUEsQ0FBVSxTQUFBLEdBQUE7ZUFDUixVQUFVLENBQUMsT0FBWCxDQUFBLEVBRFE7TUFBQSxDQUFWLENBUEEsQ0FBQTtBQUFBLE1BVUEsRUFBQSxDQUFHLHdDQUFILEVBQTZDLFNBQUEsR0FBQTtlQUMzQyxNQUFBLENBQU8sY0FBYyxDQUFDLEdBQXRCLENBQTBCLENBQUMsZ0JBQTNCLENBQUEsRUFEMkM7TUFBQSxDQUE3QyxDQVZBLENBQUE7YUFhQSxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQSxHQUFBO2VBQ3BDLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQW5CLENBQTJCLENBQUMsZ0JBQTVCLENBQUEsRUFEb0M7TUFBQSxDQUF0QyxFQWRpQztJQUFBLENBQW5DLENBTkEsQ0FBQTtXQXVCQSxRQUFBLENBQVMsOEJBQVQsRUFBeUMsU0FBQSxHQUFBO0FBQ3ZDLE1BQUEsRUFBQSxDQUFHLGtCQUFILEVBQXVCLFNBQUEsR0FBQTtBQUNyQixZQUFBLFVBQUE7QUFBQSxRQUFBLEtBQUEsQ0FBTSxPQUFOLEVBQWUsT0FBZixDQUFBLENBQUE7QUFBQSxRQUVBLFVBQUEsR0FBYSxlQUFlLENBQUMsUUFBaEIsQ0FBeUIsUUFBekIsQ0FGYixDQUFBO0FBQUEsUUFJQSxVQUFVLENBQUMsT0FBWCxDQUFBLENBSkEsQ0FBQTtBQUFBLFFBTUEsZUFBZSxDQUFDLFFBQWhCLENBQXlCLFFBQXpCLENBTkEsQ0FBQTtlQVFBLE1BQUEsQ0FBTyxPQUFPLENBQUMsS0FBZixDQUFxQixDQUFDLEdBQUcsQ0FBQyxnQkFBMUIsQ0FBQSxFQVRxQjtNQUFBLENBQXZCLENBQUEsQ0FBQTthQVdBLEdBQUEsQ0FBSSxtQ0FBSixFQUF5QyxTQUFBLEdBQUE7QUFDdkMsUUFBQSxLQUFBLENBQU0sT0FBTixFQUFlLE9BQWYsQ0FBQSxDQUFBO0FBQUEsUUFFQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsU0FBOUIsRUFEYztRQUFBLENBQWhCLENBRkEsQ0FBQTtBQUFBLFFBS0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtpQkFDSCxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFkLENBQWdDLFNBQWhDLEVBREc7UUFBQSxDQUFMLENBTEEsQ0FBQTtBQUFBLFFBUUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFNBQTlCLEVBRGM7UUFBQSxDQUFoQixDQVJBLENBQUE7ZUFXQSxJQUFBLENBQUssU0FBQSxHQUFBO2lCQUNILE1BQUEsQ0FBTyxPQUFPLENBQUMsS0FBZixDQUFxQixDQUFDLEdBQUcsQ0FBQyxnQkFBMUIsQ0FBQSxFQURHO1FBQUEsQ0FBTCxFQVp1QztNQUFBLENBQXpDLEVBWnVDO0lBQUEsQ0FBekMsRUF4QjBCO0VBQUEsQ0FBNUIsQ0FIQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/anas/.atom/packages/aligner/spec/provider-manager-spec.coffee
