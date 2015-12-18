(function() {
  var HtmlValidation, validator;

  validator = require("./validator");

  module.exports = HtmlValidation = {
    config: {
      validateOnSave: {
        type: "boolean",
        "default": true,
        title: "Validate on save",
        description: "Make a validation each time you save an HTML file."
      },
      validateOnChange: {
        type: "boolean",
        "default": false,
        title: "Validate on change",
        description: "Make a validation each time you change an HTML file."
      },
      hideOnNoErrors: {
        type: "boolean",
        "default": false,
        title: "Hide on no errors",
        description: "Hide the panel if there was no errors."
      },
      useFoldModeAsDefault: {
        type: "boolean",
        "default": false,
        title: "Use fold mode as default",
        description: "Fold the results panel by default."
      },
      cssProfile: {
        type: "string",
        "default": "css3",
        "enum": ["none", "css1", "css2", "css21", "css3", "svg", "svgbasic", "svgtiny", "mobile", "atsc-tv", "tv"],
        title: "CSS Profile",
        description: "Profile to use for CSS file validation (default: css3)."
      },
      cssMedia: {
        type: "string",
        "default": "all",
        "enum": ["all", "aural", "braille", "embossed", "handheld", "print", "projection", "screen", "tty", "tv", "presentation"],
        title: "CSS Media",
        description: "Media to use for CSS file validation (default: all)."
      },
      cssReportType: {
        type: "string",
        "default": "normal",
        "enum": ["all", "normal", "most important", "no warnings"],
        title: "CSS Report severity",
        description: "CSS Report severity (default: normal)."
      }
    },
    activate: function() {
      atom.commands.add("atom-text-editor", {
        "w3c-validation:validate": function() {
          var _ref;
          if ((_ref = atom.workspace.getActiveTextEditor().getGrammar().name) === "HTML" || _ref === "CSS") {
            return validator();
          }
        }
      });
      atom.config.observe("w3c-validation.validateOnSave", function(bValue) {
        return atom.workspace.observeTextEditors(function(oEditor) {
          var _ref;
          if (bValue && ((_ref = oEditor.getGrammar().name) === "HTML" || _ref === "CSS")) {
            return oEditor.getBuffer().onDidSave(validator);
          }
        });
      });
      return atom.config.observe("w3c-validation.validateOnChange", function(bValue) {
        return atom.workspace.observeTextEditors(function(oEditor) {
          var _ref;
          if (bValue && ((_ref = oEditor.getGrammar().name) === "HTML" || _ref === "CSS")) {
            return oEditor.getBuffer().onDidChange("contents-modified", validator);
          }
        });
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvdzNjLXZhbGlkYXRpb24vbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlCQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxhQUFSLENBQVosQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGNBQUEsR0FDYjtBQUFBLElBQUEsTUFBQSxFQUNJO0FBQUEsTUFBQSxjQUFBLEVBQ0k7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsS0FBQSxFQUFPLGtCQUZQO0FBQUEsUUFHQSxXQUFBLEVBQWEsb0RBSGI7T0FESjtBQUFBLE1BS0EsZ0JBQUEsRUFDSTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO0FBQUEsUUFFQSxLQUFBLEVBQU8sb0JBRlA7QUFBQSxRQUdBLFdBQUEsRUFBYSxzREFIYjtPQU5KO0FBQUEsTUFVQSxjQUFBLEVBQ0k7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsS0FBQSxFQUFPLG1CQUZQO0FBQUEsUUFHQSxXQUFBLEVBQWEsd0NBSGI7T0FYSjtBQUFBLE1BZUEsb0JBQUEsRUFDSTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO0FBQUEsUUFFQSxLQUFBLEVBQU8sMEJBRlA7QUFBQSxRQUdBLFdBQUEsRUFBYSxvQ0FIYjtPQWhCSjtBQUFBLE1Bb0JBLFVBQUEsRUFDSTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxNQURUO0FBQUEsUUFFQSxNQUFBLEVBQU0sQ0FB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

//# sourceURL=/Users/anas/.atom/packages/w3c-validation/lib/main.coffee
