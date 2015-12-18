(function() {
  var LineMessageView, MessagePanelView, PlainMessageView, oMessagesPanel, sCSSPanelTitle, sHTMLPanelTitle, validator, _ref;

  _ref = require("atom-message-panel"), MessagePanelView = _ref.MessagePanelView, LineMessageView = _ref.LineMessageView, PlainMessageView = _ref.PlainMessageView;

  validator = require("w3cvalidator");

  sHTMLPanelTitle = '<span class="icon-microscope"></span> W3C Markup Validation Service Report';

  sCSSPanelTitle = '<span class="icon-microscope"></span> W3C CSS Validation Service Report';

  oMessagesPanel = new MessagePanelView({
    rawTitle: true,
    closeMethod: "destroy"
  });

  module.exports = function() {
    var oEditor, oOptions, sPanelTitle;
    if (!(oEditor = atom.workspace.getActiveTextEditor())) {
      return;
    }
    oMessagesPanel.clear();
    oMessagesPanel.setTitle((sPanelTitle = oEditor.getGrammar().name === "CSS" ? sCSSPanelTitle : sHTMLPanelTitle), true);
    oMessagesPanel.attach();
    if (atom.config.get("w3c-validation.useFoldModeAsDefault") && oMessagesPanel.summary.css("display") === "none") {
      oMessagesPanel.toggle();
    }
    oMessagesPanel.add(new PlainMessageView({
      message: '<span class="icon-hourglass"></span> Validation pending (this can take some time)...',
      raw: true,
      className: "text-info"
    }));
    oOptions = {
      input: oEditor.getText(),
      output: "json",
      charset: oEditor.getEncoding(),
      callback: function(oResponse) {
        var oMessage, _i, _len, _ref1, _ref2;
        oMessagesPanel.clear();
        if (!oResponse.messages) {
          return;
        }
        if (!oResponse.messages.length) {
          if (atom.config.get("w3c-validation.hideOnNoErrors")) {
            return oMessagesPanel.close();
          }
          return oMessagesPanel.add(new PlainMessageView({
            message: '<span class="icon-check"></span> No errors were found !',
            raw: true,
            className: "text-success"
          }));
        }
        oMessagesPanel.setTitle("" + sPanelTitle + " (" + oResponse.messages.length + " messages)", true);
        _ref1 = oResponse.messages;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          oMessage = _ref1[_i];
          if (!!oMessage) {
            oMessagesPanel.add(new LineMessageView({
              message: oMessage.message,
              line: oMessage.lastLine,
              character: oMessage.lastColumn,
              preview: ((_ref2 = oEditor.lineTextForBufferRow(oMessage.lastLine - 1)) != null ? _ref2 : "").trim(),
              className: "text-" + oMessage.type
            }));
          }
        }
        return atom.workspace.onDidChangeActivePaneItem(function() {
          return oMessagesPanel.close();
        });
      }
    };
    if (oEditor.getGrammar().name === "CSS") {
      oOptions.validate = oEditor.getGrammar().name.toLowerCase();
      oOptions.profile = atom.config.get("w3c-validation.cssProfile");
      oOptions.medium = atom.config.get("w3c-validation.cssMedia");
      oOptions.warnings = (function() {
        switch (atom.config.get("w3c-validation.cssReportType")) {
          case "all":
            return 2;
          case "most important":
            return 0;
          case "no warnings":
            return "no";
          default:
            return 1;
        }
      })();
    }
    return validator.validate(oOptions);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvdzNjLXZhbGlkYXRpb24vbGliL3ZhbGlkYXRvci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUhBQUE7O0FBQUEsRUFBQSxPQUEwRCxPQUFBLENBQVEsb0JBQVIsQ0FBMUQsRUFBRSx3QkFBQSxnQkFBRixFQUFvQix1QkFBQSxlQUFwQixFQUFxQyx3QkFBQSxnQkFBckMsQ0FBQTs7QUFBQSxFQUVBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQUZaLENBQUE7O0FBQUEsRUFJQSxlQUFBLEdBQWtCLDRFQUpsQixDQUFBOztBQUFBLEVBS0EsY0FBQSxHQUFpQix5RUFMakIsQ0FBQTs7QUFBQSxFQU9BLGNBQUEsR0FBcUIsSUFBQSxnQkFBQSxDQUNqQjtBQUFBLElBQUEsUUFBQSxFQUFVLElBQVY7QUFBQSxJQUNBLFdBQUEsRUFBYSxTQURiO0dBRGlCLENBUHJCLENBQUE7O0FBQUEsRUFXQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFBLEdBQUE7QUFDYixRQUFBLDhCQUFBO0FBQUEsSUFBQSxJQUFBLENBQUEsQ0FBZ0IsT0FBQSxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFaLENBQWQ7QUFBQSxZQUFBLENBQUE7S0FBQTtBQUFBLElBRUEsY0FBYyxDQUFDLEtBQWYsQ0FBQSxDQUZBLENBQUE7QUFBQSxJQUlBLGNBQWMsQ0FBQyxRQUFmLENBQXdCLENBQUUsV0FBQSxHQUFpQixPQUFPLENBQUMsVUFBUixDQUFBLENBQW9CLENBQUMsSUFBckIsS0FBNkIsS0FBaEMsR0FBMkMsY0FBM0MsR0FBK0QsZUFBL0UsQ0FBeEIsRUFBMEgsSUFBMUgsQ0FKQSxDQUFBO0FBQUEsSUFNQSxjQUFjLENBQUMsTUFBZixDQUFBLENBTkEsQ0FBQTtBQVFBLElB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

//# sourceURL=/Users/anas/.atom/packages/w3c-validation/lib/validator.coffee
