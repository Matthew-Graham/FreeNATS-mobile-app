
function TestGraphView() {


    this.compile();
    this.precompile();
    this.attachEvents();


}

TestGraphView.prototype.compile = function (graphData) {
    let graphTemplate = Handlebars.compile($("#graphTemplate").html());
    let graphHtml = graphTemplate();
    $(".content-padded").html(graphHtml);
}

TestGraphView.prototype.attachEvents = function () {

}

TestGraphView.prototype.precompile = function () {
    let currObj = this;
    let container = $(".content-padded");
    //replace with container height


    //test data

    let jsonObj = {
        period: {
            startx: 1560336237,
            finishx: 1560422637,
        }
        ,
        data:
            [
                {
                    recordx: "1560336361",
                    recorddt: "10:46:01 12/06/2019",
                    value: "0.203",
                    alertlevel: "0"
                },
                {
                    recordx: "1560336661",
                    recorddt: "10:51:01 12/06/2019",
                    value: "0.229",
                    alertlevel: "0"
                },
                {
                    recordx: "1560336962",
                    recorddt: "10:56:02 12/06/2019",
                    value: "0.235",
                    alertlevel: "0"
                },
            ]
    }

    let heightPadding = 30;
    let widthPadding = 20;
    let height = 400;
    let width = window.screen.width - widthPadding;

    let svg = d3.select('.content-padded')
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("style", "background-color:#d2ddef");


    let min = jsonObj.period.startx;
    let max = jsonObj.period.finishx;


    //need to get max value of data point either pre d3 or using max function
    console.log(min);
    console.log(max);
    // /* Graph Scales */

    let xScale = d3.scaleTime()
        .domain([min, max])
        .range([widthPadding, width - widthPadding]);

    let yScale = d3.scaleLinear()
        // .domain([-1, d3.max(jsonObj, function (d) {
        //     console.log("value"+ d.data.value)
        //     return d.data.value;
        // })])
        .domain([-1,5])
        .range([height - heightPadding, heightPadding]);



    /* 
      X Axis
    */
    let xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(4);

    /**
     * Create x 
     */
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - heightPadding) + ")")
        .call(xAxis);

    /* 
    Define  axis*/
    let  yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(5);

    /* Create y */
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate (" + widthPadding + ",0)")
        .call(yAxis);




}












