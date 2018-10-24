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

    angular
        .module('app.processes.monitor')
        .factory('monitorService', monitorService);

    /* @ngInject */
    function monitorService($http, PROCESS_SERVICE_URL, $mdDialog) {
        var service = {
            getAll: getAll,
            getAllHistoryInstances: getAllHistoryInstances,
            getAllFinishedHistoryInstances: getAllFinishedHistoryInstances,
            getAllUnfinishedHistoryInstances: getAllUnfinishedHistoryInstances,
            getCount: getCount,
            stopProcessInstance: stopProcessInstance,
            getHistoryInstances: getHistoryInstances,
            getFinishedHistoryInstances: getFinishedHistoryInstances,
            getUnfinishedHistoryInstances: getUnfinishedHistoryInstances,
            removeHistoryInstance: removeHistoryInstance,
            getAllHistoryVariables: getAllHistoryVariables,
            showDetailDialog: showDetailDialog,
            getIncidents: getIncidents
        };

        return service;

        function getAll() {
            return $http({
                method: "GET",
                url: PROCESS_SERVICE_URL + "/process-instance"
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getAll.' + error.data);
            }
        }

        function getAllHistoryInstances() {
            return $http({
                method: "GET",
                url: PROCESS_SERVICE_URL + "/history/process-instance"
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getHistoryInstances.' + error.data);
            }
        }

        function getAllFinishedHistoryInstances() {
            return $http({
                method: "GET",
                url: PROCESS_SERVICE_URL + "/history/finished/process-instance"
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getHistoryInstances.' + error.data);
            }
        }

        function getAllUnfinishedHistoryInstances() {
            return $http({
                method: "GET",
                url: PROCESS_SERVICE_URL + "/history/unfinished/process-instance"
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getHistoryInstances.' + error.data);
            }
        }

        function getCount() {
            return $http({
                method: "GET",
                url: PROCESS_SERVICE_URL + "/process-instance/count"
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getCount.' + error.data);
            }
        }

        function getHistoryInstances(processDefId) {
            if(processDefId){
                return $http({
                    method: "GET",
                    url: PROCESS_SERVICE_URL + "/history/process-definition/"+encodeURIComponent(processDefId)+"/process-instance",
                }).then(success).catch(failure);
            }else{
                return getAllHistoryInstances()
            }

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getHistoryInstances.' + error.data);
            }
        }

        function getFinishedHistoryInstances(processDefId) {
            if(processDefId){
                return $http({
                    method: "GET",
                    url: PROCESS_SERVICE_URL + "/history/process-definition/"+encodeURIComponent(processDefId)+"/process-instance/finished",
                }).then(success).catch(failure);
            }else{
                return getAllFinishedHistoryInstances()
            }

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getHistoryInstances.' + error.data);
            }
        }

        function getUnfinishedHistoryInstances(processDefId) {
            if(processDefId){
                return $http({
                    method: "GET",
                    url: PROCESS_SERVICE_URL + "/history/process-definition/"+encodeURIComponent(processDefId)+"/process-instance/unfinished",
                }).then(success).catch(failure);
            }else{
                return getAllUnfinishedHistoryInstances()
            }

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getHistoryInstances.' + error.data);
            }
        }

        function getAllHistoryVariables(processInstanceId) {
            return $http({
                method: "GET",
                url: PROCESS_SERVICE_URL + "/history/process-instance/"+encodeURIComponent(processInstanceId)+"/variable-instance"
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getAllHistoryVariables.' + error.data);
            }
        }

        function stopProcessInstance(processInstanceId) {
            return $http({
                method: "DELETE",
                url: PROCESS_SERVICE_URL + "/process-instance/" + encodeURIComponent(processInstanceId)
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for stopProcessInstance.' + error.data);
            }
        }

        function removeHistoryInstance(processInstanceId){
            return $http({
                method: "DELETE",
                url: PROCESS_SERVICE_URL + "/history/process-instance/" + encodeURIComponent(processInstanceId)
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for removeHistoryInstance.' + error.data);
            }
        }

        function showDetailDialog(item){
            $mdDialog.show({
                controller: function ($scope, $mdDialog, info) {
                    $scope.info = info;
                    $scope.ok = function() {
                        $mdDialog.hide();
                    };
                },
                templateUrl: 'modules/processes/monitor/detail_dialog.html',
                clickOutsideToClose:true,
                locals: {info: {item: item}}
            });
        }

        function getIncidents(processInstanceId){
            return $http({
                method: "GET",
                url: PROCESS_SERVICE_URL + "/process-instance/"+encodeURIComponent(processInstanceId)+"/incident"
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getIncidents.' + error.data);
            }
        }
    }
})();