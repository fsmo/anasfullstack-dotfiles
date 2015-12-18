(function() {
  var $, Config, Files, Fs, SavePrompt;

  $ = require('atom-space-pen-views').$;

  Fs = require('fs');

  Config = require('./config');

  Files = require('./files');

  SavePrompt = require('./save-prompt');

  module.exports = {
    config: {
      restoreOpenFileContents: {
        type: 'boolean',
        "default": true,
        description: 'Restore the contents of files that were unsaved in the last session'
      },
      skipSavePrompt: {
        type: 'boolean',
        "default": true,
        description: 'Disable the save on exit prompt'
      },
      extraDelay: {
        type: 'integer',
        "default": 500,
        description: "Add an extra delay time in ms for auto saving files after typing."
      },
      dataSaveFolder: {
        type: 'string',
        description: 'The folder in which to save project states'
      }
    },
    activate: function(state) {
      if (Config.saveFolder() == null) {
        Config.saveFolderDefault();
      }
      SavePrompt.activate();
      return Files.activate();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvc2F2ZS1zZXNzaW9uL2xpYi9zYXZlLXNlc3Npb24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdDQUFBOztBQUFBLEVBQUMsSUFBSyxPQUFBLENBQVEsc0JBQVIsRUFBTCxDQUFELENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBRlQsQ0FBQTs7QUFBQSxFQUdBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQUhSLENBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FKYixDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSx1QkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSxxRUFGYjtPQURGO0FBQUEsTUFJQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLGlDQUZiO09BTEY7QUFBQSxNQVFBLFVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxHQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsbUVBRmI7T0FURjtBQUFBLE1BWUEsY0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsV0FBQSxFQUFhLDRDQURiO09BYkY7S0FERjtBQUFBLElBaUJBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUVSLE1BQUEsSUFBTywyQkFBUDtBQUNFLFFBQUEsTUFBTSxDQUFDLGlCQUFQLENBQUEsQ0FBQSxDQURGO09BQUE7QUFBQSxNQUlBLFVBQVUsQ0FBQyxRQUFYLENBQUEsQ0FKQSxDQUFBO2FBS0EsS0FBSyxDQUFDLFFBQU4sQ0FBQSxFQVBRO0lBQUEsQ0FqQlY7R0FSRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/anas/.atom/packages/save-session/lib/save-session.coffee
