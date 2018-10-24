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
    function AnalyticsOperatorRepositoryController(analyticsOperatorRepositoryService,
                                                   authorizationService,
                                                   $translatePartialLoader,
                                                   $mdToast,
                                                   $translate,
                                                   $mdDialog,
                                                   $state,
                                                   $scope,
                                                   $timeout,
                                                   Operator)
    {
        var vm = this;
        vm.Operator = Operator;
        vm.showConfirmDelete = showConfirmDelete;
        vm.repoItems = [];
        vm.name = '';

        vm.next = next;
        $translatePartialLoader.addPart('data');

        vm.sortAttributes = [{
            label: "SORT.BY_NAME",
            value: "name",
            order: "desc"
        }];

        vm.initialLoading = true;
        vm.scrollDisabled = false;

        var limit = 8;
        var offset = 0;
        var searchPromise;

        var token = authorizationService.getToken();

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
                getAllOperators();
            }
        });

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

        function getAllOperators() {
            vm.requestComplete = false;
            if (vm.initialLoading) {
                vm.repoItems = [];
                offset = 0;
            }
            analyticsOperatorRepositoryService.getAll(vm.searchText, limit, offset, getSortString(vm.sortItem)).then(function (dataResponse) {
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

        function showConfirmDelete(event, id) {

            var trans = [
                "OPERATORREPOSITORY.DELETE.TITLE",
                "OPERATORREPOSITORY.DELETE.TEXT",
                "OPERATORREPOSITORY.DELETE.OK",
                "OPERATORREPOSITORY.DELETE.CANCEL"
            ];

            $translate(trans).then(function (translations) {
                var confirm = $mdDialog.confirm()
                    .title(translations["OPERATORREPOSITORY.DELETE.TITLE"])
                    .textContent(translations["OPERATORREPOSITORY.DELETE.TEXT"])
                    .ariaLabel(translations["OPERATORREPOSITORY.DELETE.TITLE"])
                    .targetEvent(event)
                    .ok(translations["OPERATORREPOSITORY.DELETE.OK"])
                    .cancel(translations["OPERATORREPOSITORY.DELETE.CANCEL"]);

                $mdDialog.show(confirm).then(function () {
                    deleteOperator(id);
                }, function () {
                    //TODO handle error
                });
            });
        }

        function next() {
            if (vm.requestComplete) {
                vm.initialLoading = false;
                offset += limit;
                getAllOperators()
            }
        }

        function getSortString(sortObject) {
            if (sortObject == null){
                return null;
            }
            return sortObject.value + ":" + sortObject.order
        }

        function deleteOperator(id){
            vm.requestComplete = false;
            analyticsOperatorRepositoryService.del(id).then(function () {
                vm.requestComplete = true;
                $state.reload();
                $mdToast.show($mdToast.deletedOperator());
            });
        }
    }

    angular
        .module('app.data.operatorrepo')
        .component('seplDataOperatorRepository', {
            templateUrl: 'modules/data/operatorrepo/operatorrepo.html',
            controller: AnalyticsOperatorRepositoryController
        });
})();