function SettingsView(){


;
  app.alertService.checkService(this.getData.bind(this));
}

SettingsView.prototype.getData = function(value){
  console.log(value+"value")
  if(value=="1"){
    console.log("A enabled")
    
  }else{
    console.log("A disabled")
    
  }

  let settings = {
    alertStatus:value
  };


  this.compile(settings);
}

SettingsView.prototype.compile = function(settings){
    console.log(settings.alertStatus+"status here")
    Handlebars.registerHelper('settingColour', function (enabled) {
        if (enabled == "1") {
          return new Handlebars.SafeString("btn-negative");
        } else {
          return new Handlebars.SafeString("btn-positive");
        }
      });

    //get current frequency
  Handlebars.registerHelper('alertQuery', function (enabled) {
    if (enabled == "1") {
      return new Handlebars.SafeString("disable");
    } else {
      return new Handlebars.SafeString("enable");
    }
  });


  let settingsTemplate = Handlebars.compile($("#settingsTemplate").html());
  let settingsHtml = settingsTemplate(settings);
  $(".content-padded").html(settingsHtml);

  this.attachEvents();

}

SettingsView.prototype.attachEvents = function(){
    let obj = this;
  $(".submit").on('click', function (event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        let id = this.id;

        let freqHours = $(this).siblings("#freqHours").val();
        let freqMinutes = $(this).siblings("#freqMins").val();

        let freq = freqMinutes*60000;
        freq = 10000;
        console.log(freqMinutes);
        console.log(id);

        if(id=="enable"){
            settings.alertStatus = "1";
            //start background service
            app.alertService.persistServiceValues(1);
            app.alertService.checkService(app.alertService.startService,freq);
           //app.alertService.startService(10000);     
            $(this).attr("id","disable");
            $(this).html("disable"); 
            $(this).removeClass("btn-positive");
            $(this).addClass("btn-negative");
                
           console.log("hereere");
           
        }else if(id=="disable"){
            app.alertService.persistServiceValues(0);
            app.alertService.checkService(app.alertService.stopService)
            //app.alertService.stopService();   
            $(this).attr("id","enable");
            $(this).html("enable"); 
            $(this).removeClass("btn-negative");
          $(this).addClass("btn-positive");    
            //app.fnConnObj.query({path1:"node",path2:nodeid,path3:"enable"})
          
        }
    
 
       
      });
}