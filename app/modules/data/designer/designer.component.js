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
    function AnalyticsDesignerController($translatePartialLoader,
                                         analyticsOperatorRepositoryService,
                                         analyticsFlowRepositoryService,
                                         authorizationService,
                                         $stateParams,
                                         flowchartConstants,
                                         $mdToast,
                                         $timeout,
                                         $scope,
                                         Operator,
                                         Flow
    ) {
        var vm = this;
        $translatePartialLoader.addPart('data');
        vm.addNewNode = addNewNode;
        vm.saveFlow = saveFlow;
        vm.repoItems = [];
        getAllOperators();
        vm.test = false;
        vm.flowchartselected = [];
        vm.initialLoading = true;
        initFlow();
        var searchPromise;
        var limit = 8;
        var offset = 0;

        $scope.$watch(function () {
            return vm.searchText;
        }, function () {
            if (vm.searchText != null) {
                $timeout.cancel(searchPromise)
                searchPromise = $timeout(function () {
                    reset();
                    getAllOperators();
                }, 500);
            }
        });

        var token = authorizationService.getToken();

        function reset() {
            vm.initialLoading = true;
            vm.scrollDisabled = false;
            offset = 0;
        }

        function initFlow() {
            if ($stateParams.id) {
                analyticsFlowRepositoryService.get($stateParams.id).then(function (dataResponse) {
                    vm.flow = new Flow($stateParams.id,
                        dataResponse.name,
                        dataResponse.model,
                        dataResponse.nodeId,
                        dataResponse.connectorId
                    );
                    vm.test = true;
                })
            } else {
                vm.flow = new Flow();
                vm.test = true;
            }
        }

        function saveFlow() {
            analyticsFlowRepositoryService.addOrUpdate(
                vm.flow.id,
                vm.flow.name,
                vm.flow.model,
                vm.flow.nodeId,
                vm.flow.connectorId
            ).then(function () {
                $mdToast.show($mdToast.saveFlow());
            });
        }

        function addNewNode(id) {
            var operator = null;
            analyticsOperatorRepositoryService.get(id).then(function (dataResponse) {
                operator = new Operator(dataResponse._id,
                    dataResponse.name,
                    dataResponse.image,
                    dataResponse.description,
                    dataResponse.pub,
                    dataResponse.inputs,
                    dataResponse.outputs
                )
            }).then(function () {
                var inputs = [];
                var outputs = [];
                var input_len = operator.inputs.length;
                var output_len = operator.outputs.length;
                var maxCon = output_len;
                if (input_len > output_len)
                    maxCon = input_len;
                operator.inputs.forEach(function (input) {
                    inputs.push(
                        {
                            id: vm.flow.connectorId++,
                            type: flowchartConstants.topConnectorType,
                            value: {
                                name: input.name,
                                type: input.type
                            }
                        }
                    );
                });
                operator.outputs.forEach(function (output) {
                    outputs.push(
                        {
                            id: vm.flow.connectorId++,
                            type: flowchartConstants.bottomConnectorType,
                            value: {
                                name: output.name,
                                type: output.type
                            }
                        }
                    );
                });
                var edges = inputs.concat(outputs);
                var newNode = {
                    name: operator.name,
                    imageId: id,
                    maxCon: maxCon,
                    id: vm.flow.nodeId++,
                    x: 200,
                    y: 100,
                    color: '#F15B26',
                    connectors: edges
                };
                vm.flow.model.nodes.push(newNode);
            });
        }

        function getAllOperators() {
            vm.requestComplete = false;
            if (vm.initialLoading) {
                vm.repoItems = [];
                offset = 0;
            }
            analyticsOperatorRepositoryService.getAll(vm.searchText, limit, offset, null).then(function (dataResponse) {
                var operators = dataResponse.operators;
                if (operators.length < 1) {
                    vm.scrollDisabled = true;
                } else {
                    for (var i = 0; i < operators.length; i++) {
                        var editable = false;
                        if(operators[i].userId === token.sub){
                            editable =true;
                        }
                        vm.repoItems.push(new Operator(operators[i]._id,
                            operators[i].name,
                            operators[i].image,
                            operators[i].description,
                            operators[i].pub,
                            [],
                            [],
                            editable
                        ));
                    }

                }
                vm.requestComplete = true;
            });
        }
    }

    angular
        .module('app.data.designer')
        .component('seplDataDesigner', {
            templateUrl: 'modules/data/designer/designer.html',
            controller: AnalyticsDesignerController
        });
})();