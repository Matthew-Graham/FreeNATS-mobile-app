
function TestGraphView(jsonObj) {

    //TODO reload graph based on orientation change
    //TODO possibly add zoom in functionality 
    //TODO add trimming to long decimals on axis
    this.jsonObj = jsonObj;
    console.log(jsonObj);
    this.compile();
    this.precompile();
    this.attachEvents();


}

TestGraphView.prototype.compile = function () {

    /*Header */
    //    let datePickerTemplate = Handlebars.compile($("#datePickerTemplate").html());
    //    let datepickerHtml = datePickerTemplate();
    //    $("#content").html(datepickerHtml);


    let graphTemplate = Handlebars.compile($("#graphTemplate").html());
    let graphHtml = graphTemplate(this.jsonObj);
    $(".content-padded").html(graphHtml);


    //**Calendar date pickers */
    $("#date1").datepicker();
    $("#date2").datepicker();


    $("#date1").datepicker({
        autoSize: true
    });
    $("#date2").datepicker({
        autoSize: true
    });

    $("#date1").datepicker("setDate", new Date(this.jsonObj.period.startx * 1000));
    $("#date2").datepicker("setDate", new Date(this.jsonObj.period.finishx * 1000));
}


TestGraphView.prototype.attachEvents = function () {

    let self = this;



    $("#submitDates").on('click', function (event) {


        let tempDate1 = $("#date1").datepicker("getDate");
        let tempDate2 = $("#date2").datepicker("getDate");

        let dateObj1 = new Date(tempDate1);
        let date1 = parseInt((dateObj1.getTime() / 1000).toFixed(0))

        let dateObj2 = new Date(tempDate2);
        let date2 = parseInt((dateObj2.getTime() / 1000).toFixed(0))


        app.fnConnObj.query({ path1: "test", path2: self.jsonObj.testid, path3: "data", queryString1: date1, queryString2: date2 })
    });


}

TestGraphView.prototype.precompile = function () {



    // let svg = d3.select('.content-padded')
    //          .append("svg")
    //          .attr("width", 200)
    //          .attr("height", 300)
    //         .attr("style", "background-color:#d2ddef");

    let currObj = this;
    let container = $(".content-padded");
    //replace with container height


    //test data
    // let jsonObj = {
    //     test: {
    //         localtestid: "26",
    //         nodeid: "test",
    //         simpleeval: "1",
    //         testname: "MySQL Connect",
    //     },





    //     period: {
    //         startx: 1560330000,
    //         finishx: 1560386962,
    //     }
    //     ,
    //     data:
    //         [
    //             {
    //                 recordx: "1560336361",
    //                 recorddt: "10:46:01 12/06/2019",
    //                 value: "0.300",
    //                 alertlevel: "0"
    //             },
    //             {
    //                 recordx: "1560336661",
    //                 recorddt: "10:51:01 12/06/2019",
    //                 value: "0.229",
    //                 alertlevel: "0"
    //             },
    //             {
    //                 recordx: "1560336962",
    //                 recorddt: "10:56:02 12/06/2019",
    //                 value: "0.235",
    //                 alertlevel: "0"
    //             },
    //         ]
    // }

    /*Dimensions for svg */

    let leftMargin = 40;
    let bottomMargin = 30;
    let rightMargin = 35;
    let topMargin = 25;

    let heightPadding = 30;
    let widthPadding = 20;
    let height = window.screen.height - 200;
    let width = window.screen.width - 15;


    /*Dimensions for inner graph */
    let graphHeightPadding = heightPadding + 20;
    let graphWidthPadding = widthPadding;
    let graphWidth = width;
    let graphHeight = height - graphHeightPadding;


    // let height = 400;
    // let width = 200- widthPadding;

    let svg = d3.select('.content-padded')
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("style", "background-color:#d2ddef");

    

    let values  = [];

    this.jsonObj.data.forEach(element => {
         values.push(element.value);
         console.log(element.value);
    });
   
     console.log( Math.max(...values));
     console.log( Math.min(...values)+"min");
     // 4
    // 1

    

    let sortDataPoints = function (objs) {

        objs.sort(function (a, b) {
            return a.value - b.value;
        })
        //console.log(objs[0].value);
        return objs;
    }

    //sortedObjs = sortDataPoints(this.jsonObj.data);


    // let valueMin = sortedObjs[0].value;
    // let valueMax = sortedObjs[sortedObjs.length - 1].value;
    
    let valueMin = Math.min(...values);
    let valueMax = Math.max(...values);



    console.log(valueMax);
    console.log(valueMin);

    let min = this.jsonObj.period.startx * 1000;
    let max = this.jsonObj.period.finishx * 1000;
    let data = this.jsonObj.data;

    //need to get max value of data point either pre d3 or using max function
    console.log(min);
    console.log(max);
    // /* Graph Scales */

    let xScale = d3.scaleTime()
        .domain([min, max])
        .range([(leftMargin), (width - rightMargin)])
        .nice();

    let yScale = d3.scaleLinear()
        .domain([(valueMin), (valueMax * 1.05)])
        .range([height - bottomMargin, topMargin])
        .nice();



    /* 
      X Axis
    */
    let xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(6);

    /**
     * Create x Axis
     */
    svg.append("g")
        .attr("class", "axis")
        //x axis has predefined gap to the left so small adjustment needed to margin
        .attr("transform", "translate(" + (0) + "," + (height - bottomMargin) + ")")
        .call(xAxis);

    /* 
    Define  axis*/
    let yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(10);

    /* Create y */
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate (" + leftMargin + "," + (0) + ")")
        .call(yAxis);

    /*Add circles for data points*/

    let graph = svg.selectAll("g");
    svg.selectAll("circle")
        .data(this.jsonObj.data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {

            console.log("circle time"+d.recordx);
            // console.log(d.recordx);
            return xScale((d.recordx * 1000));
        })
        .attr("cy", function (d) {
            return yScale((d.value)).toFixed(4);
        })
        .attr("r", 1)
        .attr("fill", function (d) {

            if (d.alertlevel < 0) {
                return "red";
            } else if (d.alertlevel > 1) {
                return "yellow";
            } else {
                return "green";
            }
        }
        )

    let dataArr = this.jsonObj.data;
    //console.log(dataArr);
    /*Lines */
    svg.selectAll("line.dpline")
        .data(dataArr)
        .enter()
        .append("line")
        .attr("x1", function (d) {
             console.log("linetime"+d.recordx);
            return xScale((d.recordx * 1000));
        })
        .attr("y1", function (d) {
            // console.log(d.recordx);
            return yScale((d.value)).toFixed(4);
        })
        .attr("x2", function (d, i) {
            // console.log(d.recordx);
            //  console.log(dataArr[i+1].recordx * 1000);
            
            if (i < (dataArr.length - 1)) {
                return xScale((dataArr[i + 1].recordx) * 1000);
            } else {
                return xScale((d.recordx * 1000));
            }

        })
        .attr("y2", function (d, i) {
            //console.log(i)
            if (i < (dataArr.length - 1)) {         
                return yScale((dataArr[i+1].value)).toFixed(4)
            } else {
                return yScale((d.value)).toFixed(4);
            }


        })
        .attr("stroke", function (d) {

            if (d.alertlevel < 0) {
                return "red";
            } else if (d.alertlevel > 1) {
                return "yellow";
            } else {
                return "green";
            }
        }
        )  .attr("stroke-width",1)
        .classed("dpline");



    /*Legend */
    svg.append("circle").attr("cx", width - 100).attr("cy", 10).attr("r", 6).style("fill", "#FF0000")
    svg.append("circle").attr("cx", width - 200).attr("cy", 10).attr("r", 6).style("fill", "#FF8C00")
    svg.append("circle").attr("cx", width - 300).attr("cy", 10).attr("r", 6).style("fill", "#008000")
    svg.append("text").attr("x", width - 80).attr("y", 10).text("Fail").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg.append("text").attr("x", width - 180).attr("y", 10).text("Warning").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg.append("text").attr("x", width - 280).attr("y", 10).text("Pass").style("font-size", "15px").attr("alignment-baseline", "middle")
}












