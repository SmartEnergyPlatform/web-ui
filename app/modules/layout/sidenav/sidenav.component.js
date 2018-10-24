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
    function SidenavController(sidenavService, $state, $scope) {
        var vm = this;
        vm.menu = sidenavService;
        vm.toggleSidenav = vm.menu.toggle('left');
        vm.isActiveState = isActiveState;
        vm.isSectionOpen = isSectionOpen;
        vm.toggleSection = toggleSection;
        vm.currentState = $state.current.name;

        $scope.$on('$stateChangeSuccess', function () {
            vm.currentState = $state.current.name;
            vm.currentRootState = vm.currentState.substr(0, vm.currentState.indexOf('.'));

            for (var i = 0; i < vm.menu.sections.length; i++) {
                if (vm.menu.sections[i].state === vm.currentRootState) {
                    if (!isSectionOpen(vm.menu.sections[i])) {
                        toggleSection(vm.menu.sections[i]);
                    }
                }
            }
        });

        function isActiveState(state) {
            if (vm.currentState === state)
                return true;
            else
                return false;
        }

        function isSectionOpen(section) {
            return vm.menu.isSectionSelected(section);
        }

        function toggleSection(section) {
            vm.menu.toggleSelectSection(section);
            if (section.type === 'link')
                vm.toggleSidenav();
        }
    }

    angular
        .module('app.sidenav')
        .component('seplSidenav', {
            templateUrl: 'modules/layout/sidenav/sidenav.html',
            controller: SidenavController
        });
})
();

