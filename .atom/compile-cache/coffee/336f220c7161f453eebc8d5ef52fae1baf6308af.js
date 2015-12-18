(function() {
  var $, Highlights, cheerio, fs, highlighter, imageWatcher, markdownIt, packagePath, pandocHelper, path, render, resolveImagePaths, resourcePath, sanitize, scopeForFenceName, tokenizeCodeBlocks, _;

  path = require('path');

  _ = require('underscore-plus');

  cheerio = require('cheerio');

  fs = require('fs-plus');

  Highlights = require('highlights-native');

  $ = require('atom-space-pen-views').$;

  pandocHelper = null;

  markdownIt = null;

  scopeForFenceName = require('./extension-helper').scopeForFenceName;

  imageWatcher = require('./image-watch-helper');

  highlighter = null;

  resourcePath = atom.getLoadSettings().resourcePath;

  packagePath = path.dirname(__dirname);

  exports.toDOMFragment = function(text, filePath, grammar, renderLaTeX, callback) {
    if (text == null) {
      text = '';
    }
    return render(text, filePath, renderLaTeX, false, function(error, html) {
      var domFragment, template;
      if (error != null) {
        return callback(error);
      }
      template = document.createElement('template');
      template.innerHTML = html;
      domFragment = template.content.cloneNode(true);
      return callback(null, domFragment);
    });
  };

  exports.toHTML = function(text, filePath, grammar, renderLaTeX, copyHTMLFlag, callback) {
    if (text == null) {
      text = '';
    }
    return render(text, filePath, renderLaTeX, copyHTMLFlag, function(error, html) {
      var defaultCodeLanguage;
      if (error != null) {
        return callback(error);
      }
      if ((grammar != null ? grammar.scopeName : void 0) === 'source.litcoffee') {
        defaultCodeLanguage = 'coffee';
      }
      html = tokenizeCodeBlocks(html, defaultCodeLanguage);
      return callback(null, html);
    });
  };

  render = function(text, filePath, renderLaTeX, copyHTMLFlag, callback) {
    var callbackFunction;
    text = text.replace(/^\s*<!doctype(\s+.*)?>\s*/i, '');
    callbackFunction = function(error, html) {
      if (error != null) {
        return callback(error);
      }
      html = sanitize(html);
      html = resolveImagePaths(html, filePath, copyHTMLFlag);
      return callback(null, html.trim());
    };
    if (atom.config.get('markdown-preview-plus.enablePandoc')) {
      if (pandocHelper == null) {
        pandocHelper = require('./pandoc-helper');
      }
      return pandocHelper.renderPandoc(text, filePath, renderLaTeX, callbackFunction);
    } else {
      if (markdownIt == null) {
        markdownIt = require('./markdown-it-helper');
      }
      return callbackFunction(null, markdownIt.render(text, renderLaTeX));
    }
  };

  sanitize = function(html) {
    var attribute, attributesToRemove, o, _i, _len;
    o = cheerio.load(html);
    o("script:not([type^='math/tex'])").remove();
    attributesToRemove = ['onabort', 'onblur', 'onchange', 'onclick', 'ondbclick', 'onerror', 'onfocus', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onmousedown', 'onmousemove', 'onmouseover', 'onmouseout', 'onmouseup', 'onreset', 'onresize', 'onscroll', 'onselect', 'onsubmit', 'onunload'];
    for (_i = 0, _len = attributesToRemove.length; _i < _len; _i++) {
      attribute = attributesToRemove[_i];
      o('*').removeAttr(attribute);
    }
    return o.html();
  };

  resolveImagePaths = function(html, filePath, copyHTMLFlag) {
    var e, img, imgElement, o, rootDirectory, src, v, _i, _len, _ref;
    if (atom.project != null) {
      rootDirectory = atom.project.relativizePath(filePath)[0];
    }
    o = cheerio.load(html);
    _ref = o('img');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      imgElement = _ref[_i];
      img = o(imgElement);
      if (src = img.attr('src')) {
        if (!atom.config.get('markdown-preview-plus.enablePandoc')) {
          if (markdownIt == null) {
            markdownIt = require('./markdown-it-helper');
          }
          src = markdownIt.decode(src);
        }
        if (src.match(/^(https?|atom):\/\//)) {
          continue;
        }
        if (src.startsWith(process.resourcesPath)) {
          continue;
        }
        if (src.startsWith(resourcePath)) {
          continue;
        }
        if (src.startsWith(packagePath)) {
          continue;
        }
        if (src[0] === '/') {
          if (!fs.isFileSync(src)) {
            try {
              src = path.join(rootDirectory, src.substring(1));
            } catch (_error) {
              e = _error;
            }
          }
        } else {
          src = path.resolve(path.dirname(filePath), src);
        }
        if (!copyHTMLFlag) {
          v = imageWatcher.getVersion(src, filePath);
          if (v) {
            src = "" + src + "?v=" + v;
          }
        }
        img.attr('src', src);
      }
    }
    return o.html();
  };

  exports.convertCodeBlocksToAtomEditors = function(domFragment, defaultLanguage) {
    var codeBlock, codeElement, editor, editorElement, fenceName, fontFamily, grammar, preElement, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3, _ref4;
    if (defaultLanguage == null) {
      defaultLanguage = 'text';
    }
    if (fontFamily = atom.config.get('editor.fontFamily')) {
      _ref = domFragment.querySelectorAll('code');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        codeElement = _ref[_i];
        codeElement.style.fontFamily = fontFamily;
      }
    }
    _ref1 = domFragment.querySelectorAll('pre');
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      preElement = _ref1[_j];
      codeBlock = (_ref2 = preElement.firstElementChild) != null ? _ref2 : preElement;
      fenceName = (_ref3 = (_ref4 = codeBlock.getAttribute('class')) != null ? _ref4.replace(/^lang-/, '') : void 0) != null ? _ref3 : defaultLanguage;
      editorElement = document.createElement('atom-text-editor');
      editorElement.setAttributeNode(document.createAttribute('gutter-hidden'));
      editorElement.removeAttribute('tabindex');
      preElement.parentNode.insertBefore(editorElement, preElement);
      preElement.remove();
      editor = editorElement.getModel();
      editor.getDecorations({
        "class": 'cursor-line',
        type: 'line'
      })[0].destroy();
      editor.setText(codeBlock.textContent.trim());
      if (grammar = atom.grammars.grammarForScopeName(scopeForFenceName(fenceName))) {
        editor.setGrammar(grammar);
      }
    }
    return domFragment;
  };

  tokenizeCodeBlocks = function(html, defaultLanguage) {
    var codeBlock, fenceName, fontFamily, highlightedBlock, highlightedHtml, o, preElement, _i, _len, _ref, _ref1, _ref2;
    if (defaultLanguage == null) {
      defaultLanguage = 'text';
    }
    o = cheerio.load(html);
    if (fontFamily = atom.config.get('editor.fontFamily')) {
      o('code').css('font-family', fontFamily);
    }
    _ref = o("pre");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      preElement = _ref[_i];
      codeBlock = o(preElement).children().first();
      fenceName = (_ref1 = (_ref2 = codeBlock.attr('class')) != null ? _ref2.replace(/^lang-/, '') : void 0) != null ? _ref1 : defaultLanguage;
      if (highlighter == null) {
        highlighter = new Highlights({
          registry: atom.grammars
        });
      }
      highlightedHtml = highlighter.highlightSync({
        fileContents: codeBlock.text(),
        scopeName: scopeForFenceName(fenceName)
      });
      highlightedBlock = o(highlightedHtml);
      highlightedBlock.removeClass('editor').addClass("lang-" + fenceName);
      o(preElement).replaceWith(highlightedBlock);
    }
    return o.html();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24tcHJldmlldy1wbHVzL2xpYi9yZW5kZXJlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0xBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQURKLENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVIsQ0FGVixDQUFBOztBQUFBLEVBR0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBSEwsQ0FBQTs7QUFBQSxFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsbUJBQVIsQ0FKYixDQUFBOztBQUFBLEVBS0MsSUFBSyxPQUFBLENBQVEsc0JBQVIsRUFBTCxDQUxELENBQUE7O0FBQUEsRUFNQSxZQUFBLEdBQWUsSUFOZixDQUFBOztBQUFBLEVBT0EsVUFBQSxHQUFhLElBUGIsQ0FBQTs7QUFBQSxFQVFDLG9CQUFxQixPQUFBLENBQVEsb0JBQVIsRUFBckIsaUJBUkQsQ0FBQTs7QUFBQSxFQVNBLFlBQUEsR0FBZSxPQUFBLENBQVEsc0JBQVIsQ0FUZixDQUFBOztBQUFBLEVBV0EsV0FBQSxHQUFjLElBWGQsQ0FBQTs7QUFBQSxFQVlDLGVBQWdCLElBQUksQ0FBQyxlQUFMLENBQUEsRUFBaEIsWUFaRCxDQUFBOztBQUFBLEVBYUEsV0FBQSxHQUFjLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYixDQWJkLENBQUE7O0FBQUEsRUFlQSxPQUFPLENBQUMsYUFBUixHQUF3QixTQUFDLElBQUQsRUFBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLFdBQTdCLEVBQTBDLFFBQTFDLEdBQUE7O01BQUMsT0FBSztLQUM1QjtXQUFBLE1BQUEsQ0FB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

//# sourceURL=/Users/anas/.atom/packages/markdown-preview-plus/lib/renderer.coffee
