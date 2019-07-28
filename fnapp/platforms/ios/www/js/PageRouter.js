/**
 * 
 * Object that handles routing to another page
 * maintains state of curr page and next page 
 * defaults to the servers page
 */
function PageRouter() {
    self = this;
    currPage = "servers";

    //previous page not in use -- potential feature using back button on devices
    previousPage = "-1";
    requestedPage = "servers";

    /*
    arrays representing what nav bar is displayed depending on the current
    page and the page a user wants to go to 
    any new additional pages should be added to at least 1 of these arrays
    */
    this.initialUiLevel = ["servers", "serverLogin", "modifyServer", "settings"];
    this.nestedUiLevel = ["test", "tests", "nodes", "node", "alerts", "groups", "sysvarread", "group"];

}

/**
 * controls displaying of content
 * @param {id of page to route} route 
 */
PageRouter.prototype.routeToPage = function(routeObj) {
    this.requestedPage = routeObj.path1;
    let route = routeObj.path1;
    let route2 = routeObj.path2;

    //TODO remove server login after moving the function
    console.log("CURRENT PAGE--- " + this.currPage);
    console.log("ROUTING TO ---" + route);


    //if route is an initial ui level and currpage is an initial ui level keep  nav bar   
    if (this.initialUiLevel.includes(this.requestedPage) && this.initialUiLevel.includes(this.currPage)) {
        console.log("keeping initial nav bar ");

        //If route is initial ui level and current page is a nested ui level create new initial nav  
    } else if (this.initialUiLevel.includes(this.requestedPage) && this.nestedUiLevel.includes(this.currPage)) {
        console.log("creating intial nav bar");
        let nav1 = new NavbarView(1);

        //If route is nested and current page is initial create new new nested nav bar
    } else if (this.initialUiLevel.includes(this.currPage) && this.nestedUiLevel.includes(this.requestedPage)) {
        console.log("creating nested nav bar");
        let nav = new NavbarView(2);

    } else if (this.nestedUiLevel.includes(this.currPage) && this.nestedUiLevel.includes(this.requestedPage)) {
        //keep level 2
        console.log("keeping nested nav bar")
    } else {
        console.log("Error determining what navigation bar to display")
    }


    if (route == "tests") {
        app.fnConnObj.query({ path1: "node", path2: route2 });


    } else if (route == "nodes") {
        app.fnConnObj.query({ path1: "nodes" });
        this.currPage = "nodes";

    } else if (route == "alerts") {
        app.fnConnObj.query({ path1: route })

    } else if (route == "servers") {
        this.currPage = "servers";
        let servers = new FnServerView();
        localStorage.clear();

    } else if (route == "settings") {
        this.currPage = "settings";
        let settings = new SettingsView();

    } else if (route == "modifyServer") {
        let test = new ServerDetailsView(1);
    } else if (route == "test") {
        app.fnConnObj.query({ path1: route, path2: route2, path3: "data" });

    } else if (route == "groups") {
        app.fnConnObj.query({ path1: route });

    } else if (route == "group") {
        app.fnConnObj.query({ path1: route, path2: route2 });

    } else if (route == "sysvarread") {
        app.fnConnObj.sysVarsQry({ path1: route });

    } else {
        let servers = new FnServerView();
        alert("ROUTING ERROR. The route " + route + " doesnt not exist");
    }
}