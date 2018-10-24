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
    function AccountSettingsController($translate, KEYCLOAK_URL, $http,authorizationService, $translatePartialLoader, $q) {
        $translatePartialLoader.addPart('account');
        var accountUrl= KEYCLOAK_URL + "/realms/master/account";
        var sessionUrl= KEYCLOAK_URL + "/realms/master/account/sessions";
        var vm = this;
        vm.userProperties = authorizationService.getToken();
        vm.user;
        vm.language = $translate.use();
        vm.changeLanguage = changeLanguage;
        vm.save = save;
        vm.getSessions = getSessions;
        vm.updateProfile = updateProfile;
        vm.sessions = [];
        vm.row = null;
        createTableColumns();
        vm.keys = ['ipAddress', 'started', 'lastAccess', 'expires', 'clients'];

        loadSessionsInTable();

        function changeLanguage(langKey) {
            return $translate.use(langKey);
        }

        function createTableColumns() {

            var trans = [
                "ACCOUNT.FUNCTIONS.CREATE_TABLE_COLUMNS.IP",
                "ACCOUNT.FUNCTIONS.CREATE_TABLE_COLUMNS.STARTED",
                "ACCOUNT.FUNCTIONS.CREATE_TABLE_COLUMNS.LAST_ACCESS",
                "ACCOUNT.FUNCTIONS.CREATE_TABLE_COLUMNS.EXPIRES",
                "ACCOUNT.FUNCTIONS.CREATE_TABLE_COLUMNS.CLIENTS"
            ];

            $translate(trans).then(function (translations) {
                vm.tableColumns = translations;
            })
        }

        function save() {
            vm.changeLanguage(vm.language).then(function(){
                createTableColumns();
            });

        }

        function loadSessionsInTable() {
            vm.sessions = [];
            vm.getSessions().then(function (dataResponse) {
                if(dataResponse) {
                    for (var i = 0; i < dataResponse.length; i++) {
                        var clients = [];
                        for(var l = 0; l< dataResponse[i].clients.length; l++) {
                            clients.push(dataResponse[i].clients[l].clientId)
                        }
                        vm.repoItems.push({
                            ipAddress: dataResponse[i].ipAddress,
                            started: new Date(dataResponse[i].started),
                            lastAccess: new Date(dataResponse[i].lastAccess),
                            expires: new Date(dataResponse[i].expires),
                            clients: clients.toString()
                        });
                    }
                    vm.requestComplete = true;
                }
            })
        }

        function getSessions() {
            return $http({
                method: "GET",
                url: sessionUrl,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(success).catch(failure);

            function success(response) {
                console.log(response);
                return response;
            }

            function failure(error) {
                console.log('XHR Failed for getAll.' + error.data);
            }
        }

        function updateProfile() {
            var data = {
                "email": vm.user.email,
                "firstName": vm.user.firstName,
                "lastName": vm.user.lastName
            }
            return $http({
                method: "POST",
                url: accountUrl,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(success).catch(failure);

            function success(response) {
                console.log(response);
                return response;
            }

            function failure(error) {
                console.log('XHR Failed for getAll.' + error.data);
            }
        }

    }

    angular
        .module('app.account.settings')
        .component('seplAccountSettings', {
            templateUrl: 'modules/account/settings/settings.html',
            controller: AccountSettingsController
        });
})();