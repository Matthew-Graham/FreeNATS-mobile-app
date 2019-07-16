function FnServerView() {

    //TODO check if server list unchanged

    let serverList = [];
    let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);
    let FnServers = {
        servers: serverList
    };

    function Server(name1, url, sid, skey) {

        this.name = name1;
        this.url = url;
        this.sid = sid;
        this.skey = skey;
    }

    /**
     * Get servername and url from db
     */
    fnDb.transaction(function(tx) {
        tx.executeSql('SELECT * FROM servers', [], function(tx, results) {
            var len = results.rows.length,
                i;

            for (i = 0; i < len; i++) {
                let tmpName = results.rows.item(i).serverName;
                let tmpUrl = results.rows.item(i).url;
                let tmpSkey = results.rows.item(i).skey;
                let tmpSid = results.rows.item(i).sid;
                let tmpServer = new Server(tmpName, tmpUrl, tmpSid, tmpSkey)
                serverList.push(tmpServer);
            }

            //pass servers to display function
            displayServerList(FnServers);
        }, null);



    }, function(error) {
        console.log("SQL Transaction error in serverlistview Message:" + error.message)
    });

    // fnDb.transaction(function (tx) {
    //   tx.executeSql('DROP TABLE servers');
    // });

    function displayServerList(serverList) {


        let serverTmplFunction = Handlebars.compile($("#homeTemplate").html());
        let html2 = serverTmplFunction(serverList);

        $(".content-padded").html(html2);

        //events
        $(".table-view-cell").on('click', function(event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            let serverUrl = this.id;
            let name = $(this).find("b").attr('id');
            console.log("here")
                //default page after servers clicked
            sessionStorage.setItem("url", serverUrl);
            sessionStorage.setItem("serverName", name);

            //app.fnConnObj.initializeSession(serverUrl, {path1:"nodes"} );
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
                    console.log("wew" + tmpName);


                    //pass servers to display function
                    let changeServerObj = new ServerDetailsView(2, tmpServer);
                }, null);



            }, function(error) {
                console.log("SQL Transaction error  getting server details Message:" + error.message)
            });


        });




        /*Header */
        let headerTemplate = Handlebars.compile($("#headerTemplate").html());
        let context = { title: "Your servers" };
        let headerHTML = headerTemplate(context);
        $("#topHeader").html(headerHTML);
    }



    function displayFurtherServerDetails() {
        let a = new FnConn();
        let results = a.query("alerts");
        $(".content-padded").html(results);
        console.log("the resuly" + results);
    }



    function viewServer() {

    }


    function editServer() {
        event.preventDefault();
        //display add new server
    }
}