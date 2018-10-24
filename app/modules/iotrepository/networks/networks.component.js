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


    angular.module('app.iotrepository.networks').component('seplIotrepoNetworksList', {
        templateUrl: "modules/iotrepository/networks/list.html",
        controller: function ($timeout, $stateParams, $state, networksService, $scope, $mdDialog, $q, $translate) {
            var that = this;
            that.searchText = '';
            that.requestComplete = false;
            that.initialLoading = true;
            that.scrollDisabled = false;
            that.steps = 24;
            that.limit = that.steps;
            that.offset = 0;
            that.networks = [];

            that.sortAttributes = [{
                label: "SORT.BY_NAME",
                value: "name",
                order: "asc"
            }];
            that.sortItem = that.sortAttributes[0];
            that.ready = false;
            that.initialize = true;
            var searchPromise;

            that.disableScroll = disableScroll;
            that.getNetworks = getNetworks;
            that.next = next;
            that.remove = remove;
            that.clear = clear;
            that.edit = edit;
            that.show = show;
            that.init = init;

            // watchers
            $scope.$watchCollection(function (scope) {
                    return (that.sortItem);
                }, function (sortItem) {
                    if (that.initialize) {
                        $timeout(function () {
                            that.initialize = false;
                        });
                    } else if (sortItem !== null && sortItem !== undefined) {
                        that.init();
                        that.getNetworks();
                    }
                }
            );

            $scope.$watchCollection(function (scope) {
                    return (that.searchText);
                }, function (searchText) {
                if (that.initialize) {
                    $timeout(function () {
                        that.initialize = false;
                    });
                } else if (searchText !== undefined) {
                    $timeout.cancel(searchPromise);
                    searchPromise = $timeout(function () {
                        that.init();
                        that.getNetworks();
                    }, 500);
                    }
                }
            );

            that.$onInit = function () {
                that.ready = true;
                that.getNetworks();
            };

            function init(){
                that.initialLoading = true;
                that.requestComplete = false;
                that.scrollDisabled = false;
                that.limit = that.steps;
                that.offset = 0;
                that.networks = [];
            }

            function disableScroll(data) {
                if (Array.isArray(data)) {
                    if (data.length != that.limit) {
                        that.scrollDisabled = true;
                    }
                } else {
                    that.scrollDisabled = true;
                }
            };

            function getNetworks(current) {
                if (!that.ready) {
                    return
                }

                if (!current) {
                    current = [];
                }

                that.requestComplete = false;

                if (that.searchText) {
                    networksService.search(that.searchText, that.limit, that.offset, that.sortItem.value, that.sortItem.order).then(function (response) {
                        that.disableScroll(response);
                        if (response != null) {
                            current = current.concat(response);
                            that.networks = current;
                        }
                        that.requestComplete = true;
                    });
                } else {
                    networksService.list(that.limit, that.offset, that.sortItem.value, that.sortItem.order).then(function (response) {
                        that.disableScroll(response);
                        if (response != null) {
                            current = current.concat(response);
                            that.networks = current;
                        }
                        that.requestComplete = true;
                    });
                }
            };

            function next () {
                if (that.requestComplete) {
                    that.initialLoading = false;
                    that.offset = that.limit + that.offset;
                    that.getNetworks(that.networks);
                }
            };

            function remove (network) {

                var trans = [
                    "NETWORKS.REMOVE_NETWORK.SHOW_CONFIRM_DELETE_TITLE_DELETE_NETWORK",
                    "NETWORKS.REMOVE_NETWORK.SHOW_CONFIRM_DELETE_TEXT_CONTENT_REALLY",
                    "NETWORKS.REMOVE_NETWORK.SHOW_CONFIRM_DELETE_ARIA_LABEL_CONTENT",
                    "NETWORKS.REMOVE_NETWORK.SHOW_CONFIRM_DELETE_RESPONSE_OK",
                    "NETWORKS.REMOVE_NETWORK.SHOW_CONFIRM_DELETE_RESPONSE_CANCEL"
                ];

                $translate(trans).then(function (translations) {
                    var confirm = $mdDialog.confirm()
                        .title(translations["NETWORKS.REMOVE_NETWORK.SHOW_CONFIRM_DELETE_TITLE_DELETE_NETWORK"])
                        .textContent(translations["NETWORKS.REMOVE_NETWORK.SHOW_CONFIRM_DELETE_TEXT_CONTENT_REALLY"])
                        .ariaLabel(translations["NETWORKS.REMOVE_NETWORK.SHOW_CONFIRM_DELETE_ARIA_LABEL_CONTENT"])
                        .ok(translations["NETWORKS.REMOVE_NETWORK.SHOW_CONFIRM_DELETE_RESPONSE_OK"])
                        .cancel(translations["NETWORKS.REMOVE_NETWORK.SHOW_CONFIRM_DELETE_RESPONSE_CANCEL"]);
                    $mdDialog.show(confirm).then(function () {
                        networksService.remove(network.id).then(function () {
                            $state.reload();
                        })
                    }, function () {
                    });
                });
            };

            function clear(network) {

                var trans = [
                    "NETWORKS.CLEAR_NETWORK.SHOW_CONFIRM_CLEAR_TITLE_CLEAR_NETWORK",
                    "NETWORKS.CLEAR_NETWORK.SHOW_CONFIRM_CLEAR_TEXT_CONTENT_REALLY",
                    "NETWORKS.CLEAR_NETWORK.SHOW_CONFIRM_CLEAR_ARIA_LABEL_CONTENT",
                    "NETWORKS.CLEAR_NETWORK.SHOW_CONFIRM_CLEAR_RESPONSE_OK",
                    "NETWORKS.CLEAR_NETWORK.SHOW_CONFIRM_CLEAR_RESPONSE_CANCEL"
                ];

                $translate(trans).then(function (translations) {
                    var confirm = $mdDialog.confirm()
                        .title(translations["NETWORKS.CLEAR_NETWORK.SHOW_CONFIRM_CLEAR_TITLE_CLEAR_NETWORK"])
                        .textContent(translations["NETWORKS.CLEAR_NETWORK.SHOW_CONFIRM_CLEAR_TEXT_CONTENT_REALLY"])
                        .ariaLabel(translations["NETWORKS.CLEAR_NETWORK.SHOW_CONFIRM_CLEAR_ARIA_LABEL_CONTENT"])
                        .ok(translations["NETWORKS.CLEAR_NETWORK.SHOW_CONFIRM_CLEAR_RESPONSE_OK"])
                        .cancel(translations["NETWORKS.CLEAR_NETWORK.SHOW_CONFIRM_CLEAR_RESPONSE_CANCEL"]);

                    $mdDialog.show(confirm).then(function () {
                        networksService.clear(network.id).then(function () {
                            $state.reload();
                        })
                    }, function () {
                    });
                });
            };

            function edit(network) {
                networksService.edit(network);
            };

            function show(id) {
                var ids = [];
                var chip = [];
                (that.networks || []).forEach(function (element) {
                    if(element.id == id){
                        ids = element.devices;
                        chip = [element.name];
                    }
                });
                $state.go("iotrepository.deviceinstances", {
                    ids: ids,
                    chips: chip
                }, {reload: true});
            };
        }
    });

})
();


