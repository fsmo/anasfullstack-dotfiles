'use strict';

/**
* @ngdoc object
* @name record.config
* @requires ng.$stateProvider
* @description Defines the routes and other config within the record module
*/
angular
    .module('record')
    .config(['$stateProvider',
        function($stateProvider) {
            /**
             * @ngdoc event
             * @name record.config.route
             * @eventOf record.config
             * @description
             *
             * Define routes and the associated paths
             *
             * - When the state is `'record'`, route to record
             *
            */
            $stateProvider
                .state('record', {
                    url: '/',
                    templateUrl: 'modules/record/views/record.html',
                    controller: 'RecordController'
                });
        }
    ]);
