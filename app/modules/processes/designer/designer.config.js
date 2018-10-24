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

        angular.module('app.processes.designer').config(configure);

        /* @ngInject */
        function configure($stateProvider, $mdToastProvider) {
            $stateProvider.state('processes.designer', {
                parent: "processes",
                url: "/designer",
                templateUrl: "modules/processes/designer/main.html",
                label: "SIDENAV.PROCESSES.DESIGNER"
            }).state('processes.designer.process', {
                parent: "processes.designer",
                url: "/:id",
                templateUrl: "modules/processes/designer/main.html"
            });

            $mdToastProvider.addPreset('saveProcess', {
                options: function () {
                    return {
                        controller: function($scope, $translate) {
                          var trans = ["DESIGNER.MD_TOAST.PROCESS_SAVE"];
                            $translate(trans).then(function (translations) {
                                $scope.processSaveTranslation = translations["DESIGNER.MD_TOAST.PROCESS_SAVE"];
                            })
                        },
                        template: '<md-toast>' +
                        '<div class="md-toast-content">' +
                        '<b>{{processSaveTranslation}}</b>' +
                        '</div>' +
                        '</md-toast>',
                        hideDelay: 2000,
                        position: "top right",
                        controllerAs: 'toast',
                        bindToController: true
                    };
                }
            }).addPreset('importProcess', {
                options: function () {
                    return {
                        controller: function($scope, $translate) {
                            var trans = ["DESIGNER.MD_TOAST.PROCESS_IMPORT"];
                            $translate(trans).then(function (translations) {
                                $scope.processImportTranslation = translations["DESIGNER.MD_TOAST.PROCESS_IMPORT"];
                            })
                        },
                        template: '<md-toast>' +
                        '<div class="md-toast-content">' +
                        '<b>{{processImportTranslation}}</b>' +
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