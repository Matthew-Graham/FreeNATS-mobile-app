/**
 * pass,user,url
 */
function FnConn() {
  let fnDb = "-1";
  let currUrl = "-1";
}



FnConn.prototype.connect = function (url, name, pass) {
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
        console.log(url);
        tx.executeSql('UPDATE servers  SET sid = ?,skey = ? WHERE url = ?', [data.sid, data.skey, url], function (tx, result) {
          console.log("query successful");
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
    router.routeToPage(requestedRoute);

  });
  jqxhr.fail(function (xhr, textStatus, errorThrown) {
   
    if (errorThrown.status == "403") {
      alert("Incorrect password or username" + "[" + errorThrown.status + "]");
    } else if (errorThrown.status == "404") {
      alert("no such route found" + "[" + errorThrown.status + "]");
    }else{
      alert("Error could not connect to url");
      console.log(xhr.statusText);
      console.log(textStatus);
      console.log(errorThrown.responnseText);
    }
    
  })
}




//TODO add passable name here aswell
/**
 * @param url
 */
FnConn.prototype.initializeSession = function (url,requestedRoute) {
  router.requestedRoute = requestedRoute;
  this.currUrl = url;

  if (sessionStorage.getItem("skey") == undefined || null) {

    console.log("SESSION NOT ACTIVE")
    //populate session based on url    
    let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);
    fnDb.transaction(function (tx) {
      tx.executeSql('SELECT * FROM servers WHERE url = ?', [url], function (tx, results) {
        console.log("initializing session");

        //store new session details
        self.connect(results.rows.item(0).url, results.rows.item(0).naun, results.rows.item(0).napw);
       
      });
    }, function (tx, error) {
      console.log("no such server")
    });
  } else {
    console.log("SESSION ACTIVE");
    router.routeToPage(this.requestedRoute);
  }


  apiRoute = url + "/alerts";
  let self = this;


  //check session from db 
  // let jqxhr = $.get(apiRoute, { fn_sid: sid, fn_skey: skey }, function (data) {
  //   console.log("session still valid")
  //   sessionStorage.setItem("sid", sid);
  //   sessionStorage.setItem("skey", skey);
  //   sessionStorage.setItem("url", url);

  // }, "json");

  // /**
  //  * entry point
  //  */
  // router.routeToPage(router.requestedPage);

  // /*
  // Request failed
  // */
  // jqxhr.fail(function (errorThrown) {

  //   console.log(errorThrown);
  //   console.log(errorThrown.status);

  //   if (errorThrown.status == 403) {
  //     console.log("session no longer valid, retrieving new session")

  //     let getLoginDetails = function (url) {
  //       let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);

  //       fnDb.transaction(function (tx) {
  //         console.log(url);
  //         tx.executeSql('SELECT * FROM servers WHERE url = ?', [url], function (tx, results) {
  //           console.log(results.rows.item(0).url);
  //           console.log(results.rows.item(0).naun);
  //           self.connect(results.rows.item(0).url, results.rows.item(0).naun, results.rows.item(0).napw);
  //         });
  //       });
  //     }


  //     getLoginDetails(url);
  //   } else {

  //   }

  // });
}

FnConn.prototype.removeSession = function () {
  console.log("clearing session")
  sessionStorage.clear();
}





FnConn.prototype.query = function (route, id) {

  this.route = route;
  let apiRoute;

    console.log("checking session")
   this.initializeSession(sessionStorage.getItem("url"),route);
   
    if (id === undefined) {
      apiRoute = this.currUrl + "/" + route;
      console.log("api route -> " + apiRoute);
    } else {
      apiRoute = this.currUrl + "/" + route + "/" + id;
      console.log("api route -> " + apiRoute);
    }


    $.get(apiRoute, { fn_skey: sessionStorage.getItem("skey"), fn_sid: sessionStorage.getItem("sid") }, function (data) {
      console.log(data.error);
      dataDependentRouter(data);

    }, "json");
    //TODO add error code  for routes

    dataDependentRouter = function (data) {
      console.log("route" + route);
      console.log("Current page herde " + router.currPage);
      switch (route) {
        case 'nodes':
          router.currPage = "nodes";
          console.log(router.currPage + " is curr page");
          //new node view passing in node data
          let nodeListViewObj = new NodeListView(data);

          break;
        case 'node':
          router.currPage = "node";
          //console.log(data);
          let testListViewObj = new TestListView(data);
      }
    }

  }





















