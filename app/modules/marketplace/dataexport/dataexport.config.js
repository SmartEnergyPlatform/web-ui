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

    angular.module('app.marketplace.dataexport').config(configure);

    /* @ngInject */
    function configure ($stateProvider) {
        const NAV_GROUP = "marketplace.dataexport";

        $stateProvider.state('marketplace.dataexport', {
            parent: "marketplace",
            url: "/dataexport",
            templateUrl: "modules/marketplace/dataexport/main.html",
            label: "NAVBAR.MARKETPLACE.DATAEXPORT.DATE",
            navbarItem: true,
            navGroup: NAV_GROUP,
            sref_opt: {reload: true},
        });

        $stateProvider.state('marketplace.dataexport.bestselling', {
            parent: "marketplace.dataexport",
            url: "/bestselling",
            templateUrl: "modules/marketplace/dataexport/main.html",
            label: "NAVBAR.MARKETPLACE.DATAEXPORT.BEST_SELLING",
            navbarItem: true,
            navGroup: NAV_GROUP,
            sref_opt: {reload: true},
            params: {
                order:'count',
            }
        });

        $stateProvider.state('marketplace.dataexport.category', {
            parent: "marketplace.dataexport",
            url: "/category",
            templateUrl: "modules/marketplace/dataexport/main.html",
            label: "NAVBAR.MARKETPLACE.DATAEXPORT.CATEGORY",
            navbarItem: true,
            navGroup: NAV_GROUP,
            sref_opt: {reload: true},
            params: {
                order: "imageHeader",
            }
        });

        $stateProvider.state('marketplace.dataexport.search', {
            parent: "marketplace.dataexport",
            url: "/search",
            templateUrl: "modules/marketplace/dataexport/main.html",
            label: "NAVBAR.MARKETPLACE.DATAEXPORT.SEARCH",
            navbarItem: true,
            navGroup: NAV_GROUP,
            sref_opt: {reload: true},
            params: {
                order: "search",
            }
        });
    }
})();