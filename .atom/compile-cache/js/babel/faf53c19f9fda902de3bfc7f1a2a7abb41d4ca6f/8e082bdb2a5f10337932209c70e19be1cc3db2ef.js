Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _jshintSrcCli = require('jshint/src/cli');

var _jshintSrcCli2 = _interopRequireDefault(_jshintSrcCli);

var _userHome = require('user-home');

var _userHome2 = _interopRequireDefault(_userHome);

// from JSHint //
// Storage for memoized results from find file
// Should prevent lots of directory traversal &
// lookups when liniting an entire project
'use babel';
var findFileResults = {};

/**
 * Searches for a file with a specified name starting with
 * 'dir' and going all the way up either until it finds the file
 * or hits the root.
 *
 * @param {string} name filename to search for (e.g. .jshintrc)
 * @param {string} dir  directory to start search from
 *
 * @returns {string} normalized filename
 */
var findFile = function findFile(_x, _x2) {
	var _again = true;

	_function: while (_again) {
		var name = _x,
		    dir = _x2;
		_again = false;

		var filename = _path2['default'].normalize(_path2['default'].join(dir, name));
		if (findFileResults[filename] !== undefined) {
			return findFileResults[filename];
		}

		var parent = _path2['default'].resolve(dir, '../');

		if (_shelljs2['default'].test('-e', filename)) {
			findFileResults[filename] = filename;
			return filename;
		}

		if (dir === parent) {
			findFileResults[filename] = null;
			return null;
		}

		_x = name;
		_x2 = parent;
		_again = true;
		filename = parent = undefined;
		continue _function;
	}
};

/**
 * Tries to find a configuration file in either project directory
 * or in the home directory. Configuration files are named
 * '.jshintrc'.
 *
 * @param {string} file path to the file to be linted
 * @returns {string} a path to the config file
 */
var findConfig = function findConfig(file) {
	var dir = _path2['default'].dirname(_path2['default'].resolve(file));
	var home = _path2['default'].normalize(_path2['default'].join(_userHome2['default'], '.jshintrc'));

	var proj = findFile('.jshintrc', dir);
	if (proj) {
		return proj;
	}

	if (_shelljs2['default'].test('-e', home)) {
		return home;
	}

	return null;
};

/**
 * Tries to find JSHint configuration within a package.json file
 * (if any). It search in the current directory and then goes up
 * all the way to the root just like findFile.
 *
 * @param   {string} file path to the file to be linted
 * @returns {object} config object
 */
var loadNpmConfig = function loadNpmConfig(file) {
	var dir = _path2['default'].dirname(_path2['default'].resolve(file));
	var fp = findFile('package.json', dir);

	if (!fp) {
		return null;
	}

	try {
		return require(fp).jshintConfig;
	} catch (e) {
		return null;
	}
};
// / //

var loadConfigIfValid = function loadConfigIfValid(filename) {
	var strip = require('strip-json-comments');
	try {
		JSON.parse(strip(_fs2['default'].readFileSync(filename, 'utf8')));
		return _jshintSrcCli2['default'].loadConfig(filename);
	} catch (e) {}
	return {};
};

var loadConfig = function loadConfig(file) {
	var config = loadNpmConfig(file) || loadConfigIfValid(findConfig(file));
	if (config && config.dirname) {
		delete config.dirname;
	}
	return config;
};

exports['default'] = loadConfig;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2pzaGludC9sb2FkLWNvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7a0JBQ2UsSUFBSTs7OztvQkFDRixNQUFNOzs7O3VCQUNOLFNBQVM7Ozs7NEJBQ1YsZ0JBQWdCOzs7O3dCQUNYLFdBQVc7Ozs7Ozs7O0FBTGhDLFdBQVcsQ0FBQztBQVdaLElBQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7O0FBWTNCLElBQU0sUUFBUSxHQUFHLFNBQVgsUUFBUTs7OzJCQUFrQjtNQUFkLElBQUk7TUFBRSxHQUFHOzs7QUFDMUIsTUFBTSxRQUFRLEdBQUcsa0JBQUssU0FBUyxDQUFDLGtCQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN0RCxNQUFJLGVBQWUsQ0FBQyxRQUFRLENBQUMsS0FBSyxTQUFTLEVBQUU7QUFDNUMsVUFBTyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDakM7O0FBRUQsTUFBTSxNQUFNLEdBQUcsa0JBQUssT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFeEMsTUFBSSxxQkFBSyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxFQUFFO0FBQzlCLGtCQUFlLENBQUMsUUFBUSxDQUFDLEdBQUcsUUFBUSxDQUFDO0FBQ3JDLFVBQU8sUUFBUSxDQUFDO0dBQ2hCOztBQUVELE1BQUksR0FBRyxLQUFLLE1BQU0sRUFBRTtBQUNuQixrQkFBZSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNqQyxVQUFPLElBQUksQ0FBQztHQUNaOztPQUVlLElBQUk7UUFBRSxNQUFNOztBQWpCdEIsVUFBUSxHQUtSLE1BQU07O0VBYVo7Q0FBQSxDQUFDOzs7Ozs7Ozs7O0FBVUYsSUFBTSxVQUFVLEdBQUcsU0FBYixVQUFVLENBQUcsSUFBSSxFQUFJO0FBQzFCLEtBQU0sR0FBRyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxrQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM3QyxLQUFNLElBQUksR0FBRyxrQkFBSyxTQUFTLENBQUMsa0JBQUssSUFBSSx3QkFBVyxXQUFXLENBQUMsQ0FBQyxDQUFDOztBQUU5RCxLQUFNLElBQUksR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLEtBQUksSUFBSSxFQUFFO0FBQ1QsU0FBTyxJQUFJLENBQUM7RUFDWjs7QUFFRCxLQUFJLHFCQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUU7QUFDMUIsU0FBTyxJQUFJLENBQUM7RUFDWjs7QUFFRCxRQUFPLElBQUksQ0FBQztDQUNaLENBQUM7Ozs7Ozs7Ozs7QUFVRixJQUFNLGFBQWEsR0FBRyxTQUFoQixhQUFhLENBQUcsSUFBSSxFQUFJO0FBQzdCLEtBQU0sR0FBRyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxrQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM3QyxLQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUV6QyxLQUFJLENBQUMsRUFBRSxFQUFFO0FBQ1IsU0FBTyxJQUFJLENBQUM7RUFDWjs7QUFFRCxLQUFJO0FBQ0gsU0FBTyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDO0VBQ2hDLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDWCxTQUFPLElBQUksQ0FBQztFQUNaO0NBQ0QsQ0FBQzs7O0FBR0YsSUFBTSxpQkFBaUIsR0FBRyxTQUFwQixpQkFBaUIsQ0FBRyxRQUFRLEVBQUk7QUFDckMsS0FBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDN0MsS0FBSTtBQUNILE1BQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGdCQUFHLFlBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JELFNBQU8sMEJBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0VBQ2hDLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFDWDtBQUNELFFBQU8sRUFBRSxDQUFDO0NBQ1YsQ0FBQzs7QUFFRixJQUFNLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBRyxJQUFJLEVBQUk7QUFDMUIsS0FBTSxNQUFNLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzFFLEtBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7QUFDN0IsU0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDO0VBQ3RCO0FBQ0QsUUFBTyxNQUFNLENBQUM7Q0FDZCxDQUFDOztxQkFFYSxVQUFVIiwiZmlsZSI6Ii9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2pzaGludC9sb2FkLWNvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHNoanMgZnJvbSAnc2hlbGxqcyc7XG5pbXBvcnQgY2xpIGZyb20gJ2pzaGludC9zcmMvY2xpJztcbmltcG9ydCB1c2VySG9tZSBmcm9tICd1c2VyLWhvbWUnO1xuXG4vLyBmcm9tIEpTSGludCAvL1xuLy8gU3RvcmFnZSBmb3IgbWVtb2l6ZWQgcmVzdWx0cyBmcm9tIGZpbmQgZmlsZVxuLy8gU2hvdWxkIHByZXZlbnQgbG90cyBvZiBkaXJlY3RvcnkgdHJhdmVyc2FsICZcbi8vIGxvb2t1cHMgd2hlbiBsaW5pdGluZyBhbiBlbnRpcmUgcHJvamVjdFxuY29uc3QgZmluZEZpbGVSZXN1bHRzID0ge307XG5cbi8qKlxuICogU2VhcmNoZXMgZm9yIGEgZmlsZSB3aXRoIGEgc3BlY2lmaWVkIG5hbWUgc3RhcnRpbmcgd2l0aFxuICogJ2RpcicgYW5kIGdvaW5nIGFsbCB0aGUgd2F5IHVwIGVpdGhlciB1bnRpbCBpdCBmaW5kcyB0aGUgZmlsZVxuICogb3IgaGl0cyB0aGUgcm9vdC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBmaWxlbmFtZSB0byBzZWFyY2ggZm9yIChlLmcuIC5qc2hpbnRyYylcbiAqIEBwYXJhbSB7c3RyaW5nfSBkaXIgIGRpcmVjdG9yeSB0byBzdGFydCBzZWFyY2ggZnJvbVxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IG5vcm1hbGl6ZWQgZmlsZW5hbWVcbiAqL1xuY29uc3QgZmluZEZpbGUgPSAobmFtZSwgZGlyKSA9PiB7XG5cdGNvbnN0IGZpbGVuYW1lID0gcGF0aC5ub3JtYWxpemUocGF0aC5qb2luKGRpciwgbmFtZSkpO1xuXHRpZiAoZmluZEZpbGVSZXN1bHRzW2ZpbGVuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGZpbmRGaWxlUmVzdWx0c1tmaWxlbmFtZV07XG5cdH1cblxuXHRjb25zdCBwYXJlbnQgPSBwYXRoLnJlc29sdmUoZGlyLCAnLi4vJyk7XG5cblx0aWYgKHNoanMudGVzdCgnLWUnLCBmaWxlbmFtZSkpIHtcblx0XHRmaW5kRmlsZVJlc3VsdHNbZmlsZW5hbWVdID0gZmlsZW5hbWU7XG5cdFx0cmV0dXJuIGZpbGVuYW1lO1xuXHR9XG5cblx0aWYgKGRpciA9PT0gcGFyZW50KSB7XG5cdFx0ZmluZEZpbGVSZXN1bHRzW2ZpbGVuYW1lXSA9IG51bGw7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRyZXR1cm4gZmluZEZpbGUobmFtZSwgcGFyZW50KTtcbn07XG5cbi8qKlxuICogVHJpZXMgdG8gZmluZCBhIGNvbmZpZ3VyYXRpb24gZmlsZSBpbiBlaXRoZXIgcHJvamVjdCBkaXJlY3RvcnlcbiAqIG9yIGluIHRoZSBob21lIGRpcmVjdG9yeS4gQ29uZmlndXJhdGlvbiBmaWxlcyBhcmUgbmFtZWRcbiAqICcuanNoaW50cmMnLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlIHBhdGggdG8gdGhlIGZpbGUgdG8gYmUgbGludGVkXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBhIHBhdGggdG8gdGhlIGNvbmZpZyBmaWxlXG4gKi9cbmNvbnN0IGZpbmRDb25maWcgPSBmaWxlID0+IHtcblx0Y29uc3QgZGlyID0gcGF0aC5kaXJuYW1lKHBhdGgucmVzb2x2ZShmaWxlKSk7XG5cdGNvbnN0IGhvbWUgPSBwYXRoLm5vcm1hbGl6ZShwYXRoLmpvaW4odXNlckhvbWUsICcuanNoaW50cmMnKSk7XG5cblx0Y29uc3QgcHJvaiA9IGZpbmRGaWxlKCcuanNoaW50cmMnLCBkaXIpO1xuXHRpZiAocHJvaikge1xuXHRcdHJldHVybiBwcm9qO1xuXHR9XG5cblx0aWYgKHNoanMudGVzdCgnLWUnLCBob21lKSkge1xuXHRcdHJldHVybiBob21lO1xuXHR9XG5cblx0cmV0dXJuIG51bGw7XG59O1xuXG4vKipcbiAqIFRyaWVzIHRvIGZpbmQgSlNIaW50IGNvbmZpZ3VyYXRpb24gd2l0aGluIGEgcGFja2FnZS5qc29uIGZpbGVcbiAqIChpZiBhbnkpLiBJdCBzZWFyY2ggaW4gdGhlIGN1cnJlbnQgZGlyZWN0b3J5IGFuZCB0aGVuIGdvZXMgdXBcbiAqIGFsbCB0aGUgd2F5IHRvIHRoZSByb290IGp1c3QgbGlrZSBmaW5kRmlsZS5cbiAqXG4gKiBAcGFyYW0gICB7c3RyaW5nfSBmaWxlIHBhdGggdG8gdGhlIGZpbGUgdG8gYmUgbGludGVkXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBjb25maWcgb2JqZWN0XG4gKi9cbmNvbnN0IGxvYWROcG1Db25maWcgPSBmaWxlID0+IHtcblx0Y29uc3QgZGlyID0gcGF0aC5kaXJuYW1lKHBhdGgucmVzb2x2ZShmaWxlKSk7XG5cdGNvbnN0IGZwID0gZmluZEZpbGUoJ3BhY2thZ2UuanNvbicsIGRpcik7XG5cblx0aWYgKCFmcCkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0dHJ5IHtcblx0XHRyZXR1cm4gcmVxdWlyZShmcCkuanNoaW50Q29uZmlnO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn07XG4vLyAvIC8vXG5cbmNvbnN0IGxvYWRDb25maWdJZlZhbGlkID0gZmlsZW5hbWUgPT4ge1xuXHRjb25zdCBzdHJpcCA9IHJlcXVpcmUoJ3N0cmlwLWpzb24tY29tbWVudHMnKTtcblx0dHJ5IHtcblx0XHRKU09OLnBhcnNlKHN0cmlwKGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSwgJ3V0ZjgnKSkpO1xuXHRcdHJldHVybiBjbGkubG9hZENvbmZpZyhmaWxlbmFtZSk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0fVxuXHRyZXR1cm4ge307XG59O1xuXG5jb25zdCBsb2FkQ29uZmlnID0gZmlsZSA9PiB7XG5cdGNvbnN0IGNvbmZpZyA9IGxvYWROcG1Db25maWcoZmlsZSkgfHwgbG9hZENvbmZpZ0lmVmFsaWQoZmluZENvbmZpZyhmaWxlKSk7XG5cdGlmIChjb25maWcgJiYgY29uZmlnLmRpcm5hbWUpIHtcblx0XHRkZWxldGUgY29uZmlnLmRpcm5hbWU7XG5cdH1cblx0cmV0dXJuIGNvbmZpZztcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGxvYWRDb25maWc7XG4iXX0=
//# sourceURL=/Users/anas/.atom/packages/jshint/load-config.js
