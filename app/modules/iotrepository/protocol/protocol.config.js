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

    angular.module('app.iotrepository.protocol').config(configure);

    /* @ngInject */
    function configure ($stateProvider) {
        $stateProvider.state('iotrepository.protocol', {
            parent: "iotrepository",
            url: "/protocol/list",
            template: "<sepl-iotrepo-protocol-list></sepl-iotrepo-protocol-list>",
            label: "SIDENAV.IOTREPOSITORY.PROTOCOL",
            navbarItem: false
        }).state('iotrepository.protocol.list', {
            parent: "iotrepository.protocol",
            url: "/:query/:offset/:limit",
            template: "<sepl-iotrepo-protocol-list></sepl-iotrepo-protocol-list>"
        });

        $stateProvider.state('iotrepository.protocol.edit', {
            parent: "iotrepository",
            url: "/protocol/edit/:id/:deviceTypeId",
            template: "<sepl-iotrepo-protocol-editor></sepl-iotrepo-protocol-editor>"
        });
    }
})();