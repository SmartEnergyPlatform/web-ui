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

    angular.module('app.iotrepository.maintenance').config(configure);

    /* @ngInject */
    function configure($stateProvider) {
        const NAV_GROUP = "iotrepository.maintenance";

        var maintenance = $stateProvider.state('iotrepository.maintenance', {
            abstract: true,
            parent: "iotrepository",
            url: "/maintenance",
            templateUrl: "modules/iotrepository/maintenance/main.html"
        });

        maintenance.state('iotrepository.maintenance.devices', {
            parent: "iotrepository.maintenance",
            url: "/devices",
            templateUrl: "modules/iotrepository/maintenance/deviceinstance/main.html",
            label: "SIDENAV.IOTREPOSITORY.MAINTENANCE",
            navbarItem: true,
            navbarGroup: NAV_GROUP,
            sref_opt: {reload: true}
        });

        maintenance.state('iotrepository.maintenance.renaming', {
            parent: "iotrepository.maintenance",
            url: "/renaming",
            templateUrl: "modules/iotrepository/maintenance/devicetype/main.html",
            label: "SIDENAV.IOTREPOSITORY.MAINTENANCE_RENAMING",
            navbarItem: true,
            navbarGroup: NAV_GROUP,
            sref_opt: {reload: true},
            params: {
                filter: "rename"
            }
        });
    }
})();