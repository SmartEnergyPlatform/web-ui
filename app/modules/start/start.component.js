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
    function StartController(repositoryService, permissionsService, moment, deviceInstancesService, deploymentsService, monitorService, networksService, $q, startService, $translatePartialLoader, $translate) {
        $translatePartialLoader.addPart('start');
        /** constant */
        const TODAY = new Date();
        const TODAY_AS_STRING = d3.time.format('%d.%m.%Y')(new Date(TODAY));
        const DAY_IN_MS = 86400000;
        const FAILURE_TIME_IN_MS = DAY_IN_MS * 7;
        const STATE_CONNECTED = 'connected';
        const STATE_TRUE = true;
        const STATE_DISCONNECTED = 'disconnected';
        const STATE_FALSE = false;
        const STATE_ACTIVE = 'ACTIVE';
        const STATE_SUSPENDED = 'SUSPENDED';
        const STATE_COMPLETED = 'COMPLETED';
        const STATE_EXTERNALLY_TERMINATED = 'EXTERNALLY_TERMINATED';
        const STATE_INTERNALLY_TERMINATED = 'INTERNALLY_TERMINATED';
        const MARGIN_TOP = 16; // MARGIN_BOTTOM for all individual
        const MARGIN_LEFT = 16;
        const MARGIN_LEFT_LEGEND_NUMBERS = 36;
        const MARGIN_LEFT_LEGEND_PERCENTAGE = 46;
        const MARGIN_RIGHT = 16;
        const MAX_CHARS_LABELS = 10;
        const INTERVAL_DURATION_IN_MIN = 15;
        const INTERVAL_DURATION_IN_MS = INTERVAL_DURATION_IN_MIN * 60 * 1000;
        const NUMBER_OF_INTERVALS = TODAY.getHours() * (60 / INTERVAL_DURATION_IN_MIN) + Math.ceil(TODAY.getMinutes() / INTERVAL_DURATION_IN_MIN);

        var vm = this;
        /** show/hide data*/
        vm.quickAccessLoaded = false;
        vm.deviceChartsLoaded = false;
        vm.gatewayChartsLoaded = false;
        vm.processChartExecutionLoaded = false;
        vm.processChartHistoryLoaded = false;
        vm.processChartStatusHistoryLoaded = false;
        /** charts */
        vm.deviceCharts = [];
        vm.processCharts = [];

        startService.getDeviceHistory().then(function (devices) {
            vm.deviceChartStatusCountData = {
                connected: 0,
                disconnected: 0,
                unknown: 0
            };
            vm.deviceFailureRate = [];
            vm.failureRatioTimelineData = [];

            if (devices != undefined) {

                vm.allIntervals = [];
                for (var x = 0; x < NUMBER_OF_INTERVALS; x++) {
                    vm.allIntervals.push({STATE_CONNECTED: 0, STATE_DISCONNECTED: 0});
                }

                for (var i = 0; i < devices.length; i++) {

                    processStatusWidget(devices[i]);
                    processFailureRate(devices[i]);
                    processTimelineFailureRatio(devices[i]);

                }
                processTimeLineFailureRatioSort();
                processFailureRateSort();

            }
            pushDeviceChartDevicesFailureRatio();
            vm.deviceChartsLoaded = true;


        });

        function processStatusWidget(device) {
            switch (device.log_state) {
                case STATE_CONNECTED:
                    vm.deviceChartStatusCountData.connected++;
                    break;
                case STATE_DISCONNECTED:
                    vm.deviceChartStatusCountData.disconnected++;
                    break;
                default:
                    vm.deviceChartStatusCountData.unknown++;
            }
        }

        function processFailureRate(device) {
            var resp = calcDisconnectedTime(device)
            vm.deviceFailureRate.push({
                    name: resp.name,
                    timeDisconnected: resp.timeDisconnected,
                    failureRate: resp.failureRate,
                }
            );
        }

        function calcDisconnectedTime(input) {
            var timeConnected = 0;
            var timeDisconnected = 0;
            var failureRate = 0;

            if (input.log_history.values == null) {
                switch (input.log_state) {
                    case STATE_CONNECTED:
                        timeConnected = FAILURE_TIME_IN_MS;
                        break;
                    case STATE_DISCONNECTED:
                        timeDisconnected = FAILURE_TIME_IN_MS;
                        failureRate = 1;
                        break;
                    default:
                    // throw new Error('Unknown state.');
                }
            } else {
                /** calculate delta from last index time till now*/
                var lastIndex = input.log_history.values.length - 1;

                var diffToday = TODAY - new Date(input.log_history.values[lastIndex][0] * 1000);
                switch (input.log_history.values[lastIndex][1]) {
                    case STATE_TRUE:
                        timeConnected = diffToday;
                        break;
                    case STATE_FALSE:
                        timeDisconnected = diffToday;
                        break;
                    default:
                        throw new Error('Unknown state.');
                }

                for (var x = lastIndex; x >= 1; x--) {
                    var diff = new Date(input.log_history.values[x][0] * 1000) - new Date(input.log_history.values[x - 1][0] * 1000);
                    var status = input.log_history.values[x - 1][1];
                    addTimeToConnectionStatus(status, diff);

                }

                /** check if input object existed before first index of log history */
                if (input.log_edge != null) {
                    var timeDiff = FAILURE_TIME_IN_MS - timeDisconnected - timeConnected;
                    var status_edge = input.log_edge[1]
                    addTimeToConnectionStatus(status_edge, timeDiff);
                }

            }

            var response = {
                name: input.name,
                timeDisconnected: Math.round(timeDisconnected / 60000),
                failureRate: failureRate,
                failureRatio: timeDisconnected / (timeDisconnected + timeConnected)
            };
            return response


            function addTimeToConnectionStatus(status, time) {
                switch (status) {
                    case STATE_TRUE:
                        timeConnected = timeConnected + time;
                        break;
                    case STATE_FALSE:
                        timeDisconnected = timeDisconnected + time;
                        failureRate++;
                        break;
                    default:
                        throw new Error('Unknown state.');
                }
            }
        }

        function processTimelineFailureRatio(device) {

            var interval = [];
            for (var x = 0; x < NUMBER_OF_INTERVALS; x++) {
                interval.push({STATE_CONNECTED: 0, STATE_DISCONNECTED: 0});
            }

            var intervalIndex = 0;
            var timeLeft = INTERVAL_DURATION_IN_MS;
            var intervalFull = false;

            if (device.log_history.values != null) {
                var lastIndex = device.log_history.values.length - 1;
                var diffTODAY = TODAY - new Date(device.log_history.values[lastIndex][0] * 1000);
                var status_lastIndex = device.log_history.values[lastIndex][1];
                addTimeToStatus(status_lastIndex, diffTODAY);

                for (var z = lastIndex; z >= 1 && intervalFull == false; z--) {
                    var diffDates = new Date(device.log_history.values[z][0] * 1000) - new Date(device.log_history.values[z - 1][0] * 1000);
                    var status_before = device.log_history.values[z - 1][1];
                    addTimeToStatus(status_before, diffDates);
                }
            }

            if (device.log_edge != null && intervalFull == false) {
                var status_edge = device.log_edge[1];
                addTimeToStatus(status_edge, DAY_IN_MS);
            }

            function addTimeToStatus(status, time) {
                switch (status) {
                    case STATE_TRUE:
                        spreadIntoTimeZones(STATE_TRUE, time);
                        break;
                    case STATE_FALSE:
                        spreadIntoTimeZones(STATE_FALSE, time);
                        break;
                    default:
                        throw new Error('Unknown device state.');
                }
            }

            function spreadIntoTimeZones(state, time) {

                while (time >= timeLeft && intervalIndex < (NUMBER_OF_INTERVALS - 1)) {
                    time = time - timeLeft;
                    fillIntervalArray(state, timeLeft);
                    intervalIndex++;
                    timeLeft = INTERVAL_DURATION_IN_MS
                }
                if (intervalIndex == (NUMBER_OF_INTERVALS - 1)) {
                    if (time > timeLeft) {
                        fillIntervalArray(state, timeLeft);
                        intervalFull = true;
                    } else {
                        timeLeft = timeLeft - time;
                        fillIntervalArray(state, time);
                    }
                } else {
                    timeLeft = timeLeft - time;
                    fillIntervalArray(state, time);
                }


            }

            function fillIntervalArray(state, time) {
                switch (state) {
                    case STATE_TRUE:
                        vm.allIntervals[intervalIndex].STATE_CONNECTED += time;
                        interval[intervalIndex].STATE_CONNECTED += time;
                        break;
                    case STATE_FALSE:
                        vm.allIntervals[intervalIndex].STATE_DISCONNECTED += time;
                        interval[intervalIndex].STATE_DISCONNECTED += time;
                        break;
                }
            }
        }

        function processFailureRateSort() {
            vm.deviceFailureRate.sort(function (a, b) {
                return b["timeDisconnected"] - a["timeDisconnected" || b["failureRate"] - a["failureRate"]]
            });
        }

        function processTimeLineFailureRatioSort() {
            var failureRatioTimelineValues = []
            if (vm.allIntervals != null) {
                for (var m = (vm.allIntervals.length - 1); m >= 0; m--) {
                    var percentage = vm.allIntervals[m].STATE_DISCONNECTED / (vm.allIntervals[m].STATE_CONNECTED + vm.allIntervals[m].STATE_DISCONNECTED);
                    var rightPoint = new Date(TODAY.getTime() - (m * INTERVAL_DURATION_IN_MS));
                    var leftPoint = new Date(rightPoint.getTime() - INTERVAL_DURATION_IN_MS);
                    /** no left point for last entry*/
                    if (m == vm.allIntervals.length - 1) {
                        leftPoint = new Date(TODAY);
                        leftPoint.setHours(0, 0)
                    }
                    failureRatioTimelineValues.push({x: leftPoint, y: percentage});
                    failureRatioTimelineValues.push({x: rightPoint, y: percentage});
                }
            }
            vm.failureRatioTimelineData.push({
                values: failureRatioTimelineValues,
                key: "Ausfallquote",
                area: true
            })
        }

        /** PROCESS quick access data and widgets */

        var promises = [];
        var limit = 10;
        var offset = 0;
        var feature = "date";
        var order = "desc";
        var query = "";

        promises.push(permissionsService.getProcessModels(query, limit, offset, feature, order).then(function (resp) {
            var tmp = [];
            if (resp != null) {
                resp.forEach(function (repoItem) {
                    tmp.push(new repositoryService.RepoItem(repoItem.id, repoItem.name, repoItem.date));
                });
            }
            return tmp;
        }));

        var promiseAllExecutions = deploymentsService.getAll();
        promises.push(promiseAllExecutions);

        promises.push(permissionsService.list('processmodel', 'r'));

        $q.all(promises).then(setQuickAccessAndProcessCounter);

        function setQuickAccessAndProcessCounter(result) {
            vm.repoItems = result[0];
            vm.quickAccessLoaded = true;

            if (result[2].data === null) {
                vm.processesAvailable = 0;
            } else {
                vm.processesAvailable = result[2].data.length || 0;
            }

            if (result[1] == undefined) {
                vm.processesExecutable = 0;
            } else {
                vm.processesExecutable = result[1].length;
            }
            vm.processChartExecutionLoaded = true;
        }

        /** PROCESS historicalBarChart and PieChart */

        var promiseProcessHistory = monitorService.getAllHistoryInstances();
        promiseProcessHistory.then(function (response) {

            vm.processChartStatusHistoryData = [];
            vm.processChartData = [];

            if (response == undefined) {
                console.log('WARNING: Not all Widgets loaded');
            } else {

                var datesFormatted = [];
                var stateHistory = [];
                for (var i = 0; i < response.length; i++) {
                    /** preparation for date summary
                     e.g. Before: 2018-04-03T11:29:51.300+0000
                     After: 04/03/2018 */
                    var format = d3.time.format("%m/%d/%Y");
                    var date = response[i].startTime;
                    /** dirty workaround because of safari problems (substring) */
                    datesFormatted.push(format(new Date(date.substring(0, 23))));
                    stateHistory.push({startTime: response[i].startTime, state: response[i].state});
                }
                /** ***************************** */
                /** processing historicalBarChart */
                /** sort is necessary to check missing dates */
                datesFormatted.sort();

                var historicalBarChartdata = [];
                /** sum-up dates */
                var countsPerDate = _.countBy(datesFormatted);
                _.forOwn(countsPerDate, function (count, date) {
                    var d = new Date(date);
                    var n = d.getTime();
                    historicalBarChartdata.push([n, count]);
                });

                /** check for gap between historical dates */
                var missingDates = [];
                for (var z = 0; z < (historicalBarChartdata.length - 1); z++) {
                    addMissingDates((historicalBarChartdata[z + 1][0]), (historicalBarChartdata[z][0]));
                }

                var processChartValues = [];

                if (historicalBarChartdata.length > 0) {
                    /** check for gap between today and youngest chart (highest Int) data */
                    addMissingDates(TODAY, (historicalBarChartdata[historicalBarChartdata.length - 1][0]));
                    processChartValues = historicalBarChartdata.concat(missingDates);

                    vm.processChartData.push({
                        key: 'Quantity',
                        bar: true,
                        values: processChartValues,
                    })
                }

                /** ***************************** */
                /** processing PieChart */

                if (stateHistory.length > 0) {

                    var active = 0;
                    var suspended = 0;
                    var completed = 0;
                    var externallyTerminated = 0;
                    var internallyTerminated = 0;

                    for (var i = 0; i < stateHistory.length; i++) {
                        switch (stateHistory[i].state) {
                            case STATE_ACTIVE:
                                active++;
                                break;
                            case STATE_SUSPENDED:
                                suspended++;
                                break;
                            case STATE_COMPLETED:
                                completed++;
                                break;
                            case STATE_EXTERNALLY_TERMINATED:
                                externallyTerminated++;
                                break;
                            case STATE_INTERNALLY_TERMINATED:
                                internallyTerminated++;
                                break;
                            default:
                                throw new Error('Unknown process state.')
                        }
                    }
                    vm.processChartStatusHistoryData.push({key: "Active", y: active});
                    vm.processChartStatusHistoryData.push({key: "Suspended", y: suspended});
                    vm.processChartStatusHistoryData.push({key: "Completed", y: completed});
                    vm.processChartStatusHistoryData.push({key: "ExternallyTerminated", y: externallyTerminated});
                    vm.processChartStatusHistoryData.push({key: "InternallyTerminated", y: internallyTerminated});
                }

            }
            pushProcessChartHistory();
            vm.processChartHistoryLoaded = true;

            pushProcessChartStatusHistory();
            vm.processChartStatusHistoryLoaded = true;

            function addMissingDates(highInt, lowInt) {
                var diff = highInt - lowInt;
                var missingValues = diff / DAY_IN_MS;
                for (var i = 1; i < missingValues; i++) {
                    missingDates.push([(lowInt + (i * DAY_IN_MS)), 0]);
                }
            }
        })

        /** DEVICE gateway charts */

        startService.getGatewayHistory().then(function (allGateways) {

            vm.barChartGatewayCountValues = [];
            vm.barChartGatewayFailureRatioValue = [];

            if (allGateways != undefined) {
                for (var i = 0; i < allGateways.length; i++) {
                    processGatewayCount(allGateways[i]);
                    processGatewayFailureRatio(allGateways[i]);
                }
            }

            pushDeviceChartGatewayCount();
            pushDeviceChartGatewayFailureRatio();
            vm.gatewayChartsLoaded = true;

        })

        function processGatewayCount(gateway) {
            var count = 0;
            if (gateway.devices != null) {
                count = gateway.devices.length;
            }

            vm.barChartGatewayCountValues.push({
                "x": gateway.name,
                "y": count
            })
        }

        function processGatewayFailureRatio(gateway) {

            var resp = calcDisconnectedTime(gateway)
            vm.barChartGatewayFailureRatioValue.push({
                "x": resp.name,
                "y": resp.failureRatio
            })

        }

        /** ******************** */
        /** options of all charts*/

        function pushDeviceChartGatewayCount() {
            vm.barChartGatewayCountData = [];

            if (vm.barChartGatewayCountValues.length > 0) {
                vm.barChartGatewayCountData.push({key: "Cumulative Return", values: vm.barChartGatewayCountValues})
            }

            var promises = [];

            promises.push($translate('START.COMPONENT.DEVICE_CHART_TITLE_NUMBER_OF_DEVICES_PER_GATEWAY').then(function (translation) {
                vm.deviceChartTitleNumberOfDevicesPerGateway = translation;
            }).catch(function (error) {
                //TODO add error handling
            }));

            $q.all(promises).then(function () {
                vm.deviceCharts.push(
                    {
                        title: vm.deviceChartTitleNumberOfDevicesPerGateway,
                        colspan: 2,
                        options: {
                            chart: {
                                type: 'discreteBarChart',
                                margin: {
                                    top: MARGIN_TOP,
                                    right: MARGIN_RIGHT,
                                    bottom: 50,
                                    left: MARGIN_LEFT_LEGEND_NUMBERS
                                },
                                showValues: true,
                                valueFormat: function (d) {
                                    return d3.format(",")(d);
                                },
                                transitionDuration: 500,
                                xAxis: {
                                    // axisLabel: 'Gateway',
                                    rotateLabels: -30,
                                    tickFormat: function (d) {
                                        return trimText(d);
                                    }
                                },
                                yAxis: {
                                    // axisLabel: 'Anzahl',
                                    tickFormat: function (d) {
                                        return d3.format(',')(d);
                                    }
                                },
                                tooltip: {
                                    keyFormatter: function (d) {
                                        return d;
                                    }
                                },
                            }
                        },
                        data: vm.barChartGatewayCountData,
                    }
                )
            });


        }

        function pushDeviceChartGatewayFailureRatio() {

            vm.barChartGatewayFailureRatioData = [];

            if (vm.barChartGatewayFailureRatioValue.length > 0) {
                vm.barChartGatewayFailureRatioData.push({
                    key: "Cumulative Return",
                    values: vm.barChartGatewayFailureRatioValue
                })
            }

            var promises = [];

            promises.push($translate('START.COMPONENT.DEVICE_CHART_TITLE_DOWNTIME_RATE_PER_GATEWAY_LAST_SEVEN_DAYS').then(function (translation) {
                vm.deviceChartTitleDowntimeRatePerGatewLastSevenDays = translation;
            }).catch(function (error) {
                //TODO add error handling
            }));

            $q.all(promises).then(function () {
                vm.deviceCharts.push(
                    {
                        title: vm.deviceChartTitleDowntimeRatePerGatewLastSevenDays,
                        colspan: 2,
                        options: {
                            chart: {
                                type: 'discreteBarChart',
                                margin: {
                                    top: MARGIN_TOP,
                                    right: MARGIN_RIGHT,
                                    bottom: 50,
                                    left: MARGIN_LEFT_LEGEND_PERCENTAGE
                                },
                                showValues: true,
                                valueFormat: function (d) {
                                    return d3.format(',.2%')(d);
                                },
                                transitionDuration: 500,
                                xAxis: {
                                    // axisLabel: 'Gateway',
                                    rotateLabels: -30,
                                    tickFormat: function (d) {
                                        return trimText(d);
                                    }

                                },
                                yAxis: {
                                    // axisLabel: 'Ausfallquote',
                                    tickFormat: function (d) {
                                        return d3.format(',.2%')(d);
                                    }
                                },
                                tooltip: {
                                    keyFormatter: function (d) {
                                        return d;
                                    }
                                },
                            }
                        },
                        data: vm.barChartGatewayFailureRatioData
                    }
                )
            });
        }

        function pushDeviceChartDevicesFailureRatio() {

            var promises = [];
            promises.push($translate('START.COMPONENT.DEVICE_CHART_TITLE_TOTAL_DOWNTIME_RATE').then(function (translation) {
                vm.deviceChartTitleTotalDowntimeRate = translation;
            }).catch(function (error) {
                //TODO add error handling
            }));

            $q.all(promises).then(function () {
                vm.deviceCharts.push(
                    {
                        title: vm.deviceChartTitleTotalDowntimeRate + ' (' + TODAY_AS_STRING + ')',
                        colspan: 2,
                        options: {
                            chart: {
                                type: 'lineChart',
                                margin: {
                                    top: 20,
                                    right: 20,
                                    bottom: 40,
                                    left: MARGIN_LEFT_LEGEND_PERCENTAGE
                                },
                                x: function (d) {
                                    return d.x;
                                },
                                y: function (d) {
                                    return d.y;
                                },
                                useInteractiveGuideline: true,
                                showLegend: false,
                                xAxis: {
                                    // axisLabel: 'Uhrzeit',
                                    tickFormat: function (d) {
                                        return d3.time.format("%H:%M")(new Date(d))
                                    }
                                },
                                yAxis: {
                                    tickFormat: function (d) {
                                        if (d <= 0.0001 && d > 0) {
                                            return d3.format(',.2%')(0.0001)
                                        }
                                        return d3.format(',.2%')(d);
                                    },
                                    axisLabelDistance: -10
                                },
                                color: ['red'],
                                forceY: [0, 0.01],
                            },
                        },
                        data: vm.failureRatioTimelineData,
                    })
            });


        }

        function pushProcessChartHistory() {

            var promises = [];
            promises.push($translate('START.COMPONENT.DEVICE_CHART_TITLE_NUMBER_OF_PROCESS_DEPLOYMENTS').then(function (translation) {
                vm.deviceChartTitleNumberOfProcessDeployments = translation;
            }).catch(function (error) {
                //TODO add error handling
            }));

            $q.all(promises).then(function () {
                vm.processCharts.push(
                    {
                        title: vm.deviceChartTitleNumberOfProcessDeployments,
                        options: {
                            chart: {
                                type: 'historicalBarChart',
                                margin: {
                                    top: MARGIN_TOP,
                                    right: MARGIN_RIGHT,
                                    bottom: 50,
                                    left: MARGIN_LEFT_LEGEND_NUMBERS
                                },
                                x: function (d) {
                                    return d[0];
                                },
                                y: function (d) {
                                    return d[1];
                                },
                                showValues: true,
                                valueFormat: function (d) {
                                    return d3.format(',')(d);
                                },
                                duration: 500,
                                xAxis: {
                                    // axisLabel: 'Datum',
                                    tickFormat: function (d) {
                                        return d3.time.format('%d.%m.%Y')(new Date(d))
                                    },
                                    rotateLabels: -30,

                                    showMaxMin: false
                                },
                                yAxis: {
                                    // axisLabel: 'Ausgeführt',
                                    // axisLabelDistance: -10,
                                    tickFormat: function (d) {
                                        return d3.format(',')(d);
                                    }
                                },
                                tooltip: {
                                    keyFormatter: function (d) {
                                        return d3.time.format('%d.%m.%Y')(new Date(d));
                                    }
                                },
                                zoom: {
                                    enabled: true,
                                    scaleExtent: [1, 10],
                                    useFixedDomain: false,
                                    useNiceScale: false,
                                    horizontalOff: false,
                                    verticalOff: true,
                                    unzoomEventType: 'dblclick.zoom'
                                },
                                forceY: [0, 0, 6],
                            }
                        },
                        data: vm.processChartData,
                    }
                )
            });


        }

        function pushProcessChartStatusHistory() {

            var promises = [];
            promises.push($translate('START.COMPONENT.DEVICE_CHART_TITLE_STATUS_OF_PROCESS_INSTANCES').then(function (translation) {
                vm.deviceChartTitleStatusOfProcessInstances = translation;
            }).catch(function (error) {
                //TODO add error handling
            }));
            $q.all(promises).then(function () {
                vm.processCharts.push(
                    {
                        title: vm.deviceChartTitleStatusOfProcessInstances,
                        options: {
                            chart: {
                                type: 'pieChart',
                                donut: false,
                                x: function (d) {
                                    return d.key;
                                },
                                y: function (d) {
                                    return d.y;
                                },
                                showLabels: true,
                                showLegend: false,
                                labelType: function (d) {
                                    return d3.format(',')(d.value);
                                },
                                tooltip: {
                                    valueFormatter: function (d) {
                                        return d3.format(',')(d);
                                    }
                                },
                                margin: {
                                    top: MARGIN_TOP,
                                    right: MARGIN_RIGHT,
                                    bottom: 10,
                                    left: MARGIN_LEFT
                                },
                                /*pie: {
                                    startAngle: function (d) {
                                        return d.startAngle / 2 - Math.PI / 2
                                    },
                                    endAngle: function (d) {
                                        return d.endAngle / 2 - Math.PI / 2
                                    }
                                }, */
                                duration: 500,
                                legend: {
                                    margin: {
                                        top: 5,
                                        right: 0,
                                        bottom: 0,
                                        left: 0,
                                    }
                                },
                                color: d3.scale.category10().range()
                            }
                        },
                        data: vm.processChartStatusHistoryData
                    }
                )
            });
        }

        function trimText(d) {
            if (d.length > MAX_CHARS_LABELS) {
                d = d.substring(0, MAX_CHARS_LABELS - 3) + "...";
            }
            return d;
        }
    }

    angular
        .module('app.start')
        .component('seplStart', {
            templateUrl: 'modules/start/start.html',
            controller: StartController
        });
})();