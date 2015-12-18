(function() {
  var jasmineEnv, original, tags, _;

  require('jasmine-tagged');

  _ = require('underscore-plus');

  tags = [process.platform];

  if (!process.env.WERCKER_ROOT) {
    tags.push('notwercker');
  }

  if (!process.env.TRAVIS) {
    tags.push('nottravis');
  }

  jasmineEnv = jasmine.getEnv();

  original = jasmineEnv.setIncludedTags;

  jasmineEnv.setIncludedTags = function(t) {
    return original(_.union(tags, t));
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24tcHJldmlldy1wbHVzL3NwZWMvc3BlYy1oZWxwZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBOztBQUFBLEVBQUEsT0FBQSxDQUFRLGdCQUFSLENBQUEsQ0FBQTs7QUFBQSxFQUVBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FGSixDQUFBOztBQUFBLEVBSUEsSUFBQSxHQUFPLENBQUMsT0FBTyxDQUFDLFFBQVQsQ0FKUCxDQUFBOztBQU1BLEVBQUEsSUFBQSxDQUFBLE9BQXNDLENBQUMsR0FBRyxDQUFDLFlBQTNDO0FBQUEsSUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLFlBQVYsQ0FBQSxDQUFBO0dBTkE7O0FBT0EsRUFBQSxJQUFBLENBQUEsT0FBcUMsQ0FBQyxHQUFHLENBQUMsTUFBMUM7QUFBQSxJQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsV0FBVixDQUFBLENBQUE7R0FQQTs7QUFBQSxFQVNBLFVBQUEsR0FBYSxPQUFPLENBQUMsTUFBUixDQUFBLENBVGIsQ0FBQTs7QUFBQSxFQVVBLFFBQUEsR0FBVyxVQUFVLENBQUMsZUFWdEIsQ0FBQTs7QUFBQSxFQVlBLFVBQVUsQ0FBQyxlQUFYLEdBQTZCLFNBQUMsQ0FBRCxHQUFBO1dBQzNCLFFBQUEsQ0FBUyxDQUFDLENBQUMsS0FBRixDQUFRLElBQVIsRUFBYyxDQUFkLENBQVQsRUFEMkI7RUFBQSxDQVo3QixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/anas/.atom/packages/markdown-preview-plus/spec/spec-helper.coffee
