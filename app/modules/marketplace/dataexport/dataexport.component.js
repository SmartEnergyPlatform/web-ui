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
    function DataexportController($translatePartialLoader, marketplaceDataexportService, $stateParams) {
       // $translatePartialLoader.addPart('marketplace');
        var vm = this;

        if ($stateParams.order){
            vm.order = $stateParams.order;
        } else {
            vm.order = 'date';
        }

        vm.searchText = "";
        vm.searchLocation = "";

        vm.priceMinimum = 0;
        vm.priceMaximum = 999.99;
        vm.searchPriceMin = null;
        vm.searchPriceMax = null;
        vm.timelineCheckboxAll = false;

        vm.dataexport = marketplaceDataexportService.getAllDataexports();

        vm.resetTimeline = function(){
            vm.timelineCheckboxAll = !vm.timelineCheckboxAll;
            for (var i = 0; i < vm.timelineCheckboxItems.length; i++) {
                vm.timelineCheckboxItems[i].ck = vm.timelineCheckboxAll;
            }
        };

        //TODO: Translate timeline checkbox items
        vm.timelineCheckboxItems = [
            {ck: false, text: 'DATA_EXPORT.TIMELINE_CHECKBOX_ITEMS.FIVETEEN_DAYS'},
            {ck: false, text: 'DATA_EXPORT.TIMELINE_CHECKBOX_ITEMS.THIRTY_DAYS'},
            {ck: false,text: 'DATA_EXPORT.TIMELINE_CHECKBOX_ITEMS.ONE_MONTH'},
            {ck: false, text: 'DATA_EXPORT.TIMELINE_CHECKBOX_ITEMS.ONE_YEAR'},
            {ck: false, text: 'DATA_EXPORT.TIMELINE_CHECKBOX_ITEMS.TWO_YEARS'}
            ];


        vm.locationFilter = function (item) {
            for (var i = 0; i < item.data.length; i++) {
                if (item.data[i].image == 'location_on') {
                    if (item.data[i].text.includes(vm.searchLocation)) {
                        return item;
                    }
                }
            }
        }

        vm.priceFilter = function (item) {
            for (var i = 0; i < item.data.length; i++) {
                if (item.data[i].image == 'account_balance') {

                    if ((item.data[i].price >= vm.searchPriceMin || vm.searchPriceMin == null) && (vm.searchPriceMax >= item.data[i].price || vm.searchPriceMax == null)) {
                        return item;
                    }
                }
            }
        }

        vm.timeintervalFilter = function (item) {
            var tempArray = [];
            for (var i = 0; i < vm.timelineCheckboxItems.length; i++) {
                if (vm.timelineCheckboxItems[i].ck == true) {
                    tempArray.push(vm.timelineCheckboxItems[i].text);
                }
            }
            if (tempArray.length > 0) {
                for (var i = 0; i < item.data.length; i++) {
                    if (item.data[i].image == 'timeline') {
                        for (var j = 0; j < tempArray.length; j++) {
                            if ((item.data[i].text == tempArray[j])) {
                                return item;
                            }
                        }
                    }
                }
            } else {
                return item
            }
        }
        vm.setSelection = setSelection;

        function setSelection(text) {
            vm.order = text;
        }//

    };


    angular
        .module('app.marketplace.dataexport')
        .component('seplMarketplaceDataexport', {
            templateUrl: 'modules/marketplace/dataexport/dataexport.html',
            controller: DataexportController,
        })

})();