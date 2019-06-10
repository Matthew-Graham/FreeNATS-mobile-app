function ServerDetailsView(templateNumber) {

    router.currPage = "modifyServer";
    this.templateNumber = templateNumber;
    this.compile();
    this.attachEvents();
    self = this;

}
ServerDetailsView.prototype.compile = function () {

    /*if modifying server details populate fields*/
    if (this.templateNumber == 2) {
        let serverDetailsTemplate = Handlebars.compile($("#serverConnDetailsTemplate").html());
        let serverDetailsHtml = serverDetailsTemplate();
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
        
    }else if ( pass ===undefined || pass===""){
        alert("Enter a password");
        return false;
    
    }else if(url===undefined || url ===""){
        alert("Enter a url");
        return false;
    }
    //check url if duplicate
    console.log(serverName);
    return true;
}


ServerDetailsView.prototype.persistServer = function (serverName, url, usr, pass) {
    let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);

    fnDb.transaction(function (tx) {

        tx.executeSql('INSERT INTO servers (serverName,url,naun,napw,sid,skey) VALUES (?,?,?,?,?,?)', 
        [serverName,url,usr,pass,"-1","-1"], function (tx, results) {
            router.routeToPage("servers");
        }, null);   


      }, function (error) {
        console.log("SQL Transaction error in server details view Message:"+error.message)});
}


ServerDetailsView.prototype.attachEvents = function () {
    let self = this;

    $("#submit").on('click', function (event) {
        let id = this.id;
        event.stopPropagation();
        event.stopImmediatePropagation();
        console.log("Attempted server details modification" + id);

        let url = $("#fnurl").val();
        let serverName = $("#serverName").val();
        let usr = $("#username").val();
        let pass = $("#password").val();
        console.log(url);

        let validSubmission = self.validateInput(serverName, url, usr, pass);

        if (validSubmission) {
            alert("Adding Server");
            self.persistServer(serverName, url, usr, pass);

        }

        //    if(validSubmission===true){
        //        self.routeToPage(id);
        //    }else{

        //    }

    });
}
