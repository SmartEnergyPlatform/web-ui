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

    function DeviceInstanceController($state, $scope, deviceInstancesService, deviceTypesService, $mdDialog, permissionsService, tagvalueFilter, $stateParams, $timeout, $translate, $q) {
        var vm = this;

        // vars
        vm.requestComplete = false;
        vm.searchText = '';
        vm.steps = 50;
        vm.limit = vm.steps;
        vm.offset = 0;
        vm.deviceInstances = [];
        vm.initialLoading = true;
        vm.sortAttributes = [{
            label: "SORT.BY_NAME",
            value: "name",
            order: "asc"
        }/*, {
            label: "SORT.BY_STATE",
            value: "state",
            order: "asc"
        }*/];
        vm.sortItem = vm.sortAttributes[0];
        vm.scrollDisabled = false;
        vm.ready = false;
        vm.initialize = true;
        var searchPromise;

        // functions
        vm.next = next;
        vm.getDeviceInstances = getDeviceInstances;
        vm.showEditDialog = showEditDialog;
        vm.deleteDeviceInstance = deleteDeviceInstance;
        vm.showServiceInfo = showServiceInfo;
        vm.permission = permission;
        vm.reset = reset;
        vm.chipReset = chipReset;
        vm.searchTag = searchTag;
        vm.searchUserTag = searchUserTag;

        // watchers
        $scope.$watchCollection(function (scope) {
                return (vm.sortItem);
            }, function (sortItem) {
                if (vm.initialize) {
                    $timeout(function () {
                        vm.initialize = false;
                    });
                } else if (sortItem !== null && sortItem !== undefined) {
                    vm.reset();
                    vm.getDeviceInstances();
                }
            }
        );

        $scope.$watchCollection(function (scope) {
                return (vm.searchText);
            }, function (searchText) {
                if (vm.initialize) {
                    $timeout(function () {
                        vm.initialize = false;
                    });
                } else {
                    $timeout.cancel(searchPromise);
                    searchPromise = $timeout(function () {
                        vm.chip = [];
                        vm.search_tag = null;
                        vm.search_usertag = null;
                        vm.ids = null;

                        vm.reset();
                        vm.getDeviceInstances();
                    }, 500)
                }
            }
        );

        vm.$onInit = function () {
            vm.ready = true;
            vm.chip = $stateParams.chips;
            vm.search_tag = $stateParams.search_tag;
            vm.search_usertag = $stateParams.search_usertag;
            vm.ids = $stateParams.ids;
            vm.getDeviceInstances();
        };

        function chipReset() {
            vm.chip = [];
            vm.search_tag = null;
            vm.search_usertag = null;
            vm.ids = null;

            vm.reset();
            vm.getDeviceInstances();
        }

        function searchTag(tag) {
            vm.chip = [tagvalueFilter(tag)];
            vm.search_tag = tag;
            vm.search_usertag = null;
            vm.ids = null;

            vm.reset();
            vm.getDeviceInstances();
        }

        function searchUserTag(tag) {
            vm.chip = [tag];
            vm.search_tag = null;
            vm.search_usertag = tag;
            vm.ids = null;

            vm.reset();
            vm.getDeviceInstances();
        }

        function reset() {
            vm.deviceInstances = [];
            vm.scrollDisabled = false;
            vm.initialLoading = true;
            vm.offset = 0;
        }

        function next() {
            if (vm.requestComplete) {
                vm.initialLoading = false;
                vm.offset = parseInt(vm.offset) + parseInt(vm.steps);
                vm.getDeviceInstances(vm.deviceInstances);
            }
        }

        function deleteDeviceInstance(id) {

            var trans = [
                "DEVICE_INSTANCES.FUNCTIONS.SHOW_CONFIRM_DELETE_TITLE_DELETE_DEVICE_INSTANCE",
                "DEVICE_INSTANCES.FUNCTIONS.SHOW_CONFIRM_DELETE_TEXT_CONTENT_REALLY",
                "DEVICE_INSTANCES.FUNCTIONS.SHOW_CONFIRM_DELETE_ARIA_LABEL_CONTENT",
                "DEVICE_INSTANCES.FUNCTIONS.SHOW_CONFIRM_DELETE_RESPONSE_OK",
                "DEVICE_INSTANCES.FUNCTIONS.SHOW_CONFIRM_DELETE_RESPONSE_CANCEL"
            ];

            $translate(trans).then(function (translations) {
                var confirm = $mdDialog.confirm()
                    .title(translations["DEVICE_INSTANCES.FUNCTIONS.SHOW_CONFIRM_DELETE_TITLE_DELETE_DEVICE_INSTANCE"])
                    .textContent(translations["DEVICE_INSTANCES.FUNCTIONS.SHOW_CONFIRM_DELETE_TEXT_CONTENT_REALLY"])
                    .ariaLabel(translations["DEVICE_INSTANCES.FUNCTIONS.SHOW_CONFIRM_DELETE_ARIA_LABEL_CONTENT"])
                    .ok(translations["DEVICE_INSTANCES.FUNCTIONS.SHOW_CONFIRM_DELETE_RESPONSE_OK"])
                    .cancel(translations["DEVICE_INSTANCES.FUNCTIONS.SHOW_CONFIRM_DELETE_RESPONSE_CANCEL"]);

                $mdDialog.show(confirm).then(function () {
                    deviceInstancesService.deleteInstance(id).then(function (response) {
                        $state.reload();
                    });
                }, function () {
                });
            });
        }

        function getDeviceInstances(current) {
            if (!vm.ready) {
                return
            }
            if (!current) {
                current = [];
            }
            vm.requestComplete = false;

            if (vm.ids && vm.ids.length) {
                deviceInstancesService.getInstanceIdsAggregate(vm.ids).then(function (result) {
                    vm.requestComplete = true;
                    vm.scrollDisabled = true;
                    current = current.concat(result);
                    vm.deviceInstances = current;
                })
            } else if (vm.search_tag) {
                deviceInstancesService.getInstanceTagAggregate(vm.search_tag, vm.sortItem.value, vm.sortItem.order).then(function (result) {
                    vm.requestComplete = true;
                    vm.scrollDisabled = true;
                    current = current.concat(result);
                    vm.deviceInstances = current;
                })
            } else if (vm.search_usertag) {
                deviceInstancesService.getInstanceUserTagAggregate(vm.search_usertag, vm.sortItem.value, vm.sortItem.order).then(function (result) {
                    vm.requestComplete = true;
                    vm.scrollDisabled = true;
                    current = current.concat(result);
                    vm.deviceInstances = current;
                })
            } else {
                deviceInstancesService.getInstanceAggregate(vm.searchText, vm.limit, vm.offset, vm.sortItem.value, vm.sortItem.order).then(function (result) {
                    vm.requestComplete = true;
                    if (_.isNil(result)) {
                        vm.scrollDisabled = true;
                    } else {
                        current = current.concat(result);
                    }
                    vm.deviceInstances = current;
                });
            }

        }

        function showEditDialog(id, ev) {
            return deviceInstancesService.showEditDialog(id, ev, $scope.customFullscreen);
        }

        function showServiceInfo(deviceinstance) {
            deviceTypesService.showServiceInfoDialog(deviceinstance.devicetype);
        }

        function permission(id) {
            permissionsService.dialog("deviceinstance", id)
        }

    }

    angular.module('app.iotrepository.deviceinstances').component('seplDeviceInstances', {
        templateUrl: "modules/iotrepository/deviceinstances/device-instances.html",
        controller: DeviceInstanceController,
        bindings: {
            searchText: '<'
        }
    });

    angular.module('app.iotrepository.deviceinstances').filter('tagvalue', function () {
        return function (tag) {
            var parts = tag.split(":");
            parts.shift();
            var out = parts.join(":");
            return out;
        };
    })
})
();







