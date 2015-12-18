(function() {
  var operatorConfig, providerManager;

  providerManager = require('../lib/provider-manager');

  operatorConfig = require('../lib/operator-config');

  describe('ProviderManager', function() {
    return describe('registering a provider', function() {
      var disposable, provider;
      disposable = null;
      provider = {
        selector: ['.source.coffee'],
        id: 'aligner-coffee',
        config: {
          ':-alignment': 'left'
        }
      };
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
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYWxpZ25lci9zcGVjL3Byb3ZpZGVyLW1hbmFnZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0JBQUE7O0FBQUEsRUFBQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSx5QkFBUixDQUFsQixDQUFBOztBQUFBLEVBQ0EsY0FBQSxHQUFpQixPQUFBLENBQVEsd0JBQVIsQ0FEakIsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBLEdBQUE7V0FDMUIsUUFBQSxDQUFTLHdCQUFULEVBQW1DLFNBQUEsR0FBQTtBQUNqQyxVQUFBLG9CQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWEsSUFBYixDQUFBO0FBQUEsTUFDQSxRQUFBLEdBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVSxDQUFDLGdCQUFELENBQVY7QUFBQSxRQUNBLEVBQUEsRUFBVSxnQkFEVjtBQUFBLFFBRUEsTUFBQSxFQUNFO0FBQUEsVUFBQSxhQUFBLEVBQWUsTUFBZjtTQUhGO09BRkYsQ0FBQTtBQUFBLE1BT0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsS0FBQSxDQUFNLGNBQU4sRUFBc0IsS0FBdEIsQ0FBNEIsQ0FBQyxjQUE3QixDQUFBLENBQUEsQ0FBQTtBQUFBLFFBQ0EsS0FBQSxDQUFNLElBQUksQ0FBQyxNQUFYLEVBQW1CLFNBQW5CLENBQTZCLENBQUMsY0FBOUIsQ0FBQSxDQURBLENBQUE7ZUFFQSxVQUFBLEdBQWEsZUFBZSxDQUFDLFFBQWhCLENBQXlCLFFBQXpCLEVBSEo7TUFBQSxDQUFYLENBUEEsQ0FBQTtBQUFBLE1BWUEsU0FBQSxDQUFVLFNBQUEsR0FBQTtlQUNSLFVBQVUsQ0FBQyxPQUFYLENBQUEsRUFEUTtNQUFBLENBQVYsQ0FaQSxDQUFBO0FBQUEsTUFlQSxFQUFBLENBQUcsd0NBQUgsRUFBNkMsU0FBQSxHQUFBO2VBQzNDLE1BQUEsQ0FBTyxjQUFjLENBQUMsR0FBdEIsQ0FBMEIsQ0FBQyxnQkFBM0IsQ0FBQSxFQUQyQztNQUFBLENBQTdDLENBZkEsQ0FBQTthQWtCQSxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQSxHQUFBO2VBQ3BDLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQW5CLENBQTJCLENBQUMsZ0JBQTVCLENBQUEsRUFEb0M7TUFBQSxDQUF0QyxFQW5CaUM7SUFBQSxDQUFuQyxFQUQwQjtFQUFBLENBQTVCLENBSEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/anas/.atom/packages/aligner/spec/provider-manager-spec.coffee
