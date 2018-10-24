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
    function DashboardController(chartService, dashboardService, Chart, Dashboard, $q, $scope, $mdDialog, $timeout, $cookies, $interval, $filter, $translate) {
        var vm = this;
        vm.items = [];
        vm.tabs = [];
        vm.selectedIndex = 0;
        vm.currentView = {};

        vm.onDropComplete = onDropComplete;
        vm.getAllViews = getAllViews;
        vm.getCharts = getCharts;
        vm.newWidget = newWidget;
        vm.newView = newView;
        vm.deleteView = deleteView;
        vm.showNewViewDialog = showNewViewDialog;
        vm.showChangeViewDialog = showChangeViewDialog;
        vm.showConfirmDelete = showConfirmDelete;
        vm.openMenu = openMenu;
        vm.setRefresh = setRefresh;

        vm.getAllViews();

        getRefreshRate();

        $scope.$watch('$ctrl.selectedIndex', function () {
            if (vm.tabs.length) {
                vm.currentView = vm.tabs[vm.selectedIndex];

                vm.items = [];

                //prevent display issues during tab changes
                $timeout(function () {
                    vm.getCharts(vm.currentView);
                }, 100);
            }
        });

        function openMenu($mdMenu, ev) {
            $mdMenu.open(ev);
        }

        function setRefresh(seconds) {
            $cookies.put("refreshRate", seconds);
            vm.refresh = seconds;
        }

        function getRefreshRate() {
            if ($cookies.get("refreshRate") == null) {
                vm.refresh = 0;
            } else {
                vm.refresh = $cookies.get("refreshRate");
            }
        }

        vm.deleteIndex = function (deleteIndex, id) {
            if (deleteIndex !== null) {
                var promises = [];
                vm.items.forEach(function (obj) {
                    if (obj.index > deleteIndex) {
                        obj.index = obj.index - 1;
                        promises.push(chartService.update(obj._id, obj));
                    }
                });

                $q.all(promises).then(function () {
                    vm.tabs[vm.selectedIndex].widgets.splice(deleteIndex, 1);
                    vm.items.splice(deleteIndex, 1);
                    chartService.remove(id);
                });
            }
        };

        function deleteView() {
            dashboardService.removeView(vm.tabs[vm.selectedIndex]._id).then(function () {
                vm.tabs.splice(vm.selectedIndex, 1);
                vm.selectedIndex = vm.tabs.length;
            });
        }

        function newView(title) {
            var view = new Dashboard();
            var addHandler = function (dataResponse) {
                if (dataResponse !== null) {
                    vm.tabs.push(dataResponse);

                    //prevent display issues during tab changes
                    $timeout(function () {
                        vm.selectedIndex = vm.tabs.length;
                    }, 100);

                }
            };
            if (!title) {
                $translate("DASHBOARD.FUNCTION.CREATE_NEW_DASHBOARD_MODEL_DEFAULT_TO_CONTENT").then(function (translation) {
                    view.title = translation;
                    dashboardService.addView(view).then(addHandler);
                });
            } else {
                view.title = title;
                dashboardService.addView(view).then(addHandler);
            }
        }

        function newWidget() {
            var widget = new Chart();

            if (vm.items.length)
                widget.index = vm.items.length;
            else
                widget.index = 0;

            widget.view = vm.tabs[vm.selectedIndex]._id;

            chartService.add(widget).then(function (dataResponse) {
                if (dataResponse !== null) {
                    vm.items[dataResponse.index] = dataResponse;
                    vm.tabs[vm.selectedIndex].widgets.push(dataResponse);
                }
            })
        }

        function getAllViews() {
            dashboardService.getAllViews().then(function (dataResponse) {
                if (dataResponse) {
                    var views = dataResponse;
                    for (var i = 0; i < views.length; i++) {
                        var view = new Dashboard(
                            views[i]._id,
                            views[i].title,
                            views[i].widgets
                        );
                        vm.tabs.push(view);
                    }
                    vm.currentView = vm.tabs[0];
                    vm.getCharts(vm.currentView);
                }
                else
                    vm.newView();
            });
        }

        function getCharts(view) {
            if (view) {
                var charts = view.widgets;

                for (var i = 0; i < charts.length; i++) {
                    var chart = new Chart(
                        charts[i]._id,
                        charts[i].title,
                        charts[i].type,
                        charts[i].index,
                        charts[i].frame,
                        charts[i].source,
                        charts[i].device,
                        charts[i].view,
                        charts[i].x_field,
                        charts[i].x_name,
                        charts[i].y_field,
                        charts[i].y_name,
                        charts[i].cols,
                        charts[i].rows
                    );
                    vm.items[chart.index] = chart;
                }
            }
        }

        function onDropComplete(index, obj) {
            var otherObj = vm.items[index];

            if (otherObj !== obj && otherObj !== null && obj !== null && obj._id !== null && otherObj._id !== null) {
                var otherIndex = vm.items.indexOf(obj);

                vm.items[index] = obj;
                vm.items[otherIndex] = otherObj;

                vm.items[index].index = index;
                vm.items[otherIndex].index = otherIndex;

                chartService.update(obj._id, obj);
                chartService.update(otherObj._id, otherObj);
            }
        }

        function showNewViewDialog(ev, ctrl) {
            $mdDialog.show({
                locals: {
                    ctrl: ctrl
                },
                controller: NewViewController,
                controllerAs: 'ctrl',
                templateUrl: 'modules/apps/dashboard/new-view.html',
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: true
            });
        }

        function showChangeViewDialog(ev, ctrl) {
            $mdDialog.show({
                locals: {
                    ctrl: ctrl
                },
                controller: ChangeViewController,
                controllerAs: 'ctrl',
                templateUrl: 'modules/apps/dashboard/change-view.html',
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: true
            });
        }

        function NewViewController($mdDialog, ctrl) {
            var vm = this;
            vm.viewTitle = "";

            vm.cancel = cancel;
            vm.save = save;

            function save() {
                ctrl.newView(vm.viewTitle);
                cancel();
            }

            function cancel() {
                $mdDialog.cancel();
            }
        }

        function ChangeViewController($mdDialog, ctrl) {
            var vm = this;
            var view = ctrl.currentView;
            vm.viewTitle = view.title;

            vm.cancel = cancel;
            vm.save = save;

            function save() {
                view.title = vm.viewTitle;

                dashboardService.updateView(view);
                cancel();
            }

            function cancel() {
                $mdDialog.cancel();
            }
        }

        function showConfirmDelete(event) {

            var trans = [
                "DASHBOARD.FUNCTION.SHOW_CONFIRM_DELETE_TITLE_DELETE_VIEW",
                "DASHBOARD.FUNCTION.SHOW_CONFIRM_DELETE_TEXT_CONTENT_REALLY",
                "DASHBOARD.FUNCTION.SHOW_CONFIRM_DELETE_ARIA_LABEL_CONTENT",
                "DASHBOARD.FUNCTION.SHOW_CONFIRM_DELETE_RESPONSE_OK",
                "DASHBOARD.FUNCTION.SHOW_CONFIRM_DELETE_RESPONSE_CANCEL",
            ]

            $translate(trans).then(function (translations) {
                var confirm = $mdDialog.confirm()
                    .title(translations["DASHBOARD.FUNCTION.SHOW_CONFIRM_DELETE_TITLE_DELETE_VIEW"])
                    .textContent(translations["DASHBOARD.FUNCTION.SHOW_CONFIRM_DELETE_TEXT_CONTENT_REALLY"])
                    .ariaLabel(translations["DASHBOARD.FUNCTION.SHOW_CONFIRM_DELETE_ARIA_LABEL_CONTENT"])
                    .targetEvent(event)
                    .ok(translations["DASHBOARD.FUNCTION.SHOW_CONFIRM_DELETE_RESPONSE_OK"])
                    .cancel(translations["DASHBOARD.FUNCTION.SHOW_CONFIRM_DELETE_RESPONSE_CANCEL"]);
                $mdDialog.show(confirm).then(function () {
                    vm.deleteView();
                }, function () {
                    //TODO handle error
                });
            })
        }
    }

    angular
        .module('app.apps.dashboard')
        .component('seplAppsDashboard', {
            templateUrl: 'modules/apps/dashboard/dashboard.html',
            controller: DashboardController
        });
})
();