/**
 * An object controlling the display and logic of the bottom navigation bar
 * @param {int} templateNumber 
 */
function NavbarView(templateNumber) {
    this.compile(templateNumber);
    this.attachEvents();
}

/**
 * Depending on entered template number compiles either the inital nav bar 
 * or the nested nav bar and adds it to the dom
 */
NavbarView.prototype.compile = function(templateNumber) {
    if (templateNumber == 2) {
        let navbarTemplate = Handlebars.compile($("#navBarTemplate").html());
        let navbarHtml = navbarTemplate();
        $(".bar.bar-tab").html(navbarHtml);
    } else if (templateNumber == 1) {
        let navbarTemplate = Handlebars.compile($("#navBar1Template").html());
        let navbarHtml = navbarTemplate();
        $(".bar.bar-tab").html(navbarHtml);
    }
}

/**
 * Attachs events for navigation using the navigation bar
 */
NavbarView.prototype.attachEvents = function() {
    $(".tab-item").on('click', function(event) {
        let id = this.id;
        event.stopPropagation();
        event.stopImmediatePropagation();
        app.router.routeToPage({ path1: id });
    });
}