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
    function DataFlowPipesController(dataPipelineRepositoryService,$scope, analyticsPipelineService, $timeout, $state) {
        var vm = this;

        vm.pipelineItems = [];

        vm.requestComplete = false;

        vm.columns = ['ID'];
        vm.columnKeys = ['id'];
        vm.row = {};

        getAllPipelines()

        function getAllPipelines() {
            vm.requestComplete = false;
            vm.pipelineItems = [];
            dataPipelineRepositoryService.getAll().then(function (dataResponse) {
                var pipelines = dataResponse;
                if (pipelines != null){
                    for (var i = 0; i < pipelines.length; i++) {
                        vm.pipelineItems.push({
                            id: pipelines[i].id
                        });
                    }
                }
                vm.requestComplete = true;
            });
        }

        function deletePipeline(id) {
            vm.requestComplete = false;
            analyticsPipelineService.deletePipeline(id).then(function () {
                $timeout(function () {
                    $state.reload();
                    vm.requestComplete = true;
                }, 5000);
            });
        }


        $scope.$watchCollection(function watchRows($scope) {
            return (vm.deleteItemId);
        }, function (deleteItemId) {
            if (deleteItemId !== undefined) {
                vm.requestComplete = false;
                deletePipeline(deleteItemId);
            }
        });

    }

    angular
        .module('app.data.flowrepo.pipes')
        .component('seplDataFlowPipes', {
            templateUrl: 'modules/data/flowrepo/pipes/pipes.html',
            controller: DataFlowPipesController
        });
})();