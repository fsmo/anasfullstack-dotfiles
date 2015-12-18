"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LivereloadView = (function (_HTMLDivElement) {
  _inherits(LivereloadView, _HTMLDivElement);

  function LivereloadView() {
    _classCallCheck(this, LivereloadView);

    _get(Object.getPrototypeOf(LivereloadView.prototype), 'constructor', this).apply(this, arguments);

    this._link = null;
    this._tooltip = null;
    this._command = null;
  }

  _createClass(LivereloadView, [{
    key: 'initialize',
    value: function initialize(state) {
      var _this = this;

      // add content
      this.innerHTML = '<a href="#" data-url></a>';
      this.firstChild.addEventListener('click', function (event) {
        return _this.handleClick(event);
      }, false);

      // add classes
      this.classList.add('livereload-status', 'inline-block');

      this.url = '';
      this.text = 'Off';
      this.tooltip = '';
    }
  }, {
    key: 'attach',
    value: function attach() {
      // Register command that toggles this view
      this._command = atom.commands.add('atom-workspace', { 'livereload:toggle': this.toggle.bind(this) });
    }
  }, {
    key: 'detach',
    value: function detach() {
      this._tooltip.dispose();
      this._command.dispose();
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      return this._activated;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      try {
        this.detach();
      } catch (e) {};
      this.remove();
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      var event = new Event('toggle');
      this.dispatchEvent(event);
    }
  }, {
    key: 'handleClick',
    value: function handleClick(event) {
      event.preventDefault();
      if (this.url) {
        atom.clipboard.write(this.url, 'url');
      }
    }
  }, {
    key: 'text',
    set: function set(text) {
      this.firstChild.textContent = 'LiveReload: ' + text;
    },
    get: function get() {
      return this.firstChild.textContent;
    }
  }, {
    key: 'url',
    set: function set(url) {
      this.firstChild.dataset.url = url;
    },
    get: function get() {
      return this.firstChild.dataset.url;
    }
  }, {
    key: 'tooltip',
    set: function set(text) {
      if (this._tooltip) this._tooltip.dispose();
      this._tooltip = atom.tooltips.add(this, { title: text });
    }
  }]);

  return LivereloadView;
})(HTMLDivElement);

exports['default'] = document.registerElement('livereload-status-bar', { prototype: LivereloadView.prototype });
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2xpdmVyZWxvYWQvbGliL2xpdmVyZWxvYWQtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7Ozs7O0lBRU4sY0FBYztZQUFkLGNBQWM7O1dBQWQsY0FBYzswQkFBZCxjQUFjOzsrQkFBZCxjQUFjOztTQUNsQixLQUFLLEdBQUcsSUFBSTtTQUNaLFFBQVEsR0FBRyxJQUFJO1NBQ2YsUUFBUSxHQUFHLElBQUk7OztlQUhYLGNBQWM7O1dBS1Isb0JBQUMsS0FBSyxFQUFFOzs7O0FBRWhCLFVBQUksQ0FBQyxTQUFTLEdBQUcsMkJBQTJCLENBQUM7QUFDN0MsVUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQSxLQUFLO2VBQUksTUFBSyxXQUFXLENBQUMsS0FBSyxDQUFDO09BQUEsRUFBRSxLQUFLLENBQUMsQ0FBQzs7O0FBR25GLFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLGNBQWMsQ0FBQyxDQUFDOztBQUV4RCxVQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNkLFVBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO0FBQ2xCLFVBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0tBQ25COzs7V0FFSyxrQkFBRzs7QUFFUCxVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFFLGdCQUFnQixFQUFFLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBRSxDQUFBO0tBQ3ZHOzs7V0FFSyxrQkFBRztBQUNQLFVBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDeEIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUN6Qjs7O1dBRVEscUJBQUc7QUFDVixhQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7S0FDeEI7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSTtBQUFFLFlBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtPQUFFLENBQUMsT0FBTSxDQUFDLEVBQUMsRUFBRSxDQUFDO0FBQ2pDLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7V0FFSyxrQkFBRztBQUNQLFVBQUksS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDM0I7OztXQUVVLHFCQUFDLEtBQUssRUFBRTtBQUNqQixXQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDdkIsVUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQ1osWUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUN2QztLQUNGOzs7U0FFTyxhQUFDLElBQUksRUFBRTtBQUNiLFVBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxHQUFHLGNBQWMsR0FBRyxJQUFJLENBQUM7S0FDckQ7U0FFTyxlQUFHO0FBQ1QsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQztLQUNwQzs7O1NBRU0sYUFBQyxHQUFHLEVBQUU7QUFDWCxVQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0tBQ25DO1NBRU0sZUFBRztBQUNSLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO0tBQ3BDOzs7U0FFVSxhQUFDLElBQUksRUFBRTtBQUNoQixVQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUMzQyxVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFFLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBRSxDQUFDO0tBQzVEOzs7U0FwRUcsY0FBYztHQUFTLGNBQWM7O3FCQXVFNUIsUUFBUSxDQUFDLGVBQWUsQ0FBQyx1QkFBdUIsRUFBRSxFQUFDLFNBQVMsRUFBQyxjQUFjLENBQUMsU0FBUyxFQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbGl2ZXJlbG9hZC9saWIvbGl2ZXJlbG9hZC12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuY2xhc3MgTGl2ZXJlbG9hZFZpZXcgZXh0ZW5kcyBIVE1MRGl2RWxlbWVudCB7XG4gIF9saW5rID0gbnVsbDtcbiAgX3Rvb2x0aXAgPSBudWxsO1xuICBfY29tbWFuZCA9IG51bGw7XG5cbiAgaW5pdGlhbGl6ZShzdGF0ZSkge1xuICAgIC8vIGFkZCBjb250ZW50XG4gICAgdGhpcy5pbm5lckhUTUwgPSAnPGEgaHJlZj1cIiNcIiBkYXRhLXVybD48L2E+JztcbiAgICB0aGlzLmZpcnN0Q2hpbGQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB0aGlzLmhhbmRsZUNsaWNrKGV2ZW50KSwgZmFsc2UpO1xuXG4gICAgLy8gYWRkIGNsYXNzZXNcbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2xpdmVyZWxvYWQtc3RhdHVzJywgJ2lubGluZS1ibG9jaycpO1xuXG4gICAgdGhpcy51cmwgPSAnJztcbiAgICB0aGlzLnRleHQgPSAnT2ZmJztcbiAgICB0aGlzLnRvb2x0aXAgPSAnJztcbiAgfVxuXG4gIGF0dGFjaCgpIHtcbiAgICAvLyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICB0aGlzLl9jb21tYW5kID0gYXRvbS5jb21tYW5kcy5hZGQoICdhdG9tLXdvcmtzcGFjZScsIHsgJ2xpdmVyZWxvYWQ6dG9nZ2xlJzogdGhpcy50b2dnbGUuYmluZCh0aGlzKSB9IClcbiAgfVxuXG4gIGRldGFjaCgpIHtcbiAgICB0aGlzLl90b29sdGlwLmRpc3Bvc2UoKTtcbiAgICB0aGlzLl9jb21tYW5kLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZhdGVkO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0cnkgeyB0aGlzLmRldGFjaCgpIH0gY2F0Y2goZSl7fTtcbiAgICB0aGlzLnJlbW92ZSgpO1xuICB9XG5cbiAgdG9nZ2xlKCkge1xuICAgIHZhciBldmVudCA9IG5ldyBFdmVudCgndG9nZ2xlJyk7XG4gICAgdGhpcy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAodGhpcy51cmwpIHtcbiAgICAgIGF0b20uY2xpcGJvYXJkLndyaXRlKHRoaXMudXJsLCAndXJsJyk7XG4gICAgfVxuICB9XG5cbiAgc2V0IHRleHQodGV4dCkge1xuICAgIHRoaXMuZmlyc3RDaGlsZC50ZXh0Q29udGVudCA9ICdMaXZlUmVsb2FkOiAnICsgdGV4dDtcbiAgfVxuXG4gIGdldCB0ZXh0KCkge1xuICAgIHJldHVybiB0aGlzLmZpcnN0Q2hpbGQudGV4dENvbnRlbnQ7XG4gIH1cblxuICBzZXQgdXJsKHVybCkge1xuICAgIHRoaXMuZmlyc3RDaGlsZC5kYXRhc2V0LnVybCA9IHVybDtcbiAgfVxuXG4gIGdldCB1cmwoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlyc3RDaGlsZC5kYXRhc2V0LnVybDtcbiAgfVxuXG4gIHNldCB0b29sdGlwKHRleHQpIHtcbiAgICBpZiAodGhpcy5fdG9vbHRpcCkgdGhpcy5fdG9vbHRpcC5kaXNwb3NlKCk7XG4gICAgdGhpcy5fdG9vbHRpcCA9IGF0b20udG9vbHRpcHMuYWRkKCB0aGlzLCB7IHRpdGxlOiB0ZXh0IH0gKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2xpdmVyZWxvYWQtc3RhdHVzLWJhcicsIHtwcm90b3R5cGU6TGl2ZXJlbG9hZFZpZXcucHJvdG90eXBlfSk7XG4iXX0=
//# sourceURL=/Users/anas/.atom/packages/livereload/lib/livereload-view.js
