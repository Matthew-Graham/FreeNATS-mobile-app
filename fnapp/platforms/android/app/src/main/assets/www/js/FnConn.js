/**
 * pass,user,url
 */
function FnConn() {


}



FnConn.prototype.connect = function (url, name, pass) {


  let loginUrl = url + "/login";

  //retrieve from database pass and usr if saved

  // let usr = this.username;
  // let pass = this.password;

  // let usr = "admin";
  // let pass = "admin";
  // let url = "http://natsapi.altair.davecutting.uk/jsonapi.php/login";


  $.ajax({
    url: loginUrl,
    type: 'post',
    data: {
      naun: name,
      napw: pass
    },
    headers: {},
    dataType: 'json',
    success: function (data) {
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
        p1 = new PageRouter();
        
        router.routeToPage("nodes");
    }
  });
}




//TODO add passable name here aswell
FnConn.prototype.initializeSession = function (url, sid, skey) {
  apiRoute = url + "/alerts";
  let self = this;
  console.log("initializing session");

  let jqxhr = $.get(apiRoute, { fn_sid: sid, fn_skey: skey }, function (data) {
    console.log("session still valid")
    sessionStorage.setItem("sid", sid);
    sessionStorage.setItem("skey", skey);
    sessionStorage.setItem("url", url); 
    this.currPage = "nodes";
  }, "json");

  /**
   * entry point
   */
  p1 = new PageRouter();
  router.routeToPage("nodes");

  jqxhr.fail(function (errorThrown) {
    console.log(errorThrown.responseJSON.httpcode);

    if (errorThrown.responseJSON.httpcode == 403) {
      console.log("session no longer valid, retrieving new session")

      let getLoginDetails = function (url) {
        let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);

        fnDb.transaction(function (tx) {
          console.log(url);
          tx.executeSql('SELECT * FROM servers WHERE url = ?', [url], function (tx, results) {
            console.log(results.rows.item(0).url);
            console.log(results.rows.item(0).naun);      
            self.connect(results.rows.item(0).url, results.rows.item(0).naun, results.rows.item(0).napw);
          });
        });
      }


      getLoginDetails(url);
    }

  });



}


FnConn.prototype.query = function (route, id) {

  this.route = route;
  let apiRoute;

  if (id === undefined) {
    //let apiRoute = sessionStorage.getItem("url")+"/"+route;
    apiRoute = "http://natsapi.altair.davecutting.uk/jsonapi.php/" + route;

  } else {
    apiRoute = "http://natsapi.altair.davecutting.uk/jsonapi.php/" + route + "/" + id;
  }



  $.get(apiRoute, { fn_skey: sessionStorage.getItem("skey"), fn_sid: sessionStorage.getItem("sid") }, function (data) {
    console.log(data.error);
    dataDependentRouter(data);

  }, "json");




  dataDependentRouter = function (data) {
    console.log("route" + route);
  console.log("Current page herde " + router.currPage);
    switch (route) {
      case 'nodes':
        router.currPage = "nodes";
        console.log(router.currPage +" is curr page");
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




















