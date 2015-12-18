'use strict';

/**
 * @ngdoc directive
 * @name song.Directives.flexStretchItems
 * @description flexStretchItems directive
 */
angular
  .module('song')
  .directive('flexStretchItems', [
    function() {
      return {
        restrict: 'A',

        link: function(scope, element, attr) {
          element.css({
            'align-items': 'stretch'
          });
        }
      };
    }
  ]);