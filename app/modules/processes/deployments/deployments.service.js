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
        .module('app.processes.deployments')
        .factory('deploymentsService', deploymentsService);

    /* @ngInject */
    function deploymentsService($http, PROCESS_SERVICE_URL, $mdToast, PROCESS_DEPLOYMENT_URL) {
        var service = {
            getAll: getAll,
            getProcesses: getProcesses,
            getProcessesSearch: getProcessesSearch,
            get: get,
            remove: remove,
            getProcessDefinitionByDeploymentId: getProcessDefinitionByDeploymentId,
            getProcessDefinition: getProcessDefinition,
            getDiagram: getDiagram,
            getDiagramLink: getDiagramLink,
            startProcess: startProcess,
            getIncidentsCount: getIncidentsCount,
            getDependencies: getDependencies
        };

        return service;

        function getProcesses(limit, offset, feature, order) {
            //TODO: replace sessionStorage call with authorizationService call
            var userId = JSON.parse(sessionStorage.getItem('id_token')).sub;
            return $http({
                method: "GET",
                url: PROCESS_SERVICE_URL + "/deployment?sortBy=" + feature + "&sortOrder=" + order + "&maxResults="
                + limit + "&firstResult=" + offset
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getAll.' + error.data);
            }
        }

        function getProcessesSearch(limit, offset, feature, order, searchText) {
            //TODO: replace sessionStorage call with authorizationService call
            var userId = JSON.parse(sessionStorage.getItem('id_token')).sub;
            /** escape underscore */
            searchText = searchText.replace(/_/g,"\\_")
            var encodeSearchText = encodeURIComponent("%" + searchText + "%");
            return $http({
                method: "GET",
                url: PROCESS_SERVICE_URL + "/deployment?sortBy=" + feature + "&sortOrder=" + order + "&maxResults="
                + limit + "&firstResult=" + offset + "&nameLike=" + encodeSearchText
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getAll.' + error.data);
            }
        }


        function getAll() {
            //TODO: replace sessionStorage call with authorizationService call
            var userId = JSON.parse(sessionStorage.getItem('id_token')).sub;
            return $http({
                method: "GET",
                url: PROCESS_SERVICE_URL + "/deployment"
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getAll.' + error.data);
            }
        }

        function get(id) {
            return $http({
                method: "GET",
                url: PROCESS_SERVICE_URL + "/deployment/" + encodeURIComponent(id)
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for get.' + error.data);
            }
        }


        function remove(id) {
            return $http({
                method: "DELETE",
                url: PROCESS_DEPLOYMENT_URL + "/deployment/" + id
            }).then(success).catch(failure);

            function success(response) {
                $mdToast.show($mdToast.deleteDeployment());
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for delete.' + error.data);
                $mdToast.show($mdToast.deleteDeploymentError());
            }
        }

        function getProcessDefinitionByDeploymentId(deploymentId) {
            return $http({
                method: "GET",
                url: PROCESS_SERVICE_URL + "/deployment/" + encodeURIComponent(deploymentId) + "/definition"
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getProcessDefinitionByDeploymentId.' + error.data);
            }
        }

        function getProcessDefinition(processDefinitionId) {
            return $http({
                method: "GET",
                url: PROCESS_SERVICE_URL + "/process-definition/" + encodeURIComponent(processDefinitionId)
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getProcessDefinitionByDeploymentId.' + error.data);
            }
        }

        function getDiagram(processDefinitionId) {
            return $http({
                method: "GET",
                url: PROCESS_SERVICE_URL + "/process-definition/" + encodeURIComponent(processDefinitionId) + "/diagram"
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getProcessDefinitionByDeploymentId.' + error.data);
            }
        }

        function getDiagramLink(processDefinitionId) {
            return $http({
                method: "GET",
                url: PROCESS_SERVICE_URL + "/process-definition/" + encodeURIComponent(processDefinitionId) + "/diagram"
            }).then(success).catch(failure);

            function success(response) {
                return "data:image/svg+xml;base64," + window.btoa(response.data);
            }

            function failure(error) {
                console.log('XHR Failed for getProcessDefinitionByDeploymentId.' + error.data);
            }
        }

        function startProcess(processDefinitionId) {
            return $http({
                method: "GET",
                url: PROCESS_SERVICE_URL + "/process-definition/" + encodeURIComponent(processDefinitionId) + "/start"
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for startProcess.' + error.data);
            }
        }

        function buildPayLoad(data, boundary) {
            var segments = [];
            var deploymentSource = 'sepl-modeler';

            segments.push('Content-Disposition: form-data; name="data"; ' +
                'filename="' + data.filename + '"\r\nContent-Type: text/xml\r\n\r\n' + data.resource + '\r\n');

            segments.push('Content-Disposition: form-data; name="diagram"; ' +
                'filename="' + data.svgname + '"\r\nContent-Type: image/svg+xml\r\n\r\n' + data.svg + '\r\n');

            segments.push('Content-Disposition: form-data; name="deployment-name"\r\n\r\n' + data.name + ' \r\n');
            segments.push('Content-Disposition: form-data; name="deployment-source"\r\n\r\n' + deploymentSource + '\r\n');

            var sData = '--' + boundary + '\r\n' + segments.join('--' + boundary + '\r\n') + '--' + boundary + '--\r\n';

            return sData;
        }

        function getIncidentsCount(deployment) {
            return $http({
                method: "GET",
                url: PROCESS_SERVICE_URL + "/process-definition/" + encodeURIComponent(deployment.processDefintionId) + "/incident/count"
            }).then(success).catch(failure);

            function success(response) {
                return response.data.count;
            }

            function failure(error) {
                console.log('XHR Failed for getIncidentsCount.' + error.data);
            }
        }

        function getDependencies(deploymentId) {
            return $http.get(PROCESS_DEPLOYMENT_URL + "/deployment/" + deploymentId + "/dependencies").then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for get.' + error.data);
                return {online: false};
            }
        }
    }
})();