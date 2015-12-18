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
        var fn;
        operatorConfig.add('aligner-css', cssProvider);
        fn = function() {
          return operatorConfig.add('aligner-css', cssProvider);
        };
        return expect(fn).toThrow();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYWxpZ25lci9zcGVjL29wZXJhdG9yLWNvbmZpZy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1REFBQTs7QUFBQSxFQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHdCQUFSLENBQWpCLENBQUE7O0FBQUEsRUFDQSxNQUFBLEdBQWlCLE9BQUEsQ0FBUSxXQUFSLENBRGpCLENBQUE7O0FBQUEsRUFFQSxNQUFBLEdBQWlCLE9BQUEsQ0FBUSxRQUFSLENBRmpCLENBQUE7O0FBQUEsRUFHQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFIRCxDQUFBOztBQUFBLEVBS0EsV0FBQSxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsQ0FBQyxhQUFELEVBQWdCLGNBQWhCLEVBQWdDLGtCQUFoQyxDQUFWO0FBQUEsSUFDQSxFQUFBLEVBQUksYUFESjtBQUFBLElBRUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsQ0FBQyxHQUFELENBRFQ7T0FERjtBQUFBLE1BR0EsYUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sZUFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLG9DQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLE9BSFQ7T0FKRjtBQUFBLE1BUUEsYUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sa0JBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSw4QkFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxLQUhUO09BVEY7QUFBQSxNQWFBLGNBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLG1CQUFQO0FB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

//# sourceURL=/Users/anas/.atom/packages/aligner/spec/operator-config-spec.coffee
