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

    angular.module('app.processes.designer').filter('shortSeplOutputVarName', function(){
        return function(outputname)
        {
            if(outputname == null){ return ""; }
            return outputname.substring("${result.outputs.".length, outputname.length-1);
        };
    });

    angular.module('app.processes.designer').filter('shortSeplInputVarName', function(){
        return function(input)
        {
            if(input == null){ return ""; }
            return input.substring("inputs.".length);
        };
    });

    angular.module('app.processes.designer').filter('shortSeplInputVarValue', function(){
        return function(input)
        {
            if(input == null){
                return "";
            }
            if(input.substring(0,"${".length) != "${"){
                return input;
            }
            return input.substring("${".length, input.length-1);
        };
    });

})();
