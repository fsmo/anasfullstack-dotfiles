(function() {
  var atomConfig, cheerio, config, currentText, findFileRecursive, fs, getArguments, getMathJaxPath, handleError, handleMath, handleResponse, handleSuccess, path, pdc, removeReferences, renderPandoc, setPandocOptions, _;

  pdc = require('pdc');

  _ = require('underscore-plus');

  cheerio = null;

  fs = null;

  path = null;

  currentText = null;

  atomConfig = null;

  config = {};


  /**
   * Sets local mathjaxPath if available
   */

  getMathJaxPath = function() {
    var e;
    try {
      return config.mathjax = require.resolve('MathJax');
    } catch (_error) {
      e = _error;
      return config.mathjax = '';
    }
  };

  findFileRecursive = function(filePath, fileName) {
    var bibFile, newPath;
    if (fs == null) {
      fs = require('fs');
    }
    if (path == null) {
      path = require('path');
    }
    bibFile = path.join(filePath, '../', fileName);
    if (fs.existsSync(bibFile)) {
      return bibFile;
    } else {
      newPath = path.join(bibFile, '..');
      if (newPath !== filePath && !_.contains(atom.project.getPaths(), newPath)) {
        return findFileRecursive(newPath, fileName);
      } else {
        return false;
      }
    }
  };


  /**
   * Sets local variables needed for everything
   * @param {string} path to markdown file
   *
   */

  setPandocOptions = function(filePath) {
    var bibFile, cslFile;
    atomConfig = atom.config.get('markdown-preview-plus');
    pdc.path = atomConfig.pandocPath;
    config.flavor = atomConfig.pandocMarkdownFlavor;
    config.args = {};
    if (config.mathjax == null) {
      getMathJaxPath();
    }
    config.args.mathjax = config.renderMath ? config.mathjax : void 0;
    if (atomConfig.pandocBibliography) {
      config.args.filter = ['pandoc-citeproc'];
      bibFile = findFileRecursive(filePath, atomConfig.pandocBIBFile);
      if (!bibFile) {
        bibFile = atomConfig.pandocBIBFileFallback;
      }
      config.args.bibliography = bibFile ? bibFile : void 0;
      cslFile = findFileRecursive(filePath, atomConfig.pandocCSLFile);
      if (!cslFile) {
        cslFile = atomConfig.pandocCSLFileFallback;
      }
      config.args.csl = cslFile ? cslFile : void 0;
    }
    return config;
  };


  /**
   * Handle error response from pdc
   * @param {error} Returned error
   * @param {string} Returned HTML
   * @return {array} with Arguments for callbackFunction (error set to null)
   */

  handleError = function(error, html) {
    var isOnlyMissingReferences, message, referenceSearch;
    referenceSearch = /pandoc-citeproc: reference ([\S]+) not found(<br>)?/ig;
    message = _.uniq(error.message.split('\n')).join('<br>');
    html = "<h1>Pandoc Error:</h1><p><b>" + message + "</b></p><hr>";
    isOnlyMissingReferences = message.replace(referenceSearch, '').length === 0;
    if (isOnlyMissingReferences) {
      message.match(referenceSearch).forEach(function(match) {
        var r;
        match = match.replace(referenceSearch, '$1');
        r = new RegExp("@" + match, 'gi');
        return currentText = currentText.replace(r, "&#64;" + match);
      });
      currentText = html + currentText;
      pdc(currentText, config.flavor, 'html', config.args, handleResponse);
    }
    return [null, html];
  };


  /**
   * Adjusts all math environments in HTML
   * @param {string} HTML to be adjusted
   * @return {string} HTML with adjusted math environments
   */

  handleMath = function(html) {
    var o;
    if (cheerio == null) {
      cheerio = require('cheerio');
    }
    o = cheerio.load("<div>" + html + "</div>");
    o('.math').each(function(i, elem) {
      var math, mode, newContent;
      math = cheerio(this).text();
      mode = math.indexOf('\\[') > -1 ? '; mode=display' : '';
      math = math.replace(/\\[[()\]]/g, '');
      newContent = '<span class="math">' + ("<script type='math/tex" + mode + "'>" + math + "</script>") + '</span>';
      return cheerio(this).replaceWith(newContent);
    });
    return o('div').html();
  };

  removeReferences = function(html) {
    var o;
    if (cheerio == null) {
      cheerio = require('cheerio');
    }
    o = cheerio.load("<div>" + html + "</div>");
    o('.references').each(function(i, elem) {
      return cheerio(this).remove();
    });
    return o('div').html();
  };


  /**
   * Handle successful response from pdc
   * @param {string} Returned HTML
   * @return {array} with Arguments for callbackFunction (error set to null)
   */

  handleSuccess = function(html) {
    if (config.renderMath) {
      html = handleMath(html);
    }
    if (atomConfig.pandocRemoveReferences) {
      html = removeReferences(html);
    }
    return [null, html];
  };


  /**
   * Handle response from pdc
   * @param {Object} error if thrown
   * @param {string} Returned HTML
   */

  handleResponse = function(error, html) {
    var array;
    array = error != null ? handleError(error, html) : handleSuccess(html);
    return config.callback.apply(config.callback, array);
  };


  /**
   * Renders markdown with pandoc
   * @param {string} document in markdown
   * @param {boolean} whether to render the math with mathjax
   * @param {function} callbackFunction
   */

  renderPandoc = function(text, filePath, renderMath, cb) {
    currentText = text;
    config.renderMath = renderMath;
    config.callback = cb;
    setPandocOptions(filePath);
    return pdc(text, config.flavor, 'html', getArguments(config.args), handleResponse);
  };

  getArguments = function(args) {
    args = _.reduce(args, function(res, val, key) {
      if (!_.isEmpty(val)) {
        val = _.flatten([val]);
        _.forEach(val, function(v) {
          if (!_.isEmpty(v)) {
            return res.push("--" + key + "=" + v);
          }
        });
      }
      return res;
    }, []);
    args = _.union(args, atom.config.get('markdown-preview-plus.pandocArguments'));
    args = _.map(args, function(val) {
      val = val.replace(/^(--[\w\-]+)\s(.+)$/i, "$1=$2");
      if (val.substr(0, 1) !== '-') {
        return void 0;
      } else {
        return val;
      }
    });
    return _.reject(args, _.isEmpty);
  };

  module.exports = {
    renderPandoc: renderPandoc,
    __testing__: {
      findFileRecursive: findFileRecursive,
      setPandocOptions: setPandocOptions,
      getArguments: getArguments
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24tcHJldmlldy1wbHVzL2xpYi9wYW5kb2MtaGVscGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxTkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxJQUZWLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssSUFITCxDQUFBOztBQUFBLEVBSUEsSUFBQSxHQUFPLElBSlAsQ0FBQTs7QUFBQSxFQU9BLFdBQUEsR0FBYyxJQVBkLENBQUE7O0FBQUEsRUFTQSxVQUFBLEdBQWEsSUFUYixDQUFBOztBQUFBLEVBV0EsTUFBQSxHQUFTLEVBWFQsQ0FBQTs7QUFhQTtBQUFBOztLQWJBOztBQUFBLEVBZ0JBLGNBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsUUFBQSxDQUFBO0FBQUE7YUFDRSxNQUFNLENBQUMsT0FBUCxHQUFpQixPQUFPLENBQUMsT0FBUixDQUFnQixTQUFoQixFQURuQjtLQUFBLGNBQUE7QUFHRSxNQURJLFVBQ0osQ0FBQTthQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEdBSG5CO0tBRGU7RUFBQSxDQWhCakIsQ0FBQTs7QUFBQSxFQXNCQSxpQkFBQSxHQUFvQixTQUFDLFFBQUQsRUFBVyxRQUFYLEdBQUE7QUFDbEIsUUFBQSxnQkFBQTs7TUFBQSxLQUFNLE9BQUEsQ0FBUSxJQUFSO0tBQU47O01BQ0EsT0FBUSxPQUFBLENBQVEsTUFBUjtLQURSO0FBQUEsSUFFQSxPQUFBLEdBQVUsSUFBSSxDQUFDLElBQUwsQ0FBVSxRQUFWLEVBQW9CLEtBQXBCLEVBQTJCLFFBQTNCLENBRlYsQ0FB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

//# sourceURL=/Users/anas/.atom/packages/markdown-preview-plus/lib/pandoc-helper.coffee
