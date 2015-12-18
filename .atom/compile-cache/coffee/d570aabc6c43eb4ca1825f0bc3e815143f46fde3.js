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
        throw Error("" + id + " has already been activated");
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYWxpZ25lci9saWIvb3BlcmF0b3ItY29uZmlnLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0Q0FBQTtJQUFBO3lKQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBQVYsQ0FBQTs7QUFBQSxFQUNBLE1BQUEsR0FBVSxPQUFBLENBQVEsUUFBUixDQURWLENBQUE7O0FBQUEsRUFFQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFGRCxDQUFBOztBQUlBO0FBQUE7Ozs7Ozs7Ozs7OztLQUpBOztBQUFBLEVBa0JNO0FBQ1MsSUFBQSx5QkFBQSxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLEVBQVosQ0FEVztJQUFBLENBQWI7O0FBR0E7QUFBQTs7Ozs7OztPQUhBOztBQUFBLDhCQVdBLEdBQUEsR0FBSyxTQUFDLEVBQUQsRUFBSyxRQUFMLEdBQUE7QUFDSCxVQUFBLGdCQUFBO0FBQUEsTUFBQSxJQUFHLHlCQUFIO0FBQ0UsY0FBTSxLQUFBLENBQU0sRUFBQSxHQUFHLEVBQUgsR0FBTSw2QkFBWixDQUFOLENBREY7T0FBQTtBQUFBLE1BR0EsVUFBQSxHQUFnQixNQUFBLENBQU8sRUFBUCxFQUFXLFFBQVEsQ0FBQyxNQUFwQixFQUE0QixRQUFRLENBQUMsYUFBckMsQ0FIaEIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFFBQVMsQ0FBQSxFQUFBLENBQVYsR0FBZ0IsSUFBQyxDQUFBLGlCQUFELENBQW1CLFVBQW5CLENBSmhCLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxRQUFTLENBQUEsRUFBQSxDQUFHLENBQUMsUUFBZCw0Q0FBMEMsQ0FBRSxLQUFuQixDQUF5QixDQUF6QixVQU56QixDQUFBO0FBQUEsTUFRQSxJQUFDLENB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

//# sourceURL=/Users/anas/.atom/packages/aligner/lib/operator-config.coffee
