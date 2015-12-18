(function() {
  var Projects;

  Projects = require('../lib/projects');

  describe("Projects", function() {
    var data, projects;
    projects = null;
    data = {
      testproject1: {
        title: "Test project 1",
        paths: ["/Users/project-1"]
      },
      testproject2: {
        title: "Test project 2",
        paths: ["/Users/project-2"]
      }
    };
    beforeEach(function() {
      projects = new Projects();
      spyOn(projects.db, 'readFile').andCallFake(function(callback) {
        return callback(data);
      });
      return spyOn(projects.db, 'writeFile').andCallFake(function(projects, callback) {
        data = projects;
        return callback();
      });
    });
    return it("returns all projects", function() {
      return projects.getAll(function(projects) {
        return expect(projects.length).toBe(2);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL3NwZWMvcHJvamVjdHMtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsUUFBQTs7QUFBQSxFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsaUJBQVIsQ0FBWCxDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLFFBQUEsY0FBQTtBQUFBLElBQUEsUUFBQSxHQUFXLElBQVgsQ0FBQTtBQUFBLElBRUEsSUFBQSxHQUNFO0FBQUEsTUFBQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxnQkFBUDtBQUFBLFFBQ0EsS0FBQSxFQUFPLENBQ0wsa0JBREssQ0FEUDtPQURGO0FBQUEsTUFLQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxnQkFBUDtBQUFBLFFBQ0EsS0FBQSxFQUFPLENBQ0wsa0JBREssQ0FEUDtPQU5GO0tBSEYsQ0FBQTtBQUFBLElBY0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsUUFBQSxHQUFlLElBQUEsUUFBQSxDQUFBLENBQWYsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxDQUFNLFFBQVEsQ0FBQyxFQUFmLEVBQW1CLFVBQW5CLENBQThCLENBQUMsV0FBL0IsQ0FBMkMsU0FBQyxRQUFELEdBQUE7ZUFDekMsUUFBQSxDQUFTLElBQVQsRUFEeUM7TUFBQSxDQUEzQyxDQURBLENBQUE7YUFHQSxLQUFBLENBQU0sUUFBUSxDQUFDLEVBQWYsRUFBbUIsV0FBbkIsQ0FBK0IsQ0FBQyxXQUFoQyxDQUE0QyxTQUFDLFFBQUQsRUFBVyxRQUFYLEdBQUE7QUFDMUMsUUFBQSxJQUFBLEdBQU8sUUFBUCxDQUFBO2VBQ0EsUUFBQSxDQUFBLEVBRjBDO01BQUEsQ0FBNUMsRUFKUztJQUFBLENBQVgsQ0FkQSxDQUFBO1dBc0JBLEVBQUEsQ0FBRyxzQkFBSCxFQUEyQixTQUFBLEdBQUE7YUFDekIsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsU0FBQyxRQUFELEdBQUE7ZUFDZCxNQUFBLENBQU8sUUFBUSxDQUFDLE1BQWhCLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsQ0FBN0IsRUFEYztNQUFBLENBQWhCLEVBRHlCO0lBQUEsQ0FBM0IsRUF2Qm1CO0VBQUEsQ0FBckIsQ0FGQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/anas/.atom/packages/project-manager/spec/projects-spec.coffee
