(function() {
  describe('directive grammar', function() {
    var grammar;
    grammar = null;
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage('angularjs');
      });
      return runs(function() {
        return grammar = atom.grammars.grammarForScopeName('text.html.angular');
      });
    });
    it('parses the grammar', function() {
      expect(grammar).toBeTruthy();
      return expect(grammar.scopeName).toBe('text.html.angular');
    });
    describe('directive attributes', function() {
      it('tokenizes ng-repeat attribute inside HTML', function() {
        var lines;
        lines = grammar.tokenizeLines('<dd ng-repeat="availability in phone.availability">{{availability}}</dd>');
        return expect(lines[0][3]).toEqual({
          value: 'ng-repeat',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
      });
      it('tokenizes ng-src and ng-click attributes inside HTML', function() {
        var lines;
        lines = grammar.tokenizeLines('<li ng-repeat="img in phone.images">\n  <img ng-src="{{img}}" ng-click="setImage(img)">\n</li>');
        expect(lines[0][3]).toEqual({
          value: 'ng-repeat',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
        expect(lines[1][4]).toEqual({
          value: 'ng-src',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
        return expect(lines[1][12]).toEqual({
          value: 'ng-click',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
      });
      it('tokenizes ng-view attribute without value inside HTML', function() {
        var lines;
        lines = grammar.tokenizeLines('<div ng-view class="view-frame"></div>');
        return expect(lines[0][3]).toEqual({
          value: 'ng-view',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
      });
      it('tokenizes capitalized ng-repeat attribute inside HTML', function() {
        var lines;
        lines = grammar.tokenizeLines('<dd NG-REPEAT="availability in phone.availability">{{availability}}</dd>');
        return expect(lines[0][3]).toEqual({
          value: 'NG-REPEAT',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
      });
      it('tokenizes ng-controller attribute in body tag', function() {
        var lines;
        lines = grammar.tokenizeLines('<body ng-controller="TestCtrl">');
        return expect(lines[0][3]).toEqual({
          value: 'ng-controller',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
      });
      it('tokenizes ng-s attribute', function() {
        var lines;
        lines = grammar.tokenizeLines('<select ng-options="color.name group by color.shade for color in colors">');
        return expect(lines[0][3]).toEqual({
          value: 'ng-options',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
      });
      return it('tokenizes ng- attributes for anchor tags', function() {
        var lines;
        lines = grammar.tokenizeLines('<a href="/url" ng-click=\'{{setImage(img)}}\'>');
        return expect(lines[0][9]).toEqual({
          value: 'ng-click',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
      });
    });
    describe('directive element', function() {
      it('tokenizes ng-include element inside HTML', function() {
        var lines;
        lines = grammar.tokenizeLines('<ng-include src=""></ng-include>');
        expect(lines[0][1]).toEqual({
          value: 'ng-include',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
        return expect(lines[0][5]).toEqual({
          value: 'ng-include',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
      });
      return it('tokenizes capitalized ng-include element inside HTML', function() {
        var lines;
        lines = grammar.tokenizeLines('<NG-INCLUDE src=""></NG-INCLUDE>');
        expect(lines[0][1]).toEqual({
          value: 'NG-INCLUDE',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
        return expect(lines[0][5]).toEqual({
          value: 'NG-INCLUDE',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
      });
    });
    describe('normalization angular tag and attribute', function() {
      it('tokenizes data- prefixed angular attributes', function() {
        var lines;
        lines = grammar.tokenizeLines('<body data-ng-controller="TestCtrl">');
        return expect(lines[0][3]).toEqual({
          value: 'data-ng-controller',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
      });
      it('tokenizes x- prefixed angular attributes', function() {
        var lines;
        lines = grammar.tokenizeLines('<body x-ng-controller="TestCtrl">');
        return expect(lines[0][3]).toEqual({
          value: 'x-ng-controller',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
      });
      it('tokenizes _ suffixed angular attributes', function() {
        var lines;
        lines = grammar.tokenizeLines('<body ng_controller="TestCtrl">');
        return expect(lines[0][3]).toEqual({
          value: 'ng_controller',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
      });
      it('tokenizes : suffixed angular attributes', function() {
        var lines;
        lines = grammar.tokenizeLines('<body ng:controller="TestCtrl">');
        return expect(lines[0][3]).toEqual({
          value: 'ng:controller',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
      });
      it('tokenizes data- prefixed angular element', function() {
        var lines;
        lines = grammar.tokenizeLines('<data-ng-include src=""></data-ng-include>');
        expect(lines[0][1]).toEqual({
          value: 'data-ng-include',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
        return expect(lines[0][5]).toEqual({
          value: 'data-ng-include',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
      });
      it('tokenizes x- prefixed angular element', function() {
        var lines;
        lines = grammar.tokenizeLines('<x-ng-include src=""></x-ng-include>');
        expect(lines[0][1]).toEqual({
          value: 'x-ng-include',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
        return expect(lines[0][5]).toEqual({
          value: 'x-ng-include',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
      });
      it('tokenizes _ suffixed angular element', function() {
        var lines;
        lines = grammar.tokenizeLines('<ng_include src=""></ng_include>');
        expect(lines[0][1]).toEqual({
          value: 'ng_include',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
        return expect(lines[0][5]).toEqual({
          value: 'ng_include',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
      });
      return it('tokenizes : suffixed angular element', function() {
        var lines;
        lines = grammar.tokenizeLines('<ng:include src=""></ng:include>');
        expect(lines[0][1]).toEqual({
          value: 'ng:include',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
        return expect(lines[0][5]).toEqual({
          value: 'ng:include',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
      });
    });
    return describe('angular expression', function() {
      it('tokenizes angular expressions in HTML tags', function() {
        var lines;
        lines = grammar.tokenizeLines('<dd>{{phone.camera.primary}}</dd>');
        expect(lines[0][3]).toEqual({
          value: '{{',
          scopes: ['text.html.angular', 'meta.tag.template.angular', 'punctuation.definition.block.begin.angular']
        });
        expect(lines[0][4]).toEqual({
          value: 'phone.camera.primary',
          scopes: ['text.html.angular', 'meta.tag.template.angular']
        });
        return expect(lines[0][5]).toEqual({
          value: '}}',
          scopes: ['text.html.angular', 'meta.tag.template.angular', 'punctuation.definition.block.end.angular']
        });
      });
      it('tokenizes angular expressions in value of attributes with double quoted', function() {
        var lines;
        lines = grammar.tokenizeLines('<li ng-repeat="phone in phones | filter:query | orderBy:orderProp"></li>');
        expect(lines[0][5]).toEqual({
          value: '"',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'punctuation.definition.string.begin.html.angular']
        });
        expect(lines[0][6]).toEqual({
          value: 'phone in phones | filter:query | orderBy:orderProp',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'meta.tag.template.angular']
        });
        return expect(lines[0][7]).toEqual({
          value: '"',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'punctuation.definition.string.end.html.angular']
        });
      });
      it('tokenizes angular expressions in value of attributes with single quoted', function() {
        var lines;
        lines = grammar.tokenizeLines('<li ng-repeat=\'img in phone.images\'>');
        expect(lines[0][5]).toEqual({
          value: '\'',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.single.html.angular', 'punctuation.definition.string.begin.html.angular']
        });
        expect(lines[0][6]).toEqual({
          value: 'img in phone.images',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.single.html.angular', 'meta.tag.template.angular']
        });
        return expect(lines[0][7]).toEqual({
          value: '\'',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.single.html.angular', 'punctuation.definition.string.end.html.angular']
        });
      });
      return it('tokenizes angular expressions in value of attributes with {{}}', function() {
        var lines;
        lines = grammar.tokenizeLines('<img ng-src="{{img}}" ng-click="{{setImage(img)}}">');
        expect(lines[0][5]).toEqual({
          value: '"',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'punctuation.definition.string.begin.html.angular']
        });
        expect(lines[0][6]).toEqual({
          value: '{{',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'meta.tag.template.angular', 'meta.tag.template.angular', 'punctuation.definition.block.begin.angular']
        });
        expect(lines[0][7]).toEqual({
          value: 'img',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'meta.tag.template.angular', 'meta.tag.template.angular']
        });
        expect(lines[0][8]).toEqual({
          value: '}}',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'meta.tag.template.angular', 'meta.tag.template.angular', 'punctuation.definition.block.end.angular']
        });
        expect(lines[0][9]).toEqual({
          value: '"',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'punctuation.definition.string.end.html.angular']
        });
        expect(lines[0][13]).toEqual({
          value: '"',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'punctuation.definition.string.begin.html.angular']
        });
        expect(lines[0][14]).toEqual({
          value: '{{',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'meta.tag.template.angular', 'meta.tag.template.angular', 'punctuation.definition.block.begin.angular']
        });
        expect(lines[0][15]).toEqual({
          value: 'setImage(img)',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'meta.tag.template.angular', 'meta.tag.template.angular']
        });
        expect(lines[0][16]).toEqual({
          value: '}}',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'meta.tag.template.angular', 'meta.tag.template.angular', 'punctuation.definition.block.end.angular']
        });
        return expect(lines[0][17]).toEqual({
          value: '"',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'punctuation.definition.string.end.html.angular']
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYW5ndWxhcmpzL3NwZWMvZ3JhbW1hci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsbUJBQVQsRUFBOEIsU0FBQSxHQUFBO0FBQzVCLFFBQUEsT0FBQTtBQUFBLElBQUEsT0FBQSxHQUFVLElBQVYsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsV0FBOUIsRUFEYztNQUFBLENBQWhCLENBQUEsQ0FBQTthQUdBLElBQUEsQ0FBSyxTQUFBLEdBQUE7ZUFDSCxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBZCxDQUFrQyxtQkFBbEMsRUFEUDtNQUFBLENBQUwsRUFKUztJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFTQSxFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLE1BQUEsTUFBQSxDQUFPLE9BQVAsQ0FBZSxDQUFDLFVBQWhCLENBQUEsQ0FBQSxDQUFBO2FBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxTQUFmLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsbUJBQS9CLEVBRnVCO0lBQUEsQ0FBekIsQ0FUQSxDQUFBO0FBQUEsSUFhQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLE1BQUEsRUFBQSxDQUFHLDJDQUFILEVBQWdELFNBQUEsR0FBQTtBQUM5QyxZQUFBLEtBQUE7QUFBQSxRQUFBLEtBQUEsR0FBUSxPQUFPLENBQUMsYUFBUixDQUFzQiwwRUFBdEIsQ0FBUixDQUFBO2VBSUEsTUFBQSxDQUFPLEtBQU0sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFB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

//# sourceURL=/Users/anas/.atom/packages/angularjs/spec/grammar-spec.coffee
