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

    /* @ngInject */
    function NavbarController($scope, $state, $rootScope, $timeout) {
        var vm = this;
        vm.navItems = $state.get().filter(function (state) {
            var filter = state.name.indexOf($state.current.parent + '.') === 0 && state.label && state.navbarItem && state.navGroup === $state.current.navGroup ;

            if (!filter) {
                filter = state.name.indexOf($state.get($state.current.parent).parent + '.') === 0 && state.label && state.navbarItem && state.navGroup === $state.current.navGroup;
            }

            return filter;
        });
        vm.currentNavItem = setCurrentNavItem();

        //TODO replace dirty workaround with proper solution
        //Workaround for responsive md-ink-bar at the bottom of navbar item
        $rootScope.$on('$translateLoadingSuccess', function () {
            var oldCurrentNavItem = vm.currentNavItem;
            vm.currentNavItem = '';
            $timeout(function () {
                vm.currentNavItem = oldCurrentNavItem;
            }, 1)
        });

        //TODO replace dirty workaround with proper solution
        //Workaround for selecting correct navbar item after full page reload
        $scope.$on('$stateChangeSuccess', function () {
            vm.currentNavItem = setCurrentNavItem();
        });

        function setCurrentNavItem() {
            if (vm.navItems.includes($state.current)) {
                return $state.current.name;
            } else {
                return $state.get($state.current.parent).name;
            }
        }
    }

    angular
        .module('app.navbar')
        .component('seplNavbar', {
            templateUrl: 'modules/layout/navbar/navbar.html',
            controller: NavbarController
        });
})();



