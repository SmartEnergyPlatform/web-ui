
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

    angular.module('app.iotrepository.protocol').component('seplIotrepoProtocolList', {
        templateUrl: "modules/iotrepository/protocol/list.html",
        controller: function($http, IOT_REPO_URL, $stateParams, $state) {
            var that = this;
            var stepps = 10;
            var limit = $stateParams.limit || stepps;
            var offset = $stateParams.offset || 0;
            that.query = $stateParams.query;
            

            var setprotocol = function(data){
                that.protocols = data;
                if(!that.protocols){
                    that.protocols = [];
                }
                if(that.protocols.length == parseInt(limit)){
                    that.nextButton = true;
                }
            };

            $http.get(IOT_REPO_URL+"/ui/search/others/protocols/"+that.query+"/"+limit+"/"+offset).then(function(response){
                setprotocol(response.data);
            });

            that.search = function(){
                $state.go('iotrepository.protocol.list', {limit: stepps, offset: 0,query: that.query}, { reload: true });
            };

            that.next = function(){
                $state.go('iotrepository.protocol.list', {limit: stepps, offset: parseInt(limit)+parseInt(offset), query: that.query}, { reload: true });
            };

            that.back = function(){
                var new_offset = parseInt(offset)-parseInt(limit);
                if(new_offset < 0){
                    new_offset = 0;
                }
                $state.go('iotrepository.protocol.list', {limit: stepps, offset: new_offset, query: that.query}, { reload: true });
            };

            if(parseInt(offset) > 0){
                that.backButton = true;
            }
        }
    });

    angular.module('app.iotrepository.protocol').component('seplIotrepoProtocolEditor', {
        templateUrl: "modules/iotrepository/protocol/edit.html",
        controller: function($http, $state, IOT_REPO_URL) {
            var that = this;

            var errorHandler = function(response){
                console.log(response.data);
                alert(response.data.message);
            };

            that.protocol = {
                msg_structure: []
            };

            that.createMsgSegment = function(name){
                return {name: name};
            };

            that.saveProtocol = function(){
                $http.post(IOT_REPO_URL+"/other/protocol", that.protocol).then(function(response){
                    that.protocol = response.data;
                    $state.go('iotrepository.protocol');
                }, errorHandler);
            };
        }
    });
})
();







