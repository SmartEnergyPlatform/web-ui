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
    function SortController($scope) {
        var vm = this;
        vm.isActive = isActive;
        vm.sort = sort;
        vm.getSortIcon = getSortIcon;

        $scope.$watchCollection(function (scope) {
                return (vm.attributes);
            }, function (attributes) {
                if (!vm.currentSortItem) {
                    vm.currentSortItem = attributes[0];
                    vm.sort(vm.currentSortItem);
                }
            }
        );

        function sort(item) {
            if (vm.currentSortItem !== item) {
                vm.currentSortItem = item;
            } else {
                if (item.order === "asc") {
                    item.order = "desc";
                } else if (item.order === "desc") {
                    item.order = "asc";
                }
            }
            vm.onClickEvent({sortItem: item});
        }

        function getSortIcon(item) {
            if (item.order === "desc") {
                return "arrow_downward";
            }
            else {
                return "arrow_upward";
            }
        }

        function isActive(item) {
            return vm.currentSortItem === item;
        }
    }

    angular
        .module('app.sort')
        .component('seplSort', {
            templateUrl: 'modules/layout/sort/sort.html',
            controller: SortController,
            bindings: {
                attributes: '<',
                currentSortItem: '<',
                onClickEvent: '&'
            }
        });
})();

