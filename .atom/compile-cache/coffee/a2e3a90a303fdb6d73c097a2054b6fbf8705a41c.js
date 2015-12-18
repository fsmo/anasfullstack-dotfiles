(function() {
  var AskStackApiClient, request;

  request = require('request');

  module.exports = AskStackApiClient = (function() {
    function AskStackApiClient() {}

    AskStackApiClient.question = '';

    AskStackApiClient.tag = '';

    AskStackApiClient.page = 1;

    AskStackApiClient.sort_by = 'votes';

    AskStackApiClient.search = function(callback) {
      var options;
      options = {
        uri: "https://api.stackexchange.com" + "/2.2/search/advanced?pagesize=5&" + ("page=" + this.page + "&") + "order=desc&" + ("sort=" + this.sort_by + "&") + ("q=" + (encodeURIComponent(this.question.trim())) + "&") + ("tagged=" + (encodeURIComponent(this.tag.trim())) + "&") + "site=stackoverflow&" + "filter=!b0OfNKD*3O569e",
        method: 'GET',
        gzip: true,
        headers: {
          'User-Agent': 'Atom-Ask-Stack'
        }
      };
      if (process.env.http_proxy != null) {
        options.proxy = process.env.http_proxy;
      }
      return request(options, function(error, res, body) {
        var response;
        if (!error && res.statusCode === 200) {
          try {
            return response = JSON.parse(body);
          } catch (_error) {
            console.log("Error: Invalid JSON");
            return response = null;
          } finally {
            callback(response);
          }
        } else {
          console.log("Error: " + error, "Result: ", res);
          return response = null;
        }
      });
    };

    AskStackApiClient.resetInputs = function() {
      this.question = '';
      this.tag = '';
      this.page = 1;
      return this.sort_by = 'votes';
    };

    return AskStackApiClient;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXNrLXN0YWNrL2xpYi9hc2stc3RhY2stYXBpLWNsaWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMEJBQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVIsQ0FBVixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FTTTttQ0FHSjs7QUFBQSxJQUFBLGlCQUFDLENBQUEsUUFBRCxHQUFZLEVBQVosQ0FBQTs7QUFBQSxJQUNBLGlCQUFDLENBQUEsR0FBRCxHQUFPLEVBRFAsQ0FBQTs7QUFBQSxJQUVBLGlCQUFDLENBQUEsSUFBRCxHQUFRLENBRlIsQ0FBQTs7QUFBQSxJQUdBLGlCQUFDLENBQUEsT0FBRCxHQUFXLE9BSFgsQ0FBQTs7QUFBQSxJQUtBLGlCQUFDLENBQUEsTUFBRCxHQUFTLFNBQUMsUUFBRCxHQUFBO0FBQ1AsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQ0U7QUFBQSxRQUFBLEdBQUEsRUFBSywrQkFBQSxHQUNILGtDQURHLEdBRUgsQ0FBQyxPQUFBLEdBQU8sSUFBQyxDQUFBLElBQVIsR0FBYSxHQUFkLENBRkcsR0FHSCxhQUhHLEdBSUgsQ0FBQyxPQUFBLEdBQU8sSUFBQyxDQUFBLE9BQVIsR0FBZ0IsR0FBakIsQ0FKRyxHQUtILENBQUMsSUFBQSxHQUFHLENBQUMsa0JBQUEsQ0FBbUIsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQUEsQ0FBbkIsQ0FBRCxDQUFILEdBQXlDLEdBQTFDLENBTEcsR0FNSCxDQUFDLFNBQUEsR0FBUSxDQUFDLGtCQUFBLENBQW1CLElBQUMsQ0FBQSxHQUFHLENBQUMsSUFBTCxDQUFBLENBQW5CLENBQUQsQ0FBUixHQUF5QyxHQUExQyxDQU5HLEdBT0gscUJBUEcsR0FRSCx3QkFSRjtBQUFBLFFBU0EsTUFBQSxFQUFRLEtBVFI7QUFBQSxRQVVBLElBQUEsRUFBTSxJQVZOO0FBQUEsUUFXQSxPQUFBLEVBQ0U7QUFBQSxVQUFBLFlBQUEsRUFBYyxnQkFBZDtTQVpGO09BREYsQ0FBQTtBQWVBLE1BQUEsSUFBMEMsOEJBQTFDO0FBQUEsUUFBQSxPQUFPLENBQUMsS0FBUixHQUFnQixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQTVCLENBQUE7T0FmQTthQWlCQSxPQUFBLENBQVEsT0FBUixFQUFpQixTQUFDLEtBQUQsRUFBUSxHQUFSLEVBQWEsSUFBYixHQUFBO0FBQ2YsWUFBQSxRQUFBO0FBQUEsUUFBQSxJQUFHLENBQUEsS0FBQSxJQUFjLEdBQUcsQ0FBQyxVQUFKLEtBQWtCLEdBQW5DO0FBQ0U7bUJBQ0UsUUFBQSxHQUFXLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWCxFQURiO1dBQUEsY0FBQTtBQUdFLFlBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxxQkFBWixDQUFBLENBQUE7bUJBQ0EsUUFBQSxHQUFXLEtBSmI7V0FBQTtBQU1FLFlBQUEsUUFBQSxDQUFTLFFBQVQsQ0FBQSxDQU5GO1dBREY7U0FBQSxNQUFBO0FBU0UsVUFBQSxPQUFPLENBQUMsR0FBUixDQUFhLFNBQUEsR0FBUyxLQUF0QixFQUErQixVQUEvQixFQUEyQyxHQUEzQyxDQUFBLENBQUE7aUJBQ0EsUUFBQSxHQUFXLEtBVmI7U0FEZTtNQUFBLENBQWpCLEVBbEJPO0lBQUEsQ0FMVCxDQUFBOztBQUFBLElBb0NBLGlCQUFDLENBQUEsV0FBRCxHQUFjLFNBQUEsR0FBQTtBQUNaLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxFQUFaLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxHQUFELEdBQU8sRUFEUCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsSUFBRCxHQUFRLENBRlIsQ0FBQTthQUdBLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFKQztJQUFBLENBcENkLENBQUE7OzZCQUFBOztNQWRGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/anas/.atom/packages/ask-stack/lib/ask-stack-api-client.coffee
