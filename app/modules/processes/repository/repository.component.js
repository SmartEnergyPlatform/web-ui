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
    function RepositoryController(permissionsService, repositoryService, FileSaver, deploymentsService, $state, x2js, $mdDialog, $mdToast, $translate, $rootScope, $cookies, $timeout, $scope, authorizationService, $stateParams) {
        const FILTER_CRITERIA_OWN = 'own';
        const FILTER_CRITERIA_ADD = 'add';
        const FILTER_CRITERIA_PUBLISH = 'publish';
        var vm = this;
        vm.translation = {};
        vm.repoItems = [];
        vm.steps = 50;
        vm.limit = vm.steps;
        vm.offset = 0;
        vm.searchText = '';
        vm.requestComplete = false;

        vm.showGridList = isGridList();
        vm.viewIcon = getViewIcon();
        vm.sortAttributes = [{
            label: "SORT.BY_DATE",
            value: "date",
            order: "desc"
        }, {
            label: "SORT.BY_NAME",
            value: "name",
            order: "asc"
        }];
        vm.sortItem = vm.sortAttributes[0];
        vm.ready = false;
        vm.initialLoading = true;
        vm.initialize = true;
        vm.scrollDisabled = false;
        var searchPromise;

        // functions
        vm.openDesigner = openDesigner;
        vm.permission = permission;
        vm.switchView = switchView;
        vm.getProcessModels = getProcessModels;
        vm.reset = reset;
        vm.next = next;
        vm.deleteProcess = deleteProcess;
        vm.copyProcess = copyProcess;

        // watchers
        $scope.$watchCollection(function (scope) {
                return (vm.sortItem);
            }, function (sortItem) {
                if (vm.initialize) {
                    $timeout(function () {
                        vm.initialize = false;
                    });
                } else if (sortItem !== null && sortItem !== undefined) {
                    vm.reset();
                    vm.getProcessModels();
                }
            }
        );

        $scope.$watchCollection(function (scope) {
                return (vm.searchText);
            }, function (searchText) {
                if (vm.initialize) {
                    $timeout(function () {
                        vm.initialize = false;
                    });
                } else if (searchText !== undefined){
                    $timeout.cancel(searchPromise);
                    searchPromise = $timeout(function () {
                        vm.reset();
                        vm.getProcessModels();
                    }, 500);
                }
            }
        );

        vm.$onInit = function () {
            translate();
            vm.ready = true;
            vm.getProcessModels();
        };

        function next() {
            if (vm.requestComplete) {
                vm.initialLoading = false;
                vm.offset = parseInt(vm.offset) + parseInt(vm.steps);
                vm.getProcessModels(vm.repoItems);
            }
        }

        function reset() {
            vm.repoItems = [];
            vm.scrollDisabled = false;
            vm.initialLoading = true;
            vm.offset = 0;
        }

        function getProcessModels(current) {
            if (!vm.ready) {
                return
            }

            if (!current) {
                current = [];
            }

            vm.requestComplete = false;
            if ($stateParams.filterCriteria) {

                var conditions = getConditions($stateParams.filterCriteria);

                permissionsService.getProcessModelsWithConditions(vm.searchText, vm.limit, vm.offset, vm.sortItem.value, vm.sortItem.order, conditions).then(function (resp) {
                    setProcessModels(current, resp);
                });

            } else {
                permissionsService.getProcessModels(vm.searchText, vm.limit, vm.offset, vm.sortItem.value, vm.sortItem.order).then(function (repoItems) {
                    setProcessModels(current, repoItems);
                });
            }
        }

        function getConditions(filterCriteria) {
            var conditions = {};
            switch (filterCriteria) {
                case FILTER_CRITERIA_ADD:
                    conditions.condition = setCondition("features.parent_id", "!=", "null");
                    break;
                case FILTER_CRITERIA_PUBLISH:
                    conditions.condition = setCondition("creator", "!=", "jwt.user");
                    break;
                case FILTER_CRITERIA_OWN:
                    conditions.and = [{'condition': setCondition("creator", "==", "jwt.user")}, {'condition': setCondition("features.parent_id", "==", "null")}];
                    break;
            }
            return conditions;
        }

        function setCondition(feature, operation, ref) {
            var condition = {};
            condition.feature = feature;
            condition.operation = operation;
            condition.ref = ref;
            return condition;
        }

        function setProcessModels(current, items) {
            if (_.isNil(items)) {
                vm.scrollDisabled = true;
            } else {
                current = current.concat(repositoryService.createRepoItems(items));
            }
            vm.requestComplete = true;
            vm.repoItems = current;
        }

        function isGridList() {
            if ($cookies.get("processRepoGridView") !== undefined) {
                return $cookies.getObject("processRepoGridView");
            }
            return true;
        }

        function switchView() {
            vm.showGridList = !vm.showGridList;
            $cookies.putObject('processRepoGridView', vm.showGridList);
            getViewIcon();
        }

        function getViewIcon() {
            return vm.viewIcon = vm.showGridList ? 'list' : 'view_module';
        }

        function openDesigner() {
            $state.go('processes.designer');
        }

        function permission(id) {
            permissionsService.dialog("processmodel", id)
        }

        function deleteProcess(id) {
            vm.requestComplete = false;
            var promiseDelete = repositoryService.remove(id);
            promiseDelete.then(function () {
                vm.repoItems.forEach(function (element, index, arr) {
                    if (element.id == id) {
                        vm.repoItems.splice(index, 1);
                        return
                    }
                });
                $mdToast.show($mdToast.deleteProcess());
                vm.requestComplete = true;
            });
        }

        function copyProcess(item) {
            vm.requestComplete = false;
            repositoryService.getProcessModel(item.id).then(function (resp) {
                var json = resp[0].process;
                json.definitions.process._id = json.definitions.process._id + "_" + vm.translation.COPY;
                var xml = x2js.json2xml_str(json);

                repositoryService.add(xml, x2js.json2xml_str(resp[0].svg)).then(function (clone) {
                    var repoItem = new repositoryService.RepoItem(clone._id, clone.process.definitions.process._id, clone.date, x2js.json2xml_str(clone.svg), item.svgJson);
                    vm.repoItems = [repoItem].concat(vm.repoItems);
                });
                vm.requestComplete = true;
            });
        }

        function translate() {
            $translate('DEPLOYMENTS.PROCESS_ELEMENT.COPY_SUFFIX').then(function (translation) {
                vm.translation.COPY = translation;
            });
        }
    }

    angular
        .module('app.processes.repository')
        .component('seplProcessRepository', {
            templateUrl: 'modules/processes/repository/repository.html',
            controller: RepositoryController,
            bindings: {
                searchText: '<'
            }
        });
})
();