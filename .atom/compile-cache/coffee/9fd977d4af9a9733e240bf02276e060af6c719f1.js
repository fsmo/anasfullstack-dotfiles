(function() {
  var AnsiToHtml, AtomRunnerView, ScrollView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ScrollView = require('atom-space-pen-views').ScrollView;

  AnsiToHtml = require('ansi-to-html');

  module.exports = AtomRunnerView = (function(_super) {
    __extends(AtomRunnerView, _super);

    atom.deserializers.add(AtomRunnerView);

    AtomRunnerView.deserialize = function(_arg) {
      var footer, output, title, view;
      title = _arg.title, output = _arg.output, footer = _arg.footer;
      view = new AtomRunnerView(title);
      view._output.html(output);
      view._footer.html(footer);
      return view;
    };

    AtomRunnerView.content = function() {
      return this.div({
        "class": 'atom-runner',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.h1('Atom Runner');
          _this.pre({
            "class": 'output'
          });
          return _this.div({
            "class": 'footer'
          });
        };
      })(this));
    };

    function AtomRunnerView(title) {
      AtomRunnerView.__super__.constructor.apply(this, arguments);
      this._output = this.find('.output');
      this._footer = this.find('.footer');
      this.setTitle(title);
    }

    AtomRunnerView.prototype.serialize = function() {
      return {
        deserializer: 'AtomRunnerView',
        title: this.title,
        output: this._output.html(),
        footer: this._footer.html()
      };
    };

    AtomRunnerView.prototype.getTitle = function() {
      return "Atom Runner: " + this.title;
    };

    AtomRunnerView.prototype.setTitle = function(title) {
      this.title = title;
      return this.find('h1').html(this.getTitle());
    };

    AtomRunnerView.prototype.clear = function() {
      this._output.html('');
      return this._footer.html('');
    };

    AtomRunnerView.prototype.append = function(text, className) {
      var node, span;
      span = document.createElement('span');
      node = document.createTextNode(text);
      span.appendChild(node);
      span.innerHTML = new AnsiToHtml().toHtml(span.innerHTML);
      span.className = className || 'stdout';
      return this._output.append(span);
    };

    AtomRunnerView.prototype.footer = function(text) {
      return this._footer.html(text);
    };

    return AtomRunnerView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXRvbS1ydW5uZXIvbGliL2F0b20tcnVubmVyLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxzQkFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQURiLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0oscUNBQUEsQ0FBQTs7QUFBQSxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBbkIsQ0FBdUIsY0FBdkIsQ0FBQSxDQUFBOztBQUFBLElBRUEsY0FBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLElBQUQsR0FBQTtBQUNaLFVBQUEsMkJBQUE7QUFBQSxNQURjLGFBQUEsT0FBTyxjQUFBLFFBQVEsY0FBQSxNQUM3QixDQUFBO0FBQUEsTUFBQSxJQUFBLEdBQVcsSUFBQSxjQUFBLENBQWUsS0FBZixDQUFYLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBYixDQUFrQixNQUFsQixDQURBLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBYixDQUFrQixNQUFsQixDQUZBLENBQUE7YUFHQSxLQUpZO0lBQUEsQ0FGZCxDQUFBOztBQUFBLElBUUEsY0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sYUFBUDtBQUFBLFFBQXNCLFFBQUEsRUFBVSxDQUFBLENBQWhDO09BQUwsRUFBeUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN2QyxVQUFBLEtBQUMsQ0FBQSxFQUFELENB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

//# sourceURL=/Users/anas/.atom/packages/atom-runner/lib/atom-runner-view.coffee
