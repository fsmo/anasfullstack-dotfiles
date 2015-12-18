(function() {
  var AskStack, AskStackApiClient, AskStackResultView, AskStackView, CompositeDisposable, TextEditorView, View, url, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  url = require('url');

  CompositeDisposable = require('event-kit').CompositeDisposable;

  _ref = require('atom-space-pen-views'), TextEditorView = _ref.TextEditorView, View = _ref.View;

  AskStack = require('./ask-stack');

  AskStackApiClient = require('./ask-stack-api-client');

  AskStackResultView = require('./ask-stack-result-view');

  module.exports = AskStackView = (function(_super) {
    __extends(AskStackView, _super);

    function AskStackView() {
      return AskStackView.__super__.constructor.apply(this, arguments);
    }

    AskStackView.content = function() {
      return this.div({
        "class": 'ask-stack overlay from-top padded'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'inset-panel'
          }, function() {
            _this.div({
              "class": 'panel-heading'
            }, function() {
              return _this.span('Ask Stack Overflow');
            });
            return _this.div({
              "class": 'panel-body padded'
            }, function() {
              _this.div(function() {
                _this.subview('questionField', new TextEditorView({
                  mini: true,
                  placeholderText: 'Question (eg. Sort array)'
                }));
                _this.subview('tagsField', new TextEditorView({
                  mini: true,
                  placeholderText: 'Language / Tags (eg. Ruby;Rails)'
                }));
                _this.div({
                  "class": 'pull-right'
                }, function() {
                  _this.br();
                  return _this.button({
                    outlet: 'askButton',
                    "class": 'btn btn-primary'
                  }, ' Ask! ');
                });
                return _this.div({
                  "class": 'pull-left'
                }, function() {
                  _this.br();
                  _this.label('Sort by:');
                  _this.br();
                  _this.label({
                    "for": 'relevance',
                    "class": 'radio-label'
                  }, 'Relevance: ');
                  _this.input({
                    outlet: 'sortByRelevance',
                    id: 'relevance',
                    type: 'radio',
                    name: 'sort_by',
                    value: 'relevance',
                    checked: 'checked'
                  });
                  _this.label({
                    "for": 'votes',
                    "class": 'radio-label last'
                  }, 'Votes: ');
                  return _this.input({
                    outlet: 'sortByVote',
                    id: 'votes',
                    type: 'radio',
                    name: 'sort_by',
                    value: 'votes'
                  });
                });
              });
              return _this.div({
                outlet: 'progressIndicator'
              }, function() {
                return _this.span({
                  "class": 'loading loading-spinner-medium'
                });
              });
            });
          });
        };
      })(this));
    };

    AskStackView.prototype.initialize = function(serializeState) {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', 'ask-stack:ask-question', (function(_this) {
        return function() {
          return _this.presentPanel();
        };
      })(this)));
      this.handleEvents();
      this.autoDetectObserveSubscription = atom.config.observe('ask-stack.autoDetectLanguage', (function(_this) {
        return function(autoDetect) {
          if (!autoDetect) {
            return _this.tagsField.setText("");
          }
        };
      })(this));
      return atom.workspace.addOpener(function(uriToOpen) {
        var error, host, pathname, protocol, _ref1;
        try {
          _ref1 = url.parse(uriToOpen), protocol = _ref1.protocol, host = _ref1.host, pathname = _ref1.pathname;
        } catch (_error) {
          error = _error;
          return;
        }
        if (protocol !== 'ask-stack:') {
          return;
        }
        return new AskStackResultView();
      });
    };

    AskStackView.prototype.serialize = function() {};

    AskStackView.prototype.destroy = function() {
      this.hideView();
      return this.detach();
    };

    AskStackView.prototype.hideView = function() {
      this.panel.hide();
      return this.focusout();
    };

    AskStackView.prototype.onDidChangeTitle = function() {};

    AskStackView.prototype.onDidChangeModified = function() {};

    AskStackView.prototype.handleEvents = function() {
      this.askButton.on('click', (function(_this) {
        return function() {
          return _this.askStackRequest();
        };
      })(this));
      this.subscriptions.add(atom.commands.add(this.questionField.element, {
        'core:confirm': (function(_this) {
          return function() {
            return _this.askStackRequest();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.hideView();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add(this.tagsField.element, {
        'core:confirm': (function(_this) {
          return function() {
            return _this.askStackRequest();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.hideView();
          };
        })(this)
      }));
    };

    AskStackView.prototype.presentPanel = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: true
        });
      }
      this.panel.show();
      this.progressIndicator.hide();
      this.questionField.focus();
      if (atom.config.get('ask-stack.autoDetectLanguage')) {
        return this.setLanguageField();
      }
    };

    AskStackView.prototype.askStackRequest = function() {
      this.progressIndicator.show();
      AskStackApiClient.resetInputs();
      AskStackApiClient.question = this.questionField.getText();
      AskStackApiClient.tag = this.tagsField.getText();
      AskStackApiClient.sort_by = this.sortByVote.is(':checked') ? 'votes' : 'relevance';
      return AskStackApiClient.search((function(_this) {
        return function(response) {
          _this.progressIndicator.hide();
          _this.hideView();
          if (response === null) {
            return alert('Encountered a problem with the Stack Exchange API');
          } else {
            return _this.showResults(response);
          }
        };
      })(this));
    };

    AskStackView.prototype.showResults = function(answersJson) {
      var uri;
      uri = 'ask-stack://result-view';
      return atom.workspace.open(uri, {
        split: 'right',
        searchAllPanes: true
      }).done(function(askStackResultView) {
        if (askStackResultView instanceof AskStackResultView) {
          askStackResultView.renderAnswers(answersJson);
          return atom.workspace.activatePreviousPane();
        }
      });
    };

    AskStackView.prototype.setLanguageField = function() {
      var lang;
      lang = this.getCurrentLanguage();
      if (lang === null || lang === 'Null Grammar') {
        return;
      }
      return this.tagsField.setText(lang);
    };

    AskStackView.prototype.getCurrentLanguage = function() {
      var editor;
      editor = atom.workspace.getActiveTextEditor();
      if (editor === void 0) {
        return null;
      } else {
        return editor.getGrammar().name;
      }
    };

    return AskStackView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXNrLXN0YWNrL2xpYi9hc2stc3RhY2stdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUhBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUixDQUFOLENBQUE7O0FBQUEsRUFFQyxzQkFBdUIsT0FBQSxDQUFRLFdBQVIsRUFBdkIsbUJBRkQsQ0FBQTs7QUFBQSxFQUdBLE9BQXlCLE9BQUEsQ0FBUSxzQkFBUixDQUF6QixFQUFDLHNCQUFBLGNBQUQsRUFBaUIsWUFBQSxJQUhqQixDQUFBOztBQUFBLEVBS0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBTFgsQ0FBQTs7QUFBQSxFQU1BLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx3QkFBUixDQU5wQixDQUFBOztBQUFBLEVBT0Esa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHlCQUFSLENBUHJCLENBQUE7O0FBQUEsRUFTQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osbUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsWUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sbUNBQVA7T0FBTCxFQUFpRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUMvQyxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sYUFBUDtXQUFMLEVBQTJCLFNBQUEsR0FBQTtBQUN6QixZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxlQUFQO2FBQUwsRUFBNkIsU0FBQSxHQUFBO3FCQUMzQixLQUFDLENBQUEsSUFBRCxDQUFNLG9CQUFOLEVB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

//# sourceURL=/Users/anas/.atom/packages/ask-stack/lib/ask-stack-view.coffee
