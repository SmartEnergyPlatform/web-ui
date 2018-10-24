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
    function ProcessesWidgetController(marketplaceProcessesWidgetDetailsService) {
        var vm = this;

        vm.showProcessDetails = showProcessDetails;

        function showProcessDetails(item, ev) {
            marketplaceProcessesWidgetDetailsService.getProcessDetailData(item, ev);
        }
    }

    angular
        .module('app.marketplace.processes.widget')
        .component('seplMarketplaceProcessesWidget', {
            templateUrl: 'modules/marketplace/processes/widget/widget.html',
            controller: ProcessesWidgetController,
            bindings: {
                item: '<'
            }
        });
})
();