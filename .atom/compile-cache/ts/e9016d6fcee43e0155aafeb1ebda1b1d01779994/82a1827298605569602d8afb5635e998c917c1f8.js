// Some docs
// http://www.html5rocks.com/en/tutorials/webcomponents/customelements/ (look at lifecycle callback methods)
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TsView = (function (_super) {
    __extends(TsView, _super);
    function TsView() {
        _super.apply(this, arguments);
    }
    TsView.prototype.createdCallback = function () {
        var preview = this.innerText;
        this.innerText = "";
        // Based on markdown editor 
        // https://github.com/atom/markdown-preview/blob/2bcbadac3980f1aeb455f7078bd1fdfb4e6fe6b1/lib/renderer.coffee#L111
        var editorElement = this.editorElement = document.createElement('atom-text-editor');
        editorElement.setAttributeNode(document.createAttribute('gutter-hidden'));
        editorElement.removeAttribute('tabindex'); // make read-only
        var editor = this.editor = editorElement.getModel();
        editor.getDecorations({ class: 'cursor-line', type: 'line' })[0].destroy(); // remove the default selection of a line in each editor
        editor.setText(preview);
        var grammar = atom.grammars.grammarForScopeName("source.ts");
        editor.setGrammar(grammar);
        editor.setSoftWrapped(true);
        this.appendChild(editorElement);
    };
    // API 
    TsView.prototype.text = function (text) {
        this.editor.setText(text);
    };
    return TsView;
})(HTMLElement);
exports.TsView = TsView;
document.registerElement('ts-view', TsView);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXRvbS10eXBlc2NyaXB0L2xpYi9tYWluL2F0b20vY29tcG9uZW50cy90cy12aWV3LnRzIiwic291cmNlcyI6WyIvVXNlcnMvYW5hcy8uYXRvbS9wYWNrYWdlcy9hdG9tLXR5cGVzY3JpcHQvbGliL21haW4vYXRvbS9jb21wb25lbnRzL3RzLXZpZXcudHMiXSwibmFtZXMiOlsiVHNWaWV3IiwiVHNWaWV3LmNvbnN0cnVjdG9yIiwiVHNWaWV3LmNyZWF0ZWRDYWxsYmFjayIsIlRzVmlldy50ZXh0Il0sIm1hcHBpbmdzIjoiQUFBQSxZQUFZO0FBQ1osNEdBQTRHOzs7Ozs7O0FBRTVHLElBQWEsTUFBTTtJQUFTQSxVQUFmQSxNQUFNQSxVQUFvQkE7SUFBdkNBLFNBQWFBLE1BQU1BO1FBQVNDLDhCQUFXQTtJQTBCdkNBLENBQUNBO0lBdkJHRCxnQ0FBZUEsR0FBZkE7UUFDSUUsSUFBSUEsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFDN0JBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLEVBQUVBLENBQUNBO1FBSXBCQSxBQUZBQSw0QkFBNEJBO1FBQzVCQSxrSEFBa0hBO1lBQzlHQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFHQSxRQUFRQSxDQUFDQSxhQUFhQSxDQUFDQSxrQkFBa0JBLENBQUNBLENBQUNBO1FBQ3BGQSxhQUFhQSxDQUFDQSxnQkFBZ0JBLENBQUNBLFFBQVFBLENBQUNBLGVBQWVBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBLENBQUNBO1FBQzFFQSxhQUFhQSxDQUFDQSxlQUFlQSxDQUFDQSxVQUFVQSxDQUFDQSxFQUFFQSxpQkFBaUJBO1FBQzVEQSxJQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFTQSxhQUFjQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQTtRQUMzREEsTUFBTUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsRUFBRUEsS0FBS0EsRUFBRUEsYUFBYUEsRUFBRUEsSUFBSUEsRUFBRUEsTUFBTUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsRUFBRUEsRUFBRUEsd0RBQXdEQTtRQUNwSUEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFDeEJBLElBQUlBLE9BQU9BLEdBQVNBLElBQUtBLENBQUNBLFFBQVFBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQUE7UUFDbkVBLE1BQU1BLENBQUNBLFVBQVVBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO1FBQzNCQSxNQUFNQSxDQUFDQSxjQUFjQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUU1QkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0E7SUFDcENBLENBQUNBO0lBRURGLE9BQU9BO0lBQ1BBLHFCQUFJQSxHQUFKQSxVQUFLQSxJQUFZQTtRQUNiRyxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtJQUM5QkEsQ0FBQ0E7SUFDTEgsYUFBQ0E7QUFBREEsQ0FBQ0EsQUExQkQsRUFBNEIsV0FBVyxFQTBCdEM7QUExQlksY0FBTSxHQUFOLE1BMEJaLENBQUE7QUFFSyxRQUFTLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFNvbWUgZG9jc1xuLy8gaHR0cDovL3d3dy5odG1sNXJvY2tzLmNvbS9lbi90dXRvcmlhbHMvd2ViY29tcG9uZW50cy9jdXN0b21lbGVtZW50cy8gKGxvb2sgYXQgbGlmZWN5Y2xlIGNhbGxiYWNrIG1ldGhvZHMpXG5cbmV4cG9ydCBjbGFzcyBUc1ZpZXcgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgZWRpdG9yRWxlbWVudDtcbiAgICBlZGl0b3I7XG4gICAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgICAgICB2YXIgcHJldmlldyA9IHRoaXMuaW5uZXJUZXh0O1xuICAgICAgICB0aGlzLmlubmVyVGV4dCA9IFwiXCI7XG5cbiAgICAgICAgLy8gQmFzZWQgb24gbWFya2Rvd24gZWRpdG9yIFxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYXRvbS9tYXJrZG93bi1wcmV2aWV3L2Jsb2IvMmJjYmFkYWMzOTgwZjFhZWI0NTVmNzA3OGJkMWZkZmI0ZTZmZTZiMS9saWIvcmVuZGVyZXIuY29mZmVlI0wxMTFcbiAgICAgICAgdmFyIGVkaXRvckVsZW1lbnQgPSB0aGlzLmVkaXRvckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdG9tLXRleHQtZWRpdG9yJyk7XG4gICAgICAgIGVkaXRvckVsZW1lbnQuc2V0QXR0cmlidXRlTm9kZShkb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUoJ2d1dHRlci1oaWRkZW4nKSk7XG4gICAgICAgIGVkaXRvckVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpOyAvLyBtYWtlIHJlYWQtb25seVxuICAgICAgICB2YXIgZWRpdG9yID0gdGhpcy5lZGl0b3IgPSAoPGFueT5lZGl0b3JFbGVtZW50KS5nZXRNb2RlbCgpO1xuICAgICAgICBlZGl0b3IuZ2V0RGVjb3JhdGlvbnMoeyBjbGFzczogJ2N1cnNvci1saW5lJywgdHlwZTogJ2xpbmUnIH0pWzBdLmRlc3Ryb3koKTsgLy8gcmVtb3ZlIHRoZSBkZWZhdWx0IHNlbGVjdGlvbiBvZiBhIGxpbmUgaW4gZWFjaCBlZGl0b3JcbiAgICAgICAgZWRpdG9yLnNldFRleHQocHJldmlldyk7XG4gICAgICAgIHZhciBncmFtbWFyID0gKDxhbnk+YXRvbSkuZ3JhbW1hcnMuZ3JhbW1hckZvclNjb3BlTmFtZShcInNvdXJjZS50c1wiKVxuICAgICAgICBlZGl0b3Iuc2V0R3JhbW1hcihncmFtbWFyKTtcbiAgICAgICAgZWRpdG9yLnNldFNvZnRXcmFwcGVkKHRydWUpO1xuXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoZWRpdG9yRWxlbWVudCk7XG4gICAgfVxuICAgIFxuICAgIC8vIEFQSSBcbiAgICB0ZXh0KHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmVkaXRvci5zZXRUZXh0KHRleHQpO1xuICAgIH1cbn1cblxuKDxhbnk+ZG9jdW1lbnQpLnJlZ2lzdGVyRWxlbWVudCgndHMtdmlldycsIFRzVmlldyk7Il19
//# sourceURL=/Users/anas/.atom/packages/atom-typescript/lib/main/atom/components/ts-view.ts
