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
        .module('app.data.flowrepo')
        .factory('Flow', FlowModel);

    function FlowModel() {

        function Flow(id, name, model, nodeId, connectorId, status) {
            this.id = _.defaultTo(id, null);
            this.name = _.defaultTo(name, "");
            this.model = _.defaultTo(model, {nodes: [], edges: []});
            this.nodeId = _.defaultTo(nodeId, 1);
            this.connectorId = _.defaultTo(connectorId, 1);
            this.status = _.defaultTo(status, "missing")
        }

        return Flow;
    }
})();