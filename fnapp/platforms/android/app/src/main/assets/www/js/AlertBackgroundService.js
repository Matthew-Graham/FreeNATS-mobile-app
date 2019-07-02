
function AlertBackgroundService() {

    //first run populate from sql
    this.monitoredServers = [];
    this.populateMonitoredServers();
    this.populated = true;
    this.checkService();
    this.timerInstance;


}

AlertBackgroundService.prototype.checkService = function () {

    //check backgroundmode
    if (this.monitoredServers.length > 0) {
        if (this.populated == false) {
            this.populateMonitoredServers();
            this.startService();
        } else {
            this.startService();
        }
    } else {
        this.stopService();
    }
}

AlertBackgroundService.prototype.stopService = function () {
    //disable backgroundmode
    cordova.plugins.backgroundMode.setEnabled(false);
    clearInterval(this.timerInstance);
}

AlertBackgroundService.prototype.startService = function () {
    //start backgroundmode
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

    
    
    this.timerInstance= this.startTimedQuery(server1);

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

AlertBackgroundService.prototype.startTimedQuery = function (server1) {

    timer = setInterval(function () {
        //loop through servers and query// needs to use promises or recursion

        let index = 0;
        //query recursively 
        if (server1.alerted == true) {
            let title = "Alert for " + server1.nodeName;
            let wrnLvl = "";

            if (server1.alertLevel == 1) {
                wrnLvl = "pass";
            }
            let wrnLvlNum = server1.alertLevel.toString();
            let text = wrnLvl + "(" + wrnLvlNum + ")";
            cordova.plugins.notification.local.schedule({
                title: title,
                text: text,
                foreground: true
            });
        }
    }, server1.freq);

    return timer;
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

