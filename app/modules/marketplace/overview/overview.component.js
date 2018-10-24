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

    function OverviewController($translatePartialLoader, repositoryService, marketplaceDataexportService, marketplaceDataWidgetService, marketplaceUserRatingService, $q, $timeout) {
        //$translatePartialLoader.addPart('marketplace');
        var vm = this;
        vm.requestComplete = false;

        var promises = {
            processPublished: repositoryService.getAllPublishedProcesses(),
            processRating: marketplaceUserRatingService.getProcessRatings()
        };

        $q.all(promises).then(function (result) {
            var temp = [];
            for (var i = 0; i < result.processPublished.length; i++) {
                temp[i] = result.processPublished[i];
                if (result.processRating != null){
                    for (var m = 0; m < result.processRating.length; m++) {
                        if (result.processPublished[i].id == result.processRating[m].objectId) {
                            temp[i].rating = result.processRating[m].rating;
                            temp[i].stars = result.processRating[m].stars;
                        }
                    }
                }
            }
            vm.publishedProcesses = temp;
            $timeout(function() {
                vm.requestComplete = true;
            }, 200);

        });


        vm.dataexport = marketplaceDataexportService.getAllDataexports();
        vm.data = marketplaceDataWidgetService.getAllData();


    }

    angular
        .module('app.marketplace.overview')
        .component('seplMarketplaceOverview', {
            templateUrl: 'modules/marketplace/overview/overview.html',
            controller: OverviewController
        });
})();