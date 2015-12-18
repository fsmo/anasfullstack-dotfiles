(function() {
  var getOptions, init, lazyHeaders, markdownIt, markdownItOptions, math, mathBlock, mathBrackets, mathDollars, mathInline, needsInit, renderLaTeX;

  markdownIt = null;

  markdownItOptions = null;

  renderLaTeX = null;

  math = null;

  lazyHeaders = null;

  mathInline = function(string) {
    return "<span class='math'><script type='math/tex'>" + string + "</script></span>";
  };

  mathBlock = function(string) {
    return "<span class='math'><script type='math/tex; mode=display'>" + string + "</script></span>";
  };

  mathDollars = {
    inlineOpen: '$',
    inlineClose: '$',
    blockOpen: '$$',
    blockClose: '$$',
    inlineRenderer: mathInline,
    blockRenderer: mathBlock
  };

  mathBrackets = {
    inlineOpen: '\\(',
    inlineClose: '\\)',
    blockOpen: '\\[',
    blockClose: '\\]',
    inlineRenderer: mathInline,
    blockRenderer: mathBlock
  };

  getOptions = function() {
    return {
      html: true,
      xhtmlOut: false,
      breaks: atom.config.get('markdown-preview-plus.breakOnSingleNewline'),
      langPrefix: 'lang-',
      linkify: true,
      typographer: true
    };
  };

  init = function(rL) {
    renderLaTeX = rL;
    markdownItOptions = getOptions();
    markdownIt = require('markdown-it')(markdownItOptions);
    if (renderLaTeX) {
      if (math == null) {
        math = require('markdown-it-math');
      }
      markdownIt.use(math, mathDollars);
      markdownIt.use(math, mathBrackets);
    }
    lazyHeaders = atom.config.get('markdown-preview-plus.useLazyHeaders');
    if (lazyHeaders) {
      return markdownIt.use(require('markdown-it-lazy-headers'));
    }
  };

  needsInit = function(rL) {
    return (markdownIt == null) || markdownItOptions.breaks !== atom.config.get('markdown-preview-plus.breakOnSingleNewline') || lazyHeaders !== atom.config.get('markdown-preview-plus.useLazyHeaders') || rL !== renderLaTeX;
  };

  exports.render = function(text, rL) {
    if (needsInit(rL)) {
      init(rL);
    }
    return markdownIt.render(text);
  };

  exports.decode = function(url) {
    return markdownIt.normalizeLinkText(url);
  };

  exports.getTokens = function(text, rL) {
    if (needsInit(rL)) {
      init(rL);
    }
    return markdownIt.parse(text, {});
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24tcHJldmlldy1wbHVzL2xpYi9tYXJrZG93bi1pdC1oZWxwZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRJQUFBOztBQUFBLEVBQUEsVUFBQSxHQUFhLElBQWIsQ0FBQTs7QUFBQSxFQUNBLGlCQUFBLEdBQW9CLElBRHBCLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsSUFGZCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLElBSFAsQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyxJQUpkLENBQUE7O0FBQUEsRUFNQSxVQUFBLEdBQWEsU0FBQyxNQUFELEdBQUE7V0FBYSw2Q0FBQSxHQUE2QyxNQUE3QyxHQUFvRCxtQkFBakU7RUFBQSxDQU5iLENBQUE7O0FBQUEsRUFPQSxTQUFBLEdBQVksU0FBQyxNQUFELEdBQUE7V0FBYSwyREFBQSxHQUEyRCxNQUEzRCxHQUFrRSxtQkFBL0U7RUFBQSxDQVBaLENBQUE7O0FBQUEsRUFTQSxXQUFBLEdBQ0U7QUFBQSxJQUFBLFVBQUEsRUFBWSxHQUFaO0FBQUEsSUFDQSxXQUFBLEVBQWEsR0FEYjtBQUFBLElBRUEsU0FBQSxFQUFXLElBRlg7QUFBQSxJQUdBLFVBQUEsRUFBWSxJQUhaO0FBQUEsSUFJQSxjQUFBLEVBQWdCLFVBSmhCO0FBQUEsSUFLQSxhQUFBLEVBQWUsU0FMZjtHQVZGLENBQUE7O0FBQUEsRUFpQkEsWUFBQSxHQUNFO0FBQUEsSUFBQSxVQUFBLEVBQVksS0FBWjtBQUFBLElBQ0EsV0FBQSxFQUFhLEtBRGI7QUFBQSxJQUVBLFNBQUEsRUFBVyxLQUZYO0FBQUEsSUFHQSxVQUFBLEVBQVksS0FIWjtBQUFBLElBSUEsY0FBQSxFQUFnQixVQUpoQjtBQUFBLElBS0EsYUFBQSxFQUFlLFNBTGY7R0FsQkYsQ0FBQTs7QUFBQSxFQXlCQSxVQUFBLEdBQWEsU0FBQSxHQUFBO1dBQ1g7QUFBQSxNQUFBLElBQUEsRUFBTSxJQUFOO0FBQUEsTUFDQSxRQUFBLEVBQVUsS0FEVjtBQUFBLE1BRUEsTUFBQSxFQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0Q0FBaEIsQ0FGUjtBQUFBLE1BR0EsVUFBQSxFQUFZLE9BSFo7QUFBQSxNQUlBLE9BQUEsRUFBUyxJQUpUO0FBQUEsTUFLQSxXQUFBLEVBQWEsSUFMYjtNQURXO0VBQUEsQ0F6QmIsQ0FBQTs7QUFBQSxFQWtDQSxJQUFBLEdBQU8sU0FBQyxFQUFELEdBQUE7QUFFTCxJQUFBLFdBQUEsR0FBYyxFQUFkLENBQUE7QUFBQSxJQUVBLGlCQUFBLEdBQW9CLFVBQUEsQ0FBQSxDQUZwQixDQUFBO0FBQUEsSUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGFBQVIsQ0FBQSxDQUF1QixpQkFBdkIsQ0FKYixDQUFBO0FBTUEsSUFBQSxJQUFHLFdBQUg7O1FBQ0UsT0FBUSxPQUFBLENBQVEsa0JBQVI7T0FBUjtBQUFBLE1BQ0EsVUFBVSxDQUFDLEdBQVgsQ0FBZSxJQUFmLEVBQXFCLFdBQXJCLENBREEsQ0FBQTtBQUFBLE1BRUEsVUFBVSxDQUFDLEdBQVgsQ0FBZSxJQUFmLEVBQXFCLFlBQXJCLENBRkEsQ0FERjtLQU5BO0FBQUEsSUFXQSxXQUFBLEdBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQixDQVhkLENBQUE7QUFhQSxJQUFBLElBQUcsV0FBSDthQUNFLFVBQVUsQ0FBQyxHQUFYLENBQWUsT0FBQSxDQUFRLDBCQUFSLENBQWYsRUFERjtLQWZLO0VBQUEsQ0FsQ1AsQ0FBQTs7QUFBQSxFQXFEQSxTQUFBLEdBQVksU0FBQyxFQUFELEdBQUE7V0FDTixvQkFBSixJQUNBLGlCQUFpQixDQUFDLE1BQWxCLEtBQThCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0Q0FBaEIsQ0FEOUIsSUFFQSxXQUFBLEtBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEIsQ0FGakIsSUFHQSxFQUFBLEtBQVEsWUFKRTtFQUFBLENBckRaLENBQUE7O0FBQUEsRUEyREEsT0FBTyxDQUFDLE1BQVIsR0FBaUIsU0FBQyxJQUFELEVBQU8sRUFBUCxHQUFBO0FBQ2YsSUFBQSxJQUFZLFNBQUEsQ0FBVSxFQUFWLENBQVo7QUFBQSxNQUFBLElBQUEsQ0FBSyxFQUFMLENBQUEsQ0FBQTtLQUFBO1dBQ0EsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsSUFBbEIsRUFGZTtFQUFBLENBM0RqQixDQUFBOztBQUFBLEVBK0RBLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLFNBQUMsR0FBRCxHQUFBO1dBQ2YsVUFBVSxDQUFDLGlCQUFYLENBQTZCLEdBQTdCLEVBRGU7RUFBQSxDQS9EakIsQ0FBQTs7QUFBQSxFQWtFQSxPQUFPLENBQUMsU0FBUixHQUFvQixTQUFDLElBQUQsRUFBTyxFQUFQLEdBQUE7QUFDbEIsSUFBQSxJQUFZLFNBQUEsQ0FBVSxFQUFWLENBQVo7QUFBQSxNQUFBLElBQUEsQ0FBSyxFQUFMLENBQUEsQ0FBQTtLQUFBO1dBQ0EsVUFBVSxDQUFDLEtBQVgsQ0FBaUIsSUFBakIsRUFBdUIsRUFBdkIsRUFGa0I7RUFBQSxDQWxFcEIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/anas/.atom/packages/markdown-preview-plus/lib/markdown-it-helper.coffee
