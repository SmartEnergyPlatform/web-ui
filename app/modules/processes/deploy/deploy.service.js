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
        .module('app.processes.deploy')
        .factory('deployService', deployService);

    /* @ngInject */
    function deployService($http, PROCESS_DEPLOYMENT_URL, $mdToast) {
        var service = {
            prepareAbstractProcess: prepareAbstractProcess,
            instantiateProcess: instantiateProcess,
            getCloneAbstract: getCloneAbstract
        };

        return service;


        function prepareAbstractProcess(diagram) {
            return $http.post(PROCESS_DEPLOYMENT_URL + "/process/prepare", diagram).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                $mdToast.show($mdToast.deployProcessError());
                console.log('XHR Failed for get.' + error.data);
            }
        }

        function getCloneAbstract(deploymentId) {
            return $http.get(PROCESS_DEPLOYMENT_URL + "/process/clone/"+encodeURIComponent(deploymentId)).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                $mdToast.show($mdToast.deployProcessError());
                console.log('XHR Failed for get.' + error.data);
            }
        }

        function instantiateProcess(abstractProcess, svg) {
            var msg = {process: abstractProcess, svg: svg};
            return $http.post(PROCESS_DEPLOYMENT_URL + "/process/deploy", msg).then(success).catch(failure);

            function success(response) {
                $mdToast.show($mdToast.deployProcess());
                return response.data;
            }

            function failure(error) {
                $mdToast.show($mdToast.deployProcessError());
                console.log('XHR Failed for get.' + error.data);
            }
        }

    }
})();