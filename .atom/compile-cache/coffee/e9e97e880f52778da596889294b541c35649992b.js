(function() {
  var $, BufferedProcess, MeteorHelperView, PANE_TITLE_HEIGHT_CLOSE, PANE_TITLE_HEIGHT_OPEN, View, fs, path, velocity, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, $ = _ref.$;

  BufferedProcess = require('atom').BufferedProcess;

  fs = require('fs');

  path = require('path');

  velocity = require('velocity-animate/velocity');

  PANE_TITLE_HEIGHT_CLOSE = 26;

  PANE_TITLE_HEIGHT_OPEN = 150;

  module.exports = MeteorHelperView = (function(_super) {
    __extends(MeteorHelperView, _super);

    function MeteorHelperView() {
      this.paneAddExit = __bind(this.paneAddExit, this);
      this.paneAddErr = __bind(this.paneAddErr, this);
      this.paneAddInfo = __bind(this.paneAddInfo, this);
      this.setMsg = __bind(this.setMsg, this);
      this.forceAppear = __bind(this.forceAppear, this);
      this.toggle = __bind(this.toggle, this);
      this.reset = __bind(this.reset, this);
      this.showHide = __bind(this.showHide, this);
      this.onClick = __bind(this.onClick, this);
      return MeteorHelperView.__super__.constructor.apply(this, arguments);
    }

    MeteorHelperView.process = null;

    MeteorHelperView.content = function() {
      return this.div({
        click: 'onClick',
        "class": 'meteor-helper tool-panel panel-bottom text-smaller'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'panel-heading status-bar tool-panel'
          }, function() {
            _this.div({
              "class": 'status-bar-left pull-left meteor-logo'
            });
            return _this.div({
              outlet: 'meteorStatus',
              "class": 'status-bar-right pull-right'
            }, function() {
              return _this.span({
                "class": 'loading loading-spinner-tiny inline-block'
              });
            });
          });
          return _this.div({
            "class": 'panel-body'
          }, function() {
            return _this.div({
              outlet: 'meteorDetails',
              "class": 'meteor-details'
            });
          });
        };
      })(this));
    };

    MeteorHelperView.prototype.initialize = function(serializeState) {
      this.velocity = velocity.bind(this);
      this.isPaneOpened = false;
      this.paneIconStatus = null;
      atom.commands.add('atom-workspace', {
        'meteor-helper:reset': (function(_this) {
          return function() {
            return _this.reset();
          };
        })(this),
        'meteor-helper:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'meteor-helper:showHide': (function(_this) {
          return function() {
            return _this.showHide();
          };
        })(this)
      });
      return $(window).on('beforeunload', (function(_this) {
        return function() {
          return _this._killMeteor();
        };
      })(this));
    };

    MeteorHelperView.prototype.serialize = function() {};

    MeteorHelperView.prototype.onClick = function(evt) {
      return this.showHide();
    };

    MeteorHelperView.prototype.showHide = function() {
      var height;
      this.isPaneOpened = !this.isPaneOpened;
      height = this.isPaneOpened ? PANE_TITLE_HEIGHT_OPEN : PANE_TITLE_HEIGHT_CLOSE;
      return this.velocity({
        properties: {
          height: height
        },
        options: {
          duration: 100
        }
      });
    };

    MeteorHelperView.prototype._killMeteor = function() {
      var _ref1;
      if ((_ref1 = this.process) != null) {
        _ref1.kill();
      }
      if (this.mongoURL !== '') {
        return;
      }
      return new BufferedProcess({
        command: 'killall',
        args: ['mongod']
      });
    };

    MeteorHelperView.LogFormat = function(str) {
      var css_class, found, pattern, raw, _ref1;
      raw = str.replace(/\033\[[0-9;]*m/g, '');
      pattern = /^([I,W])\d{8}-(\d{2}:\d{2}:\d{2}.\d{3})\(\d\)\?\s(.*)/;
      found = (_ref1 = raw.match(pattern)) != null ? _ref1.slice(1, 4) : void 0;
      if (!found) {
        return raw;
      }
      css_class = found[0] === 'I' ? 'text-info' : 'text-error';
      return "<p><span class='" + css_class + "'>" + found[1] + "</span> " + found[2] + "</p>";
    };

    MeteorHelperView.prototype._displayPane = function() {
      this.paneIconStatus = 'WAITING';
      this.setMsg('Launching Meteor...');
      this.height(PANE_TITLE_HEIGHT_CLOSE);
      this.isPaneOpened = false;
      this.velocity('fadeIn', {
        duration: 100,
        display: 'block'
      });
      return atom.workspace.addBottomPanel({
        item: this
      });
    };

    MeteorHelperView.prototype._getSettings = function() {
      var cnt, err, isCliDefined, isMupPrjCreated, isPrjCreated, isSettingsPathValid, meteor_project_path, mup, mup_project_path, _settingsPath;
      this.meteorAppPath = atom.config.get('meteor-helper.meteorAppPath');
      this.meteorPath = atom.config.get('meteor-helper.meteorPath');
      this.meteorPort = atom.config.get('meteor-helper.meteorPort');
      this.isMeteorProd = atom.config.get('meteor-helper.production');
      this.isMeteorDebug = atom.config.get('meteor-helper.debug');
      this.mongoURL = atom.config.get('meteor-helper.mongoURL');
      this.settingsPath = atom.config.get('meteor-helper.settingsPath');
      isCliDefined = fs.existsSync(this.meteorPath);
      if (!isCliDefined) {
        throw new Error("<h3>Meteor command not found: " + this.meteorPath + "</h3> <p>You can override these settings in this package preference or in a custom mup.json file.</p>");
      }
      mup_project_path = path.join(atom.project.getPaths()[0], 'mup.json');
      isMupPrjCreated = fs.existsSync(mup_project_path);
      if (isMupPrjCreated) {
        try {
          cnt = fs.readFileSync(mup_project_path);
          mup = JSON.parse(cnt);
          if (mup.app != null) {
            this.meteorAppPath = mup.app;
          }
        } catch (_error) {
          err = _error;
          this.paneIconStatus = 'WARNING';
          this.setMsg("<h3>mup.json is corrupted: " + err + ". Default back to current settings.</h3>");
        }
      }
      meteor_project_path = path.join(atom.project.getPaths()[0], this.meteorAppPath, '.meteor');
      isPrjCreated = fs.existsSync(meteor_project_path);
      if (!isPrjCreated) {
        throw new Error("<h3>No Meteor project found in:</h3><br />" + meteor_project_path);
      }
      _settingsPath = this.settingsPath[0] === '/' ? this.settingsPath : path.join(atom.project.getPaths()[0], this.settingsPath);
      isSettingsPathValid = fs.existsSync(_settingsPath);
      if (!isSettingsPathValid) {
        throw new Error("<h3>Unable to locate settings JSON file at: " + this.settingsPath + "</h3><br> <p>Please make sure the file exists, or remove it from settings.</p>");
      }
    };

    MeteorHelperView.prototype._modifyProcessEnv = function() {
      var cnt, err, isMupPrjCreated, mup, mup_project_path, _ref1, _ref2, _ref3;
      process.env.PATH = ("" + process.env.HOME + "/.meteor/tools/") + ("latest/bin:" + process.env.PATH);
      if (this.mongoURL !== '') {
        process.env.MONGO_URL = this.mongoURL;
      } else {
        if (process.env.MONGO_URL != null) {
          delete process.env.MONGO_URL;
        }
      }
      if (this.mongoOplogURL !== '') {
        process.env.MONGO_OPLOG_URL = this.mongoOplogURL;
      } else {
        if (process.env.MONGO_OPLOG_URL != null) {
          delete process.env.MONGO_OPLOG_URL;
        }
      }
      mup_project_path = path.join(atom.project.getPaths()[0], 'mup.json');
      isMupPrjCreated = fs.existsSync(mup_project_path);
      if (isMupPrjCreated) {
        try {
          cnt = fs.readFileSync(mup_project_path);
          mup = JSON.parse(cnt);
          if (((_ref1 = mup.env) != null ? _ref1.MONGO_URL : void 0) != null) {
            process.env.MONGO_URL = mup.env.MONGO_URL;
          }
          if (((_ref2 = mup.env) != null ? _ref2.MONGO_OPLOG_URL : void 0) != null) {
            process.env.MONGO_OPLOG_URL = mup.env.MONGO_OPLOG_URL;
          }
          if (((_ref3 = mup.env) != null ? _ref3.PORT : void 0) != null) {
            return this.meteorPort = mup.env.PORT;
          }
        } catch (_error) {
          err = _error;
          this.paneIconStatus = 'WARNING';
          return this.setMsg("<h3>mup.json is corrupted: " + err + ". Default back to current settings.</h3>");
        }
      }
    };

    MeteorHelperView.prototype.reset = function() {
      var err;
      if (!this.hasParent()) {
        this._displayPane();
      }
      try {
        this._getSettings();
        this._modifyProcessEnv();
        this.setMsg('Project reset.');
        new BufferedProcess({
          command: this.meteorPath,
          args: ['reset'],
          options: {
            cwd: path.join(atom.project.getPaths()[0], this.meteorAppPath),
            env: process.env
          }
        });
        return this.setMsg('Project reset.');
      } catch (_error) {
        err = _error;
        this.paneIconStatus = 'ERROR';
        return this.setMsg(err.message);
      }
    };

    MeteorHelperView.prototype.toggle = function() {
      var args, err;
      if (this.hasParent()) {
        this.velocity('fadeOut', {
          duration: 100
        });
        setTimeout((function(_this) {
          return function() {
            _this.detach();
            return _this._killMeteor();
          };
        })(this), 100);
        return;
      }
      this._displayPane();
      args = [];
      try {
        this._getSettings();
        this._modifyProcessEnv();
        if (this.isMeteorProd) {
          args.push('--production');
        }
        if (this.isMeteorDebug) {
          args.push('debug');
        }
        if (this.meteorPort) {
          args.push('--port', String(this.meteorPort));
        }
        if (this.settingsPath) {
          args.push('--settings', String(this.settingsPath));
        }
        return this.process = new BufferedProcess({
          command: this.meteorPath,
          args: args,
          options: {
            cwd: path.join(atom.project.getPaths()[0], this.meteorAppPath),
            env: process.env
          },
          stdout: this.paneAddInfo,
          stderr: this.paneAddErr,
          exit: this.paneAddExit
        });
      } catch (_error) {
        err = _error;
        this.paneIconStatus = 'ERROR';
        return this.setMsg(err.message);
      }
    };

    MeteorHelperView.prototype.forceAppear = function() {
      this.isPaneOpened = true;
      return this.velocity({
        properties: {
          height: PANE_TITLE_HEIGHT_OPEN
        },
        options: {
          duration: 100
        }
      });
    };

    MeteorHelperView.prototype.setMsg = function(msg, isAppended) {
      if (isAppended == null) {
        isAppended = false;
      }
      switch (this.paneIconStatus) {
        case 'INFO':
          this.meteorStatus.html('<span class="icon-check text-success"></span>');
          break;
        case 'WAITING':
          this.meteorStatus.html('<span class="icon-gear text-highlight faa-spin animated"></span>');
          break;
        default:
          this.meteorStatus.html('<span class="icon-alert faa-flash animated text-warning"></span>');
          this.forceAppear();
      }
      if (isAppended) {
        this.meteorDetails.append(msg);
      } else {
        this.meteorDetails.html(msg);
      }
      return this.meteorDetails.parent().scrollToBottom();
    };

    MeteorHelperView.prototype.PATTERN_METEOR_OK = /App.running.at:|remove.dep|Scan.the.folder|Ensure.dependencies|server.restarted|restarting/;

    MeteorHelperView.prototype.PATTERN_METEOR_ERROR = /[E|e]rror|STDERR|is.crashing|Exited.with.code/;

    MeteorHelperView.prototype.PATTERN_METEOR_UNCHANGED = /I[0-9]/;

    MeteorHelperView.prototype.paneAddInfo = function(outputs) {
      var msg, oldstatus, output, tOuputs, _i, _len, _results;
      tOuputs = outputs.split(/\n|\ {8,}/);
      _results = [];
      for (_i = 0, _len = tOuputs.length; _i < _len; _i++) {
        output = tOuputs[_i];
        if (!(output !== '')) {
          continue;
        }
        oldstatus = this.paneIconStatus;
        this.paneIconStatus = output.match(this.PATTERN_METEOR_OK) ? 'INFO' : output.match(this.PATTERN_METEOR_ERROR) ? 'ERROR' : output.match(this.PATTERN_METEOR_UNCHANGED) ? oldstatus : 'WAITING';
        msg = "<p>" + (MeteorHelperView.LogFormat(output)) + "</p>";
        _results.push(this.setMsg(msg, true));
      }
      return _results;
    };

    MeteorHelperView.prototype.paneAddErr = function(output) {
      var msg;
      msg = "<p class='text-error'>" + (MeteorHelperView.LogFormat(output)) + "</p>";
      this.paneIconStatus = 'ERROR';
      return this.setMsg(msg, true);
    };

    MeteorHelperView.prototype.paneAddExit = function(code) {
      var msg;
      this.process.kill();
      this.process = null;
      msg = "<p class='text-error'>Meteor has exited with status code: " + code + "</p>";
      this.paneIconStatus = 'ERROR';
      return this.setMsg(msg, true);
    };

    return MeteorHelperView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWV0ZW9yLWhlbHBlci9saWIvbWV0ZW9yLWhlbHBlci12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxSEFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLE9BQVksT0FBQSxDQUFRLHNCQUFSLENBQVosRUFBQyxZQUFBLElBQUQsRUFBTyxTQUFBLENBQVAsQ0FBQTs7QUFBQSxFQUNDLGtCQUFtQixPQUFBLENBQVEsTUFBUixFQUFuQixlQURELENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsR0FBVyxPQUFBLENBQVEsMkJBQVIsQ0FKWCxDQUFBOztBQUFBLEVBTUEsdUJBQUEsR0FBMEIsRUFOMUIsQ0FBQTs7QUFBQSxFQU9BLHNCQUFBLEdBQXlCLEdBUHpCLENBQUE7O0FBQUEsRUFTQSxNQUFNLENBQUMsT0FBUCxHQUdNO0FBR0osdUNBQUEsQ0FBQTs7Ozs7Ozs7Ozs7OztLQUFBOztBQUFBLElBQUEsZ0JBQUMsQ0FBQSxPQUFELEdBQVUsSUFBVixDQUFBOztBQUFBLElBS0EsZ0JBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsS0FBQSxFQUFPLFNBQVA7QUFBQSxRQUFrQixPQUFBLEVBQU8sb0RBQXpCO09BQUwsRUFDeUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN2QyxVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxxQ0FBUDtXQUFMLEVBQW1ELFNBQUEsR0FBQTtBQUNqRCxZQUFB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

//# sourceURL=/Users/anas/.atom/packages/meteor-helper/lib/meteor-helper-view.coffee
