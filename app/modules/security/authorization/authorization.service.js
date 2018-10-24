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
        .module('app.security.authorization')
        .factory('authorizationService', authorizationService);

    /* @ngInject */
    function authorizationService() {
        return {
            userHasRole: userHasRole,
            getTokenValue: getTokenValue,
            getAccessToken: getAccessToken,
            getToken: getToken
        };
    
        function getToken() {
            var token =  JSON.parse(sessionStorage.getItem('id_token'));
            if (token) {
                return token;
            }
            console.error("Could not fetch token.");
            return {};
        }
        function userHasRole(role) {
            var token = getToken();
            if (token.roles && token.roles.length > 1){
                return token.roles.indexOf(role) !== -1;
            }
            console.error("Could not fetch permission.");
            return false;
        }

        function getTokenValue(value) {
            var token = getToken();
            if (token[value]) {
                return token[value];
            }
            console.error("Could not fetch token value.");
            return "";
        }

        function getAccessToken(){
            var token =  sessionStorage.getItem('access_token');
            if (token) {
                return token;
            }
            console.error("Could not fetch access token.");
            return "";
        }

    }
})();
