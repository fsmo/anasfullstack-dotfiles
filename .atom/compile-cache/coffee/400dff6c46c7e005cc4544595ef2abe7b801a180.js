(function() {
  var AngularjsHelperView;

  AngularjsHelperView = require('./angularjs-helper-view');

  module.exports = {
    angularjsHelperView: null,
    activate: function(state) {
      return this.angularjsHelperView = new AngularjsHelperView(state.angularjsHelperViewState);
    },
    deactivate: function() {
      return this.angularjsHelperView.destroy();
    },
    serialize: function() {
      return {
        angularjsHelperViewState: this.angularjsHelperView.serialize()
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYW5ndWxhcmpzLWhlbHBlci9saWIvYW5ndWxhcmpzLWhlbHBlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUJBQUE7O0FBQUEsRUFBQSxtQkFBQSxHQUFzQixPQUFBLENBQVEseUJBQVIsQ0FBdEIsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7QUFBQSxJQUFBLG1CQUFBLEVBQXFCLElBQXJCO0FBQUEsSUFFQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7YUFDTixJQUFDLENBQUEsbUJBQUQsR0FBMkIsSUFBQSxtQkFBQSxDQUFvQixLQUFLLENBQUMsd0JBQTFCLEVBRHJCO0lBQUEsQ0FGVjtBQUFBLElBS0EsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxPQUFyQixDQUFBLEVBRFE7SUFBQSxDQUxaO0FBQUEsSUFRQSxTQUFBLEVBQVcsU0FBQSxHQUFBO2FBQ1A7QUFBQSxRQUFBLHdCQUFBLEVBQTBCLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxTQUFyQixDQUFBLENBQTFCO1FBRE87SUFBQSxDQVJYO0dBSEosQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/anas/.atom/packages/angularjs-helper/lib/angularjs-helper.coffee
