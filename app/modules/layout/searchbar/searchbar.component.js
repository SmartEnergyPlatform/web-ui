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
    function SearchbarController($scope) {
        var vm = this;
        vm.reset = reset;

        $scope.searchText = vm.searchText;

        function reset() {
            $scope.searchText = '';
        }

        $scope.$watch("searchText", function (searchText) {
            vm.onInputChange({searchText: searchText});
        });
    }

    angular
        .module('app.searchbar')
        .component('seplSearchbar', {
            templateUrl: 'modules/layout/searchbar/searchbar.html',
            controller: SearchbarController,
            bindings: {
                searchText: '<',
                onInputChange: '&'
            }
        });
})();