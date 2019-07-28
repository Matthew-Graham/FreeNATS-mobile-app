/**
 * An object controlling the display and logic of the group list page
 * @param {JSON} groupListData 
 */
function GroupListView(groupListData) {
    this.createHelpers(groupListData);
    this.compile(groupListData);
    this.attachEvents();
}


/**
 * Compiles the group list template with grouplist data and adds it to the dom
 * @param  {JSON} groupListData
 */
GroupListView.prototype.compile = function(groupListData) {
    let groupListTemplate = Handlebars.compile($("#groupListTemplate").html());
    let groupListHtml = groupListTemplate(groupListData);
    $(".content-padded").html(groupListHtml);
}

/**
 * Attachs events for navigation to the group page
 */
GroupListView.prototype.attachEvents = function() {
    $(".table-view-cell").on('click', function(event) {
        let pageid = "group";
        app.router.routeToPage({ path1: pageid, path2: this.id });
        console.log(this.id);
    });
}

/**
 * Register handlebar helpers than control the colour of the groups status
 * @param  {JSON} groupListData
 */
GroupListView.prototype.createHelpers = function(groupListData) {
    if (groupListData.groups.length > 0) {
        Handlebars.registerHelper('groupStatusColour', function(status) {
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
}