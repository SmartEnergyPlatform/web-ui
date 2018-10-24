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
    function AnalyticsExportController(analyticsExportService, Instance,$scope, $state,$timeout, INFLUX_API_URL, $mdToast)
    {
        var vm = this;
        vm.repoItems = [];
        vm.requestComplete = false;

        vm.url = INFLUX_API_URL;

        vm.next = next;

        vm.sortAttributes = [{
            label: "SORT.BY_NAME",
            value: "name",
            order: "desc"
        }];

        vm.initialLoading = true;
        vm.scrollDisabled = false;

        var limit = 6;
        var offset = 0;
        var searchPromise;

        vm.deleteInstance= deleteInstance;

        function reset() {
            vm.initialLoading = true;
            vm.scrollDisabled = false;
            offset = 0;
        }

        function next() {
            if (vm.requestComplete) {
                vm.initialLoading = false;
                offset += limit;
                getAllInstances()
            }
        }

        function getSortString(sortObject) {
            if (sortObject == null){
                return null;
            }
            return sortObject.value + ":" + sortObject.order
        }

        $scope.$watchCollection(function () {
            return vm.sortItem;
        }, function () {
            if (vm.sortItem != null){
                reset();
                getAllInstances();
            }
        });

        $scope.$watch(function () {
            return vm.searchText;
        }, function () {
            if (vm.searchText != null) {
                $timeout.cancel(searchPromise)
                searchPromise = $timeout(function () {
                    reset();
                    getAllInstances();
                }, 500);
            }
        });

        function getAllInstances() {
            vm.requestComplete = false;
            if (vm.initialLoading) {
                vm.repoItems = [];
                offset = 0;
            }
            analyticsExportService.getAll(vm.searchText, limit, offset, getSortString(vm.sortItem)).then(function (dataResponse) {
                var instances = dataResponse;
                if (instances.length < 1) {
                    vm.scrollDisabled = true;
                } else {
                    for (var i = 0; i < instances.length; i++) {
                        vm.repoItems.push(new Instance(
                            instances[i].ID,
                            instances[i].FilterType,
                            instances[i].Name,
                            instances[i].Description,
                            instances[i].EntityName,
                            instances[i].Topic,
                            instances[i].Measurement,
                            instances[i].Database
                        ));
                    }
                }
                vm.requestComplete = true;
            });
        }

        function deleteInstance(id){
            analyticsExportService.del(id).then(function () {
                $mdToast.show($mdToast.deleteExport());
                getAllInstances();
                $state.reload();
            });
        }
    }

    angular
        .module('app.data.export')
        .component('seplDataExport', {
            templateUrl: 'modules/data/export/export.html',
            controller: AnalyticsExportController
        });
})();