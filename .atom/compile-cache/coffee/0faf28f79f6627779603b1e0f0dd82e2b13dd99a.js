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
      this.mongoOplogURL = atom.config.get('meteor-helper.mongoOplogURL');
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
      console.log('@meteorDetails', this.meteorDetails);
      return this.meteorDetails.parent().css('top', 0).scrollToBottom();
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
