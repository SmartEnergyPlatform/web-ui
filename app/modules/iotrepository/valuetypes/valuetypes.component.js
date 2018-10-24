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

    angular.module('app.iotrepository.valuetypes').component('seplIotrepoValuetypesList', {
        templateUrl: "modules/iotrepository/valuetypes/list.html",
        controller: function ($http, IOT_REPO_URL, $stateParams, $state, valuetypesService, $scope, $timeout) {
            var that = this;
            that.requestComplete = false;
            that.initialLoading = true;
            that.steps = 40;
            that.limit = that.steps;
            that.offset = 0;
            that.searchText = "";

            that.sortAttributes = [{
                label: "SORT.BY_NAME",
                value: "name",
                order: "asc",
            },{
                label: "SORT.BY_DESCRIPTION",
                value: "desc",
                order: "asc",
            }];
            that.sortItem = that.sortAttributes[0];
            that.ready = false;
            that.initialize = true;
            that.valuetypes = [];
            that.scrollDisabled = false;
            var searchPromise;
            that.next = next;
            that.getValueTypes = getValueTypes;
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
                        that.getValueTypes();
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
                        that.getValueTypes();
                    }, 500);
                    }
                }
            );

            that.$onInit = function () {
                that.ready = true;
                that.getValueTypes();
            };

            function getValueTypes(current) {
                if (!that.ready) {
                    return
                }

                if (!current) {
                    current = [];
                }

                that.requestComplete = false;

                if (that.searchText) {
                    valuetypesService.getValueTypeSearch(that.searchText, that.limit, that.offset, that.sortItem.value, that.sortItem.order).then(function (response) {
                        that.disableScroll(response);
                        if (response != undefined) {
                            current = current.concat(response);
                            that.valuetypes = current;
                        }
                        that.requestComplete = true;
                    });
                } else {
                    valuetypesService.getValueTypes(that.limit, that.offset, that.sortItem.value, that.sortItem.order).then(function (response) {
                        that.disableScroll(response);
                        if (response != undefined) {
                            current = current.concat(response);
                            that.valuetypes = current;
                        }
                        that.requestComplete = true;
                    });
                }
            };

            function next() {
                if (that.requestComplete) {
                    that.initialLoading = false;
                    that.offset = that.limit + that.offset;
                    that.getValueTypes(that.valuetypes);
                }
            };

            function init() {
                that.initialLoading = true;
                that.scrollDisabled = false;
                that.limit = that.steps;
                that.offset = 0;
                that.valuetypes = [];
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

    angular.module('app.iotrepository.valuetypes').component('seplIotrepoValuetypesEditor', {
        templateUrl: "modules/iotrepository/valuetypes/create.html",
        controller: function ($http, $stateParams, $state, IOT_REPO_URL, $scope, $mdDialog) {

            var errorHandler = function (response) {
                console.log(response.data);
                alert(response.data.message);
            };

            $scope.valuetype = {
                fields: [],
            };

            $http.get(IOT_REPO_URL + "/ui/deviceType/allowedvalues").then(function (response) {
                $scope.allowedValues = response.data;
            });

            $scope.isStructure = function (id) {
                if (!id) {
                    return false;
                }
                for (var i = 0; i < $scope.allowedValues.structures.length; i++) {
                    if ($scope.allowedValues.structures[i] == id) {
                        return true;
                    }
                }
                return false;
            };

            $scope.isCollection = function (id) {
                if (!id) {
                    return false;
                }
                for (var i = 0; i < $scope.allowedValues.collections.length; i++) {
                    if ($scope.allowedValues.collections[i] == id) {
                        return true;
                    }
                }
                return false;
            };

            $scope.isPrimitive = function (id) {
                if (!id) {
                    return false;
                }
                for (var i = 0; i < $scope.allowedValues.primitive.length; i++) {
                    if ($scope.allowedValues.primitive[i] == id) {
                        return true;
                    }
                }
                return false;
            };

            $scope.fieldAdd = function () {
                var field = {type: {}};
                dialog($scope, $mdDialog, field, $scope.valuetype.fields, "Field", "field.html")
            };

            $scope.fieldEdit = function (field) {
                dialog($scope, $mdDialog, field, $scope.valuetype.fields, "Field", "field.html")
            };


            $scope.save = function (target) {
                $http.post(IOT_REPO_URL + "/other/valueType", $scope.valuetype).then(function (response) {
                    $state.go(target, {query: $scope.valuetype.name}, {reload: true});
                }, errorHandler);
            };

            $scope.searchInfo = {
                searchText: "",
                searchResult: []
            };

            $scope.search = function (entity) {
                var pathEnding = "/" + entity + "/" + $scope.searchInfo.searchText + "/20/0";
                return $http.get(IOT_REPO_URL + "/ui/search" + pathEnding).then(function (response) {
                    $scope.searchInfo.searchResult = response.data;
                }, errorHandler);
            };

            $scope.clearSearch = function () {
                $scope.searchInfo.searchText = "";
                $scope.searchInfo.searchResult = [];
            };

            $scope.assign = function (toValue, fromValue) {
                for (var key in fromValue) {
                    if (fromValue.hasOwnProperty(key)) {
                        toValue[key] = fromValue[key];
                    }
                }
            };

        }
    });


    var dialog = function (scope, mdDialog, element, list, header, template, callback) {
        var elementClone = JSON.parse(JSON.stringify(element));
        var newScope = scope.$new();
        newScope.dialogElement = elementClone;
        newScope.dialogHeader = header;

        var newValue = list.indexOf(element) == -1;
        if (!callback) {
            callback = function (result, ok) {
                if (ok) {
                    if (newValue) { //add new element
                        list.push(result);
                    } else { //replace element
                        for (var key in result) {
                            if (result.hasOwnProperty(key)) {
                                element[key] = result[key];
                            }
                        }
                    }
                }
            }
        }
        newScope.openDialog = function () {
            newScope.$parent.childDialog = true;
            newScope.childDialog = false;
            mdDialog.show({
                controller: FieldDialogController,
                templateUrl: 'modules/iotrepository/valuetypes/' + template,
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                scope: newScope,
                preserveScope: true,
                autoWrap: false,
                fullscreen: true
            }).then(
                function (ok) {
                    callback(elementClone, ok);
                    if (newScope.$parent.openDialog && !newScope.childDialog) {
                        newScope.$parent.childDialog = false;
                        newScope.$parent.openDialog();
                    }
                }, function () {
                    if (newScope.$parent.openDialog && !newScope.childDialog) {
                        newScope.$parent.childDialog = false;
                        newScope.$parent.openDialog();
                    }
                }
            );
        };
        newScope.openDialog();
    };

    var FieldDialogController = function ($mdDialog, $scope) {
        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.ok = function () {
            $mdDialog.hide(true);
        };

    };
    FieldDialogController.$inject = ["$mdDialog", "$scope"];

})
();







