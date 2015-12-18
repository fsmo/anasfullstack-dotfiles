Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = config;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

"use babel";

var DEFAULT_EXTS = 'html css js png gif jpg php php5 py rb erb coffee'.split(' ');
var DEFAULT_EXCLUSIONS = '.DS_Store .gitignore .git/ .svn/ .hg/'.split(' ');

function config() {
  var custom = {
    // port number
    port: atom.config.get('livereload.port'),

    // use HTTPS
    https: atom.config.get('livereload.useHTTPS') ? {} : null,

    // applyCSSLive
    applyCSSLive: atom.config.get('livereload.applyCSSLive') || true,

    // applyImageLive
    applyImageLive: atom.config.get('livereload.applyImageLive') || false,

    // delay for update
    delayForUpdate: atom.config.get('livereload.delayForUpdate')
  };

  // exts
  var exts = atom.config.get('livereload.exts').split(',').map(function (ext) {
    return ext.trim();
  });
  custom.exts = _lodash2['default'].chain(exts).concat(DEFAULT_EXTS).uniq().value();

  var exclusions = atom.config.get('livereload.exclusions').split(',').map(function (ex) {
    return ex.trim();
  });
  custom.exclusions = _lodash2['default'].chain(exclusions).concat(DEFAULT_EXCLUSIONS).uniq().map(function (pattern) {
    return new RegExp(pattern.replace(/([.\\\/])/g, '\\$1'));
  }).value();

  return custom;
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2xpdmVyZWxvYWQvbGliL2NvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7cUJBT3dCLE1BQU07Ozs7c0JBTGhCLFFBQVE7Ozs7QUFGdEIsV0FBVyxDQUFDOztBQUlaLElBQU0sWUFBWSxHQUFHLG1EQUFtRCxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwRixJQUFNLGtCQUFrQixHQUFHLHVDQUF1QyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFL0QsU0FBUyxNQUFNLEdBQUc7QUFDL0IsTUFBSSxNQUFNLEdBQUc7O0FBRVgsUUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDOzs7QUFHeEMsU0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUk7OztBQUd6RCxnQkFBWSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLElBQUksSUFBSTs7O0FBR2hFLGtCQUFjLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsSUFBSSxLQUFLOzs7QUFHckUsa0JBQWMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQztHQUM3RCxDQUFDOzs7QUFHRixNQUFJLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUUsVUFBQSxHQUFHO1dBQUksR0FBRyxDQUFDLElBQUksRUFBRTtHQUFBLENBQUUsQ0FBQztBQUNsRixRQUFNLENBQUMsSUFBSSxHQUFHLG9CQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7O0FBRWhFLE1BQUksVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxVQUFBLEVBQUU7V0FBSSxFQUFFLENBQUMsSUFBSSxFQUFFO0dBQUEsQ0FBRSxDQUFDO0FBQzVGLFFBQU0sQ0FBQyxVQUFVLEdBQUcsb0JBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBRSxVQUFBLE9BQU8sRUFBSTtBQUFFLFdBQU8sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFFLENBQUMsQ0FBQTtHQUFFLENBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFFbEssU0FBTyxNQUFNLENBQUM7Q0FDZiIsImZpbGUiOiIvVXNlcnMvYW5hcy8uYXRvbS9wYWNrYWdlcy9saXZlcmVsb2FkL2xpYi9jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5jb25zdCBERUZBVUxUX0VYVFMgPSAnaHRtbCBjc3MganMgcG5nIGdpZiBqcGcgcGhwIHBocDUgcHkgcmIgZXJiIGNvZmZlZScuc3BsaXQoJyAnKTtcbmNvbnN0IERFRkFVTFRfRVhDTFVTSU9OUyA9ICcuRFNfU3RvcmUgLmdpdGlnbm9yZSAuZ2l0LyAuc3ZuLyAuaGcvJy5zcGxpdCgnICcpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb25maWcoKSB7XG4gIHZhciBjdXN0b20gPSB7XG4gICAgLy8gcG9ydCBudW1iZXJcbiAgICBwb3J0OiBhdG9tLmNvbmZpZy5nZXQoJ2xpdmVyZWxvYWQucG9ydCcpLFxuXG4gICAgLy8gdXNlIEhUVFBTXG4gICAgaHR0cHM6IGF0b20uY29uZmlnLmdldCgnbGl2ZXJlbG9hZC51c2VIVFRQUycpID8ge30gOiBudWxsLFxuXG4gICAgLy8gYXBwbHlDU1NMaXZlXG4gICAgYXBwbHlDU1NMaXZlOiBhdG9tLmNvbmZpZy5nZXQoJ2xpdmVyZWxvYWQuYXBwbHlDU1NMaXZlJykgfHwgdHJ1ZSxcblxuICAgIC8vIGFwcGx5SW1hZ2VMaXZlXG4gICAgYXBwbHlJbWFnZUxpdmU6IGF0b20uY29uZmlnLmdldCgnbGl2ZXJlbG9hZC5hcHBseUltYWdlTGl2ZScpIHx8IGZhbHNlLFxuXG4gICAgLy8gZGVsYXkgZm9yIHVwZGF0ZVxuICAgIGRlbGF5Rm9yVXBkYXRlOiBhdG9tLmNvbmZpZy5nZXQoJ2xpdmVyZWxvYWQuZGVsYXlGb3JVcGRhdGUnKVxuICB9O1xuXG4gIC8vIGV4dHNcbiAgbGV0IGV4dHMgPSBhdG9tLmNvbmZpZy5nZXQoJ2xpdmVyZWxvYWQuZXh0cycpLnNwbGl0KCcsJykubWFwKCBleHQgPT4gZXh0LnRyaW0oKSApO1xuICBjdXN0b20uZXh0cyA9IF8uY2hhaW4oZXh0cykuY29uY2F0KERFRkFVTFRfRVhUUykudW5pcSgpLnZhbHVlKCk7XG5cbiAgbGV0IGV4Y2x1c2lvbnMgPSBhdG9tLmNvbmZpZy5nZXQoJ2xpdmVyZWxvYWQuZXhjbHVzaW9ucycpLnNwbGl0KCcsJykubWFwKCBleCA9PiBleC50cmltKCkgKTtcbiAgY3VzdG9tLmV4Y2x1c2lvbnMgPSBfLmNoYWluKGV4Y2x1c2lvbnMpLmNvbmNhdChERUZBVUxUX0VYQ0xVU0lPTlMpLnVuaXEoKS5tYXAoIHBhdHRlcm4gPT4geyByZXR1cm4gbmV3IFJlZ0V4cChwYXR0ZXJuLnJlcGxhY2UoLyhbLlxcXFxcXC9dKS9nLCAnXFxcXCQxJyApKSB9ICkudmFsdWUoKTtcblxuICByZXR1cm4gY3VzdG9tO1xufVxuIl19
//# sourceURL=/Users/anas/.atom/packages/livereload/lib/config.js
