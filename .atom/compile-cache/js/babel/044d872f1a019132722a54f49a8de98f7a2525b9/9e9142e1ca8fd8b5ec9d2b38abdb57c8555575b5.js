Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _livereloadView = require('./livereload-view');

var _livereloadView2 = _interopRequireDefault(_livereloadView);

var _atom = require('atom');

"use babel";

exports['default'] = {
  livereloadView: null,

  config: {
    port: {
      title: 'Port Number',
      type: 'integer',
      'default': 35729
    },
    exts: {
      title: 'Additional Extensions',
      description: 'The server will watch these comma-separated extensions as well as the defaults.',
      type: 'string',
      'default': 'html, css, js, png, gif, jpg, php, php5, py, rb, erb, coffee'
    },
    exclusions: {
      title: 'Additional Exclusions',
      description: 'The server will ignore these path in addition to the defaults.',
      type: 'string',
      'default': '.DS_Store, .gitignore, .git/, .svn/, .hg/'
    },
    applyJSLive: {
      title: 'Apply JavaScript Live',
      type: 'boolean',
      description: 'If checked, LiveReload will reload JS files in the background instead of reloading the page.',
      'default': false
    },
    applyCSSLive: {
      title: 'Apply CSS Live',
      type: 'boolean',
      description: 'If checked, LiveReload will reload CSS files in the background instead of refreshing the page.',
      'default': true
    },
    useHTTPS: {
      title: 'Use HTTPS Protocol',
      type: 'boolean',
      'default': false
    }
  },

  activate: function activate(state) {
    this.livereloadView = new _livereloadView2['default']();
    this.livereloadView.initialize(state);
    this.livereloadView.attach();
  },

  deactivate: function deactivate() {
    if (this.statusBarTile) {
      this.statusBarTile.destory();
    }
    this.statusBarTile = null;
    this.livereloadView.detach();
    this.livereloadView.destroy();
  },

  serialize: function serialize() {
    return { livereloadViewState: this.livereloadView.serialize() };
  },

  consumeStatusBar: function consumeStatusBar(statusBar) {
    this.statusBarTile = statusBar.addRightTile({ item: this.livereloadView, priority: 100 });
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2xpdmVyZWxvYWQvbGliL2xpdmVyZWxvYWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OzhCQUUyQixtQkFBbUI7Ozs7b0JBQ1osTUFBTTs7QUFIeEMsV0FBVyxDQUFDOztxQkFLRztBQUNiLGdCQUFjLEVBQUUsSUFBSTs7QUFFcEIsUUFBTSxFQUFFO0FBQ04sUUFBSSxFQUFFO0FBQ0osV0FBSyxFQUFFLGFBQWE7QUFDcEIsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxLQUFLO0tBQ2Y7QUFDRCxRQUFJLEVBQUc7QUFDTCxXQUFLLEVBQUUsdUJBQXVCO0FBQzlCLGlCQUFXLEVBQUUsaUZBQWlGO0FBQzlGLFVBQUksRUFBRSxRQUFRO0FBQ2QsaUJBQVMsOERBQThEO0tBQ3hFO0FBQ0QsY0FBVSxFQUFFO0FBQ1YsV0FBSyxFQUFFLHVCQUF1QjtBQUM5QixpQkFBVyxFQUFFLGdFQUFnRTtBQUM3RSxVQUFJLEVBQUUsUUFBUTtBQUNkLGlCQUFTLDJDQUEyQztLQUNyRDtBQUNELGVBQVcsRUFBRTtBQUNYLFdBQUssRUFBRSx1QkFBdUI7QUFDOUIsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBVyxFQUFFLDhGQUE4RjtBQUMzRyxpQkFBUyxLQUFLO0tBQ2Y7QUFDRCxnQkFBWSxFQUFFO0FBQ1osV0FBSyxFQUFFLGdCQUFnQjtBQUN2QixVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFXLEVBQUUsZ0dBQWdHO0FBQzdHLGlCQUFTLElBQUk7S0FDZDtBQUNELFlBQVEsRUFBRTtBQUNSLFdBQUssRUFBRSxvQkFBb0I7QUFDM0IsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxLQUFLO0tBQ2Y7R0FDRjs7QUFFRCxVQUFRLEVBQUEsa0JBQUMsS0FBSyxFQUFFO0FBQ2QsUUFBSSxDQUFDLGNBQWMsR0FBRyxpQ0FBb0IsQ0FBQztBQUMzQyxRQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QyxRQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDO0dBQzlCOztBQUVELFlBQVUsRUFBQSxzQkFBRztBQUNYLFFBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzlCO0FBQ0QsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDMUIsUUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUM3QixRQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQy9COztBQUVELFdBQVMsRUFBQSxxQkFBRztBQUNWLFdBQU8sRUFBRSxtQkFBbUIsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUM7R0FDakU7O0FBRUQsa0JBQWdCLEVBQUEsMEJBQUMsU0FBUyxFQUFFO0FBQzFCLFFBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQyxFQUFDLElBQUksRUFBQyxJQUFJLENBQUMsY0FBYyxFQUFFLFFBQVEsRUFBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDO0dBQ3ZGO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbGl2ZXJlbG9hZC9saWIvbGl2ZXJlbG9hZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBMaXZlcmVsb2FkVmlldyBmcm9tICcuL2xpdmVyZWxvYWQtdmlldyc7XG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGxpdmVyZWxvYWRWaWV3OiBudWxsLFxuXG4gIGNvbmZpZzoge1xuICAgIHBvcnQ6IHtcbiAgICAgIHRpdGxlOiAnUG9ydCBOdW1iZXInLFxuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMzU3MjlcbiAgICB9LFxuICAgIGV4dHMgOiB7XG4gICAgICB0aXRsZTogJ0FkZGl0aW9uYWwgRXh0ZW5zaW9ucycsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBzZXJ2ZXIgd2lsbCB3YXRjaCB0aGVzZSBjb21tYS1zZXBhcmF0ZWQgZXh0ZW5zaW9ucyBhcyB3ZWxsIGFzIHRoZSBkZWZhdWx0cy4nLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnaHRtbCwgY3NzLCBqcywgcG5nLCBnaWYsIGpwZywgcGhwLCBwaHA1LCBweSwgcmIsIGVyYiwgY29mZmVlJ1xuICAgIH0sXG4gICAgZXhjbHVzaW9uczoge1xuICAgICAgdGl0bGU6ICdBZGRpdGlvbmFsIEV4Y2x1c2lvbnMnLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgc2VydmVyIHdpbGwgaWdub3JlIHRoZXNlIHBhdGggaW4gYWRkaXRpb24gdG8gdGhlIGRlZmF1bHRzLicsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICcuRFNfU3RvcmUsIC5naXRpZ25vcmUsIC5naXQvLCAuc3ZuLywgLmhnLydcbiAgICB9LFxuICAgIGFwcGx5SlNMaXZlOiB7XG4gICAgICB0aXRsZTogJ0FwcGx5IEphdmFTY3JpcHQgTGl2ZScsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZXNjcmlwdGlvbjogJ0lmIGNoZWNrZWQsIExpdmVSZWxvYWQgd2lsbCByZWxvYWQgSlMgZmlsZXMgaW4gdGhlIGJhY2tncm91bmQgaW5zdGVhZCBvZiByZWxvYWRpbmcgdGhlIHBhZ2UuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBhcHBseUNTU0xpdmU6IHtcbiAgICAgIHRpdGxlOiAnQXBwbHkgQ1NTIExpdmUnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVzY3JpcHRpb246ICdJZiBjaGVja2VkLCBMaXZlUmVsb2FkIHdpbGwgcmVsb2FkIENTUyBmaWxlcyBpbiB0aGUgYmFja2dyb3VuZCBpbnN0ZWFkIG9mIHJlZnJlc2hpbmcgdGhlIHBhZ2UuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICB9LFxuICAgIHVzZUhUVFBTOiB7XG4gICAgICB0aXRsZTogJ1VzZSBIVFRQUyBQcm90b2NvbCcsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH1cbiAgfSxcblxuICBhY3RpdmF0ZShzdGF0ZSkge1xuICAgIHRoaXMubGl2ZXJlbG9hZFZpZXcgPSBuZXcgTGl2ZXJlbG9hZFZpZXcoKTtcbiAgICB0aGlzLmxpdmVyZWxvYWRWaWV3LmluaXRpYWxpemUoc3RhdGUpO1xuICAgIHRoaXMubGl2ZXJlbG9hZFZpZXcuYXR0YWNoKCk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICBpZiAodGhpcy5zdGF0dXNCYXJUaWxlKSB7XG4gICAgICB0aGlzLnN0YXR1c0JhclRpbGUuZGVzdG9yeSgpO1xuICAgIH1cbiAgICB0aGlzLnN0YXR1c0JhclRpbGUgPSBudWxsO1xuICAgIHRoaXMubGl2ZXJlbG9hZFZpZXcuZGV0YWNoKCk7XG4gICAgdGhpcy5saXZlcmVsb2FkVmlldy5kZXN0cm95KCk7XG4gIH0sXG5cbiAgc2VyaWFsaXplKCkge1xuICAgIHJldHVybiB7IGxpdmVyZWxvYWRWaWV3U3RhdGU6IHRoaXMubGl2ZXJlbG9hZFZpZXcuc2VyaWFsaXplKCkgfTtcbiAgfSxcblxuICBjb25zdW1lU3RhdHVzQmFyKHN0YXR1c0Jhcikge1xuICAgIHRoaXMuc3RhdHVzQmFyVGlsZSA9IHN0YXR1c0Jhci5hZGRSaWdodFRpbGUoe2l0ZW06dGhpcy5saXZlcmVsb2FkVmlldywgcHJpb3JpdHk6MTAwfSk7XG4gIH1cbn07XG4iXX0=
//# sourceURL=/Users/anas/.atom/packages/livereload/lib/livereload.js
