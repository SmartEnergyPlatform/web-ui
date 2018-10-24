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

    function DevicesMaintenanceController($scope, deviceMaintenance, deviceInstancesService, deviceTypesService, $mdDialog, tagvalueFilter, $state, $translate, $q, $timeout) {
        var vm = this;
        vm.requestComplete = false;
        vm.searchText = "";
        vm.deviceInstances = [];

        vm.sortAttributes = [{
            label: "SORT.BY_NAME",
            value: "name",
            order: "asc"
        }];
        vm.sortItem = vm.sortAttributes[0];
        vm.ready = false;
        vm.initialize = true;
        var searchPromise;

        vm.showEditDialog = showEditDialog;
        vm.deleteDeviceInstance = deleteDeviceInstance;
        vm.showServiceInfo = showServiceInfo;
        vm.searchTag = searchTag;
        vm.searchUserTag = searchUserTag;
        vm.getDevices = getDevices;
        vm.init = init;

        $scope.$watchCollection(function (scope) {
                return (vm.sortItem);
            }, function (sortItem) {
            if (vm.initialize) {
                $timeout(function () {
                    vm.initialize = false;
                });
            } else if (sortItem !== null && sortItem !== undefined) {
                    vm.init();
                    vm.getDevices();
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
            } else if (searchText !== undefined) {
                    $timeout.cancel(searchPromise);
                    searchPromise = $timeout(function () {
                        vm.init();
                        vm.getDevices();
                    }, 500);
                }
            }
        );

        vm.$onInit = function () {
            vm.ready = true;
            vm.getDevices();
        };

        function init() {
            vm.deviceInstances = [];
        }

        function getDevices() {
            if (!vm.ready) {
                return
            }
            vm.requestComplete = false;
            deviceMaintenance.getAllDisconnectedDevices(vm.searchText, vm.sortItem.order).then(function (devices) {
                if (devices !== null && devices !== undefined) {
                    vm.deviceInstances = devices;
                }
                vm.requestComplete = true;
            });
        }

        function searchTag(tag) {
            deviceInstancesService.getInstanceTagAggregate(tag).then(function (result) {
                var ids = [];
                (result || []).forEach(function (element) {
                    ids.push(element.id);
                });
                $state.go("iotrepository.deviceinstances", {
                    ids: ids,
                    chips: [tagvalueFilter(tag)]
                }, {reload: true});
            })
        };

        function searchUserTag(tag) {
            deviceInstancesService.getInstanceUserTagAggregate(tag).then(function (result) {
                var ids = [];
                (result || []).forEach(function (element) {
                    ids.push(element.id);
                });
                $state.go("iotrepository.deviceinstances", {
                    ids: ids,
                    chips: [tag]
                }, {reload: true});
            })
        };

        function deleteDeviceInstance(id) {

            var trans = [
                "MAINTENANCE.FUNCTIONS.SHOW_CONFIRM_DELETE_TITLE_DELETE_DEVICE_INSTANCE",
                "MAINTENANCE.FUNCTIONS.SHOW_CONFIRM_DELETE_TEXT_CONTENT_REALLY",
                "MAINTENANCE.FUNCTIONS.SHOW_CONFIRM_DELETE_ARIA_LABEL_CONTENT",
                "MAINTENANCE.FUNCTIONS.SHOW_CONFIRM_DELETE_RESPONSE_OK",
                "MAINTENANCE.FUNCTIONS.SHOW_CONFIRM_DELETE_RESPONSE_CANCEL"
            ];

            $translate(trans).then(function (translations) {
                var confirm = $mdDialog.confirm()
                    .title(translations["MAINTENANCE.FUNCTIONS.SHOW_CONFIRM_DELETE_TITLE_DELETE_DEVICE_INSTANCE"])
                    .textContent(translations["MAINTENANCE.FUNCTIONS.SHOW_CONFIRM_DELETE_TEXT_CONTENT_REALLY"])
                    .ariaLabel(translations["MAINTENANCE.FUNCTIONS.SHOW_CONFIRM_DELETE_ARIA_LABEL_CONTENT"])
                    .ok(translations["MAINTENANCE.FUNCTIONS.SHOW_CONFIRM_DELETE_RESPONSE_OK"])
                    .cancel(translations["MAINTENANCE.FUNCTIONS.SHOW_CONFIRM_DELETE_RESPONSE_CANCEL"]);

                $mdDialog.show(confirm).then(function () {
                    deviceInstancesService.deleteInstance(id).then(function (response) {
                        removeFromList(id);
                    });
                }, function () {
                });
            });
        }

        function removeFromList(id) {
            var newList = [];
            vm.deviceInstances.forEach(function (device) {
                if (device.id != id) {
                    newList.push(device)
                }
            });
            vm.deviceInstances = newList;
        }

        function showEditDialog(id, ev) {
            return deviceInstancesService.showEditDialog(id, ev, $scope.customFullscreen);
        }

        function showServiceInfo(deviceinstance) {
            deviceTypesService.showServiceInfoDialog(deviceinstance.devicetype);
        }


    }

    angular.module('app.iotrepository.maintenance.deviceinstance').filter('tagvalue', function () {
        return function (tag) {
            var parts = tag.split(":");
            parts.shift();
            var out = parts.join(":");
            return out;
        };
    });

    angular.module('app.iotrepository.maintenance.deviceinstance').component('seplMaintenanceDevices', {
        templateUrl: "modules/iotrepository/maintenance/deviceinstance/list.html",
        controller: DevicesMaintenanceController
    });
})
();







