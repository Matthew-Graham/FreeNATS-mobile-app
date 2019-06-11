function NavbarView(templateNumber) {

    this.templateNumber = templateNumber;
    this.compile();
    this.attachEvents();

}
NavbarView.prototype.compile = function () {

    if(this.templateNumber==2){
        let navbarTemplate = Handlebars.compile($("#navBarTemplate").html());
        let navbarHtml = navbarTemplate();
        $(".bar.bar-tab").html(navbarHtml);
    }else if(this.templateNumber==1){
        let navbarTemplate = Handlebars.compile($("#navBar1Template").html());
        let navbarHtml = navbarTemplate();
        $(".bar.bar-tab").html(navbarHtml);
    }

  
}

NavbarView.prototype.attachEvents = function () {

    $(".tab-item").on('click', function (event) {
        let id = this.id;
        event.stopPropagation();
        event.stopImmediatePropagation();
        console.log(id+"Navigation was clicked");
        router.routeToPage(id);
    });
}
      








