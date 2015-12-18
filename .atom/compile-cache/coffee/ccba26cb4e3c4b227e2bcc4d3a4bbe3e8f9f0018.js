(function() {
  var Disposable, config, cssProvider, extend, operatorConfig;

  operatorConfig = require('../lib/operator-config');

  config = require('../config');

  extend = require('extend');

  Disposable = require('atom').Disposable;

  cssProvider = {
    selector: ['.source.css', '.source.html', '.source.css.less'],
    id: 'aligner-css',
    config: {
      ':-prefixes': {
        type: 'array',
        "default": [':']
      },
      ':-alignment': {
        title: 'Padding for :',
        description: 'Pad left or right of the character',
        type: 'string',
        "default": 'right'
      },
      ':-leftSpace': {
        title: 'Left space for :',
        description: 'Add 1 whitespace to the left',
        type: 'boolean',
        "default": false
      },
      ':-rightSpace': {
        title: 'Right space for :',
        description: 'Add 1 whitespace to the right',
        type: 'boolean',
        "default": true
      },
      ':-scope': {
        title: 'Character scope',
        description: 'Scope string to match',
        type: 'string',
        "default": 'key-value'
      }
    },
    privateConfig: {
      '|-alignment': 'right'
    }
  };

  describe('Operator Config', function() {
    beforeEach(function() {
      operatorConfig.removeAll();
      return operatorConfig.add('aligner', config);
    });
    describe('getConfig', function() {
      it('should get the config from config.json', function() {
        return expect(operatorConfig.getConfig('=')).toBeDefined();
      });
      it('should return null when character is not supported', function() {
        return expect(operatorConfig.getConfig('-')).toBeUndefined();
      });
      it('should be able to get prefixed operator config', function() {
        return expect(operatorConfig.getConfig('+=')).toBeDefined();
      });
      it('should get the right provider', function() {
        operatorConfig.add('aligner-css', cssProvider);
        return expect(operatorConfig.getConfig(':', '.source.css')).toBeDefined();
      });
      return it('should not be able to get any config', function() {
        return expect(operatorConfig.getConfig('=>', '.source.ruby')).toBeUndefined();
      });
    });
    describe('add', function() {
      it('should add provider to settings', function() {
        var output, settings;
        output = operatorConfig.add('aligner-css', cssProvider);
        settings = operatorConfig.settings['aligner-css'];
        expect(settings).toBeDefined();
        expect(settings['|'].alignment).toBe('right');
        expect(settings.selector).toEqual(['.source.css', '.source.html', '.source.css.less']);
        expect(settings['::']).toBeDefined();
        expect(settings['::']).toEqual(settings[':']);
        expect(output instanceof Disposable).toBe(true);
        return operatorConfig.remove('aligner-css');
      });
      return it('should throw an error when initialized twice', function() {
        spyOn(console, 'error');
        operatorConfig.add('aligner-css', cssProvider);
        operatorConfig.add('aligner-css', cssProvider);
        return expect(console.error).toHaveBeenCalled();
      });
    });
    describe('remove', function() {
      return it('should remove provider', function() {
        operatorConfig.add('aligner-css', cssProvider);
        expect(operatorConfig.settings['aligner-css']).toBeDefined();
        operatorConfig.remove('aligner-css');
        return expect(operatorConfig.settings['aligner-css']).toBeUndefined();
      });
    });
    describe('canAlignWith', function() {
      var characterConfig;
      characterConfig = null;
      beforeEach(function() {
        return characterConfig = operatorConfig.getConfig('=');
      });
      it('should return true if they are the same', function() {
        return expect(operatorConfig.canAlignWith('=', '=', characterConfig)).toBe(true);
      });
      it('should return true for supported prefixed operator', function() {
        return expect(operatorConfig.canAlignWith('=', '+=', characterConfig)).toBe(true);
      });
      return it('should return false for unsupported prefixed operator', function() {
        return expect(operatorConfig.canAlignWith('=', '1=', characterConfig)).toBe(false);
      });
    });
    describe('isPrefixed', function() {
      it('should return true when operator has prefix', function() {
        var characterConfig;
        characterConfig = operatorConfig.getConfig('+=');
        return expect(operatorConfig.isPrefixed('+=', characterConfig)).toBe(true);
      });
      return it('should return false when operator does not have prefix', function() {
        var characterConfig;
        characterConfig = operatorConfig.getConfig('=');
        return expect(operatorConfig.isPrefixed('=', characterConfig)).toBe(false);
      });
    });
    describe('updateSetting', function() {
      return it('should update prefixed settings properly', function() {
        var setting;
        setting = {
          '=': {
            alignment: 'right'
          }
        };
        operatorConfig.updateSetting('aligner', setting);
        return expect(operatorConfig.getConfig('+=').alignment).toBe('right');
      });
    });
    describe('initializePrefix', function() {
      return it('should initialize prefix correctly', function() {
        var configs;
        configs = {
          '=': {
            prefixes: ['+'],
            alignment: 'right'
          }
        };
        operatorConfig.initializePrefix(configs);
        expect(configs['+=']).toBeDefined();
        expect(configs['+=']).toBe(configs['=']);
        expect(configs['+='].alignWith).toEqual(['=', '+=']);
        return expect(configs['='].prefixed).toEqual(['+=']);
      });
    });
    describe('getAtomConfig', function() {
      var atomConfig;
      atomConfig = null;
      beforeEach(function() {
        return atomConfig = operatorConfig.getAtomConfig();
      });
      it('should create key-value pairs for Atom config', function() {
        return expect(atomConfig['=-alignment']).toBeDefined();
      });
      it('should not create key-value pairs for prefixed operators', function() {
        return expect(atomConfig['+=-alignment']).toBeUndefined();
      });
      return it('should contain title', function() {
        return expect(atomConfig['=-alignment'].title).toBeDefined();
      });
    });
    describe('updateConfigWithAtom', function() {
      return it('should update with Atom setting changes', function() {
        var setting;
        setting = {
          '=-alignment': 'right'
        };
        operatorConfig.updateConfigWithAtom('aligner', setting);
        return expect(operatorConfig.getConfig('+=').alignment).toBe('right');
      });
    });
    return describe('convertAtomConfig', function() {
      it('should convert 1 level object path correctly', function() {
        var output;
        output = operatorConfig.convertAtomConfig({
          ':-assignment': 'right'
        });
        return expect(output[':'].assignment).toBe('right');
      });
      it('should convert nested object path correctly', function() {
        var output;
        output = operatorConfig.convertAtomConfig({
          ':-multiple-string-assignment': 'right'
        });
        return expect(output[':'].multiple.string.assignment).toBe('right');
      });
      it('should include enabled option and default to true', function() {
        var output;
        output = operatorConfig.convertAtomConfig({
          ':-assignment': 'right'
        });
        return expect(output[':'].enabled).toBe(true);
      });
      return it('should include enabled option', function() {
        var output;
        output = operatorConfig.convertAtomConfig({
          ':-assignment': 'right',
          ':-enabled': false
        });
        return expect(output[':'].enabled).toBe(false);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYWxpZ25lci9zcGVjL29wZXJhdG9yLWNvbmZpZy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1REFBQTs7QUFBQSxFQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHdCQUFSLENBQWpCLENBQUE7O0FBQUEsRUFDQSxNQUFBLEdBQWlCLE9BQUEsQ0FBUSxXQUFSLENBRGpCLENBQUE7O0FBQUEsRUFFQSxNQUFBLEdBQWlCLE9BQUEsQ0FBUSxRQUFSLENBRmpCLENBQUE7O0FBQUEsRUFHQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFIRCxDQUFBOztBQUFBLEVBS0EsV0FBQSxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsQ0FBQyxhQUFELEVBQWdCLGNBQWhCLEVBQWdDLGtCQUFoQyxDQUFWO0FBQUEsSUFDQSxFQUFBLEVBQUksYUFESjtBQUFBLElBRUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsQ0FBQyxHQUFELENBRFQ7T0FERjtBQUFBLE1BR0EsYUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sZUFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLG9DQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLE9BSFQ7T0FKRjtBQUFBLE1BUUEsYUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sa0JBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSw4QkFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxLQUhUO09BVEY7QUFBQSxNQWFBLGNBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLG1CQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsK0JBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsSUFIVDtPQWRGO0FBQUEsTUFrQkEsU0FBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8saUJBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSx1QkFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFFBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxXQUhUO09BbkJGO0tBSEY7QUFBQSxJQTBCQSxhQUFBLEVBQ0U7QUFBQSxNQUFBLGFBQUEsRUFBZSxPQUFmO0tBM0JGO0dBTkYsQ0FBQTs7QUFBQSxFQW1DQSxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQSxHQUFBO0FBQzFCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsY0FBYyxDQUFDLFNBQWYsQ0FBQSxDQUFBLENBQUE7YUFDQSxjQUFjLENBQUMsR0FBZixDQUFtQixTQUFuQixFQUE4QixNQUE5QixFQUZTO0lBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxJQUlBLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUEsR0FBQTtBQUNwQixNQUFBLEVBQUEsQ0FBRyx3Q0FBSCxFQUE2QyxTQUFBLEdBQUE7ZUFDM0MsTUFBQSxDQUFPLGNBQWMsQ0FBQyxTQUFmLENBQXlCLEdBQXpCLENBQVAsQ0FBcUMsQ0FBQyxXQUF0QyxDQUFBLEVBRDJDO01BQUEsQ0FBN0MsQ0FBQSxDQUFBO0FBQUEsTUFHQSxFQUFBLENBQUcsb0RBQUgsRUFBeUQsU0FBQSxHQUFBO2VBQ3ZELE1BQUEsQ0FBTyxjQUFjLENBQUMsU0FBZixDQUF5QixHQUF6QixDQUFQLENBQXFDLENBQUMsYUFBdEMsQ0FBQSxFQUR1RDtNQUFBLENBQXpELENBSEEsQ0FBQTtBQUFBLE1BTUEsRUFBQSxDQUFHLGdEQUFILEVBQXFELFNBQUEsR0FBQTtlQUNuRCxNQUFBLENBQU8sY0FBYyxDQUFDLFNBQWYsQ0FBeUIsSUFBekIsQ0FBUCxDQUFzQyxDQUFDLFdBQXZDLENBQUEsRUFEbUQ7TUFBQSxDQUFyRCxDQU5BLENBQUE7QUFBQSxNQVNBLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBLEdBQUE7QUFDbEMsUUFBQSxjQUFjLENBQUMsR0FBZixDQUFtQixhQUFuQixFQUFrQyxXQUFsQyxDQUFBLENBQUE7ZUFFQSxNQUFBLENBQU8sY0FBYyxDQUFDLFNBQWYsQ0FBeUIsR0FBekIsRUFBOEIsYUFBOUIsQ0FBUCxDQUFvRCxDQUFDLFdBQXJELENBQUEsRUFIa0M7TUFBQSxDQUFwQyxDQVRBLENBQUE7YUFjQSxFQUFBLENBQUcsc0NBQUgsRUFBMkMsU0FBQSxHQUFBO2VBQ3pDLE1BQUEsQ0FBTyxjQUFjLENBQUMsU0FBZixDQUF5QixJQUF6QixFQUErQixjQUEvQixDQUFQLENBQXNELENBQUMsYUFBdkQsQ0FBQSxFQUR5QztNQUFBLENBQTNDLEVBZm9CO0lBQUEsQ0FBdEIsQ0FKQSxDQUFBO0FBQUEsSUFzQkEsUUFBQSxDQUFTLEtBQVQsRUFBZ0IsU0FBQSxHQUFBO0FBQ2QsTUFBQSxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQSxHQUFBO0FBQ3BDLFlBQUEsZ0JBQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxjQUFjLENBQUMsR0FBZixDQUFtQixhQUFuQixFQUFrQyxXQUFsQyxDQUFULENBQUE7QUFBQSxRQUVBLFFBQUEsR0FBVyxjQUFjLENBQUMsUUFBUyxDQUFBLGFBQUEsQ0FGbkMsQ0FBQTtBQUFBLFFBSUEsTUFBQSxDQUFPLFFBQVAsQ0FBZ0IsQ0FBQyxXQUFqQixDQUFBLENBSkEsQ0FBQTtBQUFBLFFBS0EsTUFBQSxDQUFPLFFBQVMsQ0FBQSxHQUFBLENBQUksQ0FBQyxTQUFyQixDQUErQixDQUFDLElBQWhDLENBQXFDLE9BQXJDLENBTEEsQ0FBQTtBQUFBLFFBTUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxRQUFoQixDQUF5QixDQUFDLE9BQTFCLENBQWtDLENBQUMsYUFBRCxFQUFnQixjQUFoQixFQUFnQyxrQkFBaEMsQ0FBbEMsQ0FOQSxDQUFBO0FBQUEsUUFPQSxNQUFBLENBQU8sUUFBUyxDQUFBLElBQUEsQ0FBaEIsQ0FBc0IsQ0FBQyxXQUF2QixDQUFBLENBUEEsQ0FBQTtBQUFBLFFBUUEsTUFBQSxDQUFPLFFBQVMsQ0FBQSxJQUFBLENBQWhCLENBQXNCLENBQUMsT0FBdkIsQ0FBK0IsUUFBUyxDQUFBLEdBQUEsQ0FBeEMsQ0FSQSxDQUFBO0FBQUEsUUFVQSxNQUFBLENBQU8sTUFBQSxZQUFrQixVQUF6QixDQUFvQyxDQUFDLElBQXJDLENBQTBDLElBQTFDLENBVkEsQ0FBQTtlQVlBLGNBQWMsQ0FBQyxNQUFmLENBQXNCLGFBQXRCLEVBYm9DO01BQUEsQ0FBdEMsQ0FBQSxDQUFBO2FBZUEsRUFBQSxDQUFHLDhDQUFILEVBQW1ELFNBQUEsR0FBQTtBQUNqRCxRQUFBLEtBQUEsQ0FBTSxPQUFOLEVBQWUsT0FBZixDQUFBLENBQUE7QUFBQSxRQUNBLGNBQWMsQ0FBQyxHQUFmLENBQW1CLGFBQW5CLEVBQWtDLFdBQWxDLENBREEsQ0FBQTtBQUFBLFFBR0EsY0FBYyxDQUFDLEdBQWYsQ0FBbUIsYUFBbkIsRUFBa0MsV0FBbEMsQ0FIQSxDQUFBO2VBS0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxLQUFmLENBQXFCLENBQUMsZ0JBQXRCLENBQUEsRUFOaUQ7TUFBQSxDQUFuRCxFQWhCYztJQUFBLENBQWhCLENBdEJBLENBQUE7QUFBQSxJQThDQSxRQUFBLENBQVMsUUFBVCxFQUFtQixTQUFBLEdBQUE7YUFDakIsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUEsR0FBQTtBQUMzQixRQUFBLGNBQWMsQ0FBQyxHQUFmLENBQW1CLGFBQW5CLEVBQWtDLFdBQWxDLENBQUEsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxDQUFPLGNBQWMsQ0FBQyxRQUFTLENBQUEsYUFBQSxDQUEvQixDQUE4QyxDQUFDLFdBQS9DLENBQUEsQ0FEQSxDQUFBO0FBQUEsUUFFQSxjQUFjLENBQUMsTUFBZixDQUFzQixhQUF0QixDQUZBLENBQUE7ZUFHQSxNQUFBLENBQU8sY0FBYyxDQUFDLFFBQVMsQ0FBQSxhQUFBLENBQS9CLENBQThDLENBQUMsYUFBL0MsQ0FBQSxFQUoyQjtNQUFBLENBQTdCLEVBRGlCO0lBQUEsQ0FBbkIsQ0E5Q0EsQ0FBQTtBQUFBLElBcURBLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtBQUN2QixVQUFBLGVBQUE7QUFBQSxNQUFBLGVBQUEsR0FBa0IsSUFBbEIsQ0FBQTtBQUFBLE1BQ0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULGVBQUEsR0FBa0IsY0FBYyxDQUFDLFNBQWYsQ0FBeUIsR0FBekIsRUFEVDtNQUFBLENBQVgsQ0FEQSxDQUFBO0FBQUEsTUFJQSxFQUFBLENBQUcseUNBQUgsRUFBOEMsU0FBQSxHQUFBO2VBQzVDLE1BQUEsQ0FBTyxjQUFjLENBQUMsWUFBZixDQUE0QixHQUE1QixFQUFpQyxHQUFqQyxFQUFzQyxlQUF0QyxDQUFQLENBQThELENBQUMsSUFBL0QsQ0FBb0UsSUFBcEUsRUFENEM7TUFBQSxDQUE5QyxDQUpBLENBQUE7QUFBQSxNQU9BLEVBQUEsQ0FBRyxvREFBSCxFQUF5RCxTQUFBLEdBQUE7ZUFDdkQsTUFBQSxDQUFPLGNBQWMsQ0FBQyxZQUFmLENBQTRCLEdBQTVCLEVBQWlDLElBQWpDLEVBQXVDLGVBQXZDLENBQVAsQ0FBK0QsQ0FBQyxJQUFoRSxDQUFxRSxJQUFyRSxFQUR1RDtNQUFBLENBQXpELENBUEEsQ0FBQTthQVVBLEVBQUEsQ0FBRyx1REFBSCxFQUE0RCxTQUFBLEdBQUE7ZUFDMUQsTUFBQSxDQUFPLGNBQWMsQ0FBQyxZQUFmLENBQTRCLEdBQTVCLEVBQWlDLElBQWpDLEVBQXVDLGVBQXZDLENBQVAsQ0FBK0QsQ0FBQyxJQUFoRSxDQUFxRSxLQUFyRSxFQUQwRDtNQUFBLENBQTVELEVBWHVCO0lBQUEsQ0FBekIsQ0FyREEsQ0FBQTtBQUFBLElBbUVBLFFBQUEsQ0FBUyxZQUFULEVBQXVCLFNBQUEsR0FBQTtBQUNyQixNQUFBLEVBQUEsQ0FBRyw2Q0FBSCxFQUFrRCxTQUFBLEdBQUE7QUFDaEQsWUFBQSxlQUFBO0FBQUEsUUFBQSxlQUFBLEdBQWtCLGNBQWMsQ0FBQyxTQUFmLENBQXlCLElBQXpCLENBQWxCLENBQUE7ZUFDQSxNQUFBLENBQU8sY0FBYyxDQUFDLFVBQWYsQ0FBMEIsSUFBMUIsRUFBZ0MsZUFBaEMsQ0FBUCxDQUF3RCxDQUFDLElBQXpELENBQThELElBQTlELEVBRmdEO01BQUEsQ0FBbEQsQ0FBQSxDQUFBO2FBSUEsRUFBQSxDQUFHLHdEQUFILEVBQTZELFNBQUEsR0FBQTtBQUMzRCxZQUFBLGVBQUE7QUFBQSxRQUFBLGVBQUEsR0FBa0IsY0FBYyxDQUFDLFNBQWYsQ0FBeUIsR0FBekIsQ0FBbEIsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxjQUFjLENBQUMsVUFBZixDQUEwQixHQUExQixFQUErQixlQUEvQixDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsS0FBN0QsRUFGMkQ7TUFBQSxDQUE3RCxFQUxxQjtJQUFBLENBQXZCLENBbkVBLENBQUE7QUFBQSxJQTRFQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBLEdBQUE7YUFDeEIsRUFBQSxDQUFHLDBDQUFILEVBQStDLFNBQUEsR0FBQTtBQUM3QyxZQUFBLE9BQUE7QUFBQSxRQUFBLE9BQUEsR0FDRTtBQUFBLFVBQUEsR0FBQSxFQUNFO0FBQUEsWUFBQSxTQUFBLEVBQVcsT0FBWDtXQURGO1NBREYsQ0FBQTtBQUFBLFFBSUEsY0FBYyxDQUFDLGFBQWYsQ0FBNkIsU0FBN0IsRUFBd0MsT0FBeEMsQ0FKQSxDQUFBO2VBS0EsTUFBQSxDQUFPLGNBQWMsQ0FBQyxTQUFmLENBQXlCLElBQXpCLENBQThCLENBQUMsU0FBdEMsQ0FBZ0QsQ0FBQyxJQUFqRCxDQUFzRCxPQUF0RCxFQU42QztNQUFBLENBQS9DLEVBRHdCO0lBQUEsQ0FBMUIsQ0E1RUEsQ0FBQTtBQUFBLElBcUZBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7YUFDM0IsRUFBQSxDQUFHLG9DQUFILEVBQXlDLFNBQUEsR0FBQTtBQUN2QyxZQUFBLE9BQUE7QUFBQSxRQUFBLE9BQUEsR0FDRTtBQUFBLFVBQUEsR0FBQSxFQUNFO0FBQUEsWUFBQSxRQUFBLEVBQVUsQ0FBQyxHQUFELENBQVY7QUFBQSxZQUNBLFNBQUEsRUFBVyxPQURYO1dBREY7U0FERixDQUFBO0FBQUEsUUFLQSxjQUFjLENBQUMsZ0JBQWYsQ0FBZ0MsT0FBaEMsQ0FMQSxDQUFBO0FBQUEsUUFPQSxNQUFBLENBQU8sT0FBUSxDQUFBLElBQUEsQ0FBZixDQUFxQixDQUFDLFdBQXRCLENBQUEsQ0FQQSxDQUFBO0FBQUEsUUFRQSxNQUFBLENBQU8sT0FBUSxDQUFBLElBQUEsQ0FBZixDQUFxQixDQUFDLElBQXRCLENBQTJCLE9BQVEsQ0FBQSxHQUFBLENBQW5DLENBUkEsQ0FBQTtBQUFBLFFBU0EsTUFBQSxDQUFPLE9BQVEsQ0FBQSxJQUFBLENBQUssQ0FBQyxTQUFyQixDQUErQixDQUFDLE9BQWhDLENBQXdDLENBQUMsR0FBRCxFQUFNLElBQU4sQ0FBeEMsQ0FUQSxDQUFBO2VBVUEsTUFBQSxDQUFPLE9BQVEsQ0FBQSxHQUFBLENBQUksQ0FBQyxRQUFwQixDQUE2QixDQUFDLE9BQTlCLENBQXNDLENBQUMsSUFBRCxDQUF0QyxFQVh1QztNQUFBLENBQXpDLEVBRDJCO0lBQUEsQ0FBN0IsQ0FyRkEsQ0FBQTtBQUFBLElBbUdBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUEsR0FBQTtBQUN4QixVQUFBLFVBQUE7QUFBQSxNQUFBLFVBQUEsR0FBYSxJQUFiLENBQUE7QUFBQSxNQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxVQUFBLEdBQWEsY0FBYyxDQUFDLGFBQWYsQ0FBQSxFQURKO01BQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxNQUtBLEVBQUEsQ0FBRywrQ0FBSCxFQUFvRCxTQUFBLEdBQUE7ZUFDbEQsTUFBQSxDQUFPLFVBQVcsQ0FBQSxhQUFBLENBQWxCLENBQWlDLENBQUMsV0FBbEMsQ0FBQSxFQURrRDtNQUFBLENBQXBELENBTEEsQ0FBQTtBQUFBLE1BUUEsRUFBQSxDQUFHLDBEQUFILEVBQStELFNBQUEsR0FBQTtlQUM3RCxNQUFBLENBQU8sVUFBVyxDQUFBLGNBQUEsQ0FBbEIsQ0FBa0MsQ0FBQyxhQUFuQyxDQUFBLEVBRDZEO01BQUEsQ0FBL0QsQ0FSQSxDQUFBO2FBV0EsRUFBQSxDQUFHLHNCQUFILEVBQTJCLFNBQUEsR0FBQTtlQUN6QixNQUFBLENBQU8sVUFBVyxDQUFBLGFBQUEsQ0FBYyxDQUFDLEtBQWpDLENBQXVDLENBQUMsV0FBeEMsQ0FBQSxFQUR5QjtNQUFBLENBQTNCLEVBWndCO0lBQUEsQ0FBMUIsQ0FuR0EsQ0FBQTtBQUFBLElBa0hBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBLEdBQUE7YUFDL0IsRUFBQSxDQUFHLHlDQUFILEVBQThDLFNBQUEsR0FBQTtBQUM1QyxZQUFBLE9BQUE7QUFBQSxRQUFBLE9BQUEsR0FBVTtBQUFBLFVBQUEsYUFBQSxFQUFlLE9BQWY7U0FBVixDQUFBO0FBQUEsUUFFQSxjQUFjLENBQUMsb0JBQWYsQ0FBb0MsU0FBcEMsRUFBK0MsT0FBL0MsQ0FGQSxDQUFBO2VBR0EsTUFBQSxDQUFPLGNBQWMsQ0FBQyxTQUFmLENBQXlCLElBQXpCLENBQThCLENBQUMsU0FBdEMsQ0FBZ0QsQ0FBQyxJQUFqRCxDQUFzRCxPQUF0RCxFQUo0QztNQUFBLENBQTlDLEVBRCtCO0lBQUEsQ0FBakMsQ0FsSEEsQ0FBQTtXQXlIQSxRQUFBLENBQVMsbUJBQVQsRUFBOEIsU0FBQSxHQUFBO0FBQzVCLE1BQUEsRUFBQSxDQUFHLDhDQUFILEVBQW1ELFNBQUEsR0FBQTtBQUNqRCxZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxjQUFjLENBQUMsaUJBQWYsQ0FDUDtBQUFBLFVBQUEsY0FBQSxFQUFnQixPQUFoQjtTQURPLENBQVQsQ0FBQTtlQUdBLE1BQUEsQ0FBTyxNQUFPLENBQUEsR0FBQSxDQUFJLENBQUMsVUFBbkIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxPQUFwQyxFQUppRDtNQUFBLENBQW5ELENBQUEsQ0FBQTtBQUFBLE1BTUEsRUFBQSxDQUFHLDZDQUFILEVBQWtELFNBQUEsR0FBQTtBQUNoRCxZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxjQUFjLENBQUMsaUJBQWYsQ0FDUDtBQUFBLFVBQUEsOEJBQUEsRUFBZ0MsT0FBaEM7U0FETyxDQUFULENBQUE7ZUFHQSxNQUFBLENBQU8sTUFBTyxDQUFBLEdBQUEsQ0FBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBbkMsQ0FBOEMsQ0FBQyxJQUEvQyxDQUFvRCxPQUFwRCxFQUpnRDtNQUFBLENBQWxELENBTkEsQ0FBQTtBQUFBLE1BWUEsRUFBQSxDQUFHLG1EQUFILEVBQXdELFNBQUEsR0FBQTtBQUN0RCxZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxjQUFjLENBQUMsaUJBQWYsQ0FDUDtBQUFBLFVBQUEsY0FBQSxFQUFnQixPQUFoQjtTQURPLENBQVQsQ0FBQTtlQUdBLE1BQUEsQ0FBTyxNQUFPLENBQUEsR0FBQSxDQUFJLENBQUMsT0FBbkIsQ0FBMkIsQ0FBQyxJQUE1QixDQUFpQyxJQUFqQyxFQUpzRDtNQUFBLENBQXhELENBWkEsQ0FBQTthQWtCQSxFQUFBLENBQUcsK0JBQUgsRUFBb0MsU0FBQSxHQUFBO0FBQ2xDLFlBQUEsTUFBQTtBQUFBLFFBQUEsTUFBQSxHQUFTLGNBQWMsQ0FBQyxpQkFBZixDQUNQO0FBQUEsVUFBQSxjQUFBLEVBQWdCLE9BQWhCO0FBQUEsVUFDQSxXQUFBLEVBQWEsS0FEYjtTQURPLENBQVQsQ0FBQTtlQUlBLE1BQUEsQ0FBTyxNQUFPLENBQUEsR0FBQSxDQUFJLENBQUMsT0FBbkIsQ0FBMkIsQ0FBQyxJQUE1QixDQUFpQyxLQUFqQyxFQUxrQztNQUFBLENBQXBDLEVBbkI0QjtJQUFBLENBQTlCLEVBMUgwQjtFQUFBLENBQTVCLENBbkNBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/anas/.atom/packages/aligner/spec/operator-config-spec.coffee
