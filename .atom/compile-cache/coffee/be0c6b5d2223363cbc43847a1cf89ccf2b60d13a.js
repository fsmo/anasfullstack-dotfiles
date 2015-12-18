(function() {
  var getEditorElement;

  getEditorElement = function(callback) {
    var textEditor;
    textEditor = null;
    waitsForPromise(function() {
      return atom.project.open().then(function(e) {
        return textEditor = e;
      });
    });
    return runs(function() {
      var element;
      element = document.createElement("atom-text-editor");
      element.setModel(textEditor);
      return callback(element);
    });
  };

  module.exports = {
    getEditorElement: getEditorElement
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvdmltLXN1cnJvdW5kL3NwZWMvc3BlYy1oZWxwZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBOztBQUFBLEVBQUEsZ0JBQUEsR0FBbUIsU0FBQyxRQUFELEdBQUE7QUFDakIsUUFBQSxVQUFBO0FBQUEsSUFBQSxVQUFBLEdBQWEsSUFBYixDQUFBO0FBQUEsSUFFQSxlQUFBLENBQWdCLFNBQUEsR0FBQTthQUNkLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBYixDQUFBLENBQW1CLENBQUMsSUFBcEIsQ0FBeUIsU0FBQyxDQUFELEdBQUE7ZUFDdkIsVUFBQSxHQUFhLEVBRFU7TUFBQSxDQUF6QixFQURjO0lBQUEsQ0FBaEIsQ0FGQSxDQUFBO1dBTUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLFFBQVEsQ0FBQyxhQUFULENBQXVCLGtCQUF2QixDQUFWLENBQUE7QUFBQSxNQUNBLE9BQU8sQ0FBQyxRQUFSLENBQWlCLFVBQWpCLENBREEsQ0FBQTthQUVBLFFBQUEsQ0FBUyxPQUFULEVBSEc7SUFBQSxDQUFMLEVBUGlCO0VBQUEsQ0FBbkIsQ0FBQTs7QUFBQSxFQVlBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQUEsSUFBRSxrQkFBQSxnQkFBRjtHQVpqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/anas/.atom/packages/vim-surround/spec/spec-helper.coffee
