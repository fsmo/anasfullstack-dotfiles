(function() {
  var assert;

  assert = require('assert');

  describe('Top level describe', function() {
    describe('Nested describe', function() {
      it('is successful', function() {
        return assert(true);
      });
      return it('fails', function() {
        return assert(false);
      });
    });
    return describe('Other nested', function() {
      it('is also successful', function() {
        return assert(true);
      });
      return it('is successful\t\nwith\' []()"&%', function() {
        return assert(true);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbW9jaGEtdGVzdC1ydW5uZXIvdGVzdC9zYW1wbGUtdGVzdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsTUFBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQUFULENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQSxHQUFBO0FBRTdCLElBQUEsUUFBQSxDQUFTLGlCQUFULEVBQTRCLFNBQUEsR0FBQTtBQUUxQixNQUFBLEVBQUEsQ0FBRyxlQUFILEVBQW9CLFNBQUEsR0FBQTtlQUNsQixNQUFBLENBQU8sSUFBUCxFQURrQjtNQUFBLENBQXBCLENBQUEsQ0FBQTthQUdBLEVBQUEsQ0FBRyxPQUFILEVBQVksU0FBQSxHQUFBO2VBQ1YsTUFBQSxDQUFPLEtBQVAsRUFEVTtNQUFBLENBQVosRUFMMEI7SUFBQSxDQUE1QixDQUFBLENBQUE7V0FRQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBLEdBQUE7QUFFdkIsTUFBQSxFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQSxHQUFBO2VBQ3ZCLE1BQUEsQ0FBTyxJQUFQLEVBRHVCO01BQUEsQ0FBekIsQ0FBQSxDQUFBO2FBR0EsRUFBQSxDQUFHLGlDQUFILEVBQXNDLFNBQUEsR0FBQTtlQUNwQyxNQUFBLENBQU8sSUFBUCxFQURvQztNQUFBLENBQXRDLEVBTHVCO0lBQUEsQ0FBekIsRUFWNkI7RUFBQSxDQUEvQixDQUZBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/anas/.atom/packages/mocha-test-runner/test/sample-test.coffee
