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
    function ToolbarController($rootScope, sidenavService, $state, $scope, $mdMedia, toolbarServices, authorizationService) {
        var vm = this;
        vm.isOpen = false;
        vm.selectedMode = 'md-scale';
        vm.selectedDirection = 'left';
        vm.toggle = sidenavService.toggle("left");
        vm.headline = "";
        vm.toggleSelectSection = toggleSelectSection;
        vm.logout = logout;

        vm.username = (authorizationService.getTokenValue("preferred_username"));
        vm.email = (authorizationService.getTokenValue("email"));

        $scope.$on('$stateChangeSuccess', function () {
            vm.headline = getHeadline();
        });

        $scope.$mdMedia = $mdMedia;
        $scope.notifications = [];
        toolbarServices.notificationsInit($scope.notifications);




        vm.openNotificationMenu = function ($mdMenu, ev) {
            $mdMenu.open(ev);
        };

        vm.openNotification = function (notification) {
            $state.go(notification.state, notification.params);
        };

        function logout() {
            $rootScope.userLogout();
        }


        function getHeadline() {
            if ($state.current !== undefined && $state.current !== null) {

                var state = $state.current;

                while (state.parent) {
                    state = $state.get(state.parent);
                }

                return state.label;
            }
        }

//close toggled sidenav section
        function toggleSelectSection() {
            sidenavService.openedSection = "";
        }
    }

    angular
        .module('app.toolbar')
        .component('seplToolbar', {
            templateUrl: 'modules/layout/toolbar/toolbar.html',
            controller: ToolbarController
        });
})
();

