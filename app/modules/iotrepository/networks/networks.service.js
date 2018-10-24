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
        .module('app.iotrepository.networks')
        .factory('networksService', networksService);

    /* @ngInject */
    function networksService($http, IOT_REPO_URL, API_AGGREGATOR_URL, $mdDialog) {
        var service = {
            get: get,
            list: list,
            search: search,
            remove: remove,
            edit: edit,
            getName: getName,
            clear: clear
        };

        return service;

        function get(id) {
            return $http({
                method: "GET",
                url: IOT_REPO_URL + "/gateway/" + encodeURIComponent(id)
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for get.' + error.data);
            }
        }

        function list(limit, offset, feature, order) {
            return $http({
                method: "GET",
                url: API_AGGREGATOR_URL + "list/gateways/" + limit + "/" + offset + "/" + feature + "/" + order
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for get.' + error.data);
            }
        }

        function remove(id) {
            return $http({
                method: "DELETE",
                url: IOT_REPO_URL + "/gateway/" + encodeURIComponent(id)
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for get.' + error.data);
            }
        }

        function clear(id) {
            return $http({
                method: "POST",
                url: IOT_REPO_URL + "/gateway/" + encodeURIComponent(id) + "/clear"
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for clear.' + error.data);
            }
        }

        function edit(network) {
            $mdDialog.show({
                templateUrl: 'modules/iotrepository/networks/edit_dialog.html',
                clickOutsideToClose: true,
                controller: function($scope, $mdDialog){
                    $scope.network = {id: network.id, name: network.name};

                    $scope.cancel = function () {
                        $mdDialog.hide();
                    };

                    $scope.ok = function () {
                        $http({
                            method: "POST",
                            url: IOT_REPO_URL + "/gateway/" + encodeURIComponent($scope.network.id) + "/name/" + encodeURIComponent($scope.network.name)
                        }).then(function(response){
                            if(response.data == "ok"){
                                network.name = $scope.network.name;
                                $mdDialog.hide();
                            }else{
                                console.log("ERROR: ", response)
                            }
                        })
                    };
                }
            });
        }

        function getName(networkid){
            return $http({
                method: "GET",
                url: IOT_REPO_URL + "/gateway/" + encodeURIComponent(networkid) + "/name"
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for get network name.' + error.data);
            }
        }

        function search(searchText, limit, offset, feature, order) {
            return $http({
                method: "GET",
                url: API_AGGREGATOR_URL + "/search/gateways/" + searchText + "/" + limit + "/" + offset + "/" + feature + "/" + order
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for network search.' + error.data);
            }
        }
    }
})();