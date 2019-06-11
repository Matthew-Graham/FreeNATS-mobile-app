
/**
 * 
 * 
 */
function PageRouter() {
    self = this;
    currPage = "-1";
    previousPage = "-1";
    requestedPage = "-1";
}

/**
 * controls displaying of content
 * @param {id of page to route} route 
 */
PageRouter.prototype.routeToPage = function (route, route2, data) {

    //TODO remove server login after moving the function
    
    
    console.log("CURRENT PAGE--- "+this.currPage);
    console.log("ROUTING TO ---"+route);

    /*
    arrays representing what nav bar is displayed depending on the current
    page and the page a user wants to go to 
    any new additional pages should be added to at least 1 of these arrays
    */
   //TODO Change to constants
    let initialUiLevel = ["servers", "serverLogin","modifyServer"];
    let nestedUiLevel =["tests","nodes","node","alerts","groups"];

    
    //Check session for these pages
    if(nestedUiLevel.includes(route)){
        //console.log("checking session")
         //fnConnObj.initializeSession(sessionStorage.getItem("url"));
    }else if(initialUiLevel.includes(route)){
        fnConnObj.removeSession();
        //remove session
    }
   





   
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
        fnConnObj.query("node", route2);

        $(".tab-item").on('click', function (event) {
            let id = this.id;
            event.stopPropagation();
            event.stopImmediatePropagation();
            console.log(id);
            self.routeToPage(id);
        });

    } else if (route == "nodes") {      
        fnConnObj.query("nodes");
        this.currPage = "nodes";
 

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

    
    } else if (route == "modifyServer") {
       let test = new ServerDetailsView(1);
    }else{
        $(".content-padded").html("ROUTING ERROR. The route "+route+" doesnt not exist");
    }
}


