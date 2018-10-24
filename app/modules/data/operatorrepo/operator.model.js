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
        .module('app.data.operatorrepo')
        .factory('Operator', OperatorModel);

    function OperatorModel() {

        function Operator(id, name,image,description,pub,inputs, outputs, editable){
            this.id = _.defaultTo(id, null);
            this.name =   _.defaultTo(name, "");
            this.image = _.defaultTo(image, "");
            this.description =   _.defaultTo(description, "");
            this.pub =   _.defaultTo(pub, "");
            this.inputs = _.defaultTo(inputs, []);
            this.outputs = _.defaultTo(outputs, []);
            this.editable = _.defaultTo(editable, false);
        }

        return Operator;
    }
})();