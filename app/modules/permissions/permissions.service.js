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
        .module('app.permissions')
        .factory('permissionsService', permissionsService);

    /* @ngInject */
    function permissionsService($http, PERM_SEARCH_URL, PERM_COMMAND_URL, $mdDialog, $q) {
        var service = {
            getAdministratablePermissions: getAdministratablePermissions,
            searchAdministratablePermissions: searchAdministratablePermissions,
            getResourcePermissions:getResourcePermissions,
            removeUserRight: removeUserRight,
            removeGroupRight:removeGroupRight,
            setUserRight: setUserRight,
            setGroupRight:setGroupRight,
            dialog: dialog,
            saveChanges: saveChanges,
            list: list,
            search: search,
            checkRight: checkRight,
            getProcessModels: getProcessModels,
            getProcessModelsWithConditions: getProcessModelsWithConditions,
        };

        return service;

        function rightObjToStr(right){
            var result = "";
            if(right.read){
                result += "r"
            }
            if(right.write){
                result += "w"
            }
            if(right.execute){
                result += "x"
            }
            if(right.administrate){
                result += "a"
            }
            return result
        }

        function checkRight(kind, resource, right){
            return $http({
                method: "GET",
                url: PERM_SEARCH_URL + "/jwt/check/"+encodeURIComponent(kind)+"/"+encodeURIComponent(resource)+"/"+right+"/bool"
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for setUserRight.' + error.data);
            }
        }

        function list(kind, right){
            return $http.get(PERM_SEARCH_URL+"/jwt/list/"+kind+"/"+right)
        }

        function getProcessModels(query, limit, offset, feature, order){
            if(query){
                return $http({
                    method: "GET",
                    url: PERM_SEARCH_URL + "/jwt/search/processmodel/" + encodeURIComponent(query) + "/r/" + limit + "/" + offset + "/" + feature + "/" + order
                }).then(success).catch(failure);
            }else{
                return $http({
                    method: "GET",
                    url: PERM_SEARCH_URL + "/jwt/list/processmodel/r/" + limit + "/" + offset + "/" + feature + "/" + order
                }).then(success).catch(failure);
            }

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getProcessModels.' + error.data);
            }
        }

        function getProcessModelsWithConditions(query, limit, offset, feature, order, conditions){
            if(query){
                return $http({
                    method: "POST",
                    data: conditions,
                    url: PERM_SEARCH_URL + "/jwt/search/processmodel/" + encodeURIComponent(query) + "/r/" + limit + "/" + offset + "/" + feature + "/" + order
                }).then(success).catch(failure);
            }else{
                return $http({
                    method: "POST",
                    data: conditions,
                    url: PERM_SEARCH_URL + "/jwt/list/processmodel/r/" + limit + "/" + offset + "/" + feature + "/" + order
                }).then(success).catch(failure);
            }

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getProcessModels.' + error.data);
            }
        }

        /*
            Examples:
             search("processmodel", "wordToSearch", "r", 100, 0).run().then(function(r){console.log(r.data)})
             search("processmodel", "wordToSearch", "r", 100, 0).orderBy("name").run().then(function(r){console.log(r.data)})
             search("processmodel", "wordToSearch", "r", 100, 0).orderBy("name").asc.run().then(function(r){console.log(r.data)})
        */
        function search(kind, query, right, limit, offset){
            return {
                run: function(){
                    return $http.get(PERM_SEARCH_URL+"/jwt/search/"+encodeURIComponent(kind)+"/"+encodeURIComponent(query)+"/"+encodeURIComponent(right)+"/"+limit+"/"+offset)
                },
                orderBy: function(feature){
                    return {
                        run: function(){
                            return $http.get(PERM_SEARCH_URL+"/jwt/search/"+encodeURIComponent(kind)+"/"+encodeURIComponent(query)+"/"+encodeURIComponent(right)+"/"+limit+"/"+offset+"/"+encodeURIComponent(feature))
                        },
                        asc: {
                            run: function () {
                                return $http.get(PERM_SEARCH_URL + "/jwt/search/" + encodeURIComponent(kind) + "/" + encodeURIComponent(query) + "/" + encodeURIComponent(right) + "/" + limit + "/" + offset + "/" + encodeURIComponent(feature) + "/asc")
                            }
                        },
                        desc:{
                            run: function(){
                                return $http.get(PERM_SEARCH_URL+"/jwt/search/"+encodeURIComponent(kind)+"/"+encodeURIComponent(query)+"/"+encodeURIComponent(right)+"/"+limit+"/"+offset+"/"+encodeURIComponent(feature)+"/desc")
                            }
                        }
                    };
                }
            };
        }

        function setUserRight(kind, user, resourceid, right){
            return $http({
                method: "PUT",
                url: PERM_COMMAND_URL + "/user/"+encodeURIComponent(user)+"/"+encodeURIComponent(kind)+"/"+encodeURIComponent(resourceid)+"/"+rightObjToStr(right)
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for setUserRight.' + error.data);
            }
        }

        function setGroupRight(kind, group, resourceid, right){
            return $http({
                method: "PUT",
                url: PERM_COMMAND_URL + "/group/"+encodeURIComponent(group)+"/"+encodeURIComponent(kind)+"/"+encodeURIComponent(resourceid)+"/"+rightObjToStr(right)
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for setGroupRight.' + error.data);
            }
        }

        function removeUserRight(kind, user, resourceid){
            return $http({
                method: "DELETE",
                url: PERM_COMMAND_URL + "/user/"+encodeURIComponent(user)+"/"+encodeURIComponent(kind)+"/"+encodeURIComponent(resourceid)
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for removeUserRight.' + error.data);
            }
        }

        function removeGroupRight(kind, group, resourceid){
            return $http({
                method: "DELETE",
                url: PERM_COMMAND_URL + "/group/"+encodeURIComponent(group)+"/"+encodeURIComponent(kind)+"/"+encodeURIComponent(resourceid)
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for removeGroupRight.' + error.data);
            }
        }

        function getAdministratablePermissions(kind) {
            return $http({
                method: "GET",
                url: PERM_SEARCH_URL + "/administrate/rights/" + kind
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getAdministratablePermissions.' + error.data);
            }
        }

        function searchAdministratablePermissions(kind, query, limit, offset) {
            return $http({
                method: "GET",
                url: PERM_SEARCH_URL + "/administrate/rights/" + kind + "/query/"+query+"/"+limit+"/"+offset
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getAdministratablePermissions.' + error.data);
            }
        }

        function getResourcePermissions(kind, id) {
            return $http({
                method: "GET",
                url: PERM_SEARCH_URL + "/administrate/rights/" + encodeURIComponent(kind) + "/get/"+encodeURIComponent(id)
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for getAdministratablePermissions.' + error.data);
            }
        }

        function saveChanges(kind, resourceRights){
            var result = $q.defer();
            var promises = [];
            for(var user in resourceRights.user_rights){
                var rights = resourceRights.user_rights[user];
                if(rights.remove && !rights.new){
                    promises.push(removeUserRight(kind, user, resourceRights.resource_id));
                }
                if(!rights.remove && (rights.changed || rights.new)){
                    promises.push(setUserRight(kind, user, resourceRights.resource_id, rights));
                }
            }
            $q.all(promises).then(function(all){
                result.resolve(all.every(function(element){return element}))
            });
            return result.promise
        }

        function dialog(kind, id) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'modules/permissions/dialog.html',
                clickOutsideToClose:true,
                fullscreen: true,
                locals: {kind: kind, resource: id}
            }).then(function(err) {
                if(err){
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Error')
                            .textContent(err)
                            .ariaLabel('Error')
                            .ok('OK')
                    );
                }
            }, function(){});
        }
    }

    function DialogController($translatePartialLoader, $scope, $mdDialog, permissionsService, kind, resource){
        $translatePartialLoader.addPart('permission');
        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.save = function() {
            permissionsService.saveChanges(kind, $scope.resourcePermissions).then(function(result){
                if(!result){
                    console.log("error while saving permission changes");
                    $mdDialog.hide("error while saving permission changes");
                }else{
                    $mdDialog.hide(null);
                }
            });
        };

        var that = this;
        that.$onInit = function(){
            permissionsService.getResourcePermissions(kind, resource).then(function(rights){
                $scope.kind = kind;
                $scope.resourcePermissions = rights;
            });
        };
    }
})();