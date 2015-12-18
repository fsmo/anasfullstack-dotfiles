Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _livereloadView = require('./livereload-view');

var _livereloadView2 = _interopRequireDefault(_livereloadView);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _optionsJson = require('../options.json');

var _optionsJson2 = _interopRequireDefault(_optionsJson);

"use babel";

function createView(self) {
  var view = new _livereloadView2['default']();

  view.addEventListener('toggle', function () {
    var server = self.server;
    if (server.activated) {
      var _ref = ['', '...', 'Stopping LiveReload server...'];

      // turning off the server
      view.url = _ref[0];
      view.text = _ref[1];
      view.tooltip = _ref[2];

      server.stop();
    } else {
      var _ref2 = ['', '...', 'Starting LiveReload server...'];

      // turning on the server
      view.url = _ref2[0];
      view.text = _ref2[1];
      view.tooltip = _ref2[2];

      server.start();
    }
  });

  return view;
}

function createServer(self) {
  var server = new _server2['default']((0, _config2['default'])());

  server.on('newport', function () {
    self.view.tooltip = 'Trying another port...';
  });

  server.on('start', function (port) {
    var view = self.view;

    view.url = (server.config.useHTTPS ? 'https' : 'http') + ('://localhost:' + server.address.port + '/livereload.js');
    view.text = server.address.port;
    view.tooltip = 'Click to copy the URL to clipboard';

    var paths = atom.project.getPaths();
    server.watch(paths);
  });

  server.on('stop', function () {
    var _ref3 = ['', 'Off', 'LiveReload server is currently turned off.'];
    self.view.url = _ref3[0];
    self.view.text = _ref3[1];
    self.view.tooltip = _ref3[2];

    server.unwatch();
  });

  return server;
}

exports['default'] = {
  view: null,
  server: null,
  activated: false,
  config: _optionsJson2['default'],

  activate: function activate(state) {
    this.server = createServer(this);

    this.view = createView(this);
    this.view.initialize(state);
    this.view.attach();
  },

  deactivate: function deactivate() {
    if (this.statusBarTile) this.statusBarTile.destory();
    this.statusBarTile = null;

    this.view.detach();
    this.view.destroy();
    if (this.server) {
      this.server.stop();
      this.server = null;
    }
  },

  serialize: function serialize() {
    return { activated: this.server && this.server.activated };
  },

  consumeStatusBar: function consumeStatusBar(statusBar) {
    this.statusBarTile = statusBar.addRightTile({ item: this.view, priority: 100 });
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2xpdmVyZWxvYWQvbGliL2xpdmVyZWxvYWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O29CQUVrQyxNQUFNOzs4QkFDYixtQkFBbUI7Ozs7c0JBQzNCLFVBQVU7Ozs7c0JBQ1YsVUFBVTs7OzsyQkFDVCxpQkFBaUI7Ozs7QUFOckMsV0FBVyxDQUFDOztBQVFaLFNBQVMsVUFBVSxDQUFDLElBQUksRUFBRTtBQUN4QixNQUFJLElBQUksR0FBRyxpQ0FBb0IsQ0FBQzs7QUFFaEMsTUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxZQUFNO0FBQ3BDLFFBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDekIsUUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO2lCQUVrQixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsK0JBQStCLENBQUM7OztBQUFqRixVQUFJLENBQUMsR0FBRztBQUFFLFVBQUksQ0FBQyxJQUFJO0FBQUUsVUFBSSxDQUFDLE9BQU87O0FBQ2xDLFlBQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNmLE1BQU07a0JBRWlDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSwrQkFBK0IsQ0FBQzs7O0FBQWpGLFVBQUksQ0FBQyxHQUFHO0FBQUUsVUFBSSxDQUFDLElBQUk7QUFBRSxVQUFJLENBQUMsT0FBTzs7QUFDbEMsWUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ2hCO0dBQ0YsQ0FBQyxDQUFDOztBQUVILFNBQU8sSUFBSSxDQUFDO0NBQ2I7O0FBRUQsU0FBUyxZQUFZLENBQUMsSUFBSSxFQUFFO0FBQzFCLE1BQUksTUFBTSxHQUFHLHdCQUFXLDBCQUFRLENBQUMsQ0FBQzs7QUFFbEMsUUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsWUFBTTtBQUN6QixRQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyx3QkFBd0IsQ0FBQztHQUM5QyxDQUFDLENBQUM7O0FBRUgsUUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBQSxJQUFJLEVBQUk7QUFDekIsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQzs7QUFFckIsUUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLE9BQU8sR0FBRyxNQUFNLENBQUEsc0JBQW9CLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxvQkFBZ0IsQ0FBQztBQUM3RyxRQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQ2hDLFFBQUksQ0FBQyxPQUFPLEdBQUcsb0NBQW9DLENBQUM7O0FBRXBELFFBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDcEMsVUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUNyQixDQUFDLENBQUM7O0FBRUgsUUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsWUFBTTtnQkFDK0IsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLDRDQUE0QyxDQUFDO0FBQTdHLFFBQUksQ0FBQyxJQUFJLENBQUMsR0FBRztBQUFFLFFBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTtBQUFFLFFBQUksQ0FBQyxJQUFJLENBQUMsT0FBTzs7QUFDakQsVUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQ2xCLENBQUMsQ0FBQzs7QUFFSCxTQUFPLE1BQU0sQ0FBQztDQUVmOztxQkFFYztBQUNiLE1BQUksRUFBRSxJQUFJO0FBQ1YsUUFBTSxFQUFFLElBQUk7QUFDWixXQUFTLEVBQUUsS0FBSztBQUNoQixRQUFNLDBCQUFTOztBQUVmLFVBQVEsRUFBQSxrQkFBQyxLQUFLLEVBQUU7QUFDZCxRQUFJLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFakMsUUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0IsUUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUIsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztHQUNwQjs7QUFFRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxRQUFJLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNyRCxRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQzs7QUFFMUIsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNuQixRQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3BCLFFBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDbkIsVUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7S0FDcEI7R0FDRjs7QUFFRCxXQUFTLEVBQUEscUJBQUc7QUFDVixXQUFPLEVBQUUsU0FBUyxFQUFHLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEFBQUMsRUFBRyxDQUFDO0dBQy9EOztBQUVELGtCQUFnQixFQUFBLDBCQUFDLFNBQVMsRUFBRTtBQUMxQixRQUFJLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUMsRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQztHQUM3RTtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2xpdmVyZWxvYWQvbGliL2xpdmVyZWxvYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nO1xuaW1wb3J0IExpdmVyZWxvYWRWaWV3IGZyb20gJy4vbGl2ZXJlbG9hZC12aWV3JztcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IFNlcnZlciBmcm9tICcuL3NlcnZlcic7XG5pbXBvcnQgb3B0aW9ucyBmcm9tICcuLi9vcHRpb25zLmpzb24nO1xuXG5mdW5jdGlvbiBjcmVhdGVWaWV3KHNlbGYpIHtcbiAgdmFyIHZpZXcgPSBuZXcgTGl2ZXJlbG9hZFZpZXcoKTtcblxuICB2aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3RvZ2dsZScsICgpID0+IHtcbiAgICB2YXIgc2VydmVyID0gc2VsZi5zZXJ2ZXI7XG4gICAgaWYgKHNlcnZlci5hY3RpdmF0ZWQpIHtcbiAgICAgIC8vIHR1cm5pbmcgb2ZmIHRoZSBzZXJ2ZXJcbiAgICAgIFt2aWV3LnVybCwgdmlldy50ZXh0LCB2aWV3LnRvb2x0aXBdID0gWycnLCAnLi4uJywgJ1N0b3BwaW5nIExpdmVSZWxvYWQgc2VydmVyLi4uJ107XG4gICAgICBzZXJ2ZXIuc3RvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB0dXJuaW5nIG9uIHRoZSBzZXJ2ZXJcbiAgICAgIFt2aWV3LnVybCwgdmlldy50ZXh0LCB2aWV3LnRvb2x0aXBdID0gWycnLCAnLi4uJywgJ1N0YXJ0aW5nIExpdmVSZWxvYWQgc2VydmVyLi4uJ107XG4gICAgICBzZXJ2ZXIuc3RhcnQoKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB2aWV3O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTZXJ2ZXIoc2VsZikge1xuICB2YXIgc2VydmVyID0gbmV3IFNlcnZlcihjb25maWcoKSk7XG5cbiAgc2VydmVyLm9uKCduZXdwb3J0JywgKCkgPT4ge1xuICAgIHNlbGYudmlldy50b29sdGlwID0gJ1RyeWluZyBhbm90aGVyIHBvcnQuLi4nO1xuICB9KTtcblxuICBzZXJ2ZXIub24oJ3N0YXJ0JywgcG9ydCA9PiB7XG4gICAgdmFyIHZpZXcgPSBzZWxmLnZpZXc7XG5cbiAgICB2aWV3LnVybCA9IChzZXJ2ZXIuY29uZmlnLnVzZUhUVFBTID8gJ2h0dHBzJyA6ICdodHRwJykgKyBgOi8vbG9jYWxob3N0OiR7c2VydmVyLmFkZHJlc3MucG9ydH0vbGl2ZXJlbG9hZC5qc2A7XG4gICAgdmlldy50ZXh0ID0gc2VydmVyLmFkZHJlc3MucG9ydDtcbiAgICB2aWV3LnRvb2x0aXAgPSAnQ2xpY2sgdG8gY29weSB0aGUgVVJMIHRvIGNsaXBib2FyZCc7XG5cbiAgICBsZXQgcGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcbiAgICBzZXJ2ZXIud2F0Y2gocGF0aHMpO1xuICB9KTtcblxuICBzZXJ2ZXIub24oJ3N0b3AnLCAoKSA9PiB7XG4gICAgW3NlbGYudmlldy51cmwsIHNlbGYudmlldy50ZXh0LCBzZWxmLnZpZXcudG9vbHRpcF0gPSBbJycsICdPZmYnLCAnTGl2ZVJlbG9hZCBzZXJ2ZXIgaXMgY3VycmVudGx5IHR1cm5lZCBvZmYuJ107XG4gICAgc2VydmVyLnVud2F0Y2goKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHNlcnZlcjtcblxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHZpZXc6IG51bGwsXG4gIHNlcnZlcjogbnVsbCxcbiAgYWN0aXZhdGVkOiBmYWxzZSxcbiAgY29uZmlnOiBvcHRpb25zLFxuXG4gIGFjdGl2YXRlKHN0YXRlKSB7XG4gICAgdGhpcy5zZXJ2ZXIgPSBjcmVhdGVTZXJ2ZXIodGhpcyk7XG5cbiAgICB0aGlzLnZpZXcgPSBjcmVhdGVWaWV3KHRoaXMpO1xuICAgIHRoaXMudmlldy5pbml0aWFsaXplKHN0YXRlKTtcbiAgICB0aGlzLnZpZXcuYXR0YWNoKCk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICBpZiAodGhpcy5zdGF0dXNCYXJUaWxlKSB0aGlzLnN0YXR1c0JhclRpbGUuZGVzdG9yeSgpO1xuICAgIHRoaXMuc3RhdHVzQmFyVGlsZSA9IG51bGw7XG5cbiAgICB0aGlzLnZpZXcuZGV0YWNoKCk7XG4gICAgdGhpcy52aWV3LmRlc3Ryb3koKTtcbiAgICBpZiAodGhpcy5zZXJ2ZXIpIHtcbiAgICAgIHRoaXMuc2VydmVyLnN0b3AoKTtcbiAgICAgIHRoaXMuc2VydmVyID0gbnVsbDtcbiAgICB9XG4gIH0sXG5cbiAgc2VyaWFsaXplKCkge1xuICAgIHJldHVybiB7IGFjdGl2YXRlZDogKHRoaXMuc2VydmVyICYmIHRoaXMuc2VydmVyLmFjdGl2YXRlZCkgIH07XG4gIH0sXG5cbiAgY29uc3VtZVN0YXR1c0JhcihzdGF0dXNCYXIpIHtcbiAgICB0aGlzLnN0YXR1c0JhclRpbGUgPSBzdGF0dXNCYXIuYWRkUmlnaHRUaWxlKHtpdGVtOnRoaXMudmlldywgcHJpb3JpdHk6MTAwfSk7XG4gIH1cbn07XG4iXX0=
//# sourceURL=/Users/anas/.atom/packages/livereload/lib/livereload.js
