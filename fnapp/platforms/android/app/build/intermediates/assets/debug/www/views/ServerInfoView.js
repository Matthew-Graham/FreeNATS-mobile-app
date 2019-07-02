//   constructer
function ServerInfoView() {

    this.url = "";
    this.wrapper =  $(".content-padded");

    
    function serverConnect() {
        //connect to server and then switch page 
    }

    /**
     * Logic before adding html
     */
    function renderHTML() {
        this.wrapper.html = this.template;
    }
}


function getAlerts(){
    
}



//add to prototype of server info view
$(".content-padded").html(Handlebars.compile($("#loginFormTemplate").html()));





// $("#submit").click(function () {



//   let user = $("#username").val();
//   let pass = $("#password").val();
//   var params = 'username=admin&password=admin';
//   // $("#tests").html(username +" "+password);

//   loginRequest = new XMLHttpRequest();
//   loginRequest.open('GET', 'http://natsapi.altair.davecutting.uk/jsonapi.php/login?naun=admin&napw=admin', false);
//   loginRequest.setRequestHeader('Content-type', 'application/json');

//   loginRequest.onload = function () {

//     var data = JSON.parse(this.response);

//     if (loginRequest.status >= 200 && loginRequest.status < 400) {

//       $("#tests").html(data.type);
//      // $("#tests").html("success");

//     } else {
//       $("#tests").html("error");
//     }
//   };

//   loginRequest.send(params);
// });


















// var HomeView = function (service) {

//     var employeeListView;

//     this.initialize = function() {
//         this.$el = $('<div/>');
//         this.$el.on('keyup', '.search-key', this.findByName);
//         employeeListView = new EmployeeListView();
//         this.render();
//     };

//     this.render = function() {
//         this.$el.html(this.template());
//         $('.content', this.$el).html(employeeListView.$el);
//         return this;
//     };

//     this.findByName = function() {
//         service.findByName($('.search-key').val()).done(function(employees) {
//             employeeListView.setEmployees(employees);
//         });
//     };

//     this.initialize();
// }