(function() {
  var RestClientView, createRestClientView, deserializer, restClientUri;

  RestClientView = null;

  restClientUri = 'atom://rest-client';

  createRestClientView = function(state) {
    if (RestClientView == null) {
      RestClientView = require('./rest-client-view');
    }
    return new RestClientView(state);
  };

  deserializer = {
    name: 'RestClientView',
    deserialize: function(state) {
      return createRestClientView(state);
    }
  };

  atom.deserializers.add(deserializer);

  module.exports = {
    activate: function() {
      atom.workspace.addOpener(function(filePath) {
        if (filePath === restClientUri) {
          return createRestClientView({
            uri: restClientUri
          });
        }
      });
      return atom.commands.add('atom-workspace', 'rest-client:show', function() {
        return atom.workspace.open(restClientUri);
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvcmVzdC1jbGllbnQvbGliL3Jlc3QtY2xpZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpRUFBQTs7QUFBQSxFQUFBLGNBQUEsR0FBaUIsSUFBakIsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0Isb0JBRGhCLENBQUE7O0FBQUEsRUFHQSxvQkFBQSxHQUF1QixTQUFDLEtBQUQsR0FBQTs7TUFDckIsaUJBQWtCLE9BQUEsQ0FBUSxvQkFBUjtLQUFsQjtXQUNJLElBQUEsY0FBQSxDQUFlLEtBQWYsRUFGaUI7RUFBQSxDQUh2QixDQUFBOztBQUFBLEVBT0EsWUFBQSxHQUNFO0FBQUEsSUFBQSxJQUFBLEVBQU0sZ0JBQU47QUFBQSxJQUNBLFdBQUEsRUFBYSxTQUFDLEtBQUQsR0FBQTthQUFXLG9CQUFBLENBQXFCLEtBQXJCLEVBQVg7SUFBQSxDQURiO0dBUkYsQ0FBQTs7QUFBQSxFQVVBLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBbkIsQ0FBdUIsWUFBdkIsQ0FWQSxDQUFBOztBQUFBLEVBWUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFmLENBQXlCLFNBQUMsUUFBRCxHQUFBO0FBQ3ZCLFFBQUEsSUFBNEMsUUFBQSxLQUFZLGFBQXhEO2lCQUFBLG9CQUFBLENBQXFCO0FBQUEsWUFBQSxHQUFBLEVBQUssYUFBTDtXQUFyQixFQUFBO1NBRHVCO01BQUEsQ0FBekIsQ0FBQSxDQUFBO2FBR0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxrQkFBcEMsRUFBd0QsU0FBQSxHQUFBO2VBQ3RELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixhQUFwQixFQURzRDtNQUFBLENBQXhELEVBSlE7SUFBQSxDQUFWO0dBYkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/anas/.atom/packages/rest-client/lib/rest-client.coffee
