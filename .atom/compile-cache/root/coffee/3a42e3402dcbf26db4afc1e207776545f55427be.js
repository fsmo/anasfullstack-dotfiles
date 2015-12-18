(function() {
  var hyperclickProvider, provider;

  provider = require('./provider');

  hyperclickProvider = require('./hyperclickProvider');

  module.exports = {
    config: {
      showDescriptions: {
        type: 'boolean',
        "default": true,
        order: 1,
        title: 'Show Descriptions',
        description: 'Show doc strings from functions, classes, etc.'
      },
      useSnippets: {
        type: 'string',
        "default": 'none',
        order: 2,
        "enum": ['none', 'all', 'required'],
        title: 'Autocomplete Function Parameters',
        description: 'Automatically complete function arguments after typing\nleft parenthesis character. Use completion key to jump between\narguments. See `autocomplete-python:complete-arguments` command if you\nwant to trigger argument completions manually.'
      },
      pythonPaths: {
        type: 'string',
        "default": '',
        order: 3,
        title: 'Python Executable Paths',
        description: 'Optional semicolon separated list of paths to python\nexecutables (including executable names), where the first one will take\nhigher priority over the last one. By default autocomplete-python will\nautomatically look for virtual environments inside of your project and\ntry to use them as well as try to find global python executable. If you\nuse this config, automatic lookup will have lowest priority.\nUse `$PROJECT` substitution for project-specific paths to point on\nexecutables in virtual environments.\nFor example: `$PROJECT/venv/bin/python3;/usr/bin/python`.\nSuch config will fall back on `/usr/bin/python` for projects without\n`venv`.\nIf you are using python3 executable while coding for python2 you will get\npython2 completions for some built-ins.'
      },
      extraPaths: {
        type: 'string',
        "default": '',
        order: 4,
        title: 'Extra Paths For Packages',
        description: 'Semicolon separated list of modules to additionally\ninclude for autocomplete. You can use `$PROJECT` substitution here to\ninclude project specific folders like virtual environment.\nNote that it still should be valid python package.\nFor example: `$PROJECT/env/lib/python2.7/site-packages`.\nYou don\'t need to specify extra paths for libraries installed with python\nexecutable you use.'
      },
      caseInsensitiveCompletion: {
        type: 'boolean',
        "default": true,
        order: 5,
        title: 'Case Insensitive Completion',
        description: 'The completion is by default case insensitive.'
      },
      triggerCompletionRegex: {
        type: 'string',
        "default": '([\.\ ]|[a-zA-Z_][a-zA-Z0-9_]*)',
        order: 6,
        title: 'Regex To Trigger Autocompletions',
        description: 'By default completions triggered after words, dots and\nspaces. You will need to restart your editor after changing this.'
      },
      fuzzyMatcher: {
        type: 'boolean',
        "default": false,
        order: 7,
        title: 'Use Fuzzy Matcher For Completions',
        description: 'Typing `stdr` will match `stderr`.'
      },
      outputProviderErrors: {
        type: 'boolean',
        "default": false,
        order: 8,
        title: 'Output Provider Errors',
        description: 'Select if you would like to see the provider errors when\nthey happen. By default they are hidden. Note that critical errors are\nalways shown.'
      },
      outputDebug: {
        type: 'boolean',
        "default": false,
        order: 9,
        title: 'Output Debug Logs',
        description: 'Select if you would like to see debug information in\ndeveloper tools logs. May slow down your editor.'
      }
    },
    activate: function(state) {
      return provider.constructor();
    },
    deactivate: function() {
      return provider.dispose();
    },
    getProvider: function() {
      return provider;
    },
    getHyperclickProvider: function() {
      return hyperclickProvider;
    },
    consumeSnippets: function(snippetsManager) {
      return provider.setSnippetsManager(snippetsManager);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXB5dGhvbi9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEJBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVIsQ0FBWCxDQUFBOztBQUFBLEVBQ0Esa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHNCQUFSLENBRHJCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLGdCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsS0FBQSxFQUFPLENBRlA7QUFBQSxRQUdBLEtBQUEsRUFBTyxtQkFIUDtBQUFBLFFBSUEsV0FBQSxFQUFhLGdEQUpiO09BREY7QUFBQSxNQU1BLFdBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxNQURUO0FBQUEsUUFFQSxLQUFBLEVBQU8sQ0FGUDtBQUFBLFFBR0EsTUFBQSxFQUFNLENBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsVUFBaEIsQ0FITjtBQUFBLFFBSUEsS0FBQSxFQUFPLGtDQUpQO0FBQUEsUUFLQSxXQUFBLEVBQWEsZ1BBTGI7T0FQRjtBQUFBLE1BZ0JBLFdBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxFQURUO0FBQUEsUUFFQSxLQUFBLEVBQU8sQ0FGUDtBQUFBLFFBR0EsS0FBQSxFQUFPLHlCQUhQO0FBQUEsUUFJQSxXQUFBLEVBQWEsOHZCQUpiO09BakJGO0FBQUEsTUFrQ0EsVUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEVBRFQ7QUFBQSxRQUVBLEtBQUEsRUFBTyxDQUZQO0FBQUEsUUFHQSxLQUFBLEVBQU8sMEJBSFA7QUFBQSxRQUlBLFdBQUEsRUFBYSx1WUFKYjtPQW5DRjtBQUFBLE1BOENBLHlCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsS0FBQSxFQUFPLENBRlA7QUFBQSxRQUdBLEtBQUEsRUFBTyw2QkFIUDtBQUFBLFFBSUEsV0FBQSxFQUFhLGdEQUpiO09BL0NGO0FBQUEsTUFvREEsc0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxpQ0FEVDtBQUFBLFFBRUEsS0FBQSxFQUFPLENBRlA7QUFBQSxRQUdBLEtBQUEsRUFBTyxrQ0FIUDtBQUFBLFFBSUEsV0FBQSxFQUFhLDJIQUpiO09BckRGO0FBQUEsTUEyREEsWUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7QUFBQSxRQUVBLEtBQUEsRUFBTyxDQUZQO0FBQUEsUUFHQSxLQUFBLEVBQU8sbUNBSFA7QUFBQSxRQUlBLFdBQUEsRUFBYSxvQ0FKYjtPQTVERjtBQUFBLE1BaUVBLG9CQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsS0FBQSxFQUFPLENBRlA7QUFBQSxRQUdBLEtBQUEsRUFBTyx3QkFIUDtBQUFBLFFBSUEsV0FBQSxFQUFhLGlKQUpiO09BbEVGO0FBQUEsTUF5RUEsV0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7QUFBQSxRQUVBLEtBQUEsRUFBTyxDQUZQO0FBQUEsUUFHQSxLQUFBLEVBQU8sbUJBSFA7QUFBQSxRQUlBLFdBQUEsRUFBYSx3R0FKYjtPQTFFRjtLQURGO0FBQUEsSUFrRkEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO2FBQVcsUUFBUSxDQUFDLFdBQVQsQ0FBQSxFQUFYO0lBQUEsQ0FsRlY7QUFBQSxJQW9GQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQUcsUUFBUSxDQUFDLE9BQVQsQ0FBQSxFQUFIO0lBQUEsQ0FwRlo7QUFBQSxJQXNGQSxXQUFBLEVBQWEsU0FBQSxHQUFBO2FBQUcsU0FBSDtJQUFBLENBdEZiO0FBQUEsSUF3RkEscUJBQUEsRUFBdUIsU0FBQSxHQUFBO2FBQUcsbUJBQUg7SUFBQSxDQXhGdkI7QUFBQSxJQTBGQSxlQUFBLEVBQWlCLFNBQUMsZUFBRCxHQUFBO2FBQ2YsUUFBUSxDQUFDLGtCQUFULENBQTRCLGVBQTVCLEVBRGU7SUFBQSxDQTFGakI7R0FKRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/anas/.atom/packages/autocomplete-python/lib/main.coffee
