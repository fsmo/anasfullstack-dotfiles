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

    if (this.server.config.autoStart && !this.server.activated) {
      this.view.dispatchEvent(new Event('toggle'));
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2xpdmVyZWxvYWQvbGliL2xpdmVyZWxvYWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O29CQUVrQyxNQUFNOzs4QkFDYixtQkFBbUI7Ozs7c0JBQzNCLFVBQVU7Ozs7c0JBQ1YsVUFBVTs7OzsyQkFDVCxpQkFBaUI7Ozs7QUFOckMsV0FBVyxDQUFDOztBQVFaLFNBQVMsVUFBVSxDQUFDLElBQUksRUFBRTtBQUN4QixNQUFJLElBQUksR0FBRyxpQ0FBb0IsQ0FBQzs7QUFFaEMsTUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxZQUFNO0FBQ3BDLFFBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDekIsUUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO2lCQUVrQixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsK0JBQStCLENBQUM7OztBQUFqRixVQUFJLENBQUMsR0FBRztBQUFFLFVBQUksQ0FBQyxJQUFJO0FBQUUsVUFBSSxDQUFDLE9BQU87O0FBQ2xDLFlBQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNmLE1BQU07a0JBRWlDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSwrQkFBK0IsQ0FBQzs7O0FBQWpGLFVBQUksQ0FBQyxHQUFHO0FBQUUsVUFBSSxDQUFDLElBQUk7QUFBRSxVQUFJLENBQUMsT0FBTzs7QUFDbEMsWUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ2hCO0dBQ0YsQ0FBQyxDQUFDOztBQUVILFNBQU8sSUFBSSxDQUFDO0NBQ2I7O0FBRUQsU0FBUyxZQUFZLENBQUMsSUFBSSxFQUFFO0FBQzFCLE1BQUksTUFBTSxHQUFHLHdCQUFXLDBCQUFRLENBQUMsQ0FBQzs7QUFFbEMsUUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsWUFBTTtBQUN6QixRQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyx3QkFBd0IsQ0FBQztHQUM5QyxDQUFDLENBQUM7O0FB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cmVsb2FkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJztcbmltcG9ydCBMaXZlcmVsb2FkVmlldyBmcm9tICcuL2xpdmVyZWxvYWQtdmlldyc7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnJztcbmltcG9ydCBTZXJ2ZXIgZnJvbSAnLi9zZXJ2ZXInO1xuaW1wb3J0IG9wdGlvbnMgZnJvbSAnLi4vb3B0aW9ucy5qc29uJztcblxuZnVuY3Rpb24gY3JlYXRlVmlldyhzZWxmKSB7XG4gIHZhciB2aWV3ID0gbmV3IExpdmVyZWxvYWRWaWV3KCk7XG5cbiAgdmlldy5hZGRFdmVudExpc3RlbmVyKCd0b2dnbGUnLCAoKSA9PiB7XG4gICAgdmFyIHNlcnZlciA9IHNlbGYuc2VydmVyO1xuICAgIGlmIChzZXJ2ZXIuYWN0aXZhdGVkKSB7XG4gICAgICAvLyB0dXJuaW5nIG9mZiB0aGUgc2VydmVyXG4gICAgICBbdmlldy51cmwsIHZpZXcudGV4dCwgdmlldy50b29sdGlwXSA9IFsnJywgJy4uLicsICdTdG9wcGluZyBMaXZlUmVsb2FkIHNlcnZlci4uLiddO1xuICAgICAgc2VydmVyLnN0b3AoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdHVybmluZyBvbiB0aGUgc2VydmVyXG4gICAgICBbdmlldy51cmwsIHZpZXcudGV4dCwgdmlldy50b29sdGlwXSA9IFsnJywgJy4uLicsICdTdGFydGluZyBMaXZlUmVsb2FkIHNlcnZlci4uLiddO1xuICAgICAgc2VydmVyLnN0YXJ0KCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdmlldztcbn1cblxuZnVuY3Rpb24gY3JlYXRlU2VydmVyKHNlbGYpIHtcbiAgdmFyIHNlcnZlciA9IG5ldyBTZXJ2ZXIoY29uZmlnKCkpO1xuXG4gIHNlcnZlci5vbignbmV3cG9ydCcsICgpID0+IHtcbiAgICBzZWxmLnZpZXcudG9vbHRpcCA9ICdUcnlpbmcgYW5vdGhlciBwb3J0Li4uJztcbiAgfSk7XG5cbiAgc2VydmVyLm9uKCdzdGFydCcsIHBvcnQgPT4ge1xuICAgIHZhciB2aWV3ID0gc2VsZi52aWV3O1xuXG4gICAgdmlldy51cmwgPSAoc2VydmVyLmNvbmZpZy51c2VIVFRQUyA/ICdodHRwcycgOiAnaHR0cCcpICsgYDovL2xvY2FsaG9zdDoke3NlcnZlci5hZGRyZXNzLnBvcnR9L2xpdmVyZWxvYWQuanNgO1xuICAgIHZpZXcudGV4dCA9IHNlcnZlci5hZGRyZXNzLnBvcnQ7XG4gICAgdmlldy50b29sdGlwID0gJ0NsaWNrIHRvIGNvcHkgdGhlIFVSTCB0byBjbGlwYm9hcmQnO1xuXG4gICAgbGV0IHBhdGhzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCk7XG4gICAgc2VydmVyLndhdGNoKHBhdGhzKTtcbiAgfSk7XG5cbiAgc2VydmVyLm9uKCdzdG9wJywgKCkgPT4ge1xuICAgIFtzZWxmLnZpZXcudXJsLCBzZWxmLnZpZXcudGV4dCwgc2VsZi52aWV3LnRvb2x0aXBdID0gWycnLCAnT2ZmJywgJ0xpdmVSZWxvYWQgc2VydmVyIGlzIGN1cnJlbnRseSB0dXJuZWQgb2ZmLiddO1xuICAgIHNlcnZlci51bndhdGNoKCk7XG4gIH0pO1xuXG4gIHJldHVybiBzZXJ2ZXI7XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICB2aWV3OiBudWxsLFxuICBzZXJ2ZXI6IG51bGwsXG4gIGFjdGl2YXRlZDogZmFsc2UsXG4gIGNvbmZpZzogb3B0aW9ucyxcblxuICBhY3RpdmF0ZShzdGF0ZSkge1xuICAgIHRoaXMuc2VydmVyID0gY3JlYXRlU2VydmVyKHRoaXMpO1xuXG4gICAgdGhpcy52aWV3ID0gY3JlYXRlVmlldyh0aGlzKTtcbiAgICB0aGlzLnZpZXcuaW5pdGlhbGl6ZShzdGF0ZSk7XG4gICAgdGhpcy52aWV3LmF0dGFjaCgpO1xuXG4gICAgaWYgKHRoaXMuc2VydmVyLmNvbmZpZy5hdXRvU3RhcnQgJiYgIXRoaXMuc2VydmVyLmFjdGl2YXRlZCkge1xuICAgICAgdGhpcy52aWV3LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCd0b2dnbGUnKSk7XG4gICAgfVxuICB9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgaWYgKHRoaXMuc3RhdHVzQmFyVGlsZSkgdGhpcy5zdGF0dXNCYXJUaWxlLmRlc3RvcnkoKTtcbiAgICB0aGlzLnN0YXR1c0JhclRpbGUgPSBudWxsO1xuXG4gICAgdGhpcy52aWV3LmRldGFjaCgpO1xuICAgIHRoaXMudmlldy5kZXN0cm95KCk7XG4gICAgaWYgKHRoaXMuc2VydmVyKSB7XG4gICAgICB0aGlzLnNlcnZlci5zdG9wKCk7XG4gICAgICB0aGlzLnNlcnZlciA9IG51bGw7XG4gICAgfVxuICB9LFxuXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICByZXR1cm4geyBhY3RpdmF0ZWQ6ICh0aGlzLnNlcnZlciAmJiB0aGlzLnNlcnZlci5hY3RpdmF0ZWQpICB9O1xuICB9LFxuXG4gIGNvbnN1bWVTdGF0dXNCYXIoc3RhdHVzQmFyKSB7XG4gICAgdGhpcy5zdGF0dXNCYXJUaWxlID0gc3RhdHVzQmFyLmFkZFJpZ2h0VGlsZSh7aXRlbTp0aGlzLnZpZXcsIHByaW9yaXR5OjEwMH0pO1xuICB9XG59O1xuIl19
//# sourceURL=/Users/anas/.atom/packages/livereload/lib/livereload.js
