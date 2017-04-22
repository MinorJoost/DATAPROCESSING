/*
Joost Kooijman, 10760768
Dataprocessing week 3 barchart in d3
Javascript code to create a interactive barchart
*/

window.onload = function () {
	//start code when window is loaded

	// initialize needed values
	var margin = {top:10, right:100, bottom:150, left:100},
	    width  = 800,
	    height = 500;

	// select element and give it some attributes
	var svg = d3.select(".chart")
	    .attr("width", "95%")
	    .attr("height", "60%")
	    .attr("viewBox", "0 0 " + width + " " + height);

	// initialize scale functions
	var yScale = d3.scale.linear()
	    .range([height - margin.top - margin.bottom, 0]);

	var xScale = d3.scale.ordinal()
	    .rangeRoundBands([0, width - margin.right - margin.left], .1);

	// initialize axis
	var xAxis = d3.svg.axis()
	    .scale(xScale)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(yScale)
	    .orient("left");

	//read in data in json format
	d3.json("jsonfile.json", function(data) {

	// initialize a tooltip which is now inivisible
	var div = d3.select("body").append("div")	
	    .attr("class", "tooltip")				
	    .style("opacity", 0);

	// initialize scale
	yScale.domain([0, d3.max(data, function(d){ return d["rain"]; })]);
	yScale.domain([0,1600])
	xScale.domain(data.map(function(d){ return d["month"]; }));

	/* append data with corresponding transformed values
	   fill bars with steelblue but if person hovers over
	   bar it changes to #d2ff4d which is yellow.
	   Once hovered the tooltip appears containing the info.
	*/
	bars = svg.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	    .selectAll(".bar")
	    .data(data)
	    .enter()
	    .append("rect")
	    .attr("class", "bar")
	    .attr("x", function(d){ return xScale(d["month"]); })
	    .attr("y", function(d){ return yScale(d["rain"]); })
	    .attr("height", function(d){ return height - margin.top - margin.bottom - yScale(d["rain"]); })
	    .attr("width", function(d){ return xScale.rangeBand(); })
	    .attr("fill", "steelblue")
	    .on("mouseover", function(d){  //Mouse event
	                d3.select(this)
	                    .transition()
	                    .duration(0)
	                    .attr("fill", "#d2ff4d");

	            div.transition()		
	               .duration(200)		
	               .style("opacity", .9);

	            div.html("Total rainfall in " + d.month + " 2016 was "  + d.rain + " mm")	
	                .style("left", (d3.event.pageX) + "px")		
	                .style("top", (d3.event.pageY - 28) + "px")
	                .style("position", "absolute")
		
		})
		.on("mouseout", function(d){
	        d3.select(this)
	            .transition()
	            .duration(500)
				.attr("fill", "steelblue");

	        div
	            .transition() 
	            .style("opacity", "0")            
	    })


	//adding y axis to the left of the chart
    svg.append("g")
	    .attr("class", "y axis")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	    .call(yAxis)


	//adding x axis to the bottom of chart
	svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")")
	    .call(xAxis)
	//rotating monthnames so they fit
	.selectAll("text")
	    .attr("y", 15)
	    .attr("x", -15)
	    .attr("dy", ".35em")
	    .attr("transform", "rotate(15)")
	    .style("text-anchor", "start");


	//adding a label at the top of the chart
	svg.append("g")
	    .attr("transform", "translate(" + (width/2) + ", 15)")
	    .append("text")
	    .text("Total rainfall per month in de Bilt 2016 in mm")
	    .style({"text-anchor":"middle", "font-family":"Arial", "font-weight":"800"});


	});
}
