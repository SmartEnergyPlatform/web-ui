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
    function MonitorController($scope, $state, monitorService, $stateParams) {
        var vm = this;
        vm.searchText = '';
        vm.requestComplete = false;
        vm.row = {};
        vm.deleteItemId = null;
        vm.items = [];
        vm.columns = ['MONITOR.TABLE_COLUMNS.PROCESS', 'MONITOR.TABLE_COLUMNS.ID', 'MONITOR.TABLE_COLUMNS.STARTTIME', 'MONITOR.TABLE_COLUMNS.ENDTIME', 'MONITOR.TABLE_COLUMNS.DURATION'];
        vm.columnKeys = ['process', 'id', 'startTime', 'endTime', 'durationInSeconds'];
        vm.chip = [];
        vm.removeChip = removeChip;
        vm.getInstances = getInstances;

        vm.getInstances();

        function removeChip() {
            vm.requestComplete = false;
            $stateParams.processDefinitionId = null;
            console.log($stateParams.processDefinitionId);
            vm.items = [];
            vm.chip = [];
            vm.getInstances();
        }

        vm.buttons = [
            {
                name: "stop",
                callback: function (item) {
                    if (!item.endTime) {
                        monitorService.stopProcessInstance(item.id).then(function () {
                            $state.reload();
                        });
                    } else {
                        console.log("error: process seems finished");
                    }
                },
                displayIf: function (item) {
                    return !item.endTime;
                },
                icon: "stop",
                style: "md-secondary md-icon-button"
            },
            {
                name: "DATATABLE.DETAILS",
                callback: monitorService.showDetailDialog,
                displayIf: function (item) {
                    return true;
                },
                icon: "info",
                style: "md-secondary md-icon-button"
            }
        ];

        function getInstances() {
            var getter = monitorService.getHistoryInstances;
            if($stateParams.finished){
                getter = monitorService.getFinishedHistoryInstances;
            }else if($stateParams.unfinished){
                getter = monitorService.getUnfinishedHistoryInstances;
            }
            getter($stateParams.processDefinitionId).then(function (dataResponse) {
                for (var i = 0; i < dataResponse.length; i++) {

                    if ($stateParams.processDefinitionId !== null && vm.chip.length === 0)
                        vm.chip.push({name: dataResponse[i].processDefinitionKey});

                    vm.items.push(new MonitorItem(dataResponse[i].processDefinitionKey, dataResponse[i].id, dataResponse[i].startTime, dataResponse[i].endTime, dataResponse[i].durationInMillis));
                }
                vm.requestComplete = true;
            });
        }

        $scope.$watchCollection(function watchRows($scope) {
            return (vm.deleteItemId);
        }, function (deleteItemId) {
            if (deleteItemId !== null) {
                vm.requestComplete = false;

                monitorService.removeHistoryInstance(deleteItemId).then(function () {
                    vm.requestComplete = true;
                    $state.reload();
                });
            }
        });

        function MonitorItem(process, id, startTime, endTime, durationInMillis) {
            var item = this;

            item.process = process;
            item.id = id;
            item.startTime = startTime;
            item.endTime = endTime;
            item.durationInSeconds = durationInMillis / 1000;
        }
    }

    angular
        .module('app.processes.monitor')
        .component('seplProcessMonitor', {
            templateUrl: 'modules/processes/monitor/monitor.html',
            controller: MonitorController
        });
})
();