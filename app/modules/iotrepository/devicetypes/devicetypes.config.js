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

    angular.module('app.iotrepository.devicetypes').config(configure);

    /* @ngInject */
    function configure ($stateProvider) {
        $stateProvider.state('iotrepository.devicetypes', {
            parent: "iotrepository",
            url: "/devicetypes/list",
            template: "<sepl-iotrepo-devicetype-list></sepl-iotrepo-devicetype-list>",
            label: "SIDENAV.IOTREPOSITORY.DEVICE_TYPES",
            navbarItem: false
        }).state('iotrepository.devicetypes.query', {
            parent: "iotrepository.devicetypes",
            url: "/:query",
            template: "<sepl-iotrepo-devicetype-list></sepl-iotrepo-devicetype-list>",
            label: "SIDENAV.IOTREPOSITORY.DEVICE_TYPES"
        });
    }
})();