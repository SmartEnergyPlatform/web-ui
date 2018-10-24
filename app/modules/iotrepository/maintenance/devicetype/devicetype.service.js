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
        .module('app.iotrepository.maintenance.devicetype')
        .factory('deviceTypeMaintenance', deviceTypeMaintenance);

    /* @ngInject */
    function deviceTypeMaintenance($http, IOT_REPO_URL) {
        var service = {
            getDeviceTypesToRename: getDeviceTypesToRename,
            registerNotification: registerNotification
        };

        function getDeviceTypesToRename(limit, offset, feature, order){
            return $http({
                method: "GET",
                url: IOT_REPO_URL + "/maintenance/deviceTypes/rename/" + limit + "/" + offset + "/" + feature + "/" + order
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getMaintenanceDeviceType.' + error.data);
            }

        }

        function needsMaintenance(maintenance){
            return $http({
                method: "GET",
                url: IOT_REPO_URL + "/maintenance/check/deviceTypes/" + maintenance
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getMaintenanceDeviceType.' + error.data);
            }
        }

        function needsRenaming() {
            return needsMaintenance("rename")
        }

        function registerNotification(notifications){
            needsRenaming().then(function(needed){
                if(needed){
                    notifications.push({msg: "generated DeviceType expects renaming", state:"iotrepository.maintenance.renaming", params: null});
                }
            })
        }

        return service;
    }
})();