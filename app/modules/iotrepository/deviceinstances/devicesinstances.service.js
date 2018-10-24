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
        .module('app.iotrepository.deviceinstances')
        .factory('deviceInstancesService', deviceInstancesService);

    /* @ngInject */
    function deviceInstancesService($http, IOT_REPO_URL, $mdDialog, DEVICE_LOG_URL, API_AGGREGATOR_URL) {
        var service = {
            getInstanceAggregate: getInstanceAggregate,
            getInstanceTagAggregate:getInstanceTagAggregate,
            getInstanceUserTagAggregate:getInstanceUserTagAggregate,
            getInstanceIdsAggregate:getInstanceIdsAggregate,
            getInstances: getInstances,
            getInstance: getInstance,
            searchInstances: searchInstances,
            showEditDialog: showEditDialog,
            deleteInstance: deleteInstance,
            getLog: getLog,
            getLogHistory: getLogHistory
        };

        return service;

        function getInstanceAggregate(query, limit, offset, feature, order){
            var pagingPath = "/"+ limit + "/" + offset;
            if(feature && order){
                pagingPath = pagingPath + "/" + feature + "/" + order
            }
            if(query){
                return $http({
                    method: "GET",
                    url: API_AGGREGATOR_URL + "/search/devices/"+ encodeURIComponent(query) + pagingPath
                }).then(success).catch(failure);
            }else{
                return $http({
                    method: "GET",
                    url: API_AGGREGATOR_URL + "/list/devices" + pagingPath
                }).then(success).catch(failure);
            }

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getInstanceAggregate.' + error.data);
            }
        }

        function getInstanceIdsAggregate(ids){
            return $http({
                method: "POST",
                url: API_AGGREGATOR_URL + "/select/devices/ids",
                data: ids
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getInstanceTagAggregate.' + error.data);
            }
        }

        function getInstanceTagAggregate(tag, feature, order){
            return $http({
                method: "GET",
                url: API_AGGREGATOR_URL + "/select/devices/tag/" + encodeURIComponent(tag) + "/100/0/" + feature + "/" + order
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getInstanceTagAggregate.' + error.data);
            }
        }

        function getInstanceUserTagAggregate(tag, feature, order){
            return $http({
                method: "GET",
                url: API_AGGREGATOR_URL + "/select/devices/usertag/"+ encodeURIComponent(tag)+ "/100/0/" + feature + "/" + order
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getInstanceUserTagAggregate.' + error.data);
            }
        }

        function getInstances(limit, offset) {
            return $http({
                method: "GET",
                url: IOT_REPO_URL + "/deviceInstances/" + limit + "/" + offset
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getInstances.' + error.data);
            }
        }

        function getLog(id) {
            return $http({
                method: "GET",
                url: DEVICE_LOG_URL + "/" + encodeURIComponent(id)
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getInstances.' + error.data);
            }
        }

        function getLogHistory(id) {
            return $http({
                method: "GET",
                url: DEVICE_LOG_URL + "/" + encodeURIComponent(id) + "/history"
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getInstances.' + error.data);
            }
        }

        function getInstance(id) {
            return $http({
                method: "GET",
                url: IOT_REPO_URL + "/deviceInstance/" + encodeURIComponent(id)
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getInstance.' + error.data);
            }
        }

        function deleteInstance(id){
            return $http({
                method: "DELETE",
                url: IOT_REPO_URL + "/deviceInstance/" + encodeURIComponent(id)
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getInstance.' + error.data);
            }
        }

        function searchInstances(searchText, limit, offset) {
            return $http({
                method: "GET",
                url: IOT_REPO_URL + "/ui/search/deviceInstances/" + searchText + "/" + limit + "/" + offset
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for searchInstances.' + error.data);
            }
        }

        function showEditDialog(locals, ev, customFullscreen) {
            $mdDialog.show({
                locals: locals,
                controller: DialogController,
                controllerAs: 'ctrl',
                templateUrl: 'modules/iotrepository/deviceinstances/edit.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: customFullscreen
            });
        }

        function DialogController($mdDialog, $http, IOT_REPO_URL, id, deviceTypeId) {
            var vm = this;
            vm.deviceinstance = {};

            vm.errorHandler = errorHandler;
            vm.loadDeviceinstance = loadDeviceinstance;
            vm.saveDeviceinstance = saveDeviceinstance;
            vm.getNewParents = getNewParents;
            vm.parentsToLabel = parentsToLabel;
            vm.cancel = cancel;

            vm.loadDeviceinstance();

            function errorHandler(response) {
                console.log(response.data);
                alert(response.data.message);
            }

            function loadDeviceinstance() {
                if (id) {
                    getInstance(id).then(function (response) {
                        vm.deviceinstance = response;
                        vm.deviceinstance.tags = vm.deviceinstance.tags || [];
                        vm.deviceinstance.user_tags =  vm.deviceinstance.user_tags || [];
                    });
                }else {
                    $http.get(IOT_REPO_URL + "/ui/deviceInstance/resourceSkeleton/" + encodeURIComponent(deviceTypeId)).then(function (response) {
                        vm.deviceinstance = response.data;
                        vm.deviceinstance.tags = vm.deviceinstance.tags || [];
                        vm.deviceinstance.user_tags =  vm.deviceinstance.user_tags || [];
                    });
                }

            }

            function saveDeviceinstance() {
                var pathEnding = id ? "/" + encodeURIComponent(id) : "";
                $http.post(IOT_REPO_URL + "/deviceInstance" + pathEnding, vm.deviceinstance).then(function (response) {
                    vm.deviceinstance = response.data;
                    $mdDialog.hide();
                }, errorHandler);
            }

            function getNewParents(list, element) {
                var parents = JSON.parse(JSON.stringify(list));
                parents.push(element);
                return parents;
            }

            function parentsToLabel(parents) {
                return parents.map(function (e) {
                    if (e.name) {
                        return e.name;
                    }
                    if (e.field) {
                        return that.field_info[e.field].name;
                    }
                }).join(".");
            }

            function cancel() {
                $mdDialog.cancel();
            }
        }
    }
})();