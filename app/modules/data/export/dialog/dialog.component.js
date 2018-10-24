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

    /* @ngInject */
    function AnalyticsExportDialogController($scope,
                                             $mdToast,
                                             $state,
                                             deviceInstancesService,
                                             deviceTypesService,
                                             analyticsExportService,
                                             dataPipelineRepositoryService
    ) {
        var vm = this;
        vm.searchDevices = searchDevices;
        vm.loadDevices = loadDevices;
        vm.loadPipes = loadPipes;
        vm.clearSearch = clearSearch;
        vm.addValue = addValue;
        vm.delValue = delValue;
        vm.startExport = startExport;

        vm.selector = "device";

        vm.requestComplete = false;
        vm.searchInfo = {term: "", searchText: ""};
        vm.deviceList = {};
        vm.pipeList = [];
        vm.device = "";
        vm.deviceTypes = {};
        vm.timePath = "";
        vm.name = "";
        vm.description = "";
        vm.values = [];
        vm.service = {id: ""};
        vm.pipe = {};
        vm.operator = {};
        vm.dropdown = [
            "float",
            "string",
            "int"
        ];

        function loadDevices() {
            clearSearch();
            deviceInstancesService.getInstances(50, 0).then(function (data) {
                vm.deviceList = data;
            });
        }

        function loadPipes() {
            dataPipelineRepositoryService.getAll().then(function (data) {
                vm.pipeList = data;
                console.log(vm.pipeList);
            });
        }

        function searchDevices() {
            deviceInstancesService.searchInstances(vm.searchInfo.term, 50, 0).then(function (data) {
                vm.deviceList = data;
            });
        }

        function clearSearch() {
            vm.searchInfo = {term: "", searchText: ""};
        }

        function addValue() {
            vm.values.push({});
        };

        function delValue(value) {
            var index = vm.values.indexOf(value);
            vm.values.splice(index, 1);
        }

        function startExport(isValid) {
            if (!isValid) {
                $mdToast.show($mdToast.inputError());
            } else {
                if (vm.selector === "device") {
                    analyticsExportService.start(
                        {
                            name: vm.name,
                            description: vm.description,
                            entity_name: vm.device.name,
                            service_name: vm.service.name,
                            filter_type: "deviceId",
                            filter_id: vm.device.id,
                            topic: vm.service.id.replace(/#/g, '_'),
                            timePath: vm.timePath,
                            values: vm.values
                        }).then(function () {
                        $mdToast.show($mdToast.startExport());
                        $state.go('data.export', {}, {reload: true});
                    });
                } else if (vm.selector === "pipe") {
                    analyticsExportService.start(
                        {
                            name: vm.name,
                            description: vm.description,
                            entity_name: vm.pipe.id,
                            service_name: vm.operator.Name,
                            filter_type: "pipeId",
                            filter_id: vm.pipe.id,
                            topic: "analytics-" + vm.operator.Name,
                            timePath: vm.timePath,
                            values: vm.values
                        }).then(function () {
                        $mdToast.show($mdToast.startExport());
                        $state.go('data.export', {}, {reload: true});
                    });
                }

            }

        }

        $scope.$watch(function () {
            return vm.device;
        }, function () {
            if (vm.device !== "") {
                deviceTypesService.get(vm.device.device_type).then(function (data) {
                    vm.deviceTypes = data;
                });
            }
        });
    }

    angular
        .module('app.data.export.dialog')
        .component('seplDataExportDialog', {
            templateUrl: 'modules/data/export/dialog/dialog.html',
            controller: AnalyticsExportDialogController
        });
})();