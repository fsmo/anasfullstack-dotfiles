(function() {
  var AngularjsHelperView, FeatureGenerator, TextEditorView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, TextEditorView = _ref.TextEditorView;

  FeatureGenerator = require('./feature-generator');

  module.exports = AngularjsHelperView = (function(_super) {
    __extends(AngularjsHelperView, _super);

    function AngularjsHelperView() {
      return AngularjsHelperView.__super__.constructor.apply(this, arguments);
    }

    AngularjsHelperView.content = function() {
      return this.div({
        "class": 'angularjs-helper overlay from-top'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": "message"
          }, function() {
            return _this.subview('filterEditor', new TextEditorView({
              placeholderText: 'enter feature name',
              mini: true
            }));
          });
          return _this.div({
            "class": 'actions'
          }, function() {
            _this.button({
              "class": 'btn btn-primary',
              click: 'generateFeature'
            }, 'Generate');
            return _this.button({
              "class": 'btn btn-danger left-margin',
              click: 'toggle'
            }, 'Cancel');
          });
        };
      })(this));
    };

    AngularjsHelperView.prototype.initialize = function(serializeState) {
      return atom.commands.add('atom-text-editor', {
        'angularjs-helper:new-feature': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      });
    };

    AngularjsHelperView.prototype.generateFeature = function() {
      var featureName, generator;
      featureName = this.filterEditor.getText();
      generator = new FeatureGenerator();
      generator.generate(featureName);
      return this.toggle();
    };

    AngularjsHelperView.prototype.toggle = function() {
      var _ref1;
      if ((_ref1 = this.panel) != null ? _ref1.isVisible() : void 0) {
        return this.hide();
      } else {
        return this.show();
      }
    };

    AngularjsHelperView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      return this.panel.show();
    };

    AngularjsHelperView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    return AngularjsHelperView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYW5ndWxhcmpzLWhlbHBlci9saWIvYW5ndWxhcmpzLWhlbHBlci12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpRUFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBeUIsT0FBQSxDQUFRLHNCQUFSLENBQXpCLEVBQUMsWUFBQSxJQUFELEVBQU8sc0JBQUEsY0FBUCxDQUFBOztBQUFBLEVBQ0EsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHFCQUFSLENBRG5CLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0YsMENBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsbUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLG1DQUFQO09BQUwsRUFBaUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUM3QyxVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxTQUFQO1dBQUwsRUFBdUIsU0FBQSxHQUFBO21CQUNuQixLQUFDLENBQUEsT0FBRCxDQUFTLGNBQVQsRUFBNkIsSUFBQSxjQUFBLENBQWU7QUFBQSxjQUFBLGVBQUEsRUFBaUIsb0JBQWpCO0FBQUEsY0FBdUMsSUFBQSxFQUFNLElBQTdDO2FBQWYsQ0FBN0IsRUFEbUI7VUFBQSxDQUF2QixDQUFBLENBQUE7aUJBRUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLFNBQVA7V0FBTCxFQUF1QixTQUFBLEdBQUE7QUFDbkIsWUFBQSxLQUFDLENBQUEsTUFBRCxDQUFRO0FBQUEsY0FBQSxPQUFBLEVBQU8saUJBQVA7QUFBQSxjQUEwQixLQUFBLEVBQU8saUJBQWpDO2FBQVIsRUFBNEQsVUFBNUQsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxNQUFELENBQVE7QUFBQSxjQUFBLE9BQUEsRUFBTyw0QkFBUDtBQUFBLGNBQXFDLEtBQUEsRUFBTyxRQUE1QzthQUFSLEVBQThELFFBQTlELEVBRm1CO1VBQUEsQ0FBdkIsRUFINkM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqRCxFQURNO0lBQUEsQ0FBVixDQUFBOztBQUFBLGtDQVNBLFVBQUEsR0FBWSxTQUFDLGNBQUQsR0FBQTthQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFDSTtBQUFBLFFBQUEsOEJBQUEsRUFBZ0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEM7T0FESixFQURRO0lBQUEsQ0FUWixDQUFBOztBQUFBLGtDQWFBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2IsVUFBQSxzQkFBQTtBQUFBLE1BQUEsV0FBQSxHQUFjLElBQUMsQ0FBQSxZQUFZLENBQUMsT0FBZCxDQUFBLENBQWQsQ0FBQTtBQUFBLE1BRUEsU0FBQSxHQUFnQixJQUFBLGdCQUFBLENBQUEsQ0FGaEIsQ0FBQTtBQUFBLE1BR0EsU0FBUyxDQUFDLFFBQVYsQ0FBbUIsV0FBbkIsQ0FIQSxDQUFBO2FBS0EsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQU5hO0lBQUEsQ0FiakIsQ0FBQTs7QUFBQSxrQ0FzQkEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNKLFVBQUEsS0FBQTtBQUFBLE1BQUEsd0NBQVMsQ0FBRSxTQUFSLENBQUEsVUFBSDtlQUNFLElBQUMsQ0FBQSxJQUFELENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsSUFBRCxDQUFBLEVBSEY7T0FESTtJQUFBLENBdEJSLENBQUE7O0FBQUEsa0NBNEJBLElBQUEsR0FBTSxTQUFBLEdBQUE7O1FBQ0YsSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO0FBQUEsVUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3QjtPQUFWO2FBQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUEsRUFGRTtJQUFBLENBNUJOLENBQUE7O0FBQUEsa0NBZ0NBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDRixVQUFBLEtBQUE7aURBQU0sQ0FBRSxJQUFSLENBQUEsV0FERTtJQUFBLENBaENOLENBQUE7OytCQUFBOztLQUQ4QixLQUpsQyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/anas/.atom/packages/angularjs-helper/lib/angularjs-helper-view.coffee
