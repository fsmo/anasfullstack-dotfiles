(function() {
  var CompositeDisposable, ProviderManager, operatorConfig;

  operatorConfig = require('./operator-config');

  CompositeDisposable = require('atom').CompositeDisposable;

  ProviderManager = (function() {
    function ProviderManager() {}

    ProviderManager.prototype.register = function(provider) {
      var disposable, providerId;
      disposable = new CompositeDisposable;
      providerId = provider != null ? provider.id : void 0;
      if (providerId) {
        disposable.add(operatorConfig.add(providerId, provider));
        disposable.add(atom.config.observe(providerId, function(value) {
          return operatorConfig.updateConfigWithAtom(providerId, value);
        }));
      }
      return disposable;
    };

    return ProviderManager;

  })();

  module.exports = new ProviderManager();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYWxpZ25lci9saWIvcHJvdmlkZXItbWFuYWdlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0RBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxtQkFBUixDQUFqQixDQUFBOztBQUFBLEVBQ0Msc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQURELENBQUE7O0FBQUEsRUFHTTtpQ0FDSjs7QUFBQSw4QkFBQSxRQUFBLEdBQVUsU0FBQyxRQUFELEdBQUE7QUFDUixVQUFBLHNCQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWEsR0FBQSxDQUFBLG1CQUFiLENBQUE7QUFBQSxNQUNBLFVBQUEsc0JBQWEsUUFBUSxDQUFFLFdBRHZCLENBQUE7QUFHQSxNQUFBLElBQUcsVUFBSDtBQUNFLFFBQUEsVUFBVSxDQUFDLEdBQVgsQ0FBZSxjQUFjLENBQUMsR0FBZixDQUFtQixVQUFuQixFQUErQixRQUEvQixDQUFmLENBQUEsQ0FBQTtBQUFBLFFBRUEsVUFBVSxDQUFDLEdBQVgsQ0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsVUFBcEIsRUFBZ0MsU0FBQyxLQUFELEdBQUE7aUJBQzdDLGNBQWMsQ0FBQyxvQkFBZixDQUFvQyxVQUFwQyxFQUFnRCxLQUFoRCxFQUQ2QztRQUFBLENBQWhDLENBQWYsQ0FGQSxDQURGO09BSEE7QUFVQSxhQUFPLFVBQVAsQ0FYUTtJQUFBLENBQVYsQ0FBQTs7MkJBQUE7O01BSkYsQ0FBQTs7QUFBQSxFQWlCQSxNQUFNLENBQUMsT0FBUCxHQUFxQixJQUFBLGVBQUEsQ0FBQSxDQWpCckIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/anas/.atom/packages/aligner/lib/provider-manager.coffee
