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
 * Creates a  JSON object for use with the handlebars compiler
 * contains the current status 
 * and converts the frequency into hours and mins 
 * @param  {int} value - status of the alert setting
 * @param  {int} freq - in milliseconds
 */
SettingsView.prototype.prepareAlertSetting = function(value, freq) {
    if (value == "1") {
        console.log("Alerting enabled")
    } else {
        console.log("Alerting disabled")
    }



    /**
     * slighlty modifed logic from
     * 
     * https://stackoverflow.com/questions/10874048/from-milliseconds-to-hour-minutes-seconds-and-milliseconds
     */
    let mins = Math.floor((freq / (1000 * 60)) % 60);
    let hrs = Math.floor((freq / 3600000));


    /**
     * Object to be used with the settings template
     */
    let alertSetting = {
        alertStatus: value,
        mins: mins,
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
        let freq = (freqMinutes * 60000) + (freqHours * 3600000);

        //both numeric and not a disable call
        if (id != "disable" && $.isNumeric(freqHours) && $.isNumeric(freqMinutes)) {

            //both zero dont start
            if (freqHours <= 0 && freqMinutes <= 0) {
                id = "invalid"

                //hours negative dont start
            } else if (freqHours < 0) {
                id = "invalid"

                //minutes negative dont start
            } else if (freqMinutes < 0) {
                id = "invalid";

                //minutes more than 1 hour
            } else if (freqMinutes > 60) {
                id = "invalid";
                alert("use the hour input for mins over 60")
                    //hours to big 
            } else if (freqHours >= 25) {
                id = "invalid";

                //valid
            } else {
                id = "enable"
                    /**To miliseconds from hours and minutes */

            }
        } else if (id == "disable") {
            //do nothing if only disabling
        } else {
            id = "invalid";
            //alert("Enter 2 numbers")
        }



        /**Start service or end it and change button accordingly */
        if (id == "enable") {
            settings.alertStatus = "1";
            console.log(freq);
            app.alertService.startService(freq);
            // app.router.routeToPage({ path1: "servers" });
            $(this).attr("id", "disable");
            $(this).html("disable");
            $(this).removeClass("btn-positive");
            $(this).addClass("btn-negative");
        } else if (id == "disable") {
            app.alertService.stopService();
            // app.router.routeToPage({ path1: "servers" });
            $(this).attr("id", "enable");
            $(this).html("enable");
            $(this).removeClass("btn-negative");
            $(this).addClass("btn-positive");
        } else {
            alert("invalid input")
        }
    });
}