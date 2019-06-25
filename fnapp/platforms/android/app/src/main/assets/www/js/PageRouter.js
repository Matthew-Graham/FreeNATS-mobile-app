
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
PageRouter.prototype.routeToPage = function (routeObj) {

    let route = routeObj.path1;
    let route2 =routeObj.path2;

    //TODO remove server login after moving the function
    console.log("CURRENT PAGE--- "+this.currPage);
    console.log("ROUTING TO ---"+route);

    /*
    arrays representing what nav bar is displayed depending on the current
    page and the page a user wants to go to 
    any new additional pages should be added to at least 1 of these arrays
    */
   //TODO Change to constants
    this.initialUiLevel = ["servers", "serverLogin","modifyServer"];
    this.nestedUiLevel =["tests","nodes","node","alerts","groups"];

    
    //Check session for these pages
    if(this.nestedUiLevel.includes(route)){
        //console.log("checking session")
         //fnConnObj.initializeSession(sessionStorage.getItem("url"));
    }else if(this.initialUiLevel.includes(route)){
        fnConnObj.removeSession();
        //remove session
    }
   





   
    /*if route is an initial ui level and currpage is an initial ui level keep 
    nav bar
    */
    if (this.initialUiLevel.includes(route) && this.initialUiLevel.includes(this.currPage)) {
        console.log("keeping level 1 nav ");
    /*
    If route is initial ui level and current page is a nested ui level create new initial nav
    */
    }else if(this.initialUiLevel.includes(route)&&this.nestedUiLevel.includes(this.currPage)){
        console.log("create level 1 nav ");    
        let nav1 = new NavbarView(1);
    }


    if (route == "tests") {
        
       
        fnConnObj.query({path1:"node", path2:route2});

        // $(".tab-item").on('click', function (event) {
        //     let id = this.id;
        //     event.stopPropagation();
        //     event.stopImmediatePropagation();
        //     console.log(id);
        //     self.routeToPage(id);
        // });

    } else if (route == "nodes") {         
        fnConnObj.initializeSession(sessionStorage.getItem("url"),routeObj);
        //fnConnObj.query("nodes");
        this.currPage = "nodes";
 

    } else if (route == "alerts") {
        fnConnObj.query({path1:route})

    } else if (route == "servers") {
        this.currPage = "servers";     
        // $(".bar.bar-tab").html(Handlebars.compile($("#navBar1Template").html()));
        //if unchanged server list  use previous  if not gen new one 
        let servers = new FnServerView();

    
    } else if (route == "modifyServer") {
       let test = new ServerDetailsView(1);
    }else if(route == "test"){
        fnConnObj.query({path1:route, path2:route2 , path3:"data"})
        //let testGraphViewobj = new TestGraphView();
    }else if(route == "groups"){
        fnConnObj.query({path1:route})
    }else{
        $(".content-padded").html("ROUTING ERROR. The route "+route+" doesnt not exist");
    }
}


