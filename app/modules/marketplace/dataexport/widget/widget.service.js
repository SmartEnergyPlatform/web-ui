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
        .module('app.marketplace.dataexport.widget')
        .factory('marketplaceDataexportService', marketplaceDataexportService);

    /* @ngInject */

    function marketplaceDataexportService() {
        var service = {
            getAllDataexports: getAllDataexports,
        }
        return service;

        function getAllDataexports() {
            var dataexport = [];
            dataexport.push({
                name: "Wetterdaten",
                imageHeader: "cloud",
                imageColor: "blue",
                count: 5,
                date: 20180404,
                data: [{image: 'timeline', text: '1 Jahr'},
                    {image: 'functions', text: '10 k'},
                    {image: 'account_balance', text: '19,99 €' , price: 19.99, currency: '1'},
                    {image: 'location_on', text: 'Germany'},
                ]
            })

            dataexport.push({
                name: "Temperatur",
                imageHeader: "wb_sunny",
                imageColor: "red",
                count: 52,
                date: 20180304,
                data: [{image: 'timeline', text: '1 Jahr'},
                    {image: 'timer', text: '30 min'},
                    {image: 'people_outline', text: '500'},
                    {image: 'functions', text: '8,7 Mio.'},
                    {image: 'account_balance', text: '9,99 €',  price: 9.99, currency: '1'},
                    {image: 'location_on', text: 'Germany'},
                ]
            })

            dataexport.push({
                name: "Stromverbrauch",
                imageHeader: "local_gas_station",
                imageColor: "green",
                count: 3455,
                date: 20170104,
                data: [{image: 'timeline', text: '30 Tage'},
                    {image: 'timer', text: '15 sec'},
                    {image: 'people_outline', text: '5000'},
                    {image: 'functions', text: '86,4 Mio.'},
                    {image: 'devices_other', text: 'Kaffeem.'},
                    {image: 'location_on', text: 'Sachsen'},
                    {image: 'account_balance', text: 'kostenlos', price: 0, currency: '1'},
                ]
            })

            dataexport.push({
                name: "On-/Offline",
                imageColor: "green",
                imageHeader: "power_settings_new",
                count: 5346,
                date: 20160404,
                data: [{image: 'timeline', text: '2 Jahre'},
                    {image: 'people_outline', text: '1.250'},
                    {image: 'devices_other', text: 'Fernsehr'},
                    {image: 'functions', text: '1,14 Mrd.'},
                    {image: 'location_on', text: 'Germany'},
                    {image: 'account_balance', text: 'kostenlos', price: 0, currency: '1'},
                ]
            })

            dataexport.push({
                name: "Zimmertemperatur",
                imageHeader: "weekend",
                imageColor: "orange",
                count: 3455,
                date: 20150404,
                data: [{image: 'timeline', text: '1 Jahr'},
                    {image: 'timer', text: '30 min'},
                    {image: 'people_outline', text: '500'},
                    {image: 'functions', text: '8,7 Mio.'},
                    {image: 'account_balance', text: '99,99 €',  price: 99.99, currency: '1'},
                    {image: 'location_on', text: 'Leipzig'},
                ]
            })

            dataexport.push({
                name: "Beleuchtung",
                imageHeader: "wb_incandescent",
                imageColor: "orange",
                count: 56344,
                date: 20180202,
                data: [{image: 'timeline', text: '1 Jahr'},
                    {image: 'timer', text: '30 min'},
                    {image: 'people_outline', text: '500'},
                    {image: 'functions', text: '8,7 Mio.'},
                    {image: 'account_balance', text: '20,00 €',  price: 20, currency: '1'},
                    {image: 'location_on', text: 'Leipzig'},
                ]
            })

            dataexport.push({
                name: "Beleuchtung",
                imageHeader: "wb_incandescent",
                imageColor: "orange",
                count: 345,
                date: 20180203,
                data: [{image: 'timeline', text: '2 Jahre'},
                    {image: 'timer', text: '30 min'},
                    {image: 'people_outline', text: '250'},
                    {image: 'functions', text: '8,7 Mio.'},
                    {image: 'account_balance', text: '40,00 €', price: 40, currency: '1'},
                    {image: 'location_on', text: 'Deutschland'},
                ]
            })

            dataexport.push({
                name: "Zimmertemperatur",
                imageHeader: "weekend",
                imageColor: "orange",
                count: 355,
                date: 20180303,
                data: [{image: 'timeline', text: '1 Jahr'},
                    {image: 'timer', text: '30 min'},
                    {image: 'people_outline', text: '500'},
                    {image: 'functions', text: '8,7 Mio.'},
                    {image: 'account_balance', text: '9,99 €',  price: 9.99, currency: '1'},
                    {image: 'location_on', text: 'Deutschland'},
                ]
            })

            dataexport.push({
                name: "Zimmertemperatur",
                imageHeader: "weekend",
                imageColor: "orange",
                count: 335,
                date: 20180101,
                data: [{image: 'timeline', text: '1 Monat'},
                    {image: 'timer', text: '30 min'},
                    {image: 'people_outline', text: '6000'},
                    {image: 'functions', text: '8,7 Mio.'},
                    {image: 'account_balance', text: '9,99 €',  price: 9.99, currency: '1'},
                    {image: 'location_on', text: 'Deutschland'},
                ]
            })

            dataexport.push({
                name: "Wetterdaten",
                imageHeader: "cloud",
                imageColor: "blue",
                count: 53,
                date: 20180101,
                data: [{image: 'timeline', text: '1 Jahr'},
                    {image: 'functions', text: '10 k'},
                    {image: 'account_balance', text: '9,99 €',  price: 9.99, currency: '1'},
                    {image: 'location_on', text: 'Leipzig'},
                ]
            })

            dataexport.push({
                name: "Wetterdaten",
                imageHeader: "cloud",
                imageColor: "blue",
                count: 52,
                date: 20180101,
                data: [{image: 'timeline', text: '1 Jahr'},
                    {image: 'functions', text: '10 k'},
                    {image: 'account_balance', text: '9,99 €', price: 9.99, currency: '1'},
                    {image: 'location_on', text: 'Sachsen'},
                ]
            })

            dataexport.push({
                name: "Stromverbrauch",
                imageHeader: "local_gas_station",
                imageColor: "green",
                count: 51,
                date: 20180102,
                data: [{image: 'timeline', text: '30 Tage'},
                    {image: 'timer', text: '15 sec'},
                    {image: 'people_outline', text: '5000'},
                    {image: 'functions', text: '86,4 Mio.'},
                    {image: 'devices_other', text: 'Kaffeem.'},
                    {image: 'location_on', text: 'Leipzig'},
                    {image: 'account_balance', text: 'kostenlos', price: 0, currency: '1'},
                ]
            })

            dataexport.push({
                name: "Stromverbrauch",
                imageHeader: "local_gas_station",
                imageColor: "green",
                count: 98,
                date: 20180103,
                data: [{image: 'timeline', text: '15 Tage'},
                    {image: 'timer', text: '15 sec'},
                    {image: 'people_outline', text: '10.000'},
                    {image: 'functions', text: '86,4 Mio.'},
                    {image: 'devices_other', text: 'Kaffeem.'},
                    {image: 'location_on', text: 'Deutschland'},
                    {image: 'account_balance', text: 'kostenlos', price: 0, currency: '1'},
                ]
            })
            return dataexport;
        }


    }
})();