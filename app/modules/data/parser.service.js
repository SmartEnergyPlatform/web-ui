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
        .module('app.data')
        .factory('analyticsParserService', analyticsParserService);

    /* @ngInject */
    function analyticsParserService($http, ANALYTICS_PARSER_URL) {
        var baseUrl= ANALYTICS_PARSER_URL;
        return {
            getInputs: getInputs
        };

        function getInputs(id) {
            var url = baseUrl + "/pipe/getinputs/"+id;
            return $http({
                method: "GET",
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getInputs.' + error.data);
                console.log(error.data);
            }
        }
    }
})();