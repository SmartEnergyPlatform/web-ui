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
        .module('app.marketplace.processes.widget')
        .factory('marketplaceProcessesWidgetDetailsService', marketplaceProcessesWidgetDetailsService);

    /* @ngInject */
    function marketplaceProcessesWidgetDetailsService($mdDialog, $mdToast, $state) {
        var service = {
            getProcessDetailData: getProcessDetailData,
        }
        return service;

        function getProcessDetailData(item, ev) {
            $mdDialog.show({
                templateUrl: 'modules/marketplace/processes/widget/details.html',
                controller: DetailsController,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                onRemoving: function () {
                    $state.go($state.current.name, {}, {reload: true});
                },
                locals: {
                    items: item,
                }

            })

        };

        function DetailsController($scope, $mdDialog, items, repositoryService, marketplaceUserRatingService, userService) {
            $scope.items = items;
            $scope.takeClicked = false;
            $scope.copyProcess = copyProcess;
            $scope.close = close;
            $scope.setStatusMouseOver = setStatusMouseOver;
            $scope.setStatusInit = setStatusInit;
            $scope.saveUserRating = saveUserRating;
            $scope.init = init;
            $scope.getUserName = getUserName;


            getUserName();
            init();

            function init() {
                var promiseRating = marketplaceUserRatingService.getUserProcessRating($scope.items.id);
                promiseRating.then(function (resp) {
                    $scope.status = "init";
                    $scope.actualUserRating = resp.starsUser;
                    $scope.starsProcess = resp.starsObject;
                    $scope.rating = resp.rating;
                    $scope.starRatings = resp.starRatings;
                    $scope.starsMarked = $scope.actualUserRating;
                });
            }

            function copyProcess() {
                repositoryService.copyFromMarketplaceToLocalRepo($scope.items);
                $scope.takeClicked = true;
                $mdToast.show($mdToast.takeProcess())
            }

            function close() {
                $mdDialog.cancel();

            }

            function setStatusMouseOver(starsMarked) {
                $scope.status = "mouseOver";
                $scope.starsMarked = starsMarked;
            }

            function setStatusInit() {
                $scope.status = "init";
                $scope.starsMarked = $scope.actualUserRating;
            }

            function saveUserRating(starsMarked) {
                var promiseUserRating = marketplaceUserRatingService.setRating($scope.items.id, "process", starsMarked)
                promiseUserRating.then(function () {
                    $mdToast.show($mdToast.processUserRating());
                    init();
                })

            }

            function getUserName() {
                var promiseName = userService.getNameById($scope.items.owner);
                promiseName.then(function (resp) {
                    $scope.owner = resp;
                })
            }


        }
    };

})();