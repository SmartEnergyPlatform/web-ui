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
    function DataTableController($scope, $filter, moment) {
        var vm = this;
        vm.translation = {};
        vm.selectedRow = {};
        vm.reverseSort = false;
        vm.filteredItems = [];
        vm.displayedItems = [];
        vm.pageLimit = 0;
        vm.currentSortItem = "";

        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.data = vm.data;

        vm.setSortProperty = setSortProperty;
        vm.selectedRowCallback = selectedRowCallback;
        vm.deleteSelectedItems = deleteSelectedItems;
        vm.paginate = paginate;
        vm.setNextPage = setNextPage;
        vm.setLastPage = setLastPage;
        vm.setPage = setPage;
        vm.isCurrentPage = isCurrentPage;
        vm.getSortIcon = getSortIcon;
        vm.isActive = isActive;
        vm.isSelectedRow = isSelectedRow;
        vm.deleteRow = deleteRow;
        vm.isDate = isDate;


        function isDate(value) {
            var date = moment.tz(value, moment.ISO_8601, true, "UTC");
            if (date.isValid()) {
                var local = date.tz(moment.tz.guess()).format("DD.MM.YYYY, HH:mm");
                value = local;
            }
            return value;
        }

        function getSortIcon(index) {
            if (vm.currentSortItem === vm.keys[index]) {
                if (!vm.reverseSort)
                    return "arrow_drop_down";
                else
                    return "arrow_drop_up";
            }
        }

        function isActive(index) {
            return vm.currentSortItem === vm.keys[index];
        }

        function setPageLimit(data) {
            vm.pageLimit = Math.ceil(data.length / $scope.numPerPage);
        }

        function paginate() {
            var begin = (($scope.currentPage - 1) * $scope.numPerPage);
            var end = begin + $scope.numPerPage;

            vm.displayedItems = vm.filteredItems.slice(begin, end);
            setPageLimit(vm.filteredItems);
        }

        function setNextPage() {
            if ($scope.currentPage < vm.pageLimit)
                $scope.currentPage += 1;
        }

        function setLastPage() {
            if ($scope.currentPage > 1)
                $scope.currentPage -= 1;
        }

        function setPage(page) {
            $scope.currentPage = page;
        }

        function isCurrentPage(pageNumber) {
            return $scope.currentPage === pageNumber;
        }

        $scope.$watch('currentPage', function () {
            paginate();
        });

        $scope.$watchCollection(function watchRows(scope) {
            return (vm.data);
        }, function (data) {
            vm.filteredItems = $filter('orderBy')(data, vm.currentSortItem || vm.initSortBy, !vm.reverseSort);
            paginate();
        });

        $scope.$watchCollection(function watchRows(scope) {
            return (vm.searchText);
        }, function (searchText) {
            vm.setPage(1);
            vm.filteredItems = $filter('filter')(vm.data, searchText);
            paginate();
            if (vm.currentSortItem)
                setSortProperty(vm.currentSortItem, false);
        });

        function setSortProperty(sortProperty, clicked) {
            console.log("sort by ", sortProperty);
            vm.sortProperty = sortProperty;

            if (clicked)
                vm.reverseSort = !vm.reverseSort;

            var tmp = $filter('orderBy')(vm.filteredItems, vm.sortProperty, !vm.reverseSort);

            vm.filteredItems = tmp;

            if (vm.currentSortItem !== vm.sortProperty)
                vm.currentSortItem = vm.sortProperty;

            vm.setPage(1);
            paginate();
        }

        function deleteSelectedItems() {
            vm.onDeleteSelectedItems({deleteItemId: vm.selectedRow});
        }

        function selectedRowCallback(row) {
            vm.selectedRow = row;
            vm.onSelectedRowChanged({row: vm.selectedRow});
        }

        function isSelectedRow(row) {
            return vm.selectedRow === row;
        }

        function deleteRow(id) {
            vm.onDeleteRow({deleteRow: id});
        }

    }

    angular
        .module('app.dataTable')
        .component('seplDataTable', {
            templateUrl: 'modules/layout/dataTable/dataTable.html',
            controller: DataTableController,
            bindings: {
                data: '<',
                keys: '<',
                columns: '<',
                searchText: '<',
                onSelectedRowChanged: '&',
                onDeleteSelectedItems: '&',
                onDeleteRow: '&',
                deleteActive: '@',
                buttons: '=',
                initSortBy: '@'
            }
        });
})();