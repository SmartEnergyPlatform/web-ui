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

    angular
        .module('app.sidenav')
        .factory('sidenavService', sidenavService);

    /* @ngInject */
    function sidenavService($mdSidenav) {
        var service = {
            sections: getSections(),
            toggle: toggle,
            toggleSelectSection: toggleSelectSection,
            isSectionSelected: isSectionSelected
        };

        return service;

        function toggle(componentId) {
            return function () {
                var sidenav = $mdSidenav(componentId);

                if (sidenav.isLockedOpen()) {
                    return false
                }

                sidenav.toggle();
            }
        }

        function getSections() {
            var sections = [];

            sections.push({
                name: 'SIDENAV.HOME',
                type: 'link',
                icon: 'home',
                state: 'start'
            });

            sections.push({
                name: 'SIDENAV.APPLICATION.APPS',
                type: 'toggle',
                icon: 'apps',
                state: 'apps',
                pages: [{
                    name: 'SIDENAV.APPLICATION.DASHBOARD',
                    type: 'link',
                    state: 'apps.dashboard',
                    icon: 'dashboard'
                }, {
                    name: 'SIDENAV.APPLICATION.SCHEDULE',
                    type: 'link',
                    state: 'apps.schedule',
                    icon: 'schedule'
                }]
            });

            sections.push({
                name: 'SIDENAV.MARKETPLACE.MARKETPLACE',
                type: 'toggle',
                state: 'marketplace',
                icon: 'shop',
                pages: [{
                    name: 'SIDENAV.MARKETPLACE.OVERVIEW',
                    type: 'link',
                    state: 'marketplace.overview',
                    icon: 'assessment'
                }, {
                    name: 'SIDENAV.MARKETPLACE.PROCESSES',
                    type: 'link',
                    state: 'marketplace.processes',
                    icon: 'timeline'
                }, /* {
                    name: 'SIDENAV.MARKETPLACE.DATA',
                    type: 'link',
                    state: 'marketplace.data',
                    icon: 'bar_chart'
                }, */
                {
                    name: 'SIDENAV.MARKETPLACE.EXPORT',
                    type: 'link',
                    state: 'marketplace.dataexport',
                    icon: 'tune'
                }]
            });

            sections.push({
                name: 'SIDENAV.PROCESSES.PROCESS',
                type: 'toggle',
                icon: 'timeline',
                state: 'processes',
                pages: [{
                    name: 'SIDENAV.PROCESSES.REPOSITORY',
                    type: 'link',
                    state: 'processes.repository',
                    icon: 'storage'
                }, {
                    name: 'SIDENAV.PROCESSES.DEPLOYMENTS',
                    state: 'processes.deployments',
                    type: 'link',
                    icon: 'publish'
                }, {
                    name: 'SIDENAV.PROCESSES.MONITOR',
                    state: 'processes.monitor',
                    type: 'link',
                    icon: 'search'
                }, {
                    name: 'SIDENAV.PROCESSES.DESIGNER',
                    state: 'processes.designer',
                    type: 'link',
                    icon: 'create'
                }]
            });

            sections.push({
                name: 'SIDENAV.DATA.ANALYTICS',
                type: 'toggle',
                icon: 'bar_chart',
                state: 'data',
                pages: [{
                    name: 'SIDENAV.DATA.OPERATORREPOSITORY',
                    type: 'link',
                    state: 'data.operatorrepo',
                    icon: 'storage'
                }, {
                    name: 'SIDENAV.DATA.DESIGNER',
                    type: 'link',
                    state: 'data.designer',
                    icon: 'create'
                }, {
                    name: 'SIDENAV.DATA.FLOWREPOSITORY',
                    type: 'link',
                    state: 'data.flowrepo',
                    icon: 'timeline'

                },{
                    name: 'SIDENAV.DATA.EXPORT',
                    type: 'link',
                    state: 'data.export',
                    icon: 'build'
                }]
            });

            sections.push({
                name: 'SIDENAV.IOTREPOSITORY.DEVICES',
                type: 'toggle',
                state: 'iotrepository',
                icon: 'devices',
                pages: [{
                    name: 'SIDENAV.IOTREPOSITORY.NETWORKS',
                    type: 'link',
                    state: 'iotrepository.networks',
                    icon: 'device_hub'
                }, {
                    name: 'SIDENAV.IOTREPOSITORY.DEVICE_INSTANCES',
                    type: 'link',
                    state: 'iotrepository.deviceinstances',
                    icon: 'important_devices'
                }, {
                    name: 'SIDENAV.IOTREPOSITORY.DEVICE_TYPES',
                    type: 'link',
                    state: 'iotrepository.devicetypes',
                    icon: 'devices_other'
                }, {
                    name: 'SIDENAV.IOTREPOSITORY.VALUE_TYPES',
                    type: 'link',
                    state: 'iotrepository.valuetypes',
                    icon: 'import_export'
                }, {
                    name: 'SIDENAV.IOTREPOSITORY.MAINTENANCE',
                    type: 'link',
                    state: 'iotrepository.maintenance.devices',
                    icon: 'build'
                }
                /*, {
                 name: 'SIDENAV.DEVICES_PROTOCOLS',
                 type: 'link',
                 state: 'iotrepository.protocol'
                 }*/]
            });

            /*
            sections.push({
                name: 'SIDENAV.SECURITY',
                type: 'toggle',
                state: 'security',
                icon: 'verified_user',
                pages: [{
                    name: 'SIDENAV.SECURITY_USERS',
                    type: 'link',
                    state: 'security.users',
                    icon: 'account_box'
                }, {
                    name: 'SIDENAV.SECURITY_AUTO',
                    type: 'link',
                    state: 'security.authorization',
                    icon: 'perm_identity'
                }]
            });
            */

            return sections;
        }

        function toggleSelectSection(section) {
            service.openedSection = (service.openedSection === section ? null : section);
        }

        function isSectionSelected(section) {
            return service.openedSection === section;
        }
    }

})();

