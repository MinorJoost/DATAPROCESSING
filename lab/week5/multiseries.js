/* Joost Kooijman, minor programmeren, dataprocessing
Make a scatterplot using data from the world bank using d3
*/

// load data
d3.json("data.json", function(error, data) {
	if (error) throw error;
	var margin = {top: 10, right: 10, bottom: 20, left: 50},
	    width = 860 - margin.left - margin.right,
	    height = 1000 - margin.top - margin.bottom;

	var x = d3.scaleTime()
	    .domain([new Date(2016, 0, 1), new Date(2016, 11, 31)])
	    .range([0, width]);

	data.forEach(function(d) 
    {
	    d["Warmest"] = +d["Warmest"]
	    d["Coldest"] = +d["Coldest"]
	    d["Normal"] = +d["Normal"]
 	})    

	var maxTemp = d3.max(data, function(d) { return d["Warmest"]})
	var minTemp = d3.min(data, function(d) { return d["Coldest"]})

	var y = d3.scaleLinear()
		.domain([Math.floor(minTemp), Math.ceil(maxTemp)])
    	.range([height, 0])

	var svg = d3.select("body").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  	.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
              .tickFormat(d3.timeFormat("%B")))
      .selectAll("text")	
        .style("text-anchor", "start")
        .attr("dx", ".2em")
        .attr("dy", ".15em")

    svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y))

    var line = d3.line()
    .x(function(d) { return x(d["Months"]) })
    .y(function(d) { return y(d["Normal"]) })


    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);
	

})
 