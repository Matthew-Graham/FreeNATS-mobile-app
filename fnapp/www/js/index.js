/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Highest level object wrapping all functionality
 */
var app = {

    //default empty objects
    router: {},
    fnConnObj: {},
    alertService: {},
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

    },

    // deviceready Event Handler
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {

        this.receivedEvent('deviceready');
        app.router = new PageRouter();
        app.fnConnObj = new FnConn();
        app.startup();
        app.initializeAlertService();
    },

    startup: function() {

        let fnConnObj = app.fnConnObj;
        let router = app.router;

        //create db for FNserver passes
        let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);

        /**
         * Create tables to store servers and settings
         */
        fnDb.transaction(function(tx) {

            tx.executeSql('CREATE TABLE IF NOT EXISTS servers (serverName unique,url,naun,napw)', [], function(tx) {

                router.currPage = "servers";
                router.routeToPage({ path1: "servers" })
                localStorage.setItem("startup", "0");
            });
        }, function(error) {
            console.log("SQL Transaction error creating server table Message:" + error.message);
        });


        fnDb.transaction(function(tx) {

            tx.executeSql('CREATE TABLE IF NOT EXISTS settings (name unique,value,freq)', [], function(tx) {

                tx.executeSql('INSERT INTO settings (name,value,freq) VALUES (?,?,?)', ["alerting", "0", "3600000"]);
            });
        }, function(error) {
            console.log("SQL Transaction error creating settings table Message:" + error.message);
        });


        /**
         * Create initial nav bar for first starting up the application
         */
        $(document).ready(function() {
            navViewObj = new NavbarView(1);
        });
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {


    },

    /**
     * Create the alert service
     */
    initializeAlertService: function() {
        this.alertService = new AlertBackgroundService();
    }

};

app.initialize();