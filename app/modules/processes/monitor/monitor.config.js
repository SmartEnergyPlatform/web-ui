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

    angular.module('app.processes.monitor').config(configure);

    /* @ngInject */
    function configure ($stateProvider) {
        const NAV_GROUP = "processes.monitor";

        var monitor = $stateProvider.state('processes.monitor', {
            parent: "processes",
            url: "/monitor",
            templateUrl: "modules/processes/monitor/main.html",
            label: "NAVBAR.MONITOR.HISTORY",
            navbarItem: true,
            navGroup: NAV_GROUP,
            sref_opt: {reload: true},
            params: {
                processDefinitionId: null
            }
        });

        monitor.state('processes.monitor.running', {
            parent: "processes.monitor",
            url: "/running",
            templateUrl: "modules/processes/monitor/main.html",
            label: "NAVBAR.MONITOR.RUNNING",
            navbarItem: true,
            navGroup: NAV_GROUP,
            sref_opt: {reload: true},
            params: {
                processDefinitionId: null,
                unfinished: true
            }
        });

        monitor.state('processes.monitor.finished', {
            parent: "processes.monitor",
            url: "/finished",
            templateUrl: "modules/processes/monitor/main.html",
            label: "NAVBAR.MONITOR.FINISHED",
            navbarItem: true,
            navGroup: NAV_GROUP,
            sref_opt: {reload: true},
            params: {
                processDefinitionId: null,
                finished: true
            }
        });
    }
})();