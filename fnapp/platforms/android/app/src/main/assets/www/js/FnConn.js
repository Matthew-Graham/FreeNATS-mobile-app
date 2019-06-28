

/**
 * pass,user,url
 */
function FnConn() {
  let fnDb = "-1";
  let currUrl = "-1";
  let validSession = false;

}



FnConn.prototype.connect = function (url, name, pass, route) {
  console.log("requested route " + route);
  let loginUrl = url + "/login";

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
    console.log("successful login");
    sessionStorage.setItem("url", url);
    sessionStorage.setItem("skey", data.skey);
    sessionStorage.setItem("sid", data.sid);

    let persistSession = function () {
      let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);
      fnDb.transaction(function (tx) {

        tx.executeSql('UPDATE servers  SET sid = ?,skey = ? WHERE url = ?', [data.sid, data.skey, url], function (tx, result) {
          console.log("Session variables successfully updated");
          fnConnObj.query(route);
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
FnConn.prototype.initializeSession = function (url, requestedRoute) {

  console.log("requested route " + requestedRoute);
  this.currUrl = url;

  /*
  check if session var exists
  */
  if (sessionStorage.getItem("skey") == undefined || null) {

    console.log("SESSION NOT ACTIVE")
    //populate session based on url    
    let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);

    fnDb.transaction(function (tx) {
      //session var doesnt exist , create from server db
      tx.executeSql('SELECT * FROM servers WHERE url = ?', [url], function (tx, results) {
        console.log("initializing session");
        //grab recent session details from db
        fnConnObj.connect(results.rows.item(0).url, results.rows.item(0).naun, results.rows.item(0).napw, requestedRoute);

      });
    }, function (tx, error) {
      console.log("no such server")
    });
  } else {

    console.log("SESSION VARIABLES EXIST --Attempting query");
    //Try to route normally
    this.query(requestedRoute)
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
  qry(sysvars,index);
  
  /**
   * 
   * @param {array of system variable objects} sysvars 
   * @param {*} index 
   */
  function qry(sysvars,index) {
  
    if(index<sysvars.length){
      apiRoute = self.currUrl+"/sysvar/"+sysvars[index].name;
      let jqxhr = $.get(apiRoute, { fn_skey: sessionStorage.getItem("skey"), fn_sid: sessionStorage.getItem("sid") }, function (data) {
      console.log(data.error);
      sysvars[index].value = data.value;
      console.log("SESSION ACTIVE");
      console.log(data);
      index=index+1;
      qry(sysvars,index);
    }, "json");

    jqxhr.fail(function (error) {
      console.log("SESSION INACTIVE");
    })
    }else{
      //end create new sys var lists
      console.table(sysvars);
      let sysVarViewObj = new SysVarView(sysvars);
    }  
  }


}



FnConn.prototype.query = function (routeObj) {
  let route = routeObj.path1;
  let id = routeObj.path2;
  let path3 = routeObj.path3;
  let apiRoute;


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
    console.log(data.error);
    dataDependentRouter(data);
    console.log("SESSION ACTIVE");
  }, "json");
  jqxhr.fail(function (error) {
    console.log("SESSION INACTIVE");
  })
  //TODO add error code  for routes

  dataDependentRouter = function (data) {
    console.log("Current page " + router.currPage);
    console.log("Data Dependent Route to " + route);
    //if remaining in nested ui level
    if (router.nestedUiLevel.includes(router.currPage)) {

      //if go to nested from initial 
    } else if (router.initialUiLevel.includes(router.currPage)) {
      console.log("create level 2 nav ");
      let nav = new NavbarView(2);
    }

    switch (route) {
      case 'nodes':
        router.currPage = "nodes";
        console.log(router.currPage + " is curr page");
        //new node view passing in node data
        let nodeListViewObj = new NodeListView(data);

        break;
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
          router.currPage = "node";
          //console.log(data);
          let testListViewObj = new TestListView(data);
        }

        break;
      case 'test':
        router.currPage = "test"
        console.log(data);
        let testGraphViewobj = new TestGraphView(data);
        break;

      case 'alerts':
        router.currPage = "alerts"
        let alertViewObj = new AlertView(data);
        console.log(data);
        break;
      case 'groups':
        router.currPage = "groups";
        console.log(data);
        let groupListViewObj = new GroupListView(data);
        break;
      case 'group':
        router.currPage = "group";
        console.log(data);
        let groupViewObj = new GroupView(data);
        break;
      case 'sysvarread':
        router.currPage = "sysvarread";
        console.log(data);
        break;
      case 'sysvar':
          router.currPage = "sysvar";
          alert(routeObj.path1 + "succesfully changed")
          break;

    }
  }

}





















