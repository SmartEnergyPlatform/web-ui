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

    function DateTimeDialogController($scope, $mdDialog, initial){
        $scope.datetime = null;
        $scope.initial = initial;
        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.ok = function() {
            $mdDialog.hide($scope.datetime);
        };
    }

    /* @ngInject */
    function seplDateTimeDialogService($mdDialog) {
        return function(initial){
            return $mdDialog.show({
                controller: DateTimeDialogController,
                controllerAs: 'ctrl',
                templateUrl: 'modules/layout/timedialogs/datetime.dialog.html',
                clickOutsideToClose: true,
                locals: {initial: initial}
            });
        }
    }

    angular
        .module('app.timedialogs')
        .factory('seplDateTimeDialogService', seplDateTimeDialogService);
})();