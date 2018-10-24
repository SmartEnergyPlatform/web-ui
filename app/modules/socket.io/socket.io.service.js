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
    "use strict";

    angular
        .module("app.socket.io")
        .factory("SocketIoService", SocketIoService);

    /* @ngInject */
    function SocketIoService(io, $log, $rootScope, KAFKA_WEBSOCKET_URL, authorizationService) {
        var url = KAFKA_WEBSOCKET_URL;
        var service = {
            on: on,
            emit: emit,
            isAuthenticated: isAuthenticated,
            authenticate: authenticate,
            logout: logout
        };

        var authenticated = false;
        var authenticationInProgress = false;
        const socket = io(
            url+"?token="+authorizationService.getAccessToken(), {
                secure: true,
                transportOptions: {
                    polling: {
                        extraHeaders: {
                            Authorization: "Bearer " + authorizationService.getAccessToken()
                        }
                    }
                }
            });
        //var socket = io(url);

        on("connection", function () {
            $log.info("Connection");
        });

        on("reconnect", function () {
            $log.info("reconnect");
            $rootScope.$broadcast("SOCKET_IO_RECONNECTED");
        });

        //Register Authentication Listener
        on("authentication", function (data) {
            $log.info("auth");
            authenticationInProgress = false;
            authenticated = data.successful === true;
            if (authenticated) {
                $log.info("Successfully authenticated to socket.io.");
            }
            else {
                $log.error("Authenticated with socket.io failed.");
            }

        });

        return service;

        ////////////////

        function on(eventName, callback) {
            socket.on(eventName, callback);
        }

        function emit(eventName, data) {
            socket.emit(eventName, data);
        }

        function authenticate(token) {
            if (!authenticationInProgress) {
                authenticationInProgress = true;
                emit("authenticate", {token: token});
            }
        }

        function isAuthenticated() {
            return authenticated;
        }

        function logout() {
            authenticated = false;
            emit("logout");
        }

    }

})();

