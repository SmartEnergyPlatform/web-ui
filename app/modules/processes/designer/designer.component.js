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
    function DesignerController($scope, SeplModeler, x2js, repositoryService, $stateParams, $mdToast, $mdDialog, iotGrabber, seplDurationpickerDialog, seplDateTimeDialogService, seplCycleDialogService) {
        var vm = this;
        vm.save = save;
        vm.diagram = '';
        vm.modeler = bootstrapModeler();
        vm.importProcess = importProcess;

        vm.registeredBpmnOutputVariables = [];

        loadDiagram();

        function bootstrapModeler() {
            return new SeplModeler({
                container: '#js-canvas',
                propertiesPanel: {
                    parent: '#js-properties-panel'
                }
            });
        }

        function loadDiagram() {
            if (!$stateParams.id) {
                vm.diagram = '<?xml version="1.0" encoding="UTF-8"?>' +
                    '<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                    'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                    'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
                    'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" ' +
                    'targetNamespace="http://bpmn.io/schema/bpmn" ' +
                    'id="Definitions_1">' +
                    '<bpmn:process id="Process_1" isExecutable="true">' +
                    '<bpmn:startEvent id="StartEvent_1"/>' +
                    '</bpmn:process>' +
                    '<bpmndi:BPMNDiagram id="BPMNDiagram_1">' +
                    '<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">' +
                    '<bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">' +
                    '<dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/>' +
                    '</bpmndi:BPMNShape>' +
                    '</bpmndi:BPMNPlane>' +
                    '</bpmndi:BPMNDiagram>' +
                    '</bpmn:definitions>';
                openDiagram(vm.diagram);
            } else {
                repositoryService.getProcessModel($stateParams.id).then(function (dataResponse) {
                    vm.diagram = x2js.json2xml_str(dataResponse[0].process);
                    openDiagram(vm.diagram);
                });
            }
        }

        function openDiagram(xml) {
            vm.modeler.importXML(xml, function (err) {
                if (err) {
                    console.log('error rendering', err);
                }
            })
        }

        function saveSVG(done) {
            vm.modeler.saveSVG(done);
        }

        function saveXML(done) {
            vm.modeler.saveXML({format: true}, function (err, xml) {
                done(err, xml);
            });
        }


        function getPayload(element){
            for(var i=0; i<element.extensionElements.values.length; i++){
                for(var j=0; j<element.extensionElements.values[i].inputParameters.length; j++){
                    if(element.extensionElements.values[i].inputParameters[j].name == "payload"){
                        return JSON.parse(element.extensionElements.values[i].inputParameters[j].value);
                    }
                }
            }
        }

        function getMeta(flowNodeRef) {
            if(flowNodeRef.$type == "bpmn:ServiceTask" && flowNodeRef.type == "external" && flowNodeRef.topic == "execute_in_dose"){
                return getPayload(flowNodeRef)
            }
        }

        function compatibleMeta(meta, newMeta) {
            return !(meta && newMeta && meta.device_type != newMeta.device_type);
        }

        function checkLaneConstraints(laneBo) {
            var meta = null;
            for(var i=0; laneBo.flowNodeRef && i<laneBo.flowNodeRef.length; i++){
                var newMeta = getMeta(laneBo.flowNodeRef[i]);
                if(!meta && newMeta){
                    meta = newMeta
                }
                if(!compatibleMeta(meta, newMeta)){
                    return false;
                }
            }
            return true;
        }

        function checkConstraints(){
            return vm.modeler.injector.get("elementRegistry").filter(function(element){
                return element.type == "bpmn:Lane" && !checkLaneConstraints(element.businessObject);
            });
        }


        function save() {
            var invalidLanes = checkConstraints();
            if(invalidLanes.length > 0){
                var msg = [];
                for(var i = 0; i<invalidLanes.length; i++){
                    msg.push({name: invalidLanes[i].businessObject.name, id: invalidLanes[i].businessObject.id});
                }
                var dialogScope = $scope.$new();
                dialogScope.msg = msg;
                $mdDialog.show({
                    controller: function($scope, $mdDialog){
                        $scope.close = function(){
                            $mdDialog.hide()
                        }
                    },
                    templateUrl:"modules/processes/designer/invalid_lanes_dialog.html",
                    clickOutsideToClose:true,
                    fullscreen: true,
                    scope: dialogScope
                });
            }else{
                saveXML(function (err, xml) {
                    saveSVG(function (err, svg) {
                        if ($stateParams.id) {
                            repositoryService.update($stateParams.id, xml, svg).then(showToast());
                        } else {
                            repositoryService.add(xml, svg).then(showToast());
                        }
                    });

                    function showToast() {
                        $mdToast.show($mdToast.saveProcess());
                    }
                });
            }
        }

        function importProcess(file) {
            if (file) {
                var r = new FileReader();
                r.onload = function (e) {
                    vm.diagram = e.target.result;
                    openDiagram(vm.diagram);
                    $mdToast.show($mdToast.importProcess());
                };
                r.readAsText(file);
            } else {
                console.log("Failed to load file");
            }
        }

        vm.modeler.designerCallbacks = {
            durationDialog: seplDurationpickerDialog,
            dateDialog: seplDateTimeDialogService,
            cycleDialog: seplCycleDialogService,
            editHistoricDataConfig: editHistoricDataConfigDialog,
            deregisterOutputs: function(outputs){
                for(var i=0;i<outputs.length; i++){
                    var index = vm.registeredBpmnOutputVariables.indexOf(outputs[i]);
                    if (index > -1) {
                        vm.registeredBpmnOutputVariables.splice(index, 1);
                    }
                }
            },
            registerOutputs: function(outputs){
                vm.registeredBpmnOutputVariables = vm.registeredBpmnOutputVariables.concat(outputs);
            },
            getInfoHtml: getInfoHtml,
            editInput: editInputDialog,
            editOutput: editOutputDialog,
            editInputScript: function(value, callback){
                $mdDialog.show({
                    templateUrl:"modules/processes/designer/iot_script_dialog.html",
                    clickOutsideToClose:true,
                    autoWrap:false,
                    fullscreen: true,
                    controller: DialogController
                }).then(function(result){
                    callback(result);
                }, function() {});
                function DialogController($scope, $mdDialog) {
                    $scope.script = value;

                    $scope.hide = function () {
                        $mdDialog.hide();
                    };

                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };

                    $scope.ok = function () {
                        $mdDialog.hide($scope.script);
                    };
                }
            },
            findIotDevice: function(callback){
                iotGrabber.deviceInstance(function(result){
                    if(result.skeleton){
                        callback(result);
                    }else{
                        console.log("ERROR: missing skeleton in result ", result);
                    }
                })
            },
            findIotDeviceType: function(devicetypeService, callback){
                iotGrabber.deviceType(devicetypeService, function(result){
                    if(result.skeleton){
                        callback(result);
                    }else{
                        console.log("ERROR: missing skeleton in result ", result);
                    }
                })
            }
        };

        function editHistoricDataConfigDialog(exisitingConfig, callback) {
            $mdDialog.show({
                templateUrl:"modules/processes/designer/historic_data_config_dialog.html",
                clickOutsideToClose:true,
                autoWrap:false,
                fullscreen: true,
                controller: HistoricDataConfigDialogController
            }).then(function(result){
                callback(result);
            }, function() {});

            function HistoricDataConfigDialogController($scope, $mdDialog, $http, analyticsExportService) {
                $scope.config = exisitingConfig || {}
                $scope.times = [
                    {
                        "id": "seconds",
                        "name": "Sekunden"
                    },
                    {
                        "id": "minutes",
                        "name": "Minuten"
                    },
                    {
                        "id": "hours",
                        "name": "Stunden"
                    }
                ]
                analyticsExportService.getAll().then(function(result) {
                    $scope.availableMeasurements = result
                })
                $scope.availableActions = [
                    {
                        "id": "sum",
                        "name": "Summe"
                    }, 
                    {
                        "id": "mean",
                        "name": "Durchschnitt"
                    }, 
                    {
                        "id": "median",
                        "name": "Median"
                    }, 
                    {
                        "id": "min",
                        "name": "Minimum"
                    }, 
                    {
                        "id": "max",
                        "name": "Maximum"
                    }, 
                    {
                        "id": "count",
                        "name": "Anzahl an Werte"
                    }, 
                ]
        
                $scope.close = function() {
                    $mdDialog.hide();
                };
        
                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
        
                $scope.ok = function() {
                    var result = {
                        analysisAction: $scope.config.analysisAction,
                        interval: $scope.config.interval,
                        dateInterval: $scope.config.dateInterval
                    }
                    $mdDialog.hide(result);
                }
            }
        }

        function getInfoHtml(element){
            var context = {variables:[]};
            var outputs = getIncomingOutputs(element);
            outputs.forEach(function(element){
                context.variables.push({name: element.name, value: element.value})
            });
            var html = Mustache.render('<table><tr><th>Variable</th><th>Orig-Ref</th></tr>{{#variables}}<tr><td>{{name}}</td><td>{{value}}</td></tr>{{/variables}}</table>', context);
            return html
        }

        function getIncomingOutputs(element, done) {
            var result = [];
            done = done || [];
            if(done.indexOf(element) != -1){
                return [];
            }else{
                done.push(element);
                for(var index = 0; index < element.incoming.length; index++){
                    var incoming = element.incoming[index].source;
                    if(incoming.businessObject.extensionElements
                        && incoming.businessObject.extensionElements.values
                        && incoming.businessObject.extensionElements.values[0]
                        && incoming.businessObject.extensionElements.values[0].outputParameters
                    ){
                        result = result.concat(incoming.businessObject.extensionElements.values[0].outputParameters);
                    }
                    result = result.concat(getIncomingOutputs(incoming, done));
                }
                return result;
            }
        }

        function editInputDialog(element, callback){
            var outputs = getIncomingOutputs(element);
            var inputs = element.businessObject.extensionElements.values[0].inputParameters;

            $mdDialog.show({
                templateUrl:"modules/processes/designer/iot_inputs_dialog.html",
                clickOutsideToClose:true,
                autoWrap:false,
                fullscreen: true,
                controller: DialogController
            }).then(function(result){
                callback();
            }, function() {});
            function DialogController($scope, $mdDialog) {
                $scope.inputs = inputs;
                $scope.outputs = outputs;

                $scope.close = function () {
                    $mdDialog.hide();
                };
            }
        }

        function editOutputDialog(outputs, callback){
            $mdDialog.show({
                templateUrl:"modules/processes/designer/iot_outputs_dialog.html",
                clickOutsideToClose:true,
                autoWrap:false,
                fullscreen: true,
                controller: DialogController
            }).then(function(result){
                callback();
            }, function() {});
            function DialogController($scope, $mdDialog) {
                console.log(outputs)
                $scope.outputs = outputs;

                $scope.close = function () {
                    $mdDialog.hide();
                };
            }
        }

    }

    angular
        .module('app.processes.designer')
        .component('seplProcessDesigner', {
            templateUrl: 'modules/processes/designer/designer.html',
            controller: DesignerController
        });
})
();