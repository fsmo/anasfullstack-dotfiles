(function() {
  var RestClientView;

  RestClientView = require('../lib/rest-client-view');

  describe("RestClientView test", function() {
    var restClient;
    restClient = [][0];
    beforeEach(function() {
      return restClient = new RestClientView();
    });
    describe("View", function() {
      return it("the view is loaded", function() {
        return expect(restClient.find('.rest-client-send')).toExist();
      });
    });
    return describe("Json", function() {
      it("body is not json", function() {
        return expect(restClient.isJson("<html></html>")).toBe(false);
      });
      it("body is json", function() {
        return expect(restClient.isJson('{"hello": "world"}')).toBe(true);
      });
      it("process result is not json", function() {
        return expect(restClient.processResult('<html></html>')).toEqual('<html></html>');
      });
      return it("process result is json", function() {
        return expect(restClient.processResult('{"hello": "world"}')).toEqual('{\n    "hello": "world"\n}');
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvcmVzdC1jbGllbnQvc3BlYy9yZXN0LWNsaWVudC12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx5QkFBUixDQUFqQixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLHFCQUFULEVBQWdDLFNBQUEsR0FBQTtBQUM5QixRQUFBLFVBQUE7QUFBQSxJQUFDLGFBQWMsS0FBZixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsVUFBQSxHQUFpQixJQUFBLGNBQUEsQ0FBQSxFQURSO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQUtBLFFBQUEsQ0FBUyxNQUFULEVBQWlCLFNBQUEsR0FBQTthQUNmLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBLEdBQUE7ZUFDdkIsTUFBQSxDQUFPLFVBQVUsQ0FBQyxJQUFYLENBQWdCLG1CQUFoQixDQUFQLENBQTRDLENBQUMsT0FBN0MsQ0FBQSxFQUR1QjtNQUFBLENBQXpCLEVBRGU7SUFBQSxDQUFqQixDQUxBLENBQUE7V0FTQSxRQUFBLENBQVMsTUFBVCxFQUFpQixTQUFBLEdBQUE7QUFDZixNQUFBLEVBQUEsQ0FBRyxrQkFBSCxFQUF1QixTQUFBLEdBQUE7ZUFDckIsTUFBQSxDQUFPLFVBQVUsQ0FBQyxNQUFYLENBQWtCLGVBQWxCLENBQVAsQ0FBMEMsQ0FBQyxJQUEzQyxDQUFnRCxLQUFoRCxFQURxQjtNQUFBLENBQXZCLENBQUEsQ0FBQTtBQUFBLE1BR0EsRUFBQSxDQUFHLGNBQUgsRUFBbUIsU0FBQSxHQUFBO2VBQ2pCLE1BQUEsQ0FBTyxVQUFVLENBQUMsTUFBWCxDQUFrQixvQkFBbEIsQ0FBUCxDQUErQyxDQUFDLElBQWhELENBQXFELElBQXJELEVBRGlCO01BQUEsQ0FBbkIsQ0FIQSxDQUFBO0FBQUEsTUFNQSxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQSxHQUFBO2VBQy9CLE1BQUEsQ0FBTyxVQUFVLENBQUMsYUFBWCxDQUF5QixlQUF6QixDQUFQLENBQWlELENBQUMsT0FBbEQsQ0FBMEQsZUFBMUQsRUFEK0I7TUFBQSxDQUFqQyxDQU5BLENBQUE7YUFTQSxFQUFBLENBQUcsd0JBQUgsRUFBNkIsU0FBQSxHQUFBO2VBQzNCLE1BQUEsQ0FBTyxVQUFVLENBQUMsYUFBWCxDQUF5QixvQkFBekIsQ0FBUCxDQUFzRCxDQUFDLE9BQXZELENBQStELDRCQUEvRCxFQUQyQjtNQUFBLENBQTdCLEVBVmU7SUFBQSxDQUFqQixFQVY4QjtFQUFBLENBQWhDLENBRkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/anas/.atom/packages/rest-client/spec/rest-client-view-spec.coffee
