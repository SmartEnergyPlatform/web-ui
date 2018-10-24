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
        .module('app.iotrepository.valuetypes')
        .factory('valuetypesService', valuetypesService);

    /* @ngInject */

    function valuetypesService($http, VALUETYPE_SEARCH_URL) {
        var service = {
            getValueTypes: getValueTypes,
            getValueTypeSearch: getValueTypeSearch,
        };

        return service;

        function getValueTypes(limit,offset, feature, order) {
            return $http({
                method: "GET",
                url: VALUETYPE_SEARCH_URL + "/get/valuetype/endpoint/" + limit + "/" + offset + "/" + feature + "/" + order
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for get.' + error.data);
            }
        }

        function getValueTypeSearch(searchText, limit, offset, feature, order) {
            return $http({
                method: "GET",
                url: VALUETYPE_SEARCH_URL + "/search/valuetype/" + searchText + "/endpoint/" + limit + "/" + offset + "/" + feature + "/" + order
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for get.' + error.data);
            }
        }

    }
})();