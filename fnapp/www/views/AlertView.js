function AlertView(alertData) {
    this.alertData = alertData;
    this.compile();
    //this.attachEvents();
}

AlertView.prototype.compile = function () {

    if (this.alertData.alerts != "false") {

        Handlebars.registerHelper('alertStatusColour', function (status) {

            if (status == "0") {
                return new Handlebars.SafeString("badge badge-positive");
            } else if (status == "2") {
                return new Handlebars.SafeString("badge badge-negative");
            } else if (status == "1") {
                return new Handlebars.SafeString("badge badge-primary");
            } else if (status == "-1") {
                return new Handlebars.SafeString("badge badge-outlined");
            }
            else {
                return new Handlebars.SafeString("status colour error");
            }
        });
    }

    let alertsTemplate = Handlebars.compile($("#alertsTemplate").html());
    let alertsHtml = alertsTemplate(this.alertData);
    $(".content-padded").html(alertsHtml);
}

// AlertView.prototype.attachEvents = function () {
//   $(".table-view-cell").on('click', function (event) {

//     let pageid = "test";
//     // pRouter = new PageRouter();   
//     router.routeToPage({path1:pageid,path2:this.id});
//     console.log(this.id);
//   });
// }