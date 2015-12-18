(function() {
  var $$, AnsiFilter, HeaderView, MessagePanelView, ScriptView, View, linkPaths, stripAnsi, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, $$ = _ref.$$;

  HeaderView = require('./header-view');

  MessagePanelView = require('atom-message-panel').MessagePanelView;

  AnsiFilter = require('ansi-to-html');

  stripAnsi = require('strip-ansi');

  linkPaths = require('./link-paths');

  _ = require('underscore');

  module.exports = ScriptView = (function(_super) {
    __extends(ScriptView, _super);

    function ScriptView() {
      this.setHeaderAndShowExecutionTime = __bind(this.setHeaderAndShowExecutionTime, this);
      this.ansiFilter = new AnsiFilter;
      this.headerView = new HeaderView;
      ScriptView.__super__.constructor.call(this, {
        title: this.headerView,
        rawTitle: true,
        closeMethod: 'destroy'
      });
      this.addClass('script-view');
      linkPaths.listen(this.body);
    }

    ScriptView.prototype.setHeaderAndShowExecutionTime = function(returnCode, executionTime) {
      if ((executionTime != null)) {
        this.display('stdout', '[Finished in ' + executionTime.toString() + 's]');
      } else {
        this.display('stdout');
      }
      if (returnCode === 0) {
        return this.setHeaderStatus('stop');
      } else {
        return this.setHeaderStatus('err');
      }
    };

    ScriptView.prototype.resetView = function(title) {
      if (title == null) {
        title = 'Loading...';
      }
      if (!this.hasParent()) {
        this.attach();
      }
      this.stop();
      this.setHeaderTitle(title);
      this.setHeaderStatus('start');
      return this.clear();
    };

    ScriptView.prototype.removePanel = function() {
      this.stop();
      this.detach();
      return ScriptView.__super__.close.apply(this);
    };

    ScriptView.prototype.close = function() {
      var workspaceView;
      workspaceView = atom.views.getView(atom.workspace);
      return atom.commands.dispatch(workspaceView, 'script:close-view');
    };

    ScriptView.prototype.stop = function() {
      this.display('stdout', '^C');
      return this.setHeaderStatus('kill');
    };

    ScriptView.prototype.createGitHubIssueLink = function(argType, lang) {
      var body, encodedURI, err, title;
      title = "Add " + argType + " support for " + lang;
      body = "##### Platform: `" + process.platform + "`\n---";
      encodedURI = encodeURI("https://github.com/rgbkrk/atom-script/issues/new?title=" + title + "&body=" + body);
      encodedURI = encodedURI.replace(/#/g, '%23');
      err = $$(function() {
        this.p({
          "class": 'block'
        }, "" + argType + " runner not available for " + lang + ".");
        return this.p({
          "class": 'block'
        }, (function(_this) {
          return function() {
            _this.text('If it should exist, add an ');
            _this.a({
              href: encodedURI
            }, 'issue on GitHub');
            return _this.text(', or send your own pull request.');
          };
        })(this));
      });
      return this.handleError(err);
    };

    ScriptView.prototype.showUnableToRunError = function(command) {
      return this.add($$(function() {
        this.h1('Unable to run');
        this.pre(_.escape(command));
        this.h2('Did you start Atom from the command line?');
        this.pre('  atom .');
        this.h2('Is it in your PATH?');
        return this.pre("PATH: " + (_.escape(process.env.PATH)));
      }));
    };

    ScriptView.prototype.showNoLanguageSpecified = function() {
      var err;
      err = $$(function() {
        return this.p('You must select a language in the lower right, or save the file with an appropriate extension.');
      });
      return this.handleError(err);
    };

    ScriptView.prototype.showLanguageNotSupported = function(lang) {
      var err;
      err = $$(function() {
        this.p({
          "class": 'block'
        }, "Command not configured for " + lang + "!");
        return this.p({
          "class": 'block'
        }, (function(_this) {
          return function() {
            _this.text('Add an ');
            _this.a({
              href: "https://github.com/rgbkrk/atom-script/issues/new?title=Add%20support%20for%20" + lang
            }, 'issue on GitHub');
            return _this.text(' or send your own Pull Request.');
          };
        })(this));
      });
      return this.handleError(err);
    };

    ScriptView.prototype.handleError = function(err) {
      this.setHeaderTitle('Error');
      this.setHeaderStatus('err');
      this.add(err);
      return this.stop();
    };

    ScriptView.prototype.setHeaderStatus = function(status) {
      return this.headerView.setStatus(status);
    };

    ScriptView.prototype.setHeaderTitle = function(title) {
      return this.headerView.title.text(title);
    };

    ScriptView.prototype.display = function(css, line) {
      var atEnd, clientHeight, scrollHeight, scrollTop, _ref1;
      if (atom.config.get('script.escapeConsoleOutput')) {
        line = _.escape(line);
      }
      line = this.ansiFilter.toHtml(line);
      line = linkPaths(line);
      _ref1 = this.body[0], clientHeight = _ref1.clientHeight, scrollTop = _ref1.scrollTop, scrollHeight = _ref1.scrollHeight;
      atEnd = scrollTop >= (scrollHeight - clientHeight);
      this.add($$(function() {
        return this.pre({
          "class": "line " + css
        }, (function(_this) {
          return function() {
            return _this.raw(line);
          };
        })(this));
      }));
      if (atom.config.get('script.scrollWithOutput') && atEnd) {
        return this.checkScrollAgain(5)();
      }
    };

    ScriptView.prototype.scrollTimeout = null;

    ScriptView.prototype.checkScrollAgain = function(times) {
      return (function(_this) {
        return function() {
          _this.body.scrollToBottom();
          clearTimeout(_this.scrollTimeout);
          if (times > 1) {
            return _this.scrollTimeout = setTimeout(_this.checkScrollAgain(times - 1), 50);
          }
        };
      })(this);
    };

    ScriptView.prototype.copyResults = function() {
      if (this.results) {
        return atom.clipboard.write(stripAnsi(this.results));
      }
    };

    return ScriptView;

  })(MessagePanelView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9zY3JpcHQtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkZBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxPQUFhLE9BQUEsQ0FBUSxzQkFBUixDQUFiLEVBQUMsWUFBQSxJQUFELEVBQU8sVUFBQSxFQUFQLENBQUE7O0FBQUEsRUFFQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FGYixDQUFBOztBQUFBLEVBR0MsbUJBQW9CLE9BQUEsQ0FBUSxvQkFBUixFQUFwQixnQkFIRCxDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBSmIsQ0FBQTs7QUFBQSxFQUtBLFNBQUEsR0FBWSxPQUFBLENBQVEsWUFBUixDQUxaLENBQUE7O0FBQUEsRUFNQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FOWixDQUFBOztBQUFBLEVBT0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxZQUFSLENBUEosQ0FBQTs7QUFBQSxFQVVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixpQ0FBQSxDQUFBOztBQUFhLElBQUEsb0JBQUEsR0FBQTtBQUNYLDJGQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsR0FBQSxDQUFBLFVBQWQsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxHQUFBLENBQUEsVUFGZCxDQUFBO0FBQUEsTUFJQSw0Q0FBTTtBQUFBLFFBQUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxVQUFSO0FBQUEsUUFBb0IsUUFBQSxFQUFVLElBQTlCO0FBQUEsUUFBb0MsV0FBQSxFQUFhLFNBQWpEO09BQU4sQ0FKQSxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsUUFBRCxDQUFVLGFBQVYsQ0FOQSxDQUFB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

//# sourceURL=/Users/anas/.atom/packages/script/lib/script-view.coffee
