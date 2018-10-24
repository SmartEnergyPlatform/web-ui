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
        .module('app.processes.repository')
        .factory('repositoryService', repositoryService);

    /* @ngInject */
    function repositoryService($http, x2js, PROCESS_REPO_URL, permissionsService, $q) {
        var service = {
            add: add,
            update: update,
            getProcessModel: getProcessModel,
            remove: remove,
            publish: publish,
            RepoItem: RepoItem,
            getAllPublishedProcesses: getAllPublishedProcesses,
            createRepoItems: createRepoItems,
            copyFromMarketplaceToLocalRepo: copyFromMarketplaceToLocalRepo,
        };

        return service;

        function add(xml, svg) {
            var body = {};
            var date = Date.now();

            body.process = x2js.xml_str2json(xml);
            body.svg = x2js.xml_str2json(svg);
            body.date = date;

            return $http({
                method: "POST",
                url: PROCESS_REPO_URL + "/process",
                data: body,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for add.' + error.data);
            }
        }

        function copyFromMarketplaceToLocalRepo(item) {
            var body = {};
            var date = Date.now();

            body.process = item.process;
            body.svg = x2js.xml_str2json(item.svg);
            body.date = date;
            body.publish = false;
            body.parent_id = item.id;

            return $http({
                method: "POST",
                url: PROCESS_REPO_URL + "/process",
                data: body,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for add.' + error.data);
            }
        }

        function publish(id, publish, description) {
            var body = {};
            body.publish = publish;
            body.description = description;
            return $http({
                method: "POST",
                data: body,
                headers: {
                    'Content-Type': 'application/json'
                },
                url: PROCESS_REPO_URL + "/process/" + id + "/publish",
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for put.' + error.data);
            }

        }

        function getAllPublishedProcesses() {
            return $http({
                method: "GET",
                url: PROCESS_REPO_URL + "/process/"
            }).then(success).catch(failure);

            function success(response) {
                var allPublishedProcesses = [];
                for (var i = 0; i < response.data.length; i++) {
                    var item = response.data[i];
                    allPublishedProcesses.push(new RepoItem(item._id, item.process.definitions.process._id, item.date, x2js.json2xml_str(item.svg), item.svg, item.publish, item.publish_date, item.process, item.owner, item.parent_id, item.description));
                }
                return allPublishedProcesses;
            }

            function failure(error) {
                console.log('XHR Failed for get.' + error.data);
            }
        }

        function update(id, xml, svg) {
            var body = {};
            var date = Date.now();

            body.process = x2js.xml_str2json(xml);
            body.svg = x2js.xml_str2json(svg);
            body.date = date;
            return $http({
                method: "PUT",
                url: PROCESS_REPO_URL + "/process/" + id,
                data: body,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for add.' + error.data);
            }
        }

        function getProcessModel(id) {
            return $http({
                method: "GET",
                url: PROCESS_REPO_URL + "/process/" + id
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for get.' + error.data);
            }
        }

        function remove(id) {
            return $http({
                method: "DELETE",
                url: PROCESS_REPO_URL + "/process/" + id
            }).then(success).catch(failure);

            function success(response) {
                return response.data;
            }

            function failure(error) {
                console.log('XHR Failed for get.' + error.data);
            }
        }

        function createRepoItems(items) {
            if (!items || !items.length) {
                return
            }

            var tmp = [];

            items.forEach(function (item) {
                tmp.push(new RepoItem(item.id, item.name, item.date, x2js.json2xml_str(item.svg), item.svg, item.publish, item.publish_date, item.process, item.creator, item.parent_id, item.description));
            });

            return tmp;
        }

        function RepoItem(id, name, date, svg, svgJson, publish, publish_date, process, owner, parent_id, description) {
            var item = this;

            item.id = id;
            item.name = name;
            item.date = date;
            item.formattedDate = moment(item.date).tz(moment.tz.guess()).format("DD.MM.YYYY, HH:mm");

            if (svg) {
                item.svg = svg;
                item.image = "data:image/svg+xml;base64," + window.btoa(svg);
            }

            if (svgJson) {
                item.svgJson = svgJson;
            }

            if (publish) {
                item.publish = publish;
                item.publishDate = publish_date;
                item.formattedPublishDate = moment(item.publishDate).tz(moment.tz.guess()).format("DD.MM.YYYY, HH:mm");
            }

            if (process) {
                item.process = process;
            }

            if (owner) {
                item.owner = owner;
            }

            if (parent_id) {
                item.parent_id = parent_id;
            } else {
                item.parent_id = null;
            }

            if (description) {
                item.description = description;
            }


        }
    }
})();