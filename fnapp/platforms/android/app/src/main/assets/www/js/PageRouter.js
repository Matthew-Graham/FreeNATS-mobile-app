
/**
 * 
 * 
 */
function PageRouter() {
    self = this;
    currPage = "-1";
    previousPage = "-1";
}

/**
 * controls displaying of content
 * @param {id of page to route} route 
 */
PageRouter.prototype.routeToPage = function (route, route2, data) {

    //TODO remove server login after moving the function
    //TODO possible add conditionals to arrays - 1st level 2nd level allowing easy adding of new pages 

    console.log("ROUTING TO ---"+route)
    console.log("CURRENT PAGE--- "+this.currPage)


    /*
    arrays representing what nav bar is displayed depending on the current
    page and the page a user wants to go to 
    any new additional pages should be added to at least 1 of these arrays
    */
    let initialUiLevel = ["servers", "serverLogin","modifyServer"];
    let nestedUiLevel =["tests","nodes","node","alerts","groups"];
   
    /*if route is an initial ui level and currpage is an initial ui level keep 
    nav bar
    */
    if (initialUiLevel.includes(route) && initialUiLevel.includes(this.currPage)) {
        console.log("keeping level 1 nav ");
    /*
    If route is initial ui level and current page is a nested ui level create new initial nav
    */
    }else if(initialUiLevel.includes(route)&&nestedUiLevel.includes(this.currPage)){
        console.log("create level 1 nav ");    
        let nav1 = new NavbarView(1);
    }else{
        console.log("create level 2 nav ");  
        let nav = new NavbarView(2);
    }



    if (route == "tests") {
        f1 = new FnConn();
        f1.query("node", route2);

        $(".tab-item").on('click', function (event) {
            let id = this.id;
            event.stopPropagation();
            event.stopImmediatePropagation();
            console.log(id);
            self.routeToPage(id);
        });

    } else if (route == "nodes") {
        
        console.log("Node page here " + this.currPage);
        f1 = new FnConn();
        f1.query("nodes");

        this.currPage = "nodes";
        // $(".tab-item").on('click', function (event) {
        //     let id = this.id;

        //     if(id=="nodes"){
        //         console.log("on nodes");
        //     }else{
        //         event.stopPropagation();
        //         event.stopImmediatePropagation();
        //         console.log("here"+id);
        //         self.routeToPage(id);
        //     }

        // });

    } else if (route == "alerts") {
        this.currPage = "alerts";
        let alertsTemplate = Handlebars.compile($("#alertsTemplate").html());
        let context = { name: "home", };
        let alertsHTML = alertsTemplate(context);
        $(".content-padded").html(alertsHTML);

    } else if (route == "servers") {
        this.currPage = "servers";     
        // $(".bar.bar-tab").html(Handlebars.compile($("#navBar1Template").html()));
        //if unchanged server list  use previous  if not gen new one 
        let servers = new FnServerView();

    } else if (route == "serverLogin") {
        this.currPage = "serverLogin";
        let name;
        let sid;
        let skey;
        let url;

        for (let server of data.servers) {

            console.log(server.url);
            console.log(route2);

            if (server.url === route2) {
                url = server.url;
                name = server.name;
                sid = server.sid;
                console.log(sid);
                skey = server.skey;
            }
        }

        FnConnObj = new FnConn();
        FnConnObj.initializeSession(url, sid, skey);

        // $(".bar.bar-tab").html(Handlebars.compile($("#navBarTemplate").html()));
        //if unchanged server list  use previous  if not gen new one 


        sessionStorage.setItem("url", url);
        sessionStorage.setItem("serverName", name);

        /**
         * Set Entry point page when connecting to a server
         */
        //this.routeToPage("nodes");
    } else if (route == "modifyServer") {
       let test = new ServerDetailsView(1);
    }
}


