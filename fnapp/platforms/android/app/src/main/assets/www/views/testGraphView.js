
function TestGraphView() {

    this.graphData = { graphHeight: "0", graphWidth: "0",
     yAxis:{point1:0,point2:1,point3:2,point4:3},
     yAxis:{point1:0,point2:1,point3:2,point4:3}
};

this.precompile();
this.compile(this.graphData);
this.attachEvents();
    
   
}

TestGraphView.prototype.compile = function (graphData) {
    let graphTemplate = Handlebars.compile($("#graphTemplate").html());
    let graphHtml = graphTemplate(graphData);
    $(".content-padded").html(graphHtml);
}

TestGraphView.prototype.attachEvents = function () {

}

TestGraphView.prototype.precompile = function () {
    let currObj = this;

    //TODO possible replace with iteration or recursion
    let generateXandYaxis = function (graphData) {
    
        let xDivsion = graphData.graphWidth/4;
        let yDivision = graphData.graphHeight/4;
        console.log(yDivision +" y division");
        // graphData.yAxis.point1 = yDivision;
        // graphData.yAxis.point2 = yDivision*2;
        // graphData.yAxis.point3 = yDivision*3;
        // graphData.yAxis.point4 = yDivision*4;



        graphData.yAxis.point1 = graphData.graphHeight -(yDivision*4);
        console.log(graphData.yAxis.point1 +"top label")
        graphData.yAxis.point2 = graphData.graphHeight -(yDivision*3);
        graphData.yAxis.point3 = graphData.graphHeight -(yDivision*2);
        graphData.yAxis.point4 = graphData.graphHeight - yDivision;

    }


    /**
     * Determine size of graph based on screen height and width
     * @param {*} screenWidth 
     * @param {*} parentHeight 
     */
    let determineGraphSize = function (screenWidth, parentHeight) {
        console.log(screenWidth + "by" + parentHeight);
        currObj.graphData.graphHeight = parentHeight - 250;
        currObj.graphData.graphWidth = screenWidth - 40;
        console.log(currObj.graphData.graphHeight + "by" + currObj.graphData.graphWidth);      
    }



    determineGraphSize(window.screen.width, window.screen.height);
    generateXandYaxis(this.graphData);
}












