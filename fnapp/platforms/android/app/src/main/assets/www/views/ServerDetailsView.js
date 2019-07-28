/**
 * An object controlling the display and logic of the serverdetails page 
 * @param {int} templateNumber controls what template to display
 * @param {Object} tempServer a particular servers details usr,pass,url 
 */
function ServerDetailsView(templateNumber, tempServer) {
    app.router.currPage = "modifyServer";
    this.oldUrl;

    /**
     * If modify template keep the old url for querying later 
     */
    if (templateNumber == 2) {
        this.oldUrl = tempServer.url;
    }

    this.compile(tempServer, templateNumber);
    this.attachEvents();
}

/**
 * Compiles the server details template with group data and adds it to the dom
 * @param  {Object} tempServer
 * @param  {int} templateNumber
 */
ServerDetailsView.prototype.compile = function(tempServer, templateNumber) {

    /*if modifying server details populate fields*/
    if (templateNumber == 2) {
        let serverDetailsTemplate = Handlebars.compile($("#serverConnDetailsTemplate").html());
        let serverDetailsHtml = serverDetailsTemplate(tempServer);
        $(".content-padded").html(serverDetailsHtml);

        /*if adding a new server empty fields*/
    } else if (templateNumber == 1) {

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

/**
 * Handles the validation of inputted data for entering a new server 
 * @param  {string} serverName
 * @param  {string} url
 * @param  {string} usr
 * @param  {string} pass
 * 
 * @returns {boolean} true is valid input
 */
ServerDetailsView.prototype.validateInput = function(serverName, url, usr, pass) {

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

/**
 * Persists new server to servers table 
 * 
 * @param  {string} serverName
 * @param  {string} url
 * @param  {string} usr
 * @param  {string} pass
 */
ServerDetailsView.prototype.persistNewServer = function(serverName, url, usr, pass) {
    let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);

    fnDb.transaction(function(tx) {
        tx.executeSql('INSERT INTO servers (serverName,url,naun,napw) VALUES (?,?,?,?)', [serverName, url, usr, pass], function(tx, results) {
            app.router.routeToPage({ path1: "servers" });
        }, null);
    }, function(error) {
        console.log("SQL Transaction error in server details view Message:" + error.message)
    });
}



/**
 * Persists updated server to servers table 
 * 
 * @param  {string} serverName
 * @param  {string} url
 * @param  {string} usr
 * @param  {string} pass
 */
ServerDetailsView.prototype.persistUpdatedServer = function(oldUrl, serverName, url, usr, pass) {
    let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);

    fnDb.transaction(function(tx) {
        tx.executeSql('UPDATE servers SET serverName = ?,url = ?,naun = ?, napw = ? WHERE url = ?', [serverName, url, usr, pass, oldUrl], function(tx, result) {

            //clear cookies as new login details 
            app.fnConnObj.clearCookies();
            app.router.routeToPage({ path1: "servers" });
        }, null);


    }, function(error) {
        console.log("SQL Transaction error in persist updated server  view Message:" + error.message)
    });
}

/**
 * Removes the server from the database
 * @param  {String} serverUrl url of the server to be deleted
 */
ServerDetailsView.prototype.deleteServer = function(serverUrl) {
    let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);


    fnDb.transaction(function(tx) {
        tx.executeSql('DELETE FROM servers WHERE url = ?', [serverUrl], function(tx, result) {
            app.fnConnObj.clearCookies();
            app.router.routeToPage({ path1: "servers" });
        }, null);


    }, function(error) {
        console.log("SQL Transaction error trying to delete server  view Message:" + error.message)
    });
}

/**
 * Attachs events for adding or editng a server, redirects page to servers after either
 */
ServerDetailsView.prototype.attachEvents = function() {
    let self = this;

    $("#submit").on('click', function(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        let eventType = this.innerHTML;

        let url = $("#fnurl").val();
        let serverName = $("#serverName").val();
        let usr = $("#username").val();
        let pass = $("#password").val();

        if (eventType == "add") {

            let validSubmission = self.validateInput(serverName, url, usr, pass);

            if (validSubmission) {
                alert("Adding Server");
                self.persistNewServer(serverName, url, usr, pass);
            }

        } else if (eventType == "modify") {
            let validSubmission = self.validateInput(serverName, url, usr, pass);

            if (validSubmission) {
                alert("Modifying Server");
                self.persistUpdatedServer(self.oldUrl, serverName, url, usr, pass);
            }
        }
    });


    $("#delete").on('click', function(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        let url = $("#fnurl").val();
        alert("Deleting server");
        self.deleteServer(url);


    });
}