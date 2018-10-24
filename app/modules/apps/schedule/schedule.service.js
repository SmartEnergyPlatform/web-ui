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
        .module('app.apps.schedule')
        .factory('scheduleService', scheduleService);

    /* @ngInject */
    function scheduleService($http, x2js, PROCESS_SCHEDULER_URL) {
        var service = {
            add: add,
            getAll: getAll,
            get: get,
            update: update,
            remove: remove
        };

        return service;

        function add(schedule) {
            var body = {};

            body.processDefinitionId = schedule.processDefinitionId;
            body.startTime = schedule.startTime;

            return $http({
                method: "POST",
                url: PROCESS_SCHEDULER_URL + "/schedule",
                data: body,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for add.' + error.data);
            }
        }

        function getAll() {
            return $http({
                method: "GET",
                url: PROCESS_SCHEDULER_URL + "/schedule"
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getAll.' + error.data);
            }
        }

        function get(id) {
            return $http({
                method: "GET",
                url: PROCESS_SCHEDULER_URL + "/schedule/" + id
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for get.' + error.data);
            }
        }

        function update(id, schedule) {
            var body = {};

            body.processDefinitionId = schedule.processDefinitionId;
            body.startTime = schedule.startTime;

            return $http({
                method: "PUT",
                url: PROCESS_SCHEDULER_URL + "/schedule/" + id,
                data: body,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for update.' + error.data);
            }
        }

        function remove(id) {
            return $http({
                method: "DELETE",
                url: PROCESS_SCHEDULER_URL + "/schedule/" + id
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