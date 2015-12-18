(function() {
  var Minimap, MinimapElement, fs, isVisible, mousedown, mousemove, mouseup, mousewheel, path, realOffsetLeft, realOffsetTop, sleep, stylesheet, touchmove, touchstart, _ref;

  fs = require('fs-plus');

  path = require('path');

  Minimap = require('../lib/minimap');

  MinimapElement = require('../lib/minimap-element');

  stylesheet = require('./helpers/workspace').stylesheet;

  _ref = require('./helpers/events'), mousemove = _ref.mousemove, mousedown = _ref.mousedown, mouseup = _ref.mouseup, mousewheel = _ref.mousewheel, touchstart = _ref.touchstart, touchmove = _ref.touchmove;

  realOffsetTop = function(o) {
    return o.offsetTop;
  };

  realOffsetLeft = function(o) {
    return o.offsetLeft;
  };

  isVisible = function(node) {
    return node.offsetWidth > 0 || node.offsetHeight > 0;
  };

  sleep = function(duration) {
    var t;
    t = new Date;
    return waitsFor(function() {
      return new Date - t > duration;
    });
  };

  describe('MinimapElement', function() {
    var dir, editor, editorElement, jasmineContent, largeSample, mediumSample, minimap, minimapElement, smallSample, _ref1;
    _ref1 = [], editor = _ref1[0], minimap = _ref1[1], largeSample = _ref1[2], mediumSample = _ref1[3], smallSample = _ref1[4], jasmineContent = _ref1[5], editorElement = _ref1[6], minimapElement = _ref1[7], dir = _ref1[8];
    beforeEach(function() {
      jasmineContent = document.body.querySelector('#jasmine-content');
      atom.config.set('minimap.charHeight', 4);
      atom.config.set('minimap.charWidth', 2);
      atom.config.set('minimap.interline', 1);
      atom.config.set('minimap.textOpacity', 1);
      MinimapElement.registerViewProvider();
      editor = atom.workspace.buildTextEditor({});
      editorElement = atom.views.getView(editor);
      jasmineContent.insertBefore(editorElement, jasmineContent.firstChild);
      editorElement.setHeight(50);
      minimap = new Minimap({
        textEditor: editor
      });
      dir = atom.project.getDirectories()[0];
      largeSample = fs.readFileSync(dir.resolve('large-file.coffee')).toString();
      mediumSample = fs.readFileSync(dir.resolve('two-hundred.txt')).toString();
      smallSample = fs.readFileSync(dir.resolve('sample.coffee')).toString();
      editor.setText(largeSample);
      return minimapElement = atom.views.getView(minimap);
    });
    it('has been registered in the view registry', function() {
      return expect(minimapElement).toExist();
    });
    it('has stored the minimap as its model', function() {
      return expect(minimapElement.getModel()).toBe(minimap);
    });
    it('has a canvas in a shadow DOM', function() {
      return expect(minimapElement.shadowRoot.querySelector('canvas')).toExist();
    });
    it('has a div representing the visible area', function() {
      return expect(minimapElement.shadowRoot.querySelector('.minimap-visible-area')).toExist();
    });
    return describe('when attached to the text editor element', function() {
      var canvas, lastFn, nextAnimationFrame, noAnimationFrame, visibleArea, _ref2;
      _ref2 = [], noAnimationFrame = _ref2[0], nextAnimationFrame = _ref2[1], lastFn = _ref2[2], canvas = _ref2[3], visibleArea = _ref2[4];
      beforeEach(function() {
        var requestAnimationFrameSafe;
        noAnimationFrame = function() {
          throw new Error('No animation frame requested');
        };
        nextAnimationFrame = noAnimationFrame;
        requestAnimationFrameSafe = window.requestAnimationFrame;
        return spyOn(window, 'requestAnimationFrame').andCallFake(function(fn) {
          lastFn = fn;
          return nextAnimationFrame = function() {
            nextAnimationFrame = noAnimationFrame;
            return fn();
          };
        });
      });
      beforeEach(function() {
        canvas = minimapElement.shadowRoot.querySelector('canvas');
        editorElement.setWidth(200);
        editorElement.setHeight(50);
        editorElement.setScrollTop(1000);
        editorElement.setScrollLeft(200);
        return minimapElement.attach();
      });
      afterEach(function() {
        return minimap.destroy();
      });
      it('takes the height of the editor', function() {
        expect(minimapElement.offsetHeight).toEqual(editorElement.clientHeight);
        return expect(minimapElement.offsetWidth).toBeCloseTo(editorElement.clientWidth / 10, 0);
      });
      it('knows when attached to a text editor', function() {
        return expect(minimapElement.attachedToTextEditor).toBeTruthy();
      });
      it('resizes the canvas to fit the minimap', function() {
        expect(canvas.offsetHeight / devicePixelRatio).toBeCloseTo(minimapElement.offsetHeight + minimap.getLineHeight(), 0);
        return expect(canvas.offsetWidth / devicePixelRatio).toBeCloseTo(minimapElement.offsetWidth, 0);
      });
      it('requests an update', function() {
        return expect(minimapElement.frameRequested).toBeTruthy();
      });
      describe('with css filters', function() {
        describe('when a hue-rotate filter is applied to a rgb color', function() {
          var additionnalStyleNode;
          additionnalStyleNode = [][0];
          beforeEach(function() {
            minimapElement.invalidateDOMStylesCache();
            additionnalStyleNode = document.createElement('style');
            additionnalStyleNode.textContent = "" + stylesheet + "\n\n.editor {\n  color: red;\n  -webkit-filter: hue-rotate(180deg);\n}";
            return jasmineContent.appendChild(additionnalStyleNode);
          });
          return it('computes the new color by applying the hue rotation', function() {
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              return expect(minimapElement.retrieveStyleFromDom(['.editor'], 'color')).toEqual("rgb(0, " + 0x6d + ", " + 0x6d + ")");
            });
          });
        });
        return describe('when a hue-rotate filter is applied to a rgba color', function() {
          var additionnalStyleNode;
          additionnalStyleNode = [][0];
          beforeEach(function() {
            minimapElement.invalidateDOMStylesCache();
            additionnalStyleNode = document.createElement('style');
            additionnalStyleNode.textContent = "" + stylesheet + "\n\n.editor {\n  color: rgba(255,0,0,0);\n  -webkit-filter: hue-rotate(180deg);\n}";
            return jasmineContent.appendChild(additionnalStyleNode);
          });
          return it('computes the new color by applying the hue rotation', function() {
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              return expect(minimapElement.retrieveStyleFromDom(['.editor'], 'color')).toEqual("rgba(0, " + 0x6d + ", " + 0x6d + ", 0)");
            });
          });
        });
      });
      describe('when the update is performed', function() {
        beforeEach(function() {
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            return visibleArea = minimapElement.shadowRoot.querySelector('.minimap-visible-area');
          });
        });
        it('sets the visible area width and height', function() {
          expect(visibleArea.offsetWidth).toEqual(minimapElement.clientWidth);
          return expect(visibleArea.offsetHeight).toBeCloseTo(minimap.getTextEditorScaledHeight(), 0);
        });
        it('sets the visible visible area offset', function() {
          expect(realOffsetTop(visibleArea)).toBeCloseTo(minimap.getTextEditorScaledScrollTop() - minimap.getScrollTop(), 0);
          return expect(realOffsetLeft(visibleArea)).toBeCloseTo(minimap.getTextEditorScaledScrollLeft(), 0);
        });
        it('offsets the canvas when the scroll does not match line height', function() {
          editorElement.setScrollTop(1004);
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            return expect(realOffsetTop(canvas)).toBeCloseTo(-2, -1);
          });
        });
        it('does not fail to update render the invisible char when modified', function() {
          atom.config.set('editor.showInvisibles', true);
          atom.config.set('editor.invisibles', {
            cr: '*'
          });
          return expect(function() {
            return nextAnimationFrame();
          }).not.toThrow();
        });
        it('renders the visible line decorations', function() {
          spyOn(minimapElement, 'drawLineDecoration').andCallThrough();
          minimap.decorateMarker(editor.markBufferRange([[1, 0], [1, 10]]), {
            type: 'line',
            color: '#0000FF'
          });
          minimap.decorateMarker(editor.markBufferRange([[10, 0], [10, 10]]), {
            type: 'line',
            color: '#0000FF'
          });
          minimap.decorateMarker(editor.markBufferRange([[100, 0], [100, 10]]), {
            type: 'line',
            color: '#0000FF'
          });
          editorElement.setScrollTop(0);
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            expect(minimapElement.drawLineDecoration).toHaveBeenCalled();
            return expect(minimapElement.drawLineDecoration.calls.length).toEqual(2);
          });
        });
        it('renders the visible highlight decorations', function() {
          spyOn(minimapElement, 'drawHighlightDecoration').andCallThrough();
          minimap.decorateMarker(editor.markBufferRange([[1, 0], [1, 4]]), {
            type: 'highlight-under',
            color: '#0000FF'
          });
          minimap.decorateMarker(editor.markBufferRange([[2, 20], [2, 30]]), {
            type: 'highlight-over',
            color: '#0000FF'
          });
          minimap.decorateMarker(editor.markBufferRange([[100, 3], [100, 5]]), {
            type: 'highlight-under',
            color: '#0000FF'
          });
          editorElement.setScrollTop(0);
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            expect(minimapElement.drawHighlightDecoration).toHaveBeenCalled();
            return expect(minimapElement.drawHighlightDecoration.calls.length).toEqual(2);
          });
        });
        it('renders the visible outline decorations', function() {
          spyOn(minimapElement, 'drawHighlightOutlineDecoration').andCallThrough();
          minimap.decorateMarker(editor.markBufferRange([[1, 4], [3, 6]]), {
            type: 'highlight-outline',
            color: '#0000ff'
          });
          minimap.decorateMarker(editor.markBufferRange([[6, 0], [6, 7]]), {
            type: 'highlight-outline',
            color: '#0000ff'
          });
          minimap.decorateMarker(editor.markBufferRange([[100, 3], [100, 5]]), {
            type: 'highlight-outline',
            color: '#0000ff'
          });
          editorElement.setScrollTop(0);
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            expect(minimapElement.drawHighlightOutlineDecoration).toHaveBeenCalled();
            return expect(minimapElement.drawHighlightOutlineDecoration.calls.length).toEqual(4);
          });
        });
        describe('when the editor is scrolled', function() {
          beforeEach(function() {
            editorElement.setScrollTop(2000);
            editorElement.setScrollLeft(50);
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('updates the visible area', function() {
            expect(realOffsetTop(visibleArea)).toBeCloseTo(minimap.getTextEditorScaledScrollTop() - minimap.getScrollTop(), 0);
            return expect(realOffsetLeft(visibleArea)).toBeCloseTo(minimap.getTextEditorScaledScrollLeft(), 0);
          });
        });
        describe('when the editor is resized to a greater size', function() {
          beforeEach(function() {
            var height;
            height = editorElement.getHeight();
            editorElement.style.width = '800px';
            editorElement.style.height = '500px';
            minimapElement.measureHeightAndWidth();
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('detects the resize and adjust itself', function() {
            expect(minimapElement.offsetWidth).toBeCloseTo(editorElement.offsetWidth / 10, 0);
            expect(minimapElement.offsetHeight).toEqual(editorElement.offsetHeight);
            expect(canvas.offsetWidth / devicePixelRatio).toBeCloseTo(minimapElement.offsetWidth, 0);
            return expect(canvas.offsetHeight / devicePixelRatio).toBeCloseTo(minimapElement.offsetHeight + minimap.getLineHeight(), 0);
          });
        });
        describe('when the editor visible content is changed', function() {
          beforeEach(function() {
            editorElement.setScrollLeft(0);
            editorElement.setScrollTop(1400);
            editor.setSelectedBufferRange([[101, 0], [102, 20]]);
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              spyOn(minimapElement, 'drawLines').andCallThrough();
              return editor.insertText('foo');
            });
          });
          return it('rerenders the part that have changed', function() {
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              expect(minimapElement.drawLines).toHaveBeenCalled();
              expect(minimapElement.drawLines.argsForCall[0][1]).toEqual(100);
              return expect(minimapElement.drawLines.argsForCall[0][2]).toEqual(101);
            });
          });
        });
        return describe('when the editor visibility change', function() {
          it('does not modify the size of the canvas', function() {
            var canvasHeight, canvasWidth;
            canvasWidth = minimapElement.canvas.width;
            canvasHeight = minimapElement.canvas.height;
            editorElement.style.display = 'none';
            minimapElement.measureHeightAndWidth();
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              expect(minimapElement.canvas.width).toEqual(canvasWidth);
              return expect(minimapElement.canvas.height).toEqual(canvasHeight);
            });
          });
          return describe('from hidden to visible', function() {
            beforeEach(function() {
              editorElement.style.display = 'none';
              minimapElement.checkForVisibilityChange();
              spyOn(minimapElement, 'requestForcedUpdate');
              editorElement.style.display = '';
              return minimapElement.pollDOM();
            });
            return it('requests an update of the whole minimap', function() {
              return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
            });
          });
        });
      });
      describe('mouse scroll controls', function() {
        beforeEach(function() {
          editorElement.setWidth(400);
          editorElement.setHeight(400);
          editorElement.setScrollTop(0);
          editorElement.setScrollLeft(0);
          nextAnimationFrame();
          minimapElement.measureHeightAndWidth();
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        describe('using the mouse scrollwheel over the minimap', function() {
          beforeEach(function() {
            spyOn(editorElement.component.presenter, 'setScrollTop').andCallFake(function() {});
            return mousewheel(minimapElement, 0, 15);
          });
          return it('relays the events to the editor view', function() {
            return expect(editorElement.component.presenter.setScrollTop).toHaveBeenCalled();
          });
        });
        describe('middle clicking the minimap', function() {
          var maxScroll, originalLeft, _ref3;
          _ref3 = [], canvas = _ref3[0], visibleArea = _ref3[1], originalLeft = _ref3[2], maxScroll = _ref3[3];
          beforeEach(function() {
            canvas = minimapElement.canvas, visibleArea = minimapElement.visibleArea;
            originalLeft = visibleArea.getBoundingClientRect().left;
            return maxScroll = minimap.getTextEditorMaxScrollTop();
          });
          it('scrolls to the top using the middle mouse button', function() {
            mousedown(canvas, {
              x: originalLeft + 1,
              y: 0,
              btn: 1
            });
            return expect(editorElement.getScrollTop()).toEqual(0);
          });
          describe('scrolling to the middle using the middle mouse button', function() {
            var canvasMidY;
            canvasMidY = void 0;
            beforeEach(function() {
              var actualMidY, editorMidY, height, top, _ref4;
              editorMidY = editorElement.getHeight() / 2.0;
              _ref4 = canvas.getBoundingClientRect(), top = _ref4.top, height = _ref4.height;
              canvasMidY = top + (height / 2.0);
              actualMidY = Math.min(canvasMidY, editorMidY);
              return mousedown(canvas, {
                x: originalLeft + 1,
                y: actualMidY,
                btn: 1
              });
            });
            it('scrolls the editor to the middle', function() {
              var middleScrollTop;
              middleScrollTop = Math.round(maxScroll / 2.0);
              return expect(editorElement.getScrollTop()).toEqual(middleScrollTop);
            });
            return it('updates the visible area to be centered', function() {
              waitsFor(function() {
                return nextAnimationFrame !== noAnimationFrame;
              });
              return runs(function() {
                var height, top, visibleCenterY, _ref4;
                nextAnimationFrame();
                _ref4 = visibleArea.getBoundingClientRect(), top = _ref4.top, height = _ref4.height;
                visibleCenterY = top + (height / 2);
                return expect(visibleCenterY).toBeCloseTo(200, 0);
              });
            });
          });
          return describe('scrolling the editor to an arbitrary location', function() {
            var scrollRatio, scrollTo, _ref4;
            _ref4 = [], scrollTo = _ref4[0], scrollRatio = _ref4[1];
            beforeEach(function() {
              scrollTo = 101;
              scrollRatio = (scrollTo - minimap.getTextEditorScaledHeight() / 2) / (minimap.getVisibleHeight() - minimap.getTextEditorScaledHeight());
              scrollRatio = Math.max(0, scrollRatio);
              scrollRatio = Math.min(1, scrollRatio);
              mousedown(canvas, {
                x: originalLeft + 1,
                y: scrollTo,
                btn: 1
              });
              waitsFor(function() {
                return nextAnimationFrame !== noAnimationFrame;
              });
              return runs(function() {
                return nextAnimationFrame();
              });
            });
            it('scrolls the editor to an arbitrary location', function() {
              var expectedScroll;
              expectedScroll = maxScroll * scrollRatio;
              return expect(editorElement.getScrollTop()).toBeCloseTo(expectedScroll, 0);
            });
            return describe('dragging the visible area with middle mouse button ' + 'after scrolling to the arbitrary location', function() {
              var originalTop;
              originalTop = [][0];
              beforeEach(function() {
                originalTop = visibleArea.getBoundingClientRect().top;
                mousemove(visibleArea, {
                  x: originalLeft + 1,
                  y: scrollTo + 40
                });
                waitsFor(function() {
                  return nextAnimationFrame !== noAnimationFrame;
                });
                return runs(function() {
                  return nextAnimationFrame();
                });
              });
              afterEach(function() {
                return minimapElement.endDrag();
              });
              return it('scrolls the editor so that the visible area was moved down ' + 'by 40 pixels from the arbitrary location', function() {
                var top;
                top = visibleArea.getBoundingClientRect().top;
                return expect(top).toBeCloseTo(originalTop + 40, -1);
              });
            });
          });
        });
        describe('pressing the mouse on the minimap canvas (without scroll animation)', function() {
          beforeEach(function() {
            var t;
            t = 0;
            spyOn(minimapElement, 'getTime').andCallFake(function() {
              var n;
              n = t;
              t += 100;
              return n;
            });
            spyOn(minimapElement, 'requestUpdate').andCallFake(function() {});
            atom.config.set('minimap.scrollAnimation', false);
            canvas = minimapElement.canvas;
            return mousedown(canvas);
          });
          return it('scrolls the editor to the line below the mouse', function() {
            var height, left, middle, scrollTop, top, width, _ref3;
            _ref3 = minimapElement.canvas.getBoundingClientRect(), top = _ref3.top, left = _ref3.left, width = _ref3.width, height = _ref3.height;
            middle = top + height / 2;
            return scrollTop = expect(editorElement.getScrollTop()).toBeGreaterThan(380);
          });
        });
        describe('pressing the mouse on the minimap canvas (with scroll animation)', function() {
          beforeEach(function() {
            var t;
            t = 0;
            spyOn(minimapElement, 'getTime').andCallFake(function() {
              var n;
              n = t;
              t += 100;
              return n;
            });
            spyOn(minimapElement, 'requestUpdate').andCallFake(function() {});
            atom.config.set('minimap.scrollAnimation', true);
            atom.config.set('minimap.scrollAnimationDuration', 300);
            canvas = minimapElement.canvas;
            mousedown(canvas);
            return waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
          });
          return it('scrolls the editor gradually to the line below the mouse', function() {
            return waitsFor(function() {
              nextAnimationFrame !== noAnimationFrame && nextAnimationFrame();
              return editorElement.getScrollTop() >= 380;
            });
          });
        });
        describe('dragging the visible area', function() {
          var originalTop, _ref3;
          _ref3 = [], visibleArea = _ref3[0], originalTop = _ref3[1];
          beforeEach(function() {
            var left, _ref4;
            visibleArea = minimapElement.visibleArea;
            _ref4 = visibleArea.getBoundingClientRect(), originalTop = _ref4.top, left = _ref4.left;
            mousedown(visibleArea, {
              x: left + 10,
              y: originalTop + 10
            });
            mousemove(visibleArea, {
              x: left + 10,
              y: originalTop + 50
            });
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          afterEach(function() {
            return minimapElement.endDrag();
          });
          it('scrolls the editor so that the visible area was moved down by 40 pixels', function() {
            var top;
            top = visibleArea.getBoundingClientRect().top;
            return expect(top).toBeCloseTo(originalTop + 40, -1);
          });
          return it('stops the drag gesture when the mouse is released outside the minimap', function() {
            var left, top, _ref4;
            _ref4 = visibleArea.getBoundingClientRect(), top = _ref4.top, left = _ref4.left;
            mouseup(jasmineContent, {
              x: left - 10,
              y: top + 80
            });
            spyOn(minimapElement, 'drag');
            mousemove(visibleArea, {
              x: left + 10,
              y: top + 50
            });
            return expect(minimapElement.drag).not.toHaveBeenCalled();
          });
        });
        describe('dragging the visible area using touch events', function() {
          var originalTop, _ref3;
          _ref3 = [], visibleArea = _ref3[0], originalTop = _ref3[1];
          beforeEach(function() {
            var left, _ref4;
            visibleArea = minimapElement.visibleArea;
            _ref4 = visibleArea.getBoundingClientRect(), originalTop = _ref4.top, left = _ref4.left;
            touchstart(visibleArea, {
              x: left + 10,
              y: originalTop + 10
            });
            touchmove(visibleArea, {
              x: left + 10,
              y: originalTop + 50
            });
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          afterEach(function() {
            return minimapElement.endDrag();
          });
          it('scrolls the editor so that the visible area was moved down by 40 pixels', function() {
            var top;
            top = visibleArea.getBoundingClientRect().top;
            return expect(top).toBeCloseTo(originalTop + 40, -1);
          });
          return it('stops the drag gesture when the mouse is released outside the minimap', function() {
            var left, top, _ref4;
            _ref4 = visibleArea.getBoundingClientRect(), top = _ref4.top, left = _ref4.left;
            mouseup(jasmineContent, {
              x: left - 10,
              y: top + 80
            });
            spyOn(minimapElement, 'drag');
            touchmove(visibleArea, {
              x: left + 10,
              y: top + 50
            });
            return expect(minimapElement.drag).not.toHaveBeenCalled();
          });
        });
        describe('when the minimap cannot scroll', function() {
          var originalTop, _ref3;
          _ref3 = [], visibleArea = _ref3[0], originalTop = _ref3[1];
          beforeEach(function() {
            var sample;
            sample = fs.readFileSync(dir.resolve('seventy.txt')).toString();
            editor.setText(sample);
            return editorElement.setScrollTop(0);
          });
          return describe('dragging the visible area', function() {
            beforeEach(function() {
              waitsFor(function() {
                return nextAnimationFrame !== noAnimationFrame;
              });
              runs(function() {
                var left, top, _ref4;
                nextAnimationFrame();
                visibleArea = minimapElement.visibleArea;
                _ref4 = visibleArea.getBoundingClientRect(), top = _ref4.top, left = _ref4.left;
                originalTop = top;
                mousedown(visibleArea, {
                  x: left + 10,
                  y: top + 10
                });
                return mousemove(visibleArea, {
                  x: left + 10,
                  y: top + 50
                });
              });
              waitsFor(function() {
                return nextAnimationFrame !== noAnimationFrame;
              });
              return runs(function() {
                return nextAnimationFrame();
              });
            });
            afterEach(function() {
              return minimapElement.endDrag();
            });
            return it('scrolls based on a ratio adjusted to the minimap height', function() {
              var top;
              top = visibleArea.getBoundingClientRect().top;
              return expect(top).toBeCloseTo(originalTop + 40, -1);
            });
          });
        });
        return describe('when scroll past end is enabled', function() {
          beforeEach(function() {
            atom.config.set('editor.scrollPastEnd', true);
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return describe('dragging the visible area', function() {
            var originalTop, _ref3;
            _ref3 = [], visibleArea = _ref3[0], originalTop = _ref3[1];
            beforeEach(function() {
              var left, top, _ref4;
              visibleArea = minimapElement.visibleArea;
              _ref4 = visibleArea.getBoundingClientRect(), top = _ref4.top, left = _ref4.left;
              originalTop = top;
              mousedown(visibleArea, {
                x: left + 10,
                y: top + 10
              });
              mousemove(visibleArea, {
                x: left + 10,
                y: top + 50
              });
              waitsFor(function() {
                return nextAnimationFrame !== noAnimationFrame;
              });
              return runs(function() {
                return nextAnimationFrame();
              });
            });
            afterEach(function() {
              return minimapElement.endDrag();
            });
            return it('scrolls the editor so that the visible area was moved down by 40 pixels', function() {
              var top;
              top = visibleArea.getBoundingClientRect().top;
              return expect(top).toBeCloseTo(originalTop + 40, -1);
            });
          });
        });
      });
      describe('when the model is a stand-alone minimap', function() {
        beforeEach(function() {
          return minimap.setStandAlone(true);
        });
        it('has a stand-alone attribute', function() {
          return expect(minimapElement.hasAttribute('stand-alone')).toBeTruthy();
        });
        it('sets the minimap size when measured', function() {
          minimapElement.measureHeightAndWidth();
          expect(minimap.width).toEqual(minimapElement.clientWidth);
          return expect(minimap.height).toEqual(minimapElement.clientHeight);
        });
        it('removes the controls div', function() {
          return expect(minimapElement.shadowRoot.querySelector('.minimap-controls')).toBeNull();
        });
        it('removes the visible area', function() {
          return expect(minimapElement.visibleArea).toBeUndefined();
        });
        it('removes the quick settings button', function() {
          atom.config.set('minimap.displayPluginsControls', true);
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            return expect(minimapElement.openQuickSettings).toBeUndefined();
          });
        });
        it('removes the scroll indicator', function() {
          editor.setText(mediumSample);
          editorElement.setScrollTop(50);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          runs(function() {
            nextAnimationFrame();
            return atom.config.set('minimap.minimapScrollIndicator', true);
          });
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            nextAnimationFrame();
            return expect(minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator')).toBeNull();
          });
        });
        describe('pressing the mouse on the minimap canvas', function() {
          beforeEach(function() {
            var t;
            jasmineContent.appendChild(minimapElement);
            t = 0;
            spyOn(minimapElement, 'getTime').andCallFake(function() {
              var n;
              n = t;
              t += 100;
              return n;
            });
            spyOn(minimapElement, 'requestUpdate').andCallFake(function() {});
            atom.config.set('minimap.scrollAnimation', false);
            canvas = minimapElement.canvas;
            return mousedown(canvas);
          });
          return it('does not scroll the editor to the line below the mouse', function() {
            return expect(editorElement.getScrollTop()).toEqual(1000);
          });
        });
        return describe('and is changed to be a classical minimap again', function() {
          beforeEach(function() {
            atom.config.set('minimap.displayPluginsControls', true);
            atom.config.set('minimap.minimapScrollIndicator', true);
            return minimap.setStandAlone(false);
          });
          return it('recreates the destroyed elements', function() {
            expect(minimapElement.shadowRoot.querySelector('.minimap-controls')).toExist();
            expect(minimapElement.shadowRoot.querySelector('.minimap-visible-area')).toExist();
            expect(minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator')).toExist();
            return expect(minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings')).toExist();
          });
        });
      });
      describe('when the model is destroyed', function() {
        beforeEach(function() {
          return minimap.destroy();
        });
        it('detaches itself from its parent', function() {
          return expect(minimapElement.parentNode).toBeNull();
        });
        return it('stops the DOM polling interval', function() {
          spyOn(minimapElement, 'pollDOM');
          sleep(200);
          return runs(function() {
            return expect(minimapElement.pollDOM).not.toHaveBeenCalled();
          });
        });
      });
      describe('when the atom styles are changed', function() {
        beforeEach(function() {
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          runs(function() {
            var styleNode;
            nextAnimationFrame();
            spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
            spyOn(minimapElement, 'invalidateDOMStylesCache').andCallThrough();
            styleNode = document.createElement('style');
            styleNode.textContent = 'body{ color: #233; }';
            return atom.styles.emitter.emit('did-add-style-element', styleNode);
          });
          return waitsFor(function() {
            return minimapElement.frameRequested;
          });
        });
        return it('forces a refresh with cache invalidation', function() {
          expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
          return expect(minimapElement.invalidateDOMStylesCache).toHaveBeenCalled();
        });
      });
      describe('when minimap.textOpacity is changed', function() {
        beforeEach(function() {
          spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
          atom.config.set('minimap.textOpacity', 0.3);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        return it('requests a complete update', function() {
          return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
        });
      });
      describe('when minimap.displayCodeHighlights is changed', function() {
        beforeEach(function() {
          spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
          atom.config.set('minimap.displayCodeHighlights', true);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        return it('requests a complete update', function() {
          return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
        });
      });
      describe('when minimap.charWidth is changed', function() {
        beforeEach(function() {
          spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
          atom.config.set('minimap.charWidth', 1);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        return it('requests a complete update', function() {
          return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
        });
      });
      describe('when minimap.charHeight is changed', function() {
        beforeEach(function() {
          spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
          atom.config.set('minimap.charHeight', 1);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        return it('requests a complete update', function() {
          return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
        });
      });
      describe('when minimap.interline is changed', function() {
        beforeEach(function() {
          spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
          atom.config.set('minimap.interline', 2);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        return it('requests a complete update', function() {
          return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
        });
      });
      describe('when minimap.displayMinimapOnLeft setting is true', function() {
        it('moves the attached minimap to the left', function() {
          atom.config.set('minimap.displayMinimapOnLeft', true);
          return expect(minimapElement.classList.contains('left')).toBeTruthy();
        });
        return describe('when the minimap is not attached yet', function() {
          beforeEach(function() {
            editor = atom.workspace.buildTextEditor({});
            editorElement = atom.views.getView(editor);
            editorElement.setHeight(50);
            editor.setLineHeightInPixels(10);
            minimap = new Minimap({
              textEditor: editor
            });
            minimapElement = atom.views.getView(minimap);
            jasmineContent.insertBefore(editorElement, jasmineContent.firstChild);
            atom.config.set('minimap.displayMinimapOnLeft', true);
            return minimapElement.attach();
          });
          return it('moves the attached minimap to the left', function() {
            return expect(minimapElement.classList.contains('left')).toBeTruthy();
          });
        });
      });
      describe('when minimap.adjustMinimapWidthToSoftWrap is true', function() {
        var minimapWidth;
        minimapWidth = [][0];
        beforeEach(function() {
          minimapWidth = minimapElement.offsetWidth;
          atom.config.set('editor.softWrap', true);
          atom.config.set('editor.softWrapAtPreferredLineLength', true);
          atom.config.set('editor.preferredLineLength', 2);
          atom.config.set('minimap.adjustMinimapWidthToSoftWrap', true);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        it('adjusts the width of the minimap canvas', function() {
          return expect(minimapElement.canvas.width / devicePixelRatio).toEqual(4);
        });
        it('offsets the minimap by the difference', function() {
          expect(realOffsetLeft(minimapElement)).toBeCloseTo(editorElement.clientWidth - 4, -1);
          return expect(minimapElement.clientWidth).toEqual(4);
        });
        describe('the dom polling routine', function() {
          return it('does not change the value', function() {
            atom.views.performDocumentPoll();
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              return expect(minimapElement.canvas.width / devicePixelRatio).toEqual(4);
            });
          });
        });
        describe('when the editor is resized', function() {
          beforeEach(function() {
            atom.config.set('editor.preferredLineLength', 6);
            editorElement.style.width = '100px';
            editorElement.style.height = '100px';
            atom.views.performDocumentPoll();
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('makes the minimap smaller than soft wrap', function() {
            expect(minimapElement.offsetWidth).toBeCloseTo(12, -1);
            return expect(minimapElement.style.marginRight).toEqual('');
          });
        });
        describe('and when minimap.minimapScrollIndicator setting is true', function() {
          beforeEach(function() {
            editor.setText(mediumSample);
            editorElement.setScrollTop(50);
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            runs(function() {
              nextAnimationFrame();
              return atom.config.set('minimap.minimapScrollIndicator', true);
            });
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('offsets the scroll indicator by the difference', function() {
            var indicator;
            indicator = minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator');
            return expect(realOffsetLeft(indicator)).toBeCloseTo(2, -1);
          });
        });
        describe('and when minimap.displayPluginsControls setting is true', function() {
          beforeEach(function() {
            return atom.config.set('minimap.displayPluginsControls', true);
          });
          return it('offsets the scroll indicator by the difference', function() {
            var openQuickSettings;
            openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
            return expect(realOffsetLeft(openQuickSettings)).not.toBeCloseTo(2, -1);
          });
        });
        describe('and then disabled', function() {
          beforeEach(function() {
            atom.config.set('minimap.adjustMinimapWidthToSoftWrap', false);
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('adjusts the width of the minimap', function() {
            expect(minimapElement.offsetWidth).toBeCloseTo(editorElement.offsetWidth / 10, -1);
            return expect(minimapElement.style.width).toEqual('');
          });
        });
        return describe('and when preferredLineLength >= 16384', function() {
          beforeEach(function() {
            atom.config.set('editor.preferredLineLength', 16384);
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('adjusts the width of the minimap', function() {
            expect(minimapElement.offsetWidth).toBeCloseTo(editorElement.offsetWidth / 10, -1);
            return expect(minimapElement.style.width).toEqual('');
          });
        });
      });
      describe('when minimap.minimapScrollIndicator setting is true', function() {
        beforeEach(function() {
          editor.setText(mediumSample);
          editorElement.setScrollTop(50);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          runs(function() {
            return nextAnimationFrame();
          });
          return atom.config.set('minimap.minimapScrollIndicator', true);
        });
        it('adds a scroll indicator in the element', function() {
          return expect(minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator')).toExist();
        });
        describe('and then deactivated', function() {
          return it('removes the scroll indicator from the element', function() {
            atom.config.set('minimap.minimapScrollIndicator', false);
            return expect(minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator')).not.toExist();
          });
        });
        describe('on update', function() {
          beforeEach(function() {
            var height;
            height = editorElement.getHeight();
            editorElement.style.height = '500px';
            atom.views.performDocumentPoll();
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('adjusts the size and position of the indicator', function() {
            var height, indicator, scroll;
            indicator = minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator');
            height = editorElement.getHeight() * (editorElement.getHeight() / minimap.getHeight());
            scroll = (editorElement.getHeight() - height) * minimap.getTextEditorScrollRatio();
            expect(indicator.offsetHeight).toBeCloseTo(height, 0);
            return expect(realOffsetTop(indicator)).toBeCloseTo(scroll, 0);
          });
        });
        return describe('when the minimap cannot scroll', function() {
          beforeEach(function() {
            editor.setText(smallSample);
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          it('removes the scroll indicator', function() {
            return expect(minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator')).not.toExist();
          });
          return describe('and then can scroll again', function() {
            beforeEach(function() {
              editor.setText(largeSample);
              waitsFor(function() {
                return minimapElement.frameRequested;
              });
              return runs(function() {
                return nextAnimationFrame();
              });
            });
            return it('attaches the scroll indicator', function() {
              return waitsFor(function() {
                return minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator');
              });
            });
          });
        });
      });
      describe('when minimap.absoluteMode setting is true', function() {
        beforeEach(function() {
          return atom.config.set('minimap.absoluteMode', true);
        });
        it('adds a absolute class to the minimap element', function() {
          return expect(minimapElement.classList.contains('absolute')).toBeTruthy();
        });
        return describe('when minimap.displayMinimapOnLeft setting is true', function() {
          return it('also adds a left class to the minimap element', function() {
            atom.config.set('minimap.displayMinimapOnLeft', true);
            expect(minimapElement.classList.contains('absolute')).toBeTruthy();
            return expect(minimapElement.classList.contains('left')).toBeTruthy();
          });
        });
      });
      return describe('when minimap.displayPluginsControls setting is true', function() {
        var openQuickSettings, quickSettingsElement, workspaceElement, _ref3;
        _ref3 = [], openQuickSettings = _ref3[0], quickSettingsElement = _ref3[1], workspaceElement = _ref3[2];
        beforeEach(function() {
          return atom.config.set('minimap.displayPluginsControls', true);
        });
        it('has a div to open the quick settings', function() {
          return expect(minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings')).toExist();
        });
        describe('clicking on the div', function() {
          beforeEach(function() {
            workspaceElement = atom.views.getView(atom.workspace);
            jasmineContent.appendChild(workspaceElement);
            openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
            mousedown(openQuickSettings);
            return quickSettingsElement = workspaceElement.querySelector('minimap-quick-settings');
          });
          afterEach(function() {
            return minimapElement.quickSettingsElement.destroy();
          });
          it('opens the quick settings view', function() {
            return expect(quickSettingsElement).toExist();
          });
          return it('positions the quick settings view next to the minimap', function() {
            var minimapBounds, settingsBounds;
            minimapBounds = minimapElement.canvas.getBoundingClientRect();
            settingsBounds = quickSettingsElement.getBoundingClientRect();
            expect(realOffsetTop(quickSettingsElement)).toBeCloseTo(minimapBounds.top, 0);
            return expect(realOffsetLeft(quickSettingsElement)).toBeCloseTo(minimapBounds.left - settingsBounds.width, 0);
          });
        });
        describe('when the displayMinimapOnLeft setting is enabled', function() {
          return describe('clicking on the div', function() {
            beforeEach(function() {
              atom.config.set('minimap.displayMinimapOnLeft', true);
              workspaceElement = atom.views.getView(atom.workspace);
              jasmineContent.appendChild(workspaceElement);
              openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
              mousedown(openQuickSettings);
              return quickSettingsElement = workspaceElement.querySelector('minimap-quick-settings');
            });
            afterEach(function() {
              return minimapElement.quickSettingsElement.destroy();
            });
            return it('positions the quick settings view next to the minimap', function() {
              var minimapBounds, settingsBounds;
              minimapBounds = minimapElement.canvas.getBoundingClientRect();
              settingsBounds = quickSettingsElement.getBoundingClientRect();
              expect(realOffsetTop(quickSettingsElement)).toBeCloseTo(minimapBounds.top, 0);
              return expect(realOffsetLeft(quickSettingsElement)).toBeCloseTo(minimapBounds.right, 0);
            });
          });
        });
        describe('when the adjustMinimapWidthToSoftWrap setting is enabled', function() {
          var controls;
          controls = [][0];
          beforeEach(function() {
            atom.config.set('editor.softWrap', true);
            atom.config.set('editor.softWrapAtPreferredLineLength', true);
            atom.config.set('editor.preferredLineLength', 2);
            atom.config.set('minimap.adjustMinimapWidthToSoftWrap', true);
            nextAnimationFrame();
            controls = minimapElement.shadowRoot.querySelector('.minimap-controls');
            openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
            editorElement.style.width = '1024px';
            atom.views.performDocumentPoll();
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          it('adjusts the size of the control div to fit in the minimap', function() {
            return expect(controls.clientWidth).toEqual(minimapElement.canvas.clientWidth / devicePixelRatio);
          });
          it('positions the controls div over the canvas', function() {
            var canvasRect, controlsRect;
            controlsRect = controls.getBoundingClientRect();
            canvasRect = minimapElement.canvas.getBoundingClientRect();
            expect(controlsRect.left).toEqual(canvasRect.left);
            return expect(controlsRect.right).toEqual(canvasRect.right);
          });
          return describe('when the displayMinimapOnLeft setting is enabled', function() {
            beforeEach(function() {
              return atom.config.set('minimap.displayMinimapOnLeft', true);
            });
            it('adjusts the size of the control div to fit in the minimap', function() {
              return expect(controls.clientWidth).toEqual(minimapElement.canvas.clientWidth / devicePixelRatio);
            });
            it('positions the controls div over the canvas', function() {
              var canvasRect, controlsRect;
              controlsRect = controls.getBoundingClientRect();
              canvasRect = minimapElement.canvas.getBoundingClientRect();
              expect(controlsRect.left).toEqual(canvasRect.left);
              return expect(controlsRect.right).toEqual(canvasRect.right);
            });
            return describe('clicking on the div', function() {
              beforeEach(function() {
                workspaceElement = atom.views.getView(atom.workspace);
                jasmineContent.appendChild(workspaceElement);
                openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
                mousedown(openQuickSettings);
                return quickSettingsElement = workspaceElement.querySelector('minimap-quick-settings');
              });
              afterEach(function() {
                return minimapElement.quickSettingsElement.destroy();
              });
              return it('positions the quick settings view next to the minimap', function() {
                var minimapBounds, settingsBounds;
                minimapBounds = minimapElement.canvas.getBoundingClientRect();
                settingsBounds = quickSettingsElement.getBoundingClientRect();
                expect(realOffsetTop(quickSettingsElement)).toBeCloseTo(minimapBounds.top, 0);
                return expect(realOffsetLeft(quickSettingsElement)).toBeCloseTo(minimapBounds.right, 0);
              });
            });
          });
        });
        describe('when the quick settings view is open', function() {
          beforeEach(function() {
            workspaceElement = atom.views.getView(atom.workspace);
            jasmineContent.appendChild(workspaceElement);
            openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
            mousedown(openQuickSettings);
            return quickSettingsElement = workspaceElement.querySelector('minimap-quick-settings');
          });
          it('sets the on right button active', function() {
            return expect(quickSettingsElement.querySelector('.btn.selected:last-child')).toExist();
          });
          describe('clicking on the code highlight item', function() {
            beforeEach(function() {
              var item;
              item = quickSettingsElement.querySelector('li.code-highlights');
              return mousedown(item);
            });
            it('toggles the code highlights on the minimap element', function() {
              return expect(minimapElement.displayCodeHighlights).toBeTruthy();
            });
            return it('requests an update', function() {
              return expect(minimapElement.frameRequested).toBeTruthy();
            });
          });
          describe('clicking on the absolute mode item', function() {
            beforeEach(function() {
              var item;
              item = quickSettingsElement.querySelector('li.absolute-mode');
              return mousedown(item);
            });
            return it('toggles the absolute-mode setting', function() {
              expect(atom.config.get('minimap.absoluteMode')).toBeTruthy();
              return expect(minimapElement.absoluteMode).toBeTruthy();
            });
          });
          describe('clicking on the on left button', function() {
            beforeEach(function() {
              var item;
              item = quickSettingsElement.querySelector('.btn:first-child');
              return mousedown(item);
            });
            it('toggles the displayMinimapOnLeft setting', function() {
              return expect(atom.config.get('minimap.displayMinimapOnLeft')).toBeTruthy();
            });
            return it('changes the buttons activation state', function() {
              expect(quickSettingsElement.querySelector('.btn.selected:last-child')).not.toExist();
              return expect(quickSettingsElement.querySelector('.btn.selected:first-child')).toExist();
            });
          });
          describe('core:move-left', function() {
            beforeEach(function() {
              return atom.commands.dispatch(quickSettingsElement, 'core:move-left');
            });
            it('toggles the displayMinimapOnLeft setting', function() {
              return expect(atom.config.get('minimap.displayMinimapOnLeft')).toBeTruthy();
            });
            return it('changes the buttons activation state', function() {
              expect(quickSettingsElement.querySelector('.btn.selected:last-child')).not.toExist();
              return expect(quickSettingsElement.querySelector('.btn.selected:first-child')).toExist();
            });
          });
          describe('core:move-right when the minimap is on the right', function() {
            beforeEach(function() {
              atom.config.set('minimap.displayMinimapOnLeft', true);
              return atom.commands.dispatch(quickSettingsElement, 'core:move-right');
            });
            it('toggles the displayMinimapOnLeft setting', function() {
              return expect(atom.config.get('minimap.displayMinimapOnLeft')).toBeFalsy();
            });
            return it('changes the buttons activation state', function() {
              expect(quickSettingsElement.querySelector('.btn.selected:first-child')).not.toExist();
              return expect(quickSettingsElement.querySelector('.btn.selected:last-child')).toExist();
            });
          });
          describe('clicking on the open settings button again', function() {
            beforeEach(function() {
              return mousedown(openQuickSettings);
            });
            it('closes the quick settings view', function() {
              return expect(workspaceElement.querySelector('minimap-quick-settings')).not.toExist();
            });
            return it('removes the view from the element', function() {
              return expect(minimapElement.quickSettingsElement).toBeNull();
            });
          });
          return describe('when an external event destroys the view', function() {
            beforeEach(function() {
              return minimapElement.quickSettingsElement.destroy();
            });
            return it('removes the view reference from the element', function() {
              return expect(minimapElement.quickSettingsElement).toBeNull();
            });
          });
        });
        describe('then disabling it', function() {
          beforeEach(function() {
            return atom.config.set('minimap.displayPluginsControls', false);
          });
          return it('removes the div', function() {
            return expect(minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings')).not.toExist();
          });
        });
        return describe('with plugins registered in the package', function() {
          var minimapPackage, pluginA, pluginB, _ref4;
          _ref4 = [], minimapPackage = _ref4[0], pluginA = _ref4[1], pluginB = _ref4[2];
          beforeEach(function() {
            waitsForPromise(function() {
              return atom.packages.activatePackage('minimap').then(function(pkg) {
                return minimapPackage = pkg.mainModule;
              });
            });
            return runs(function() {
              var Plugin;
              Plugin = (function() {
                function Plugin() {}

                Plugin.prototype.active = false;

                Plugin.prototype.activatePlugin = function() {
                  return this.active = true;
                };

                Plugin.prototype.deactivatePlugin = function() {
                  return this.active = false;
                };

                Plugin.prototype.isActive = function() {
                  return this.active;
                };

                return Plugin;

              })();
              pluginA = new Plugin;
              pluginB = new Plugin;
              minimapPackage.registerPlugin('dummyA', pluginA);
              minimapPackage.registerPlugin('dummyB', pluginB);
              workspaceElement = atom.views.getView(atom.workspace);
              jasmineContent.appendChild(workspaceElement);
              openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
              mousedown(openQuickSettings);
              return quickSettingsElement = workspaceElement.querySelector('minimap-quick-settings');
            });
          });
          it('creates one list item for each registered plugin', function() {
            return expect(quickSettingsElement.querySelectorAll('li').length).toEqual(5);
          });
          it('selects the first item of the list', function() {
            return expect(quickSettingsElement.querySelector('li.selected:first-child')).toExist();
          });
          describe('core:confirm', function() {
            beforeEach(function() {
              return atom.commands.dispatch(quickSettingsElement, 'core:confirm');
            });
            it('disable the plugin of the selected item', function() {
              return expect(pluginA.isActive()).toBeFalsy();
            });
            describe('triggered a second time', function() {
              beforeEach(function() {
                return atom.commands.dispatch(quickSettingsElement, 'core:confirm');
              });
              return it('enable the plugin of the selected item', function() {
                return expect(pluginA.isActive()).toBeTruthy();
              });
            });
            describe('on the code highlight item', function() {
              var initial;
              initial = [][0];
              beforeEach(function() {
                initial = minimapElement.displayCodeHighlights;
                atom.commands.dispatch(quickSettingsElement, 'core:move-down');
                atom.commands.dispatch(quickSettingsElement, 'core:move-down');
                return atom.commands.dispatch(quickSettingsElement, 'core:confirm');
              });
              return it('toggles the code highlights on the minimap element', function() {
                return expect(minimapElement.displayCodeHighlights).toEqual(!initial);
              });
            });
            return describe('on the absolute mode item', function() {
              var initial;
              initial = [][0];
              beforeEach(function() {
                initial = atom.config.get('minimap.absoluteMode');
                atom.commands.dispatch(quickSettingsElement, 'core:move-down');
                atom.commands.dispatch(quickSettingsElement, 'core:move-down');
                atom.commands.dispatch(quickSettingsElement, 'core:move-down');
                return atom.commands.dispatch(quickSettingsElement, 'core:confirm');
              });
              return it('toggles the code highlights on the minimap element', function() {
                return expect(atom.config.get('minimap.absoluteMode')).toEqual(!initial);
              });
            });
          });
          describe('core:move-down', function() {
            beforeEach(function() {
              return atom.commands.dispatch(quickSettingsElement, 'core:move-down');
            });
            it('selects the second item', function() {
              return expect(quickSettingsElement.querySelector('li.selected:nth-child(2)')).toExist();
            });
            describe('reaching a separator', function() {
              beforeEach(function() {
                return atom.commands.dispatch(quickSettingsElement, 'core:move-down');
              });
              return it('moves past the separator', function() {
                return expect(quickSettingsElement.querySelector('li.code-highlights.selected')).toExist();
              });
            });
            return describe('then core:move-up', function() {
              beforeEach(function() {
                return atom.commands.dispatch(quickSettingsElement, 'core:move-up');
              });
              return it('selects again the first item of the list', function() {
                return expect(quickSettingsElement.querySelector('li.selected:first-child')).toExist();
              });
            });
          });
          return describe('core:move-up', function() {
            beforeEach(function() {
              return atom.commands.dispatch(quickSettingsElement, 'core:move-up');
            });
            it('selects the last item', function() {
              return expect(quickSettingsElement.querySelector('li.selected:last-child')).toExist();
            });
            describe('reaching a separator', function() {
              beforeEach(function() {
                atom.commands.dispatch(quickSettingsElement, 'core:move-up');
                return atom.commands.dispatch(quickSettingsElement, 'core:move-up');
              });
              return it('moves past the separator', function() {
                return expect(quickSettingsElement.querySelector('li.selected:nth-child(2)')).toExist();
              });
            });
            return describe('then core:move-down', function() {
              beforeEach(function() {
                return atom.commands.dispatch(quickSettingsElement, 'core:move-down');
              });
              return it('selects again the first item of the list', function() {
                return expect(quickSettingsElement.querySelector('li.selected:first-child')).toExist();
              });
            });
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWluaW1hcC9zcGVjL21pbmltYXAtZWxlbWVudC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzS0FBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxnQkFBUixDQUZWLENBQUE7O0FBQUEsRUFHQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx3QkFBUixDQUhqQixDQUFBOztBQUFBLEVBSUMsYUFBYyxPQUFBLENBQVEscUJBQVIsRUFBZCxVQUpELENBQUE7O0FBQUEsRUFLQSxPQUFxRSxPQUFBLENBQVEsa0JBQVIsQ0FBckUsRUFBQyxpQkFBQSxTQUFELEVBQVksaUJBQUEsU0FBWixFQUF1QixlQUFBLE9BQXZCLEVBQWdDLGtCQUFBLFVBQWhDLEVBQTRDLGtCQUFBLFVBQTVDLEVBQXdELGlCQUFBLFNBTHhELENBQUE7O0FBQUEsRUFPQSxhQUFBLEdBQWdCLFNBQUMsQ0FBRCxHQUFBO1dBR2QsQ0FBQyxDQUFDLFVBSFk7RUFBQSxDQVBoQixDQUFBOztBQUFBLEVBWUEsY0FBQSxHQUFpQixTQUFDLENBQUQsR0FBQTtXQUdmLENBQUMsQ0FBQyxXQUhhO0VBQUEsQ0FaakIsQ0FBQTs7QUFBQSxFQWlCQSxTQUFBLEdBQVksU0FBQyxJQUFELEdBQUE7V0FBVSxJQUFJLENBQUMsV0FBTCxHQUFtQixDQUFuQixJQUF3QixJQUFJLENBQUMsWUFBTCxHQUFvQixFQUF0RDtFQUFBLENBakJaLENBQUE7O0FBQUEsRUFzQkEsS0FBQSxHQUFRLFNBQUMsUUFBRCxHQUFBO0FBQ04sUUFBQSxDQUFBO0FBQUEs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

//# sourceURL=/Users/anas/.atom/packages/minimap/spec/minimap-element-spec.coffee
