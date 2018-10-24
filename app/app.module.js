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

// Best way to declare an angular js module (Stack Over Flow: https://goo.gl/HgZ7Ha)
// basically just avoiding to polute the global js namespace with possible variables
(function () {
    'use strict';   // using the function form of use-strict

    angular.module('app', [
        //3rd Party
        'ui.router',
        'ngMaterial',
        'ngAnimate',
        'xml',
        'ngFileSaver',
        'ngFileUpload',
        'pascalprecht.translate',
        'ngCookies',
        'angular-clipboard',
        'ngJSONPath',
        'nvd3',
        'ngDraggable',
        'app.constants',
        'app.socket.io',
        'ngSanitize',
        'angular-cron-gen',
        'yaru22.angular-timeago',
        'infinite-scroll',

        //SEPL modules
        'app.start',
        'app.toolbar',
        'app.dataTable',
        'app.sidenav',
        'app.navbar',
        'app.searchbar',
        'app.processes',
        'app.iotrepository',
        'app.events',
        'app.sort',
        'app.account',
        'app.data',
        'app.marketplace',
        'app.security',
        'app.apps',
        'app.utils',
        'app.timedialogs',
        'app.permissions'
    ]);
})();
