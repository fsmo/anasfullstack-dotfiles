(function() {
  var Disposable, OperationConfig, configs, extend,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  configs = require('../config');

  extend = require('extend');

  Disposable = require('atom').Disposable;


  /*
  Example for '='
  "=": {
    "alignment":  "left",
    "leftSpace":  true,
    "rightSpace": true,
    "prefixes":   ["+", "-", "&", "|", "<", ">", "!", "~", "%", "/", "*", "."],
    "scope":      "operator|assignment"
  }
  `alignWith` and `prefixed` get added if `prefixes` key exist
  alignWith {array} Array of other operators that should be aligned with
  prefixed {array} Array of operators that have prefixes
   */

  OperationConfig = (function() {
    function OperationConfig() {
      this.settings = {};
    }


    /*
    @function
    @name add
    @description
    Add/register provider config
    @param {string} id Provider id
    @param {Object} provider Provider object
     */

    OperationConfig.prototype.add = function(id, provider) {
      var allConfigs, _ref;
      if (this.settings[id] != null) {
        console.error("" + id + " has already been activated");
        return new Disposable();
      }
      allConfigs = extend({}, provider.config, provider.privateConfig);
      this.settings[id] = this.convertAtomConfig(allConfigs);
      this.settings[id].selector = (_ref = provider.selector) != null ? _ref.slice(0) : void 0;
      this.initializePrefix(this.settings[id]);
      return new Disposable(this.remove.bind(this, id));
    };

    OperationConfig.prototype.remove = function(id) {
      if (this.settings[id] != null) {
        return delete this.settings[id];
      }
    };

    OperationConfig.prototype.removeAll = function() {
      return this.settings = {};
    };


    /*
    @function
    @name updateSetting
    @description
    Update aligner setting based on config.json format
    @param {string} packageId
    @param {object} newConfig
     */

    OperationConfig.prototype.updateSetting = function(packageId, newConfig) {
      if (packageId == null) {
        packageId = 'aligner';
      }
      if (this.settings[packageId]) {
        return extend(true, this.settings[packageId], newConfig);
      }
    };

    OperationConfig.prototype.initializePrefix = function(originalConfigs) {
      var config, key, keyWithPrefix, prefix, _results;
      _results = [];
      for (key in originalConfigs) {
        config = originalConfigs[key];
        if (key !== 'selector' && (config.prefixes != null)) {
          config.alignWith = [key];
          config.prefixed = [];
          _results.push((function() {
            var _i, _len, _ref, _results1;
            _ref = config.prefixes;
            _results1 = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              prefix = _ref[_i];
              keyWithPrefix = prefix + key;
              config.alignWith.push(keyWithPrefix);
              config.prefixed.push(keyWithPrefix);
              _results1.push(originalConfigs[keyWithPrefix] = config);
            }
            return _results1;
          })());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };


    /*
    @function
    @name convertAtomConfig
    @description
    Convert config in Atom format to usable config by aligner
    @param {Object} schema
    @returns {Object} Converted config object
     */

    OperationConfig.prototype.convertAtomConfig = function(schema) {
      var character, config, configPath, configPathKey, convertedConfig, currentObject, key, property, value, _i, _j, _len, _ref;
      convertedConfig = {};
      for (key in schema) {
        value = schema[key];
        _ref = key.split('-'), configPath = 2 <= _ref.length ? __slice.call(_ref, 0, _i = _ref.length - 1) : (_i = 0, []), property = _ref[_i++];
        currentObject = convertedConfig;
        for (_j = 0, _len = configPath.length; _j < _len; _j++) {
          configPathKey = configPath[_j];
          if (currentObject[configPathKey] == null) {
            currentObject[configPathKey] = {};
          }
          currentObject = currentObject[configPathKey];
        }
        currentObject[property] = value["default"] != null ? value["default"] : value;
      }
      for (character in convertedConfig) {
        config = convertedConfig[character];
        if (config.enabled == null) {
          config.enabled = true;
        }
      }
      return convertedConfig;
    };


    /*
    @function
    @name updateConfigWithAtom
    @description
    Convert Atom config object into supported format and update config
    @param {Object} newConfig Config object in Atom format
     */

    OperationConfig.prototype.updateConfigWithAtom = function(packageId, newConfig) {
      if (packageId == null) {
        packageId = 'aligner';
      }
      return this.updateSetting(packageId, this.convertAtomConfig(newConfig));
    };


    /*
    @function
    @name getAtomConfig
    @description
    Get config object for Atom used in package setting
    @returns {Object}
     */

    OperationConfig.prototype.getAtomConfig = function() {
      return configs.config;
    };


    /*
    @function
    @name getConfig
    @param {string} character
    @param {String} languageScope
    @returns {object}
     */

    OperationConfig.prototype.getConfig = function(character, languageScope) {
      var config, id, _ref, _ref1;
      if (languageScope == null) {
        languageScope = 'base';
      }
      _ref = this.settings;
      for (id in _ref) {
        config = _ref[id];
        if ((config.selector != null) && config.selector.indexOf(languageScope) !== -1) {
          if ((_ref1 = config[character]) != null ? _ref1.enabled : void 0) {
            return config[character];
          }
        }
      }
      return this.settings.aligner[character];
    };


    /*
    @function
    @name canAlignWith
    @description
    Check if the character can align with the original character. Usually used
    for checking operator with prefixes
    @param {string} character Original character
    @param {string} toMatch Character to see if it can be align with original character
    @param {object} config
    @returns {boolean}
     */

    OperationConfig.prototype.canAlignWith = function(character, toMatch, config) {
      var alignWith;
      if (character === toMatch) {
        return true;
      }
      alignWith = config.alignWith;
      return (alignWith != null) && (__indexOf.call(alignWith, toMatch) >= 0);
    };


    /*
    @function
    @name isPrefixed
    @description
    Check if the operator/character has prefix or not
    @param {string} character
    @param {Object} config
    @returns {boolean}
     */

    OperationConfig.prototype.isPrefixed = function(character, config) {
      var prefixed;
      prefixed = config != null ? config.prefixed : void 0;
      return (prefixed != null) && (__indexOf.call(prefixed, character) >= 0);
    };

    return OperationConfig;

  })();

  module.exports = new OperationConfig();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYWxpZ25lci9saWIvb3BlcmF0b3ItY29uZmlnLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0Q0FBQTtJQUFBO3lKQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBQVYsQ0FBQTs7QUFBQSxFQUNBLE1BQUEsR0FBVSxPQUFBLENBQVEsUUFBUixDQURWLENBQUE7O0FBQUEsRUFFQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFGRCxDQUFBOztBQUlBO0FBQUE7Ozs7Ozs7Ozs7OztLQUpBOztBQUFBLEVBa0JNO0FBQ1MsSUFBQSx5QkFBQSxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLEVBQVosQ0FEVztJQUFBLENBQWI7O0FBR0E7QUFBQTs7Ozs7OztPQUhBOztBQUFBLDhCQVdBLEdBQUEsR0FBSyxTQUFDLEVBQUQsRUFBSyxRQUFMLEdBQUE7QUFDSCxVQUFBLGdCQUFBO0FBQUEsTUFBQSxJQUFHLHlCQUFIO0FBRUUsUUFBQSxPQUFPLENBQUMsS0FBUixDQUFjLEVBQUEsR0FBRyxFQUFILEdBQU0sNkJBQXBCLENBQUEsQ0FBQTtBQUNBLGVBQVcsSUFBQSxVQUFBLENBQUEsQ0FBWCxDQUhGO09BQUE7QUFBQSxNQUtBLFVBQUEsR0FBZ0IsTUFBQSxDQUFPLEVBQVAsRUFBVyxRQUFRLENBQUMsTUFBcEIsRUFBNEIsUUFBUSxDQUFDLGFBQXJDLENBTGhCLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxRQUFTLENBQUEsRUFBQSxDQUFWLEdBQWdCLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixVQUFuQixDQU5oQixDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsUUFBUyxDQUFBLEVBQUEsQ0FBRyxDQUFDLFFBQWQsNENBQTBDLENBQUUs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

//# sourceURL=/Users/anas/.atom/packages/aligner/lib/operator-config.coffee
