function NodeListView(nodeList) {
  router.currPage = "nodes";
  console.log("NODE PAGE---"+router.currPage)
  this.nodeList = nodeList;
  this.compile();
  this.attachEvents();
}

NodeListView.prototype.compile = function () {
  let nodeListTemplate = Handlebars.compile($("#nodesTemplate").html());
  let nodeHtml = nodeListTemplate(this.nodeList);
  $(".content-padded").html(nodeHtml);

  /**
   * Nav bar 
   */
   //let nav =  new NavbarView();

   /**Header */
   let headerTemplate = Handlebars.compile($("#headerTemplate").html());
   let context = {title:sessionStorage.getItem("serverName")};
   let headerHTML = headerTemplate(context);
   $("#topHeader").html(headerHTML);
   
}

NodeListView.prototype.attachEvents = function () {
  $(".table-view-cell").on('click', function (event) {
    let nodeid = this.id;
    let pageid = "tests";
   // pRouter = new PageRouter();   
    router.routeToPage(pageid,nodeid);
  });
}

