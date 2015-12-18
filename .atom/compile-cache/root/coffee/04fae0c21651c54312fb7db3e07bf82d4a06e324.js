(function() {
  module.exports = {
    config: {
      preview: {
        type: 'string',
        "default": 'The Quick brown fox { 0 !== "O" }'
      },
      fontFamily: {
        description: 'Use one of the fonts available in this package.',
        type: 'string',
        "default": 'Source Code Pro',
        "enum": ['Anka/Coder', 'Anonymous Pro', 'Aurulent Sans Mono', 'Average Mono', 'BPmono', 'Bitstream Vera Sans Mono', 'Code New Roman', 'Consolamono', 'Cousine', 'Cutive Mono', 'DejaVu Mono', 'Droid Sans Mono', 'Effects Eighty', 'Fantasque Sans Mono', 'Fifteen', 'Fira Mono', 'FiraCode', 'Fixedsys', 'GNU Freefont', 'GNU Unifont', 'Generic Mono', 'Gohufont 11', 'Gohufont 14', 'Hack', 'Hasklig', 'Hermit Light', 'Hermit', 'Inconsolata', 'Inconsolata-g', 'Latin Modern Mono Light', 'Latin Modern Mono', 'Lekton', 'Liberation Mono', 'Luxi Mono', 'M+ Light', 'M+ Medium', 'M+ Thin', 'M+', 'Meslo', 'Monofur', 'Monoid', 'NotCourierSans', 'Nova Mono', 'Office Code Pro', 'Office Code Pro Light', 'Office Code Pro Medium', 'Oxygen Mono', 'PT Mono', 'Profont', 'Proggy Clean', 'Quinze', 'Roboto Mono', 'Roboto Mono Light', 'Roboto Mono Thin', 'Roboto Mono Medium', 'Share Tech Mono', 'Source Code Pro Extra Light', 'Source Code Pro Light', 'Source Code Pro Medium', 'Source Code Pro', 'Sudo', 'TeX Gyre Cursor', 'Ubuntu Mono', 'VT323', 'Verily Serif Mono', 'saxMono']
      }
    },
    activate: function(state) {
      return atom.packages.onDidActivateInitialPackages(function() {
        var Runner;
        Runner = require('./runner');
        return Runner.run();
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvZm9udHMvbGliL2ZvbnRzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLE9BQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxtQ0FEVDtPQURGO0FBQUEsTUFHQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSxpREFBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLFFBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxpQkFGVDtBQUFBLFFBR0EsTUFBQSxFQUFNLENBQ0osWUFESSxFQUVKLGVBRkksRUFHSixvQkFISSxFQUlKLGNBSkksRUFLSixRQUxJLEVBTUosMEJBTkksRUFPSixnQkFQSSxFQVFKLGFBUkksRUFTSixTQVRJLEVBVUosYUFWSSxFQVdKLGFBWEksRUFZSixpQkFaSSxFQWFKLGdCQWJJLEVBY0oscUJBZEksRUFlSixTQWZJLEVBZ0JKLFdBaEJJLEVBaUJKLFVBakJJLEVBa0JKLFVBbEJJLEVBbUJKLGNBbkJJLEVBb0JKLGFBcEJJLEVBcUJKLGNBckJJLEVBc0JKLGFBdEJJLEVBdUJKLGFBdkJJLEVBd0JKLE1BeEJJLEVBeUJKLFNBekJJLEVBMEJKLGNBMUJJLEVBMkJKLFFBM0JJLEVBNEJKLGFBNUJJLEVBNkJKLGVBN0JJLEVBOEJKLHlCQTlCSSxFQStCSixtQkEvQkksRUFnQ0osUUFoQ0ksRUFpQ0osaUJBakNJLEVBa0NKLFdBbENJLEVBbUNKLFVBbkNJLEVBb0NKLFdBcENJLEVBcUNKLFNBckNJLEVBc0NKLElBdENJLEVBdUNKLE9BdkNJLEVBd0NKLFNBeENJLEVBeUNKLFFBekNJLEVBMENKLGdCQTFDSSxFQTJDSixXQTNDSSxFQTRDSixpQkE1Q0ksRUE2Q0osdUJBN0NJLEVBOENKLHdCQTlDSSxFQStDSixhQS9DSSxFQWdESixTQWhESSxFQWlESixTQWpESSxFQWtESixjQWxESSxFQW1ESixRQW5ESSxFQW9ESixhQXBESSxFQXFESixtQkFyREksRUFzREosa0JBdERJLEVBdURKLG9CQXZESSxFQXdESixpQkF4REksRUF5REosNkJBekRJLEVBMERKLHVCQTFESSxFQTJESix3QkEzREksRUE0REosaUJBNURJLEVBNkRKLE1BN0RJLEVBOERKLGlCQTlESSxFQStESixhQS9ESSxFQWdFSixPQWhFSSxFQWlFSixtQkFqRUksRUFrRUosU0FsRUksQ0FITjtPQUpGO0tBREY7QUFBQSxJQTZFQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7YUFHUixJQUFJLENBQUMsUUFBUSxDQUFDLDRCQUFkLENBQTJDLFNBQUEsR0FBQTtBQUN6QyxZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFULENBQUE7ZUFDQSxNQUFNLENBQUMsR0FBUCxDQUFBLEVBRnlDO01BQUEsQ0FBM0MsRUFIUTtJQUFBLENBN0VWO0dBRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/anas/.atom/packages/fonts/lib/fonts.coffee
