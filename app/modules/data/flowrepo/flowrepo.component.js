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
    function AnalyticsFlowRepositoryController(analyticsFlowRepositoryService,
                                               $timeout,
                                               $mdDialog,
                                               $state,
                                               $scope,
                                               $mdToast,
                                               $translate,
                                               Flow) {
        var vm = this;
        vm.next = next;
        vm.repoItems = [];

        vm.sortAttributes = [{
            label: "SORT.BY_NAME",
            value: "name",
            order: "desc"
        }];

        vm.initialLoading = true;
        vm.scrollDisabled = false;

        var limit = 30;
        var offset = 0;
        var searchPromise;

        vm.showConfirmDelete = showConfirmDelete;

        function reset() {
            vm.initialLoading = true;
            vm.scrollDisabled = false;
            offset = 0;
        }

        $scope.$watchCollection(function () {
            return vm.sortItem;
        }, function () {
            if (vm.sortItem != null){
                reset();
                getAllFlows();
            }
        });

        $scope.$watch(function () {
            return vm.searchText;
        }, function () {
            if (vm.searchText != null) {
                $timeout.cancel(searchPromise)
                searchPromise = $timeout(function () {
                    reset();
                    getAllFlows();
                }, 500);
            }
        });

        function getAllFlows() {
            vm.requestComplete = false;
            if (vm.initialLoading) {
                vm.repoItems = [];
                offset = 0;
            }
            analyticsFlowRepositoryService.getAll(vm.searchText, limit, offset, getSortString(vm.sortItem)).then(function (dataResponse) {
                var flows = dataResponse.flows;
                if (flows.length < 1) {
                    vm.scrollDisabled = true;
                } else {
                    for (var i = 0; i < flows.length; i++) {
                        vm.repoItems.push(new Flow(
                            flows[i]._id,
                            flows[i].name
                        ));
                    }
                }
                vm.requestComplete = true;
            });
        }

        function deleteFlow(id) {
            vm.requestComplete = false;
            analyticsFlowRepositoryService.del(id).then(function () {
                $mdToast.show($mdToast.deleteFlow());
                vm.requestComplete = true;
                $state.reload();
            });
        }

        function next() {
            if (vm.requestComplete) {
                vm.initialLoading = false;
                offset += limit;
                getAllFlows()
            }
        }

        function getSortString(sortObject) {
            if (sortObject == null){
                return null;
            }
            return sortObject.value + ":" + sortObject.order
        }

        function showConfirmDelete(event, id) {

            var trans = [
                "FUNCTIONS.SHOW_CONFIRM_DELETE_TITLE_DELETE_FLOW",
                "FUNCTIONS.SHOW_CONFIRM_DELETE_TEXT_CONTENT_REALLY",
                "FUNCTIONS.SHOW_CONFIRM_DELETE_ARIA_LABEL_CONTENT",
                "FUNCTIONS.SHOW_CONFIRM_DELETE_RESPONSE_OK",
                "FUNCTIONS.SHOW_CONFIRM_DELETE_RESPONSE_CANCEL"
            ];

            $translate(trans).then(function (translations) {
                var confirm = $mdDialog.confirm()
                    .title(translations["FUNCTIONS.SHOW_CONFIRM_DELETE_TITLE_DELETE_FLOW"])
                    .textContent(translations["FUNCTIONS.SHOW_CONFIRM_DELETE_TEXT_CONTENT_REALLY"])
                    .ariaLabel(translations["FUNCTIONS.SHOW_CONFIRM_DELETE_ARIA_LABEL_CONTENT"])
                    .targetEvent(event)
                    .ok(translations["FUNCTIONS.SHOW_CONFIRM_DELETE_RESPONSE_OK"])
                    .cancel(translations["FUNCTIONS.SHOW_CONFIRM_DELETE_RESPONSE_CANCEL"]);

                $mdDialog.show(confirm).then(function () {
                    deleteFlow(id);
                }, function () {
                    //TODO handle error
                });
            });
        }
    }

    angular
        .module('app.data.flowrepo')
        .component('seplDataFlowRepository', {
            templateUrl: 'modules/data/flowrepo/flows.html',
            controller: AnalyticsFlowRepositoryController
        });
})();
