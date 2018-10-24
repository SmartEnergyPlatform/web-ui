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


    angular.module('app.iotrepository.devicetypes').component('seplIotrepoDevicetypeList', {
        templateUrl: "modules/iotrepository/devicetypes/list.html",
        controller: function ($http, IOT_REPO_URL, $stateParams, $state, $mdDialog, $scope, deviceInstancesService, deviceTypesService, $timeout) {
            var that = this;
            that.searchText = '';
            that.requestComplete = false;
            that.initialLoading = true;
            that.scrollDisabled = false;
            that.steps = 24;
            that.limit = that.steps;
            that.offset = 0;
            that.sortAttributes = [{
                label: "SORT.BY_NAME",
                value: "name",
                order: "asc"
            }];
            that.sortItem = that.sortAttributes[0];
            that.ready = false;
            that.initialize = true;
            that.deviceTypes = [];
            var searchPromise;

            that.getDeviceTypes = getDeviceTypes;
            that.loadDetail = loadDetail;
            that.showDetail = showDetail;
            that.next = next;
            that.showEditDialog = showEditDialog;
            that.init = init;
            that.disableScroll = disableScroll;

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
                        that.getDeviceTypes();
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
                            that.getDeviceTypes();
                        }, 500);
                    }
                }
            );

            that.$onInit = function () {
                that.ready = true;
                that.getDeviceTypes();
            };


            function getDeviceTypes(current) {
                if (!that.ready) {
                    return
                }

                if (!current) {
                    current = [];
                }

                that.requestComplete = false;

                if (that.searchText) {
                    deviceTypesService.getDeviceTypesSearch(that.searchText, that.limit, that.offset, that.sortItem.value, that.sortItem.order).then(function (response) {
                        that.disableScroll(response);
                        if (response != null) {
                            current = current.concat(response);
                            that.deviceTypes = current;
                        }
                        that.requestComplete = true;
                    });
                } else {
                    deviceTypesService.getDeviceTypes(that.limit, that.offset, that.sortItem.value, that.sortItem.order).then(function (response) {
                        that.disableScroll(response);
                        if (response != null) {
                            current = current.concat(response);
                            that.deviceTypes = current;
                        }
                        that.requestComplete = true;
                    });
                }
            };

            function loadDetail(devicetype, callback) {
                if (devicetype.intern && devicetype.intern.detailIsLoaded) {
                    callback(devicetype);
                } else {
                    $http.get(IOT_REPO_URL + "/deviceType/" + encodeURIComponent(devicetype.id)).then(function (response) {
                        var newDeviceType = response.data;
                        newDeviceType.intern = {};
                        newDeviceType.intern.detailIsLoaded = true;

                        var index = that.deviceTypes.indexOf(devicetype);
                        that.deviceTypes[index] = newDeviceType;

                        callback(newDeviceType);
                    });
                }
            };

            function showDetail(devicetype) {
                that.loadDetail(devicetype, function (detail) {
                    var scope = $scope.$new();
                    scope.devicetype = detail;
                    $mdDialog.show({
                        templateUrl: 'modules/iotrepository/devicetypes/detail.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        scope: scope,
                        preserveScope: true,
                        autoWrap: false,
                        fullscreen: true,
                        controller: function ($scope, $mdDialog) {
                            $scope.cancel = function () {
                                $mdDialog.cancel();
                            };

                            $scope.ok = function () {
                                $mdDialog.hide(true);
                            };

                        }
                    })
                })
            };

            function next() {
                if (that.requestComplete) {
                    that.initialLoading = false;
                    that.offset = that.limit + that.offset;
                    that.getDeviceTypes(that.deviceTypes);
                }
            };

            function showEditDialog(id, ev) {
                return deviceInstancesService.showEditDialog(id, ev, $scope.customFullscreen);
            };

            function init() {
                that.initialLoading = true;
                that.requestComplete = false;
                that.scrollDisabled = false;
                that.limit = that.steps;
                that.offset = 0;
                that.deviceTypes = [];
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
        }
    });

})
();


