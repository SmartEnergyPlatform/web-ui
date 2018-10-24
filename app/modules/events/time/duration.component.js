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
    function DurationpickerController($scope, $translate) {
        var vm = this;

        $scope.duration = {
            year: 0,     //Y
            month: 0,    //M
            //week: 0,     //W
            day: 0,      //D
            hour: 0,    //h
            minute: 0,   //m
            second: 0    //s
        };

        vm.$onInit = function(){
            if(vm.initial){
                var duration = moment.duration(vm.initial);
                $scope.duration.second = duration.seconds();
                $scope.duration.minute = duration.minutes();
                $scope.duration.hour = duration.hours();
                $scope.duration.day = duration.days();
                $scope.duration.month = duration.months();
                $scope.duration.year = duration.years();
            }
        };

        vm.getIsoDuration = function(duration){
            //P3Y6M4DT12H30M17S
            var result = "P";
            if(duration.year){
                result += duration.year + "Y";
            }
            if(duration.month){
                result += duration.month + "M";
            }
            /*
            if(duration.week){
                result += duration.week + "W";
            }
            */
            if(duration.day){
                result += duration.day + "D";
            }

            if(duration.hour || duration.minute || duration.second){
                result += "T";
            }

            if(duration.hour){
                result += duration.hour + "H";
            }
            if(duration.minute){
                result += duration.minute + "M";
            }
            if(duration.second){
                result += duration.second + "S";
            }

            if(result == "P"){
                result = null;
            }

            return result;
        };

        vm.getDuration = function(){
            var result = JSON.parse(JSON.stringify($scope.duration));
            result.string = vm.getIsoDuration(result);
            if(!result.string){
                return null;
            }
            return result;
        };

        $scope.$watch("duration", function () {
            moment.locale($translate.proposedLanguage() || $translate.use());
            var durationText = moment.duration($scope.duration)
                .format("Y __ M __ d __ h __ m __ s __", {
                    trim: "both mid"
                });
            vm.onChange({result: {iso: vm.getDuration(), text: durationText}});
        }, true);

    }

    angular
        .module('app.events.time')
        .component('seplEventTimeDuration', {
            templateUrl: 'modules/events/time/duration.html',
            controller: DurationpickerController,
            bindings: {
                onChange: '&',
                initial: '@'
            }
        });
})();