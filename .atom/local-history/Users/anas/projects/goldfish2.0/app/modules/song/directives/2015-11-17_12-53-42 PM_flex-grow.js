'use strict';

/**
 * @ngdoc directive
 * @name song.Directives.flexGrow
 * @description flexGrow directive
 */
angular
  .module('song')
  .directive('flexGrow', [
    function() {
      return {
        restrict: 'A',

        link: function(scope, element, attr) {
          element.css({
            flex: '' + (parseInt(attr.flexGrow)) + ' 1 auto'
          });
        }
      };
    }
  ]);
