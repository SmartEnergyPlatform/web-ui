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
        .module('app.iotrepository.devicetypes')
        .factory('deviceTypesService', deviceTypesService);

    /* @ngInject */
    function deviceTypesService($http, IOT_REPO_URL, $mdDialog, PERM_SEARCH_URL) {
        var service = {
            getDeviceTypes: getDeviceTypes,
            getDeviceTypesSearch: getDeviceTypesSearch,
            get: get,
            getWithDepth: getWithDepth,
            showServiceInfoDialog: showServiceInfoDialog
        };

        return service;

        function getDeviceTypes(limit, offset, feature, order) {
            return $http({
                method: "GET",
                url: PERM_SEARCH_URL + "/jwt/list/devicetype/r/" + limit + "/" + offset + "/" + feature + "/" + order
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for get.' + error.data);
            }
        }

        function getDeviceTypesSearch(searchText, limit, offset, feature, order) {
            return $http({
                method: "GET",
                url: PERM_SEARCH_URL + "/jwt/search/devicetype/" + searchText +"/r/" + limit + "/" + offset + "/" + feature + "/" + order
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for get.' + error.data);
            }
        }

        function get(type) {
            return $http({
                method: "GET",
                url: IOT_REPO_URL + "/deviceType/" + encodeURIComponent(type)
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for get.' + error.data);
            }
        }

        function getWithDepth(type, depth) {
            return $http({
                method: "GET",
                url: IOT_REPO_URL + "/deviceType/" + encodeURIComponent(type) + "/" + depth
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for get.' + error.data);
            }
        }

        function showServiceInfoDialog(devicetypeid){
            $mdDialog.show({
                templateUrl: 'modules/iotrepository/devicetypes/service_dialog.html',
                clickOutsideToClose: true,
                controller: function($scope, $mdDialog){
                    get(devicetypeid).then(function(devicetype){
                        $scope.devicetype = devicetype;
                    });

                    $scope.close = function () {
                        $mdDialog.hide();
                    };
                }
            });
        }
    }
})();