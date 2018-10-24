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

    angular.module('app.processes.deployments').config(configure);

    /* @ngInject */
    function configure($stateProvider, $mdToastProvider) {
        $stateProvider.state('processes.deployments', {
            parent: "processes",
            url: "/deployments",
            templateUrl: "modules/processes/deployments/main.html",
            label: "SIDENAV.PROCESSES.DEPLOYMENTS"
        });

        $mdToastProvider.addPreset('deleteDeployment', {
            options: function () {
                return {
                    controller: function($scope, $translate) {
                        var trans = ["DEPLOYMENTS.MD_TOAST.DELETE_SUCCESS"];
                        $translate(trans).then(function (translations) {
                            $scope.deleteSuccessTranslation = translations["DEPLOYMENTS.MD_TOAST.DELETE_SUCCESS"];
                        })
                    },
                    template: '<md-toast>' +
                    '<div class="md-toast-content">' +
                    '<b>{{deleteSuccessTranslation}}</b>' +
                    '</div>' +
                    '</md-toast>',
                    hideDelay: 2000,
                    position: "top right",
                    controllerAs: 'toast',
                    bindToController: true
                };
            }

        })

        $mdToastProvider.addPreset('deleteDeploymentError', {
            options: function () {
                return {
                    controller: function($scope, $translate) {
                        var trans = ["DEPLOYMENTS.MD_TOAST.DELETE_ERROR"];
                        $translate(trans).then(function (translations) {
                            $scope.deleteErrorTranslation = translations["DEPLOYMENTS.MD_TOAST.DELETE_ERROR"];
                        })
                    },
                    template: '<md-toast>' +
                    '<div class="md-toast-content">' +
                    '<b>{{deleteErrorTranslation}}</b>' +
                    '</div>' +
                    '</md-toast>',
                    hideDelay: 2000,
                    position: "top right",
                    controllerAs: 'toast',
                    bindToController: true
                };
            }
        })

        $mdToastProvider.addPreset('deployProcess', {
            options: function () {
                return {
                    controller: function($scope, $translate) {
                        var trans = ["DEPLOYMENTS.MD_TOAST.PROCESS_DEPLOY_SUCCESS"];
                        $translate(trans).then(function (translations) {
                            $scope.processDeploySuccessTrans = translations["DEPLOYMENTS.MD_TOAST.PROCESS_DEPLOY_SUCCESS"];
                        })
                    },
                    template: '<md-toast>' +
                    '<div class="md-toast-content">' +
                    '<b>{{processDeploySuccessTrans}}</b>' +
                    '</div>' +
                    '</md-toast>',
                    hideDelay: 2000,
                    position: "top right",
                    controllerAs: 'toast',
                    bindToController: true
                };
            }
        })

        $mdToastProvider.addPreset('deployProcessError', {
            options: function () {
                return {
                    controller: function($scope, $translate) {
                        var trans = ["DEPLOYMENTS.MD_TOAST.PROCESS_DEPLOY_ERROR"];
                        $translate(trans).then(function (translations) {
                            $scope.processDeployErrorTrans = translations["DEPLOYMENTS.MD_TOAST.PROCESS_DEPLOY_ERROR"];
                        })
                    },
                    template: '<md-toast>' +
                    '<div class="md-toast-content">' +
                    '<b>{{processDeployErrorTrans}}</b>' +
                    '</div>' +
                    '</md-toast>',
                    hideDelay: 2000,
                    position: "top right",
                    controllerAs: 'toast',
                    bindToController: true
                };
            }
        });
    }
})();