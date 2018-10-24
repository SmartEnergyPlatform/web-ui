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
    function AnalyticsOperatorController(analyticsOperatorRepositoryService,$state,$mdToast,$stateParams, $translatePartialLoader, Operator) {
        var vm = this;
        vm.saveOperator = saveOperator;
        vm.addInput = addInput;
        vm.addOutput = addOutput;
        vm.delInput = delInput;
        vm.delOutput = delOutput;
        $translatePartialLoader.addPart('data');
        vm.operator = {};
        vm.operator.inputs = [];
        vm.operator.outputs = [];
        vm.dropdown = [
            "float",
            "string",
            "int"
        ];

        initOperator();

        function initOperator() {
            if ($stateParams.id) {
                analyticsOperatorRepositoryService.get($stateParams.id).then(function (dataResponse) {
                    vm.operator = new Operator(
                        $stateParams.id,
                        dataResponse.name,
                        dataResponse.image,
                        dataResponse.description,
                        dataResponse.pub,
                        dataResponse.inputs,
                        dataResponse.outputs
                    );
                })
            } else {
                vm.operator = new Operator();
            }
        }

        function saveOperator(isValid) {
            if (!isValid) {
                $mdToast.show($mdToast.inputError());
            } else {
                analyticsOperatorRepositoryService.save(vm.operator).then(function () {
                    $state.go('data.operatorrepo', {}, {reload: true});
                    $mdToast.show($mdToast.addedOperator());
                });
            }
        }

        function addInput(){
            vm.operator.inputs.push({});
        };

        function addOutput(){
            vm.operator.outputs.push({});
        };

        function delInput(input) {
            var index = vm.operator.inputs.indexOf(input);
            vm.operator.inputs.splice(index, 1);
        }

        function delOutput(output) {
            var index = vm.operator.outputs.indexOf(output);
            vm.operator.outputs.splice(index, 1);
        }
    }

    angular
        .module('app.data.operatorrepo.operator')
        .component('seplDataOperator', {
            templateUrl: 'modules/data/operatorrepo/operator/operator.html',
            controller: AnalyticsOperatorController
        });
})();