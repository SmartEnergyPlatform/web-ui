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

    function DeviceInstanceSearchController (IOT_REPO_URL, $scope, $http) {
        var that = this;
        $scope.searchInfo = {
            searchText: "",
            searchResult:[]
        };

        $scope.search = function(){
            var action = "";
            if(that.permission && that.permission != ""){
                action = "/"+that.permission
            }
            var path = "/ui/search/deviceInstances/"+$scope.searchInfo.searchText+"/20/0"+action;
            return $http.get(IOT_REPO_URL+path).then(function(response){
                $scope.searchInfo.searchResult = response.data;
            }, errorHandler);
        };

        $scope.clearSearch = function(){
            $scope.searchInfo.searchText = "";
            $scope.searchInfo.searchResult = [];
        };

        function errorHandler(e){
            console.log("ERROR: ", e)
        }
    }

    angular.module('app.iotrepository.deviceinstances.search').component('seplDeviceInstancesSearch', {
        templateUrl: "modules/iotrepository/deviceinstances/search/search.html",
        controller: DeviceInstanceSearchController,
        bindings: {
            device: '=',
            permission: '@'
        }
    });
})
();