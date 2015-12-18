'use strict';

/**
 * @ngdoc directive
 * @name song.Directives.chordsDisplay
 * @description chordsDisplay directive
 */
angular
  .module('song')
  .directive('chordsDisplay', [
    function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/song/views/chords.html',

        link: function(scope, element, attr) {}
      };
    }
  ]);
