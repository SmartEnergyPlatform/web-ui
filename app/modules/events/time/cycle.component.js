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

    function CycleDialogController($scope, $translate){
        var that = this;
        $scope.result = "* * * * * ?";

        that.$onInit = function(){
            if(that.initial){
                $scope.result = that.initial;
            }
        };

        $scope.$watch('result', function(){
            $scope.cron_gen_tob_index = $scope.getCronIndex($scope.result || "");
        });

        $scope.getCronIndex = function(cron){
            if (cron.match(/\d+ 0\/\d+ \* 1\/1 \* \? \*/)) {
                return 0;
            } else if (cron.match(/\d+ \d+ 0\/\d+ 1\/1 \* \? \*/)) {
                return 1;
            } else if (cron.match(/\d+ \d+ \d+ 1\/\d+ \* \? \*/)) {
                return 2;
            } else if (cron.match(/\d+ \d+ \d+ \? \* MON-FRI \*/)) {
                return 2;
            } else if (cron.match(/\d+ \d+ \d+ \? \* (MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))* \*/)) {
                return 3;
            } else if (cron.match(/\d+ \d+ \d+ (\d+|L|LW|1W) 1\/\d+ \? \*/)) {
                return 4;
            } else if (cron.match(/\d+ \d+ \d+ \? 1\/\d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/)) {
                return 4;
            } else if (cron.match(/\d+ \d+ \d+ (\d+|L|LW|1W) \d+ \? \*/)) {
                return 5;
            } else if (cron.match(/\d+ \d+ \d+ \? \d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/)) {
                return 5;
            } else {
                return 6;
            }
        };

        $scope.cronOptions = {
            formInputClass: 'form-control cron-gen-input', // Form input class override
            formSelectClass: 'form-control cron-gen-select', // Select class override
            formRadioClass: 'cron-gen-radio', // Radio class override
            formCheckboxClass: 'cron-gen-checkbox', // Radio class override
            hideMinutesTab: false, // Whether to hide the minutes tab
            hideHourlyTab: false, // Whether to hide the hourly tab
            hideDailyTab: false, // Whether to hide the daily tab
            hideWeeklyTab: false, // Whether to hide the weekly tab
            hideMonthlyTab: false, // Whether to hide the monthly tab
            hideYearlyTab: false, // Whether to hide the yearly tab
            hideAdvancedTab: true, // Whether to hide the advanced tab
            use24HourTime: false, // Whether to show AM/PM on the time selectors
            hideSeconds: false // Whether to show/hide the seconds time picker
        };

        $scope.$watch("result", function(){
            that.onChange({result: {cron: $scope.result, text: cronstrue.toString($scope.result, {locale: $translate.proposedLanguage() || $translate.use()})}});
        });
    }

    angular
        .module('app.events.time')
        .component('seplEventTimeCycle', {
            templateUrl: 'modules/events/time/cycle.html',
            controller: CycleDialogController,
            bindings: {
                onChange: '&',
                initial: '@'
            }
        });
})();