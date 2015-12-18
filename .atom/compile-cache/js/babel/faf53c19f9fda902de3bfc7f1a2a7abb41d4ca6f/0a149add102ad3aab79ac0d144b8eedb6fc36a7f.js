Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fayeWebsocket = require('faye-websocket');

var _fayeWebsocket2 = _interopRequireDefault(_fayeWebsocket);

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

"use babel";

var PROTOCOL_CONN_CHECK_1 = 'http://livereload.com/protocols/connection-check-1';
var PROTOCOL_MONITORING_7 = 'http://livereload.com/protocols/official-7';
var PROTOCOL_SAVING_1 = 'http://livereload.com/protocols/saving-1';

var Server = (function (_EventEmitter) {
  _inherits(Server, _EventEmitter);

  // client url

  function Server(config) {
    _classCallCheck(this, Server);

    _get(Object.getPrototypeOf(Server.prototype), 'constructor', this).call(this);
    this.paths = [];
    this.sockets = [];
    this.app = null;
    this.watcher = null;
    this._url = '';
    this.config = _lodash2['default'].assign({}, config);
    this.paths = [];
  }

  _createClass(Server, [{
    key: 'initServer',
    value: function initServer() {
      var _this = this;

      var config = this.config;

      if (config.https === null) {
        this.app = _http2['default'].createServer(this.handleRequest);
      } else {
        this.app = _https2['default'].createServer(config.https, this.handleRequest);
      }

      this.app.on('error', function (err) {
        if (err.code === 'EADDRINUSE') {
          setTimeout(_this.start.bind(_this, 0), 100);

          _this.debug('LiveReload: port ' + _this.config.port + ' already in use. Trying another port...');
          _this.emit('newport');
        }
      });

      this.app.on('listening', function () {
        _this.debug('LiveReload: listening on port ' + _this.address.port + '.');
        _this.emit('start');
      });

      this.app.on('upgrade', function (request, socket, body) {
        if (!_fayeWebsocket2['default'].isWebSocket(request)) return;
        var ws = new _fayeWebsocket2['default'](request, socket, body);

        ws.on('message', function (event) {
          var data = event.data,
              json;
          try {
            json = JSON.parse(event.data);
            if (typeof json.command === 'string') {
              _this.handleCommand(json);
            }
          } catch (e) {}
        });

        ws.on('close', function (event) {
          _this.sockets = _this.sockets.filter(function (sock) {
            return sock !== ws;
          });
          ws = null;
        });

        _this.sockets.push(ws);
      });
    }
  }, {
    key: 'start',
    value: function start(port) {
      if (typeof port === 'undefined') {
        port = this.config.port;
      }
      if (!this.app) {
        this.initServer();
      }
      this.app.listen(port);
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this.app) {
        this.app.close();
        this.app = null;
      }

      this.sockets = [];
      this.unwatch();

      this.emit('stop');
    }
  }, {
    key: 'watch',
    value: function watch(paths) {
      paths = paths.filter(function (path) {
        return !/^atom\:\/\//.test(path);
      });

      if (paths.length < 1) return;

      this.paths = [].concat(_toConsumableArray(this.paths), _toConsumableArray(paths));

      if (this.watcher) {
        this.watcher.watch(paths);
        return;
      }

      this.watcher = _chokidar2['default'].watch(paths, {
        ignoreInitial: true,
        ignored: this.config.exclusions
      });

      var _refresh = this.refresh.bind(this);

      this.watcher.on('add', _refresh).on('change', _refresh).on('unlink', _refresh);
    }
  }, {
    key: 'unwatch',
    value: function unwatch() {
      if (this.watcher) {
        this.watcher.unwatch(this.paths);
        this.watcher.close();
      }
      this.watcher = null;
      this.paths = [];
    }
  }, {
    key: 'refresh',
    value: function refresh(filepath) {
      var extname = _path2['default'].extname(filepath).substring(1);

      if (this.config.exts.indexOf(extname) < 0) return;

      setTimeout(this.send.bind(this, {
        command: 'reload',
        path: filepath,
        liveCSS: this.config.applyCSSLive,
        liveImg: this.config.applyImageLive
      }), this.config.delayForUpdate);
    }
  }, {
    key: 'handleRequest',
    value: function handleRequest(req, res) {
      var content = '',
          status = 200,
          headers;

      switch (_url2['default'].parse(req.url).pathname) {
        case '/':
          res.writeHead(200, { 'Content-Type': 'application/json' });
          break;
        case '/livereload.js':
        case '/xlivereload.js':
          res.writeHead(200, { 'Content-Type': 'text/javascript' });
          content = _fs2['default'].readFileSync(__dirname + '/../node_modules/livereload-js/dist/livereload.js');
          break;
        default:
          res.writeHead(300, { 'Content-Type': 'text/plain' });
          content = 'Not Found';
      }

      res.end(content);
    }
  }, {
    key: 'handleCommand',
    value: function handleCommand(command) {
      switch (command.command) {
        case 'hello':
          this.send({
            command: 'hello',
            protocols: [PROTOCOL_MONITORING_7],
            serverName: 'atom-livereload'
          });
          break;
        case 'ping':
          this.send({
            command: 'pong',
            token: command.token
          });
          break;
      }
    }
  }, {
    key: 'debug',
    value: function debug(text) {
      if (this.config.debug || true) {
        console.log(text);
      }
    }
  }, {
    key: 'send',
    value: function send(command) {
      this.sockets.forEach(function (sock) {
        sock.send(JSON.stringify(command));
      });
    }
  }, {
    key: 'activated',
    get: function get() {
      return !!this.app;
    }
  }, {
    key: 'address',
    get: function get() {
      return this.app.address();
    }
  }]);

  return Server;
})(_events2['default']);

exports['default'] = Server;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2xpdmVyZWxvYWQvbGliL3NlcnZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUV5QixRQUFROzs7O29CQUNoQixNQUFNOzs7O3FCQUNMLE9BQU87Ozs7bUJBQ1QsS0FBSzs7OztrQkFDTixJQUFJOzs7O29CQUNGLE1BQU07Ozs7NkJBQ0QsZ0JBQWdCOzs7O3dCQUNqQixVQUFVOzs7O3NCQUNqQixRQUFROzs7O0FBVnRCLFdBQVcsQ0FBQzs7QUFZWixJQUFNLHFCQUFxQixHQUFHLG9EQUFvRCxDQUFDO0FBQ25GLElBQU0scUJBQXFCLEdBQUcsNENBQTRDLENBQUM7QUFDM0UsSUFBTSxpQkFBaUIsR0FBRywwQ0FBMEMsQ0FBQzs7SUFFL0QsTUFBTTtZQUFOLE1BQU07Ozs7QUFPQyxXQVBQLE1BQU0sQ0FPRSxNQUFNLEVBQUU7MEJBUGhCLE1BQU07O0FBUVIsK0JBUkUsTUFBTSw2Q0FRQTtTQVBWLEtBQUssR0FBRyxFQUFFO1NBQ1YsT0FBTyxHQUFHLEVBQUU7U0FDWixHQUFHLEdBQUcsSUFBSTtTQUNWLE9BQU8sR0FBRyxJQUFJO1NBQ2QsSUFBSSxHQUFHLEVBQUU7QUFJUCxRQUFJLENBQUMsTUFBTSxHQUFHLG9CQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbkMsUUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7R0FDakI7O2VBWEcsTUFBTTs7V0FhQSxzQkFBRzs7O0FBQ1gsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7QUFFekIsVUFBSSxNQUFNLENBQUMsS0FBSyxLQUFLLElBQUksRUFBRTtBQUN6QixZQUFJLENBQUMsR0FBRyxHQUFHLGtCQUFLLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7T0FDbEQsTUFBTTtBQUNMLFlBQUksQ0FBQyxHQUFHLEdBQUcsbUJBQU0sWUFBWSxDQUFDLE1BQU0s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O0FBRUQsU0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNsQjs7O1dBRVksdUJBQUMsT0FBTyxFQUFFO0FBQ3JCLGNBQVEsT0FBTyxDQUFDLE9BQU87QUFDckIsYUFBSyxPQUFPO0FBQ1YsY0FBSSxDQUFDLElBQUksQ0FBQztBQUNSLG1CQUFPLEVBQUUsT0FBTztBQUNoQixxQkFBUyxFQUFFLENBQUMscUJBQXFCLENBQUM7QUFDbEMsc0JBQVUsRUFBRSxpQkFBaUI7V0FDOUIsQ0FBQyxDQUFDO0FBQ0gsZ0JBQU07QUFBQSxBQUNSLGFBQUssTUFBTTtBQUNYLGNBQUksQ0FBQyxJQUFJLENBQUM7QUFDUixtQkFBTyxFQUFFLE1BQU07QUFDZixpQkFBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO1dBQ3JCLENBQUMsQ0FBQztBQUNILGdCQUFNO0FBQUEsT0FDUDtLQUNGOzs7V0FVSSxlQUFDLElBQUksRUFBRTtBQUNWLFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFO0FBQzdCLGVBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDbkI7S0FDRjs7O1dBRUcsY0FBQyxPQUFPLEVBQUU7QUFDWixVQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBRSxVQUFBLElBQUksRUFBSTtBQUM1QixZQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztPQUNwQyxDQUFDLENBQUM7S0FDSjs7O1NBbEJZLGVBQUc7QUFDZCxhQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0tBQ25COzs7U0FFVSxlQUFHO0FBQ1osYUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzNCOzs7U0EvS0csTUFBTTs7O3FCQThMRyxNQUFNIiwiZmlsZSI6Ii9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2xpdmVyZWxvYWQvbGliL3NlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnO1xuaW1wb3J0IGh0dHBzIGZyb20gJ2h0dHBzJztcbmltcG9ydCB1cmwgZnJvbSAndXJsJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBXZWJTb2NrZXQgZnJvbSAnZmF5ZS13ZWJzb2NrZXQnO1xuaW1wb3J0IGNob2tpZGFyIGZyb20gJ2Nob2tpZGFyJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cbmNvbnN0IFBST1RPQ09MX0NPTk5fQ0hFQ0tfMSA9ICdodHRwOi8vbGl2ZXJlbG9hZC5jb20vcHJvdG9jb2xzL2Nvbm5lY3Rpb24tY2hlY2stMSc7XG5jb25zdCBQUk9UT0NPTF9NT05JVE9SSU5HXzcgPSAnaHR0cDovL2xpdmVyZWxvYWQuY29tL3Byb3RvY29scy9vZmZpY2lhbC03JztcbmNvbnN0IFBST1RPQ09MX1NBVklOR18xID0gJ2h0dHA6Ly9saXZlcmVsb2FkLmNvbS9wcm90b2NvbHMvc2F2aW5nLTEnO1xuXG5jbGFzcyBTZXJ2ZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBwYXRocyA9IFtdO1xuICBzb2NrZXRzID0gW107XG4gIGFwcCA9IG51bGw7XG4gIHdhdGNoZXIgPSBudWxsO1xuICBfdXJsID0gJyc7IC8vIGNsaWVudCB1cmxcblxuICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuY29uZmlnID0gXy5hc3NpZ24oe30sIGNvbmZpZyk7XG4gICAgdGhpcy5wYXRocyA9IFtdO1xuICB9XG5cbiAgaW5pdFNlcnZlcigpIHtcbiAgICB2YXIgY29uZmlnID0gdGhpcy5jb25maWc7XG5cbiAgICBpZiAoY29uZmlnLmh0dHBzID09PSBudWxsKSB7XG4gICAgICB0aGlzLmFwcCA9IGh0dHAuY3JlYXRlU2VydmVyKHRoaXMuaGFuZGxlUmVxdWVzdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXBwID0gaHR0cHMuY3JlYXRlU2VydmVyKGNvbmZpZy5odHRwcywgdGhpcy5oYW5kbGVSZXF1ZXN0KTtcbiAgICB9XG5cbiAgICB0aGlzLmFwcC5vbignZXJyb3InLCBlcnIgPT4ge1xuICAgICAgaWYgKGVyci5jb2RlID09PSAnRUFERFJJTlVTRScpIHtcbiAgICAgICAgc2V0VGltZW91dCh0aGlzLnN0YXJ0LmJpbmQodGhpcywgMCksIDEwMCk7XG5cbiAgICAgICAgdGhpcy5kZWJ1ZyhgTGl2ZVJlbG9hZDogcG9ydCAke3RoaXMuY29uZmlnLnBvcnR9IGFscmVhZHkgaW4gdXNlLiBUcnlpbmcgYW5vdGhlciBwb3J0Li4uYCk7XG4gICAgICAgIHRoaXMuZW1pdCgnbmV3cG9ydCcpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5hcHAub24oJ2xpc3RlbmluZycsICgpID0+IHtcbiAgICAgIHRoaXMuZGVidWcoYExpdmVSZWxvYWQ6IGxpc3RlbmluZyBvbiBwb3J0ICR7dGhpcy5hZGRyZXNzLnBvcnR9LmApO1xuICAgICAgdGhpcy5lbWl0KCdzdGFydCcpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5hcHAub24oJ3VwZ3JhZGUnLCAocmVxdWVzdCwgc29ja2V0LCBib2R5KSA9PiB7XG4gICAgICBpZiAoIVdlYlNvY2tldC5pc1dlYlNvY2tldChyZXF1ZXN0KSkgcmV0dXJuO1xuICAgICAgdmFyIHdzID0gbmV3IFdlYlNvY2tldChyZXF1ZXN0LCBzb2NrZXQsIGJvZHkpO1xuXG4gICAgICB3cy5vbignbWVzc2FnZScsIGV2ZW50ID0+IHtcbiAgICAgICAgdmFyIGRhdGEgPSBldmVudC5kYXRhLCBqc29uO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGpzb24gPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgIGlmICh0eXBlb2YganNvbi5jb21tYW5kID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVDb21tYW5kKGpzb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaChlKSB7IH1cbiAgICAgIH0pO1xuXG4gICAgICB3cy5vbignY2xvc2UnLCBldmVudCA9PiB7XG4gICAgICAgIHRoaXMuc29ja2V0cyA9IHRoaXMuc29ja2V0cy5maWx0ZXIoIHNvY2sgPT4gKHNvY2sgIT09IHdzKSApO1xuICAgICAgICB3cyA9IG51bGw7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5zb2NrZXRzLnB1c2god3MpO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhcnQocG9ydCkge1xuICAgIGlmICh0eXBlb2YgcG9ydCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHBvcnQgPSB0aGlzLmNvbmZpZy5wb3J0O1xuICAgIH1cbiAgICBpZiAoIXRoaXMuYXBwKSB7XG4gICAgICB0aGlzLmluaXRTZXJ2ZXIoKTtcbiAgICB9XG4gICAgdGhpcy5hcHAubGlzdGVuKHBvcnQpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBpZiAodGhpcy5hcHApIHtcbiAgICAgIHRoaXMuYXBwLmNsb3NlKCk7XG4gICAgICB0aGlzLmFwcCA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5zb2NrZXRzID0gW107XG4gICAgdGhpcy51bndhdGNoKCk7XG5cbiAgICB0aGlzLmVtaXQoJ3N0b3AnKTtcbiAgfVxuXG4gIHdhdGNoKHBhdGhzKSB7XG4gICAgcGF0aHMgPSBwYXRocy5maWx0ZXIoIHBhdGggPT4gIS9eYXRvbVxcOlxcL1xcLy8udGVzdChwYXRoKSApO1xuXG4gICAgICBpZiAocGF0aHMubGVuZ3RoIDwgMSkgcmV0dXJuO1xuXG4gICAgICB0aGlzLnBhdGhzID0gWy4uLnRoaXMucGF0aHMsIC4uLnBhdGhzXTtcblxuICAgICAgaWYgKHRoaXMud2F0Y2hlcikge1xuICAgICAgICB0aGlzLndhdGNoZXIud2F0Y2gocGF0aHMpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMud2F0Y2hlciA9IGNob2tpZGFyLndhdGNoKHBhdGhzLCB7XG4gICAgICAgIGlnbm9yZUluaXRpYWw6IHRydWUsXG4gICAgICAgIGlnbm9yZWQ6IHRoaXMuY29uZmlnLmV4Y2x1c2lvbnNcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgX3JlZnJlc2ggPSB0aGlzLnJlZnJlc2guYmluZCh0aGlzKTtcblxuICAgICAgdGhpcy53YXRjaGVyXG4gICAgICAub24oJ2FkZCcsIF9yZWZyZXNoKVxuICAgICAgLm9uKCdjaGFuZ2UnLCBfcmVmcmVzaClcbiAgICAgIC5vbigndW5saW5rJywgX3JlZnJlc2gpO1xuICB9XG5cbiAgdW53YXRjaCgpIHtcbiAgICBpZiAodGhpcy53YXRjaGVyKSB7XG4gICAgICB0aGlzLndhdGNoZXIudW53YXRjaCh0aGlzLnBhdGhzKTtcbiAgICAgIHRoaXMud2F0Y2hlci5jbG9zZSgpO1xuICAgIH1cbiAgICB0aGlzLndhdGNoZXIgPSBudWxsO1xuICAgIHRoaXMucGF0aHMgPSBbXTtcbiAgfVxuXG4gIHJlZnJlc2goZmlsZXBhdGgpIHtcbiAgICB2YXIgZXh0bmFtZSA9IHBhdGguZXh0bmFtZShmaWxlcGF0aCkuc3Vic3RyaW5nKDEpO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLmV4dHMuaW5kZXhPZihleHRuYW1lKSA8IDApIHJldHVybjtcblxuICAgIHNldFRpbWVvdXQoXG4gICAgICB0aGlzLnNlbmQuYmluZCh0aGlzLCB7XG4gICAgICAgIGNvbW1hbmQ6ICdyZWxvYWQnLFxuICAgICAgICBwYXRoOiBmaWxlcGF0aCxcbiAgICAgICAgbGl2ZUNTUzogdGhpcy5jb25maWcuYXBwbHlDU1NMaXZlLFxuICAgICAgICBsaXZlSW1nOiB0aGlzLmNvbmZpZy5hcHBseUltYWdlTGl2ZVxuICAgICAgfSksXG4gICAgICB0aGlzLmNvbmZpZy5kZWxheUZvclVwZGF0ZVxuICAgICk7XG4gIH1cblxuICBoYW5kbGVSZXF1ZXN0KHJlcSwgcmVzKSB7XG4gICAgdmFyIGNvbnRlbnQgPSAnJywgc3RhdHVzID0gMjAwLCBoZWFkZXJzO1xuXG4gICAgc3dpdGNoICh1cmwucGFyc2UocmVxLnVybCkucGF0aG5hbWUpIHtcbiAgICAgIGNhc2UgJy8nOlxuICAgICAgICByZXMud3JpdGVIZWFkKDIwMCwgeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICcvbGl2ZXJlbG9hZC5qcyc6XG4gICAgICBjYXNlICcveGxpdmVyZWxvYWQuanMnOlxuICAgICAgICByZXMud3JpdGVIZWFkKDIwMCwgeydDb250ZW50LVR5cGUnOiAndGV4dC9qYXZhc2NyaXB0J30pO1xuICAgICAgICBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKF9fZGlybmFtZSArICcvLi4vbm9kZV9tb2R1bGVzL2xpdmVyZWxvYWQtanMvZGlzdC9saXZlcmVsb2FkLmpzJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmVzLndyaXRlSGVhZCgzMDAsIHsnQ29udGVudC1UeXBlJzogJ3RleHQvcGxhaW4nfSk7XG4gICAgICAgIGNvbnRlbnQgPSAnTm90IEZvdW5kJztcbiAgICB9XG5cbiAgICByZXMuZW5kKGNvbnRlbnQpO1xuICB9XG5cbiAgaGFuZGxlQ29tbWFuZChjb21tYW5kKSB7XG4gICAgc3dpdGNoIChjb21tYW5kLmNvbW1hbmQpIHtcbiAgICAgIGNhc2UgJ2hlbGxvJzpcbiAgICAgICAgdGhpcy5zZW5kKHtcbiAgICAgICAgICBjb21tYW5kOiAnaGVsbG8nLFxuICAgICAgICAgIHByb3RvY29sczogW1BST1RPQ09MX01PTklUT1JJTkdfN10sXG4gICAgICAgICAgc2VydmVyTmFtZTogJ2F0b20tbGl2ZXJlbG9hZCdcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncGluZyc6XG4gICAgICB0aGlzLnNlbmQoe1xuICAgICAgICBjb21tYW5kOiAncG9uZycsXG4gICAgICAgIHRva2VuOiBjb21tYW5kLnRva2VuXG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGdldCBhY3RpdmF0ZWQoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5hcHA7XG4gIH1cblxuICBnZXQgYWRkcmVzcygpIHtcbiAgICByZXR1cm4gdGhpcy5hcHAuYWRkcmVzcygpO1xuICB9XG5cbiAgZGVidWcodGV4dCkge1xuICAgIGlmICh0aGlzLmNvbmZpZy5kZWJ1ZyB8fCB0cnVlKSB7XG4gICAgICBjb25zb2xlLmxvZyh0ZXh0KTtcbiAgICB9XG4gIH1cblxuICBzZW5kKGNvbW1hbmQpIHtcbiAgICB0aGlzLnNvY2tldHMuZm9yRWFjaCggc29jayA9PiB7XG4gICAgICBzb2NrLnNlbmQoSlNPTi5zdHJpbmdpZnkoY29tbWFuZCkpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNlcnZlcjtcbiJdfQ==
//# sourceURL=/Users/anas/.atom/packages/livereload/lib/server.js
