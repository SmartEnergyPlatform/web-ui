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

module.exports = {
    IOT_REPO_URL: process.env.IOT_REPO_URL || "http://iotrepo",
    PROCESS_REPO_URL: process.env.PROCESS_REPO_URL || "http://processrepo",
    PROCESS_SERVICE_URL: process.env.PROCESS_SERVICE_URL || "http://processservice",
    PROCESS_SCHEDULER_URL: process.env.PROCESS_SCHEDULER_URL || "http://processscheduler",
    DASHBOARD_SERVICE_URL: process.env.DASHBOARD_SERVICE_URL || "http://dashboard",
    ANALYTICS_OPERATOR_REPO_URL: process.env.ANALYTICS_OPERATOR_REPO_URL || "http://analyticsoperatorrepo",
    ANALYTICS_FLOW_REPO_URL: process.env.ANALYTICS_FLOW_REPO_URL || "http://analyticsflowrepo",
    USERS_SERVICE_URL: process.env.USERS_SERVICE_URL || "http://userrepo",
    ANALYTICS_EXECUTOR_URL: process.env.ANALYTICS_EXECUTOR_URL || "http://analyticsexecutor",
    ANALYTICS_PARSER_URL: process.env.ANALYTICS_PARSER_URL || "http://analyticsparser",
    KAFKA_WEBSOCKET_SERVICE_URL: process.env.KAFKA_WEBSOCKET_SERVICE_URL || "http://kafkawebsocketservice",
    KAFKA_WEBSOCKET_URL: process.env.KAFKA_WEBSOCKET_URL || "http://kafkawebsocket",
    DEVICE_LOG_URL: process.env.DEVICE_LOG_URL || "http://devicelog",
    PROCESS_DEPLOYMENT_URL: process.env.PROCESS_DEPLOYMENT_URL || "http://processdeployment",
    KEYCLOAK_URL: process.env.KEYCLOAK_URL || "http://keycloak",
    ANALYTICS_SERVING_URL: process.env.ANALYTICS_SERVING_URL || "http://analyticsserving",
    PERM_SEARCH_URL: process.env.PERM_SEARCH_URL || "http://permissionsearch:8080",
    LOGIN_REQUIRED: process.env.LOGIN_REQUIRED || true,
    PERM_COMMAND_URL: process.env.PERM_COMMAND_URL || "http://permissionsearch:8080",
    API_AGGREGATOR_URL: process.env.API_AGGREGATOR_URL || "http://apiaggregator:8080",
    MARKETPLACE_USER_RATING_URL: process.env.MARKETPLACE_USER_RATING_URL || "http://marketplaceuserrating:8080",
    ANALYTICS_PIPELINE_REPO_URL: process.env.ANALYTICS_PIPELINE_REPO_URL || "http://analyticspipelinerepo",
    VALUETYPE_SEARCH_URL: process.env.VALUETYPE_SEARCH_URL || "http://valuetypesearch:8080",
    INFLUX_API_URL: process.env.INFLUX_API_URL || "http://inluxapi:8080",
    PROCESS_RATINGS_URL: process.env.PROCESS_RATINGS_URL || "http://api.sepl.infai.org/process/ratings"
};