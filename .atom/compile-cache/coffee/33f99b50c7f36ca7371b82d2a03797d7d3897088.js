(function() {
  var $, $$$, AskStackApiClient, AskStackResultView, ScrollView, hljs, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$$ = _ref.$$$, ScrollView = _ref.ScrollView;

  AskStackApiClient = require('./ask-stack-api-client');

  hljs = require('highlight.js');

  window.jQuery = $;

  require('./vendor/bootstrap.min.js');

  module.exports = AskStackResultView = (function(_super) {
    __extends(AskStackResultView, _super);

    function AskStackResultView() {
      return AskStackResultView.__super__.constructor.apply(this, arguments);
    }

    AskStackResultView.content = function() {
      return this.div({
        "class": 'ask-stack-result native-key-bindings',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.div({
            id: 'results-view',
            outlet: 'resultsView'
          });
          _this.div({
            id: 'load-more',
            "class": 'load-more',
            click: 'loadMoreResults',
            outlet: 'loadMore'
          }, function() {
            return _this.a({
              href: '#loadmore'
            }, function() {
              return _this.span('Load More...');
            });
          });
          return _this.div({
            id: 'progressIndicator',
            "class": 'progressIndicator',
            outlet: 'progressIndicator'
          }, function() {
            return _this.span({
              "class": 'loading loading-spinner-medium'
            });
          });
        };
      })(this));
    };

    AskStackResultView.prototype.initialize = function() {
      return AskStackResultView.__super__.initialize.apply(this, arguments);
    };

    AskStackResultView.prototype.getTitle = function() {
      return 'Ask Stack Results';
    };

    AskStackResultView.prototype.getURI = function() {
      return 'ask-stack://result-view';
    };

    AskStackResultView.prototype.getIconName = function() {
      return 'three-bars';
    };

    AskStackResultView.prototype.onDidChangeTitle = function() {};

    AskStackResultView.prototype.onDidChangeModified = function() {};

    AskStackResultView.prototype.handleEvents = function() {
      this.subscribe(this, 'core:move-up', (function(_this) {
        return function() {
          return _this.scrollUp();
        };
      })(this));
      return this.subscribe(this, 'core:move-down', (function(_this) {
        return function() {
          return _this.scrollDown();
        };
      })(this));
    };

    AskStackResultView.prototype.renderAnswers = function(answersJson, loadMore) {
      var question, _i, _j, _len, _len1, _ref1, _ref2, _results;
      if (loadMore == null) {
        loadMore = false;
      }
      this.answersJson = answersJson;
      if (!loadMore) {
        this.resultsView.html('');
      }
      if (answersJson['items'].length === 0) {
        return this.html('<br><center>Your search returned no matches.</center>');
      } else {
        _ref1 = answersJson['items'];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          question = _ref1[_i];
          this.renderQuestionHeader(question);
        }
        _ref2 = answersJson['items'];
        _results = [];
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          question = _ref2[_j];
          _results.push(this.renderQuestionBody(question));
        }
        return _results;
      }
    };

    AskStackResultView.prototype.renderQuestionHeader = function(question) {
      var html, questionHeader, title, toggleBtn;
      title = $('<div/>').html(question['title']).text();
      questionHeader = $$$(function() {
        return this.div({
          id: question['question_id'],
          "class": 'ui-result'
        }, (function(_this) {
          return function() {
            _this.h2({
              "class": 'title'
            }, function() {
              _this.a({
                href: question['link'],
                "class": 'underline title-string'
              }, title);
              return _this.div({
                "class": 'score'
              }, function() {
                return _this.p(question['score']);
              });
            });
            _this.div({
              "class": 'created'
            }, function() {
              return _this.text(new Date(question['creation_date'] * 1000).toLocaleString());
            });
            _this.div({
              "class": 'tags'
            }, function() {
              var tag, _i, _len, _ref1, _results;
              _ref1 = question['tags'];
              _results = [];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                tag = _ref1[_i];
                _this.span({
                  "class": 'label label-info'
                }, tag);
                _results.push(_this.text('\n'));
              }
              return _results;
            });
            return _this.div({
              "class": 'collapse-button'
            });
          };
        })(this));
      });
      toggleBtn = $('<button></button>', {
        id: "toggle-" + question['question_id'],
        type: 'button',
        "class": 'btn btn-info btn-xs',
        text: 'Show More'
      });
      toggleBtn.attr('data-toggle', 'collapse');
      toggleBtn.attr('data-target', "#question-body-" + question['question_id']);
      html = $(questionHeader).find('.collapse-button').append(toggleBtn).parent();
      return this.resultsView.append(html);
    };

    AskStackResultView.prototype.renderQuestionBody = function(question) {
      var answer_tab, curAnswer, div, quesId;
      curAnswer = 0;
      quesId = question['question_id'];
      if (question['answer_count'] > 0) {
        answer_tab = "<a href='#prev" + quesId + "'><< Prev</a>   <span id='curAnswer-" + quesId + "'>" + (curAnswer + 1) + "</span>/" + question['answers'].length + "  <a href='#next" + quesId + "'>Next >></a> ";
      } else {
        answer_tab = "<br><b>This question has not been answered.</b>";
      }
      div = $('<div></div>', {
        id: "question-body-" + question['question_id'],
        "class": "collapse hidden"
      });
      div.html("<ul class='nav nav-tabs nav-justified'> <li class='active'><a href='#question-" + quesId + "' data-toggle='tab'>Question</a></li> <li><a href='#answers-" + quesId + "' data-toggle='tab'>Answers</a></li> </ul> <div id='question-body-" + question['question_id'] + "-nav' class='tab-content hidden'> <div class='tab-pane active' id='question-" + quesId + "'>" + question['body'] + "</div> <div class='tab-pane answer-navigation' id='answers-" + quesId + "'> <center>" + answer_tab + "</center> </div> </div>");
      $("#" + quesId).append(div);
      this.highlightCode("question-" + quesId);
      this.addCodeButtons("question-" + quesId);
      if (question['answer_count'] > 0) {
        this.renderAnswerBody(question['answers'][curAnswer], quesId);
        this.setupNavigation(question, curAnswer);
      }
      return $("#toggle-" + quesId).click(function(event) {
        var btn;
        btn = $(this);
        if ($("#question-body-" + quesId).hasClass('in')) {
          $("#question-body-" + quesId).addClass('hidden');
          $("#question-body-" + quesId + "-nav").addClass('hidden');
          btn.parents("#" + quesId).append(btn.parent());
          return $(this).text('Show More');
        } else {
          $("#question-body-" + quesId).removeClass('hidden');
          $("#question-body-" + quesId + "-nav").removeClass('hidden');
          btn.parent().siblings("#question-body-" + quesId).append(btn.parent());
          return btn.text('Show Less');
        }
      });
    };

    AskStackResultView.prototype.renderAnswerBody = function(answer, question_id) {
      var answerHtml;
      answerHtml = $$$(function() {
        return this.div((function(_this) {
          return function() {
            _this.a({
              href: answer['link']
            }, function() {
              return _this.span({
                "class": 'answer-link'
              }, '➚');
            });
            if (answer['is_accepted']) {
              _this.span({
                "class": 'label label-success'
              }, 'Accepted');
            }
            return _this.div({
              "class": 'score answer'
            }, function() {
              return _this.p(answer['score']);
            });
          };
        })(this));
      });
      $("#answers-" + question_id).append($(answerHtml).append(answer['body']));
      this.highlightCode("answers-" + question_id);
      return this.addCodeButtons("answers-" + question_id);
    };

    AskStackResultView.prototype.highlightCode = function(elem_id) {
      var code, codeHl, pre, pres, _i, _len, _results;
      pres = this.resultsView.find("#" + elem_id).find('pre');
      _results = [];
      for (_i = 0, _len = pres.length; _i < _len; _i++) {
        pre = pres[_i];
        code = $(pre).children('code').first();
        if (code !== void 0) {
          codeHl = hljs.highlightAuto(code.text()).value;
          _results.push(code.html(codeHl));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    AskStackResultView.prototype.addCodeButtons = function(elem_id) {
      var btnInsert, pre, pres, _i, _len, _results;
      pres = this.resultsView.find("#" + elem_id).find('pre');
      _results = [];
      for (_i = 0, _len = pres.length; _i < _len; _i++) {
        pre = pres[_i];
        btnInsert = this.genCodeButton('Insert');
        _results.push($(pre).prev().after(btnInsert));
      }
      return _results;
    };

    AskStackResultView.prototype.genCodeButton = function(type) {
      var btn;
      btn = $('<button/>', {
        text: type,
        "class": 'btn btn-default btn-xs'
      });
      if (type === 'Insert') {
        $(btn).click(function(event) {
          var code, editor;
          code = $(this).next('pre').text();
          if (code !== void 0) {
            atom.workspace.activatePreviousPane();
            editor = atom.workspace.getActivePaneItem();
            return editor.insertText(code);
          }
        });
      }
      return btn;
    };

    AskStackResultView.prototype.loadMoreResults = function() {
      if (this.answersJson['has_more']) {
        this.progressIndicator.show();
        this.loadMore.hide();
        AskStackApiClient.page = AskStackApiClient.page + 1;
        return AskStackApiClient.search((function(_this) {
          return function(response) {
            _this.loadMore.show();
            _this.progressIndicator.hide();
            return _this.renderAnswers(response, true);
          };
        })(this));
      } else {
        return $('#load-more').children().children('span').text('No more results to load.');
      }
    };

    AskStackResultView.prototype.setupNavigation = function(question, curAnswer) {
      var quesId;
      quesId = question['question_id'];
      $("a[href='#next" + quesId + "']").click((function(_this) {
        return function(event) {
          if (curAnswer + 1 >= question['answers'].length) {
            curAnswer = 0;
          } else {
            curAnswer += 1;
          }
          $("#answers-" + quesId).children().last().remove();
          $("#curAnswer-" + quesId)[0].innerText = curAnswer + 1;
          return _this.renderAnswerBody(question['answers'][curAnswer], quesId);
        };
      })(this));
      return $("a[href='#prev" + quesId + "']").click((function(_this) {
        return function(event) {
          if (curAnswer - 1 < 0) {
            curAnswer = question['answers'].length - 1;
          } else {
            curAnswer -= 1;
          }
          $("#answers-" + quesId).children().last().remove();
          $("#curAnswer-" + quesId)[0].innerText = curAnswer + 1;
          return _this.renderAnswerBody(question['answers'][curAnswer], quesId);
        };
      })(this));
    };

    return AskStackResultView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXNrLXN0YWNrL2xpYi9hc2stc3RhY2stcmVzdWx0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFFQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUF1QixPQUFBLENBQVEsc0JBQVIsQ0FBdkIsRUFBQyxTQUFBLENBQUQsRUFBSSxXQUFBLEdBQUosRUFBUyxrQkFBQSxVQUFULENBQUE7O0FBQUEsRUFDQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsd0JBQVIsQ0FEcEIsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsY0FBUixDQUZQLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsTUFBUCxHQUFnQixDQUpoQixDQUFBOztBQUFBLEVBS0EsT0FBQSxDQUFRLDJCQUFSLENBTEEsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSix5Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxrQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sc0NBQVA7QUFBQSxRQUErQyxRQUFBLEVBQVUsQ0FBQSxDQUF6RDtPQUFMLEVBQWtFLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDaEUsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxFQUFBLEVBQUksY0FBSjtBQUFBLFlBQW9CLE1BQUEsRUFBUSxhQUE1QjtXQUFMLENBQUEsQ0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsRUFBQSxFQUFJLFdBQUo7QUFBQSxZQUFpQixPQUFBLEVBQU8sV0FBeEI7QUFBQSxZQUFxQyxLQUFBLEVB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

//# sourceURL=/Users/anas/.atom/packages/ask-stack/lib/ask-stack-result-view.coffee
