(function() {
  "use strict";
  var MathJaxHelper, UpdatePreview, WrappedDomTree, prepareCodeBlocksForAtomEditors, renderer;

  WrappedDomTree = require('./wrapped-dom-tree');

  MathJaxHelper = require('./mathjax-helper');

  renderer = require('./renderer');

  module.exports = UpdatePreview = (function() {
    function UpdatePreview(dom) {
      this.tree = new WrappedDomTree(dom, true);
      this.domFragment = document.createDocumentFragment();
    }

    UpdatePreview.prototype.update = function(domFragment, renderLaTeX) {
      var elm, firstTime, newDom, newTree, r, _i, _len, _ref;
      prepareCodeBlocksForAtomEditors(domFragment);
      if (domFragment.isEqualNode(this.domFragment)) {
        return;
      }
      firstTime = this.domFragment.childElementCount === 0;
      this.domFragment = domFragment.cloneNode(true);
      newDom = document.createElement("div");
      newDom.className = "update-preview";
      newDom.appendChild(domFragment);
      newTree = new WrappedDomTree(newDom);
      r = this.tree.diffTo(newTree);
      newTree.removeSelf();
      if (firstTime) {
        r.possibleReplace = null;
        r.last = null;
      }
      if (renderLaTeX) {
        r.inserted = r.inserted.map(function(elm) {
          while (elm && !elm.innerHTML) {
            elm = elm.parentElement;
          }
          return elm;
        });
        r.inserted = r.inserted.filter(function(elm) {
          return !!elm;
        });
        MathJaxHelper.mathProcessor(r.inserted);
      }
      _ref = r.inserted;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elm = _ref[_i];
        if (elm instanceof Element) {
          renderer.convertCodeBlocksToAtomEditors(elm);
        }
      }
      this.updateOrderedListsStart();
      return r;
    };

    UpdatePreview.prototype.updateOrderedListsStart = function() {
      var i, parsedOLs, parsedStart, previewOLs, previewStart, _i, _ref;
      previewOLs = this.tree.shownTree.dom.querySelectorAll('ol');
      parsedOLs = this.domFragment.querySelectorAll('ol');
      for (i = _i = 0, _ref = parsedOLs.length - 1; _i <= _ref; i = _i += 1) {
        previewStart = previewOLs[i].getAttribute('start');
        parsedStart = parsedOLs[i].getAttribute('start');
        if (previewStart === parsedStart) {
          continue;
        } else if (parsedStart != null) {
          previewOLs[i].setAttribute('start', parsedStart);
        } else {
          previewOLs[i].removeAttribute('start');
        }
      }
    };

    return UpdatePreview;

  })();

  prepareCodeBlocksForAtomEditors = function(domFragment) {
    var preElement, preWrapper, _i, _len, _ref;
    _ref = domFragment.querySelectorAll('pre');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      preElement = _ref[_i];
      preWrapper = document.createElement('span');
      preWrapper.className = 'atom-text-editor';
      preElement.parentNode.insertBefore(preWrapper, preElement);
      preWrapper.appendChild(preElement);
    }
    return domFragment;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24tcHJldmlldy1wbHVzL2xpYi91cGRhdGUtcHJldmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFzQkE7QUFBQSxFQUFBLFlBQUEsQ0FBQTtBQUFBLE1BQUEsdUZBQUE7O0FBQUEsRUFFQSxjQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUixDQUZsQixDQUFBOztBQUFBLEVBR0EsYUFBQSxHQUFrQixPQUFBLENBQVEsa0JBQVIsQ0FIbEIsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsR0FBa0IsT0FBQSxDQUFRLFlBQVIsQ0FKbEIsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBR1IsSUFBQSx1QkFBQyxHQUFELEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxJQUFELEdBQW9CLElBQUEsY0FBQSxDQUFlLEdBQWYsRUFBb0IsSUFBcEIsQ0FBcEIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZ0IsUUFBUSxDQUFDLHNCQUFULENBQUEsQ0FEaEIsQ0FEVztJQUFBLENBQWI7O0FBQUEsNEJBSUEsTUFBQSxHQUFRLFNBQUMsV0FBRCxFQUFjLFdBQWQsR0FBQTtBQUNOLFVBQUEsa0RBQUE7QUFBQSxNQUFBLCtCQUFBLENBQWdDLFdBQWhDLENBQUEsQ0FBQTtBQUVBLE1BQUEsSUFBRyxXQUFXLENBQUMsV0FBWixDQUF3QixJQUFDLENBQUEsV0FBekIsQ0FBSDtBQUNFLGNBQUEsQ0FERjtPQUZBO0FBQUEsTUFLQSxTQUFBLEdBQWdCLElBQUMsQ0FBQSxXQUFXLENBQUMsaUJBQWIsS0FBa0MsQ0FMbEQsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLFdBQUQsR0FBZ0IsV0FBVyxDQUFDLFNBQVosQ0FBc0IsSUFBdEIsQ0FOaEIsQ0FBQTtBQUFBLE1BUUEsTUFB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

//# sourceURL=/Users/anas/.atom/packages/markdown-preview-plus/lib/update-preview.coffee
