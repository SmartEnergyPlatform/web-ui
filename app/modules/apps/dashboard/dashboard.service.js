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
        .module('app.apps.dashboard')
        .factory('dashboardService', DashboardService);

    /* @ngInject */
    function DashboardService($http, DASHBOARD_SERVICE_URL) {
        var service = {
            addView: addView,
            getAllViews: getAllViews,
            getView: getView,
            updateView: updateView,
            removeView: removeView
        };

        return service;

        function addView(view) {
            return $http({
                method: "POST",
                url: DASHBOARD_SERVICE_URL + "/view",
                data: view,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for addView.' + error.data);
            }
        }

        function getAllViews() {
            return $http({
                method: "GET",
                url: DASHBOARD_SERVICE_URL + "/view"
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getAllViews.' + error.data);
            }
        }

        function getView(id) {
            return $http({
                method: "GET",
                url: DASHBOARD_SERVICE_URL + "/view/" + id
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getView.' + error.data);
            }
        }

        function updateView(view) {
            var body = {};

            body.title = view.title;

            return $http({
                method: "PUT",
                url: DASHBOARD_SERVICE_URL + "/view/" + view._id,
                data: body,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for updateView.' + error.data);
                console.log(error.data);
            }
        }

        function removeView(id) {
            return $http({
                method: "DELETE",
                url: DASHBOARD_SERVICE_URL + "/view/" + id
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for removeView.' + error.data);
            }
        }
    }
})();