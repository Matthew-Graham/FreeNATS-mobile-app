function GroupListView(groupListData){
    this.groupListData = groupListData; 
    this.compile();
    this.attachEvents();
}

GroupListView.prototype.compile = function(){

  if(this.groupListData.groups.length>0){

  Handlebars.registerHelper('groupStatusColour', function (status) {
        if (status == "Passed") {
          return new Handlebars.SafeString("badge badge-positive");
        } else if (status == "Failed") {
          return new Handlebars.SafeString("badge badge-negative");
        } else if (status == "Warning") {
          return new Handlebars.SafeString("badge badge-primary");
        } else if (status== "Untested"){
            return new Handlebars.SafeString("badge badge-outlined");
        }    
        else{
          return new Handlebars.SafeString("status colour error");
        }
      });
  }

    
    
      let groupListTemplate = Handlebars.compile($("#groupListTemplate").html());
      let groupListHtml = groupListTemplate(this.groupListData);
      $(".content-padded").html(groupListHtml);
    }

GroupListView.prototype.attachEvents = function () {
  $(".table-view-cell").on('click', function (event) {
    let pageid = "group";
    // pRouter = new PageRouter();   
    app.router.routeToPage({path1:pageid,path2:this.id});
    console.log(this.id);
  });
}


