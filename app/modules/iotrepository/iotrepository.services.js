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

    angular.module('app.iotrepository').factory('iotGrabber', IotGrabber);

    /* @ngInject */
    function IotGrabber($mdDialog) {
        return {
            deviceInstance: instanceGrabber,
            valueType: valuetypeGrabber,
            deviceType: deviceTypeGrabber
        };

        function instanceGrabber(callback) {
            $mdDialog.show({
                templateUrl:"modules/iotrepository/instance_dialog.html",
                clickOutsideToClose:true,
                autoWrap:false,
                fullscreen: true,
                controller: IotInstanceGrabberDialog
            }).then(function(result){
                callback(result);
            }, function() {});
        }

        function valuetypeGrabber(callback) {
            $mdDialog.show({
                templateUrl:"modules/iotrepository/valuetype_dialog.html",
                clickOutsideToClose:true,
                autoWrap:false,
                fullscreen: true,
                controller: IotValueTypeGrabberDialog
            }).then(function(result){
                callback(result);
            }, function() {});
        }

        function deviceTypeGrabber(oldDevicetypeServiceIds, callback, serviceFilter) {
            $mdDialog.show({
                templateUrl:"modules/iotrepository/devicetype_dialog.html",
                clickOutsideToClose:true,
                autoWrap:false,
                fullscreen: true,
                locals: {serviceFilter: serviceFilter, oldDevicetypeServiceIds: oldDevicetypeServiceIds},
                controller: IotDeviceTypeGrabberDialog
            }).then(function(result){
                callback(result);
            }, function() {});
        }
    }



    function IotInstanceGrabberDialog($scope, $mdDialog, $http, IOT_REPO_URL) {
        var errorHandler = function(error){
            console.log(error);
        };

        $scope.device = {};

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.ok = function() {
            if($scope.device && $scope.device.id && $scope.service && $scope.service.id){
                var path = "/skeleton/"+encodeURIComponent($scope.device.id)+"/"+encodeURIComponent($scope.service.id);
                return $http.get(IOT_REPO_URL+path).then(function(response){
                    $mdDialog.hide({
                        service: $scope.service,
                        device: $scope.device,
                        deviceType: $scope.deviceType,
                        skeleton: response.data
                    });
                }, function(){
                    $mdDialog.hide({
                        service: $scope.service,
                        device: $scope.device,
                        deviceType: $scope.deviceType,
                        skeleton: ""
                    });
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
    }

    function IotValueTypeGrabberDialog($scope, $mdDialog, $http, IOT_REPO_URL) {
        var errorHandler = function(error){
            console.log(error);
        };

        $scope.valueType = {};

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.ok = function() {
            if($scope.valueType && $scope.valueType.id){
                $mdDialog.hide($scope.valueType);
            }
        };

        $scope.searchInfo = {
            searchText: "",
            searchResult:[]
        };

        $scope.search = function(){
            var path = "/ui/search/valueTypes/"+$scope.searchInfo.searchText+"/200/0";
            return $http.get(IOT_REPO_URL+path).then(function(response){
                $scope.searchInfo.searchResult = response.data;
            }, errorHandler);
        };

        $scope.clearSearch = function(){
            $scope.searchInfo.searchText = "";
            $scope.searchInfo.searchResult = [];
        };
    }

    function IotDeviceTypeGrabberDialog($scope, $mdDialog, $http, IOT_REPO_URL, serviceFilter, oldDevicetypeServiceIds) {
        var errorHandler = function(error){
            console.log(error);
        };

        $scope.device = {};

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.ok = function() {
            if($scope.fullDeviceType && $scope.fullDeviceType.id && $scope.service && $scope.service.id){
                var path = "/devicetype/skeleton/"+encodeURIComponent($scope.fullDeviceType.id)+"/"+encodeURIComponent($scope.service.id);
                return $http.get(IOT_REPO_URL+path).then(function(response){
                    $mdDialog.hide({
                        service: $scope.service,
                        deviceType: $scope.fullDeviceType,
                        skeleton: response.data
                    });
                }, function(){
                    $mdDialog.hide({
                        service: $scope.service,
                        deviceType: $scope.fullDeviceType,
                        skeleton: ""
                    });
                });
            }
        };

        $scope.searchInfo = {
            searchText: "",
            searchResult:[]
        };

        $scope.search = function(){
            var path = "/ui/search/deviceTypes/"+$scope.searchInfo.searchText+"/20/0";
            if(!$scope.searchInfo.searchText){
                path = "/deviceTypes/20/0"
            }
            return $http.get(IOT_REPO_URL+path).then(function(response){
                $scope.searchInfo.searchResult = response.data;
            }, errorHandler);
        };

        $scope.clearSearch = function(){
            $scope.searchInfo.searchText = "";
            $scope.searchInfo.searchResult = [];
        };

        $scope.fullDeviceType = {};
        $scope.updateDeviceType = function(){
            if($scope.device && $scope.device.id && $scope.device.id != $scope.fullDeviceType.id){
                $scope.fullDeviceType = {};
                $scope.service = {};
                var path = "/deviceType/"+encodeURIComponent($scope.device.id);
                $http.get(IOT_REPO_URL+path).then(function(response){
                    $scope.fullDeviceType = response.data;
                    $scope.device = response.data;
                    if(serviceFilter){
                        $scope.fullDeviceType.services = $scope.fullDeviceType.services.filter(serviceFilter);
                    }
                    if(oldDevicetypeServiceIds && oldDevicetypeServiceIds.serviceId){
                        $scope.service = $scope.fullDeviceType.services.filter(function(service){
                            return service.id == oldDevicetypeServiceIds.serviceId;
                        })[0];
                    }
                }, errorHandler);
            }
        };

        $scope.$watch('device', $scope.updateDeviceType);

        if(oldDevicetypeServiceIds && oldDevicetypeServiceIds.deviceTypeId && oldDevicetypeServiceIds.serviceId){
            $scope.device = {id: oldDevicetypeServiceIds.deviceTypeId};
            $scope.updateDeviceType();
        }
    }


})();