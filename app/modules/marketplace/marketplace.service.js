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
        .module('app.marketplace')
        .factory('marketplaceUserRatingService', marketplaceUserRatingService);

    /* @ngInject */

    function marketplaceUserRatingService($http, MARKETPLACE_USER_RATING_URL, PROCESS_RATINGS_URL) {
        var service = {
            getProcessRatings: getProcessRatings,
            getUserProcessRating: getUserProcessRating,
            setRating: setRating,
            findProcessRating: findProcessRating
        };

        return service;

        function findProcessRating(searchtext, limit, offset, sortBy, sortDirection){
            var endpoint = "";
            if (searchtext) {
                endpoint = PROCESS_RATINGS_URL+"/search/processrating/"+encodeURIComponent(searchtext)+"/endpoint/"+limit+"/"+offset+"/"+sortBy+"/"+sortDirection;
            }else{
                endpoint = PROCESS_RATINGS_URL+"/get/processrating/endpoint/"+limit+"/"+offset+"/"+sortBy+"/"+sortDirection;
            }
            return $http({
                method: "GET",
                url: endpoint
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for get.' + error.data);
            }
        }

        function getProcessRatings() {
            return $http({
                method: "GET",
                url: MARKETPLACE_USER_RATING_URL + "/process"
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for get.' + error.data);
            }
        }

        function getUserProcessRating(id) {
            return $http({
                method: "GET",
                url: MARKETPLACE_USER_RATING_URL + "/process/" + id
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for get.' + error.data);
            }
        }

        function setRating(itemId, objectType, starsMarked) {

            var body = {};

            body.ObjectId = itemId;
            body.ObjectType = objectType;
            body.Stars = starsMarked;

            return $http({
                method: "PUT",
                url: MARKETPLACE_USER_RATING_URL + "/rating",
                data: body,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for put.' + error.data);
            }
        }

    }
})();