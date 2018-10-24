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

(function(){
    'use strict';

    angular.module('app.events').factory('eventGrabber', EventGrabber);

    function EventGrabber($mdDialog){
        return {
            byDeviceService: byDeviceService,
            byDeviceTypeService: byDeviceTypeService,
            findAnalyticsEvent: findAnalyticsEvent
        };

        function findAnalyticsEvent(callback){
            $mdDialog.show({
                templateUrl:"modules/events/services/event_dialog.html",
                clickOutsideToClose:true,
                autoWrap:false,
                fullscreen: true,
                controller: EventDialog
            }).then(function(result){
                callback(result);
            }, function() {});
        }

        function EventDialog($scope, $mdDialog, $http, EVENT_MANAGER_URL){
            $scope.events = [];
            $scope.event = null;

            var errorHandler = function(error){
                console.log(error);
            };

            $http.get(EVENT_MANAGER_URL+"/analyticsrules").then(function(response){
                $scope.events = response.data;
            }, errorHandler);

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.ok = function(){
                if($scope.event){
                    $mdDialog.hide({
                        event: $scope.event
                    });
                }
            };

        }

        function byDeviceTypeService(callback){
            $mdDialog.show({
                templateUrl:"modules/events/services/event_dt_service_dialog.html",
                clickOutsideToClose:true,
                autoWrap:false,
                fullscreen: true,
                controller: ByDeviceTypeServiceDialog
            }).then(function(result){
                callback(result);
            }, function() {});
        }

        function ByDeviceTypeServiceDialog($scope, $mdDialog, $http, IOT_REPO_URL, EVENT_MANAGER_URL) {
            $scope.deviceType = {};
            $scope.service = {};
            $scope.events = [];
            $scope.event = {};

            var errorHandler = function(error){
                console.log(error);
            };

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.ok = function(){
                if($scope.selection){
                    $mdDialog.hide({
                        service: $scope.selection.service,
                        deviceType: $scope.deviceType,
                        event: $scope.selection.event
                    });
                }
            };

            $scope.searchInfo = {
                searchText: "",
                searchResult:[]
            };

            $scope.search = function(){
                var path = "/ui/search/deviceTypes/"+$scope.searchInfo.searchText+"/20/0";
                return $http.get(IOT_REPO_URL+path).then(function(response){
                    $scope.searchInfo.searchResult = response.data;
                }, errorHandler);
            };

            $scope.clearSearch = function(){
                $scope.searchInfo.searchText = "";
                $scope.searchInfo.searchResult = [];
            };

            $scope.$watch('deviceType', function() {
                if($scope.deviceType && $scope.deviceType.id && !$scope.deviceType.vendor.name){  //devicetype selected but not filled with services
                    $scope.selection = null;
                    var path = "/deviceType/"+encodeURIComponent($scope.deviceType.id);
                    $http.get(IOT_REPO_URL+path).then(function(response){
                        $scope.deviceType = response.data;
                        $scope.eventoptions = [];
                        angular.forEach($scope.deviceType.services, function(service, index) {
                            var that = this;
                            if(service.service_type == "http://www.sepl.wifa.uni-leipzig.de/ontlogies/device-repo#Sensor") {
                                var path = "/rulesbyserviceid/"+encodeURIComponent(service.id);
                                $http.get(EVENT_MANAGER_URL+path).then(function(response){
                                    var events = response.data;
                                    angular.forEach(events, function(event, index) {
                                        that.push({event: event, service: service});
                                    }, null);
                                }, errorHandler);
                            }
                        }, $scope.eventoptions);
                    }, errorHandler);
                }
            });
        }


        function byDeviceService(callback){
            $mdDialog.show({
                templateUrl:"modules/events/services/event_service_dialog.html",
                clickOutsideToClose:true,
                autoWrap:false,
                fullscreen: true,
                controller: ByDeviceServiceDialog
            }).then(function(result){
                callback(result);
            }, function() {});
        }


        function ByDeviceServiceDialog($scope, $mdDialog, $http, IOT_REPO_URL, EVENT_MANAGER_URL) {
            var errorHandler = function(error){
                console.log(error);
            };

            $scope.device = {};
            $scope.service = {};
            $scope.events = [];
            $scope.event = {};

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.ok = function() {
                if($scope.device && $scope.device.id && $scope.service && $scope.service.id && $scope.event && $scope.event.id){
                    $mdDialog.hide({
                        service: $scope.service,
                        device: $scope.device,
                        deviceType: $scope.deviceType,
                        event: $scope.event
                    });
                }
            };

            $scope.searchInfo = {
                searchText: "",
                searchResult:[]
            };

            $scope.search = function(){
                var path = "/ui/search/deviceInstances/"+$scope.searchInfo.searchText+"/20/0";
                return $http.get(IOT_REPO_URL+path).then(function(response){
                    $scope.searchInfo.searchResult = response.data;
                }, errorHandler);
            };

            $scope.clearSearch = function(){
                $scope.searchInfo.searchText = "";
                $scope.searchInfo.searchResult = [];
            };

            $scope.$watch('device', function() {
                $scope.deviceType = {};
                $scope.service = {};
                if($scope.device && $scope.device.device_type){
                    var path = "/deviceType/"+encodeURIComponent($scope.device.device_type);
                    $http.get(IOT_REPO_URL+path).then(function(response){
                        $scope.deviceType = response.data;
                    }, errorHandler);
                }
            });

            $scope.$watch('service', function() {
                $scope.events = [];
                $scope.event = {};
                if($scope.service){
                    var path = "/rulesbyserviceid/"+encodeURIComponent($scope.service.id);
                    $http.get(EVENT_MANAGER_URL+path).then(function(response){
                        $scope.events = response.data;
                    }, errorHandler);
                }
            });
        }
    }
})();