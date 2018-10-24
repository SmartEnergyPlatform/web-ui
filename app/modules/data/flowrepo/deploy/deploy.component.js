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
    function AnalyticsFlowDeployController($stateParams,
                                                     $state,
                                                     $scope,
                                                     analyticsParserService,
                                                     analyticsPipelineService,
                                                     deviceInstancesService,
                                                     deviceTypesService,
                                                     InputNode,
                                                     Connector) {
        var vm = this;
        vm.inputs = {};
        vm.requestComplete = false;

        vm.searchInfo = {term: "", searchText: ""};
        vm.deviceList = [];
        vm.deviceTypes = [];
        vm.inputs = [];

        vm.startPipeline = startPipeline;
        vm.search = search;
        vm.load = load;
        vm.clearSearch = clearSearch;
        vm.getServiceList = getServiceList;

        init();

        function init() {
            analyticsParserService.getInputs($stateParams.id).then(function (data) {
                data.forEach(function (input) {
                    var connectors = [];
                    input.connectors.forEach(function (connector) {
                        connectors.push(new Connector(connector.id, connector.value))
                    });
                    vm.inputs.push(new InputNode(input.id, input.name, connectors))
                });
                vm.requestComplete = true;
            });
        }

        function createRequestData() {
            var pipeline = {nodes: []}
            pipeline.id = $stateParams.id;
            for (var i = 0; i < vm.inputs.length; i++) {
                var inputs = {};
                for (var j = 0; j < vm.inputs[i].connectors.length; j++) {
                    var name = vm.inputs[i].connectors[j].service.id.replace(/#/g, '_');
                    var deviceId = vm.inputs[i].connectors[j].device.id;
                    var value = {
                        name: vm.inputs[i].connectors[j].value.name,
                        path: vm.inputs[i].connectors[j].path
                    };
                    if (name + deviceId in inputs) {
                        inputs[name + deviceId].values.push(value)
                    } else {
                        inputs[name + deviceId] = {
                            name: vm.inputs[i].connectors[j].service.id.replace(/#/g, '_'),
                            deviceId: vm.inputs[i].connectors[j].device.id,
                            values: [value]
                        }
                    }
                }
                pipeline.nodes.push({
                    nodeId: vm.inputs[i].id,
                    inputs: inputs
                });
            }
            return pipeline;
        }

        function startPipeline() {
            vm.requestComplete = false;
            var pipeline = createRequestData();
            analyticsPipelineService.startPipeline(pipeline).then(function () {
                vm.requestComplete = true;
                $state.go('data.flowrepo.pipes', {}, {reload: true});
            });
        }

        function load() {
            clearSearch();
            deviceInstancesService.getInstances(50, 0).then(function (data) {
                vm.deviceList = data;
            });
        }

        function clearSearch() {
            vm.searchInfo = {term: "", searchText: ""};
        }

        function search() {
            deviceInstancesService.searchInstances(vm.searchInfo.term, 50, 0).then(function (data) {
                vm.deviceList = data;
            });
        }

        function getServiceList(id, nodeNo, connectorNo) {
            vm.deviceTypes = [];
            deviceTypesService.get(vm.inputs[nodeNo].connectors[connectorNo].device.device_type).then(function (data) {
                vm.deviceTypes[id] = data;
            });
        }
    }

    angular
        .module('app.data.flowrepo.deploy')
        .component('seplDataFlowDeploy', {
            templateUrl: 'modules/data/flowrepo/deploy/deploy.html',
            controller: AnalyticsFlowDeployController
        });
})();