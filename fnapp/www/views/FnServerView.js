function FnServerView() {

  //TODO check if server list unchanged
  
  let serverList = [];
  let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);
  let FnServers = {
    servers: serverList
  };

  function Server(name1, url,sid,skey) {

    this.name = name1;
    this.url = url;
    this.sid = sid;
    this.skey = skey;
  }

  /**
   * Get servername and url from db
   */
  fnDb.transaction(function (tx) {
    tx.executeSql('SELECT * FROM servers', [], function (tx, results) {
      var len = results.rows.length,
        i;
   
      for (i = 0; i < len; i++) {            
        let tmpName = results.rows.item(i).serverName;
        let tmpUrl = results.rows.item(i).url;
        let tmpSkey = results.rows.item(i).skey;
        let tmpSid = results.rows.item(i).sid;
        let tmpServer = new Server(tmpName, tmpUrl,tmpSid,tmpSkey)
        serverList.push(tmpServer);
      }

      //pass servers to display function
      displayServerList(FnServers);
    }, null);



  }, function (error) {
    console.log("SQL Transaction error in serverlistview Message:"+error.message)});

  // fnDb.transaction(function (tx) {
  //   tx.executeSql('DROP TABLE servers');
  // });

function displayServerList(serverList) {


  let serverTmplFunction = Handlebars.compile($("#homeTemplate").html());
  let html2 = serverTmplFunction(serverList);

  $(".content-padded").html(html2);

  //events
  $(".table-view-cell").on('click', function (event) {

    
    let serverUrl = this.id;
    

    //grab session data if it exists if not new connection
    //doesn't exist

    //query 




   //check if sid and skey still valid
    let name = this.innerHTML;
    let pageid = "serverLogin";
    
    event.stopPropagation();
    event.stopImmediatePropagation();
    console.log(pageid);
    sessionStorage.setItem("url",serverUrl);
    sessionStorage.setItem("serverName",name);
    router.routeToPage(pageid,serverUrl,serverList);
  });


  $("#editServer").on('click', function (event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    let url=  this.parentElement.id ;
    console.log("server ID "+url);
    
    let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);
    
    fnDb.transaction(function (tx) {
      tx.executeSql('SELECT * FROM servers WHERE url = ?', [url], function (tx, results) {
          let i = 0 ;
          let tmpName = results.rows.item(i).serverName;
          let tmpUrl = results.rows.item(i).url;
          let tmpUsr = results.rows.item(i).naun;
          let tmpPass = results.rows.item(i).napw;
          let tmpServer = {name:tmpName, url:tmpUrl,usr:tmpUsr,pass:tmpPass};
          console.log("wew" +tmpName);
        
  
        //pass servers to display function
        let changeServerObj = new ServerDetailsView(2,tmpServer);
      }, null);
  
  
  
    }, function (error) {
      console.log("SQL Transaction error  getting server details Message:"+error.message)});


  });




  /*Header */
   let headerTemplate = Handlebars.compile($("#headerTemplate").html());
   let context = {title:"Your servers"};
   let headerHTML = headerTemplate(context);
   $("#topHeader").html(headerHTML);





 // $(".tab-item #addServer").click(addServer);

}



function displayFurtherServerDetails() {
  let a = new FnConn();
  let results = a.query("alerts");
  $(".content-padded").html(results);
  console.log("the resuly" + results);
}

function addServer() {

  /**
   * Form for server details entry
   */
  event.preventDefault();
  let serverDetails = new ServerDetailsView(1);

  //let hfunction = Handlebars.compile($("#serverConnDetailsTemplate").html());
 // $(".content-padded").html(hfunction);

  //event on connect click 
  $("#submit").click(function () {

    let usr = $("#username").val();
    let pass = $("#password").val();
    let url = $("#fnurl").val();
    let name = $("#serverName").val();


    let loginConn = new FnConn("admin", "admin", "http://natsapi.altair.davecutting.uk/jsonapi.php/login");
    loginConn.connect;


    //validation here

    let fnDb = window.openDatabase("fnDb", 1, "fnServerStore", 5000000);

    var serverData = [name, url, usr, pass];

    //if saved password is clicked 
    fnDb.transaction(function (tx) {
      tx.executeSql('INSERT INTO fnServer (name,url,naun,napw) VALUES (?,?,?,?)', serverData);
    });

  });
}

function viewServer() {
  //   /**
  //  * Form for server details entry
  //  */
  // event.preventDefault();
  // let hfunction = Handlebars.compile($("#serverConnDetailsTemplate").html());
  // $(".content-padded").html(hfunction);

  // //event on connect click 
  // $("#submit").click(function (){

  //     let usr = $("#username").val();
  //     let pass = $("#password").val();
  //     let url = $("#fnurl").val();

  //     //validation here

  //     let loginConn = new FnConn(usr,pass,url);
  //     loginConn.connect;
  // });
}


function editServer() {
  event.preventDefault();
  //display add new server
}
}

 // /**
  //  * Validate input and insert
  //  */
  // function checkName() {

  //   fnDb.transaction(function (tx, nameCheck) {

  //     tx.executeSql('SELECT * FROM servers WHERE serverName = ?', [name], function (tx, results, ) {
  //       var len = results.rows.length;

  //       if (len == 0) {
  //         let serverData = [name, url, naun, napw];
  //         console.log(serverData);
  //         tx.executeSql('INSERT INTO servers (serverName, url,naun,napw) VALUES (?,?,?,?)', serverData);
  //       } else {

  //         //logic to when name already exists 
  //         alert(name + "aleady exists");
  //       }
  //     }, null);
  //   });
  // }

  // checkName();
