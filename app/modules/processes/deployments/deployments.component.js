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
    function DeploymentsController(deploymentsService, $state, $mdDialog, PROCESS_SERVICE_URL, clipboard, $sce, $q, $translate, $scope, $timeout) {
        var vm = this;
        vm.searchText = '';
        vm.requestComplete = false;
        vm.initialLoading = true;
        vm.initialize = true;
        vm.steps = 24;
        vm.limit = vm.steps;
        vm.offset = 0;
        vm.deploymentItems = [];
        vm.sortAttributes = [{
            label: "SORT.BY_DATE",
            value: "deploymentTime",
            order: "desc"
        }, {
            label: "SORT.BY_NAME",
            value: "name",
            order: "asc"
        }];
        vm.sortItem = vm.sortAttributes[0];
        vm.ready = false;
        var searchPromise;
        vm.copyLink = copyLink;
        vm.deleteDeployment = deleteDeployment;
        vm.showConfirmDelete = showConfirmDelete;
        vm.showConfirmExecution = showConfirmExecution;
        vm.showHistory = showHistory;
        vm.showIncidents = showIncidents;
        vm.displayDiagram = displayDiagram;
        vm.showDependenciesExecution = showDependenciesExecution;
        vm.clone = clone;
        vm.init = init;
        vm.next = next;
        vm.disableScroll = disableScroll;
        vm.getDeployments = getDeployments;

        // watchers
        $scope.$watchCollection(function (scope) {
                return (vm.sortItem);
            }, function (sortItem) {

                if (vm.initialize) {
                    $timeout(function () {
                        vm.initialize = false;
                    });
                } else if (sortItem !== null && sortItem !== undefined) {
                    vm.init();
                    vm.getDeployments();
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
                    vm.init();
                    vm.getDeployments();
                }, 500);
            }
            }
        );

        vm.$onInit = function () {
            vm.ready = true;
            vm.getDeployments();
        };

        function next() {
            if (vm.requestComplete) {
                vm.initialLoading = false;
                vm.offset = vm.limit + vm.offset;
                vm.getDeployments(vm.deploymentItems);
            }
        };

        function init() {
            vm.initialLoading = true;
            vm.scrollDisabled = false;
            vm.limit = vm.steps;
            vm.offset = 0;
            vm.deploymentItems = [];
        }

        function disableScroll(data) {
            if (Array.isArray(data)) {
                if (data.length != vm.limit) {
                    vm.scrollDisabled = true;
                }
            } else {
                vm.scrollDisabled = true;
            }
        };

        function getDeployments(current) {
            if (!vm.ready) {
                return
            }

            if (!current) {
                current = [];
            }

            vm.requestComplete = false;

            if (vm.searchText) {
                deploymentsService.getProcessesSearch(vm.limit, vm.offset, vm.sortItem.value, vm.sortItem.order, vm.searchText).then(function (response) {
                    vm.disableScroll(response);
                    var promises = []; 
                    vm.deployment = [];
                    for (var i = 0; i < response.length; i++) {
                        vm.deployment.push(new DeploymentItem(response[i].id, response[i].name, response[i].source, response[i].tenantId, response[i].deploymentTime));
                        promises.push(getProcessMetaData(vm.deployment[i]));
                    }

                    $q.all(promises).then(function () {
                        vm.deploymentItems = current.concat(vm.deployment);
                        vm.requestComplete = true;
                    });

                });
            } else {
                deploymentsService.getProcesses(vm.limit, vm.offset, vm.sortItem.value, vm.sortItem.order).then(function (response) {
                    vm.disableScroll(response);
                    var promises = [];
                    vm.deployment = [];
                    for (var i = 0; i < response.length; i++) {
                        vm.deployment.push(new DeploymentItem(response[i].id, response[i].name, response[i].source, response[i].tenantId, response[i].deploymentTime));
                        promises.push(getProcessMetaData(vm.deployment[i]));
                    }

                    $q.all(promises).then(function () {
                        vm.deploymentItems = current.concat(vm.deployment);
                        vm.requestComplete = true;
                    });

                });
            }
        };

        function clone(event, item) {
            var trans = [
                "DEPLOYMENTS.FUNCTIONS.CLONE_PROCESS.SHOW_CONFIRM_COPY_TITLE_COPY_PROCESS",
                "DEPLOYMENTS.FUNCTIONS.CLONE_PROCESS.SHOW_CONFIRM_COPY_TEXT_CONTENT_REALLY",
                "DEPLOYMENTS.FUNCTIONS.CLONE_PROCESS.SHOW_CONFIRM_COPY_ARIA_LABEL_CONTENT",
                "DEPLOYMENTS.FUNCTIONS.CLONE_PROCESS.SHOW_CONFIRM_COPY_RESPONSE_OK",
                "DEPLOYMENTS.FUNCTIONS.CLONE_PROCESS.SHOW_CONFIRM_COPY_RESPONSE_CANCEL",
            ];

            $translate(trans).then(function (translations) {
                var confirm = $mdDialog.confirm()
                    .title(translations["DEPLOYMENTS.FUNCTIONS.CLONE_PROCESS.SHOW_CONFIRM_COPY_TITLE_COPY_PROCESS"])
                    .textContent(translations["DEPLOYMENTS.FUNCTIONS.CLONE_PROCESS.SHOW_CONFIRM_COPY_TEXT_CONTENT_REALLY"])
                    .ariaLabel(translations["DEPLOYMENTS.FUNCTIONS.CLONE_PROCESS.SHOW_CONFIRM_COPY_ARIA_LABEL_CONTENT"])
                    .targetEvent(event)
                    .ok(translations["DEPLOYMENTS.FUNCTIONS.CLONE_PROCESS.SHOW_CONFIRM_COPY_RESPONSE_OK"])
                    .cancel(translations["DEPLOYMENTS.FUNCTIONS.CLONE_PROCESS.SHOW_CONFIRM_COPY_RESPONSE_CANCEL"]);

                $mdDialog.show(confirm).then(function () {
                    $state.go('processes.deploy-clone', {deploymentid: item.id});
                }, function () {
                    //TODO handle error
                });
            })
        }

        function showDependenciesExecution(event, deployment) {
            $mdDialog.show({
                templateUrl: "modules/processes/deployments/dependencies_dialog.html",
                clickOutsideToClose: true,
                autoWrap: false,
                fullscreen: true,
                controller: dependenciesDialog,
                locals: {dependencies: deployment.dependencies}
            });
        }

        function displayDiagram(item) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(item.name)
                    .htmlContent($sce.trustAsHtml("<img src='" + item.svgLink + "' />"))
                    .ok('Close')
            );
        }

        function showHistory(item) {
            $state.go('processes.monitor', {processDefinitionId: item.processDefintionId});
        }

        function showIncidents(item) {
            $state.go('processes.monitor.running', {processDefinitionId: item.processDefintionId});
        }

        function getProcessMetaData(deployment) {
            return deploymentsService.getProcessDefinitionByDeploymentId(deployment.id).then(function (dataResponse) {
                deployment.processDefintionId = dataResponse[0].id;
                deployment.link = PROCESS_SERVICE_URL + "/process-definition/" + deployment.processDefintionId + "/start";
                deployment.name = dataResponse[0].key;
            }).then(function () {
                return deploymentsService.getDiagramLink(deployment.processDefintionId).then(function (svglink) {
                    deployment.svgLink = svglink;
                });
            }).then(function () {
                return deploymentsService.getIncidentsCount(deployment).then(function (count) {
                    deployment.hasIncidents = count > 0;
                });
            }).then(function () {
                return deploymentsService.getDependencies(deployment.id).then(function (dependencies) {
                    deployment.dependencies = dependencies;
                });
            });
        }

        function DeploymentItem(id, processId, source, tenantId, deploymentTime) {
            var item = this;

            item.id = id;
            item.processId = processId;
            item.source = source;
            item.tenantId = tenantId;
            item.deploymentTime = deploymentTime;
            item.formattedDeploymentTime = moment(moment.tz(item.deploymentTime, moment.ISO_8601, true, "UTC")).tz(moment.tz.guess()).format("DD.MM.YYYY, HH:mm");
            item.showLink = false;
        }

        function deleteDeployment(id) {
            vm.requestComplete = false;
            deploymentsService.remove(id).then(function () {
                vm.requestComplete = true;
                $state.reload();
            });
        }

        function showConfirmDelete(event, id) {

            var trans = [
                "DEPLOYMENTS.FUNCTIONS.DELETE_DEPLOYMENT.SHOW_CONFIRM_DELETE_TITLE_DELETE",
                "DEPLOYMENTS.FUNCTIONS.DELETE_DEPLOYMENT.SHOW_CONFIRM_DELETE_TEXT_CONTENT_REALLY",
                "DEPLOYMENTS.FUNCTIONS.DELETE_DEPLOYMENT.SHOW_CONFIRM_DELETE_ARIA_LABEL_CONTENT",
                "DEPLOYMENTS.FUNCTIONS.DELETE_DEPLOYMENT.SHOW_CONFIRM_DELETE_RESPONSE_OK",
                "DEPLOYMENTS.FUNCTIONS.DELETE_DEPLOYMENT.SHOW_CONFIRM_DELETE_RESPONSE_CANCEL",
            ];

            $translate(trans).then(function (translations) {
                var confirm = $mdDialog.confirm()
                    .title(translations["DEPLOYMENTS.FUNCTIONS.DELETE_DEPLOYMENT.SHOW_CONFIRM_DELETE_TITLE_DELETE"])
                    .textContent(translations["DEPLOYMENTS.FUNCTIONS.DELETE_DEPLOYMENT.SHOW_CONFIRM_DELETE_TEXT_CONTENT_REALLY"])
                    .ariaLabel(translations["DEPLOYMENTS.FUNCTIONS.DELETE_DEPLOYMENT.SHOW_CONFIRM_DELETE_ARIA_LABEL_CONTENT"])
                    .targetEvent(event)
                    .ok(translations["DEPLOYMENTS.FUNCTIONS.DELETE_DEPLOYMENT.SHOW_CONFIRM_DELETE_RESPONSE_OK"])
                    .cancel(translations["DEPLOYMENTS.FUNCTIONS.DELETE_DEPLOYMENT.SHOW_CONFIRM_DELETE_RESPONSE_CANCEL"]);

                $mdDialog.show(confirm).then(function () {
                    deleteDeployment(id);
                }, function () {
                    //TODO handle error
                });
            })
        }

        function showConfirmExecution(event, deployment) {
            var trans = [
                "DEPLOYMENTS.FUNCTIONS.CONFIRM_EXECUTION.SHOW_CONFIRM_TITLE_CONFIRM_EXECUTION",
                "DEPLOYMENTS.FUNCTIONS.CONFIRM_EXECUTION.SHOW_CONFIRM_EXECUTION_TEXT_CONTENT_REALLY",
                "DEPLOYMENTS.FUNCTIONS.CONFIRM_EXECUTION.SHOW_CONFIRM_EXECUTION_ARIA_LABEL_CONTENT",
                "DEPLOYMENTS.FUNCTIONS.CONFIRM_EXECUTION.SHOW_CONFIRM_EXECUTION_RESPONSE_OK",
                "DEPLOYMENTS.FUNCTIONS.CONFIRM_EXECUTION.SHOW_CONFIRM_EXECUTION_RESPONSE_CANCEL",
            ];

            $translate(trans).then(function (translations) {
                var confirm = $mdDialog.confirm()
                    .title(translations["DEPLOYMENTS.FUNCTIONS.CONFIRM_EXECUTION.SHOW_CONFIRM_TITLE_CONFIRM_EXECUTION"])
                    .textContent(translations["DEPLOYMENTS.FUNCTIONS.CONFIRM_EXECUTION.SHOW_CONFIRM_EXECUTION_TEXT_CONTENT_REALLY"])
                    .ariaLabel(translations["DEPLOYMENTS.FUNCTIONS.CONFIRM_EXECUTION.SHOW_CONFIRM_EXECUTION_ARIA_LABEL_CONTENT"])
                    .targetEvent(event)
                    .ok(translations["DEPLOYMENTS.FUNCTIONS.CONFIRM_EXECUTION.SHOW_CONFIRM_EXECUTION_RESPONSE_OK"])
                    .cancel(translations["DEPLOYMENTS.FUNCTIONS.CONFIRM_EXECUTION.SHOW_CONFIRM_EXECUTION_RESPONSE_CANCEL"]);

                $mdDialog.show(confirm).then(function () {
                    executeProcess(deployment);
                }, function () {
                    //TODO handle error
                });
            })
        }

        function executeProcess(deployment) {
            vm.requestComplete = false;
            deploymentsService.startProcess(deployment.processDefintionId).then(function () {
                vm.requestComplete = true;
                setTimeout(function () {
                    deploymentsService.getIncidentsCount(deployment).then(function (count) {
                        deployment.hasIncidents = count > 0;
                    });
                }, 1000);
            });
        }

        function copyLink(link) {
            clipboard.copyText(link);
        }

    }

    function dependenciesDialog($scope, $mdDialog, dependencies) {
        $scope.dependencies = dependencies;
        $scope.ok = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.hide();
        };
    }

    angular
        .module('app.processes.deployments')
        .component('seplProcessDeployments', {
            templateUrl: 'modules/processes/deployments/deployments.html',
            controller: DeploymentsController
        });
})();