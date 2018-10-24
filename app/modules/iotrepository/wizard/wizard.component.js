
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

    var errorHandler = function(response){
        console.log(response.data);
        alert(response.data.message);
    };

    angular.module('app.iotrepository.wizard').component('seplIotrepoWizard', {
        templateUrl: "modules/iotrepository/wizard/deviceType.html",
        controller: function($scope, $http, IOT_REPO_URL, $stateParams, $state, $mdDialog, toolbarServices) {
            var that = this;

            this.saveDevicetype = function(){
                var pathEnding = $stateParams.id ? "/"+encodeURIComponent($stateParams.id) : "";
                var maintenanceCase = $scope.devicetype.maintenance && $scope.devicetype.maintenance.length > 0;
                $scope.devicetype.maintenance = [];
                $http.post(IOT_REPO_URL+"/deviceType"+pathEnding, $scope.devicetype).then(function(response){
                    $scope.devicetype = response.data;
                    $state.go('iotrepository.devicetypes');
                    toolbarServices.notificationsReset(function(notifications){return maintenanceCase && notifications.length > 0;});
                }, errorHandler);
            };

            that.createConfigurationParameter = function(name){
                return {name: name};
            };

            $scope.searchInfo = {
                searchText: "",
                searchResult:[]
            };
            $scope.search = function(entity){
                var pathEnding = "/"+entity+"/"+$scope.searchInfo.searchText+"/20/0";
                return $http.get(IOT_REPO_URL+"/ui/search"+pathEnding).then(function(response){
                    $scope.searchInfo.searchResult = response.data;
                }, errorHandler);
            };

            $scope.clearSearch = function(){
                $scope.searchInfo.searchText = "";
                $scope.searchInfo.searchResult = [];
            };


            this.loadDevicetype = function(){
                $http.get(IOT_REPO_URL+"/ui/deviceType/allowedvalues").then(function(response){
                    $scope.allowedValues = response.data;
                    if($stateParams.id){
                        $http.get(IOT_REPO_URL+"/deviceType/"+encodeURIComponent($stateParams.id)).then(function(response){
                            $scope.devicetype = response.data;
                            if(!$scope.devicetype.config_parameter){
                                $scope.devicetype.config_parameter = [];
                            }
                        });
                    }else if($stateParams.cloneid){
                        $http.get(IOT_REPO_URL+"/deviceType/"+encodeURIComponent($stateParams.cloneid)).then(function(response){
                            $scope.devicetype = that.cloneDeviceType(response.data);
                            if(!$scope.devicetype.config_parameter){
                                $scope.devicetype.config_parameter = [];
                            }
                        });
                    }else{
                        $scope.devicetype = {
                            id: $stateParams.id,
                            device_class: {},
                            vendor: {},
                            services: [],
                            config_parameter: []
                        };
                    }
                });
            };

            that.cloneDeviceType = function(devicetype){
                devicetype.id = null;
                devicetype.name = devicetype.name + " (clone)";
                devicetype.generated = false;
                for(var i = 0; i < devicetype.services.length; i++){
                    devicetype.services[i] = that.cloneService(devicetype.services[i]);
                }
                return devicetype;
            };

            that.cloneService = function(service){
                service.id = null;
                if(service.input){
                    for(var i = 0; i < service.input.length; i++){
                        service.input[i] = that.cloneMsgAssignment(service.input[i]);
                    }
                }
                if(service.output){
                    for(var i = 0; i < service.output.length; i++){
                        service.output[i] = that.cloneMsgAssignment(service.output[i]);
                    }
                }
                if(service.config_parameter){
                    for(var i = 0; i < service.config_parameter.length; i++){
                        service.config_parameter[i] = that.cloneField(service.config_parameter[i]);
                    }
                }
                return service;
            };

            that.cloneMsgAssignment = function(msgAssignment){
                msgAssignment.id = null;
                if(msgAssignment.field){
                    msgAssignment.field = that.cloneField(msgAssignment.field);
                }
                return msgAssignment;
            };

            that.cloneField = function(field){
                field.id = null;
                if(field.literal){
                    field.literal = that.cloneValue(field.literal);
                }
                return field;
            };

            that.cloneValue = function(value){
                value.id = null;
                if(value.sub_values){
                    for(var i = 0; i < value.sub_values.length; i++){
                        value.sub_values[i] = that.cloneValue(devicetype.sub_values[i]);
                    }
                }
                return value;
            };


            $scope.currentService;
            $scope.serviceAdd = function(){
                $scope.currentService = {
                    protocol:{},
                    config_parameter:[],
                    input:[],
                    output:[]
                };
                if(!$scope.devicetype.services){
                    $scope.devicetype.services = [];
                }
                $scope.devicetype.services.push($scope.currentService);
            };
            $scope.serviceEdit = function(service){
                $scope.currentService = service;
            };
            $scope.serviceBack = function(){
                $scope.currentService = null;
            };

            $scope.serviceRemove = function(){
                var index = $scope.devicetype.services.indexOf($scope.currentService);
                $scope.devicetype.services.splice(index,1);
                if($scope.devicetype.services.length == 0){
                    $scope.currentService = null;
                } else if(index < $scope.devicetype.services.length){
                    $scope.currentService = $scope.devicetype.services[index];
                } else {
                    $scope.currentService = $scope.devicetype.services[index - 1];
                }
            };

            $scope.assign = function(toValue, fromValue){
                for (var key in fromValue) {
                    if (fromValue.hasOwnProperty(key)) {
                        toValue[key] = fromValue[key];
                    }
                }
            };

            $scope.newDeviceClass = function(){
                dialog($scope, $mdDialog, {}, [], "DeviceClass", "nameDialog.html", function(result, ok){
                    if(ok){
                        $http.post(IOT_REPO_URL+"/other/deviceclass", result).then(function(response){
                            result.id = response.data.created_id;
                            $scope.devicetype.device_class = result;
                        }, errorHandler);
                    }
                });
            };
            
            $scope.newVendor = function(){
                dialog($scope, $mdDialog, {}, [], "Vendor", "nameDialog.html", function(result, ok){
                    if(ok){
                        $http.post(IOT_REPO_URL+"/other/vendor", result).then(function(response){
                            result.id = response.data.created_id;
                            $scope.devicetype.vendor = result;
                        }, errorHandler);
                    }
                });
            };

            $scope.loadTranslation = $scope.$parent.$parent.loadTranslation;

            this.loadDevicetype();
        }
    });

    angular.module('app.iotrepository.wizard').component('seplIotrepoWizardService', {
        templateUrl: "modules/iotrepository/wizard/service.html",
        controller: function($scope, $http, IOT_REPO_URL, $mdDialog) {
            $scope.searchInfo = {
                searchText: "",
                searchResult:[]
            };

            $scope.search = function(entity){
                var pathEnding = "/"+entity+"/"+$scope.searchInfo.searchText+"/20/0";
                return $http.get(IOT_REPO_URL+"/ui/search"+pathEnding).then(function(response){
                    $scope.searchInfo.searchResult = response.data;
                }, errorHandler);
            };

            $scope.clearSearch = function(){
                $scope.searchInfo.searchText = "";
                $scope.searchInfo.searchResult = [];
            };

            $scope.assign = function(toValue, fromValue){
                for (var key in fromValue) {
                    if (fromValue.hasOwnProperty(key)) {
                        toValue[key] = fromValue[key];
                    }
                }
            };

            $scope.selectValueType = function(element, valueType){
                $http.get(IOT_REPO_URL+"/valueType/"+encodeURIComponent(valueType.id)).then(function(response){
                    element.additional_formatinfo = $scope.getAdditionalInfoSkeleton(response.data);
                });
            };

            $scope.refreshPreview = function(assignment){
                $http.post(IOT_REPO_URL+"/format/example", assignment).then(function(response){
                    if(typeof response.data == 'string'){
                        $scope.preview = response.data;
                    }else{
                        $scope.preview = JSON.stringify(response.data,null,"    ");
                    }
                    console.log($scope.preview);
                });
            };

            $scope.getAdditionalInfoSkeleton = function(valueType){
                var list = [];
                for(var i=0; valueType.fields && i<valueType.fields.length; i++){
                    list.push({field: valueType.fields[i], format_flag: ""});
                    Array.prototype.push.apply(list, $scope.getAdditionalInfoSkeleton(valueType.fields[i].type))
                }
                return list;
            };

            $scope.getAllowedValues = function(){
                return $scope.$parent.allowedValues;
            };


            $scope.isStructure = function(id){
                if(!id){
                    return false;
                }
                for(var i=0; i<$scope.allowedValues.structures.length; i++){
                    if($scope.allowedValues.structures[i] == id){
                        return true;
                    }
                }
                return false;
            };

            $scope.isCollection = function(id){
                if(!id){
                    return false;
                }
                for(var i=0; i<$scope.allowedValues.collections.length; i++){
                    if($scope.allowedValues.collections[i] == id){
                        return true;
                    }
                }
                return false;
            };

            $scope.isPrimitive = function(id){
                if(!id){
                    return false;
                }
                for(var i=0; i<$scope.allowedValues.primitive.length; i++){
                    if($scope.allowedValues.primitive[i] == id){
                        return true;
                    }
                }
                return false;
            };

            $scope.inputAdd = function() {
                var input = {type:{}, msg_segment:{}};
                if(!$scope.$parent.currentService.input){
                    $scope.$parent.currentService.input = [];
                }
                dialog($scope, $mdDialog, input, $scope.$parent.currentService.input, "Input", "msgSegment.html")
            };

            $scope.inputEdit = function(input) {
                dialog($scope, $mdDialog, input, $scope.$parent.currentService.input, "Input", "msgSegment.html")
            };

            $scope.resultAdd = function() {
                var result = {type:{}, msg_segment:{}};
                if(!$scope.$parent.currentService.output){
                    $scope.$parent.currentService.output = [];
                }
                dialog($scope, $mdDialog, result, $scope.$parent.currentService.output, "Result", "msgSegment.html")
            };

            $scope.resultEdit = function(result) {
                dialog($scope, $mdDialog, result, $scope.$parent.currentService.output, "Result", "msgSegment.html")
            };

            $scope.loadTranslation = $scope.$parent.loadTranslation;
        }
    });

    var dialog = function(scope, mdDialog, element, list, header, template, callback){
        var elementClone = JSON.parse(JSON.stringify(element));
        var newScope = scope.$new();
        newScope.dialogElement = elementClone;
        newScope.dialogHeader = header;

        var newValue = list.indexOf(element) == -1;
        if(!callback){
            callback = function(result, ok){
                if(ok){
                    if(newValue){ //add new element
                        list.push(result);
                    }else{ //replace element
                        for (var key in result) {
                            if (result.hasOwnProperty(key)) {
                                element[key] = result[key];
                            }
                        }
                    }
                }
            }
        }
        newScope.openDialog = function(){
            newScope.$parent.childDialog = true;
            newScope.childDialog = false;
            mdDialog.show({
                controller: FieldDialogController,
                templateUrl: 'modules/iotrepository/wizard/'+template,
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                scope: newScope,
                preserveScope: true,
                autoWrap:false,
                fullscreen: true
            }).then(
                function(ok) {
                    callback(elementClone, ok);
                    if(newScope.$parent.openDialog && !newScope.childDialog){
                        newScope.$parent.childDialog = false;
                        newScope.$parent.openDialog();
                    }
                },function(){
                    if(newScope.$parent.openDialog && !newScope.childDialog){
                        newScope.$parent.childDialog = false;
                        newScope.$parent.openDialog();
                    }
                }
            );
        };
        newScope.openDialog();
    };

    var FieldDialogController = function($http, $scope, $mdDialog) {

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.ok = function() {
            $mdDialog.hide(true);
        };

    };
    FieldDialogController.$inject = ["$http", "$scope", "$mdDialog"];

})
();







