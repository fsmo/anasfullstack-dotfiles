(function() {
  var BufferedProcess, CompositeDisposable, DefinitionsView, Disposable, InterpreterLookup, Selector, filter, log, selectorsMatchScopeChain, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom'), Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable, BufferedProcess = _ref.BufferedProcess;

  selectorsMatchScopeChain = require('./scope-helpers').selectorsMatchScopeChain;

  Selector = require('selector-kit').Selector;

  DefinitionsView = require('./definitions-view');

  InterpreterLookup = require('./interpreters-lookup');

  log = require('./log');

  filter = void 0;

  module.exports = {
    selector: '.source.python',
    disableForSelector: '.source.python .comment, .source.python .string',
    inclusionPriority: 2,
    suggestionPriority: 3,
    excludeLowerPriority: false,
    cacheSize: 10,
    _addEventListener: function(editor, eventName, handler) {
      var disposable, editorView;
      editorView = atom.views.getView(editor);
      editorView.addEventListener(eventName, handler);
      disposable = new Disposable(function() {
        log.debug('Unsubscribing from event listener ', eventName, handler);
        return editorView.removeEventListener(eventName, handler);
      });
      return disposable;
    },
    _noExecutableError: function(error) {
      if (this.providerNoExecutable) {
        return;
      }
      log.warning('No python executable found', error);
      atom.notifications.addWarning('autocomplete-python unable to find python binary.', {
        detail: "Please set path to python executable manually in package\nsettings and restart your editor. Be sure to migrate on new settings\nif everything worked on previous version.\nDetailed error message: " + error + "\n\nCurrent config: " + (atom.config.get('autocomplete-python.pythonPaths')),
        dismissable: true
      });
      return this.providerNoExecutable = true;
    },
    _spawnDaemon: function() {
      var interpreter;
      interpreter = InterpreterLookup.getInterpreter();
      log.debug('Using interpreter', interpreter);
      this.provider = new BufferedProcess({
        command: interpreter || 'python',
        args: [__dirname + '/completion.py'],
        stdout: (function(_this) {
          return function(data) {
            return _this._deserialize(data);
          };
        })(this),
        stderr: (function(_this) {
          return function(data) {
            if (data.indexOf('is not recognized as an internal or external command, operable program or batch file') > -1) {
              return _this._noExecutableError(data);
            }
            log.debug("autocomplete-python traceback output: " + data);
            if (atom.config.get('autocomplete-python.outputProviderErrors')) {
              return atom.notifications.addError('autocomplete-python traceback output:', {
                detail: "" + data,
                dismissable: true
              });
            }
          };
        })(this),
        exit: (function(_this) {
          return function(code) {
            return log.warning('Process exit with', code, _this.provider);
          };
        })(this)
      });
      this.provider.onWillThrowError((function(_this) {
        return function(_arg) {
          var error, handle;
          error = _arg.error, handle = _arg.handle;
          if (error.code === 'ENOENT' && error.syscall.indexOf('spawn') === 0) {
            _this._noExecutableError(error);
            _this.dispose();
            return handle();
          } else {
            throw error;
          }
        };
      })(this));
      this.provider.process.stdin.on('error', function(err) {
        return log.debug('stdin', err);
      });
      return setTimeout((function(_this) {
        return function() {
          log.debug('Killing python process after timeout...');
          if (_this.provider && _this.provider.process) {
            return _this.provider.kill();
          }
        };
      })(this), 60 * 10 * 1000);
    },
    constructor: function() {
      var err, selector;
      this.requests = {};
      this.responses = {};
      this.provider = null;
      this.disposables = new CompositeDisposable;
      this.subscriptions = {};
      this.definitionsView = null;
      this.snippetsManager = null;
      try {
        this.triggerCompletionRegex = RegExp(atom.config.get('autocomplete-python.triggerCompletionRegex'));
      } catch (_error) {
        err = _error;
        atom.notifications.addWarning('autocomplete-python invalid regexp to trigger autocompletions.\nFalling back to default value.', {
          detail: "Original exception: " + err,
          dismissable: true
        });
        atom.config.set('autocomplete-python.triggerCompletionRegex', '([\.\ ]|[a-zA-Z_][a-zA-Z0-9_]*)');
        this.triggerCompletionRegex = /([\.\ ]|[a-zA-Z_][a-zA-Z0-9_]*)/;
      }
      selector = 'atom-text-editor[data-grammar~=python]';
      atom.commands.add(selector, 'autocomplete-python:go-to-definition', (function(_this) {
        return function() {
          return _this.goToDefinition();
        };
      })(this));
      atom.commands.add(selector, 'autocomplete-python:complete-arguments', (function(_this) {
        return function() {
          var editor;
          editor = atom.workspace.getActiveTextEditor();
          return _this._completeArguments(editor, editor.getCursorBufferPosition(), true);
        };
      })(this));
      return atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          _this._handleGrammarChangeEvent(editor, editor.getGrammar());
          return editor.displayBuffer.onDidChangeGrammar(function(grammar) {
            return _this._handleGrammarChangeEvent(editor, grammar);
          });
        };
      })(this));
    },
    _handleGrammarChangeEvent: function(editor, grammar) {
      var disposable, eventId, eventName;
      eventName = 'keyup';
      eventId = "" + editor.displayBuffer.id + "." + eventName;
      if (grammar.scopeName === 'source.python') {
        disposable = this._addEventListener(editor, eventName, (function(_this) {
          return function(event) {
            if (event.keyIdentifier === 'U+0028') {
              return _this._completeArguments(editor, editor.getCursorBufferPosition());
            }
          };
        })(this));
        this.disposables.add(disposable);
        this.subscriptions[eventId] = disposable;
        return log.debug('Subscribed on event', eventId);
      } else {
        if (eventId in this.subscriptions) {
          this.subscriptions[eventId].dispose();
          return log.debug('Unsubscribed from event', eventId);
        }
      }
    },
    _serialize: function(request) {
      log.debug('Serializing request to be sent to Jedi', request);
      return JSON.stringify(request);
    },
    _sendRequest: function(data, respawned) {
      var process;
      log.debug('Pending requests:', Object.keys(this.requests).length, this.requests);
      if (Object.keys(this.requests).length > 10) {
        log.debug('Cleaning up request queue to avoid overflow, ignoring request');
        this.requests = {};
        if (this.provider && this.provider.process) {
          log.debug('Killing python process');
          this.provider.kill();
          return;
        }
      }
      if (this.provider && this.provider.process) {
        process = this.provider.process;
        if (process.exitCode === null && process.signalCode === null) {
          if (this.provider.process.pid) {
            return this.provider.process.stdin.write(data + '\n');
          } else {
            return log.debug('Attempt to communicate with terminated process', this.provider);
          }
        } else if (respawned) {
          atom.notifications.addWarning(["Failed to spawn daemon for autocomplete-python.", "Completions will not work anymore", "unless you restart your editor."].join(' '), {
            detail: ["exitCode: " + process.exitCode, "signalCode: " + process.signalCode].join('\n'),
            dismissable: true
          });
          return this.dispose();
        } else {
          this._spawnDaemon();
          this._sendRequest(data, {
            respawned: true
          });
          return log.debug('Re-spawning python process...');
        }
      } else {
        log.debug('Spawning python process...');
        this._spawnDaemon();
        return this._sendRequest(data);
      }
    },
    _deserialize: function(response) {
      var bufferPosition, cacheSizeDelta, editor, id, ids, resolve, responseSource, _i, _j, _len, _len1, _ref1, _ref2, _ref3, _results;
      log.debug('Deserealizing response from Jedi', response);
      log.debug("Got " + (response.trim().split('\n').length) + " lines");
      _ref1 = response.trim().split('\n');
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        responseSource = _ref1[_i];
        response = JSON.parse(responseSource);
        if (response['arguments']) {
          editor = this.requests[response['id']];
          if (typeof editor === 'object') {
            bufferPosition = editor.getCursorBufferPosition();
            if (response['id'] === this._generateRequestId(editor, bufferPosition)) {
              if ((_ref2 = this.snippetsManager) != null) {
                _ref2.insertSnippet(response['arguments'], editor);
              }
            }
          }
        } else {
          resolve = this.requests[response['id']];
          if (typeof resolve === 'function') {
            resolve(response['results']);
          }
        }
        cacheSizeDelta = Object.keys(this.responses).length > this.cacheSize;
        if (cacheSizeDelta > 0) {
          ids = Object.keys(this.responses).sort((function(_this) {
            return function(a, b) {
              return _this.responses[a]['timestamp'] - _this.responses[b]['timestamp'];
            };
          })(this));
          _ref3 = ids.slice(0, cacheSizeDelta);
          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
            id = _ref3[_j];
            log.debug('Removing old item from cache with ID', id);
            delete this.responses[id];
          }
        }
        this.responses[response['id']] = {
          source: responseSource,
          timestamp: Date.now()
        };
        log.debug('Cached request with ID', response['id']);
        _results.push(delete this.requests[response['id']]);
      }
      return _results;
    },
    _generateRequestId: function(editor, bufferPosition, text) {
      if (!text) {
        text = editor.getText();
      }
      return require('crypto').createHash('md5').update([editor.getPath(), text, bufferPosition.row, bufferPosition.column].join()).digest('hex');
    },
    _generateRequestConfig: function() {
      var args, extraPaths, modified, p, project, _i, _j, _len, _len1, _ref1, _ref2;
      extraPaths = [];
      _ref1 = atom.config.get('autocomplete-python.extraPaths').split(';');
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        p = _ref1[_i];
        _ref2 = atom.project.getPaths();
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          project = _ref2[_j];
          modified = p.replace(/\$PROJECT/i, project);
          if (__indexOf.call(extraPaths, modified) < 0) {
            extraPaths.push(modified);
          }
        }
      }
      args = {
        'extraPaths': extraPaths,
        'useSnippets': atom.config.get('autocomplete-python.useSnippets'),
        'caseInsensitiveCompletion': atom.config.get('autocomplete-python.caseInsensitiveCompletion'),
        'showDescriptions': atom.config.get('autocomplete-python.showDescriptions'),
        'fuzzyMatcher': atom.config.get('autocomplete-python.fuzzyMatcher')
      };
      return args;
    },
    setSnippetsManager: function(snippetsManager) {
      this.snippetsManager = snippetsManager;
    },
    _completeArguments: function(editor, bufferPosition, force) {
      var disableForSelector, payload, scopeChain, scopeDescriptor, useSnippets;
      useSnippets = atom.config.get('autocomplete-python.useSnippets');
      if (!force && useSnippets === 'none') {
        return;
      }
      log.debug('Trying to complete arguments after left parenthesis...');
      scopeDescriptor = editor.scopeDescriptorForBufferPosition(bufferPosition);
      scopeChain = scopeDescriptor.getScopeChain();
      disableForSelector = Selector.create(this.disableForSelector);
      if (selectorsMatchScopeChain(disableForSelector, scopeChain)) {
        log.debug('Ignoring argument completion inside of', scopeChain);
        return;
      }
      payload = {
        id: this._generateRequestId(editor, bufferPosition),
        lookup: 'arguments',
        path: editor.getPath(),
        source: editor.getText(),
        line: bufferPosition.row,
        column: bufferPosition.column,
        config: this._generateRequestConfig()
      };
      this._sendRequest(this._serialize(payload));
      return new Promise((function(_this) {
        return function() {
          return _this.requests[payload.id] = editor;
        };
      })(this));
    },
    _fuzzyFilter: function(candidates, query) {
      if (candidates.length !== 0 && (query !== ' ' && query !== '.')) {
        if (filter == null) {
          filter = require('fuzzaldrin-plus').filter;
        }
        candidates = filter(candidates, query, {
          key: 'text'
        });
      }
      return candidates;
    },
    getSuggestions: function(_arg) {
      var bufferPosition, editor, lastIdentifier, line, lines, matches, payload, prefix, requestId, scopeDescriptor;
      editor = _arg.editor, bufferPosition = _arg.bufferPosition, scopeDescriptor = _arg.scopeDescriptor, prefix = _arg.prefix;
      if (!this.triggerCompletionRegex.test(prefix)) {
        return [];
      }
      bufferPosition = {
        row: bufferPosition.row,
        column: bufferPosition.column
      };
      lines = editor.getBuffer().getLines();
      if (atom.config.get('autocomplete-python.fuzzyMatcher')) {
        line = lines[bufferPosition.row];
        lastIdentifier = /\.?[a-zA-Z_][a-zA-Z0-9_]*$/.exec(line.slice(0, bufferPosition.column));
        if (lastIdentifier) {
          bufferPosition.column = lastIdentifier.index + 1;
          lines[bufferPosition.row] = line.slice(0, bufferPosition.column);
        }
      }
      requestId = this._generateRequestId(editor, bufferPosition, lines.join('\n'));
      if (requestId in this.responses) {
        log.debug('Using cached response with ID', requestId);
        matches = JSON.parse(this.responses[requestId]['source'])['results'];
        if (atom.config.get('autocomplete-python.fuzzyMatcher')) {
          return this._fuzzyFilter(matches, prefix);
        } else {
          return matches;
        }
      }
      payload = {
        id: requestId,
        prefix: prefix,
        lookup: 'completions',
        path: editor.getPath(),
        source: editor.getText(),
        line: bufferPosition.row,
        column: bufferPosition.column,
        config: this._generateRequestConfig()
      };
      this._sendRequest(this._serialize(payload));
      return new Promise((function(_this) {
        return function(resolve) {
          if (atom.config.get('autocomplete-python.fuzzyMatcher')) {
            return _this.requests[payload.id] = function(matches) {
              return resolve(_this._fuzzyFilter(matches, prefix));
            };
          } else {
            return _this.requests[payload.id] = resolve;
          }
        };
      })(this));
    },
    getDefinitions: function(editor, bufferPosition) {
      var payload;
      payload = {
        id: this._generateRequestId(editor, bufferPosition),
        lookup: 'definitions',
        path: editor.getPath(),
        source: editor.getText(),
        line: bufferPosition.row,
        column: bufferPosition.column,
        config: this._generateRequestConfig()
      };
      this._sendRequest(this._serialize(payload));
      return new Promise((function(_this) {
        return function(resolve) {
          return _this.requests[payload.id] = resolve;
        };
      })(this));
    },
    goToDefinition: function(editor, bufferPosition) {
      if (!editor) {
        editor = atom.workspace.getActiveTextEditor();
      }
      if (!bufferPosition) {
        bufferPosition = editor.getCursorBufferPosition();
      }
      if (this.definitionsView) {
        this.definitionsView.destroy();
      }
      this.definitionsView = new DefinitionsView();
      return this.getDefinitions(editor, bufferPosition).then((function(_this) {
        return function(results) {
          _this.definitionsView.setItems(results);
          if (results.length === 1) {
            return _this.definitionsView.confirmed(results[0]);
          }
        };
      })(this));
    },
    dispose: function() {
      this.disposables.dispose();
      return this.provider.kill();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXB5dGhvbi9saWIvcHJvdmlkZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJJQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxPQUFxRCxPQUFBLENBQVEsTUFBUixDQUFyRCxFQUFDLGtCQUFBLFVBQUQsRUFBYSwyQkFBQSxtQkFBYixFQUFrQyx1QkFBQSxlQUFsQyxDQUFBOztBQUFBLEVBQ0MsMkJBQTRCLE9BQUEsQ0FBUSxpQkFBUixFQUE1Qix3QkFERCxDQUFBOztBQUFBLEVBRUMsV0FBWSxPQUFBLENBQVEsY0FBUixFQUFaLFFBRkQsQ0FBQTs7QUFBQSxFQUdBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLG9CQUFSLENBSGxCLENBQUE7O0FBQUEsRUFJQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsdUJBQVIsQ0FKcEIsQ0FBQTs7QUFBQSxFQUtBLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUixDQUxOLENBQUE7O0FBQUEsRUFNQSxNQUFBLEdBQVMsTUFOVCxDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLGdCQUFWO0FBQUEsSUFDQSxrQkFBQSxFQUFvQixpREFEcEI7QUFBQSxJQUVBLGlCQUFBLEVBQW1CLENBRm5CO0FBQUEsSUFHQSxrQkFBQSxFQUFvQixDQUhwQjtBQUFBLElBSUEsb0JBQUEsRUFBc0IsS0FKdEI7QUFBQSxJQUtBLFNBQUEsRUFBVyxFQUxYO0FBQUEsSUFPQSxpQkFBQSxFQUFtQixTQUFDLE1BQUQsRUFBUyxTQUFULEVBQW9CLE9BQXBCLEdBQUE7QUFDakIsVUFBQSxzQkFBQTtBQUFBLE1BQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFu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

//# sourceURL=/Users/anas/.atom/packages/autocomplete-python/lib/provider.coffee
