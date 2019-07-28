/**
 * An object controlling the display and logic of the nodes 
 * for a particular server
 * @param {JSON} nodeList 
 */
function NodeListView(nodeList) {
    this.createHelpers();
    this.compile(nodeList);
    this.attachEvents();
}

/**
 * Register handlebar helpers than control the colour of the node status
 */
NodeListView.prototype.createHelpers = function() {
    Handlebars.registerHelper('statusColour', function(status) {
        if (status == "Passed") {
            return new Handlebars.SafeString("badge badge-positive");
        } else if (status == "Failed") {
            return new Handlebars.SafeString("badge badge-negative");
        } else if (status == "Warning") {
            return new Handlebars.SafeString("badge badge-primary");
        } else {
            return new Handlebars.SafeString("badge badge-outline");
        }
    });

    Handlebars.registerHelper('nodeEnabled', function(enabled) {
        if (enabled == "1") {
            return new Handlebars.SafeString("enabled");
        } else {
            return new Handlebars.SafeString("disabled");
        }
    });

    Handlebars.registerHelper('nodeEnabledColour', function(enabled) {
        if (enabled == "1") {
            return new Handlebars.SafeString("btn-positive");
        } else {
            return new Handlebars.SafeString("btn-negative");
        }
    });
}

/**
 * Compiles the nodelist template with the nodelist data and adds it to the dom
 * @param  {JSON} nodeList
 */
NodeListView.prototype.compile = function(nodeList) {
    let nodeListTemplate = Handlebars.compile($("#nodesTemplate").html());
    let nodeHtml = nodeListTemplate(nodeList);
    $(".content-padded").html(nodeHtml);

    /**Header */
    let headerTemplate = Handlebars.compile($("#headerTemplate").html());
    let context = { title: localStorage.getItem("servername") };
    let headerHTML = headerTemplate(context);
    $("#topHeader").html(headerHTML);
}

/**
 * Attachs events for navigation to the test page
 */
NodeListView.prototype.attachEvents = function() {
    $(".table-view-cell").on('click', function(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        let nodeid = this.id;
        let pageid = "tests";
        app.router.routeToPage({ path1: pageid, path2: nodeid });
    });

    $(".nodebutton").on('click', function(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        let nodeid = this.id

        if ($(this).attr("value") == "enabled") {
            app.fnConnObj.query({ path1: "node", path2: nodeid, path3: "disable" })
            console.log("disable")
        } else {
            app.fnConnObj.query({ path1: "node", path2: nodeid, path3: "enable" })
            console.log("enable")
        }
    });
}