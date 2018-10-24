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

    angular.module('app');

    function initializeKeycloak() {
        var locale = "de";
        var keycloakConfig = {
            url: window.keycloak_url + "/auth",
            realm: 'master',
            clientId: 'frontend',
            redirectUri: window.location.href,
            locale: locale
        };
        var keycloak = Keycloak(keycloakConfig);
        keycloak.init({
            onLoad: 'check-sso'
        }).success(function (authenticated) {
            if (!authenticated) {
                var queryDict = {}
                location.search.substr(1).split("&").forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]})

                keycloak.login({
                    redirectUri: window.location.href.split("?")[0],
                    locale: queryDict["kc_locale"]
                })
            }
            keycloak.loadUserInfo().success(function (userInfo) {
                angular.module('app')
                    .run(function ($rootScope, $http, $interval, $translate) {
                        $rootScope.$on('$translatePartialLoaderStructureChanged', function () {
                            $translate.refresh();
                        });

                        var updateTokenInterval = $interval(function () {
                            // refresh token if it's valid for less then 15 minutes
                            keycloak.updateToken(900)
                                .success(function (refreshed) {
                                    if (refreshed) {
                                        sessionStorage.setItem('access_token', keycloak.token);
                                    }
                                }).error(function() {
                                    console.log('Failed to refresh the token, or the session has expired');
                                    sessionStorage.clear()
                                    location.reload()
                                });
                        }, 10000);

                        sessionStorage.setItem('access_token', keycloak.token)
                        sessionStorage.setItem('id_token', JSON.stringify(userInfo))

                        $http.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem("access_token");

                        $rootScope.userLogout = function () {
                            sessionStorage.clear();
                            $interval.cancel(updateTokenInterval);
                            keycloak.logout();
                        };
                    })
                    angular.bootstrap(document, ['app']);
                });
        })
    }

    if (window.loginRequired) {
        initializeKeycloak();
    } else {
        angular.module('app')
            .run(function ($rootScope, $http, $interval, $translate) {
                $rootScope.$on('$translatePartialLoaderStructureChanged', function () {
                    $translate.refresh();
                });
            });
        if(document.readyState === 'complete' ){
            angular.bootstrap(document, ['app']);
        }else{
            document.addEventListener("DOMContentLoaded", function () {
                angular.bootstrap(document, ['app']);
            });
        }
    }
})();