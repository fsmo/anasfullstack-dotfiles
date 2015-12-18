(function() {
  var Aligner, CompositeDisposable, configs, extend, formatter, helper, operatorConfig, providerManager;

  operatorConfig = require('./operator-config');

  helper = require('./helper');

  providerManager = require('./provider-manager');

  formatter = require('./formatter');

  configs = require('../config');

  extend = require('extend');

  CompositeDisposable = require('atom').CompositeDisposable;

  Aligner = (function() {
    function Aligner() {}

    Aligner.prototype.config = operatorConfig.getAtomConfig();


    /*
    @param {Editor} editor
     */

    Aligner.prototype.align = function(editor) {
      var range, rangesWithContent, _i, _len, _ref;
      rangesWithContent = [];
      _ref = editor.getSelectedBufferRanges();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        range = _ref[_i];
        if (range.isEmpty()) {
          this.alignAtRow(editor, range.start.row);
        } else {
          rangesWithContent.push(range);
        }
      }
      if (rangesWithContent.length > 0) {
        this.alignRanges(editor, rangesWithContent);
      }
    };

    Aligner.prototype.alignAtRow = function(editor, row) {
      var character, offset, range, _ref;
      character = helper.getAlignCharacter(editor, row);
      if (!character) {
        return;
      }
      _ref = helper.getSameIndentationRange(editor, row, character), range = _ref.range, offset = _ref.offset;
      return formatter.formatRange(editor, range, character, offset);
    };

    Aligner.prototype.alignRanges = function(editor, ranges) {
      var character, offsets, range, _i, _len, _results;
      character = helper.getAlignCharacterInRanges(editor, ranges);
      if (!character) {
        return;
      }
      offsets = helper.getOffsets(editor, character, ranges);
      _results = [];
      for (_i = 0, _len = ranges.length; _i < _len; _i++) {
        range = ranges[_i];
        _results.push(formatter.formatRange(editor, range, character, offsets));
      }
      return _results;
    };

    Aligner.prototype.activate = function() {
      var alignerConfig;
      this.disposables = new CompositeDisposable;
      this.disposables.add(atom.config.observe('aligner', function(value) {
        return operatorConfig.updateConfigWithAtom('aligner', value);
      }));
      this.disposables.add(atom.commands.add('atom-text-editor', 'aligner:align', (function(_this) {
        return function() {
          return _this.align(atom.workspace.getActiveTextEditor());
        };
      })(this)));
      alignerConfig = extend(true, {}, configs);
      extend(true, alignerConfig.config, atom.config.get('aligner'));
      this.disposables.add(operatorConfig.add('aligner', alignerConfig));
      return this.disposables.add(atom.config.observe('aligner', function(value) {
        return operatorConfig.updateConfigWithAtom('aligner', value);
      }));
    };

    Aligner.prototype.deactivate = function() {
      this.disposables.dispose();
      return this.disposables = null;
    };

    Aligner.prototype.registerProviders = function(provider) {
      return this.disposables.add(providerManager.register(provider));
    };

    return Aligner;

  })();

  module.exports = new Aligner();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYWxpZ25lci9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUdBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWtCLE9BQUEsQ0FBUSxtQkFBUixDQUFsQixDQUFBOztBQUFBLEVBQ0EsTUFBQSxHQUFrQixPQUFBLENBQVEsVUFBUixDQURsQixDQUFBOztBQUFBLEVBRUEsZUFBQSxHQUFrQixPQUFBLENBQVEsb0JBQVIsQ0FGbEIsQ0FBQTs7QUFBQSxFQUdBLFNBQUEsR0FBa0IsT0FBQSxDQUFRLGFBQVIsQ0FIbEIsQ0FBQTs7QUFBQSxFQUlBLE9BQUEsR0FBa0IsT0FBQSxDQUFRLFdBQVIsQ0FKbEIsQ0FBQTs7QUFBQSxFQUtBLE1BQUEsR0FBa0IsT0FBQSxDQUFRLFFBQVIsQ0FMbEIsQ0FBQTs7QUFBQSxFQU1DLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFORCxDQUFBOztBQUFBLEVBUU07eUJBQ0o7O0FBQUEsc0JBQUEsTUFBQSxHQUFRLGNBQWMsQ0FBQyxhQUFmLENBQUEsQ0FBUixDQUFBOztBQUVBO0FBQUE7O09BRkE7O0FBQUEsc0JBS0EsS0FBQSxHQUFPLFNBQUMsTUFBRCxHQUFBO0FBQ0wsVUFBQSx3Q0FBQTtBQUFBLE1BQUEsaUJBQUEsR0FBb0IsRUFBcEIsQ0FBQTtBQUNBO0FBQUEsV0FBQSwyQ0FBQTt5QkFBQTtBQUVFLFFBQUEsSUFBRyxLQUFLLENBQUMsT0FBTixDQUFBLENBQUg7QUFDRSxVQUFBLElBQUMsQ0FBQSxVQUFELENBQVksTUFBWixFQUFvQixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQWhDLENBQUEsQ0FERjtTQUFBLE1BQUE7QUFJRSxVQUFBLGlCQUFpQixDQUFDLElBQWxCLENBQXVCLEtBQXZCLENBQUEsQ0FKRjtTQUZG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

//# sourceURL=/Users/anas/.atom/packages/aligner/lib/main.coffee
