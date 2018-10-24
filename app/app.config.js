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

    angular.module('app').config(configure);

    /* @ngInject */
    function configure($urlRouterProvider, $locationProvider, $mdThemingProvider, $translateProvider, $translatePartialLoaderProvider, timeAgoSettings,$qProvider) {
        $urlRouterProvider.when("/", "/start");
        $locationProvider.html5Mode(true);

        $mdThemingProvider.theme('default').primaryPalette('green').accentPalette('green', {
            'default': '500'
        });

        $translatePartialLoaderProvider.addPart('layout');

        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '/i18n/{part}/{lang}.json'
        }).preferredLanguage('de').useLoaderCache(true).useLocalStorage().useSanitizeValueStrategy('escape').forceAsyncReload(true);

        timeAgoSettings.strings['en_US'].suffixAgo = "";
        $qProvider.errorOnUnhandledRejections(false);

        moment.updateLocale('de', {
            durationLabelsStandard: {
                S: 'Millisekunde',
                SS: 'Millisekunden',
                s: 'Sekunde',
                ss: 'Sekunden',
                m: 'Minute',
                mm: 'Minuten',
                h: 'Stunde',
                hh: 'Stunden',
                d: 'Tag',
                dd: 'Tage',
                w: 'Woche',
                ww: 'Wochen',
                M: 'Monat',
                MM: 'Monate',
                y: 'Jahr',
                yy: 'Jahre'
            }
        });
    }
})();