(function() {
  describe('Linter Behavior', function() {
    var bottomContainer, getLinter, getMessage, linter, linterState, trigger;
    linter = null;
    linterState = null;
    bottomContainer = null;
    getLinter = require('./common').getLinter;
    trigger = function(el, name) {
      var event;
      event = document.createEvent('HTMLEvents');
      event.initEvent(name, true, false);
      return el.dispatchEvent(event);
    };
    getMessage = function(type, filePath) {
      return {
        type: type,
        text: 'Some Message',
        filePath: filePath,
        range: [[0, 0], [1, 1]]
      };
    };
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function() {
          linter = atom.packages.getActivePackage('linter').mainModule.instance;
          linterState = linter.state;
          return bottomContainer = linter.views.bottomContainer;
        });
      });
    });
    describe('Bottom Tabs', function() {
      it('defaults to file tab', function() {
        return expect(linterState.scope).toBe('File');
      });
      it('changes tab on click', function() {
        trigger(bottomContainer.getTab('Project'), 'click');
        return expect(linterState.scope).toBe('Project');
      });
      it('toggles panel visibility on click', function() {
        linter.views.panel.setMessages({
          added: [getMessage('Error')],
          removed: []
        });
        trigger(bottomContainer.getTab('Project'), 'click');
        expect(linter.views.panel.getVisibility()).toBe(true);
        trigger(bottomContainer.getTab('Project'), 'click');
        return expect(linter.views.panel.getVisibility()).toBe(false);
      });
      it('re-enables panel when another tab is clicked', function() {
        linter.views.panel.setMessages({
          added: [getMessage('Error')],
          removed: []
        });
        trigger(bottomContainer.getTab('File'), 'click');
        expect(linter.views.panel.getVisibility()).toBe(false);
        trigger(bottomContainer.getTab('Project'), 'click');
        return expect(linter.views.panel.getVisibility()).toBe(true);
      });
      return it('updates count on pane change', function() {
        var messages, provider;
        provider = getLinter();
        expect(bottomContainer.getTab('File').count).toBe(0);
        messages = [getMessage('Error', __dirname + '/fixtures/file.txt')];
        linter.setMessages(provider, messages);
        linter.messages.updatePublic();
        return waitsForPromise(function() {
          return atom.workspace.open('file.txt').then(function() {
            expect(bottomContainer.getTab('File').count).toBe(1);
            expect(linter.views.panel.getVisibility()).toBe(true);
            return atom.workspace.open('/tmp/non-existing-file');
          }).then(function() {
            expect(bottomContainer.getTab('File').count).toBe(0);
            return expect(linter.views.panel.getVisibility()).toBe(false);
          });
        });
      });
    });
    return describe('Markers', function() {
      return it('automatically marks files when they are opened if they have any markers', function() {
        var messages, provider;
        provider = getLinter();
        messages = [getMessage('Error', '/etc/passwd')];
        linter.setMessages(provider, messages);
        linter.messages.updatePublic();
        return waitsForPromise(function() {
          return atom.workspace.open('/etc/passwd').then(function() {
            var activeEditor;
            activeEditor = atom.workspace.getActiveTextEditor();
            return expect(activeEditor.getMarkers().length > 0).toBe(true);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvbGludGVyLWJlaGF2aW9yLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsUUFBQSxvRUFBQTtBQUFBLElBQUEsTUFBQSxHQUFTLElBQVQsQ0FBQTtBQUFBLElBQ0EsV0FBQSxHQUFjLElBRGQsQ0FBQTtBQUFBLElBRUEsZUFBQSxHQUFrQixJQUZsQixDQUFBO0FBQUEsSUFHQyxZQUFhLE9BQUEsQ0FBUSxVQUFSLEVBQWIsU0FIRCxDQUFBO0FBQUEsSUFJQSxPQUFBLEdBQVUsU0FBQyxFQUFELEVBQUssSUFBTCxHQUFBO0FBQ1IsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsWUFBckIsQ0FBUixDQUFBO0FBQUEsTUFDQSxLQUFLLENBQUMsU0FBTixDQUFnQixJQUFoQixFQUFzQixJQUF0QixFQUE0QixLQUE1QixDQURBLENBQUE7YUFFQSxFQUFFLENBQUMsYUFBSCxDQUFpQixLQUFqQixFQUhRO0lBQUEsQ0FKVixDQUFBO0FBQUEsSUFTQSxVQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sUUFBUCxHQUFBO0FBQ1gsYUFBTztBQUFBLFFBQUMsTUFBQSxJQUFEO0FBQUEsUUFBTyxJQUFBLEVBQU0sY0FBYjtBQUFBLFFBQTZCLFVBQUEsUUFBN0I7QUFBQSxRQUF1QyxLQUFBLEVBQU8sQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVQsQ0FBOUM7T0FBUCxDQURXO0lBQUEsQ0FUYixDQUFBO0FBQUEsSUFZQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsZUFBQSxDQUFnQixTQUFB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

//# sourceURL=/Users/anas/.atom/packages/linter/spec/linter-behavior-spec.coffee
