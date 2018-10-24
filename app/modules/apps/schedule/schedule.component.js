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
    function ScheduleController($mdDialog, $scope, scheduleService, deploymentsService, moment) {
        var vm = this;
        vm.entries = [];

        vm.showScheduleDialog = showScheduleDialog;
        vm.getSchedule = getSchedule;
        vm.hasEntry = hasEntry;

        getSchedule();

        function getSchedule() {
            scheduleService.getAll().then(function (data) {
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        var entry = {};
                        var timeFragments = data[i].startTime.split(" ");
                        entry.id = data[i]._id;
                        entry.processDefinitionId = data[i].processDefinitionId;
                        entry.col = timeFragments[4];

                        if (timeFragments[0].length < 2)
                            timeFragments[0] = "0" + timeFragments[0];

                        var utc = moment.tz(timeFragments[1], "h", "UTC");
                        var local = utc.clone().tz(moment.tz.guess()).format('H');

                        entry.row = local;

                        entry.startTime = local + ":" + timeFragments[0];

                        vm.entries.push(entry);
                        getEntryName(entry);
                    }
                }
            });
        }

        function getEntryName(entry) {
            deploymentsService.getProcessDefinition(entry.processDefinitionId).then(function (data) {
                entry.name = data.key;
            });
        }

        function hasEntry(item, row, col) {
            return item.row == row && item.col == col;
        }

        function showScheduleDialog(row, col, ev, entry) {
            $mdDialog.show({
                locals: {
                    row: row,
                    col: col,
                    entry: entry
                },
                controller: DialogController,
                controllerAs: 'ctrl',
                templateUrl: 'modules/apps/schedule/dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen
            });
        }

        function DialogController($mdDialog, row, col, entry, repositoryService, $q, $state) {
            var vm = this;
            vm.processes = [];
            vm.dayOfWeek = getDayOfWeek(col);
            vm.time = row + ":00";
            vm.selectedProcess = {};
            vm.updateJob = false;

            function getDayOfWeek(col) {
                var dayOfWeek = '';

                switch (col) {
                    case 1:
                        dayOfWeek = "DASHBOARD.SCHEDULE.DAYS.MONDAY";
                        break;
                    case 2:
                        dayOfWeek = "DASHBOARD.SCHEDULE.DAYS.TUESDAY";
                        break;
                    case 3:
                        dayOfWeek = "DASHBOARD.SCHEDULE.DAYS.WEDNESDAY";
                        break;
                    case 4:
                        dayOfWeek = "DASHBOARD.SCHEDULE.DAYS.THURSDAY";
                        break;
                    case 5:
                        dayOfWeek = "DASHBOARD.SCHEDULE.DAYS.FRIDAY";
                        break;
                    case 6:
                        dayOfWeek = "DASHBOARD.SCHEDULE.DAYS.SATURDAY";
                        break;
                    case 7:
                        dayOfWeek = "DASHBOARD.SCHEDULE.DAYS.SUNDAY";
                }

                return dayOfWeek;
            }

            if (entry) {
                vm.entry = entry;
                var process = {};
                vm.time = entry.startTime;

                vm.updateJob = true;

                process.processDefinitionId = vm.entry.processDefinitionId;
                process.name = vm.entry.name;

                vm.selectedProcess = process;
            }

            vm.getAllProcesses = getAllProcesses;
            vm.cancel = cancel;
            vm.save = save;
            vm.remove = remove;


            vm.getAllProcesses();

            function getAllProcesses() {
                deploymentsService.getAll().then(function (dataResponse) {
                    for (var i = 0; i < dataResponse.length; i++) {
                        deploymentsService.getProcessDefinitionByDeploymentId(dataResponse[i].id).then(function (dataResponse) {
                            var process = {};
                            process.processDefinitionId = dataResponse[0].id;
                            process.name = dataResponse[0].key;
                            vm.processes.push(process);
                        });

                    }
                });
            }

            function save() {
                if (vm.selectedProcess.processDefinitionId && vm.time) {
                    var schedule = {};
                    var timeFragments = vm.time.split(":");

                    if (timeFragments[0].length > 1 && timeFragments[0].startsWith("0"))
                        timeFragments[0] = timeFragments[0].substring(1);

                    if (timeFragments[1].length > 1 && timeFragments[1].startsWith("0"))
                        timeFragments[1] = timeFragments[1].substring(1);


                    var local = moment.tz(timeFragments[0], "h", moment.tz.guess());
                    var utc = local.clone().utc().format('H');

                    schedule.processDefinitionId = vm.selectedProcess.processDefinitionId;
                    schedule.startTime = timeFragments[1] + " " + utc + " * * " + col;

                    if (!vm.updateJob)
                        scheduleService.add(schedule).then(function () {
                            vm.cancel();
                            $state.reload();
                        });
                    else
                        scheduleService.update(entry.id, schedule).then(function () {
                            vm.cancel();
                            $state.reload();
                        });
                }
            }

            function remove() {
                if (vm.entry) {
                    scheduleService.remove(entry.id).then(function () {
                        vm.cancel();
                        $state.reload();
                    })
                }
            }

            function cancel() {
                $mdDialog.cancel();
            }
        }
    }

    angular
        .module('app.apps.schedule')
        .component('seplAppsSchedule', {
            templateUrl: 'modules/apps/schedule/schedule.html',
            controller: ScheduleController
        });
})
();