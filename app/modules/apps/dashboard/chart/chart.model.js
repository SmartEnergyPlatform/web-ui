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
        .module('app.apps.dashboard.chart')
        .factory('Chart', ChartModel);

    function ChartModel() {

        function Chart(id, title, type, index, frame, source, device, view, x_field, x_name, y_field, y_name) {
            this._id = _.defaultTo(id, null);
            this.title = _.defaultTo(title, "");
            this.type = _.defaultTo(type, "lineChart");
            this.index = _.defaultTo(index, 0);
            this.frame = _.defaultTo(frame, 10);
            this.source = _.defaultTo(source, {id: "", name:""});
            this.device = _.defaultTo(device, {id: "", name: ""});
            this.view = _.defaultTo(view, "");
            this.x_field = _.defaultTo(x_field, "");
            this.x_name = _.defaultTo(x_name, "");
            this.y_field = _.defaultTo(y_field, "");
            this.y_name = _.defaultTo(y_name, "");
        }

        return Chart;
    }
})();