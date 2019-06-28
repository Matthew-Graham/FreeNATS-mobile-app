function NodeListView(nodeList) {
  router.currPage = "nodes";

  //check session method

  console.log("NODE PAGE---" + router.currPage)
  console.log(nodeList);
  this.nodeList = nodeList;
  this.compile();
  this.attachEvents();
}

NodeListView.prototype.compile = function () {

  Handlebars.registerHelper('statusColour', function (status) {
    if (status == "Passed") {
      return new Handlebars.SafeString("badge badge-positive");
    } else if (status == "Failed") {
      return new Handlebars.SafeString("badge badge-negative");
    } else if (status == "Warning") {
      return new Handlebars.SafeString("badge badge-primary");
    } else {
      return new Handlebars.SafeString("status colour error");
    }
  });

  Handlebars.registerHelper('nodeEnabled', function (enabled) {
    if (enabled == "1") {
      return new Handlebars.SafeString("enabled");
    } else {
      return new Handlebars.SafeString("disabled");
    }
  });

  
  Handlebars.registerHelper('nodeEnabledColour', function (enabled) {
    if (enabled == "1") {
      return new Handlebars.SafeString("btn-positive");
    } else {
      return new Handlebars.SafeString("btn-negative");
    }
  });



  let nodeListTemplate = Handlebars.compile($("#nodesTemplate").html());
  let nodeHtml = nodeListTemplate(this.nodeList);
  $(".content-padded").html(nodeHtml);

  /**
   * Nav bar 
   */
  //let nav =  new NavbarView();

  /**Header */
  let headerTemplate = Handlebars.compile($("#headerTemplate").html());
  let context = { title: sessionStorage.getItem("serverName") };
  let headerHTML = headerTemplate(context);
  $("#topHeader").html(headerHTML);

}

NodeListView.prototype.attachEvents = function () {
  $(".table-view-cell").on('click', function (event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    let nodeid = this.id;
    let pageid = "tests";
    // pRouter = new PageRouter();   
    router.routeToPage({path1:pageid, path2:nodeid});
  });

  $(".nodebutton").on('click', function (event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    let nodeid = this.id

    if($(this).attr("value")=="enabled"){
       fnConnObj.query({path1:"node",path2:nodeid,path3:"disable"})
       console.log("disable")
    }else{
      fnConnObj.query({path1:"node",path2:nodeid,path3:"enable"})
      console.log("enable")
    }

    console.log("child" + nodeid)
   
  });
}

