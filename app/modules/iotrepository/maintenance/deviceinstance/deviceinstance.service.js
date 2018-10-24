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
        .module('app.iotrepository.maintenance.deviceinstance')
        .factory('deviceMaintenance', deviceMaintenance);

    /* @ngInject */
    function deviceMaintenance($http, API_AGGREGATOR_URL) {
        var service = {
            registerNotification: registerNotification,
            getAllDisconnectedDevices: getAllDisconnectedDevices,
        };

        function registerNotification(notifications){

        }

        function getAllDisconnectedDevices(searchText, order) {

            if (searchText !== "" && searchText !== undefined) {
                return $http({
                    method: "GET",
                    url: API_AGGREGATOR_URL + "/filter/devices/state/disconnected/search/" + searchText + "/name/" + order
                }).then(success).catch(failure);


            } else {
                return $http({
                    method: "GET",
                    url: API_AGGREGATOR_URL + "/filter/devices/state/disconnected/name/" + order
                }).then(success).catch(failure);

            }
            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getAllDisconnectedDevices.' + error.data);
            }
        }


        return service;
    }
})();