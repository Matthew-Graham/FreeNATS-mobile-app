function ServerDetailsView(templateNumber, tempServer) {

    this.tempServer = tempServer;
    app.router.currPage = "modifyServer";
    this.templateNumber = templateNumber;
    this.compile();
    this.attachEvents();
    self = this;

}
ServerDetailsView.prototype.compile = function () {

    /*if modifying server details populate fields*/
    if (this.templateNumber == 2) {
        console.log(this.tempServer.url)

        //pass it to context

        let serverDetailsTemplate = Handlebars.compile($("#serverConnDetailsTemplate").html());
        let serverDetailsHtml = serverDetailsTemplate(this.tempServer);
        $(".content-padded").html(serverDetailsHtml);

        /*if adding a new server empty fields*/
    } else if (this.templateNumber == 1) {

        /*Add header for adding a new server*/
        let headerTemplate = Handlebars.compile($("#headerTemplate").html());
        let context = { title: "Add a server" };
        let headerHTML = headerTemplate(context);
        $("#topHeader").html(headerHTML);



        let serverDetailsTemplate = Handlebars.compile($("#serverConnDetailsTemplate").html());
        let serverDetailsHtml = serverDetailsTemplate();
        $(".content-padded").html(serverDetailsHtml);
    }
}


ServerDetailsView.prototype.validateInput = function (serverName, url, usr, pass) {

    //check empty fields etc
    if (serverName === undefined || serverName === "") {
        alert("Enter a server name");
        return false;

    } else if (usr === undefined || usr === "") {
        alert("Enter a user name");
        return false;

    } else if (pass === undefined || pass === "") {
        alert("Enter a password");
        return false;

    } else if (url === undefined || url === "") {
        alert("Enter a url");
        return false;
    }
    //check url if duplicate
    console.log(serverName);
    return true;
}


ServerDetailsView.prototype.persistNewServer = function (serverName, url, usr, pass) {
    let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);

    fnDb.transaction(function (tx) {

        tx.executeSql('INSERT INTO servers (serverName,url,naun,napw,sid,skey) VALUES (?,?,?,?,?,?)',
            [serverName, url, usr, pass, "-1", "-1"], function (tx, results) {
                app.router.routeToPage({path1:"servers"});
            }, null);


    }, function (error) {
        console.log("SQL Transaction error in server details view Message:" + error.message)
    });
}

ServerDetailsView.prototype.persistUpdatedServer = function (oldUrl,serverName, url, usr, pass) {
    let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);
   
    fnDb.transaction(function (tx) {

        tx.executeSql('UPDATE servers SET serverName = ?,url = ?,naun = ?, napw = ?, sid = -1 , skey=-1 WHERE url = ?', [serverName,url,usr,pass,oldUrl], function (tx, result) {
            console.log("query successful");
            app.router.routeToPage({path1:"servers"});
          }, null);
          
    }, function (error) {
        console.log("SQL Transaction error in persist updated server  view Message:" + error.message)
    });
}

ServerDetailsView.prototype.attachEvents = function () {
    let self = this;

    $("#submit").on('click', function (event) {

        event.stopPropagation();
        event.stopImmediatePropagation();
        let eventType = this.innerHTML;

        let url = $("#fnurl").val();
        let serverName = $("#serverName").val();
        let usr = $("#username").val();
        let pass = $("#password").val();

        if (eventType == "add") {
            console.log("Running" + eventType);
            let validSubmission = self.validateInput(serverName, url, usr, pass);

            if (validSubmission) {
                alert("Adding Server");
                self.persistNewServer(serverName, url, usr, pass);
            }

        }else if(eventType =="modify"){
            let validSubmission = self.validateInput(serverName, url, usr, pass);
            
            if (validSubmission){
                self.persistUpdatedServer(self.tempServer.url,serverName,url,usr,pass);
            }
        }

        //    if(validSubmission===true){
        //        self.routeToPage(id);
        //    }else{

        //    }

    });
}
