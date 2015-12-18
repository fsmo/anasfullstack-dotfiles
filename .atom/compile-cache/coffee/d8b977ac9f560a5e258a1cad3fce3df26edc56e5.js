(function() {
  var Dialog, Project, Projects, SaveDialog, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require('./dialog');

  Project = require('./project');

  Projects = require('./projects');

  path = require('path');

  module.exports = SaveDialog = (function(_super) {
    __extends(SaveDialog, _super);

    SaveDialog.prototype.filePath = null;

    function SaveDialog() {
      var firstPath, projects, title;
      firstPath = atom.project.getPaths()[0];
      title = path.basename(firstPath);
      SaveDialog.__super__.constructor.call(this, {
        prompt: 'Enter name of project',
        input: title,
        select: true,
        iconClass: 'icon-arrow-right'
      });
      projects = new Projects();
      projects.getCurrent((function(_this) {
        return function(project) {
          if (project.props.paths[0] === firstPath) {
            return _this.showError("This project is already saved as " + project.props.title);
          }
        };
      })(this));
    }

    SaveDialog.prototype.onConfirm = function(title) {
      var project, properties;
      if (title) {
        properties = {
          title: title,
          paths: atom.project.getPaths()
        };
        project = new Project(properties);
        project.save();
        return this.close();
      } else {
        return this.showError('You need to specify a name for the project');
      }
    };

    return SaveDialog;

  })(Dialog);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9zYXZlLWRpYWxvZy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkNBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFULENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FEVixDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBRlgsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUNBQUEsQ0FBQTs7QUFBQSx5QkFBQSxRQUFBLEdBQVUsSUFBVixDQUFBOztBQUVhLElBQUEsb0JBQUEsR0FBQTtBQUNYLFVBQUEsMEJBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBcEMsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLElBQUksQ0FBQyxRQUFMLENBQWMsU0FBZCxDQURSLENBQUE7QUFBQSxNQUdBLDRDQUNFO0FBQUEsUUFBQSxNQUFBLEVBQVEsdUJBQVI7QUFBQSxRQUNBLEtBQUEsRUFBTyxLQURQO0FBQUEsUUFFQSxNQUFBLEVBQVEsSUFGUjtBQUFBLFFBR0EsU0FBQSxFQUFXLGtCQUhYO09BREYsQ0FIQSxDQUFBO0FBQUEsTUFTQSxRQUFBLEdBQWUsSUFBQSxRQUFBLENBQUEsQ0FUZixDQUFBO0FBQUEsTUFVQSxRQUFRLENBQUMsVUFBVCxDQUFvQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxPQUFELEdBQUE7QUFDbEIsVUFBQSxJQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBcEIsS0FBMEIsU0FBN0I7bUJBQ0UsS0FBQyxDQUFBLFNBQUQsQ0FBWSxtQ0FBQSxHQUFtQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQTdELEVBREY7V0FEa0I7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQixDQVZBLENBRFc7SUFBQSxDQUZiOztBQUFBLHlCQWtCQSxTQUFBLEdBQVcsU0FBQyxLQUFELEdBQUE7QUFDVCxVQUFBLG1CQUFBO0FBQUEsTUFBQSxJQUFHLEtBQUg7QUFDRSxRQUFBLFVBQUEsR0FDRTtBQUFBLFVBQUEsS0FBQSxFQUFPLEtBQVA7QUFBQSxVQUNBLEtBQUEsRUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQURQO1NBREYsQ0FBQTtBQUFBLFFBSUEsT0FBQSxHQUFjLElBQUEsT0FBQSxDQUFRLFVBQVIsQ0FKZCxDQUFBO0FBQUEsUUFLQSxPQUFPLENBQUMsSUFBUixDQUFBLENBTEEsQ0FBQTtlQU9BLElBQUMsQ0FBQSxLQUFELENBQUEsRUFSRjtPQUFBLE1BQUE7ZUFVRSxJQUFDLENBQUEsU0FBRCxDQUFXLDRDQUFYLEVBVkY7T0FEUztJQUFBLENBbEJYLENBQUE7O3NCQUFBOztLQUR1QixPQU56QixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/anas/.atom/packages/project-manager/lib/save-dialog.coffee
