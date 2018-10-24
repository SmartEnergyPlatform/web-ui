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

    angular.module('app.data.operatorrepo').config(configure);

    /* @ngInject */
    function configure($stateProvider, $mdToastProvider) {
        $stateProvider.state('data.operatorrepo', {
            parent: "data",
            url: "/operatorrepo",
            template: "<sepl-data-operator-repository></sepl-data-operator-repository>",
            label: "SIDENAV.DATA.OPERATORREPOSITORY"
        });
        $mdToastProvider.addPreset('deletedOperator', {
            options: function () {
                return {
                    controller: function($translatePartialLoader, $scope, $translate) {
                        var trans = ["OPERATORREPOSITORY.FUNCTIONS.DELETE_OPERATOR.MD_TOAST_SUCCESSFUL"];
                        $translate(trans).then(function(translations) {
                            $scope.deleteOperatorTranslation = translations["OPERATORREPOSITORY.FUNCTIONS.DELETE_OPERATOR.MD_TOAST_SUCCESSFUL"];
                        });
                    },
                    template: '<md-toast>' +
                    '<div class="md-toast-content">' +
                    '<b>{{ deleteOperatorTranslation }}</b>' +
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