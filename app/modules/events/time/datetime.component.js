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

    function DateTimeDialogController($scope){
        var that = this;
        $scope.result = null;
        $scope.hour = 0;
        $scope.minute = 0;
        $scope.change = 0;

        that.$onInit = function(){
            if(that.initial){
                var date = new Date(that.initial);
                $scope.hour = date.getHours();
                $scope.minute = date.getMinutes();
                $scope.result = date;
            }else{
                $scope.result = new Date();
            }
        };

        $scope.$watch("hour", function(){
            if($scope.result && $scope.result.setHours){
                $scope.result.setHours($scope.hour);
                $scope.change++;
            }
        });

        $scope.$watch("minute", function(){
            if($scope.result && $scope.result.setMinutes){
                $scope.result.setMinutes($scope.minute);
                $scope.change++;
            }
        });

        $scope.updateResult = function(){
            if($scope.result){
                var iso = $scope.result.toISOString();
                that.onChange({result: {iso: iso, text: moment(iso).tz(moment.tz.guess()).format("DD.MM.YYYY, HH:mm")}});
            }
        };

        $scope.$watch("result", $scope.updateResult);
        $scope.$watch("change", $scope.updateResult);
    }


    angular
        .module('app.events.time')
        .component('seplEventTimeDateTime', {
            templateUrl: 'modules/events/time/datetime.html',
            controller: DateTimeDialogController,
            bindings: {
                onChange: '&',
                initial: '@'
            }
        });
})();