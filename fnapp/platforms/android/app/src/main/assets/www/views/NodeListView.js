function NodeListView(nodeList) {
  router.currPage = "nodes";

  //check session method

  console.log("NODE PAGE---" + router.currPage)
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
    let nodeid = this.id;
    let pageid = "tests";
    // pRouter = new PageRouter();   
    router.routeToPage(pageid, nodeid);
  });
}

