function TestListView(testListData){
    this.testListData = testListData; 
    this.compile();
}

TestListView.prototype.compile = function(){
    let testListTemplate = Handlebars.compile($("#testListTemplate").html());
    let testListHtml = testListTemplate(this.testListData);
    $(".content-padded").html(testListHtml);
}