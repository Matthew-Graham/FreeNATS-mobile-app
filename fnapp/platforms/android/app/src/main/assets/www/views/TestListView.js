function TestListView(testListData){
    this.testListData = testListData; 
    this.compile();
    this.attachEvents();
}

TestListView.prototype.compile = function(){

    Handlebars.registerHelper('testStatusColour', function (status) {
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
    
      let testListTemplate = Handlebars.compile($("#testListTemplate").html());
      let testListHtml = testListTemplate(this.testListData);
      $(".content-padded").html(testListHtml);
    }

TestListView.prototype.attachEvents = function () {
  $(".table-view-cell").on('click', function (event) {
   
    let pageid = "test";
    // pRouter = new PageRouter();   
    app.router.routeToPage({path1:pageid,path2:this.id});
    console.log(this.id);
  });
}







   
