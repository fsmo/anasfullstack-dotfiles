(function() {
  var KeyMapper, KeyboardLocalization, KeymapGeneratorUri, KeymapGeneratorView, KeymapLoader, ModifierStateHandler, createKeymapGeneratorView, util, vimModeActive;

  util = require('util');

  KeymapLoader = require('./keymap-loader');

  KeyMapper = require('./key-mapper');

  ModifierStateHandler = require('./modifier-state-handler');

  vimModeActive = require('./helpers').vimModeActive;

  KeymapGeneratorView = null;

  KeymapGeneratorUri = 'atom://keyboard-localization/keymap-manager';

  createKeymapGeneratorView = function(state) {
    if (KeymapGeneratorView == null) {
      KeymapGeneratorView = require('./views/keymap-generator-view');
    }
    return new KeymapGeneratorView(state);
  };

  atom.deserializers.add({
    name: 'KeymapGeneratorView',
    deserialize: function(state) {
      return createKeymapGeneratorView(state);
    }
  });

  KeyboardLocalization = {
    pkg: 'keyboard-localization',
    keystrokeForKeyboardEventCb: null,
    keymapLoader: null,
    keyMapper: null,
    modifierStateHandler: null,
    keymapGeneratorView: null,
    config: {
      useKeyboardLayout: {
        type: 'string',
        "default": 'de_DE',
        "enum": ['cs_CZ-qwerty', 'da_DK', 'de_CH', 'de_DE-neo', 'de_DE', 'es_ES', 'es_LA', 'fr_BE', 'fr_CH', 'fr_FR', 'fr_CA', 'hu_HU', 'it_IT', 'ja_JP', 'lv_LV', 'nb_NO', 'pl_PL', 'pt_BR', 'pt_PT', 'ro_RO', 'sl_SL', 'sv_SE'],
        description: 'Pick your locale'
      },
      useKeyboardLayoutFromPath: {
        type: 'string',
        "default": '',
        description: 'Provide an absolute path to your keymap-json file'
      }
    },
    activate: function(state) {
      atom.workspace.addOpener(function(filePath) {
        if (filePath === KeymapGeneratorUri) {
          return createKeymapGeneratorView({
            uri: KeymapGeneratorUri
          });
        }
      });
      atom.commands.add('atom-workspace', {
        'keyboard-localization:keymap-generator': function() {
          return atom.workspace.open(KeymapGeneratorUri);
        }
      });
      this.keymapLoader = new KeymapLoader();
      this.keymapLoader.loadKeymap();
      this.keyMapper = KeyMapper.getInstance();
      this.modifierStateHandler = new ModifierStateHandler();
      this.changeUseKeyboardLayout = atom.config.onDidChange([this.pkg, 'useKeyboardLayout'].join('.'), (function(_this) {
        return function() {
          _this.keymapLoader.loadKeymap();
          if (_this.keymapLoader.isLoaded()) {
            return _this.keyMapper.setKeymap(_this.keymapLoader.getKeymap());
          }
        };
      })(this));
      this.changeUseKeyboardLayoutFromPath = atom.config.onDidChange([this.pkg, 'useKeyboardLayoutFromPath'].join('.'), (function(_this) {
        return function() {
          _this.keymapLoader.loadKeymap();
          if (_this.keymapLoader.isLoaded()) {
            return _this.keyMapper.setKeymap(_this.keymapLoader.getKeymap());
          }
        };
      })(this));
      if (this.keymapLoader.isLoaded()) {
        this.keyMapper.setKeymap(this.keymapLoader.getKeymap());
        this.keyMapper.setModifierStateHandler(this.modifierStateHandler);
        this.orginalKeydownEvent = atom.keymaps.keystrokeForKeyboardEvent;
        return atom.keymaps.keystrokeForKeyboardEvent = (function(_this) {
          return function(event) {
            return _this.onKeyDown(event);
          };
        })(this);
      }
    },
    deactivate: function() {
      var _ref;
      if (this.keymapLoader.isLoaded()) {
        atom.keymaps.keystrokeForKeyboardEvent = this.orginalKeydownEvent;
        this.orginalKeydownEvent = null;
      }
      this.changeUseKeyboardLayout.dispose();
      this.changeUseKeyboardLayoutFromPath.dispose();
      if ((_ref = this.keymapGeneratorView) != null) {
        _ref.destroy();
      }
      this.modifierStateHandler = null;
      this.keymapLoader = null;
      this.keyMapper = null;
      return this.keymapGeneratorView = null;
    },
    onKeyDown: function(event, cb) {
      var character;
      this.modifierStateHandler.handleKeyEvent(event);
      if (this.keyMapper.remap(event)) {
        character = String.fromCharCode(event.keyCode);
        if (this.modifierStateHandler.isAltGr() || vimModeActive(event.target)) {
          return character;
        } else {
          return this.modifierStateHandler.getStrokeSequence(character);
        }
      } else {
        return this.orginalKeydownEvent(event);
      }
    }
  };

  module.exports = KeyboardLocalization;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMva2V5Ym9hcmQtbG9jYWxpemF0aW9uL2xpYi9rZXlib2FyZC1sb2NhbGl6YXRpb24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRKQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FEZixDQUFBOztBQUFBLEVBRUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBRlosQ0FBQTs7QUFBQSxFQUdBLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUSwwQkFBUixDQUh2QixDQUFBOztBQUFBLEVBSUMsZ0JBQWlCLE9BQUEsQ0FBUSxXQUFSLEVBQWpCLGFBSkQsQ0FBQTs7QUFBQSxFQU1BLG1CQUFBLEdBQXNCLElBTnRCLENBQUE7O0FBQUEsRUFPQSxrQkFBQSxHQUFxQiw2Q0FQckIsQ0FBQTs7QUFBQSxFQVNBLHlCQUFBLEdBQTRCLFNBQUMsS0FBRCxHQUFBOztNQUMxQixzQkFBdUIsT0FBQSxDQUFRLCtCQUFSO0tBQXZCO1dBQ0ksSUFBQSxtQkFBQSxDQUFvQixLQUFwQixFQUZzQjtFQUFBLENBVDVCLENBQUE7O0FBQUEsRUFhQSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQW5CLENBQ0U7QUFBQSxJQUFBLElBQUEsRUFBTSxxQkFBTjtBQUFBLElBQ0EsV0FBQSxFQUFhLFNBQUMsS0FBRCxHQUFBO2FBQVcseUJBQUEsQ0FBMEIsS0FBMUIsRUFBWDtJQUFBLENBRGI7R0FERixDQWJBLENBQUE7O0FBQUEsRUFpQkEsb0JBQUEsR0FDRTtBQUFBLElBQUEsR0FBQSxFQUFLLHVCQUFMO0FBQUEsSUFDQSwyQkFBQSxFQUE2QixJQUQ3QjtBQUFBLElBRUEsWUFBQSxFQUFjLElBRmQ7QUFBQSxJQUdBLFNBQUEsRUFBVyxJQUhYO0FBQUEsSUFJQSxvQkFBQSxFQUFzQixJQUp0QjtBQUFBLElBS0EsbUJBQUEsRUFBcUIsSUFMckI7QUFBQSxJQU9BLE1BQUEsRUFDRTtBQUFBLE1BQUEsaUJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxPQURUO0FBQUEsUUFFQSxNQUFBLEVBQU0sQ0FDSixjQURJLEVBRUosT0FGSSxFQUdKLE9BSEksRUFJSixXQUpJLEVBS0osT0FMSSxFQU1KLE9BTkksRUFPSixPQVBJLEVBUUosT0FSSSxFQVNKLE9BVEksRUFVSixPQVZJLEVBV0osT0FYSSxFQVlKLE9BWkksRUFhSixPQWJJLEVBY0osT0FkSSxFQWVKLE9BZkksRUFnQkosT0FoQkksRUFpQkosT0FqQkksRUFrQkosT0FsQkksRUFtQkosT0FuQkksRUFvQkosT0FwQkksRUFxQkosT0FyQkksRUFzQkosT0F0QkksQ0FGTjtBQUFBLFFBMEJBLFdBQUEsRUFBYSxrQkExQmI7T0FERjtBQUFBLE1BNEJBLHlCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLG1EQUZiO09BN0JGO0tBUkY7QUFBQSxJQXlDQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBZixDQUF5QixTQUFDLFFBQUQsR0FBQTtBQUN2QixRQUFBLElBQXNELFFBQUEsS0FBWSxrQkFBbEU7aUJBQUEseUJBQUEsQ0FBMEI7QUFBQSxZQUFBLEdBQUEsRUFBSyxrQkFBTDtXQUExQixFQUFBO1NBRHVCO01BQUEsQ0FBekIsQ0FBQSxDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ0U7QUFBQSxRQUFBLHdDQUFBLEVBQTBDLFNBQUEsR0FBQTtpQkFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0Isa0JBQXBCLEVBQUg7UUFBQSxDQUExQztPQURGLENBSEEsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLFlBQUQsR0FBb0IsSUFBQSxZQUFBLENBQUEsQ0FOcEIsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLFlBQVksQ0FBQyxVQUFkLENBQUEsQ0FQQSxDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsU0FBRCxHQUFhLFNBQVMsQ0FBQyxXQUFWLENBQUEsQ0FSYixDQUFBO0FBQUEsTUFTQSxJQUFDLENBQUEsb0JBQUQsR0FBNEIsSUFBQSxvQkFBQSxDQUFBLENBVDVCLENBQUE7QUFBQSxNQVlBLElBQUMsQ0FBQSx1QkFBRCxHQUEyQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0IsQ0FBQyxJQUFDLENBQUEsR0FBRixFQUFPLG1CQUFQLENBQTJCLENBQUMsSUFBNUIsQ0FBaUMsR0FBakMsQ0FBeEIsRUFBK0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN4RixVQUFBLEtBQUMsQ0FBQSxZQUFZLENBQUMsVUFBZCxDQUFBLENBQUEsQ0FBQTtBQUNBLFVBQUEsSUFBRyxLQUFDLENBQUEsWUFBWSxDQUFDLFFBQWQsQ0FBQSxDQUFIO21CQUNFLEtBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFxQixLQUFDLENBQUEsWUFBWSxDQUFDLFNBQWQsQ0FBQSxDQUFyQixFQURGO1dBRndGO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0QsQ0FaM0IsQ0FBQTtBQUFBLE1BZ0JBLElBQUMsQ0FBQSwrQkFBRCxHQUFtQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0IsQ0FBQyxJQUFDLENBQUEsR0FBRixFQUFPLDJCQUFQLENBQW1DLENBQUMsSUFBcEMsQ0FBeUMsR0FBekMsQ0FBeEIsRUFBdUUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN4RyxVQUFBLEtBQUMsQ0FBQSxZQUFZLENBQUMsVUFBZCxDQUFBLENBQUEsQ0FBQTtBQUNBLFVBQUEsSUFBRyxLQUFDLENBQUEsWUFBWSxDQUFDLFFBQWQsQ0FBQSxDQUFIO21CQUNFLEtBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFxQixLQUFDLENBQUEsWUFBWSxDQUFDLFNBQWQsQ0FBQSxDQUFyQixFQURGO1dBRndHO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkUsQ0FoQm5DLENBQUE7QUFxQkEsTUFBQSxJQUFHLElBQUMsQ0FBQSxZQUFZLENBQUMsUUFBZCxDQUFBLENBQUg7QUFDRSxRQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFxQixJQUFDLENBQUEsWUFBWSxDQUFDLFNBQWQsQ0FBQSxDQUFyQixDQUFBLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsdUJBQVgsQ0FBbUMsSUFBQyxDQUFBLG9CQUFwQyxDQURBLENBQUE7QUFBQSxRQUtBLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixJQUFJLENBQUMsT0FBTyxDQUFDLHlCQUxwQyxDQUFBO2VBTUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyx5QkFBYixHQUF5QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsS0FBRCxHQUFBO21CQUN2QyxLQUFDLENBQUEsU0FBRCxDQUFXLEtBQVgsRUFEdUM7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxFQVAzQztPQXRCUTtJQUFBLENBekNWO0FBQUEsSUF5RUEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBRyxJQUFDLENBQUEsWUFBWSxDQUFDLFFBQWQsQ0FBQSxDQUFIO0FBQ0UsUUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLHlCQUFiLEdBQXlDLElBQUMsQ0FBQSxtQkFBMUMsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLG1CQUFELEdBQXVCLElBRHZCLENBREY7T0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLHVCQUF1QixDQUFDLE9BQXpCLENBQUEsQ0FKQSxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsK0JBQStCLENBQUMsT0FBakMsQ0FBQSxDQUxBLENBQUE7O1lBT29CLENBQUUsT0FBdEIsQ0FBQTtPQVBBO0FBQUEsTUFTQSxJQUFDLENBQUEsb0JBQUQsR0FBd0IsSUFUeEIsQ0FBQTtBQUFBLE1BVUEsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFWaEIsQ0FBQTtBQUFBLE1BV0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQVhiLENBQUE7YUFZQSxJQUFDLENBQUEsbUJBQUQsR0FBdUIsS0FiYjtJQUFBLENBekVaO0FBQUEsSUF3RkEsU0FBQSxFQUFXLFNBQUMsS0FBRCxFQUFRLEVBQVIsR0FBQTtBQUNULFVBQUEsU0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLG9CQUFvQixDQUFDLGNBQXRCLENBQXFDLEtBQXJDLENBQUEsQ0FBQTtBQUNBLE1BQUEsSUFBRyxJQUFDLENBQUEsU0FBUyxDQUFDLEtBQVgsQ0FBaUIsS0FBakIsQ0FBSDtBQUNFLFFBQUEsU0FBQSxHQUFZLE1BQU0sQ0FBQyxZQUFQLENBQW9CLEtBQUssQ0FBQyxPQUExQixDQUFaLENBQUE7QUFDQSxRQUFBLElBQUcsSUFBQyxDQUFBLG9CQUFvQixDQUFDLE9BQXRCLENBQUEsQ0FBQSxJQUFtQyxhQUFBLENBQWMsS0FBSyxDQUFDLE1BQXBCLENBQXRDO0FBQ0UsaUJBQU8sU0FBUCxDQURGO1NBQUEsTUFBQTtBQUdFLGlCQUFPLElBQUMsQ0FBQSxvQkFBb0IsQ0FBQyxpQkFBdEIsQ0FBd0MsU0FBeEMsQ0FBUCxDQUhGO1NBRkY7T0FBQSxNQUFBO0FBT0UsZUFBTyxJQUFDLENBQUEsbUJBQUQsQ0FBcUIsS0FBckIsQ0FBUCxDQVBGO09BRlM7SUFBQSxDQXhGWDtHQWxCRixDQUFBOztBQUFBLEVBcUhBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLG9CQXJIakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/anas/.atom/packages/keyboard-localization/lib/keyboard-localization.coffee
