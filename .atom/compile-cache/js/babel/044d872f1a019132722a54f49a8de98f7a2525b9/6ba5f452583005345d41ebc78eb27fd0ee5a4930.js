Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

var _livereload = require('livereload');

var _livereload2 = _interopRequireDefault(_livereload);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

"use babel";

var DEFAULT_EXTS = 'html css js png gif jpg php php5 py rb erb coffee'.split(' ');
var DEFAULT_EXCLUSIONS = '.git/ .svn/ .hg/'.split(' ');

var LivereloadView = (function (_HTMLDivElement) {
  _inherits(LivereloadView, _HTMLDivElement);

  function LivereloadView() {
    _classCallCheck(this, LivereloadView);

    _get(Object.getPrototypeOf(LivereloadView.prototype), 'constructor', this).apply(this, arguments);

    this.server = null;
    this.subscriptions = null;
    this.tooltipText = 'hello';
  }

  _createClass(LivereloadView, [{
    key: 'initialize',
    value: function initialize(state) {
      var _this = this;

      // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
      this.subscriptions = new _atom.CompositeDisposable();

      // add content
      this.innerHTML = '<a href="#" data-url></a>';
      this.firstChild.addEventListener('click', function (event) {
        return _this.handleClick(event);
      }, false);

      this.classList.add('livereload-status', 'inline-block');
    }
  }, {
    key: 'loadConfig',
    value: function loadConfig() {
      var ret = {};

      // port number
      ret.port = atom.config.get('livereload.port');

      // use HTTPS
      ret.https = atom.config.get('livereload.useHTTPS') ? {} : null;

      // applyJSLive and applyCSSLive
      ret.applyJSLive = atom.config.get('livereload.applyJSLive');
      ret.applyCSSLive = atom.config.get('livereload.applyCSSLive');

      // exts
      var exts = atom.config.get('livereload.exts').split(',').map(function (ext) {
        return ext.trim();
      });
      exts = _lodash2['default'].difference(exts, DEFAULT_EXTS);
      exts = _lodash2['default'].uniq(exts);
      ret.exts = exts;

      var exclusions = atom.config.get('livereload.exclusions').split(',').map(function (ex) {
        return ex.trim();
      });
      exclusions = exclusions.concat(['.DS_Store', '.gitignore']);
      exclusions = _lodash2['default'].difference(exclusions, DEFAULT_EXCLUSIONS);
      exclusions = _lodash2['default'].uniq(exclusions);
      ret.exclusions = exclusions;

      return ret;
    }
  }, {
    key: 'attach',
    value: function attach() {
      var _this2 = this;

      // Register command that toggles this view
      this.subscriptions.add(atom.commands.add('atom-workspace', { 'livereload:toggle': this.toggle.bind(this) }));

      // tooltip
      this.subscriptions.add(atom.tooltips.add(this, { title: function title() {
          return _this2.tooltipText;
        } }));
    }
  }, {
    key: 'detach',
    value: function detach() {
      this.subscriptions.dispose();
    }
  }, {
    key: 'serialize',
    value: function serialize() {}
  }, {
    key: 'destroy',
    value: function destroy() {
      try {
        this.detach();
      } catch (e) {};

      this.subscriptions = null;
      this.remove();
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      if (this.server) {
        this.closeServer();
      } else {
        this.startServer();
      }
    }
  }, {
    key: 'handleClick',
    value: function handleClick(event) {
      event.preventDefault();
      if (this.firstChild.dataset.url) {
        atom.clipboard.write(this.firstChild.dataset.url, 'url');
      }
    }
  }, {
    key: 'startServer',
    value: function startServer(config) {
      var _this3 = this;

      this.firstChild.dataset.url = '';
      this.firstChild.textContent = 'LiveReload: ...';

      // load configurations
      if (!config) config = this.loadConfig();

      // create a server
      this.server = _livereload2['default'].createServer(config);

      this.server.config.server.on('error', function (err) {
        if (err.code === 'EADDRINUSE') {
          _this3.tooltipText = 'Trying port ' + (config.port + 1) + '...';
          console.log('LiveReload: port ' + config.port + ' already in use. Trying port ' + (config.port + 1) + '...');
          config.port++;

          try {
            _this3.server.close();
          } catch (e) {};
          _this3.server = null;

          setTimeout(_this3.startServer.bind(_this3, config), 1000);
        }
      }).on('listening', function () {
        console.log('LiveReload: listening on port ' + config.port + '.');

        _this3.firstChild.textContent = 'LiveReload: ' + config.port;
        _this3.tooltipText = 'Click to copy the URL to clipboard';
        _this3.firstChild.dataset.url = (config.useHTTPS ? 'https' : 'http') + ('://localhost:' + config.port + '/livereload.js');

        var paths = atom.project.getPaths();
        _this3.server.watch(paths);
      });
    }
  }, {
    key: 'closeServer',
    value: function closeServer() {
      this.firstChild.textContent = 'LiveReload: Off';
      this.server.config.server.close();
      this.server = null;
    }
  }]);

  return LivereloadView;
})(HTMLDivElement);

var LivereloadViewTag = document.registerElement('livereload-status-bar', { prototype: LivereloadView.prototype });

exports['default'] = LivereloadViewTag;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2xpdmVyZWxvYWQvbGliL2xpdmVyZWxvYWQtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFFa0MsTUFBTTs7MEJBQ2pCLFlBQVk7Ozs7c0JBQ3JCLFFBQVE7Ozs7QUFKdEIsV0FBVyxDQUFDOztBQU1aLElBQU0sWUFBWSxHQUFHLG1EQUFtRCxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwRixJQUFNLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs7SUFFbkQsY0FBYztZQUFkLGNBQWM7O1dBQWQsY0FBYzswQkFBZCxjQUFjOzsrQkFBZCxjQUFjOztTQUNsQixNQUFNLEdBQUcsSUFBSTtTQUNiLGFBQWEsR0FBRyxJQUFJO1NBQ3BCLFdBQVcsR0FBRyxPQUFPOzs7ZUFIakIsY0FBYzs7V0FLUixvQkFBQyxLQUFLLEVBQUU7Ozs7QUFFaEIsVUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQzs7O0FBRy9DLFVBQUksQ0FBQyxTQUFTLEdBQUcsMkJBQTJCLENBQUM7QUFDN0MsVUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQyxLQUFLO2VBQUssTUFBSyxXQUFXLENBQUMsS0FBSyxDQUFDO09BQUEsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFckYsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsY0FBYyxDQUFDLENBQUM7S0FDekQ7OztXQUVTLHNCQUFHO0FBQ1gsVUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDOzs7QUFHYixTQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7OztBQUc5QyxTQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFx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ZUFBSyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsT0FBTyxHQUFDLE1BQU0sQ0FBQSxzQkFBb0IsTUFBTSxDQUFDLElBQUksb0JBQWdCLENBQUM7O0FBRS9HLFlBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDcEMsZUFBSyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQzFCLENBQUMsQ0FBQztLQUNOOzs7V0FFVSx1QkFBRztBQUNaLFVBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxHQUFHLGlCQUFpQixDQUFDO0FBQ2hELFVBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNsQyxVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztLQUNwQjs7O1NBN0hHLGNBQWM7R0FBUyxjQUFjOztBQWdJM0MsSUFBSSxpQkFBaUIsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLHVCQUF1QixFQUFFLEVBQUMsU0FBUyxFQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDOztxQkFFakcsaUJBQWlCIiwiZmlsZSI6Ii9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2xpdmVyZWxvYWQvbGliL2xpdmVyZWxvYWQtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgbGl2ZXJlbG9hZCBmcm9tICdsaXZlcmVsb2FkJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cbmNvbnN0IERFRkFVTFRfRVhUUyA9ICdodG1sIGNzcyBqcyBwbmcgZ2lmIGpwZyBwaHAgcGhwNSBweSByYiBlcmIgY29mZmVlJy5zcGxpdCgnICcpO1xuY29uc3QgREVGQVVMVF9FWENMVVNJT05TID0gJy5naXQvIC5zdm4vIC5oZy8nLnNwbGl0KCcgJyk7XG5cbmNsYXNzIExpdmVyZWxvYWRWaWV3IGV4dGVuZHMgSFRNTERpdkVsZW1lbnQge1xuICBzZXJ2ZXIgPSBudWxsO1xuICBzdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgdG9vbHRpcFRleHQgPSAnaGVsbG8nO1xuXG4gIGluaXRpYWxpemUoc3RhdGUpIHtcbiAgICAvLyBFdmVudHMgc3Vic2NyaWJlZCB0byBpbiBhdG9tJ3Mgc3lzdGVtIGNhbiBiZSBlYXNpbHkgY2xlYW5lZCB1cCB3aXRoIGEgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICAvLyBhZGQgY29udGVudFxuICAgIHRoaXMuaW5uZXJIVE1MID0gJzxhIGhyZWY9XCIjXCIgZGF0YS11cmw+PC9hPic7XG4gICAgdGhpcy5maXJzdENoaWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB0aGlzLmhhbmRsZUNsaWNrKGV2ZW50KSwgZmFsc2UpO1xuXG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdsaXZlcmVsb2FkLXN0YXR1cycsICdpbmxpbmUtYmxvY2snKTtcbiAgfVxuXG4gIGxvYWRDb25maWcoKSB7XG4gICAgbGV0IHJldCA9IHt9O1xuXG4gICAgLy8gcG9ydCBudW1iZXJcbiAgICByZXQucG9ydCA9IGF0b20uY29uZmlnLmdldCgnbGl2ZXJlbG9hZC5wb3J0Jyk7XG5cbiAgICAvLyB1c2UgSFRUUFNcbiAgICByZXQuaHR0cHMgPSBhdG9tLmNvbmZpZy5nZXQoJ2xpdmVyZWxvYWQudXNlSFRUUFMnKSA/IHt9IDogbnVsbDtcblxuICAgIC8vIGFwcGx5SlNMaXZlIGFuZCBhcHBseUNTU0xpdmVcbiAgICByZXQuYXBwbHlKU0xpdmUgPSBhdG9tLmNvbmZpZy5nZXQoJ2xpdmVyZWxvYWQuYXBwbHlKU0xpdmUnKTtcbiAgICByZXQuYXBwbHlDU1NMaXZlID0gYXRvbS5jb25maWcuZ2V0KCdsaXZlcmVsb2FkLmFwcGx5Q1NTTGl2ZScpO1xuXG4gICAgLy8gZXh0c1xuICAgIGxldCBleHRzID0gYXRvbS5jb25maWcuZ2V0KCdsaXZlcmVsb2FkLmV4dHMnKS5zcGxpdCgnLCcpLm1hcCggZXh0ID0+IGV4dC50cmltKCkgKTtcbiAgICBleHRzID0gXy5kaWZmZXJlbmNlKGV4dHMsIERFRkFVTFRfRVhUUyk7XG4gICAgZXh0cyA9IF8udW5pcShleHRzKTtcbiAgICByZXQuZXh0cyA9IGV4dHM7XG5cbiAgICBsZXQgZXhjbHVzaW9ucyA9IGF0b20uY29uZmlnLmdldCgnbGl2ZXJlbG9hZC5leGNsdXNpb25zJykuc3BsaXQoJywnKS5tYXAoIGV4ID0+IGV4LnRyaW0oKSApO1xuICAgIGV4Y2x1c2lvbnMgPSBleGNsdXNpb25zLmNvbmNhdChbJy5EU19TdG9yZScsICcuZ2l0aWdub3JlJ10pO1xuICAgIGV4Y2x1c2lvbnMgPSBfLmRpZmZlcmVuY2UoZXhjbHVzaW9ucywgREVGQVVMVF9FWENMVVNJT05TKTtcbiAgICBleGNsdXNpb25zID0gXy51bmlxKGV4Y2x1c2lvbnMpO1xuICAgIHJldC5leGNsdXNpb25zID0gZXhjbHVzaW9ucztcblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICBhdHRhY2goKSB7XG4gICAgLy8gUmVnaXN0ZXIgY29tbWFuZCB0aGF0IHRvZ2dsZXMgdGhpcyB2aWV3XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKCAnYXRvbS13b3Jrc3BhY2UnLCB7ICdsaXZlcmVsb2FkOnRvZ2dsZSc6IHRoaXMudG9nZ2xlLmJpbmQodGhpcykgfSApXG4gICAgKTtcblxuICAgIC8vIHRvb2x0aXBcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS50b29sdGlwcy5hZGQoIHRoaXMsIHt0aXRsZTogKCkgPT4gdGhpcy50b29sdGlwVGV4dH0gKVxuICAgICk7XG4gIH1cblxuICBkZXRhY2goKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHNlcmlhbGl6ZSgpIHtcblxuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0cnkgeyB0aGlzLmRldGFjaCgpIH0gY2F0Y2goZSl7fTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGw7XG4gICAgdGhpcy5yZW1vdmUoKTtcbiAgfVxuXG4gIHRvZ2dsZSgpIHtcbiAgICBpZiAodGhpcy5zZXJ2ZXIpIHtcbiAgICAgIHRoaXMuY2xvc2VTZXJ2ZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGFydFNlcnZlcigpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUNsaWNrKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAodGhpcy5maXJzdENoaWxkLmRhdGFzZXQudXJsKSB7XG4gICAgICBhdG9tLmNsaXBib2FyZC53cml0ZSh0aGlzLmZpcnN0Q2hpbGQuZGF0YXNldC51cmwsICd1cmwnKTtcbiAgICB9XG4gIH1cblxuICBzdGFydFNlcnZlcihjb25maWcpIHtcbiAgICB0aGlzLmZpcnN0Q2hpbGQuZGF0YXNldC51cmwgPSAnJztcbiAgICB0aGlzLmZpcnN0Q2hpbGQudGV4dENvbnRlbnQgPSAnTGl2ZVJlbG9hZDogLi4uJztcblxuICAgIC8vIGxvYWQgY29uZmlndXJhdGlvbnNcbiAgICBpZiAoIWNvbmZpZykgY29uZmlnID0gdGhpcy5sb2FkQ29uZmlnKCk7XG5cbiAgICAvLyBjcmVhdGUgYSBzZXJ2ZXJcbiAgICB0aGlzLnNlcnZlciA9IGxpdmVyZWxvYWQuY3JlYXRlU2VydmVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLnNlcnZlci5jb25maWcuc2VydmVyXG4gICAgICAub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICBpZiAoZXJyLmNvZGUgPT09ICdFQUREUklOVVNFJykge1xuICAgICAgICAgIHRoaXMudG9vbHRpcFRleHQgPSBgVHJ5aW5nIHBvcnQgJHtjb25maWcucG9ydCsxfS4uLmA7XG4gICAgICAgICAgY29uc29sZS5sb2coYExpdmVSZWxvYWQ6IHBvcnQgJHtjb25maWcucG9ydH0gYWxyZWFkeSBpbiB1c2UuIFRyeWluZyBwb3J0ICR7Y29uZmlnLnBvcnQrMX0uLi5gKTtcbiAgICAgICAgICBjb25maWcucG9ydCsrO1xuXG4gICAgICAgICAgdHJ5IHsgdGhpcy5zZXJ2ZXIuY2xvc2UoKTsgfSBjYXRjaChlKSB7fTtcbiAgICAgICAgICB0aGlzLnNlcnZlciA9IG51bGw7XG5cbiAgICAgICAgICBzZXRUaW1lb3V0KCB0aGlzLnN0YXJ0U2VydmVyLmJpbmQodGhpcywgY29uZmlnKSwgMTAwMCApO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLm9uKCdsaXN0ZW5pbmcnLCAoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBMaXZlUmVsb2FkOiBsaXN0ZW5pbmcgb24gcG9ydCAke2NvbmZpZy5wb3J0fS5gKTtcblxuICAgICAgICB0aGlzLmZpcnN0Q2hpbGQudGV4dENvbnRlbnQgPSBgTGl2ZVJlbG9hZDogJHtjb25maWcucG9ydH1gO1xuICAgICAgICB0aGlzLnRvb2x0aXBUZXh0ID0gJ0NsaWNrIHRvIGNvcHkgdGhlIFVSTCB0byBjbGlwYm9hcmQnO1xuICAgICAgICB0aGlzLmZpcnN0Q2hpbGQuZGF0YXNldC51cmwgPSAoY29uZmlnLnVzZUhUVFBTID8gJ2h0dHBzJzonaHR0cCcpICsgYDovL2xvY2FsaG9zdDoke2NvbmZpZy5wb3J0fS9saXZlcmVsb2FkLmpzYDtcblxuICAgICAgICBsZXQgcGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIud2F0Y2gocGF0aHMpO1xuICAgICAgfSk7XG4gIH1cblxuICBjbG9zZVNlcnZlcigpIHtcbiAgICB0aGlzLmZpcnN0Q2hpbGQudGV4dENvbnRlbnQgPSAnTGl2ZVJlbG9hZDogT2ZmJztcbiAgICB0aGlzLnNlcnZlci5jb25maWcuc2VydmVyLmNsb3NlKCk7XG4gICAgdGhpcy5zZXJ2ZXIgPSBudWxsO1xuICB9XG59XG5cbnZhciBMaXZlcmVsb2FkVmlld1RhZyA9IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnbGl2ZXJlbG9hZC1zdGF0dXMtYmFyJywge3Byb3RvdHlwZTpMaXZlcmVsb2FkVmlldy5wcm90b3R5cGV9KTtcblxuZXhwb3J0IGRlZmF1bHQgTGl2ZXJlbG9hZFZpZXdUYWc7XG4iXX0=
//# sourceURL=/Users/anas/.atom/packages/livereload/lib/livereload-view.js
