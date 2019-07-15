

/**
 * pass,user,url
 */
function FnConn() {
  let fnDb = "-1";
  let currUrl = "-1";
  let validSession = false;

}


//change to accept query callback instead of route
FnConn.prototype.connect = function (url, name, pass, route) {
  console.log("requested route " + route);
  let loginUrl = url + "/login";
  let self = this;
  let jqxhr = $.ajax({
    url: loginUrl,
    type: 'post',
    data: {
      naun: name,
      napw: pass
    },
    headers: {},
    dataType: 'json',

  });

  jqxhr.done(function (data) {

    //dont save session if non session query like bckground
    console.log("successful login");
    sessionStorage.setItem("url", url);
    sessionStorage.setItem("skey", data.skey);
    sessionStorage.setItem("sid", data.sid);

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



    let persistSession = function () {
      let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);
      fnDb.transaction(function (tx) {

        tx.executeSql('UPDATE servers  SET sid = ?,skey = ? WHERE url = ?', [data.sid, data.skey, url], function (tx, result) {
          console.log("Session variables successfully updated");
          
          //non session based query

          if(route == "alertbackground"){
            app.fnConnObj.backgroundQuery(app.alertService.currServerIndex);
          }else{
            self.query({ path1: route });
          }
          
          
          



        }, function (tx, error) {
          console.log("SQL query ERROR" + error.message)
        });
      }, function (error) {
        console.log("SQL Transaction error")
      });
    }

    persistSession();

    /**
     * Set Entry point page when connecting to a server
     */
    //data router  to requested route
    // router.routeToPage("nodes");

  });
  jqxhr.fail(function (xhr, textStatus, errorThrown) {

    if (errorThrown.status == "403") {
      alert("Incorrect password or username" + "[" + errorThrown.status + "]");
    } else if (errorThrown.status == "404") {
      alert("no such route found" + "[" + errorThrown.status + "]");
    } else {
      alert("Error could not connect to url");
      console.log(xhr.statusText);
      console.log(textStatus);
      console.log(errorThrown.responnseText);
    }

    router.routeToPage({ path1: "servers" });

  })
}




//TODO add passable name here aswell
/**
 * @param url
 */
FnConn.prototype.initializeSession = function (url, routeObj) {

  let requestedRoute = routeObj.path1;
  console.log(url);
  console.log("requested route " + requestedRoute);
  this.currUrl = url;
  let self = this;

  /*
  check if session var exists
  */
  let skey = sessionStorage.getItem("skey");
  console.log("skey" + skey)
  if (skey == null) {

    console.log("SESSION DOESN'T EXIST")
    //populate session based on url    
    let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);

    fnDb.transaction(function (tx) {

      //session var doesnt exist , create from server db
      tx.executeSql('SELECT * FROM servers WHERE url = ?', [url], function (tx, results) {
        console.log("Getting session data from db");
        //grab recent session details from db
        console.log("url" + results.rows.item(0).url);

        //change to query
        sessionStorage.setItem("url", url);
        sessionStorage.setItem("skey", results.rows.item(0).skey);
        sessionStorage.setItem("sid", results.rows.item(0).sid);
        self.query(routeObj);
        //self.connect(results.rows.item(0).url, results.rows.item(0).naun, results.rows.item(0).napw, requestedRoute);

      });
    }, function (tx, error) {
      console.log("no such server")
    });
  } else {

    console.log("SESSION VARIABLES EXIST --Attempting query");
    //Try to route normally
    this.query({ path1: requestedRoute })
  }
}

FnConn.prototype.removeSession = function () {
  console.log("clearing session")
  sessionStorage.clear();
}


FnConn.prototype.sysVarsQry = async function (routeObj) {

  let self = this;

  let sysvars = [
    {
      name: "site.tester.suspended",
      value: "",
    },
    {
      name: "site.tester.suspended",
      value: "",
    }
  ];

  let index = 0;
  qry(sysvars, index);

  /**
   * 
   * @param {array of system variable objects} sysvars 
   * @param {*} index 
   */
  function qry(sysvars, index) {

    if (index < sysvars.length) {
      apiRoute = self.currUrl + "/sysvar/" + sysvars[index].name;
      let jqxhr = $.get(apiRoute, { fn_skey: sessionStorage.getItem("skey"), fn_sid: sessionStorage.getItem("sid") }, function (data) {
        console.log(data.error);
        sysvars[index].value = data.value;
        console.log("SESSION ACTIVE");
        console.log(data);
        index = index + 1;
        qry(sysvars, index);
      }, "json");

      jqxhr.fail(function (error) {
        console.log("SESSION INACTIVE");
      })
    } else {
      //end create new sys var lists
      console.table(sysvars);
      let sysVarViewObj = new SysVarView(sysvars);
    }
  }


}

FnConn.prototype.backgroundQuery = function (index) {
  let self = this;
  let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);
  let rowIndex = index;
  app.alertService.currServerIndex = rowIndex;

  fnDb.transaction(function (tx) {
    tx.executeSql('SELECT * FROM servers', [], function (tx, results) {

      console.log("query server");
      console.log(results.rows.item(rowIndex).url);
      console.log(results.rows.item(rowIndex).skey);
      console.log(results.rows.item(rowIndex).sid);
      let apiRoute = results.rows.item(rowIndex).url + "/alerts";
      console.log(apiRoute);

      let jqxhr = $.get(apiRoute, { fn_skey: results.rows.item(rowIndex).skey, fn_sid: results.rows.item(rowIndex).sid }, function (data) {
        function removeCookies() {
          var res = document.cookie;
          var multiple = res.split(";");
          for (var i = 0; i < multiple.length; i++) {
            var key = multiple[i].split("=");
            document.cookie = key[0] + " =; expires = Thu, 01 Jan 1970 00:00:00 UTC";
          }
          alert("removing cookies");
          window.cookies.clear(function () {
            alert("cookies cleared")
            console.log('Cookies cleared!');
          });
        }
        removeCookies();
        console.log("SESSION details correct");
        console.log(data);
        alert(data);

        //notification data
        let count = data.alertcount;
        let alertText = "";
        console.log("alerts" + data.alerts);

        // data.alerts = [{
        //   nodeid:"vpn",
        //   alertlevel:"1"
        // }]

        if (data.alerts != false) {
          data.alerts.forEach(element => {
            alertText = alertText + "Node:" + element.nodeid + "(" + element.alertlevel + "),";
          });

          cordova.plugins.notification.local.schedule({
            title: "Alerts(" + count + ")",
            text: alertText,
            foreground: true
          })
        }else{

          //possibly remove 
          cordova.plugins.notification.local.schedule({
            title: "0 Alerts",
            text: "No alerting nodes found",
            foreground: true
          })
        }

        //if background 
        if (rowIndex < results.rows.length - 1) {
          rowIndex++;
          self.backgroundQuery(rowIndex);
        }
      }, "json");

      jqxhr.fail(function (error) {
        alert(error);
        //connect with new session details from connect
        app.fnConnObj.connect(results.rows.item(rowIndex).url, results.rows.item(rowIndex).naun, results.rows.item(rowIndex).napw, "alertbackground");

        console.log("SESSION INACTIVE in bckground");
      });




    }, null);

  });

}





FnConn.prototype.query = function (routeObj) {



  let route = routeObj.path1;
  let id = routeObj.path2;
  let path3 = routeObj.path3;
  let data = routeObj.data;
  let apiRoute;

  console.log("routes here " + route);
  console.log(id);
  console.log(path3);

  //check session var/session storage var
  //doesnt exist populate sid from db
  //does exist query test 
  //fail - login retrive username and pass from server

  //valid session 
  //route to requested page through data router 
  //choose nav bar 




  if (id === undefined) {


    apiRoute = this.currUrl + "/" + route;



  } else if (routeObj.path3 == "data") {

    if (routeObj.queryString1 != undefined && routeObj.queryString2 != undefined) {
      console.log("here");
      apiRoute = this.currUrl + "/" + route + "/" + id + "/data?startx=" + routeObj.queryString1 + "&finishx=" + routeObj.queryString2;

    } else if (routeObj.queryString1 != undefined) {
      apiRoute = this.currUrl + "/" + route + "/" + id + "/data+?finishx=" + routeObj.queryString2;

    } else if (routeObj.queryString2 != undefined) {
      apiRoute = this.currUrl + "/" + route + "/" + id + "/data+?startx=" + routeObj.queryString1

    } else {
      apiRoute = this.currUrl + "/" + route + "/" + id + "/data";

    }

  } else if (routeObj.path3 == "enable" || routeObj.path3 == "disable") {

    apiRoute = this.currUrl + "/" + route + "/" + id + "/" + path3;

  }

  else {

    apiRoute = this.currUrl + "/" + route + "/" + id;
  }

  console.log("Querying api route -> " + apiRoute);

  let jqxhr = $.get(apiRoute, { fn_skey: sessionStorage.getItem("skey"), fn_sid: sessionStorage.getItem("sid") }, function (data) {

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
    console.log(data.error);
    console.log(sessionStorage.getItem("skey"));
    console.log(sessionStorage.getItem("sid"));
    dataDependentRouter(data);
    console.log("SESSION ACTIVE");
  }, "json");
  jqxhr.fail(function (error) {

    let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);

    fnDb.transaction(function (tx) {

      //session var doesnt exist , create from server db
      tx.executeSql('SELECT * FROM servers WHERE url = ?', [app.fnConnObj.currUrl], function (tx, results) {
        console.log("Query Failed - Retreiving new session data");

        //grab recent session details from db 
        //change to query
        app.fnConnObj.connect(results.rows.item(0).url, results.rows.item(0).naun, results.rows.item(0).napw, routeObj.path1);

      });
    }, function (tx, error) {
      console.log("no such server")
    });



    //query fails beacuase session invalid - relog

    //login
    console.log(error);
    console.log(sessionStorage.getItem("skey"));
    console.log(sessionStorage.getItem("sid"));
    console.log("SESSION INACTIVE in ddr");
  })
  //TODO add error code  for routes

  dataDependentRouter = function (data) {
    console.log("Current page " + app.router.currPage);
    console.log("Data Dependent Route to " + route);
    //if remaining in nested ui level
    if (app.router.nestedUiLevel.includes(app.router.currPage)) {

      //if go to nested from initial 
    } else if (app.router.initialUiLevel.includes(app.router.currPage)) {
      console.log("create level 2 nav ");
      let nav = new NavbarView(2);
    }

    switch (route) {
      case 'nodes':
        app.router.currPage = "nodes";
        console.log(app.router.currPage + " is curr page");
        //new node view passing in node data
        let nodeListViewObj = new NodeListView(data);

        break;

      //move css updating to view class
      case 'node':
        let nodeId = routeObj.path2;
        if (routeObj.path3 == "disable") {
          $("button[id='" + nodeId + "']").val("disabled");
          $("button[id='" + nodeId + "']").html("disabled");
          $("button[id='" + nodeId + "']").removeClass("btn-positive");
          $("button[id='" + nodeId + "']").addClass("btn-negative");

          //alert
        } else if (routeObj.path3 == "enable") {
          $("button[id='" + nodeId + "']").val("enabled");
          $("button[id='" + nodeId + "']").html("enabled");
          $("button[id='" + nodeId + "']").removeClass("btn-negative");
          $("button[id='" + nodeId + "']").addClass("btn-positive");

        } else {
          app.router.currPage = "node";
          //console.log(data);
          let testListViewObj = new TestListView(data);
        }

        break;
      case 'test':
        app.router.currPage = "test"
        console.log(data);
        let testGraphViewobj = new TestGraphView(data);
        break;

      case 'alerts':
        app.router.currPage = "alerts"
        let alertViewObj = new AlertView(data);
        console.log(data);
        break;
      case 'groups':
        app.router.currPage = "groups";
        console.log(data);
        let groupListViewObj = new GroupListView(data);
        break;
      case 'group':
        app.router.currPage = "group";
        console.log(data);
        let groupViewObj = new GroupView(data);
        break;
      case 'sysvarread':
        app.router.currPage = "sysvarread";
        console.log(data);
        break;
      case 'sysvar':
        app.router.currPage = "sysvar";
        alert(routeObj.path1 + "succesfully changed")
        break;

    }
  }

}





















