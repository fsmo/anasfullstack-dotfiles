(function() {
  var ClipboardHistoryView, CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  ClipboardHistoryView = require('./clipboard-history-view');

  module.exports = {
    config: {
      showSnippetForLargeItems: {
        type: 'boolean',
        "default": true,
        title: 'Show Snippet',
        description: 'When a long clipboard item, preview it a separate tooltip'
      },
      showClearHistoryButton: {
        type: 'boolean',
        "default": true,
        title: 'Show Clear History',
        description: 'Display a button to clear your clipboard\'s history'
      },
      enableCopyLine: {
        type: 'boolean',
        "default": true,
        title: 'Enable Copy Line',
        description: 'Copy the whole line when no selection'
      }
    },
    history: [],
    clipboard: null,
    subscriptions: null,
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      return this.clipboard = new ClipboardHistoryView(this.history, atom.workspace.getActivePaneItem());
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    serialize: function() {}
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvY2xpcGJvYXJkLWhpc3RvcnkvbGliL2NsaXBib2FyZC1oaXN0b3J5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5Q0FBQTs7QUFBQSxFQUFFLHNCQUF3QixPQUFBLENBQVEsTUFBUixFQUF4QixtQkFBRixDQUFBOztBQUFBLEVBQ0Esb0JBQUEsR0FBdUIsT0FBQSxDQUFRLDBCQUFSLENBRHZCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLHdCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsS0FBQSxFQUFPLGNBRlA7QUFBQSxRQUdBLFdBQUEsRUFBYSwyREFIYjtPQURGO0FBQUEsTUFLQSxzQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLEtBQUEsRUFBTyxvQkFGUDtBQUFBLFFBR0EsV0FBQSxFQUFhLHFEQUhiO09BTkY7QUFBQSxNQVVBLGNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO0FBQUEsUUFFQSxLQUFBLEVBQU8sa0JBRlA7QUFBQSxRQUdBLFdBQUEsRUFBYSx1Q0FIYjtPQVhGO0tBREY7QUFBQSxJQWlCQSxPQUFBLEVBQVMsRUFqQlQ7QUFBQSxJQWtCQSxTQUFBLEVBQVcsSUFsQlg7QUFBQSxJQW1CQSxhQUFBLEVBQWUsSUFuQmY7QUFBQSxJQXFCQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7YUFDQSxJQUFDLENBQUEsU0FBRCxHQUFpQixJQUFBLG9CQUFBLENBQXFCLElBQUMsQ0FBQSxPQUF0QixFQUErQixJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFmLENBQUEsQ0FBL0IsRUFGVDtJQUFBLENBckJWO0FBQUEsSUF5QkEsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLEVBRFU7SUFBQSxDQXpCWjtBQUFBLElBNEJBLFNBQUEsRUFBVyxTQUFBLEdBQUEsQ0E1Qlg7R0FMRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/anas/.atom/packages/clipboard-history/lib/clipboard-history.coffee
