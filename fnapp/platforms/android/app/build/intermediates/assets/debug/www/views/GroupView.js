function GroupView(groupListData) {
    app.router.currPage = "nodes";
  
    //check session method
    this.groupListData = groupListData;
    this.compile();
    this.attachEvents();
  }
  
  GroupView.prototype.compile = function () {
  
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
  
    let groupTemplate = Handlebars.compile($("#groupTemplate").html());
    let groupHtml = groupTemplate(this.groupListData);
    $(".content-padded").html(groupHtml);
  
    /**
     * Nav bar 
     */
    //let nav =  new NavbarView();
  
    /**Header */
    // let headerTemplate = Handlebars.compile($("#headerTemplate").html());
    // let context = { title: sessionStorage.getItem("serverName") };
    // let headerHTML = headerTemplate(context);
    // $("#topHeader").html(headerHTML);
  }
  
  GroupView.prototype.attachEvents = function () {
    $(".table-view-cell").on('click', function (event) {
      let nodeid = this.id;
      let pageid = "tests";
      // pRouter = new PageRouter();   
      app.router.routeToPage({path1:pageid, path2:nodeid});
    });
  }
  
  