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
        .module('app.data.operatorrepo')
        .factory('analyticsOperatorRepositoryService', analyticsOperatorRepositoryService);

    /* @ngInject */
    function analyticsOperatorRepositoryService($http, ANALYTICS_OPERATOR_REPO_URL) {
        var baseUrl= ANALYTICS_OPERATOR_REPO_URL;
        return {
            save: save,
            getAll: getAll,
            del: del,
            get: get
        };

        function save(operator) {
            var method = "PUT"
            var url = baseUrl + "/operator/";
            if (operator.id !== null){
                method = "POST";
                url = baseUrl + "/operator/"+operator.id+"/";
            }
            return $http({
                method: method,
                url: url,
                data: {
                    "name":operator.name,
                    "image": operator.image,
                    "description": operator.description,
                    "pub": operator.pub,
                    "inputs": operator.inputs,
                    "outputs": operator.outputs
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for save.' + error.data);
            }
        }

        function get(id){
            return $http({
                method: "GET",
                url: baseUrl + "/operator/"+id+"/"
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for get.' + error.data);
            }
        }

        function del(id){
            return $http({
                method: "DELETE",
                url: baseUrl + "/operator/"+id+"/"
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for del.' + error.data);
            }
        }

        function getAll(search, limit, offset, sort) {
            search = search || null;
            limit = limit || null;
            offset = offset || null;
            sort = sort || null;
            var args = [];
            var query = baseUrl + "/operator";
            if (search != null){
                args.push("search="+search);
            }
            if (limit != null){
                args.push("limit="+limit);
            }
            if (offset != null){
                args.push("offset="+offset);
            }
            if (sort != null){
                args.push("sort="+sort);
            }
            for (var i = 0; i < args.length; i++){
                if (i !== 0) {
                    query += "&"+args[i];
                } else {
                    query += "?"+args[i];
                }
            }
            return $http({
                method: "GET",
                url: query
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getAll.' + error.data);
            }
        }
    }
})();