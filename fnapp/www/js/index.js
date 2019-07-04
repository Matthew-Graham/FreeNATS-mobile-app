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




var app = {

  router: "",
  fnConnObj: "",
  alertService: "",
  // Application Constructor
  initialize: function () {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    // alert("here");
  },

  // deviceready Event Handler
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function () {
    //alert("he7y");
    this.receivedEvent('deviceready');

    app.router = new PageRouter();
    app.fnConnObj = new FnConn();

    app.startup();
    app.initializeAlertService();
  },

  startup: function () {

    let fnConnObj = app.fnConnObj;
    let router = app.router;

    //create db for FNserver passes
    let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);

    /**Test */
    sessionStorage.clear();


    function removeCookies() {
      var res = document.cookie;
      var multiple = res.split(";");
      for (var i = 0; i < multiple.length; i++) {
        var key = multiple[i].split("=");
        document.cookie = key[0] + " =; expires = Thu, 01 Jan 1970 00:00:00 UTC";
      }
      // alert("removing cookies");
      window.cookies.clear(function () {
        // alert("cookies cleared")
        console.log('Cookies cleared!');
      });
    }
    removeCookies();


    fnDb.transaction(function (tx) {
      tx.executeSql('DROP TABLE servers');
    });
    fnDb.transaction(function (tx) {
      tx.executeSql('DROP TABLE settings');
    });


    fnDb.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS servers (serverName unique,url,naun,napw,sid,skey)', [], function (tx) {

        let serverData = ["Server 1", "http://natsapi.altair.davecutting.uk/jsonapi.php", "admin", "admin", "-1", "-1"];
        console.log(serverData);
        tx.executeSql('INSERT INTO servers (serverName,url,naun,napw,sid,skey) VALUES (?,?,?,?,?,?)', serverData);
        router.currPage = "servers";
        router.routeToPage({ path1: "servers" })
        // router.routeToPage("servers");
      });
    }, function (error) {
      console.log("SQL Transaction error creating server table Message:" + error.message);
    });


    fnDb.transaction(function (tx) {

      tx.executeSql('CREATE TABLE IF NOT EXISTS settings (name unique,value,freq)', [], function (tx) {

        tx.executeSql('INSERT INTO settings (name,value,freq) VALUES (?,?,?)', ["alerting", "0","3600000"]);
      });
    }, function (error) {
      console.log("SQL Transaction error creating settings table Message:" + error.message);
    });




    //TODO REMOVE FROM here and into view 
    $(document).ready(function () {
      // alert("hey");
      //Compile nav bar view  
      navViewObj = new NavbarView(1);
    });
  },

  // Update DOM on a Received Event
  receivedEvent: function (id) {


  },

  initializeAlertService: function () {
    this.alertService = new AlertBackgroundService();
  }

};

app.initialize();



