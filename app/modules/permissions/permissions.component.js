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
    function UserRightController($scope, authorizationService, userService) {
        var that = this;
        that.$onInit = function(){
            $scope.kind = that.kind;
            $scope.resourceid = that.resourceid;
            $scope.right = that.right;
            $scope.user = that.user;
            $scope.right.changed = false;
            $scope.right.remove = false;

            userService.get($scope.user).then(function(user){
                $scope.username = user.username;
            });

            $scope.fromUser = authorizationService.getTokenValue("sub") == $scope.user;
        };

        that.change = function(){
            $scope.right.changed = true;
        };

        that.remove = function(){
            $scope.right.remove = true;
        }
    }

    function AddRightController($scope, $q, userService) {
        var that = this;
        $scope.error = "";
        $scope.subject = "";

        that.add = function(){
            userService.byName($scope.subject).then(function(user){
                that.checkSubject(user && user.id).then(function(err){
                    if(err){
                        $scope.error = err;
                    }else{
                        that.addRight(user.id)
                    }
                })
            });
        };

        that.checkSubject = function(userid){
            console.log("check: ", userid);
            var result = $q.defer();
            var element = that.rights[userid];
            if(!userid){
                result.resolve("unknown subject");
            }else if(element && !element.remove){
                result.resolve("subject has already permission");
            }else{
                result.resolve(null);
            }
            return result.promise
        };

        that.addRight = function(userid){
            var element = that.rights[userid];
            if(element && !element.new){
                that.rights[userid] = {"read":false,"write":false,"execute":false,"administrate":false, "changed": true}
            }else{
                that.rights[userid] = {"read":false,"write":false,"execute":false,"administrate":false, "new": true}
            }
        }
    }


    angular
        .module('app.permissions')
        .component('seplPermissionsUserRight', {
            templateUrl: 'modules/permissions/userRight.html',
            controller: UserRightController,
            bindings: {
                kind: "=",
                resourceid: "=",
                right: "=",
                user: "="
            }
        });

    angular
        .module('app.permissions')
        .component('seplPermissionsAddRight', {
            templateUrl: 'modules/permissions/addRight.html',
            controller: AddRightController,
            bindings: {
                rights: "="
            }
        });

})();