
function AlertBackgroundService() {
    this.self = this;
    this.fnDb = openDatabase('fndb', '1.0', 'FnAppDb', 2 * 1024 * 1024);
    this.currServerIndex = 0;

    //on start up
  


    this.getPersitentValues();


    //first run populate from sql
    // this.monitoredServers = [];
    // this.populateMonitoredServers();
    // this.populated = true;
    // this.checkService();
    // this.timerInstance;


}

AlertBackgroundService.prototype.getPersitentValues = function () {
 
    this.fnDb.transaction(function (tx) {
        tx.executeSql('SELECT * FROM settings WHERE name = ?', ["alerting"], function (tx, results) {
            let value = results.rows.item(0).value;

            if (value == "1") {
                app.alertService.startService();
            }

            console.log("alerting:" + value);
        }, null);

    });




}


AlertBackgroundService.prototype.checkService = function (serviceCallback,freq) {
    
    let currObj = this;

    this.fnDb.transaction(function (tx) {
        tx.executeSql('SELECT * FROM settings WHERE name = ?', ["alerting"], function (tx, results) {
            let value = results.rows.item(0).value;

                serviceCallback(value,freq);
            

            console.log("alerting:" + value);
        }, null);

    });
}

AlertBackgroundService.prototype.persistServiceValues = function(status,freq){
    
    this.fnDb.transaction(function (tx) {
        tx.executeSql('UPDATE settings SET value = ? WHERE name = ?', [status,"alerting"], function (tx, result) {
            console.log("query successful");   
          }, null);
          
    }, function (error) {
        console.log("SQL Transaction error in persisting background values view Message:" + error.message)
    });
}

AlertBackgroundService.prototype.stopService = function (value) {
    
    app.alertService.persistServiceValues(0);
    console.log("stopping background service")
    //disable backgroundmode
    cordova.plugins.backgroundMode.setEnabled(false);

    clearInterval(this.timerInstance);
}

AlertBackgroundService.prototype.startService = function (value,freq) {
    app.alertService.persistServiceValues(1);
    
    console.log("starting background mode")

    //start backgroundmode
    if (value!="1") {
        console.log("enabling")
        cordova.plugins.backgroundMode.setEnabled(true);
        cordova.plugins.backgroundMode.disableWebViewOptimizations();
       
        let server1 = {
            name: "google",
            url: "www.google.com",
            alerted: "1",
            nodeName: "google node",
            alertLevel: "1",
            freq: "10000",
            timerInstance: ""
        };

        timerInstance = app.alertService.startTimedQuery(freq);
    }



    

    //create timerinstance for each monitered server if not set already 
}

AlertBackgroundService.prototype.populateMonitoredServers = function () {
    let server1 = {
        name: "google",
        url: "www.google.com",
        alerted: "1",
        nodeName: "google node",
        alertLevel: "1",
        freq: "10000",
        timerInstance: ""
    };

    this.monitoredServers.push(server1);

    let server2 = {
        name: "bging",
        url: "www.google.com",
        alerted: "1",
        nodeName: "bing",
        alertLevel: "1",
        freq: "20000",
        timerInstance: ""
    };


    this.monitoredServers.push(server2);

    //get sql servers add to monitored servers 
    //create timer instances
}

AlertBackgroundService.prototype.startTimedQuery = function (freq) {
    let self = this;
    timer = setInterval(function () {
        //loop through servers and query// needs to use promises or recursion

        let index = 0;
        //query recursively 
       
        app.fnConnObj.backgroundQuery(0);

        //     let wrnLvlNum = server1.alertLevel.toString();
        //     let text = wrnLvl + "(" + wrnLvlNum + ")";
        //     cordova.plugins.notification.local.schedule({
        //         title: title,
        //         text: text,
        //         foreground: true
          
        // })
    }, freq);

    return timer;
}


AlertBackgroundService.prototype.serverIterationQuery = function(){
    //loop through servers and query alerts
    
}

AlertBackgroundService.prototype.persistMonitoredServer = function (url, serverName, monitoring) {

    server = {
        url: url,
        name, serverName,
        monitoring: monitoring
    }

    //to web sql

    if (server.monitoring == true) {
        this.monitorServer(server);
    }
}

//add server to server array
AlertBackgroundService.prototype.monitorServer = function (server) {
    monitoredServers.push(server);
    //persist server
    //add timer for server
    this.checkService();
}

AlertBackgroundService.prototype.unmonitorServer = function (server) {
    //call clear interval on server instance
    this.checkService();
}

