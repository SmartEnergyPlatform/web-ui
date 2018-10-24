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

    angular.module('app.events.msg').factory('jsonPathTry', function($mdDialog) {
        function DialogController($scope, $mdDialog, jsonPath, valueExample, pathExample) {
            $scope.valueExample = valueExample || '{"abc": 3}';
            $scope.pathExample = pathExample || '$.abc';
            $scope.exampleResult = "";
            $scope.tryPath = function(){
                try{
                    $scope.exampleResult = JSON.stringify(jsonPath(JSON.parse($scope.valueExample), $scope.pathExample));
                }catch(e){
                    $scope.exampleResult = "ERROR";
                }
            };

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.ok = function() {
                $mdDialog.hide({
                    path: $scope.pathExample,
                    value: $scope.valueExample
                });
            };

            $scope.tryPath();
        }

        return function (value, path, callback) {
            $mdDialog.show({
                templateUrl:"modules/events/msg/jsonpath_dialog.html",
                clickOutsideToClose:true,
                autoWrap:false,
                fullscreen: true,
                controller: DialogController,
                locals:{
                    pathExample : path,
                    valueExample : value
                }
            }).then(function(result){
                callback(result);
            }, function() {});
        };
    });

    angular.module('app.events.msg').component('seplEventMsgEdit', {
        templateUrl: "modules/events/msg/edit.html",
        controller: SeplEventMsgEdit,
        bindings: {
            event: "=",
            change: "&"
        }
    });

    /* @ngInject */
    function SeplEventMsgEdit($http, jsonPathTry, $scope, deviceInstancesService, IOT_REPO_URL, analyticsOperatorRepositoryService, $translatePartialLoader) {
        $translatePartialLoader.addPart('events');
        var that = this;
        $scope.deviceType = {};
        $scope.service = {};
        $scope.device = {};
        $scope.analyticsOperator = null;
        that.$onInit = function(){
            if(that.event.filter.device_id){
                deviceInstancesService.getInstance(that.event.filter.device_id).then(function(result){
                    $scope.device = result;
                    that.setServiceExample();
                });
            }
            analyticsOperatorRepositoryService.getAll().then(function(result){
                $scope.analyticsOperators = result.operators;
                if(that.event.filter.topic && that.event.filter.topic.startsWith("analytics-")){
                    for (var i = 0; i < $scope.analyticsOperators; i++){
                        if("analytics-" + $scope.analyticsOperators[i].name == that.event.filter.topic){
                            $scope.analyticsOperator = $scope.analyticsOperators[i];
                        }
                    }
                }
            });
        };

        that.addRule = function(){
            if(!that.event.filter.rules){
                that.event.filter.rules = [];
            }
            that.event.filter.rules.push({scope: "all"});
        };

        that.removeRule = function(rule){
            var index = that.event.filter.rules.indexOf(rule);
            if (index > -1) {
                that.event.filter.rules.splice(index, 1);
            }
        };

        $scope.$watch('device', function() {
            that.event.filter.device_id = $scope.device.id;
            $scope.deviceType = {};
            $scope.service = {};
            if($scope.device && $scope.device.device_type){
                that.updateLabel();
                var path = "/deviceType/"+encodeURIComponent($scope.device.device_type);
                $http.get(IOT_REPO_URL+path).then(function(response){
                    $scope.deviceType = response.data;
                    if (that.event.filter.service_id) {
                        for (var i = 0; i < $scope.deviceType.services; i++){
                            if($scope.deviceType.services[i].id == that.event.filter.service_id){
                                $scope.service = $scope.deviceType.services[i];
                            }
                        }
                    }
                }, function(e){
                    console.log("ERROR: ", e)
                });
            }
        });

        $scope.$watch('service', function() {
            if($scope.service.id){
                that.updateLabel();
                that.event.filter.service_id = $scope.service.id;
                that.setServiceExample();
            }
        });

        $scope.$watch('analyticsOperator', function() {
            if($scope.analyticsOperator && $scope.analyticsOperator.name){
                that.event.filter.topic = "analytics-" + $scope.analyticsOperator.name;
                var example = createAnalyticsOutputsExample();
                example.device_id = that.event.filter.device_id;
                example.service_id = that.event.filter.service_id;
                example.source_topic = that.event.filter.topic;
                that.valueExample = JSON.stringify(example, null, 4);
            }else{
                that.event.filter.topic = "";
                that.setServiceExample();
            }
            that.updateLabel();
        });

        that.updateLabel = function(){
            var label = [];
            if($scope.analyticsOperator && $scope.analyticsOperator.name){
                label.push($scope.analyticsOperator.name);
            }
            if($scope.device && $scope.device.name){
                label.push($scope.device.name);
            }
            if($scope.service && $scope.service.name){
                label.push($scope.service.name);
            }
            that.event._label = label.join(" ");
            if(that.change){
                that.change();
            }
        };

        that.setServiceExample = function(){
            if(that.event.filter.service_id && that.event.filter.device_id){
                var path = "/skeleton/"+encodeURIComponent(that.event.filter.device_id)+"/"+encodeURIComponent(that.event.filter.service_id);
                $http.get(IOT_REPO_URL+path).then(function(response){
                    var example = {value: response.data.outputs};
                    example.device_id = that.event.filter.device_id;
                    example.service_id = that.event.filter.service_id;
                    example.source_topic = that.event.filter.topic || "topic";
                    that.valueExample = JSON.stringify(example, null, 4);
                }, function(e){
                    console.log("ERROR: ", e)
                });
            }
        };

        function analyticsExampleValue(type) {
            if(type == "string"){
                return "abc"
            }
            if(type == "float"){
                return 0.0
            }
            if(type == "double"){
                return 0.0
            }
            if(type == "int"){
                return 0
            }
            if(type == "bool"){
                return true
            }
            return "unknown type ("+type+")"
        }

        function addToAnalyticsExample(result, output) {
            var path = output.name.split(".");
            var type = output.type;
            var current = result;
            for(var i = 0; i<path.length; i++){
                var arrayParts = path[i].split("[");
                var fieldName = arrayParts.shift();
                if(!current[fieldName]){
                    if(arrayParts.length > 0){
                        current[fieldName] = [];
                    }else{
                        if(i == path.length-1){
                            current[fieldName] = analyticsExampleValue(type);
                        }else{
                            current[fieldName] = {};
                        }
                    }
                }
                current = current[fieldName];
                for(var j = 0; j<arrayParts.length; j++){
                    var index = parseInt(arrayParts[j].slice(0, -1))
                    if(j < arrayParts.length-1){
                        current[index] = [];
                    }else{
                        if(i == path.length-1){
                            current[fieldName] = analyticsExampleValue(type);
                        }else{
                            current[fieldName] = {};
                        }
                    }
                }
            }
            return result;
        }

        function createAnalyticsOutputsExample(){
            var result = {};
            for(var i = 0; i<$scope.analyticsOperator.outputs.length; i++){
                result = addToAnalyticsExample(result, $scope.analyticsOperator.outputs[i]);
            }
            return result;
        }

        that.valueExample = '{"abc":3}';
        that.tryPath = function(rule){
            jsonPathTry(that.valueExample, rule.path, function(result){
                that.valueExample = result.value;
                rule.path = result.path;
            });
        };
    }
})
();