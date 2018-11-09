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
    function DeployController(SeplModeler, $scope, $sce, jsonPath, repositoryService, deploymentsService, $stateParams, deployService, x2js, $state, analyticsExportService, $translatePartialLoader) {
        $translatePartialLoader.addPart('processes');
        function initNew(){
            repositoryService.getProcessModel($stateParams.processid).then(function(processmodell){
                if(processmodell && processmodell.length > 0){
                    $scope.origSvg = x2js.json2xml_str(processmodell[0].svg);
                    var process = x2js.json2xml_str(processmodell[0].process);
                    deployService.prepareAbstractProcess(process).then(function(abstractProcess){
                        $scope.abstractProcess = abstractProcess;
                        $scope.abstractProcess.name = "";
                        fillDisplayElements();
                        $scope.updateDiagram();
                    });
                }
            })
        }

        function initClone(){
            deploymentsService.getProcessDefinitionByDeploymentId($stateParams.deploymentid).then(function(processDefinitions){
                if(processDefinitions && processDefinitions.length > 0){
                    deploymentsService.getDiagram(processDefinitions[0].id).then(function(svg){
                        $scope.origSvg = svg;
                        $scope.svgString = $scope.origSvg;
                        $scope.svg = $sce.trustAsHtml($scope.svgString);
                        deployService.getCloneAbstract($stateParams.deploymentid).then(function(abstractProcess){
                            $scope.abstractProcess = abstractProcess;
                            $scope.abstractProcess.name = "";
                            fillDisplayElements();
                            $scope.updateDiagram();
                        });
                    });
                }
            });
        }

        if($stateParams.processid){
            initNew();
        }
        if($stateParams.deploymentid){
            initClone();
        }

        $scope.displayElements = [];
        $scope.currentIndex = 0;
        $scope.measurementOptions = []
        $scope.measurementFieldOptions = []


        function fillDisplayElements() {
            if ($scope.abstractProcess && $scope.abstractProcess.msg_events) {
                for (var i = 0; i < $scope.abstractProcess.msg_events.length; i++) {
                    $scope.displayElements.push({
                        msg_event: $scope.abstractProcess.msg_events[i],
                        select: [$scope.abstractProcess.msg_events[i].shape_id],
                        secondarySelect: []
                    });
                }
            }
            if ($scope.abstractProcess && $scope.abstractProcess.time_events) {
                for (var i = 0; i < $scope.abstractProcess.time_events.length; i++) {
                    $scope.displayElements.push({
                        time_event: $scope.abstractProcess.time_events[i],
                        select: [$scope.abstractProcess.time_events[i].shape_id],
                        secondarySelect: []
                    });
                }
            }
            if ($scope.abstractProcess && $scope.abstractProcess.receive_tasks) {
                for (var i = 0; i < $scope.abstractProcess.receive_tasks.length; i++) {
                    $scope.displayElements.push({
                        receive_task: $scope.abstractProcess.receive_tasks[i],
                        select: [$scope.abstractProcess.receive_tasks[i].shape_id],
                        secondarySelect: []
                    });
                }
            }
            if ($scope.abstractProcess && $scope.abstractProcess.abstract_tasks) {
                for (var i = 0; i < $scope.abstractProcess.abstract_tasks.length; i++) {
                    var taskIds = [];
                    var abstractTask = $scope.abstractProcess.abstract_tasks[i];
                    for (var j = 0; j < abstractTask.tasks.length; j++) {
                        taskIds.push(abstractTask.tasks[j].id);
                    }
                    $scope.displayElements.push({
                        abstract_task: abstractTask,
                        select: taskIds,
                        secondarySelect: []
                    });
                    if (abstractTask.tasks) {
                        for (var j = 0; j < abstractTask.tasks.length; j++) {
                            if (abstractTask.tasks[j].parameter && abstractTask.tasks[j].parameter.length > 0) {
                                $scope.displayElements.push({
                                    task: abstractTask.tasks[j],
                                    select: [abstractTask.tasks[j].id],
                                    secondarySelect: taskIds
                                });
                            }
                        }
                    }
                }
            }
            if ($scope.abstractProcess && $scope.abstractProcess.abstract_data_export_tasks) {
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
                ];
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
                    }
                ];

                $scope.$watch('displayElements', function(newvalue,oldvalue) {
                    for(var i=0; i<newvalue.length; i++) {
                        var element = newvalue[i]
                        if(element.abstract_data_export_task && element.abstract_data_export_task.measurement) {
                            for(var l=0; l < $scope.measurementOptions.length; l++) {
                                var measurement = $scope.measurementOptions[l]
                                if(measurement["ID"] == element.abstract_data_export_task.measurement) {
                                    $scope.measurementFieldOptions = measurement["Values"]
                                }
                            }
                        }
                    }
                }, true);

                for (var i = 0; i < $scope.abstractProcess.abstract_data_export_tasks.length; i++) {
                    var abstractDataExportTask = $scope.abstractProcess.abstract_data_export_tasks[i]
                    analyticsExportService.getAll().then(function(result) {
                        $scope.measurementOptions = result
                        $scope.displayElements.push({
                            abstract_data_export_task: abstractDataExportTask,
                            select: [abstractDataExportTask.id]
                        });
                    })
                } 
            }
        }

        function addInfoToSvg() {
            var doc = document.getElementById("svg-diagram");

            var selectedTask = [];
            var secondarySelectedTask = [];

            if ($scope.currentIndex >= 0 && $scope.displayElements[$scope.currentIndex]) {
                selectedTask = $scope.displayElements[$scope.currentIndex].select;
                secondarySelectedTask = $scope.displayElements[$scope.currentIndex].secondarySelect;
            } else {
                selectedTask = [];
                secondarySelectedTask = [];
            }

            if (secondarySelectedTask) {
                for (var i = 0; i < secondarySelectedTask.length; i++) {
                    var task = doc.querySelector("g[data-element-id='" + secondarySelectedTask[i] + "']");
                    var classList = task.getAttribute("class").split(" ");
                    classList.push("SecondarySelectedTask");
                    task.setAttribute("class", classList.join(" "));
                }
            }

            for (var i = 0; i < selectedTask.length; i++) {
                var task = doc.querySelector("g[data-element-id='" + selectedTask[i] + "']");
                var classList = task.getAttribute("class").split(" ");
                classList.push("SelectedTask");
                task.setAttribute("class", classList.join(" "));
            }

            //<text style="font-family: 'Material Icons'">warning</text>
            var invalid = getInvalidTasks();
            for (var i = 0; i < invalid.length; i++) {
                var task = doc.querySelector("g[data-element-id='" + invalid[i] + "']");
                var text = document.createTextNode("warning");
                var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
                svgElement.appendChild(text);
                svgElement.setAttribute("style", "font-family: 'Material Icons'; fill: red;");
                var task = doc.querySelector("g[data-element-id='" + invalid[i] + "']");
                task.appendChild(svgElement);
            }
        }

        function getLane(doc, taskdi){
            var nsResolver = doc.createNSResolver( doc.ownerDocument == null ? doc.documentElement : doc.ownerDocument.documentElement );
            return doc.evaluate("//bpmn:lane[./bpmn:flowNodeRef[text()='"+taskdi+"']]", doc, nsResolver, XPathResult.ANY_TYPE, null).iterateNext()
        }

        function getLaneNamePreset(doc){
            var result = {};
            var nsResolver = doc.createNSResolver( doc.ownerDocument == null ? doc.documentElement : doc.ownerDocument.documentElement );
            var lanes = doc.evaluate("//bpmn:lane", doc, nsResolver, XPathResult.ANY_TYPE, null);
            for(var lane = lanes.iterateNext(); lane; lane = lanes.iterateNext()){
                if(lane.getAttribute("name")){
                    result[lane.id] = true;
                }else{
                    result[lane.id] = false;
                }
            }
            return result;
        }

        function getNewBpmnModel() {
            var parser = new DOMParser();
            var doc = parser.parseFromString($scope.abstractProcess.xml,"text/xml");

            var laneNamePreset = getLaneNamePreset(doc);

            if ($scope.abstractProcess && $scope.abstractProcess.abstract_tasks) {
                for (var i = 0; i < $scope.abstractProcess.abstract_tasks.length; i++) {
                    var abstractTask = $scope.abstractProcess.abstract_tasks[i];
                    var device = abstractTask.selected;
                    if (device.name) {
                        for (var j = 0; j < abstractTask.tasks.length; j++) {
                            var task = abstractTask.tasks[j];
                            var lane = getLane(doc, task.id);
                            if(lane && !laneNamePreset[lane.id]){
                                lane.setAttribute("name", device.name);
                                doc.getElementById(task.id).setAttribute("name", task.label);
                            }else{
                                doc.getElementById(task.id).setAttribute("name", device.name + " " + task.label);
                            }
                        }
                    }
                }
            }

            if ($scope.abstractProcess && $scope.abstractProcess.receive_tasks) {
                for (var i = 0; i < $scope.abstractProcess.receive_tasks.length; i++) {
                    var receiveTask = $scope.abstractProcess.receive_tasks[i];
                    if (receiveTask._label) {
                        doc.getElementById(receiveTask.shape_id).setAttribute("name", receiveTask._label);
                    }
                }
            }

            if ($scope.abstractProcess && $scope.abstractProcess.msg_events) {
                for (var i = 0; i < $scope.abstractProcess.msg_events.length; i++) {
                    var event = $scope.abstractProcess.msg_events[i];
                    if(event._label){
                        doc.getElementById(event.shape_id).setAttribute("name", event._label);
                    }
                }
            }

            if ($scope.abstractProcess && $scope.abstractProcess.time_events) {
                for (var i = 0; i < $scope.abstractProcess.time_events.length; i++) {
                    var event = $scope.abstractProcess.time_events[i];
                    if(event.label){
                        doc.getElementById(event.shape_id).setAttribute("name", event.label);
                    }
                }
            }

            var oSerializer = new XMLSerializer();
            return oSerializer.serializeToString(doc);
        }

        $scope.updateDiagram = function () {
            if(!$scope.viewer){
                $scope.viewer = SeplModeler.viewer({ container: '#svg-diagram' });
            }
            var bpmn = getNewBpmnModel();
            $scope.viewer.importXML(bpmn, function(err) {
                if (err) {
                    console.log("error on diagram update: ", err)
                } else {
                    addInfoToSvg();
                    var canvas = $scope.viewer.get('canvas');
                    canvas.resized();
                    canvas.zoom('fit-viewport', 'auto');
                }
            });
        };

        $scope.onResize = function(){
            if($scope.viewer){
                var canvas = $scope.viewer.get('canvas');
                canvas.resized();
                canvas.zoom('fit-viewport', 'auto');
            }
        };

        function isValidMsgEvent(event){
            return event.filter.device_id && event.filter.service_id && event.filter.scope && rulesAreValid(event.filter.rules)
        }

        function isValidTimeEvent(event){
            return event.kind && event.kind != "" && event.time && event.time != ""
        }

        function rulesAreValid(rules){
            if(!rules){
                return true;
            }
            for(var i=0; i<rules.length; i++){
                if(!(rules[i].path && rules[i].scope && rules[i].operator && rules[i].value)){
                    return false
                }
            }
            return true;
        }

        function getInvalidTasks() {
            var result = [];
            for (var i = 0; i < $scope.displayElements.length; i++) {
                if ($scope.displayElements[i].time_event) {
                    if (!isValidTimeEvent($scope.displayElements[i].time_event)) {
                        result = result.concat($scope.displayElements[i].select);
                    }
                } else if ($scope.displayElements[i].msg_event) {
                    if (!isValidMsgEvent($scope.displayElements[i].msg_event)) {
                        result = result.concat($scope.displayElements[i].select);
                    }
                } else if ($scope.displayElements[i].receive_task) {
                    if (!isValidMsgEvent($scope.displayElements[i].receive_task)) {
                        result = result.concat($scope.displayElements[i].select);
                    }
                } else if ($scope.displayElements[i].abstract_task) {
                    if (!($scope.displayElements[i].abstract_task.selected && $scope.displayElements[i].abstract_task.selected.id)) {
                        result = result.concat($scope.displayElements[i].select);
                    }
                } else if ($scope.displayElements[i].abstract_data_export_task) {
                    if (!($scope.displayElements[i].abstract_data_export_task.measurement && $scope.displayElements[i].abstract_data_export_task.measurementField)) {
                        result = result.concat($scope.displayElements[i].select);
                    }
                } else if ($scope.displayElements[i].task) {
                    for (var j = 0; j < $scope.displayElements[i].task.parameter.length; j++) {
                        if ($scope.displayElements[i].task.parameter[j].value === "") {
                            result = result.concat($scope.displayElements[i].select);
                        }
                    }
                }
            }
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }

            var result = result.filter(onlyUnique);
            return result;
        }

        $scope.getInputType = function (values, parameterPath) {
            var type = typeof jsonPath(values, parameterPath)[0];
            if (type == "string") {
                type = "text";
            }
            return type;
        };

        $scope.validate = function () {
            return $scope.abstractProcess && $scope.abstractProcess.name && $scope.abstractProcess.name.trim() != "" && getInvalidTasks().length == 0;
        };


        $scope.cancel = function () {
            if($stateParams.processid){
                $state.go('processes.repository');
            }
            if($stateParams.deploymentid){
                $state.go('processes.deployments');
            }
        };


        $scope.ok = function () {
            var bpmn = getNewBpmnModel();
            $scope.viewer.importXML(bpmn, function(err) {
                if (err) {
                    console.log("error on diagram update: ", err)
                } else {
                    $scope.viewer.saveSVG(function(err, svg) {
                        if(err){
                            console.log("error on creating svg: ", err)
                        }else{
                            deployService.instantiateProcess($scope.abstractProcess, svg).then(function(response){
                                $state.go('processes.deployments');
                            });
                        }
                    });
                }
            });
        };

        $scope.next = function () {
            $scope.currentIndex++;
            $scope.updateDiagram();
        };

        $scope.prev = function () {
            $scope.currentIndex--;
            $scope.updateDiagram();
        };

        $scope.hasNext = function () {
            return $scope.currentIndex < $scope.displayElements.length - 1;
        };

        $scope.hasPrev = function () {
            return $scope.currentIndex > 0;
        };

        $scope.$watch('currentIndex', $scope.updateIndex);
    }


    angular
        .module('app.processes.deploy')
        .component('seplProcessDeploy', {
            templateUrl: 'modules/processes/deploy/deploy.html',
            controller: DeployController
        });
})();