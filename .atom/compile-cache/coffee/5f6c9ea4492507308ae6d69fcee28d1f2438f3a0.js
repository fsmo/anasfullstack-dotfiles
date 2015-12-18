(function() {
  var Config, Os;

  Config = require('../lib/config');

  Os = require('os');

  describe('pathSeparator tests', function() {
    ({
      beforeEach: function() {}
    });
    it('Not Windows', function() {
      spyOn(Os, 'platform').andReturn(Math.random());
      expect(Config.pathSeparator()).toBe('/');
      return expect(Os.platform).toHaveBeenCalled();
    });
    return it('Windows', function() {
      spyOn(Os, 'platform').andReturn('win32');
      expect(Config.pathSeparator()).toBe('\\');
      return expect(Os.platform).toHaveBeenCalled();
    });
  });

  describe('saveFile tests', function() {
    beforeEach(function() {
      spyOn(Config, 'saveFolder').andReturn('folder');
      return spyOn(Config, 'pathSeparator').andReturn('/');
    });
    return describe('projects restoring', function() {
      return it('is a project to be restored', function() {
        atom.project.path || (atom.project.rootDirectories[0].path = 'path');
        expect(Config.saveFile()).toBe('folder/path/project.json');
        expect(Config.saveFolder).toHaveBeenCalled();
        return expect(Config.pathSeparator).toHaveBeenCalled();
      });
    });
  });

  describe('transformProjectPath tests', function() {
    it('is Windows with :', function() {
      var path;
      spyOn(Config, 'isWindows').andReturn(true);
      path = Config.transformProjectPath('c:\\path');
      return expect(path).toBe('c\\path');
    });
    it('is Windows without :', function() {
      var path;
      spyOn(Config, 'isWindows').andReturn(true);
      path = Config.transformProjectPath('path\\more');
      return expect(path).toBe('path\\more');
    });
    return it('is not windows', function() {
      var path;
      spyOn(Config, 'isWindows').andReturn(false);
      path = Config.transformProjectPath('path/more');
      return expect(path).toBe('path/more');
    });
  });

  describe('config tests', function() {
    beforeEach(function() {
      spyOn(atom.config, 'set');
      return spyOn(atom.config, 'get');
    });
    it('Contains key and value', function() {
      Config.config('key', 'val');
      expect(atom.config.set).toHaveBeenCalled();
      return expect(atom.config.get).not.toHaveBeenCalled();
    });
    it('Contains key and forced', function() {
      Config.config('key', void 0, true);
      expect(atom.config.set).toHaveBeenCalled();
      return expect(atom.config.get).not.toHaveBeenCalled();
    });
    return it('Contains key only', function() {
      Config.config('key');
      expect(atom.config.set).not.toHaveBeenCalled();
      return expect(atom.config.get).toHaveBeenCalled();
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvc2F2ZS1zZXNzaW9uL3NwZWMvY29uZmlnLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVIsQ0FBVCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBLEdBQUE7QUFDOUIsSUFBQSxDQUFBO0FBQUEsTUFBQSxVQUFBLEVBQVksU0FBQSxHQUFBLENBQVo7S0FBQSxDQUFBLENBQUE7QUFBQSxJQUVBLEVBQUEsQ0FBRyxhQUFILEVBQWtCLFNBQUEsR0FBQTtBQUNoQixNQUFBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsVUFBVixDQUFxQixDQUFDLFNBQXRCLENBQWdDLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBaEMsQ0FBQSxDQUFBO0FBQUEsTUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFQLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsR0FBcEMsQ0FEQSxDQUFBO2FBRUEsTUFBQSxDQUFPLEVBQUUsQ0FBQyxRQUFWLENBQW1CLENBQUMsZ0JBQXBCLENBQUEsRUFIZ0I7SUFBQSxDQUFsQixDQUZBLENBQUE7V0FPQSxFQUFBLENBQUcsU0FBSCxFQUFjLFNBQUEsR0FBQTtBQUNaLE1BQUEsS0FBQSxDQUFNLEVBQU4sRUFBVSxVQUFWLENBQXFCLENBQUMsU0FBdEIsQ0FBZ0MsT0FBaEMsQ0FBQSxDQUFBO0FBQUEsTUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFQLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsSUFBcEMsQ0FEQSxDQUFBO2FBRUEsTUFBQSxDQUFP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

//# sourceURL=/Users/anas/.atom/packages/save-session/spec/config-spec.coffee