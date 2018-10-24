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
    function DetailsController($scope, monitorService) {
        var vm = this;
        vm.processVars = [];

        $scope.$watchCollection(function watchRows(scope) {
            return (vm.row);
        }, function (row) {
            vm.processVars = getProcessVars(row.id);
            monitorService.getIncidents(row.id).then(function(incidents){
                $scope.incidents = incidents;
            })
        });

        function getProcessVars(processInstanceId) {
            if (processInstanceId) {
                var processVars = [];

                monitorService.getAllHistoryVariables(processInstanceId).then(function (dataResponse) {
                    if (dataResponse.length) {
                        var processVarObj = {};

                        processVarObj.instanceId = dataResponse[0].id;
                        processVarObj.processVars = [];

                        for (var i = 0; i < dataResponse.length; i++) {
                            processVarObj.processVars.push({
                                name: dataResponse[i].name,
                                value: dataResponse[i].value
                            });
                        }
                        processVars.push(processVarObj);
                    }
                });
                return processVars;
            }
        }
    }

    angular
        .module('app.processes.monitor.details')
        .component('seplMonitorDetails', {
            templateUrl: 'modules/processes/monitor/details/details.html',
            controller: DetailsController,
            bindings: {
                row: '<'
            }
        });
})
();