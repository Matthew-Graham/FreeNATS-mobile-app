/**
 * Object handling logic for server list page
 */
function FnServerView() {

    //TODO check if server list unchanged
    this.serverList = [];
    this.fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);

    //calls compile internally and attach events as web sql asycnhronous
    this.getServers();
}


/**
 * Compiles template with serverlist and adds to dom
 * events are then attached to the dom
 */
FnServerView.prototype.compile = function(serverList) {
    let serverTmplFunction = Handlebars.compile($("#homeTemplate").html());
    let html2 = serverTmplFunction(serverList);
    $(".content-padded").html(html2);
    this.attachEvents();

    /*Header */
    let headerTemplate = Handlebars.compile($("#headerTemplate").html());
    let context = { title: "Your servers" };
    let headerHTML = headerTemplate(context);
    $("#topHeader").html(headerHTML);
}

/**
 * events added for navigation to nodes page, edit server details page
 * if edit server details page is clicked retrieves extra server info
 *  and passes it to the edit server details page
 */
FnServerView.prototype.attachEvents = function() {
    $(".table-view-cell").on('click', function(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        let serverUrl = this.id;
        app.fnConnObj.currUrl = serverUrl;
        app.router.routeToPage({ path1: "nodes" });
    });

    $(".editServer").on('click', function(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        let url = this.parentElement.id;
        console.log("server ID " + url);

        let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);
        fnDb.transaction(function(tx) {
            tx.executeSql('SELECT * FROM servers WHERE url = ?', [url], function(tx, results) {
                let i = 0;
                let tmpName = results.rows.item(i).serverName;
                let tmpUrl = results.rows.item(i).url;
                let tmpUsr = results.rows.item(i).naun;
                let tmpPass = results.rows.item(i).napw;
                let tmpServer = { name: tmpName, url: tmpUrl, usr: tmpUsr, pass: tmpPass };
                let changeServerObj = new ServerDetailsView(2, tmpServer);
            }, null);
        }, function(error) {
            console.log("SQL Transaction error  getting server details Message:" + error.message)
        });
    });
}


/**
 * Get servername and url from db
 */
FnServerView.prototype.getServers = function() {
    let self = this;
    this.fnDb.transaction(function(tx) {
        tx.executeSql('SELECT * FROM servers', [], function(tx, results) {
            var len = results.rows.length,
                i;

            for (i = 0; i < len; i++) {
                let tmpName = results.rows.item(i).serverName;
                let tmpUrl = results.rows.item(i).url;
                let tmpServer = { name: tmpName, url: tmpUrl }
                self.serverList.push(tmpServer);
            }

            //list complete pass to compile 
            self.compile(self.serverList);
        }, null);
    }, function(error) {
        console.log("SQL Transaction error in serverlistview Message:" + error.message)
    });
}