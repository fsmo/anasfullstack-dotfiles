Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _editorconfig = require('editorconfig');

var _editorconfig2 = _interopRequireDefault(_editorconfig);

var _commandsGenerate = require('./commands/generate');

var _commandsGenerate2 = _interopRequireDefault(_commandsGenerate);

function init(editor) {
	(0, _commandsGenerate2['default'])();

	if (!editor) {
		return;
	}

	var file = editor.getURI();

	var lineEndings = {
		crlf: '\r\n',
		lf: '\n'
	};

	if (!file) {
		return;
	}

	_editorconfig2['default'].parse(file).then(function (config) {
		if (Object.keys(config).length === 0) {
			return;
		}

		var indentStyle = config.indent_style || (editor.getSoftTabs() ? 'space' : 'tab');

		if (indentStyle === 'tab') {
			editor.setSoftTabs(false);

			if (config.tab_width) {
				editor.setTabLength(config.tab_width);
			}
		} else if (indentStyle === 'space') {
			editor.setSoftTabs(true);

			if (config.indent_size) {
				editor.setTabLength(config.indent_size);
			}
		}

		if (config.end_of_line && config.end_of_line in lineEndings) {
			(function () {
				var preferredLineEnding = lineEndings[config.end_of_line];
				var buffer = editor.getBuffer();
				buffer.setPreferredLineEnding(preferredLineEnding);
				buffer.backwardsScanInRange(/\r?\n/g, buffer.getRange(), function (_ref) {
					var replace = _ref.replace;

					replace(preferredLineEnding);
				});
			})();
		}

		if (config.charset) {
			// by default Atom uses charset name without any dashes in them
			// (i.e. 'utf16le' instead of 'utf-16le').
			editor.setEncoding(config.charset.replace(/-/g, '').toLowerCase());
		}
	});
}

var activate = function activate() {
	atom.workspace.observeTextEditors(init);
};
exports.activate = activate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2VkaXRvcmNvbmZpZy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs0QkFDeUIsY0FBYzs7OztnQ0FDWixxQkFBcUI7Ozs7QUFFaEQsU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3JCLHFDQUFnQixDQUFDOztBQUVqQixLQUFJLENBQUMsTUFBTSxFQUFFO0FBQ1osU0FBTztFQUNQOztBQUVELEtBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7QUFFN0IsS0FBTSxXQUFXLEdBQUc7QUFDbkIsTUFBSSxFQUFFLE1BQU07QUFDWixJQUFFLEVBQUUsSUFBSTtFQUNSLENBQUM7O0FBRUYsS0FBSSxDQUFDLElBQUksRUFBRTtBQUNWLFNBQU87RUFDUDs7QUFFRCwyQkFBYSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQ3ZDLE1BQUksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ3JDLFVBQU87R0FDUDs7QUFFRCxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsWUFBWSxLQUFLLE1BQU0sQ0FBQyxXQUFXLEVBQUUsR0FBRyxPQUFPLEdBQUcsS0FBSyxDQUFBLEFBQUMsQ0FBQzs7QUFFcEYsTUFBSSxXQUFXLEtBQUssS0FBSyxFQUFFO0FBQzFCLFNBQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRTFCLE9BQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtBQUNyQixVQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN0QztHQUNELE1BQU0sSUFBSSxXQUFXLEtBQUssT0FBTyxFQUFFO0FBQ25DLFNBQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXpCLE9BQUksTUFBTSxDQUFDLFdBQVcsRUFBRTtBQUN2QixVQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN4QztHQUNEOztBQUVELE1BQUksTUFBTSxDQUFDLFdBQVcsSUFBSSxNQUFNLENBQUMsV0FBVyxJQUFJLFdBQVcsRUFBRTs7QUFDNUQsUUFBTSxtQkFBbUIsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzVELFFBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNsQyxVQUFNLENBQUMsc0JBQXNCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUNuRCxVQUFNLENBQUMsb0JBQW9CLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRSxVQUFDLElBQVMsRUFBSztTQUFiLE9BQU8sR0FBUixJQUFTLENBQVIsT0FBTzs7QUFDakUsWUFBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7S0FDN0IsQ0FBQyxDQUFDOztHQUNIOztBQUVELE1BQUksTUFBTSxDQUFDLE9BQU8sRUFBRTs7O0FBR25CLFNBQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7R0FDbkU7RUFDRCxDQUFDLENBQUM7Q0FDSDs7QUFFTSxJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVEsR0FBUztBQUM3QixLQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0NBQ3hDLENBQUMiLCJmaWxlIjoiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvZWRpdG9yY29uZmlnL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuaW1wb3J0IGVkaXRvcmNvbmZpZyBmcm9tICdlZGl0b3Jjb25maWcnO1xuaW1wb3J0IGdlbmVyYXRlQ29uZmlnIGZyb20gJy4vY29tbWFuZHMvZ2VuZXJhdGUnO1xuXG5mdW5jdGlvbiBpbml0KGVkaXRvcikge1xuXHRnZW5lcmF0ZUNvbmZpZygpO1xuXG5cdGlmICghZWRpdG9yKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgZmlsZSA9IGVkaXRvci5nZXRVUkkoKTtcblxuXHRjb25zdCBsaW5lRW5kaW5ncyA9IHtcblx0XHRjcmxmOiAnXFxyXFxuJyxcblx0XHRsZjogJ1xcbidcblx0fTtcblxuXHRpZiAoIWZpbGUpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRlZGl0b3Jjb25maWcucGFyc2UoZmlsZSkudGhlbihjb25maWcgPT4ge1xuXHRcdGlmIChPYmplY3Qua2V5cyhjb25maWcpLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGluZGVudFN0eWxlID0gY29uZmlnLmluZGVudF9zdHlsZSB8fCAoZWRpdG9yLmdldFNvZnRUYWJzKCkgPyAnc3BhY2UnIDogJ3RhYicpO1xuXG5cdFx0aWYgKGluZGVudFN0eWxlID09PSAndGFiJykge1xuXHRcdFx0ZWRpdG9yLnNldFNvZnRUYWJzKGZhbHNlKTtcblxuXHRcdFx0aWYgKGNvbmZpZy50YWJfd2lkdGgpIHtcblx0XHRcdFx0ZWRpdG9yLnNldFRhYkxlbmd0aChjb25maWcudGFiX3dpZHRoKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKGluZGVudFN0eWxlID09PSAnc3BhY2UnKSB7XG5cdFx0XHRlZGl0b3Iuc2V0U29mdFRhYnModHJ1ZSk7XG5cblx0XHRcdGlmIChjb25maWcuaW5kZW50X3NpemUpIHtcblx0XHRcdFx0ZWRpdG9yLnNldFRhYkxlbmd0aChjb25maWcuaW5kZW50X3NpemUpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChjb25maWcuZW5kX29mX2xpbmUgJiYgY29uZmlnLmVuZF9vZl9saW5lIGluIGxpbmVFbmRpbmdzKSB7XG5cdFx0XHRjb25zdCBwcmVmZXJyZWRMaW5lRW5kaW5nID0gbGluZUVuZGluZ3NbY29uZmlnLmVuZF9vZl9saW5lXTtcblx0XHRcdGNvbnN0IGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKTtcblx0XHRcdGJ1ZmZlci5zZXRQcmVmZXJyZWRMaW5lRW5kaW5nKHByZWZlcnJlZExpbmVFbmRpbmcpO1xuXHRcdFx0YnVmZmVyLmJhY2t3YXJkc1NjYW5JblJhbmdlKC9cXHI/XFxuL2csIGJ1ZmZlci5nZXRSYW5nZSgpLCAoe3JlcGxhY2V9KSA9PiB7XG5cdFx0XHRcdHJlcGxhY2UocHJlZmVycmVkTGluZUVuZGluZyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAoY29uZmlnLmNoYXJzZXQpIHtcblx0XHRcdC8vIGJ5IGRlZmF1bHQgQXRvbSB1c2VzIGNoYXJzZXQgbmFtZSB3aXRob3V0IGFueSBkYXNoZXMgaW4gdGhlbVxuXHRcdFx0Ly8gKGkuZS4gJ3V0ZjE2bGUnIGluc3RlYWQgb2YgJ3V0Zi0xNmxlJykuXG5cdFx0XHRlZGl0b3Iuc2V0RW5jb2RpbmcoY29uZmlnLmNoYXJzZXQucmVwbGFjZSgvLS9nLCAnJykudG9Mb3dlckNhc2UoKSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZXhwb3J0IGNvbnN0IGFjdGl2YXRlID0gKCkgPT4ge1xuXHRhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoaW5pdCk7XG59O1xuIl19
//# sourceURL=/Users/anas/.atom/packages/editorconfig/index.js
