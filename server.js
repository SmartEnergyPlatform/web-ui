
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

require('dotenv').config()
var express = require('express');
var mustache = require('mustache');
var config = require('./constants');
var path = require('path');

var app = express();

app.get('/js/constants.js', function(req, res, next) {
    res.set('Content-Type', 'application/javascript');

    var template = "angular.module('app.constants', []){{#constants}}.constant('{{name}}', '{{{value}}}'){{/constants}};";
    var constants = {
        constants: []
    };

    for (var key in config) {
        if (config.hasOwnProperty(key)) {
            constants.constants.push({
                name: key,
                value: config[key]
            });
        }
    }

    res.send(mustache.render(template, constants));
});

app.get('/js/keycloak_url.js', function(req, res, next) {
    res.set('Content-Type', 'application/javascript');
    res.send('window.loginRequired = ' + config["LOGIN_REQUIRED"] + ';window.keycloak_url = "' + config["KEYCLOAK_URL"] + '"');
});

app.use("/", express.static(__dirname + '/dist'));

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

var port = normalizePort(process.env.PORT || '8000');
app.listen(port);

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}
