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

    angular.module('app.marketplace.processes.widget').config(configure);

    /* @ngInject */
    function configure($mdToastProvider) {


        $mdToastProvider.addPreset('takeProcess', {
            options: function () {
                return {
                    controller: function($scope, $translate) {
                        var trans = ["PROCESSES.MD_TOAST.ADD_PROCESS"];
                        $translate(trans).then(function(translations) {
                            $scope.takeProcessTranslation = translations["PROCESSES.MD_TOAST.ADD_PROCESS"];
                        });
                    },
                    template: '<md-toast>' +
                    '<div class="md-toast-content">' +
                    '<b>{{takeProcessTranslation}}</b>' +
                    '</div>' +
                    '</md-toast>',
                    hideDelay: 2000,
                    position: "top right",
                    controllerAs: 'toast',
                    bindToController: true
                };
            }
        });

        $mdToastProvider.addPreset('processUserRating', {
            options: function () {
                return {
                    controller: function($scope, $translate) {
                        var trans = ["PROCESSES.MD_TOAST.PROCESS_RATED"];
                        $translate(trans).then(function(translations) {
                            $scope.processRatedTranslation = translations["PROCESSES.MD_TOAST.PROCESS_RATED"];
                        });
                    },
                    template: '<md-toast>' +
                    '<div class="md-toast-content">' +
                    '<b>{{processRatedTranslation}}</b>' +
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