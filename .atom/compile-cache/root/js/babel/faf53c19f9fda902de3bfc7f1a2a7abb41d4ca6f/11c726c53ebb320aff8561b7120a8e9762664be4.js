Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _decoratorsInclude = require('./decorators/include');

var _decoratorsInclude2 = _interopRequireDefault(_decoratorsInclude);

var _mixinsDecorationManagement = require('./mixins/decoration-management');

var _mixinsDecorationManagement2 = _interopRequireDefault(_mixinsDecorationManagement);

var _adaptersLegacyAdapter = require('./adapters/legacy-adapter');

var _adaptersLegacyAdapter2 = _interopRequireDefault(_adaptersLegacyAdapter);

var _adaptersStableAdapter = require('./adapters/stable-adapter');

var _adaptersStableAdapter2 = _interopRequireDefault(_adaptersStableAdapter);

'use babel';

var nextModelId = 1;

/**
 * The Minimap class is the underlying model of a <MinimapElement>.
 * Most manipulations of the minimap is done through the model.
 *
 * Any Minimap instance is tied to a `TextEditor`.
 * Their lifecycle follow the one of their target `TextEditor`, so they are
 * destroyed whenever their `TextEditor` is destroyed.
 */

var Minimap = (function () {
  /**
   * Creates a new Minimap instance for the given `TextEditor`.
   *
   * @param  {Object} options an object with the new Minimap properties
   * @param  {TextEditor} options.textEditor the target text editor for
   *                                         the minimap
   * @param  {boolean} [options.standAlone] whether this minimap is in
   *                                        stand-alone mode or not
   * @param  {number} [options.width] the minimap width in pixels
   * @param  {number} [options.height] the minimap height in pixels
   * @throws {Error} Cannot create a minimap without an editor
   */

  function Minimap() {
    var _this = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, _Minimap);

    if (!options.textEditor) {
      throw new Error('Cannot create a minimap without an editor');
    }

    /**
     * The Minimap's text editor.
     *
     * @type {TextEditor}
     * @access private
     */
    this.textEditor = options.textEditor;
    /**
     * The stand-alone state of the current Minimap.
     *
     * @type {boolean}
     * @access private
     */
    this.standAlone = options.standAlone;
    /**
     * The width of the current Minimap.
     *
     * @type {number}
     * @access private
     */
    this.width = options.width;
    /**
     * The height of the current Minimap.
     *
     * @type {number}
     * @access private
     */
    this.height = options.height;
    /**
     * The id of the current Minimap.
     *
     * @type {Number}
     * @access private
     */
    this.id = nextModelId++;
    /**
     * The events emitter of the current Minimap.
     *
     * @type {Emitter}
     * @access private
     */
    this.emitter = new _atom.Emitter();
    /**
     * The Minimap's subscriptions.
     *
     * @type {CompositeDisposable}
     * @access private
     */
    this.subscriptions = new _atom.CompositeDisposable();
    /**
     * The adapter object leverage the access to several properties from
     * the `TextEditor`/`TextEditorElement` to support the different APIs
     * between different version of Atom.
     *
     * @type {Object}
     * @access private
     */
    this.adapter = null;
    /**
     * The char height of the current Minimap, will be `undefined` unless
     * `setCharWidth` is called.
     *
     * @type {number}
     * @access private
     */
    this.charHeight = null;
    /**
     * The char height from the package's configuration. Will be overriden
     * by the instance value.
     *
     * @type {number}
     * @access private
     */
    this.configCharHeight = null;
    /**
     * The char width of the current Minimap, will be `undefined` unless
     * `setCharWidth` is called.
     *
     * @type {number}
     * @access private
     */
    this.charWidth = null;
    /**
     * The char width from the package's configuration. Will be overriden
     * by the instance value.
     *
     * @type {number}
     * @access private
     */
    this.configCharWidth = null;
    /**
     * The interline of the current Minimap, will be `undefined` unless
     * `setCharWidth` is called.
     *
     * @type {number}
     * @access private
     */
    this.interline = null;
    /**
     * The interline from the package's configuration. Will be overriden
     * by the instance value.
     *
     * @type {number}
     * @access private
     */
    this.configInterline = null;
    /**
     * A boolean value to store whether this Minimap have been destroyed or not.
     *
     * @type {boolean}
     * @access private
     */
    this.destroyed = false;
    /**
     * A boolean value to store whether the `scrollPastEnd` setting is enabled
     * or not.
     *
     * @type {boolean}
     * @access private
     */
    this.scrollPastEnd = false;

    this.initializeDecorations();

    if (atom.views.getView(this.textEditor).getScrollTop != null) {
      this.adapter = new _adaptersStableAdapter2['default'](this.textEditor);
    } else {
      this.adapter = new _adaptersLegacyAdapter2['default'](this.textEditor);
    }

    if (this.standAlone) {
      /**
       * When in stand-alone mode, a Minimap doesn't scroll and will use this
       * value instead.
       *
       * @type {number}
       * @access private
       */
      this.scrollTop = 0;
    }

    var subs = this.subscriptions;
    subs.add(atom.config.observe('editor.scrollPastEnd', function (scrollPastEnd) {
      _this.scrollPastEnd = scrollPastEnd;
      _this.adapter.scrollPastEnd = _this.scrollPastEnd;
      _this.emitter.emit('did-change-config');
    }));
    subs.add(atom.config.observe('minimap.charHeight', function (configCharHeight) {
      _this.configCharHeight = configCharHeight;
      _this.emitter.emit('did-change-config');
    }));
    subs.add(atom.config.observe('minimap.charWidth', function (configCharWidth) {
      _this.configCharWidth = configCharWidth;
      _this.emitter.emit('did-change-config');
    }));
    subs.add(atom.config.observe('minimap.interline', function (configInterline) {
      _this.configInterline = configInterline;
      _this.emitter.emit('did-change-config');
    }));

    subs.add(this.adapter.onDidChangeScrollTop(function () {
      if (!_this.standAlone) {
        _this.emitter.emit('did-change-scroll-top', _this);
      }
    }));
    subs.add(this.adapter.onDidChangeScrollLeft(function () {
      if (!_this.standAlone) {
        _this.emitter.emit('did-change-scroll-left', _this);
      }
    }));

    subs.add(this.textEditor.onDidChange(function (changes) {
      _this.emitChanges(changes);
    }));
    subs.add(this.textEditor.onDidDestroy(function () {
      _this.destroy();
    }));

    /*
    FIXME Some changes occuring during the tokenization produces
    ranges that deceive the canvas rendering by making some
    lines at the end of the buffer intact while they are in fact not,
    resulting in extra lines appearing at the end of the minimap.
    Forcing a whole repaint to fix that bug is suboptimal but works.
    */
    subs.add(this.textEditor.displayBuffer.onDidTokenize(function () {
      _this.emitter.emit('did-change-config');
    }));
  }

  /**
   * Destroys the model.
   */

  _createClass(Minimap, [{
    key: 'destroy',
    value: function destroy() {
      if (this.destroyed) {
        return;
      }

      this.removeAllDecorations();
      this.subscriptions.dispose();
      this.subscriptions = null;
      this.textEditor = null;
      this.emitter.emit('did-destroy');
      this.emitter.dispose();
      this.destroyed = true;
    }

    /**
     * Returns `true` when this `Minimap` has benn destroyed.
     *
     * @return {boolean} whether this Minimap has been destroyed or not
     */
  }, {
    key: 'isDestroyed',
    value: function isDestroyed() {
      return this.destroyed;
    }

    /**
     * Registers an event listener to the `did-change` event.
     *
     * @param  {function(event:Object):void} callback a function to call when the
     *                                                event is triggered.
     *                                                the callback will be called
     *                                                with an event object with
     *                                                the following properties:
     * - start: The change's start row number
     * - end: The change's end row number
     * - screenDelta: the delta in buffer rows between the versions before and
     *   after the change
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChange',
    value: function onDidChange(callback) {
      return this.emitter.on('did-change', callback);
    }

    /**
     * Registers an event listener to the `did-change-config` event.
     *
     * @param  {function():void} callback a function to call when the event
     *                                    is triggered.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeConfig',
    value: function onDidChangeConfig(callback) {
      return this.emitter.on('did-change-config', callback);
    }

    /**
     * Registers an event listener to the `did-change-scroll-top` event.
     *
     * The event is dispatched when the text editor `scrollTop` value have been
     * changed or when the minimap scroll top have been changed in stand-alone
     * mode.
     *
     * @param  {function(minimap:Minimap):void} callback a function to call when
     *                                                   the event is triggered.
     *                                                   The current Minimap is
     *                                                   passed as argument to
     *                                                   the callback.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeScrollTop',
    value: function onDidChangeScrollTop(callback) {
      return this.emitter.on('did-change-scroll-top', callback);
    }

    /**
     * Registers an event listener to the `did-change-scroll-left` event.
     *
     * @param  {function(minimap:Minimap):void} callback a function to call when
     *                                                   the event is triggered.
     *                                                   The current Minimap is
     *                                                   passed as argument to
     *                                                   the callback.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeScrollLeft',
    value: function onDidChangeScrollLeft(callback) {
      return this.emitter.on('did-change-scroll-left', callback);
    }

    /**
     * Registers an event listener to the `did-change-stand-alone` event.
     *
     * This event is dispatched when the stand-alone of the current Minimap
     * is either enabled or disabled.
     *
     * @param  {function(minimap:Minimap):void} callback a function to call when
     *                                                   the event is triggered.
     *                                                   The current Minimap is
     *                                                   passed as argument to
     *                                                   the callback.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeStandAlone',
    value: function onDidChangeStandAlone(callback) {
      return this.emitter.on('did-change-stand-alone', callback);
    }

    /**
     * Registers an event listener to the `did-destroy` event.
     *
     * This event is dispatched when this Minimap have been destroyed. It can
     * occurs either because the {@link destroy} method have been called on the
     * Minimap or because the target text editor have been destroyed.
     *
     * @param  {function():void} callback a function to call when the event
     *                                    is triggered.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }

    /**
     * Returns `true` when the current Minimap is a stand-alone minimap.
     *
     * @return {boolean} whether this Minimap is in stand-alone mode or not.
     */
  }, {
    key: 'isStandAlone',
    value: function isStandAlone() {
      return this.standAlone;
    }

    /**
     * Sets the stand-alone mode for this minimap.
     *
     * @param {boolean} standAlone the new state of the stand-alone mode for this
     *                             Minimap
     * @emits {did-change-stand-alone} if the stand-alone mode have been toggled
     *        on or off by the call
     */
  }, {
    key: 'setStandAlone',
    value: function setStandAlone(standAlone) {
      if (standAlone !== this.standAlone) {
        this.standAlone = standAlone;
        this.emitter.emit('did-change-stand-alone', this);
      }
    }

    /**
     * Returns the `TextEditor` that this minimap represents.
     *
     * @return {TextEditor} this Minimap's text editor
     */
  }, {
    key: 'getTextEditor',
    value: function getTextEditor() {
      return this.textEditor;
    }

    /**
     * Returns the height of the `TextEditor` at the Minimap scale.
     *
     * @return {number} the scaled height of the text editor
     */
  }, {
    key: 'getTextEditorScaledHeight',
    value: function getTextEditorScaledHeight() {
      return this.adapter.getHeight() * this.getVerticalScaleFactor();
    }

    /**
     * Returns the `TextEditor` scroll top value at the Minimap scale.
     *
     * @return {number} the scaled scroll top of the text editor
     */
  }, {
    key: 'getTextEditorScaledScrollTop',
    value: function getTextEditorScaledScrollTop() {
      return this.adapter.getScrollTop() * this.getVerticalScaleFactor();
    }

    /**
     * Returns the `TextEditor` scroll left value at the Minimap scale.
     *
     * @return {number} the scaled scroll left of the text editor
     */
  }, {
    key: 'getTextEditorScaledScrollLeft',
    value: function getTextEditorScaledScrollLeft() {
      return this.adapter.getScrollLeft() * this.getHorizontalScaleFactor();
    }

    /**
     * Returns the `TextEditor` maximum scroll top value.
     *
     * When the `scrollPastEnd` setting is enabled, the method compensate the
     * extra scroll by removing the same height as added by the editor from the
     * final value.
     *
     * @return {number} the maximum scroll top of the text editor
     */
  }, {
    key: 'getTextEditorMaxScrollTop',
    value: function getTextEditorMaxScrollTop() {
      return this.adapter.getMaxScrollTop();
    }

    /**
     * Returns the `TextEditor` scroll top value.
     *
     * @return {number} the scroll top of the text editor
     */
  }, {
    key: 'getTextEditorScrollTop',
    value: function getTextEditorScrollTop() {
      return this.adapter.getScrollTop();
    }

    /**
     * Sets the scroll top of the `TextEditor`.
     *
     * @param {number} scrollTop the new scroll top value
     */
  }, {
    key: 'setTextEditorScrollTop',
    value: function setTextEditorScrollTop(scrollTop) {
      this.adapter.setScrollTop(scrollTop);
    }

    /**
     * Returns the `TextEditor` scroll left value.
     *
     * @return {number} the scroll left of the text editor
     */
  }, {
    key: 'getTextEditorScrollLeft',
    value: function getTextEditorScrollLeft() {
      return this.adapter.getScrollLeft();
    }

    /**
     * Returns the height of the `TextEditor`.
     *
     * @return {number} the height of the text editor
     */
  }, {
    key: 'getTextEditorHeight',
    value: function getTextEditorHeight() {
      return this.adapter.getHeight();
    }

    /**
     * Returns the `TextEditor` scroll as a value normalized between `0` and `1`.
     *
     * When the `scrollPastEnd` setting is enabled the value may exceed `1` as the
     * maximum scroll value used to compute this ratio compensate for the extra
     * height in the editor. **Use {@link getCapedTextEditorScrollRatio} when
     * you need a value that is strictly between `0` and `1`.**
     *
     * @return {number} the scroll ratio of the text editor
     */
  }, {
    key: 'getTextEditorScrollRatio',
    value: function getTextEditorScrollRatio() {
      return this.adapter.getScrollTop() / (this.getTextEditorMaxScrollTop() || 1);
    }

    /**
     * Returns the `TextEditor` scroll as a value normalized between `0` and `1`.
     *
     * The returned value will always be strictly between `0` and `1`.
     *
     * @return {number} the scroll ratio of the text editor strictly between
     *                  0 and 1
     */
  }, {
    key: 'getCapedTextEditorScrollRatio',
    value: function getCapedTextEditorScrollRatio() {
      return Math.min(1, this.getTextEditorScrollRatio());
    }

    /**
     * Returns the height of the whole minimap in pixels based on the `minimap`
     * settings.
     *
     * @return {number} the height of the minimap
     */
  }, {
    key: 'getHeight',
    value: function getHeight() {
      return this.textEditor.getScreenLineCount() * this.getLineHeight();
    }

    /**
     * Returns the width of the whole minimap in pixels based on the `minimap`
     * settings.
     *
     * @return {number} the width of the minimap
     */
  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this.textEditor.getMaxScreenLineLength() * this.getCharWidth();
    }

    /**
     * Returns the height the Minimap content will take on screen.
     *
     * When the Minimap height is greater than the `TextEditor` height, the
     * `TextEditor` height is returned instead.
     *
     * @return {number} the visible height of the Minimap
     */
  }, {
    key: 'getVisibleHeight',
    value: function getVisibleHeight() {
      return Math.min(this.getScreenHeight(), this.getHeight());
    }

    /**
     * Returns the height the minimap should take once displayed, it's either
     * the height of the `TextEditor` or the provided `height` when in stand-alone
     * mode.
     *
     * @return {number} the total height of the Minimap
     */
  }, {
    key: 'getScreenHeight',
    value: function getScreenHeight() {
      if (this.isStandAlone()) {
        if (this.height != null) {
          return this.height;
        } else {
          return this.getHeight();
        }
      } else {
        return this.adapter.getHeight();
      }
    }

    /**
     * Returns the width the whole Minimap will take on screen.
     *
     * @return {number} the width of the Minimap when displayed
     */
  }, {
    key: 'getVisibleWidth',
    value: function getVisibleWidth() {
      return Math.min(this.getScreenWidth(), this.getWidth());
    }

    /**
     * Returns the width the Minimap should take once displayed, it's either the
     * width of the Minimap content or the provided `width` when in standAlone
     * mode.
     *
     * @return {number} the Minimap screen width
     */
  }, {
    key: 'getScreenWidth',
    value: function getScreenWidth() {
      if (this.isStandAlone() && this.width != null) {
        return this.width;
      } else {
        return this.getWidth();
      }
    }

    /**
     * Sets the preferred height and width when in stand-alone mode.
     *
     * This method is called by the <MinimapElement> for this Minimap so that
     * the model is kept in sync with the view.
     *
     * @param {number} height the new height of the Minimap
     * @param {number} width the new width of the Minimap
     */
  }, {
    key: 'setScreenHeightAndWidth',
    value: function setScreenHeightAndWidth(height, width) {
      this.height = height;
      this.width = width;
    }

    /**
     * Returns the vertical scaling factor when converting coordinates from the
     * `TextEditor` to the Minimap.
     *
     * @return {number} the Minimap vertical scaling factor
     */
  }, {
    key: 'getVerticalScaleFactor',
    value: function getVerticalScaleFactor() {
      return this.getLineHeight() / this.textEditor.getLineHeightInPixels();
    }

    /**
     * Returns the horizontal scaling factor when converting coordinates from the
     * `TextEditor` to the Minimap.
     *
     * @return {number} the Minimap horizontal scaling factor
     */
  }, {
    key: 'getHorizontalScaleFactor',
    value: function getHorizontalScaleFactor() {
      return this.getCharWidth() / this.textEditor.getDefaultCharWidth();
    }

    /**
     * Returns the height of a line in the Minimap in pixels.
     *
     * @return {number} a line's height in the Minimap
     */
  }, {
    key: 'getLineHeight',
    value: function getLineHeight() {
      return this.getCharHeight() + this.getInterline();
    }

    /**
     * Returns the width of a character in the Minimap in pixels.
     *
     * @return {number} a character's width in the Minimap
     */
  }, {
    key: 'getCharWidth',
    value: function getCharWidth() {
      if (this.charWidth != null) {
        return this.charWidth;
      } else {
        return this.configCharWidth;
      }
    }

    /**
     * Sets the char width for this Minimap. This value will override the
     * value from the config for this instance only. A `did-change-config`
     * event is dispatched.
     *
     * @param {number} charWidth the new width of a char in the Minimap
     * @emits {did-change-config} when the value is changed
     */
  }, {
    key: 'setCharWidth',
    value: function setCharWidth(charWidth) {
      this.charWidth = Math.floor(charWidth);
      this.emitter.emit('did-change-config');
    }

    /**
     * Returns the height of a character in the Minimap in pixels.
     *
     * @return {number} a character's height in the Minimap
     */
  }, {
    key: 'getCharHeight',
    value: function getCharHeight() {
      if (this.charHeight != null) {
        return this.charHeight;
      } else {
        return this.configCharHeight;
      }
    }

    /**
     * Sets the char height for this Minimap. This value will override the
     * value from the config for this instance only. A `did-change-config`
     * event is dispatched.
     *
     * @param {number} charHeight the new height of a char in the Minimap
     * @emits {did-change-config} when the value is changed
     */
  }, {
    key: 'setCharHeight',
    value: function setCharHeight(charHeight) {
      this.charHeight = Math.floor(charHeight);
      this.emitter.emit('did-change-config');
    }

    /**
     * Returns the height of an interline in the Minimap in pixels.
     *
     * @return {number} the interline's height in the Minimap
     */
  }, {
    key: 'getInterline',
    value: function getInterline() {
      if (this.interline != null) {
        return this.interline;
      } else {
        return this.configInterline;
      }
    }

    /**
     * Sets the interline height for this Minimap. This value will override the
     * value from the config for this instance only. A `did-change-config`
     * event is dispatched.
     *
     * @param {number} interline the new height of an interline in the Minimap
     * @emits {did-change-config} when the value is changed
     */
  }, {
    key: 'setInterline',
    value: function setInterline(interline) {
      this.interline = Math.floor(interline);
      this.emitter.emit('did-change-config');
    }

    /**
     * Returns the index of the first visible row in the Minimap.
     *
     * @return {number} the index of the first visible row
     */
  }, {
    key: 'getFirstVisibleScreenRow',
    value: function getFirstVisibleScreenRow() {
      return Math.floor(this.getScrollTop() / this.getLineHeight());
    }

    /**
     * Returns the index of the last visible row in the Minimap.
     *
     * @return {number} the index of the last visible row
     */
  }, {
    key: 'getLastVisibleScreenRow',
    value: function getLastVisibleScreenRow() {
      return Math.ceil((this.getScrollTop() + this.getScreenHeight()) / this.getLineHeight());
    }

    /**
     * Returns the current scroll of the Minimap.
     *
     * The Minimap can scroll only when its height is greater that the height
     * of its `TextEditor`.
     *
     * @return {number} the scroll top of the Minimap
     */
  }, {
    key: 'getScrollTop',
    value: function getScrollTop() {
      if (this.standAlone) {
        return this.scrollTop;
      } else {
        return Math.abs(this.getCapedTextEditorScrollRatio() * this.getMaxScrollTop());
      }
    }

    /**
     * Sets the minimap scroll top value when in stand-alone mode.
     *
     * @param {number} scrollTop the new scroll top for the Minimap
     * @emits {did-change-scroll-top} if the Minimap's stand-alone mode is enabled
     */
  }, {
    key: 'setScrollTop',
    value: function setScrollTop(scrollTop) {
      this.scrollTop = scrollTop;
      if (this.standAlone) {
        this.emitter.emit('did-change-scroll-top', this);
      }
    }

    /**
     * Returns the maximum scroll value of the Minimap.
     *
     * @return {number} the maximum scroll top for the Minimap
     */
  }, {
    key: 'getMaxScrollTop',
    value: function getMaxScrollTop() {
      return Math.max(0, this.getHeight() - this.getScreenHeight());
    }

    /**
     * Returns `true` when the Minimap can scroll.
     *
     * @return {boolean} whether this Minimap can scroll or not
     */
  }, {
    key: 'canScroll',
    value: function canScroll() {
      return this.getMaxScrollTop() > 0;
    }

    /**
     * Delegates to `TextEditor#getMarker`.
     *
     * @access private
     */
  }, {
    key: 'getMarker',
    value: function getMarker(id) {
      return this.textEditor.getMarker(id);
    }

    /**
     * Delegates to `TextEditor#findMarkers`.
     *
     * @access private
     */
  }, {
    key: 'findMarkers',
    value: function findMarkers(o) {
      try {
        return this.textEditor.findMarkers(o);
      } catch (error) {
        return [];
      }
    }

    /**
     * Delegates to `TextEditor#markBufferRange`.
     *
     * @access private
     */
  }, {
    key: 'markBufferRange',
    value: function markBufferRange(range) {
      return this.textEditor.markBufferRange(range);
    }

    /**
     * Emits a change events with the passed-in changes as data.
     *
     * @param  {Object} changes a change to dispatch
     * @access private
     */
  }, {
    key: 'emitChanges',
    value: function emitChanges(changes) {
      this.emitter.emit('did-change', changes);
    }

    /**
     * Enables the cache at the adapter level to avoid consecutive access to the
     * text editor API during a render phase.
     *
     * @access private
     */
  }, {
    key: 'enableCache',
    value: function enableCache() {
      this.adapter.enableCache();
    }

    /**
     * Disable the adapter cache.
     *
     * @access private
     */
  }, {
    key: 'clearCache',
    value: function clearCache() {
      this.adapter.clearCache();
    }
  }]);

  var _Minimap = Minimap;
  Minimap = (0, _decoratorsInclude2['default'])(_mixinsDecorationManagement2['default'])(Minimap) || Minimap;
  return Minimap;
})();

exports['default'] = Minimap;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21pbmltYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFMkMsTUFBTTs7aUNBQzdCLHNCQUFzQjs7OzswQ0FDVCxnQ0FBZ0M7Ozs7cUNBQ3hDLDJCQUEyQjs7OztxQ0FDMUIsMkJBQTJCOzs7O0FBTnJELFdBQVcsQ0FBQTs7QUFRWCxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUE7Ozs7Ozs7Ozs7O0lBV0UsT0FBTzs7Ozs7Ozs7Ozs7Ozs7QUFhZCxXQWJPLE9BQU8sR0FhQzs7O1FBQWQsT0FBTyx5REFBRyxFQUFFOzs7O0FBQ3ZCLFFBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO0FBQ3ZCLFlBQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQTtLQUM3RDs7Ozs7Ozs7QUFRRCxRQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUE7Ozs7Ozs7QUFPcEMsUUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFBOzs7Ozs7O0FBT3BDLFFBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQTs7Ozs7OztBQU8xQixRQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUE7Ozs7Ozs7QUFPNUIsUUFBSSxDQUFDLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQTs7Ozs7OztBQU92QixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7Ozs7Ozs7QUFPNUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7Ozs7Ozs7O0FBUzlDLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBOzs7Ozs7OztBQVFuQixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQTs7Ozs7Ozs7QUFRdEIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQTs7Ozs7Ozs7QUFRNUIsUUFBSSxDQUFDLFNB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RSxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFBO0tBQzlEOzs7Ozs7Ozs7V0FPUyxxQkFBRztBQUFFLGFBQU8sSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUMsQ0FBQTtLQUFFOzs7Ozs7Ozs7V0FPeEMsbUJBQUMsRUFBRSxFQUFFO0FBQUUsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtLQUFFOzs7Ozs7Ozs7V0FPM0MscUJBQUMsQ0FBQyxFQUFFO0FBQ2QsVUFBSTtBQUNGLGVBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUE7T0FDdEMsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLGVBQU8sRUFBRSxDQUFBO09BQ1Y7S0FDRjs7Ozs7Ozs7O1dBT2UseUJBQUMsS0FBSyxFQUFFO0FBQUUsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUFFOzs7Ozs7Ozs7O1dBUTdELHFCQUFDLE9BQU8sRUFBRTtBQUFFLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQTtLQUFFOzs7Ozs7Ozs7O1dBUXRELHVCQUFHO0FBQUUsVUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQTtLQUFFOzs7Ozs7Ozs7V0FPbEMsc0JBQUc7QUFBRSxVQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFBO0tBQUU7OztpQkEvdUJ4QixPQUFPO0FBQVAsU0FBTyxHQUQzQiw0RUFBNkIsQ0FDVCxPQUFPLEtBQVAsT0FBTztTQUFQLE9BQU87OztxQkFBUCxPQUFPIiwiZmlsZSI6Ii9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21pbmltYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0VtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQgaW5jbHVkZSBmcm9tICcuL2RlY29yYXRvcnMvaW5jbHVkZSdcbmltcG9ydCBEZWNvcmF0aW9uTWFuYWdlbWVudCBmcm9tICcuL21peGlucy9kZWNvcmF0aW9uLW1hbmFnZW1lbnQnXG5pbXBvcnQgTGVnYWN5QWRhdGVyIGZyb20gJy4vYWRhcHRlcnMvbGVnYWN5LWFkYXB0ZXInXG5pbXBvcnQgU3RhYmxlQWRhcHRlciBmcm9tICcuL2FkYXB0ZXJzL3N0YWJsZS1hZGFwdGVyJ1xuXG5sZXQgbmV4dE1vZGVsSWQgPSAxXG5cbi8qKlxuICogVGhlIE1pbmltYXAgY2xhc3MgaXMgdGhlIHVuZGVybHlpbmcgbW9kZWwgb2YgYSA8TWluaW1hcEVsZW1lbnQ+LlxuICogTW9zdCBtYW5pcHVsYXRpb25zIG9mIHRoZSBtaW5pbWFwIGlzIGRvbmUgdGhyb3VnaCB0aGUgbW9kZWwuXG4gKlxuICogQW55IE1pbmltYXAgaW5zdGFuY2UgaXMgdGllZCB0byBhIGBUZXh0RWRpdG9yYC5cbiAqIFRoZWlyIGxpZmVjeWNsZSBmb2xsb3cgdGhlIG9uZSBvZiB0aGVpciB0YXJnZXQgYFRleHRFZGl0b3JgLCBzbyB0aGV5IGFyZVxuICogZGVzdHJveWVkIHdoZW5ldmVyIHRoZWlyIGBUZXh0RWRpdG9yYCBpcyBkZXN0cm95ZWQuXG4gKi9cbkBpbmNsdWRlKERlY29yYXRpb25NYW5hZ2VtZW50KVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWluaW1hcCB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IE1pbmltYXAgaW5zdGFuY2UgZm9yIHRoZSBnaXZlbiBgVGV4dEVkaXRvcmAuXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyBhbiBvYmplY3Qgd2l0aCB0aGUgbmV3IE1pbmltYXAgcHJvcGVydGllc1xuICAgKiBAcGFyYW0gIHtUZXh0RWRpdG9yfSBvcHRpb25zLnRleHRFZGl0b3IgdGhlIHRhcmdldCB0ZXh0IGVkaXRvciBmb3JcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBtaW5pbWFwXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IFtvcHRpb25zLnN0YW5kQWxvbmVdIHdoZXRoZXIgdGhpcyBtaW5pbWFwIGlzIGluXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kLWFsb25lIG1vZGUgb3Igbm90XG4gICAqIEBwYXJhbSAge251bWJlcn0gW29wdGlvbnMud2lkdGhdIHRoZSBtaW5pbWFwIHdpZHRoIGluIHBpeGVsc1xuICAgKiBAcGFyYW0gIHtudW1iZXJ9IFtvcHRpb25zLmhlaWdodF0gdGhlIG1pbmltYXAgaGVpZ2h0IGluIHBpeGVsc1xuICAgKiBAdGhyb3dzIHtFcnJvcn0gQ2Fubm90IGNyZWF0ZSBhIG1pbmltYXAgd2l0aG91dCBhbiBlZGl0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yIChvcHRpb25zID0ge30pIHtcbiAgICBpZiAoIW9wdGlvbnMudGV4dEVkaXRvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIGEgbWluaW1hcCB3aXRob3V0IGFuIGVkaXRvcicpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIE1pbmltYXAncyB0ZXh0IGVkaXRvci5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtUZXh0RWRpdG9yfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMudGV4dEVkaXRvciA9IG9wdGlvbnMudGV4dEVkaXRvclxuICAgIC8qKlxuICAgICAqIFRoZSBzdGFuZC1hbG9uZSBzdGF0ZSBvZiB0aGUgY3VycmVudCBNaW5pbWFwLlxuICAgICAqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5zdGFuZEFsb25lID0gb3B0aW9ucy5zdGFuZEFsb25lXG4gICAgLyoqXG4gICAgICogVGhlIHdpZHRoIG9mIHRoZSBjdXJyZW50IE1pbmltYXAuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMud2lkdGggPSBvcHRpb25zLndpZHRoXG4gICAgLyoqXG4gICAgICogVGhlIGhlaWdodCBvZiB0aGUgY3VycmVudCBNaW5pbWFwLlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0XG4gICAgLyoqXG4gICAgICogVGhlIGlkIG9mIHRoZSBjdXJyZW50IE1pbmltYXAuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuaWQgPSBuZXh0TW9kZWxJZCsrXG4gICAgLyoqXG4gICAgICogVGhlIGV2ZW50cyBlbWl0dGVyIG9mIHRoZSBjdXJyZW50IE1pbmltYXAuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7RW1pdHRlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgLyoqXG4gICAgICogVGhlIE1pbmltYXAncyBzdWJzY3JpcHRpb25zLlxuICAgICAqXG4gICAgICogQHR5cGUge0NvbXBvc2l0ZURpc3Bvc2FibGV9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIC8qKlxuICAgICAqIFRoZSBhZGFwdGVyIG9iamVjdCBsZXZlcmFnZSB0aGUgYWNjZXNzIHRvIHNldmVyYWwgcHJvcGVydGllcyBmcm9tXG4gICAgICogdGhlIGBUZXh0RWRpdG9yYC9gVGV4dEVkaXRvckVsZW1lbnRgIHRvIHN1cHBvcnQgdGhlIGRpZmZlcmVudCBBUElzXG4gICAgICogYmV0d2VlbiBkaWZmZXJlbnQgdmVyc2lvbiBvZiBBdG9tLlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmFkYXB0ZXIgPSBudWxsXG4gICAgLyoqXG4gICAgICogVGhlIGNoYXIgaGVpZ2h0IG9mIHRoZSBjdXJyZW50IE1pbmltYXAsIHdpbGwgYmUgYHVuZGVmaW5lZGAgdW5sZXNzXG4gICAgICogYHNldENoYXJXaWR0aGAgaXMgY2FsbGVkLlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNoYXJIZWlnaHQgPSBudWxsXG4gICAgLyoqXG4gICAgICogVGhlIGNoYXIgaGVpZ2h0IGZyb20gdGhlIHBhY2thZ2UncyBjb25maWd1cmF0aW9uLiBXaWxsIGJlIG92ZXJyaWRlblxuICAgICAqIGJ5IHRoZSBpbnN0YW5jZSB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5jb25maWdDaGFySGVpZ2h0ID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBjaGFyIHdpZHRoIG9mIHRoZSBjdXJyZW50IE1pbmltYXAsIHdpbGwgYmUgYHVuZGVmaW5lZGAgdW5sZXNzXG4gICAgICogYHNldENoYXJXaWR0aGAgaXMgY2FsbGVkLlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNoYXJXaWR0aCA9IG51bGxcbiAgICAvKipcbiAgICAgKiBUaGUgY2hhciB3aWR0aCBmcm9tIHRoZSBwYWNrYWdlJ3MgY29uZmlndXJhdGlvbi4gV2lsbCBiZSBvdmVycmlkZW5cbiAgICAgKiBieSB0aGUgaW5zdGFuY2UgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuY29uZmlnQ2hhcldpZHRoID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBpbnRlcmxpbmUgb2YgdGhlIGN1cnJlbnQgTWluaW1hcCwgd2lsbCBiZSBgdW5kZWZpbmVkYCB1bmxlc3NcbiAgICAgKiBgc2V0Q2hhcldpZHRoYCBpcyBjYWxsZWQuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuaW50ZXJsaW5lID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBpbnRlcmxpbmUgZnJvbSB0aGUgcGFja2FnZSdzIGNvbmZpZ3VyYXRpb24uIFdpbGwgYmUgb3ZlcnJpZGVuXG4gICAgICogYnkgdGhlIGluc3RhbmNlIHZhbHVlLlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNvbmZpZ0ludGVybGluZSA9IG51bGxcbiAgICAvKipcbiAgICAgKiBBIGJvb2xlYW4gdmFsdWUgdG8gc3RvcmUgd2hldGhlciB0aGlzIE1pbmltYXAgaGF2ZSBiZWVuIGRlc3Ryb3llZCBvciBub3QuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmRlc3Ryb3llZCA9IGZhbHNlXG4gICAgLyoqXG4gICAgICogQSBib29sZWFuIHZhbHVlIHRvIHN0b3JlIHdoZXRoZXIgdGhlIGBzY3JvbGxQYXN0RW5kYCBzZXR0aW5nIGlzIGVuYWJsZWRcbiAgICAgKiBvciBub3QuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnNjcm9sbFBhc3RFbmQgPSBmYWxzZVxuXG4gICAgdGhpcy5pbml0aWFsaXplRGVjb3JhdGlvbnMoKVxuXG4gICAgaWYgKGF0b20udmlld3MuZ2V0Vmlldyh0aGlzLnRleHRFZGl0b3IpLmdldFNjcm9sbFRvcCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmFkYXB0ZXIgPSBuZXcgU3RhYmxlQWRhcHRlcih0aGlzLnRleHRFZGl0b3IpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWRhcHRlciA9IG5ldyBMZWdhY3lBZGF0ZXIodGhpcy50ZXh0RWRpdG9yKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YW5kQWxvbmUpIHtcbiAgICAgIC8qKlxuICAgICAgICogV2hlbiBpbiBzdGFuZC1hbG9uZSBtb2RlLCBhIE1pbmltYXAgZG9lc24ndCBzY3JvbGwgYW5kIHdpbGwgdXNlIHRoaXNcbiAgICAgICAqIHZhbHVlIGluc3RlYWQuXG4gICAgICAgKlxuICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAgICovXG4gICAgICB0aGlzLnNjcm9sbFRvcCA9IDBcbiAgICB9XG5cbiAgICBsZXQgc3VicyA9IHRoaXMuc3Vic2NyaXB0aW9uc1xuICAgIHN1YnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2VkaXRvci5zY3JvbGxQYXN0RW5kJywgKHNjcm9sbFBhc3RFbmQpID0+IHtcbiAgICAgIHRoaXMuc2Nyb2xsUGFzdEVuZCA9IHNjcm9sbFBhc3RFbmRcbiAgICAgIHRoaXMuYWRhcHRlci5zY3JvbGxQYXN0RW5kID0gdGhpcy5zY3JvbGxQYXN0RW5kXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb25maWcnKVxuICAgIH0pKVxuICAgIHN1YnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ21pbmltYXAuY2hhckhlaWdodCcsIChjb25maWdDaGFySGVpZ2h0KSA9PiB7XG4gICAgICB0aGlzLmNvbmZpZ0NoYXJIZWlnaHQgPSBjb25maWdDaGFySGVpZ2h0XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb25maWcnKVxuICAgIH0pKVxuICAgIHN1YnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ21pbmltYXAuY2hhcldpZHRoJywgKGNvbmZpZ0NoYXJXaWR0aCkgPT4ge1xuICAgICAgdGhpcy5jb25maWdDaGFyV2lkdGggPSBjb25maWdDaGFyV2lkdGhcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gICAgfSkpXG4gICAgc3Vicy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbWluaW1hcC5pbnRlcmxpbmUnLCAoY29uZmlnSW50ZXJsaW5lKSA9PiB7XG4gICAgICB0aGlzLmNvbmZpZ0ludGVybGluZSA9IGNvbmZpZ0ludGVybGluZVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtY29uZmlnJylcbiAgICB9KSlcblxuICAgIHN1YnMuYWRkKHRoaXMuYWRhcHRlci5vbkRpZENoYW5nZVNjcm9sbFRvcCgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuc3RhbmRBbG9uZSkge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1zY3JvbGwtdG9wJywgdGhpcylcbiAgICAgIH1cbiAgICB9KSlcbiAgICBzdWJzLmFkZCh0aGlzLmFkYXB0ZXIub25EaWRDaGFuZ2VTY3JvbGxMZWZ0KCgpID0+IHtcbiAgICAgIGlmICghdGhpcy5zdGFuZEFsb25lKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLXNjcm9sbC1sZWZ0JywgdGhpcylcbiAgICAgIH1cbiAgICB9KSlcblxuICAgIHN1YnMuYWRkKHRoaXMudGV4dEVkaXRvci5vbkRpZENoYW5nZSgoY2hhbmdlcykgPT4ge1xuICAgICAgdGhpcy5lbWl0Q2hhbmdlcyhjaGFuZ2VzKVxuICAgIH0pKVxuICAgIHN1YnMuYWRkKHRoaXMudGV4dEVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT4geyB0aGlzLmRlc3Ryb3koKSB9KSlcblxuICAgIC8qXG4gICAgRklYTUUgU29tZSBjaGFuZ2VzIG9jY3VyaW5nIGR1cmluZyB0aGUgdG9rZW5pemF0aW9uIHByb2R1Y2VzXG4gICAgcmFuZ2VzIHRoYXQgZGVjZWl2ZSB0aGUgY2FudmFzIHJlbmRlcmluZyBieSBtYWtpbmcgc29tZVxuICAgIGxpbmVzIGF0IHRoZSBlbmQgb2YgdGhlIGJ1ZmZlciBpbnRhY3Qgd2hpbGUgdGhleSBhcmUgaW4gZmFjdCBub3QsXG4gICAgcmVzdWx0aW5nIGluIGV4dHJhIGxpbmVzIGFwcGVhcmluZyBhdCB0aGUgZW5kIG9mIHRoZSBtaW5pbWFwLlxuICAgIEZvcmNpbmcgYSB3aG9sZSByZXBhaW50IHRvIGZpeCB0aGF0IGJ1ZyBpcyBzdWJvcHRpbWFsIGJ1dCB3b3Jrcy5cbiAgICAqL1xuICAgIHN1YnMuYWRkKHRoaXMudGV4dEVkaXRvci5kaXNwbGF5QnVmZmVyLm9uRGlkVG9rZW5pemUoKCkgPT4ge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtY29uZmlnJylcbiAgICB9KSlcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95cyB0aGUgbW9kZWwuXG4gICAqL1xuICBkZXN0cm95ICgpIHtcbiAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHsgcmV0dXJuIH1cblxuICAgIHRoaXMucmVtb3ZlQWxsRGVjb3JhdGlvbnMoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBudWxsXG4gICAgdGhpcy50ZXh0RWRpdG9yID0gbnVsbFxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZGVzdHJveScpXG4gICAgdGhpcy5lbWl0dGVyLmRpc3Bvc2UoKVxuICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhpcyBgTWluaW1hcGAgaGFzIGJlbm4gZGVzdHJveWVkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufSB3aGV0aGVyIHRoaXMgTWluaW1hcCBoYXMgYmVlbiBkZXN0cm95ZWQgb3Igbm90XG4gICAqL1xuICBpc0Rlc3Ryb3llZCAoKSB7IHJldHVybiB0aGlzLmRlc3Ryb3llZCB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgYGRpZC1jaGFuZ2VgIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihldmVudDpPYmplY3QpOnZvaWR9IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWRcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRoIGFuIGV2ZW50IG9iamVjdCB3aXRoXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgKiAtIHN0YXJ0OiBUaGUgY2hhbmdlJ3Mgc3RhcnQgcm93IG51bWJlclxuICAgKiAtIGVuZDogVGhlIGNoYW5nZSdzIGVuZCByb3cgbnVtYmVyXG4gICAqIC0gc2NyZWVuRGVsdGE6IHRoZSBkZWx0YSBpbiBidWZmZXIgcm93cyBiZXR3ZWVuIHRoZSB2ZXJzaW9ucyBiZWZvcmUgYW5kXG4gICAqICAgYWZ0ZXIgdGhlIGNoYW5nZVxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZENoYW5nZSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBgZGlkLWNoYW5nZS1jb25maWdgIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbigpOnZvaWR9IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSBldmVudFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzIHRyaWdnZXJlZC5cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRDaGFuZ2VDb25maWcgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1jb25maWcnLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGBkaWQtY2hhbmdlLXNjcm9sbC10b3BgIGV2ZW50LlxuICAgKlxuICAgKiBUaGUgZXZlbnQgaXMgZGlzcGF0Y2hlZCB3aGVuIHRoZSB0ZXh0IGVkaXRvciBgc2Nyb2xsVG9wYCB2YWx1ZSBoYXZlIGJlZW5cbiAgICogY2hhbmdlZCBvciB3aGVuIHRoZSBtaW5pbWFwIHNjcm9sbCB0b3AgaGF2ZSBiZWVuIGNoYW5nZWQgaW4gc3RhbmQtYWxvbmVcbiAgICogbW9kZS5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24obWluaW1hcDpNaW5pbWFwKTp2b2lkfSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGwgd2hlblxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGN1cnJlbnQgTWluaW1hcCBpc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3NlZCBhcyBhcmd1bWVudCB0b1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBjYWxsYmFjay5cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRDaGFuZ2VTY3JvbGxUb3AgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1zY3JvbGwtdG9wJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBgZGlkLWNoYW5nZS1zY3JvbGwtbGVmdGAgZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKG1pbmltYXA6TWluaW1hcCk6dm9pZH0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBjYWxsIHdoZW5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBjdXJyZW50IE1pbmltYXAgaXNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXNzZWQgYXMgYXJndW1lbnQgdG9cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkQ2hhbmdlU2Nyb2xsTGVmdCAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLXNjcm9sbC1sZWZ0JywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBgZGlkLWNoYW5nZS1zdGFuZC1hbG9uZWAgZXZlbnQuXG4gICAqXG4gICAqIFRoaXMgZXZlbnQgaXMgZGlzcGF0Y2hlZCB3aGVuIHRoZSBzdGFuZC1hbG9uZSBvZiB0aGUgY3VycmVudCBNaW5pbWFwXG4gICAqIGlzIGVpdGhlciBlbmFibGVkIG9yIGRpc2FibGVkLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihtaW5pbWFwOk1pbmltYXApOnZvaWR9IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbCB3aGVuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgY3VycmVudCBNaW5pbWFwIGlzXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2VkIGFzIGFyZ3VtZW50IHRvXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZENoYW5nZVN0YW5kQWxvbmUgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1zdGFuZC1hbG9uZScsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgYGRpZC1kZXN0cm95YCBldmVudC5cbiAgICpcbiAgICogVGhpcyBldmVudCBpcyBkaXNwYXRjaGVkIHdoZW4gdGhpcyBNaW5pbWFwIGhhdmUgYmVlbiBkZXN0cm95ZWQuIEl0IGNhblxuICAgKiBvY2N1cnMgZWl0aGVyIGJlY2F1c2UgdGhlIHtAbGluayBkZXN0cm95fSBtZXRob2QgaGF2ZSBiZWVuIGNhbGxlZCBvbiB0aGVcbiAgICogTWluaW1hcCBvciBiZWNhdXNlIHRoZSB0YXJnZXQgdGV4dCBlZGl0b3IgaGF2ZSBiZWVuIGRlc3Ryb3llZC5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oKTp2b2lkfSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgZXZlbnRcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpcyB0cmlnZ2VyZWQuXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkRGVzdHJveSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGVzdHJveScsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIGN1cnJlbnQgTWluaW1hcCBpcyBhIHN0YW5kLWFsb25lIG1pbmltYXAuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHdoZXRoZXIgdGhpcyBNaW5pbWFwIGlzIGluIHN0YW5kLWFsb25lIG1vZGUgb3Igbm90LlxuICAgKi9cbiAgaXNTdGFuZEFsb25lICgpIHsgcmV0dXJuIHRoaXMuc3RhbmRBbG9uZSB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHN0YW5kLWFsb25lIG1vZGUgZm9yIHRoaXMgbWluaW1hcC5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBzdGFuZEFsb25lIHRoZSBuZXcgc3RhdGUgb2YgdGhlIHN0YW5kLWFsb25lIG1vZGUgZm9yIHRoaXNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1pbmltYXBcbiAgICogQGVtaXRzIHtkaWQtY2hhbmdlLXN0YW5kLWFsb25lfSBpZiB0aGUgc3RhbmQtYWxvbmUgbW9kZSBoYXZlIGJlZW4gdG9nZ2xlZFxuICAgKiAgICAgICAgb24gb3Igb2ZmIGJ5IHRoZSBjYWxsXG4gICAqL1xuICBzZXRTdGFuZEFsb25lIChzdGFuZEFsb25lKSB7XG4gICAgaWYgKHN0YW5kQWxvbmUgIT09IHRoaXMuc3RhbmRBbG9uZSkge1xuICAgICAgdGhpcy5zdGFuZEFsb25lID0gc3RhbmRBbG9uZVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2Utc3RhbmQtYWxvbmUnLCB0aGlzKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGV4dEVkaXRvcmAgdGhhdCB0aGlzIG1pbmltYXAgcmVwcmVzZW50cy5cbiAgICpcbiAgICogQHJldHVybiB7VGV4dEVkaXRvcn0gdGhpcyBNaW5pbWFwJ3MgdGV4dCBlZGl0b3JcbiAgICovXG4gIGdldFRleHRFZGl0b3IgKCkgeyByZXR1cm4gdGhpcy50ZXh0RWRpdG9yIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IG9mIHRoZSBgVGV4dEVkaXRvcmAgYXQgdGhlIE1pbmltYXAgc2NhbGUuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHNjYWxlZCBoZWlnaHQgb2YgdGhlIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9yU2NhbGVkSGVpZ2h0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmdldEhlaWdodCgpICogdGhpcy5nZXRWZXJ0aWNhbFNjYWxlRmFjdG9yKClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGV4dEVkaXRvcmAgc2Nyb2xsIHRvcCB2YWx1ZSBhdCB0aGUgTWluaW1hcCBzY2FsZS5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgc2NhbGVkIHNjcm9sbCB0b3Agb2YgdGhlIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9yU2NhbGVkU2Nyb2xsVG9wICgpIHtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmdldFNjcm9sbFRvcCgpICogdGhpcy5nZXRWZXJ0aWNhbFNjYWxlRmFjdG9yKClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGV4dEVkaXRvcmAgc2Nyb2xsIGxlZnQgdmFsdWUgYXQgdGhlIE1pbmltYXAgc2NhbGUuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHNjYWxlZCBzY3JvbGwgbGVmdCBvZiB0aGUgdGV4dCBlZGl0b3JcbiAgICovXG4gIGdldFRleHRFZGl0b3JTY2FsZWRTY3JvbGxMZWZ0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmdldFNjcm9sbExlZnQoKSAqIHRoaXMuZ2V0SG9yaXpvbnRhbFNjYWxlRmFjdG9yKClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGV4dEVkaXRvcmAgbWF4aW11bSBzY3JvbGwgdG9wIHZhbHVlLlxuICAgKlxuICAgKiBXaGVuIHRoZSBgc2Nyb2xsUGFzdEVuZGAgc2V0dGluZyBpcyBlbmFibGVkLCB0aGUgbWV0aG9kIGNvbXBlbnNhdGUgdGhlXG4gICAqIGV4dHJhIHNjcm9sbCBieSByZW1vdmluZyB0aGUgc2FtZSBoZWlnaHQgYXMgYWRkZWQgYnkgdGhlIGVkaXRvciBmcm9tIHRoZVxuICAgKiBmaW5hbCB2YWx1ZS5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgbWF4aW11bSBzY3JvbGwgdG9wIG9mIHRoZSB0ZXh0IGVkaXRvclxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvck1heFNjcm9sbFRvcCAoKSB7IHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0TWF4U2Nyb2xsVG9wKCkgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGV4dEVkaXRvcmAgc2Nyb2xsIHRvcCB2YWx1ZS5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgc2Nyb2xsIHRvcCBvZiB0aGUgdGV4dCBlZGl0b3JcbiAgICovXG4gIGdldFRleHRFZGl0b3JTY3JvbGxUb3AgKCkgeyByZXR1cm4gdGhpcy5hZGFwdGVyLmdldFNjcm9sbFRvcCgpIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc2Nyb2xsIHRvcCBvZiB0aGUgYFRleHRFZGl0b3JgLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2Nyb2xsVG9wIHRoZSBuZXcgc2Nyb2xsIHRvcCB2YWx1ZVxuICAgKi9cbiAgc2V0VGV4dEVkaXRvclNjcm9sbFRvcCAoc2Nyb2xsVG9wKSB7IHRoaXMuYWRhcHRlci5zZXRTY3JvbGxUb3Aoc2Nyb2xsVG9wKSB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yYCBzY3JvbGwgbGVmdCB2YWx1ZS5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgc2Nyb2xsIGxlZnQgb2YgdGhlIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9yU2Nyb2xsTGVmdCAoKSB7IHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0U2Nyb2xsTGVmdCgpIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IG9mIHRoZSBgVGV4dEVkaXRvcmAuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIGhlaWdodCBvZiB0aGUgdGV4dCBlZGl0b3JcbiAgICovXG4gIGdldFRleHRFZGl0b3JIZWlnaHQgKCkgeyByZXR1cm4gdGhpcy5hZGFwdGVyLmdldEhlaWdodCgpIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRleHRFZGl0b3JgIHNjcm9sbCBhcyBhIHZhbHVlIG5vcm1hbGl6ZWQgYmV0d2VlbiBgMGAgYW5kIGAxYC5cbiAgICpcbiAgICogV2hlbiB0aGUgYHNjcm9sbFBhc3RFbmRgIHNldHRpbmcgaXMgZW5hYmxlZCB0aGUgdmFsdWUgbWF5IGV4Y2VlZCBgMWAgYXMgdGhlXG4gICAqIG1heGltdW0gc2Nyb2xsIHZhbHVlIHVzZWQgdG8gY29tcHV0ZSB0aGlzIHJhdGlvIGNvbXBlbnNhdGUgZm9yIHRoZSBleHRyYVxuICAgKiBoZWlnaHQgaW4gdGhlIGVkaXRvci4gKipVc2Uge0BsaW5rIGdldENhcGVkVGV4dEVkaXRvclNjcm9sbFJhdGlvfSB3aGVuXG4gICAqIHlvdSBuZWVkIGEgdmFsdWUgdGhhdCBpcyBzdHJpY3RseSBiZXR3ZWVuIGAwYCBhbmQgYDFgLioqXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHNjcm9sbCByYXRpbyBvZiB0aGUgdGV4dCBlZGl0b3JcbiAgICovXG4gIGdldFRleHRFZGl0b3JTY3JvbGxSYXRpbyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5nZXRTY3JvbGxUb3AoKSAvICh0aGlzLmdldFRleHRFZGl0b3JNYXhTY3JvbGxUb3AoKSB8fCAxKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yYCBzY3JvbGwgYXMgYSB2YWx1ZSBub3JtYWxpemVkIGJldHdlZW4gYDBgIGFuZCBgMWAuXG4gICAqXG4gICAqIFRoZSByZXR1cm5lZCB2YWx1ZSB3aWxsIGFsd2F5cyBiZSBzdHJpY3RseSBiZXR3ZWVuIGAwYCBhbmQgYDFgLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBzY3JvbGwgcmF0aW8gb2YgdGhlIHRleHQgZWRpdG9yIHN0cmljdGx5IGJldHdlZW5cbiAgICogICAgICAgICAgICAgICAgICAwIGFuZCAxXG4gICAqL1xuICBnZXRDYXBlZFRleHRFZGl0b3JTY3JvbGxSYXRpbyAoKSB7XG4gICAgcmV0dXJuIE1hdGgubWluKDEsIHRoaXMuZ2V0VGV4dEVkaXRvclNjcm9sbFJhdGlvKCkpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IG9mIHRoZSB3aG9sZSBtaW5pbWFwIGluIHBpeGVscyBiYXNlZCBvbiB0aGUgYG1pbmltYXBgXG4gICAqIHNldHRpbmdzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBoZWlnaHQgb2YgdGhlIG1pbmltYXBcbiAgICovXG4gIGdldEhlaWdodCAoKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dEVkaXRvci5nZXRTY3JlZW5MaW5lQ291bnQoKSAqIHRoaXMuZ2V0TGluZUhlaWdodCgpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgd2lkdGggb2YgdGhlIHdob2xlIG1pbmltYXAgaW4gcGl4ZWxzIGJhc2VkIG9uIHRoZSBgbWluaW1hcGBcbiAgICogc2V0dGluZ3MuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHdpZHRoIG9mIHRoZSBtaW5pbWFwXG4gICAqL1xuICBnZXRXaWR0aCAoKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dEVkaXRvci5nZXRNYXhTY3JlZW5MaW5lTGVuZ3RoKCkgKiB0aGlzLmdldENoYXJXaWR0aCgpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IHRoZSBNaW5pbWFwIGNvbnRlbnQgd2lsbCB0YWtlIG9uIHNjcmVlbi5cbiAgICpcbiAgICogV2hlbiB0aGUgTWluaW1hcCBoZWlnaHQgaXMgZ3JlYXRlciB0aGFuIHRoZSBgVGV4dEVkaXRvcmAgaGVpZ2h0LCB0aGVcbiAgICogYFRleHRFZGl0b3JgIGhlaWdodCBpcyByZXR1cm5lZCBpbnN0ZWFkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSB2aXNpYmxlIGhlaWdodCBvZiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0VmlzaWJsZUhlaWdodCAoKSB7XG4gICAgcmV0dXJuIE1hdGgubWluKHRoaXMuZ2V0U2NyZWVuSGVpZ2h0KCksIHRoaXMuZ2V0SGVpZ2h0KCkpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IHRoZSBtaW5pbWFwIHNob3VsZCB0YWtlIG9uY2UgZGlzcGxheWVkLCBpdCdzIGVpdGhlclxuICAgKiB0aGUgaGVpZ2h0IG9mIHRoZSBgVGV4dEVkaXRvcmAgb3IgdGhlIHByb3ZpZGVkIGBoZWlnaHRgIHdoZW4gaW4gc3RhbmQtYWxvbmVcbiAgICogbW9kZS5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgdG90YWwgaGVpZ2h0IG9mIHRoZSBNaW5pbWFwXG4gICAqL1xuICBnZXRTY3JlZW5IZWlnaHQgKCkge1xuICAgIGlmICh0aGlzLmlzU3RhbmRBbG9uZSgpKSB7XG4gICAgICBpZiAodGhpcy5oZWlnaHQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oZWlnaHRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEhlaWdodCgpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0SGVpZ2h0KClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgd2lkdGggdGhlIHdob2xlIE1pbmltYXAgd2lsbCB0YWtlIG9uIHNjcmVlbi5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgd2lkdGggb2YgdGhlIE1pbmltYXAgd2hlbiBkaXNwbGF5ZWRcbiAgICovXG4gIGdldFZpc2libGVXaWR0aCAoKSB7XG4gICAgcmV0dXJuIE1hdGgubWluKHRoaXMuZ2V0U2NyZWVuV2lkdGgoKSwgdGhpcy5nZXRXaWR0aCgpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHdpZHRoIHRoZSBNaW5pbWFwIHNob3VsZCB0YWtlIG9uY2UgZGlzcGxheWVkLCBpdCdzIGVpdGhlciB0aGVcbiAgICogd2lkdGggb2YgdGhlIE1pbmltYXAgY29udGVudCBvciB0aGUgcHJvdmlkZWQgYHdpZHRoYCB3aGVuIGluIHN0YW5kQWxvbmVcbiAgICogbW9kZS5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgTWluaW1hcCBzY3JlZW4gd2lkdGhcbiAgICovXG4gIGdldFNjcmVlbldpZHRoICgpIHtcbiAgICBpZiAodGhpcy5pc1N0YW5kQWxvbmUoKSAmJiB0aGlzLndpZHRoICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLndpZHRoXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFdpZHRoKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgcHJlZmVycmVkIGhlaWdodCBhbmQgd2lkdGggd2hlbiBpbiBzdGFuZC1hbG9uZSBtb2RlLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgYnkgdGhlIDxNaW5pbWFwRWxlbWVudD4gZm9yIHRoaXMgTWluaW1hcCBzbyB0aGF0XG4gICAqIHRoZSBtb2RlbCBpcyBrZXB0IGluIHN5bmMgd2l0aCB0aGUgdmlldy5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCB0aGUgbmV3IGhlaWdodCBvZiB0aGUgTWluaW1hcFxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggdGhlIG5ldyB3aWR0aCBvZiB0aGUgTWluaW1hcFxuICAgKi9cbiAgc2V0U2NyZWVuSGVpZ2h0QW5kV2lkdGggKGhlaWdodCwgd2lkdGgpIHtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodFxuICAgIHRoaXMud2lkdGggPSB3aWR0aFxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZlcnRpY2FsIHNjYWxpbmcgZmFjdG9yIHdoZW4gY29udmVydGluZyBjb29yZGluYXRlcyBmcm9tIHRoZVxuICAgKiBgVGV4dEVkaXRvcmAgdG8gdGhlIE1pbmltYXAuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIE1pbmltYXAgdmVydGljYWwgc2NhbGluZyBmYWN0b3JcbiAgICovXG4gIGdldFZlcnRpY2FsU2NhbGVGYWN0b3IgKCkge1xuICAgIHJldHVybiB0aGlzLmdldExpbmVIZWlnaHQoKSAvIHRoaXMudGV4dEVkaXRvci5nZXRMaW5lSGVpZ2h0SW5QaXhlbHMoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhvcml6b250YWwgc2NhbGluZyBmYWN0b3Igd2hlbiBjb252ZXJ0aW5nIGNvb3JkaW5hdGVzIGZyb20gdGhlXG4gICAqIGBUZXh0RWRpdG9yYCB0byB0aGUgTWluaW1hcC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgTWluaW1hcCBob3Jpem9udGFsIHNjYWxpbmcgZmFjdG9yXG4gICAqL1xuICBnZXRIb3Jpem9udGFsU2NhbGVGYWN0b3IgKCkge1xuICAgIHJldHVybiB0aGlzLmdldENoYXJXaWR0aCgpIC8gdGhpcy50ZXh0RWRpdG9yLmdldERlZmF1bHRDaGFyV2lkdGgoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCBvZiBhIGxpbmUgaW4gdGhlIE1pbmltYXAgaW4gcGl4ZWxzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IGEgbGluZSdzIGhlaWdodCBpbiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0TGluZUhlaWdodCAoKSB7IHJldHVybiB0aGlzLmdldENoYXJIZWlnaHQoKSArIHRoaXMuZ2V0SW50ZXJsaW5lKCkgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB3aWR0aCBvZiBhIGNoYXJhY3RlciBpbiB0aGUgTWluaW1hcCBpbiBwaXhlbHMuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gYSBjaGFyYWN0ZXIncyB3aWR0aCBpbiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0Q2hhcldpZHRoICgpIHtcbiAgICBpZiAodGhpcy5jaGFyV2lkdGggIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhcldpZHRoXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZ0NoYXJXaWR0aFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjaGFyIHdpZHRoIGZvciB0aGlzIE1pbmltYXAuIFRoaXMgdmFsdWUgd2lsbCBvdmVycmlkZSB0aGVcbiAgICogdmFsdWUgZnJvbSB0aGUgY29uZmlnIGZvciB0aGlzIGluc3RhbmNlIG9ubHkuIEEgYGRpZC1jaGFuZ2UtY29uZmlnYFxuICAgKiBldmVudCBpcyBkaXNwYXRjaGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gY2hhcldpZHRoIHRoZSBuZXcgd2lkdGggb2YgYSBjaGFyIGluIHRoZSBNaW5pbWFwXG4gICAqIEBlbWl0cyB7ZGlkLWNoYW5nZS1jb25maWd9IHdoZW4gdGhlIHZhbHVlIGlzIGNoYW5nZWRcbiAgICovXG4gIHNldENoYXJXaWR0aCAoY2hhcldpZHRoKSB7XG4gICAgdGhpcy5jaGFyV2lkdGggPSBNYXRoLmZsb29yKGNoYXJXaWR0aClcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb25maWcnKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCBvZiBhIGNoYXJhY3RlciBpbiB0aGUgTWluaW1hcCBpbiBwaXhlbHMuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gYSBjaGFyYWN0ZXIncyBoZWlnaHQgaW4gdGhlIE1pbmltYXBcbiAgICovXG4gIGdldENoYXJIZWlnaHQgKCkge1xuICAgIGlmICh0aGlzLmNoYXJIZWlnaHQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhckhlaWdodFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25maWdDaGFySGVpZ2h0XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGNoYXIgaGVpZ2h0IGZvciB0aGlzIE1pbmltYXAuIFRoaXMgdmFsdWUgd2lsbCBvdmVycmlkZSB0aGVcbiAgICogdmFsdWUgZnJvbSB0aGUgY29uZmlnIGZvciB0aGlzIGluc3RhbmNlIG9ubHkuIEEgYGRpZC1jaGFuZ2UtY29uZmlnYFxuICAgKiBldmVudCBpcyBkaXNwYXRjaGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gY2hhckhlaWdodCB0aGUgbmV3IGhlaWdodCBvZiBhIGNoYXIgaW4gdGhlIE1pbmltYXBcbiAgICogQGVtaXRzIHtkaWQtY2hhbmdlLWNvbmZpZ30gd2hlbiB0aGUgdmFsdWUgaXMgY2hhbmdlZFxuICAgKi9cbiAgc2V0Q2hhckhlaWdodCAoY2hhckhlaWdodCkge1xuICAgIHRoaXMuY2hhckhlaWdodCA9IE1hdGguZmxvb3IoY2hhckhlaWdodClcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb25maWcnKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCBvZiBhbiBpbnRlcmxpbmUgaW4gdGhlIE1pbmltYXAgaW4gcGl4ZWxzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBpbnRlcmxpbmUncyBoZWlnaHQgaW4gdGhlIE1pbmltYXBcbiAgICovXG4gIGdldEludGVybGluZSAoKSB7XG4gICAgaWYgKHRoaXMuaW50ZXJsaW5lICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmludGVybGluZVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25maWdJbnRlcmxpbmVcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgaW50ZXJsaW5lIGhlaWdodCBmb3IgdGhpcyBNaW5pbWFwLiBUaGlzIHZhbHVlIHdpbGwgb3ZlcnJpZGUgdGhlXG4gICAqIHZhbHVlIGZyb20gdGhlIGNvbmZpZyBmb3IgdGhpcyBpbnN0YW5jZSBvbmx5LiBBIGBkaWQtY2hhbmdlLWNvbmZpZ2BcbiAgICogZXZlbnQgaXMgZGlzcGF0Y2hlZC5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGludGVybGluZSB0aGUgbmV3IGhlaWdodCBvZiBhbiBpbnRlcmxpbmUgaW4gdGhlIE1pbmltYXBcbiAgICogQGVtaXRzIHtkaWQtY2hhbmdlLWNvbmZpZ30gd2hlbiB0aGUgdmFsdWUgaXMgY2hhbmdlZFxuICAgKi9cbiAgc2V0SW50ZXJsaW5lIChpbnRlcmxpbmUpIHtcbiAgICB0aGlzLmludGVybGluZSA9IE1hdGguZmxvb3IoaW50ZXJsaW5lKVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGZpcnN0IHZpc2libGUgcm93IGluIHRoZSBNaW5pbWFwLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBpbmRleCBvZiB0aGUgZmlyc3QgdmlzaWJsZSByb3dcbiAgICovXG4gIGdldEZpcnN0VmlzaWJsZVNjcmVlblJvdyAoKSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy5nZXRTY3JvbGxUb3AoKSAvIHRoaXMuZ2V0TGluZUhlaWdodCgpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBsYXN0IHZpc2libGUgcm93IGluIHRoZSBNaW5pbWFwLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBpbmRleCBvZiB0aGUgbGFzdCB2aXNpYmxlIHJvd1xuICAgKi9cbiAgZ2V0TGFzdFZpc2libGVTY3JlZW5Sb3cgKCkge1xuICAgIHJldHVybiBNYXRoLmNlaWwoXG4gICAgICAodGhpcy5nZXRTY3JvbGxUb3AoKSArIHRoaXMuZ2V0U2NyZWVuSGVpZ2h0KCkpIC8gdGhpcy5nZXRMaW5lSGVpZ2h0KClcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCBzY3JvbGwgb2YgdGhlIE1pbmltYXAuXG4gICAqXG4gICAqIFRoZSBNaW5pbWFwIGNhbiBzY3JvbGwgb25seSB3aGVuIGl0cyBoZWlnaHQgaXMgZ3JlYXRlciB0aGF0IHRoZSBoZWlnaHRcbiAgICogb2YgaXRzIGBUZXh0RWRpdG9yYC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgc2Nyb2xsIHRvcCBvZiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0U2Nyb2xsVG9wICgpIHtcbiAgICBpZiAodGhpcy5zdGFuZEFsb25lKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY3JvbGxUb3BcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE1hdGguYWJzKFxuICAgICAgICB0aGlzLmdldENhcGVkVGV4dEVkaXRvclNjcm9sbFJhdGlvKCkgKiB0aGlzLmdldE1heFNjcm9sbFRvcCgpXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1pbmltYXAgc2Nyb2xsIHRvcCB2YWx1ZSB3aGVuIGluIHN0YW5kLWFsb25lIG1vZGUuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzY3JvbGxUb3AgdGhlIG5ldyBzY3JvbGwgdG9wIGZvciB0aGUgTWluaW1hcFxuICAgKiBAZW1pdHMge2RpZC1jaGFuZ2Utc2Nyb2xsLXRvcH0gaWYgdGhlIE1pbmltYXAncyBzdGFuZC1hbG9uZSBtb2RlIGlzIGVuYWJsZWRcbiAgICovXG4gIHNldFNjcm9sbFRvcCAoc2Nyb2xsVG9wKSB7XG4gICAgdGhpcy5zY3JvbGxUb3AgPSBzY3JvbGxUb3BcbiAgICBpZiAodGhpcy5zdGFuZEFsb25lKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1zY3JvbGwtdG9wJywgdGhpcylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWF4aW11bSBzY3JvbGwgdmFsdWUgb2YgdGhlIE1pbmltYXAuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIG1heGltdW0gc2Nyb2xsIHRvcCBmb3IgdGhlIE1pbmltYXBcbiAgICovXG4gIGdldE1heFNjcm9sbFRvcCAoKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KDAsIHRoaXMuZ2V0SGVpZ2h0KCkgLSB0aGlzLmdldFNjcmVlbkhlaWdodCgpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIE1pbmltYXAgY2FuIHNjcm9sbC5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gd2hldGhlciB0aGlzIE1pbmltYXAgY2FuIHNjcm9sbCBvciBub3RcbiAgICovXG4gIGNhblNjcm9sbCAoKSB7IHJldHVybiB0aGlzLmdldE1heFNjcm9sbFRvcCgpID4gMCB9XG5cbiAgLyoqXG4gICAqIERlbGVnYXRlcyB0byBgVGV4dEVkaXRvciNnZXRNYXJrZXJgLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGdldE1hcmtlciAoaWQpIHsgcmV0dXJuIHRoaXMudGV4dEVkaXRvci5nZXRNYXJrZXIoaWQpIH1cblxuICAvKipcbiAgICogRGVsZWdhdGVzIHRvIGBUZXh0RWRpdG9yI2ZpbmRNYXJrZXJzYC5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBmaW5kTWFya2VycyAobykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0RWRpdG9yLmZpbmRNYXJrZXJzKG8pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxlZ2F0ZXMgdG8gYFRleHRFZGl0b3IjbWFya0J1ZmZlclJhbmdlYC5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBtYXJrQnVmZmVyUmFuZ2UgKHJhbmdlKSB7IHJldHVybiB0aGlzLnRleHRFZGl0b3IubWFya0J1ZmZlclJhbmdlKHJhbmdlKSB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIGEgY2hhbmdlIGV2ZW50cyB3aXRoIHRoZSBwYXNzZWQtaW4gY2hhbmdlcyBhcyBkYXRhLlxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IGNoYW5nZXMgYSBjaGFuZ2UgdG8gZGlzcGF0Y2hcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBlbWl0Q2hhbmdlcyAoY2hhbmdlcykgeyB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZScsIGNoYW5nZXMpIH1cblxuICAvKipcbiAgICogRW5hYmxlcyB0aGUgY2FjaGUgYXQgdGhlIGFkYXB0ZXIgbGV2ZWwgdG8gYXZvaWQgY29uc2VjdXRpdmUgYWNjZXNzIHRvIHRoZVxuICAgKiB0ZXh0IGVkaXRvciBBUEkgZHVyaW5nIGEgcmVuZGVyIHBoYXNlLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGVuYWJsZUNhY2hlICgpIHsgdGhpcy5hZGFwdGVyLmVuYWJsZUNhY2hlKCkgfVxuXG4gIC8qKlxuICAgKiBEaXNhYmxlIHRoZSBhZGFwdGVyIGNhY2hlLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGNsZWFyQ2FjaGUgKCkgeyB0aGlzLmFkYXB0ZXIuY2xlYXJDYWNoZSgpIH1cbn1cbiJdfQ==
//# sourceURL=/Users/anas/.atom/packages/minimap/lib/minimap.js
