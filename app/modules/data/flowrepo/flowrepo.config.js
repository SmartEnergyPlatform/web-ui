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

    angular.module('app.data.flowrepo').config(configure);

    /* @ngInject */
    function configure($stateProvider, $mdToastProvider) {
        const NAV_GROUP = "data.flowrepo";

        $stateProvider.state('data.flowrepo', {
            parent: "data",
            url: "/flows",
            template: "<sepl-data-flow-repository></sepl-data-flow-repository>",
            label: "SIDENAV.DATA.FLOWREPOSITORY",
            navbarItem: true,
            navGroup: NAV_GROUP,
            sref_opt: {reload: true},
        });

        $stateProvider.state('data.flowrepo.pipes', {
            parent: "data.flowrepo",
            url: "/pipes",
            template: "<sepl-data-flow-pipes></sepl-data-flow-pipes>",
            label: "Pipes",
            navbarItem: true,
            navGroup: NAV_GROUP,
            sref_opt: {reload: true},
        });

        $mdToastProvider.addPreset('deleteFlow', {
            options: function () {
                return {
                    controller: function($translatePartialLoader, $scope, $translate) {
                        var trans = ["FLOWREPOSITORY.FUNCTIONS.DELETE_FLOW.MD_TOAST_SUCCESSFUL"];
                        $translate(trans).then(function(translations) {
                            $scope.deleteFlowTranslation = translations["FLOWREPOSITORY.FUNCTIONS.DELETE_FLOW.MD_TOAST_SUCCESSFUL"];
                        });
                    },
                    template: '<md-toast>' +
                    '<div class="md-toast-content">' +
                    '<b>{{ deleteFlowTranslation }}</b>' +
                    '</div>' +
                    '</md-toast>',
                    hideDelay: 2000,
                    position: "top right",
                    controllerAs: 'toast',
                    bindToController: true
                };
            }
        })
    }
})();