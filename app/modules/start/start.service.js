/*
 *    Copyright 2018 InfAI (CC SES)
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

(function () {
    'use strict';

    angular
        .module('app.start')
        .factory('startService', startService);

    /* @ngInject */

    function startService($http, API_AGGREGATOR_URL) {
        var service = {
            getDeviceHistory: getDeviceHistory,
            getGatewayHistory: getGatewayHistory,
        };
        
        return service;

        function getDeviceHistory() {
            return $http({
                method: "GET",
                url: API_AGGREGATOR_URL + "/history/devices/7d"
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for get.' + error.data);
            }
        }

        function getGatewayHistory() {
            return $http({
                method: "GET",
                url: API_AGGREGATOR_URL + "/history/gateways/7d"
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for get.' + error.data);
            }
        }

    }
})();