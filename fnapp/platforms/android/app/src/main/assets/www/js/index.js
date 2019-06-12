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

  router:new PageRouter(),
  fnConnObj:new FnConn(),
  // Application Constructor
  initialize: function () {
     router = this.router;
     fnConnObj = this.fnConnObj;




    //create db for FNserver passes
    let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);

    /**Test */
    sessionStorage.clear();
    fnDb.transaction(function (tx) {
      tx.executeSql('DROP TABLE servers');
    });

    //test
    // let test = new FnConn();
    // test.connect();

    fnDb.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS servers (serverName unique,url,naun,napw,sid,skey)',[], function (tx) {
        
        let serverData = ["Server 1", "http://natsapi.altair.davecutting.uk/jsonapi.php", "admin", "admin", "-1", "-1"];
        console.log(serverData);
        tx.executeSql('INSERT INTO servers (serverName,url,naun,napw,sid,skey) VALUES (?,?,?,?,?,?)', serverData);   
        
        router.currPage = "servers";
        router.routeToPage("servers");
      });
    }, function (error) {
      console.log("SQL Transaction error creating server table Message:" + error.message);
    });


    /**
     * Test data saved server
     */
    // fnDb.transaction(function (tx) {
    //   let serverData = ["Server 1", "http://natsapi.altair.davecutting.uk/jsonapi.php", "admin", "admin", "-1", "-1"];
    //   console.log(serverData);
    //   tx.executeSql('INSERT INTO servers (serverName,url,naun,napw,sid,skey) VALUES (?,?,?,?,?,?)', serverData);

    // });


    /**
     * Test data for connection
     */


 
//TODO REMOVE FROM here and into view 
    $(document).ready(function () {
      //Compile nav bar view  
      navViewObj = new NavbarView(1);
    //   $(".bar.bar-tab").html(Handlebars.compile($("#navBar1Template").html()));
    //   $(".tab-item").on('click', function (event) {

    //     let id = this.id;
      
    //     console.log(id);

    //     //pgRouter(id);
    //     router.routeToPage(id);
    //   });
     });









    //check saved freenats servers else login to one
    //Display navbar





  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function () {


  },

  // Update DOM on a Received Event
  receivedEvent: function (id) {
      

  }
};

app.initialize();



