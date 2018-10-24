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
    function PropertiesController($mdDialog,
                                  $scope,
                                  chart,
                                  chartService,
                                  analyticsExportService) {
        var vm = this;

        vm.searchInfo = {term: ""};
        vm.loadExports = loadExports;
        vm.cancel = cancel;
        vm.save = save;
        vm.clearSearch = clearSearch;

        vm.exports = [];
        vm.source = {};
        vm.values = [];

        $scope.$watch(function () {
            return chart
        }, function () {
            vm.title = chart.title;
            vm.source = chart.source;
            vm.device = chart.device;
            vm.frame = chart.frame;
            vm.type = chart.options.chart.type;
            vm.x_field = "time";//chart.x_field;
            vm.x_name = chart.x_name;
            vm.y_field = chart.y_field;
            vm.y_name = chart.y_name;
        });

        $scope.$watch(function () {
            return vm.source
        }, function () {
            if (vm.source.Values != null){
                for (var i = 0; i < vm.source.Values.length; i++){
                    vm.values.push(vm.source.Values[i].Name);
                }
            }
        });

        function loadExports() {
            analyticsExportService.getAll().then(function (data) {
                vm.exports = data;
            })
        }

        function clearSearch() {
            vm.searchInfo.searchText = "";
            vm.exports = {};
        }

        function save() {
            chart.title = vm.title;
            chart.frame = vm.frame;
            chart.source = vm.source;
            chart.x_field = vm.x_field;
            chart.x_name = vm.x_name;
            chart.y_field = vm.y_field;
            chart.y_name = vm.y_name;

            if (chart.options.chart.type !== vm.type) {
                chart.options.chart.type = vm.type;
            }

            chartService.update(chart._id, chart);
            cancel();
        }

        function cancel() {
            $mdDialog.cancel();
        }

    }

    angular
        .module('app.apps.dashboard.chart')
        .controller('PropertiesController', PropertiesController)
})();