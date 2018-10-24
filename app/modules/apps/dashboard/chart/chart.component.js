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
    function ChartController($scope, moment, $mdDialog, influxService, $interval) {
        var vm = this;

        vm.showPropertiesDialog = showPropertiesDialog;
        vm.resetChart = resetChart;
        vm.remove = remove;
        vm.loadData = loadData;
        vm.reloadChart = reloadChart;
        vm.fieldNo = 1;

        var refreshPromise;

        $scope.$watch(function () {
            return vm.refresh;
        }, function () {
            $interval.cancel(refreshPromise);
            if (vm.refresh > 0){
                refreshPromise = $interval(function(){
                    loadData();
                },vm.refresh * 1000);
            }
        });

        $scope.$on('$destroy', function () {
            $interval.cancel(refreshPromise);
        });

        function remove(id, index) {
            vm.onDelete({index: index, id: id});
        }

        $scope.$watch('chart', function () {
            vm.chart.options = {
                chart: {
                    type: vm.chart.type,
                    x: function (d) {
                        return moment(d[0]);
                    },
                    y: function (d) {
                        return d[vm.fieldNo];
                    },
                    useInteractiveGuideline: true,
                    xAxis: {
                        axisLabel: vm.chart.x_name,
                        tickFormat: function (d) {
                            return moment(d).format("HH:mm:ss")
                        }

                    },
                    yAxis: {
                        axisLabel: vm.chart.y_name,
                        tickFormat: function (d) {
                            return d3.format('.03f')(d);
                        }
                    },
                    noData: [[]]
                }
            };
            resetChart();
            loadData();
        });

        function loadData() {
            if (!vm.data.length)
                vm.data.push(initData());
            influxService.get(vm.chart.source.ID, vm.chart.frame).then(function (data) {
                if (data.results != null){
                    for (var i = 0; i < data.results[0].series[0].columns.length; i++) {
                        if (data.results[0].series[0].columns[i] === vm.x_field) {
                            vm.fieldNo = i;
                        }
                    }
                    vm.data[0].values = data.results[0].series[0].values.reverse();
                }
            });
        }

        function initData() {
            var dataObject = {};

            dataObject.key = vm.chart.y_name;
            dataObject.values = [];

            return dataObject;
        }

        function reloadChart() {
            loadData();
        }

        function resetChart() {
            vm.data = [];
        }

        function showPropertiesDialog(chart, ev) {
            $mdDialog.show({
                locals: {
                    chart: chart
                },
                controller: 'PropertiesController',
                controllerAs: 'ctrl',
                templateUrl: 'modules/apps/dashboard/chart/chartdialog/properties.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen
            }).finally(function() {
                resetChart();
                loadData();
            });
        }
    }

    angular
        .module('app.apps.dashboard.chart')
        .component('seplAppsDashboardChart', {
            templateUrl: 'modules/apps/dashboard/chart/chart.html',
            controller: ChartController,
            bindings: {
                refresh: '<',
                chart: '<',
                onDelete: '&'
            }
        });
})
();