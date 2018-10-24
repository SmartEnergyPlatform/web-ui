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

    angular.module('app.marketplace.processes').config(configure);

    /* @ngInject */
    function configure ($stateProvider) {
        const NAV_GROUP = "marketplace.processes";

        $stateProvider.state('marketplace.processes', {
            parent: "marketplace",
            url: "/processes",
            templateUrl: "modules/marketplace/processes/main.html",
            label: "NAVBAR.MARKETPLACE.PROCESSES.PUBLISH_DATE",
            navbarItem: true,
            navGroup: NAV_GROUP,
            sref_opt: {reload: true},
        });

        $stateProvider.state('marketplace.processes.updatedate', {
            parent: "marketplace.processes",
            url: "/updatedate",
            templateUrl: "modules/marketplace/processes/main.html",
            label: "NAVBAR.MARKETPLACE.PROCESSES.UPDATE_DATE",
            navbarItem: true,
            navGroup: NAV_GROUP,
            sref_opt: {reload: true},
        });

        $stateProvider.state('marketplace.processes.rating', {
            parent: "marketplace.processes",
            url: "/rating",
            templateUrl: "modules/marketplace/processes/main.html",
            label: "NAVBAR.MARKETPLACE.PROCESSES.RATING",
            navbarItem: true,
            navGroup: NAV_GROUP,
            sref_opt: {reload: true},
        });

        $stateProvider.state('marketplace.processes.count', {
            parent: "marketplace.processes",
            url: "/count",
            templateUrl: "modules/marketplace/processes/main.html",
            label: "NAVBAR.MARKETPLACE.PROCESSES.COUNT",
            navbarItem: true,
            navGroup: NAV_GROUP,
            sref_opt: {reload: true},
        });
    }
})();