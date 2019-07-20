/**
 * An object controlling the display and logic of all the app specific settings
 */
function SettingsView() {
    this.createHelpers();

    //includes call to compile 
    this.prepareAlertSetting(app.alertService.status, app.alertService.freq)
    this.attachEvents();
}


/**
 * Register handlebar helpers than control the colour and text of the enable disable button
 */
SettingsView.prototype.createHelpers = function() {
    Handlebars.registerHelper('settingColour', function(enabled) {
        if (enabled == "1") {
            return new Handlebars.SafeString("btn-negative");
        } else {
            return new Handlebars.SafeString("btn-positive");
        }
    });

    Handlebars.registerHelper('alertQuery', function(enabled) {
        if (enabled == "1") {
            return new Handlebars.SafeString("disable");
        } else {
            return new Handlebars.SafeString("enable");
        }
    });
}




/**
 * Creates a object for use with the handlebars compiler
 * contains the current status 
 * and converts the frequency into hours and mins 
 * @param  {int} value - status of the alert setting
 * @param  {int} freq - in milliseconds
 */
SettingsView.prototype.prepareAlertSetting = function(value, freq) {
    if (value == "1") {
        console.log("enabled")
    } else {
        console.log("disabled")
    }

    /**
     * convert miliseconds to hours and mins
     */
    let hrs = 0;
    if (freq > 3600000) {
        hrs = (freq / 3600000);
    }

    /**
     * Object to be used with the settings template
     */
    let alertSetting = {
        alertStatus: value,
        mins: (freq / 60000),
        hours: hrs
    };

    this.compile(alertSetting);
}


/**
 * Compiles the settings template with alert settings data and adds it to the dom.
 * @param  {Object} settings
 */
SettingsView.prototype.compile = function(settings) {

    /**Header */
    let headerTemplate = Handlebars.compile($("#headerTemplate").html());
    let context = { title: "Settings" };
    let headerHTML = headerTemplate(context);
    $("#topHeader").html(headerHTML);

    let settingsTemplate = Handlebars.compile($("#settingsTemplate").html());
    let settingsHtml = settingsTemplate(settings);
    $(".content-padded").html(settingsHtml);


}


/**
 * Attachs events for turning the alerting service on and off 
 * and changing the frequency of the alerting, also handles updating the dom
 */
SettingsView.prototype.attachEvents = function() {
    let obj = this;
    $(".submit").on('click', function(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        let id = this.id;


        let freqHours = $(this).siblings("#freqHours").val();
        let freqMinutes = $(this).siblings("#freqMins").val();
        let freq = 0;

        /**To miliseconds from hours and minutes */
        if (freqHours < "0" || freqMinutes < "0") {
            freq = 3600000;
        } else {
            freq = (freqMinutes * 60000) + (freqHours * 3600000);
        }

        /**Start service or end it and change button accordingly */
        if (id == "enable") {
            settings.alertStatus = "1";
            console.log(freq);
            app.alertService.startService(freq);
            $(this).attr("id", "disable");
            $(this).html("disable");
            $(this).removeClass("btn-positive");
            $(this).addClass("btn-negative");
        } else if (id == "disable") {
            app.alertService.stopService();
            $(this).attr("id", "enable");
            $(this).html("enable");
            $(this).removeClass("btn-negative");
            $(this).addClass("btn-positive");
        }
    });
}