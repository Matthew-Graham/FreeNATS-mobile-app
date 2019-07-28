/**
 * Controls the logic for connecting to freenats apis
 * Stores info on the current url being used
 */
function FnConn() {
    let currUrl = "-1";
}



/**
 * Connects to freenats api with login information
 * 
 * @param  {string} url
 * @param  {string} name
 * @param  {string} pass
 * @param  {string} route route obj for requerying some API path after success
 */
FnConn.prototype.connect = function(url, name, pass, route) {
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

    /*
     * Successful login
     */
    jqxhr.done(function(data) {
        console.log("successful login, cookies updated");
        //cookies should be set automotically by ajax 

        /**
         * original query is run again.
         */
        if (route.path1 == "alertbackground") {
            app.fnConnObj.backgroundQuery(app.alertService.currServerIndex);
        } else {
            self.query(route);
        }
    });

    /**
     * Failed login
     */
    jqxhr.fail(function(xhr, textStatus, errorThrown) {
        console.log(xhr);
        console.log(xhr.statusText);

        if (xhr.status == "403") {
            alert("Invalid username/password" + "[" + xhr.statusText + "]");
        } else if (xhr.status == "404") {
            alert("Freenats JSON API url not found" + "[" + xhr.statusText + "]");
        } else {
            alert("Could not connect [" + xhr.status + "]" + xhr.statusText);
        }

        //default to home page on failure to login
        app.router.routeToPage({ path1: "servers" });
    })
}


/**
 * Recursively queries different system variable paths 
 * resulting in a list of system variables and values.
 * currently only 1 system variable available via api. 
 * @param  {Object} routeObj
 */
FnConn.prototype.sysVarsQry = function(routeObj) {

    let self = this;
    let sysvars = [{
        name: "site.tester.suspended",
        value: "",
    }, ];

    let index = 0;
    qry(sysvars, index);

    /**
     * 
     * recursively query through the sysyvars array
     * @param {Array} sysvars 
     * @param {int} index 
     */
    function qry(sysvars, index) {
        if (index < sysvars.length) {
            apiRoute = self.currUrl + "/sysvar/" + sysvars[index].name;
            let jqxhr = $.get(apiRoute, {}, function(data) {

                sysvars[index].value = data.value;
                console.log("SESSION ACTIVE");

                index = index + 1;
                qry(sysvars, index);
            }, "json");

            jqxhr.fail(function(error) {
                app.router.routeToPage({ path1: "servers" })
                console.log("SESSION INACTIVE");
            })
        } else {
            //end create new sys var lists
            let sysVarViewObj = new SysVarView(sysvars);
        }
    }
}

/**
 * 
 * Recursively queries the alert path of an arrray of servers 
 * using the current index 
 * @param  {int} index current index of array of servers
 */
FnConn.prototype.backgroundQuery = function(index) {

    let self = this;
    let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);
    let rowIndex = index;
    app.alertService.currServerIndex = rowIndex;

    fnDb.transaction(function(tx) {
        tx.executeSql('SELECT * FROM servers', [], function(tx, results) {

            console.log("querying server for alert");
            let apiRoute = results.rows.item(rowIndex).url + "/alerts";
            let jqxhr = $.get(apiRoute, {}, function(data) {
                console.log("SESSION details correct");
                console.log(data);


                //notification data
                let count = data.alertcount;
                let alertText = "";
                console.log("alerts" + data.alerts);

                if (data.alerts != false) {
                    data.alerts.forEach(element => {

                        let status = "status error"
                        if (element.alertlevel == 2) {
                            status = "Fail";
                        } else if (element.alertlevel == 1) {
                            status = "Warn"
                        } else {
                            status = "Pass"
                        }

                        alertText = alertText + "Node:" + element.nodeid + "(" + status + "),";
                    });

                    cordova.plugins.notification.local.schedule({
                        title: "Alerts(" + count + ")",
                        text: alertText,
                        foreground: true
                    })
                } else {
                    //no alerts do nothing
                }

                //if another server to be queried
                if (rowIndex < results.rows.length - 1) {
                    rowIndex++;
                    self.backgroundQuery(rowIndex);
                }
            }, "json");

            /**cookies fail so use login info */
            jqxhr.fail(function(error) {
                self.clearCookies();
                app.fnConnObj.connect(results.rows.item(rowIndex).url, results.rows.item(rowIndex).naun, results.rows.item(rowIndex).napw, { path1: "alertbackground" });
            });
        }, null);
    });
}

/**
 * Contains the logic for determining a route based on the route obj 
 * and querying the API for data 
 * for displaying certain pages based on a  route 
 * and for calling connect if session info fails
 * @param  {Object} routeObj contains path information for determining api route
 */
FnConn.prototype.query = function(routeObj) {

    //let self = this;

    // let route = routeObj.path1;
    // let id = routeObj.path2;
    // let path3 = routeObj.path3;
    // let data = routeObj.data;
    let apiRoute;
    routeObj.url = this.currUrl;


    /**
     * Returns a complete url with API path based on supplied paths in the route obj
     * @param  {Object} routeObj contains path information for determining api route
     */
    function determineCompleteUrl(routeObj) {

        let apiRoute;
        let route = routeObj.path1
        let id = routeObj.path2;
        let path3 = routeObj.path3;

        if (id === undefined) {

            apiRoute = routeObj.url + "/" + route;

        } else if (routeObj.path3 == "data") {

            if (routeObj.queryString1 != undefined && routeObj.queryString2 != undefined) {
                console.log("here");
                apiRoute = routeObj.url + "/" + route + "/" + id + "/data?startx=" + routeObj.queryString1 + "&finishx=" + routeObj.queryString2;

            } else if (routeObj.queryString1 != undefined) {
                apiRoute = routeObj.urll + "/" + route + "/" + id + "/data+?finishx=" + routeObj.queryString2;

            } else if (routeObj.queryString2 != undefined) {
                apiRoute = routeObj.url + "/" + route + "/" + id + "/data+?startx=" + routeObj.queryString1

            } else {
                apiRoute = routeObj.url + "/" + route + "/" + id + "/data";

            }

        } else if (routeObj.path3 == "enable" || routeObj.path3 == "disable") {

            apiRoute = routeObj.url + "/" + route + "/" + id + "/" + path3;

        } else {

            apiRoute = routeObj.url + "/" + route + "/" + id;
        }



        return apiRoute;
    }


    apiRoute = determineCompleteUrl(routeObj);
    console.log("Querying api route -> " + apiRoute);


    let jqxhr = $.post(apiRoute, {}, function(data) {
        console.log("Session still active via cookies");
        dataDependentRouter(data, routeObj);

    }, "json");


    jqxhr.fail(function(error) {

        let fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);

        fnDb.transaction(function(tx) {

            tx.executeSql('SELECT * FROM servers WHERE url = ?', [app.fnConnObj.currUrl], function(tx, results) {
                console.log("Query Failed with cookies- Retreiving and using saved login info  ");

                app.fnConnObj.connect(results.rows.item(0).url, results.rows.item(0).naun, results.rows.item(0).napw, routeObj);

            });
        }, function(tx, error) {
            console.log("no such server")
        });
    })

    /**
     * Create a certain view depending on the route specified 
     * @param  {JSON} data
     */
    dataDependentRouter = function(data, routeObj) {
        let route = routeObj.path1;

        switch (route) {
            case 'nodes':
                app.router.currPage = "nodes";
                let nodeListViewObj = new NodeListView(data);
                break;

            case 'node':
                let nodeId = routeObj.path2;
                if (routeObj.path3 == "disable") {
                    $("button[id='" + nodeId + "']").val("disabled");
                    $("button[id='" + nodeId + "']").html("disabled");
                    $("button[id='" + nodeId + "']").removeClass("btn-positive");
                    $("button[id='" + nodeId + "']").addClass("btn-negative");


                } else if (routeObj.path3 == "enable") {
                    $("button[id='" + nodeId + "']").val("enabled");
                    $("button[id='" + nodeId + "']").html("enabled");
                    $("button[id='" + nodeId + "']").removeClass("btn-negative");
                    $("button[id='" + nodeId + "']").addClass("btn-positive");

                } else {
                    app.router.currPage = "node";
                    let testListViewObj = new TestListView(data);
                }
                break;
            case 'test':
                app.router.currPage = "test"

                let testGraphViewobj = new TestGraphView(data);
                break;

            case 'alerts':
                app.router.currPage = "alerts"

                let alertViewObj = new AlertView(data);

                break;
            case 'groups':
                app.router.currPage = "groups";

                let groupListViewObj = new GroupListView(data);
                break;
            case 'group':
                app.router.currPage = "group";

                let groupViewObj = new GroupView(data);
                break;
            case 'sysvarread':
                app.router.currPage = "sysvarread";

                break;
            case 'sysvar':
                app.router.currPage = "sysvar";
                alert(routeObj.path1 + "succesfully changed")
                break;

        }
    }
}

/**
 * Code from https://www.tutorialspoint.com/How-can-I-delete-all-cookies-with-JavaScript
 */
FnConn.prototype.clearCookies = function() {

    var res = document.cookie;
    var multiple = res.split(";");
    for (var i = 0; i < multiple.length; i++) {
        var key = multiple[i].split("=");
        document.cookie = key[0] + " =; expires = Thu, 01 Jan 1970 00:00:00 UTC";
    }


    /**
     * Just in case clear cookies attempt above fails 
     * use this function belonging to cookies plugin via cordova
     */
    window.cookies.clear(function() {
        console.log('Clearing cookies');
    });


}