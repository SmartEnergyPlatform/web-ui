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
    function ProcessRepoMenuController(permissionsService, repositoryService, FileSaver, deploymentsService,$q, $state, x2js, $mdDialog, $mdToast, $translate, $rootScope, $cookies, $timeout, $scope) {
        var vm = this;

        vm.showConfirmDelete = showConfirmDelete;
        vm.showConfirmDeploy = showConfirmDeploy;
        vm.showConfirmClone = showConfirmClone;
        vm.addProcessToMarketplace = addProcessToMarketplace;
        vm.hideProcessFromMarketplace = hideProcessFromMarketplace;
        vm.changeMarketplaceDescription = changeMarketplaceDescription;
        vm.downloadSVG = downloadSVG;
        vm.downloadBPMN = downloadBPMN;
        vm.createCopy = createCopy;
        vm.permission = permission;
        vm.publishProcess = publishProcess;

        function deleteProcess(id) {
            vm.deleteProcessId({id: id});
            /** callback */
        }

        function showConfirmDelete(event, id) {

            var trans = [
                "REPOSITORY.FUNCTIONS.CONFIRM_DELETE.TITLE_DELETE_PROCESS",
                "REPOSITORY.FUNCTIONS.CONFIRM_DELETE.TEXT_CONTENT_REALLY_DELETE",
                "REPOSITORY.FUNCTIONS.CONFIRM_DELETE.ARIA_LABEL_DELETE_PROCESS",
                "REPOSITORY.FUNCTIONS.CONFIRM_DELETE.YES_RESPONSE",
                "REPOSITORY.FUNCTIONS.CONFIRM_DELETE.NO_RESPONSE"
            ];

            $translate(trans).then(function (translations) {
                var confirm = $mdDialog.confirm()
                    .title(translations["REPOSITORY.FUNCTIONS.CONFIRM_DELETE.TITLE_DELETE_PROCESS"])
                    .textContent(translations["REPOSITORY.FUNCTIONS.CONFIRM_DELETE.TEXT_CONTENT_REALLY_DELETE"])
                    .ariaLabel(translations["REPOSITORY.FUNCTIONS.CONFIRM_DELETE.ARIA_LABEL_DELETE_PROCESS"])
                    .targetEvent(event)
                    .ok(translations["REPOSITORY.FUNCTIONS.CONFIRM_DELETE.YES_RESPONSE"])
                    .cancel(translations["REPOSITORY.FUNCTIONS.CONFIRM_DELETE.NO_RESPONSE"]);

                $mdDialog.show(confirm).then(function () {
                    deleteProcess(id);
                }, function () {
                    //TODO handle error
                });
            });
        }

        function showConfirmDeploy(event, item) {

            var trans = [
                "REPOSITORY.FUNCTIONS.CONFIRM_DEPLOY.TITLE_DEPLOY_PROCESS",
                "REPOSITORY.FUNCTIONS.CONFIRM_DEPLOY.TEXT_CONTENT_REALLY_DEPLOY",
                "REPOSITORY.FUNCTIONS.CONFIRM_DEPLOY.ARIA_LABEL_DEPLOY_PROCESS",
                "REPOSITORY.FUNCTIONS.CONFIRM_DEPLOY.OK_RESPONSE",
                "REPOSITORY.FUNCTIONS.CONFIRM_DEPLOY.CANCEL_RESPONSE"
            ];

            $translate(trans).then(function (translations) {
                var confirm = $mdDialog.confirm()
                    .title(translations["REPOSITORY.FUNCTIONS.CONFIRM_DEPLOY.TITLE_DEPLOY_PROCESS"])
                    .textContent(translations["REPOSITORY.FUNCTIONS.CONFIRM_DEPLOY.TEXT_CONTENT_REALLY_DEPLOY"])
                    .ariaLabel(translations["REPOSITORY.FUNCTIONS.CONFIRM_DEPLOY.ARIA_LABEL_DEPLOY_PROCESS"])
                    .targetEvent(event)
                    .ok(translations["REPOSITORY.FUNCTIONS.CONFIRM_DEPLOY.OK_RESPONSE"])
                    .cancel(translations["REPOSITORY.FUNCTIONS.CONFIRM_DEPLOY.CANCEL_RESPONSE"]);

                $mdDialog.show(confirm).then(function () {
                    $state.go('processes.deploy-new', {processid: item.id});
                }, function () {
                    //TODO handle error
                });
            });
        }

        function downloadSVG(svg, name) {
            var file = new Blob([svg], {type: 'image/svg+xml'});
            FileSaver.saveAs(file, name + '.svg');
        }

        function downloadBPMN(id, name) {
            repositoryService.getProcessModel(id).then(function (resp) {
                var file = new Blob([x2js.json2xml_str(resp[0].process)], {type: 'application/bpmn-xml'});
                FileSaver.saveAs(file, name + '.bpmn');
            });
        }


        function showConfirmClone(event, item) {

            var trans = [
                "REPOSITORY.FUNCTIONS.CONFIRM_CLONE.TITLE_CLONE_PROCESS",
                "REPOSITORY.FUNCTIONS.CONFIRM_CLONE.TEXT_CONTENT_REALLY_CLONE",
                "REPOSITORY.FUNCTIONS.CONFIRM_CLONE.ARIA_LABEL_CLONE_PROCESS",
                "REPOSITORY.FUNCTIONS.CONFIRM_CLONE.YES_RESPONSE",
                "REPOSITORY.FUNCTIONS.CONFIRM_CLONE.NO_RESPONSE"
            ];

            $translate(trans).then(function (translation) {
                var confirm = $mdDialog.confirm()
                    .title(translation["REPOSITORY.FUNCTIONS.CONFIRM_CLONE.TITLE_CLONE_PROCESS"])
                    .textContent(translation["REPOSITORY.FUNCTIONS.CONFIRM_CLONE.TEXT_CONTENT_REALLY_CLONE"])
                    .ariaLabel(translation["REPOSITORY.FUNCTIONS.CONFIRM_CLONE.ARIA_LABEL_CLONE_PROCESS"])
                    .targetEvent(event)
                    .ok(translation["REPOSITORY.FUNCTIONS.CONFIRM_CLONE.YES_RESPONSE"])
                    .cancel(translation["REPOSITORY.FUNCTIONS.CONFIRM_CLONE.NO_RESPONSE"]);

                $mdDialog.show(confirm).then(function () {
                    createCopy(item);
                }, function () {
                    //TODO handle error
                });
            });

        }

        function changeMarketplaceDescription(event, item) {

            var trans = [
                "REPOSITORY.FUNCTIONS.CHANGE_MARKETPLACE_DESCRIPTION.TITLE_CHANGE_MARKETPLACE_DESCRIPTION",
                "REPOSITORY.FUNCTIONS.CHANGE_MARKETPLACE_DESCRIPTION.TEXT_CONTENT_CHANGE_MARKETPLACE_DESCRIPTION",
                "REPOSITORY.FUNCTIONS.CHANGE_MARKETPLACE_DESCRIPTION.PLACEHOLDER_DESCRIPTION_FIELD",
                "REPOSITORY.FUNCTIONS.CHANGE_MARKETPLACE_DESCRIPTION.ARIA_LABEL_CHANGE_MARKETPLACE_DESCRIPTION",
                "REPOSITORY.FUNCTIONS.CHANGE_MARKETPLACE_DESCRIPTION.OK_RESPONSE",
                "REPOSITORY.FUNCTIONS.CHANGE_MARKETPLACE_DESCRIPTION.CANCEL_RESPONSE",
            ];

            $translate(trans).then(function (translations) {
                var confirm = $mdDialog.prompt()
                    .title(translations["REPOSITORY.FUNCTIONS.CHANGE_MARKETPLACE_DESCRIPTION.TITLE_CHANGE_MARKETPLACE_DESCRIPTION"])
                    .textContent(translations["REPOSITORY.FUNCTIONS.CHANGE_MARKETPLACE_DESCRIPTION.TEXT_CONTENT_CHANGE_MARKETPLACE_DESCRIPTION"])
                    .placeholder(translations["REPOSITORY.FUNCTIONS.CHANGE_MARKETPLACE_DESCRIPTION.PLACEHOLDER_DESCRIPTION_FIELD"])
                    .ariaLabel(translations["REPOSITORY.FUNCTIONS.CHANGE_MARKETPLACE_DESCRIPTION.ARIA_LABEL_CHANGE_MARKETPLACE_DESCRIPTION"])
                    .initialValue(item.description)
                    .targetEvent(event)
                    .required(true)
                    .ok(translations["REPOSITORY.FUNCTIONS.CHANGE_MARKETPLACE_DESCRIPTION.OK_RESPONSE"])
                    .cancel(translations["REPOSITORY.FUNCTIONS.CHANGE_MARKETPLACE_DESCRIPTION.CANCEL_RESPONSE"]);
                $mdDialog.show(confirm).then(function (description) {
                    console.log("confirm")
                    publishProcess(item, true, description);
                }, function () {
                    //TODO handle error
                });
            });
        }

        function addProcessToMarketplace(event, item) {

            var trans = [
                "REPOSITORY.FUNCTIONS.ADD_TO_MARKETPLACE.TITLE_CONFIRM_ADD_TO_MARKETPLACE",
                "REPOSITORY.FUNCTIONS.ADD_TO_MARKETPLACE.TEXT_CONTENT_ADD_PROCESS_DESCRIPTION",
                "REPOSITORY.FUNCTIONS.ADD_TO_MARKETPLACE.PLACEHOLDER_DESCRIPTION_FIELD",
                "REPOSITORY.FUNCTIONS.ADD_TO_MARKETPLACE.ARIA_LABEL_ADD_TO_MARKETPLACE",
                "REPOSITORY.FUNCTIONS.ADD_TO_MARKETPLACE.OK_RESPONSE",
                "REPOSITORY.FUNCTIONS.ADD_TO_MARKETPLACE.CANCEL_RESPONSE"
            ];

            $translate(trans).then(function (translation) {
                var confirm = $mdDialog.prompt()
                    .title(translation["REPOSITORY.FUNCTIONS.ADD_TO_MARKETPLACE.TITLE_CONFIRM_ADD_TO_MARKETPLACE"])
                    .textContent(translation["REPOSITORY.FUNCTIONS.ADD_TO_MARKETPLACE.TEXT_CONTENT_ADD_PROCESS_DESCRIPTION"])
                    .placeholder(translation["REPOSITORY.FUNCTIONS.ADD_TO_MARKETPLACE.PLACEHOLDER_DESCRIPTION_FIELD"])
                    .ariaLabel(translation["REPOSITORY.FUNCTIONS.ADD_TO_MARKETPLACE.ARIA_LABEL_ADD_TO_MARKETPLACE"])
                    .initialValue(item.description || '')
                    .targetEvent(event)
                    .required(true)
                    .ok(translation["REPOSITORY.FUNCTIONS.ADD_TO_MARKETPLACE.OK_RESPONSE"])
                    .cancel(translation["REPOSITORY.FUNCTIONS.ADD_TO_MARKETPLACE.CANCEL_RESPONSE"]);
                $mdDialog.show(confirm).then(function (description) {
                    publishProcess(item, true, description);
                }, function () {
                    //TODO handle error
                });
            });
        }

        function hideProcessFromMarketplace(event, item) {

            var trans = [
                "REPOSITORY.FUNCTIONS.HIDE_FROM_MARKETPLACE.TITLE_HIDE_FROM_MARKETPLACE_DESCRIPTION",
                "REPOSITORY.FUNCTIONS.HIDE_FROM_MARKETPLACE.TEXT_CONTENT_HIDE_FROM_MARKETPLACE_DESCRIPTION",
                "REPOSITORY.FUNCTIONS.HIDE_FROM_MARKETPLACE.ARIA_LABEL_HIDE_FROM_MARKETPLACE_DESCRIPTION",
                "REPOSITORY.FUNCTIONS.HIDE_FROM_MARKETPLACE.OK_RESPONSE",
                "REPOSITORY.FUNCTIONS.HIDE_FROM_MARKETPLACE.CANCEL_RESPONSE"
            ];

            $translate(trans).then(function (translations) {
                var confirm = $mdDialog.confirm()
                    .title(translations["REPOSITORY.FUNCTIONS.HIDE_FROM_MARKETPLACE.TITLE_HIDE_FROM_MARKETPLACE_DESCRIPTION"])
                    .textContent(translations["REPOSITORY.FUNCTIONS.HIDE_FROM_MARKETPLACE.TEXT_CONTENT_HIDE_FROM_MARKETPLACE_DESCRIPTION"])
                    .ariaLabel(translations["REPOSITORY.FUNCTIONS.HIDE_FROM_MARKETPLACE.ARIA_LABEL_HIDE_FROM_MARKETPLACE_DESCRIPTION"])
                    .targetEvent(event)
                    .ok(translations["REPOSITORY.FUNCTIONS.HIDE_FROM_MARKETPLACE.OK_RESPONSE"])
                    .cancel(translations["REPOSITORY.FUNCTIONS.HIDE_FROM_MARKETPLACE.CANCEL_RESPONSE"]);
                $mdDialog.show(confirm).then(function () {
                    publishProcess(item, false, "");
                }, function () {
                    //TODO handle error
                });
            });
        }

        function createCopy(item) {
            vm.copyProcessItem({item: item});
            /** callback */
        }

        function permission(id) {
            permissionsService.dialog("processmodel", id)
        }

        function publishProcess(item, publish, description) {
            repositoryService.publish(item.id, publish, description).then(function (data) {

                $timeout(function () {
                    item.publish = data.publish;
                    item.description = data.description;
                    $mdToast.show($mdToast.showMarketplaceChange());
                }, 150)

            });
        }

        function permission(id) {
            permissionsService.dialog("processmodel", id)
        }

    }

    angular
        .module('app.processes.repository.menu')
        .component('seplProcessRepositoryMenu', {
            templateUrl: 'modules/processes/repository/menu/menu.html',
            controller: ProcessRepoMenuController,
            bindings: {
                menuOffset: '@',
                item: '<',
                deleteProcessId: '&',
                copyProcessItem: '&',
            }
        });
})();