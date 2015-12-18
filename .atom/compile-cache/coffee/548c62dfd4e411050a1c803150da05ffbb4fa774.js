(function() {
  var $, CSON, attachMathJax, checkMacros, cheerio, configureMathJax, createMacrosTemplate, fs, getUserMacrosPath, loadMacrosFile, loadUserMacros, namePattern, path, valueMatchesPattern, _;

  $ = require('atom-space-pen-views').$;

  cheerio = require('cheerio');

  path = require('path');

  CSON = require('season');

  fs = require('fs-plus');

  _ = require('underscore-plus');

  module.exports = {
    loadMathJax: function(listener) {
      var script;
      script = this.attachMathJax();
      if (listener != null) {
        script.addEventListener("load", function() {
          return listener();
        });
      }
    },
    attachMathJax: _.once(function() {
      return attachMathJax();
    }),
    resetMathJax: function() {
      $('script[src*="MathJax.js"]').remove();
      window.MathJax = void 0;
      return this.attachMathJax = _.once(function() {
        return attachMathJax();
      });
    },
    mathProcessor: function(domElements) {
      if (typeof MathJax !== "undefined" && MathJax !== null) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, domElements]);
      } else {
        this.loadMathJax(function() {
          return MathJax.Hub.Queue(["Typeset", MathJax.Hub, domElements]);
        });
      }
    },
    processHTMLString: function(html, callback) {
      var compileProcessedHTMLString, element, queueProcessHTMLString;
      element = document.createElement('div');
      element.innerHTML = html;
      compileProcessedHTMLString = function() {
        var svgGlyphs, _ref;
        svgGlyphs = (_ref = document.getElementById('MathJax_SVG_Hidden')) != null ? _ref.parentNode.cloneNode(true) : void 0;
        if (svgGlyphs != null) {
          element.insertBefore(svgGlyphs, element.firstChild);
        }
        return element.innerHTML;
      };
      queueProcessHTMLString = function() {
        return MathJax.Hub.Queue(["setRenderer", MathJax.Hub, "SVG"], ["Typeset", MathJax.Hub, element], ["setRenderer", MathJax.Hub, "HTML-CSS"], [
          function() {
            return callback(compileProcessedHTMLString());
          }
        ]);
      };
      if (typeof MathJax !== "undefined" && MathJax !== null) {
        queueProcessHTMLString();
      } else {
        this.loadMathJax(queueProcessHTMLString);
      }
    }
  };

  namePattern = /^[^a-zA-Z\d\s]$|^[a-zA-Z]*$/;

  getUserMacrosPath = function() {
    var userMacrosPath;
    userMacrosPath = CSON.resolve(path.join(atom.getConfigDirPath(), 'markdown-preview-plus'));
    return userMacrosPath != null ? userMacrosPath : path.join(atom.getConfigDirPath(), 'markdown-preview-plus.cson');
  };

  loadMacrosFile = function(filePath) {
    if (!CSON.isObjectPath(filePath)) {
      return {};
    }
    return CSON.readFileSync(filePath, function(error, object) {
      var _ref, _ref1;
      if (object == null) {
        object = {};
      }
      if (error != null) {
        console.warn("Error reading Latex Macros file '" + filePath + "': " + ((_ref = error.stack) != null ? _ref : error));
        if ((_ref1 = atom.notifications) != null) {
          _ref1.addError("Failed to load Latex Macros from '" + filePath + "'", {
            detail: error.message,
            dismissable: true
          });
        }
      }
      return object;
    });
  };

  loadUserMacros = function() {
    var result, userMacrosPath;
    userMacrosPath = getUserMacrosPath();
    if (fs.isFileSync(userMacrosPath)) {
      return result = loadMacrosFile(userMacrosPath);
    } else {
      console.log("Creating markdown-preview-plus.cson, this is a one-time operation.");
      createMacrosTemplate(userMacrosPath);
      return result = loadMacrosFile(userMacrosPath);
    }
  };

  createMacrosTemplate = function(filePath) {
    var templateFile, templatePath;
    templatePath = path.join(__dirname, "../assets/macros-template.cson");
    templateFile = fs.readFileSync(templatePath, 'utf8');
    return fs.writeFileSync(filePath, templateFile);
  };

  checkMacros = function(macrosObject) {
    var name, value, _ref;
    for (name in macrosObject) {
      value = macrosObject[name];
      if (!(name.match(namePattern) && valueMatchesPattern(value))) {
        delete macrosObject[name];
        if ((_ref = atom.notifications) != null) {
          _ref.addError("Failed to load LaTeX macro named '" + name + "'. Please see the [LaTeX guide](https://github.com/Galadirith/markdown-preview-plus/blob/master/LATEX.md#macro-names)", {
            dismissable: true
          });
        }
      }
    }
    return macrosObject;
  };

  valueMatchesPattern = function(value) {
    var macroDefinition, numberOfArgs;
    switch (false) {
      case Object.prototype.toString.call(value) !== '[object Array]':
        macroDefinition = value[0];
        numberOfArgs = value[1];
        if (typeof numberOfArgs === 'number') {
          return numberOfArgs % 1 === 0 && typeof macroDefinition === 'string';
        } else {
          return false;
        }
        break;
      case typeof value !== 'string':
        return true;
      default:
        return false;
    }
  };

  configureMathJax = function() {
    var userMacros;
    userMacros = loadUserMacros();
    if (userMacros) {
      userMacros = checkMacros(userMacros);
    } else {
      userMacros = {};
    }
    MathJax.Hub.Config({
      jax: ["input/TeX", "output/HTML-CSS"],
      extensions: [],
      TeX: {
        extensions: ["AMSmath.js", "AMSsymbols.js", "noErrors.js", "noUndefined.js"],
        Macros: userMacros
      },
      messageStyle: "none",
      showMathMenu: false,
      skipStartupTypeset: true
    });
    MathJax.Hub.Configured();
    atom.notifications.addSuccess("Loaded maths rendering engine MathJax", {
      dismissable: true
    });
  };

  attachMathJax = function() {
    var script;
    atom.notifications.addInfo("Loading maths rendering engine MathJax", {
      dismissable: true
    });
    script = document.createElement("script");
    script.src = "" + (require.resolve('MathJax')) + "?delayStartupUntil=configured";
    script.type = "text/javascript";
    script.addEventListener("load", function() {
      return configureMathJax();
    });
    document.getElementsByTagName("head")[0].appendChild(script);
    return script;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24tcHJldmlldy1wbHVzL2xpYi9tYXRoamF4LWhlbHBlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFPQTtBQUFBLE1BQUEsc0xBQUE7O0FBQUEsRUFBQyxJQUFTLE9BQUEsQ0FBUSxzQkFBUixFQUFULENBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsU0FBUixDQURWLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQVUsT0FBQSxDQUFRLE1BQVIsQ0FGVixDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFVLE9BQUEsQ0FBUSxRQUFSLENBSFYsQ0FBQTs7QUFBQSxFQUlBLEVBQUEsR0FBVSxPQUFBLENBQVEsU0FBUixDQUpWLENBQUE7O0FBQUEsRUFLQSxDQUFBLEdBQVUsT0FBQSxDQUFRLGlCQUFSLENBTFYsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBT0U7QUFBQSxJQUFBLFdBQUEsRUFBYSxTQUFDLFFBQUQsR0FBQTtBQUNYLFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxhQUFELENBQUEsQ0FBVCxDQUFBO0FBQ0EsTUFBQSxJQUFHLGdCQUFIO0FBQWtCLFFBQUEsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFNBQUEsR0FBQTtpQkFBRyxRQUFBLENBQUEsRUFBSDtRQUFBLENBQWhDLENBQUEsQ0FBbEI7T0FGVztJQUFBLENBQWI7QUFBQSxJQVFBLGFBQUEsRUFBZSxDQUFDLENBQUMsSUFBRixDQUFPLFNBQUEsR0FBQTthQUFHLGFBQUEsQ0FBQSxFQUFIO0lBQUEsQ0FBUCxDQVJmO0FBQUEsSUFhQSxZQUFBLEVBQWMsU0FBQSxHQUFBO0FBRVosTUFBQSxDQUFBLENBQUUsMkJBQUYsQ0FBOEIsQ0FBQyxN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

//# sourceURL=/Users/anas/.atom/packages/markdown-preview-plus/lib/mathjax-helper.coffee
