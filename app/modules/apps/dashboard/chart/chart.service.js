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
        .module('app.apps.dashboard.chart')
        .factory('chartService', ChartService);

    /* @ngInject */
    function ChartService($http, DASHBOARD_SERVICE_URL) {
        var service = {
            add: add,
            getAll: getAll,
            get: get,
            update: update,
            remove: remove
        };

        return service;

        function add(widget) {
            return $http({
                method: "POST",
                url: DASHBOARD_SERVICE_URL + "/widget",
                data: widget,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for add.' + error.message);
            }
        }

        function getAll() {
            return $http({
                method: "GET",
                url: DASHBOARD_SERVICE_URL + "/widget"
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
                url: DASHBOARD_SERVICE_URL + "/widget/" + id
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for get.' + error.data);
            }
        }

        function update(id, widget) {
            var body = {};

            body.title = widget.title;
            body.type = widget.type;
            body.index = widget.index;
            body.frame = parseInt(widget.frame);
            body.source = widget.source;
            body.device = widget.device;
            body.view = widget.view;
            body.x_field = widget.x_field;
            body.x_name = widget.x_name;
            body.y_field = widget.y_field;
            body.y_name = widget.y_name;

            return $http({
                method: "PUT",
                url: DASHBOARD_SERVICE_URL + "/widget/" + id,
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
                console.log(error.data);
            }
        }

        function remove(id) {
            return $http({
                method: "DELETE",
                url: DASHBOARD_SERVICE_URL + "/widget/" + id
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for remove.' + error.data);
            }
        }
    }
})();