/**
 * Handles the logic and display of the test list page
 * @param  {JSON} testListData - contain array of tests for a certain node
 */
function TestListView(testListData) {
    this.testListData = testListData;
    this.createHelpers();
    this.compile();
    this.attachEvents();
}

/**
 * Create handle bar helper to change
 *  css class of badge depending on alert status
 */
TestListView.prototype.createHelpers = function() {

    Handlebars.registerHelper('testStatusColour', function(status) {
        if (status == "Passed") {
            return new Handlebars.SafeString("badge badge-positive");
        } else if (status == "Failed") {
            return new Handlebars.SafeString("badge badge-negative");
        } else if (status == "Warning") {
            return new Handlebars.SafeString("badge badge-primary");
        } else if (status == "Untested") {
            return new Handlebars.SafeString("badge badge-outlined");
        } else {
            return new Handlebars.SafeString("status colour error");
        }
    });

}

/**
 * Compile test list HTML with test list JSON data and append it to the DOM.
 */
TestListView.prototype.compile = function() {
    let testListTemplate = Handlebars.compile($("#testListTemplate").html());
    let testListHtml = testListTemplate(this.testListData);
    $(".content-padded").html(testListHtml);
}

/**
 * Attach navigation to test data page event
 */
TestListView.prototype.attachEvents = function() {
    $(".table-view-cell").on('click', function(event) {
        let pageid = "test";
        let status = $(this).children("span").html();

        if (status == "Untested") {
            alert("no test data");
        } else {
            app.router.routeToPage({ path1: pageid, path2: this.id });
        }
    });
}