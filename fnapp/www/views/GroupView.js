/**
 * An object controlling the display and logic of the group page with nodes in a group
 * @param {JSON} groupData 
 */
function GroupView(groupData) {
    this.createHelpers();
    this.compile(groupData);
    this.attachEvents();
}

/**
 *  Register handlebar helpers than control the colour of the groups status
 */
GroupView.prototype.createHelpers = function() {
    Handlebars.registerHelper('statusColour', function(status) {
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
}

/**
 * Compiles the group  template with group data and adds it to the dom
 * @param  {JSON} groupData
 */
GroupView.prototype.compile = function(groupData) {
    let groupTemplate = Handlebars.compile($("#groupTemplate").html());
    let groupHtml = groupTemplate(groupData);
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

/**
 * Attachs events for navigation to the test page
 */
GroupView.prototype.attachEvents = function() {
    $(".table-view-cell").on('click', function(event) {
        let nodeid = this.id;
        let pageid = "tests";
        // pRouter = new PageRouter();   
        app.router.routeToPage({ path1: pageid, path2: nodeid });
    });
}