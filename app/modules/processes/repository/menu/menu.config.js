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

    angular.module('app.processes.repository.menu').config(configure);

    /* @ngInject */
    function configure( $mdToastProvider) {

        $mdToastProvider.addPreset('showMarketplaceChange', {
            options: function () {
                return {
                    controller: function($scope, $translate) {
                        var trans = ["REPOSITORY.MD_TOAST.MARKETPLACE_CHANGE"];
                        $translate(trans).then(function (translations) {
                            $scope.marketplaceChangeTranslation = translations["REPOSITORY.MD_TOAST.MARKETPLACE_CHANGE"];
                        })
                    },
                    template: '<md-toast>' +
                    '<div class="md-toast-content">' +
                    '<b>{{marketplaceChangeTranslation}}</b>' +
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