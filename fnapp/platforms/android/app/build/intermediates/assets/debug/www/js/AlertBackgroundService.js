/**
 * An object containing the logic for alert background processing.
 * Holds a reference to the db.
 *
 */
function AlertBackgroundService() {
    this.self = this;
    this.fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);

    /**
     * Defaults
     */
    let status = 0;
    let freq = 100000;
    this.currServerIndex = 0;
    this.currFrequency = 60000;
    this.timerInstance;

    this.getPersitentValues();

}


/**
 * Retrieves the previous state of the service when the app is restarted
 * and restarts the service or leaves it off 
 */
AlertBackgroundService.prototype.getPersitentValues = function() {
    let self = this;
    this.fnDb.transaction(function(tx) {

        tx.executeSql('SELECT * FROM settings WHERE name = ?', ["alerting"], function(tx, results) {
            let value = results.rows.item(0).value;
            let freq = results.rows.item(0).freq;

            self.status = value;
            self.freq = freq;

            if (value == "1") {

                if (freq != "undefined") {

                    if (freq > 0 && freq > 59000) {
                        app.alertService.startService(freq);
                    } else {
                        alert("frequency below a minute cant start service")
                    }

                } else {
                    self.status = "0";
                    self.freq = 1000000;
                    this.persistServiceValues("0", 1000000)
                    alert("Could read saved freqency, please start the query")
                }

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
AlertBackgroundService.prototype.stopService = async function() {
    this.persistServiceValues(0, 3600000);
    this.status = 0;
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
AlertBackgroundService.prototype.startService = function(freq) {
    this.freq = freq;
    this.status = 1;
    this.persistServiceValues(1, freq);
    console.log("starting background mode every " + freq);
    cordova.plugins.backgroundMode.setEnabled(true);
    this.timerInstance = app.alertService.startTimedQuery(freq);
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