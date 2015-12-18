Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

exports['default'] = {
  jscsPath: {
    title: 'Path to JSCS binary',
    type: 'string',
    'default': _path2['default'].join(__dirname, '..', 'node_modules', 'jscs', 'bin', 'jscs')
  },
  defaultPreset: {
    title: 'Default preset',
    description: 'What preset to use if no rules file is found.',
    'enum': ['airbnb', 'crockford', 'google', 'grunt', 'jquery', 'mdcs', 'wikimedia', 'yandex'],
    type: 'string',
    'default': 'google'
  },
  esprima: {
    title: 'ES2015 and JSX Support',
    description: 'Attempts to parse your ES2015 and JSX code using the\n                  esprima-fb version of the esprima parser.',
    type: 'boolean',
    'default': false
  },
  esprimaPath: {
    title: 'Path to esprima parser folder',
    type: 'string',
    'default': _path2['default'].join(__dirname, '..', 'node_modules', 'esprima-fb')
  },
  notifications: {
    title: 'Enable editor notifications',
    description: 'If enabled, notifications will be shown after each attempt\n                  to fix a file. Shows both success and error messages.',
    type: 'boolean',
    'default': true
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2pzY3MtZml4ZXIvbGliL2NvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRWlCLE1BQU07Ozs7QUFGdkIsV0FBVyxDQUFDOztxQkFJRztBQUNiLFVBQVEsRUFBRTtBQUNSLFNBQUssRUFBRSxxQkFBcUI7QUFDNUIsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQztHQUMzRTtBQUNELGVBQWEsRUFBRTtBQUNiLFNBQUssRUFBRSxnQkFBZ0I7QUFDdkIsZUFBVyxFQUFFLCtDQUErQztBQUM1RCxZQUFNLENBQ0osUUFBUSxFQUNSLFdBQVcsRUFDWCxRQUFRLEVBQ1IsT0FBTyxFQUNQLFFBQVEsRUFDUixNQUFNLEVBQ04sV0FBVyxFQUNYLFFBQVEsQ0FDVDtBQUNELFFBQUksRUFBRSxRQUFRO0FBQ2QsZUFBUyxRQUFRO0dBQ2xCO0FBQ0QsU0FBTyxFQUFFO0FBQ1AsU0FBSyxFQUFFLHdCQUF3QjtBQUMvQixlQUFXLHFIQUM2QztBQUN4RCxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztHQUNmO0FBQ0QsYUFBVyxFQUFFO0FBQ1gsU0FBSyxFQUFFLCtCQUErQjtBQUN0QyxRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsa0JBQUssSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLFlBQVksQ0FBQztHQUNsRTtBQUNELGVBQWEsRUFBRTtBQUNiLFNBQUssRUFBRSw2QkFBNkI7QUFDcEMsZUFBVyx1SUFDeUQ7QUFDcEUsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7R0FDZDtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2pzY3MtZml4ZXIvbGliL2NvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGpzY3NQYXRoOiB7XG4gICAgdGl0bGU6ICdQYXRoIHRvIEpTQ1MgYmluYXJ5JyxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnbm9kZV9tb2R1bGVzJywgJ2pzY3MnLCAnYmluJywgJ2pzY3MnKVxuICB9LFxuICBkZWZhdWx0UHJlc2V0OiB7XG4gICAgdGl0bGU6ICdEZWZhdWx0IHByZXNldCcsXG4gICAgZGVzY3JpcHRpb246ICdXaGF0IHByZXNldCB0byB1c2UgaWYgbm8gcnVsZXMgZmlsZSBpcyBmb3VuZC4nLFxuICAgIGVudW06IFtcbiAgICAgICdhaXJibmInLFxuICAgICAgJ2Nyb2NrZm9yZCcsXG4gICAgICAnZ29vZ2xlJyxcbiAgICAgICdncnVudCcsXG4gICAgICAnanF1ZXJ5JyxcbiAgICAgICdtZGNzJyxcbiAgICAgICd3aWtpbWVkaWEnLFxuICAgICAgJ3lhbmRleCdcbiAgICBdLFxuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdnb29nbGUnLFxuICB9LFxuICBlc3ByaW1hOiB7XG4gICAgdGl0bGU6ICdFUzIwMTUgYW5kIEpTWCBTdXBwb3J0JyxcbiAgICBkZXNjcmlwdGlvbjogYEF0dGVtcHRzIHRvIHBhcnNlIHlvdXIgRVMyMDE1IGFuZCBKU1ggY29kZSB1c2luZyB0aGVcbiAgICAgICAgICAgICAgICAgIGVzcHJpbWEtZmIgdmVyc2lvbiBvZiB0aGUgZXNwcmltYSBwYXJzZXIuYCxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2VcbiAgfSxcbiAgZXNwcmltYVBhdGg6IHtcbiAgICB0aXRsZTogJ1BhdGggdG8gZXNwcmltYSBwYXJzZXIgZm9sZGVyJyxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnbm9kZV9tb2R1bGVzJywgJ2VzcHJpbWEtZmInKVxuICB9LFxuICBub3RpZmljYXRpb25zOiB7XG4gICAgdGl0bGU6ICdFbmFibGUgZWRpdG9yIG5vdGlmaWNhdGlvbnMnLFxuICAgIGRlc2NyaXB0aW9uOiBgSWYgZW5hYmxlZCwgbm90aWZpY2F0aW9ucyB3aWxsIGJlIHNob3duIGFmdGVyIGVhY2ggYXR0ZW1wdFxuICAgICAgICAgICAgICAgICAgdG8gZml4IGEgZmlsZS4gU2hvd3MgYm90aCBzdWNjZXNzIGFuZCBlcnJvciBtZXNzYWdlcy5gLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/anas/.atom/packages/jscs-fixer/lib/config.js
