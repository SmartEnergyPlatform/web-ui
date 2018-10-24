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

    angular.module('app.processes.repository').config(configure);

    /* @ngInject */
    function configure($stateProvider, $mdToastProvider) {
        const NAV_GROUP = "processes.repository";

        var monitor = $stateProvider.state('processes.repository', {
            parent: "processes",
            url: "/repository",
            templateUrl: "modules/processes/repository/main.html",
            label: "NAVBAR.PROCESSES.ALL",
            navbarItem: true,
            navGroup: NAV_GROUP,
            sref_opt: {reload: true},
        });

        monitor.state('processes.repository.own', {
            parent: "processes.repository",
            url: "/own",
            templateUrl: "modules/processes/repository/main.html",
            label: "NAVBAR.PROCESSES.OWN",
            navbarItem: true,
            navGroup: NAV_GROUP,
            sref_opt: {reload: true},
            params: {
                filterCriteria: "own",
            }
        });

        monitor.state('processes.repository.publish', {
            parent: "processes.repository",
            url: "/publish",
            templateUrl: "modules/processes/repository/main.html",
            label: "NAVBAR.PROCESSES.PUBLISH",
            navbarItem: true,
            navGroup: NAV_GROUP,
            sref_opt: {reload: true},
            params: {
                filterCriteria: "publish",
            }
        });

        monitor.state('processes.repository.add', {
            parent: "processes.repository",
            url: "/add",
            templateUrl: "modules/processes/repository/main.html",
            label: "NAVBAR.PROCESSES.ADD",
            navbarItem: true,
            navGroup: NAV_GROUP,
            sref_opt: {reload: true},
            params: {
                filterCriteria: "add",
            }
        });

        $mdToastProvider.addPreset('deleteProcess', {

            options: function () {
                return {
                    controller: function($scope, $translate) {
                        var trans = ["REPOSITORY.MD_TOAST.DELETE"];
                        $translate(trans).then(function (translations) {
                            $scope.deleteProcessTranslation = translations["REPOSITORY.MD_TOAST.DELETE"];
                        })
                    },
                    template: '<md-toast>' +
                    '<div class="md-toast-content">' +
                    '<b>{{deleteProcessTranslation}}</b>' +
                    '</div>' +
                    '</md-toast>',
                    hideDelay: 2000,
                    position: "top right",
                    controllerAs: 'toast',
                    bindToController: true,
                };
            }
        });
    }
})();