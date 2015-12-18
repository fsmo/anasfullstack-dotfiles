(function() {
  var MeteorHelper, MeteorHelperView;

  MeteorHelperView = require('./meteor-helper-view');

  module.exports = MeteorHelper = {
    config: {
      meteorAppPath: {
        type: 'string',
        description: 'The relative path to the Meteor application directory, e.g. "app"',
        "default": '.',
        order: 1
      },
      meteorPath: {
        type: 'string',
        description: 'Customize Meteor\'s launching command',
        "default": '/usr/local/bin/meteor',
        order: 2
      },
      meteorPort: {
        type: 'integer',
        "default": 3000,
        description: 'Meteor\'s default port is 3000 and Mongo\'s default port is the same incremented by 1',
        order: 3
      },
      mongoURL: {
        title: 'Mongo URL',
        type: 'string',
        "default": '',
        description: 'Default Mongo installation is generally accessible at: mongodb://localhost:27017',
        order: 4
      },
      settingsPath: {
        title: 'Settings Path',
        type: 'string',
        "default": '',
        description: 'Relative or absolute path to Meteor.settings JSON file',
        order: 5
      },
      mongoOplogURL: {
        title: 'Mongo Oplog URL',
        type: 'string',
        "default": '',
        description: 'Default Mongo Oplog installation must match MONGO_URL',
        order: 6
      },
      debug: {
        title: 'Run in Debug Mode',
        type: 'boolean',
        "default": false,
        description: 'Run Meteor in debug mode for connecting from debugging clients, such as node-inspector (port 5858)',
        order: 7
      },
      production: {
        title: 'Simulate Production',
        type: 'boolean',
        "default": false,
        description: 'Simulate running in production by minifying the JS/CSS assets',
        order: 8
      }
    },
    meteorHelperView: null,
    activate: function(state) {
      return this.meteorHelperView = new MeteorHelperView(state.meteorHelperViewState);
    },
    deactivate: function() {
      return this.meteorHelperView.destroy();
    },
    serialize: function() {
      return {
        meteorHelperViewState: this.meteorHelperView.serialize()
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWV0ZW9yLWhlbHBlci9saWIvbWV0ZW9yLWhlbHBlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOEJBQUE7O0FBQUEsRUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsc0JBQVIsQ0FBbkIsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFlBQUEsR0FFZjtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxhQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxXQUFBLEVBQWEsbUVBRGI7QUFBQSxRQUdBLFNBQUEsRUFBUyxHQUhUO0FBQUEsUUFJQSxLQUFBLEVBQU8sQ0FKUDtPQURGO0FBQUEsTUFNQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxXQUFBLEVBQWEsdUNBRGI7QUFBQSxRQUVBLFNBQUEsRUFBUyx1QkFGVDtBQUFBLFFBR0EsS0FBQSxFQUFPLENBSFA7T0FQRjtBQUFBLE1BV0EsVUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSx1RkFGYjtBQUFBLFFBSUEsS0FBQSxFQUFPLENBSlA7T0FaRjtBQUFBLE1BaUJBLFFBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLFdBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsRUFGVDtBQUFBLFFBR0EsV0FBQSxFQUFhLGtGQUhiO0FBQUEsUUFLQSxLQUFBLEVBQU8sQ0FMUDtPQWxCRjtBQUFBLE1Bd0JBLFlBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLGVBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsRUFGVDtBQUFBLFFBR0EsV0FBQSxFQUFhLHdEQUhiO0FBQUEsUUFJQSxLQUFBLEVBQU8sQ0FKUDtPQXpCRjtBQUFBLE1BOEJBLGFBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLGlCQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEVBRlQ7QUFBQSxRQUdBLFdBQUEsRUFBYSx1REFIYjtBQUFBLFFBSUEsS0FBQSxFQUFPLENBSlA7T0EvQkY7QUFBQSxNQW9DQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxtQkFBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxLQUZUO0FBQUEsUUFHQSxXQUFBLEVBQWEsb0dBSGI7QUFBQSxRQUtBLEtBQUEsRUFBTyxDQUxQO09BckNGO0FBQUEsTUEyQ0EsVUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8scUJBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsS0FGVDtBQUFBLFFBR0EsV0FBQSxFQUFhLCtEQUhiO0FBQUEsUUFLQSxLQUFBLEVBQU8sQ0FMUDtPQTVDRjtLQURGO0FBQUEsSUFvREEsZ0JBQUEsRUFBa0IsSUFwRGxCO0FBQUEsSUEyREEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO2FBRVIsSUFBQyxDQUFBLGdCQUFELEdBQXdCLElBQUEsZ0JBQUEsQ0FBaUIsS0FBSyxDQUFDLHFCQUF2QixFQUZoQjtJQUFBLENBM0RWO0FBQUEsSUFrRUEsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxPQUFsQixDQUFBLEVBRFU7SUFBQSxDQWxFWjtBQUFBLElBd0VBLFNBQUEsRUFBVyxTQUFBLEdBQUE7YUFDVDtBQUFBLFFBQUEscUJBQUEsRUFBdUIsSUFBQyxDQUFBLGdCQUFnQixDQUFDLFNBQWxCLENBQUEsQ0FBdkI7UUFEUztJQUFBLENBeEVYO0dBSkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/anas/.atom/packages/meteor-helper/lib/meteor-helper.coffee
