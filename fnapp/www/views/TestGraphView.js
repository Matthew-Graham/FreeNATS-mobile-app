/**
 * 
 * Object that handles logic and display of 
 * the  test graph view
 *
 * @param  {JSON} jsonObj
 */
function TestGraphView(jsonObj) {

    //TODO reload graph based on orientation change
    //TODO possibly add zoom in functionality 

    this.jsonObj = jsonObj;
    this.compile();
    this.configureDatePickers();
    this.generateGraph();
    this.attachEvents();
}

/**
 * Generate the basic page with test name displayed
 */
TestGraphView.prototype.compile = function() {

    let graphTemplate = Handlebars.compile($("#graphTemplate").html());
    let graphHtml = graphTemplate(this.jsonObj);
    $(".content-padded").html(graphHtml);
}

/**
 * set the date format of the date time pickers, 
 * set the dates to the current test period start and end,
 * set the maximum date allowed to enter to the current date
 */
TestGraphView.prototype.configureDatePickers = function() {

    /*start and finish date and time from query into date objects */
    let dt1 = new Date(this.jsonObj.period.startx * 1000);
    let dt2 = new Date(this.jsonObj.period.finishx * 1000);
    let dtNow = new Date();

    /**Configure datetime pickers setting max date to now and dd-mm-yy format*/
    $("#date1").datetimepicker({
        dateFormat: 'dd-mm-yy',
        autoSize: true,
        maxDate: dtNow
    });

    $("#date2").datetimepicker({
        dateFormat: 'dd-mm-yy',
        autoSize: true,
        maxDate: dtNow
    });

    /*Set start date as start of test range and set finish date to end of test range*/
    $("#date1").datetimepicker("setDate", dt1);
    $("#date2").datetimepicker("setDate", dt2);

}


/**
 * Ensures first datetime is not greater 
 * than second which would cause query to fail to the API
 * @param  {Date} tempDate1 start date
 * @param  {Date} tempDate2 finish date
 */
TestGraphView.prototype.validateDate = function(tempDate1, tempDate2) {

    if (tempDate1 >= tempDate2) {
        return false;
    } else {
        return true;
    }
}

/**
 * Attachs event to handle requerying the graph 
 * and reload the page with a new graph 
 */
TestGraphView.prototype.attachEvents = function() {

    let self = this;

    $("#submitDates").on('click', function(event) {
        let tempDate1 = $("#date1").datepicker("getDate");
        let tempDate2 = $("#date2").datepicker("getDate");

        if (self.validateDate(tempDate1, tempDate2)) {
            let dateObj1 = new Date(tempDate1);
            let date1 = parseInt((dateObj1.getTime() / 1000).toFixed(0))

            let dateObj2 = new Date(tempDate2);
            let date2 = parseInt((dateObj2.getTime() / 1000).toFixed(0))
            app.fnConnObj.query({ path1: "test", path2: self.jsonObj.testid, path3: "data", queryString1: date1, queryString2: date2 })
        } else {
            alert("invalid dates submitted");
        }
    });


}

/**
 * Generates graph using d3 framework and appends it to the DOM
 */
TestGraphView.prototype.generateGraph = function() {

    let currObj = this;
    let container = $(".content-padded");

    /*Dimensions for svg based on screen size */
    let leftMargin = 40;
    let bottomMargin = 30;
    let rightMargin = 35;
    let topMargin = 25;

    let heightPadding = 30;
    let widthPadding = 20;
    let height = window.screen.height - 200;
    let width = window.screen.width - 15;


    /*Appends svg to DOM */
    let svg = d3.select('.content-padded')
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("style", "background-color:#d2ddef");




    /*
    Used to hold values for caluculating max and min value
    which is needed for the y scale
    */
    let values = [];

    this.jsonObj.data.forEach(element => {
        values.push(element.value);

    });
    let valueMin = Math.min(...values);
    let valueMax = Math.max(...values);

    /*
    Max and min time all ready provided by api
    used for x scale
    */
    let min = this.jsonObj.period.startx * 1000;
    let max = this.jsonObj.period.finishx * 1000;


    /* 
    Graph Scales calculated using the previous max min for time and values
    and using the screen size to control size
     */
    let xScale = d3.scaleTime()
        .domain([min, max])
        .range([(leftMargin), (width - rightMargin)])
        .nice();

    let yScale = d3.scaleLinear()
        .domain([(valueMin), (valueMax * 1.05)])
        .range([height - bottomMargin, topMargin])
        .nice();

    /* 
      X Axis created using scale and setting the min amount of ticks on line
    */
    let xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(6);

    /**
     * Attach X axis to svg - moving it to the
     *  bottom of the svg as auto put to the top
     */
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (0) + "," + (height - bottomMargin) + ")")
        .call(xAxis);

    /* 
    Y axis created using scale and setting min amount of ticks
    */
    let yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(10);

    /* Attach y axis to svg */
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate (" + leftMargin + "," + (0) + ")")
        .call(yAxis);

    /*
    Add circles to svg for data points, setting their radius to 1 
    and colour coding them based on alert levels 
    */
    let graph = svg.selectAll("g");
    svg.selectAll("circle")
        .data(this.jsonObj.data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return xScale((d.recordx * 1000));
        })
        .attr("cy", function(d) {
            return yScale((d.value)).toFixed(4);
        })
        .attr("r", 1)
        .attr("fill", function(d) {

            if (d.alertlevel == 2) {
                return "red";
            } else if (d.alertlevel == 1) {
                return "orange";
            } else if (d.alertlevel == 0) {
                return "green";
            } else {
                return "blue"
            }
        })


    /*Lines */
    let dataArr = this.jsonObj.data;

    /*
    add lines to the svg taking their start cordinates as the current datapoint
    and the end cordinates as the next datapoint in the array of datapoints
    line are also colour coded based on their alert level 
    */
    svg.selectAll("line.dpline")
        .data(dataArr)
        .enter()
        .append("line")
        .attr("x1", function(d) {
            return xScale((d.recordx * 1000));
        })
        .attr("y1", function(d) {
            return yScale((d.value)).toFixed(4);
        })
        .attr("x2", function(d, i) {

            if (i < (dataArr.length - 1)) {
                return xScale((dataArr[i + 1].recordx) * 1000);
            } else {
                return xScale((d.recordx * 1000));
            }

        })
        .attr("y2", function(d, i) {

            if (i < (dataArr.length - 1)) {
                return yScale((dataArr[i + 1].value)).toFixed(4)
            } else {
                return yScale((d.value)).toFixed(4);
            }


        })
        .attr("stroke", function(d) {

            if (d.alertlevel == 2) {
                return "red";
            } else if (d.alertlevel == 1) {
                return "orange";
            } else if (d.alertlevel == 0) {
                return "green";
            } else {
                return "blue"
            }
        }).attr("stroke-width", 1)
        .classed("dpline");



    /* Attach a Legend to the svg */
    svg.append("circle").attr("cx", width - 100).attr("cy", 10).attr("r", 6).style("fill", "#FF0000")
    svg.append("circle").attr("cx", width - 200).attr("cy", 10).attr("r", 6).style("fill", "#FF8C00")
    svg.append("circle").attr("cx", width - 300).attr("cy", 10).attr("r", 6).style("fill", "#008000")
    svg.append("text").attr("x", width - 80).attr("y", 10).text("Fail").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg.append("text").attr("x", width - 180).attr("y", 10).text("Warning").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg.append("text").attr("x", width - 280).attr("y", 10).text("Pass").style("font-size", "15px").attr("alignment-baseline", "middle")
}
