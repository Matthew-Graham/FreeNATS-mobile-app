/**
 * An object containing the logic for alert background processing.
 * Holds a reference to the db.
 *
 */
function AlertBackgroundService() {
    this.self = this;
    this.fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);
    this.currServerIndex = 0;
    this.currFrequency = 60000;
    this.getPersitentValues();
    this.timerInstance;
}


/**
 * Retrieves the previous state of the service 
 * and restarts the service or leaves it off 
 */
AlertBackgroundService.prototype.getPersitentValues = function() {

    this.fnDb.transaction(function(tx) {

        tx.executeSql('SELECT * FROM settings WHERE name = ?', ["alerting"], function(tx, results) {
            let value = results.rows.item(0).value;
            let freq = results.rows.item(0).freq;

            if (value == "1") {
                app.alertService.startService(value, freq);
            }
            console.log("alerting:" + value);
        }, null);
    });
}


AlertBackgroundService.prototype.checkService = function(serviceCallback, freq) {
    let currObj = this;

    this.fnDb.transaction(function(tx) {

        tx.executeSql('SELECT * FROM settings WHERE name = ?', ["alerting"], function(tx, results) {
            let value = results.rows.item(0).value;
            let freqSrvr = results.rows.item(0).freq;

            //the same freq or no new freq use db freq
            if (freq == undefined || freq == freqSrvr) {
                console.log("current status:" + value + "freq" + freqSrvr);
                serviceCallback(value, freqSrvr);
            } else {
                console.log("current status:" + value + "freq" + freq);
                serviceCallback(value, freq);
            }
        }, null);

    });
}


/**
 * Updates the frequency and status of the service in the settings table
 * @param  {int} status
 * @param  {int} freq
 */
AlertBackgroundService.prototype.persistServiceValues = function(status, freq) {

    this.fnDb.transaction(function(tx) {

        tx.executeSql('UPDATE settings SET value = ?,freq = ? WHERE name = ?', [status, freq, "alerting"], function(tx, result) {
            console.log("Alert Settings saved");
        }, null);

    }, function(error) {
        console.log("SQL Transaction error in persisting background values view Message:" + error.message)
    });
}



/**
 * Stops the background mode
 * Persists the off status to the settings table and clears the time interval
 */
AlertBackgroundService.prototype.stopService = function() {
    app.alertService.persistServiceValues(0);
    console.log("stopping background service");
    cordova.plugins.backgroundMode.setEnabled(false);
    clearInterval(this.timerInstance);
}


/**
 * Starts the background mode, persists the status and frequency to the settings table 
 * and creates a new timer instance with the frequency
 * @param  {int} value
 * @param  {int} freq
 */
AlertBackgroundService.prototype.startService = function(value, freq) {
    app.alertService.persistServiceValues(1, freq);
    console.log("starting background mode" + value);

    //final check of value
    if (value == "0") {
        console.log("enabling")
        cordova.plugins.backgroundMode.setEnabled(true);
        timerInstance = app.alertService.startTimedQuery(freq);
    }

    //do nothing if not 0
}


/**
 * Creates a timer using the set interval function with the passed 
 * in frequency and return a reference to the timer. Each iteration of the timer
 * runs a background query function.
 * @param  {int} freq
 * @returns timer
 */
AlertBackgroundService.prototype.startTimedQuery = function(freq) {
    let self = this;
    let timer = setInterval(function() {
        app.fnConnObj.backgroundQuery(0);
    }, freq);

    return timer;
}