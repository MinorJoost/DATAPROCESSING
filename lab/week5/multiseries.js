/* Joost Kooijman, minor programmeren, dataprocessing
Make a multilinegraph, ran out of time and did not add button options 
*/

// load data
d3.json("nested_data.json", function(error, data) 
{
    if (error){
        alert(error)
    }

    // initaliaze margins
    var margin = {top: 10, right: 10, bottom: 20, left: 50};
    var width = 860 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    // initialize scales
    var x = d3.scaleTime()
              .domain([new Date(1900, 0, 1), new Date(1900, 11, 31)])
              .range([0, width]);

    var y = d3.scaleLinear().range([height, 0]);
    var z = d3.scaleOrdinal(d3.schemeCategory10);

    // initialize parser for time
    var parseTime = d3.timeParse("%B");

    // initialize line
    var line = d3.line()
        .x(function(d) { return x(parseTime(d["month"])); })
        .y(function(d) { return y(d["temperature"]); });

    // locations holds debilt and paris
    locations = data.map(function (d) { return d["location"] + " Mean"; })
                .concat(data.map(function (d) { return d["location"] + " Low"; })
                .concat(data.map(function (d) { return d["location"] + " High"; }))).sort();

    // make locations hold the nested data
    locations = locations.map(function (id, i) {

        lastLetter = id.split("")[id.length - 1];
        counter = Math.floor(i / 3);

	    return {
	        id: id,
	        values: data[counter]["values"].map(function (d) {
		        if (lastLetter == "w")  
		            return {month: d["Months"], temperature: d["Coldest"]};
		        else if (lastLetter == "n")
		            return {month: d["Months"], temperature: d["Normal"]};
		        else
		            return {month: d["Months"], temperature: d["Warmest"]};
     		})
    	}
	})

    // initialize domain
    y.domain([Math.floor(d3.min(locations, function(d) { return d3.min(d.values, function(d) { return d.temperature; }); })),
              Math.ceil(d3.max(locations, function(d) { return d3.max(d.values, function(d) { return d.temperature; }); }) + 2) ]);

    z.domain(locations.map(function(c) { return c.id; }));

    // because I ran out of time I hardcoded this to only hold de Bilt data, 3-5 holds paris data
    locations = [locations[0], locations[1], locations[2]];

    // make svg element
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // append axis
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
              .tickFormat(d3.timeFormat("%B")))
      .selectAll("text")    
        .style("text-anchor", "start")
        .attr("dx", ".2em")
        .attr("dy", ".15em");

    svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));

    // add location to g
    var location = svg.selectAll(".location")
    .data(locations)
    .enter().append("g")
      .attr("class", "location");

    // append lines to location
    location.append("path")
      .data(locations)
      // give class De Bilt or Paris
      .attr("class", function(d) 
        { 
	      	lastIndex = d.id.lastIndexOf(" ");
	        str = d.id.substring(0, lastIndex); 
	        return str; 
        })
      .attr("d", function(d) { return line(d.values); })
      .attr("fill", "none")
      .attr("stroke-width", 12)
      .style("stroke", function(d) { return z(d.id); })
      .on("mouseover", function(d) {
      	//make crosshairs and values
        var mouse = d3.mouse(this)
        highlight = Math.floor(mouse[0]  / (width / 12) );

            xCoord = x(parseTime(d.values[highlight].month))
            yCoord1 = y(locations[0].values[highlight].temperature);
            yCoord2 = y(locations[1].values[highlight].temperature);
            yCoord3 = y(locations[2].values[highlight].temperature);

            lineH1.attr("y1",yCoord1)
                  .attr("y2", yCoord1);

            lineH2.attr("y1",yCoord2)
                  .attr("y2", yCoord2);

            lineH3.attr("y1",yCoord3)
                  .attr("y2", yCoord3);

            lineV.attr("x1", xCoord)
                 .attr("x2", xCoord);

            circle1.attr("cx", xCoord)
                   .attr("cy", yCoord1);

            circle2.attr("cx", xCoord)
                   .attr("cy", yCoord2);

            circle3.attr("cx", xCoord)
                   .attr("cy", yCoord3);

            calloutH1.attr("y", yCoord1 - 2)
                     .text(locations[0].values[highlight].temperature);

            calloutH2.attr("y", yCoord2 - 2)
                     .text(locations[1].values[highlight].temperature);

            calloutH3.attr("y", yCoord3 - 2)
                     .text(locations[2].values[highlight].temperature);

            lineH1.attr("display", "inherit");
            lineH2.attr("display", "inherit");
            lineH3.attr("display", "inherit");

            lineV.attr("display", "inherit");

            circle1.attr("display", "inherit");
            circle2.attr("display", "inherit");
            circle3.attr("display", "inherit");

            calloutH1.attr("display", "inherit");
            calloutH2.attr("display", "inherit");
            calloutH3.attr("display", "inherit");
      })

    .on("mouseout", function(d) {
    	// makes everything dissapear
        lineH1.attr("display", "none");
        lineH2.attr("display", "none");
        lineH3.attr("display", "none");
        
        lineV.attr("display", "none");

        circle1.attr("display", "none");
        circle2.attr("display", "none");
        circle3.attr("display", "none");

        calloutH1.attr("display", "none");
        calloutH2.attr("display", "none");
        calloutH3.attr("display", "none");
    })

    // add text to the right to show values
    location.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(parseTime(d.value.month)) + "," + y(d.value.temperature) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .attr("class", "linetext")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; });

    // add a title
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 + 2 * margin.top)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Hottest, coldest and normal monthly temperatures in de Bilt");

    // initialize crosshairs by adding lines, circles and textelements
    var root = location.append("g")
                       .attr("class", "crosshairs");

    lineH1 = root.append("line")
        .attr("class", "crosshairs horizontal")
        .attr("stroke-width", 1)
        .attr("stroke", "steelblue")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
        .attr("display", "none");

    lineH2 = root.append("line")
        .attr("class", "crosshairs horizontal")
        .attr("stroke-width", 1)
        .attr("stroke", "steelblue")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
        .attr("display", "none");

    lineH3 = root.append("line")
        .attr("class", "crosshairs horizontal")
        .attr("stroke-width", 1)
        .attr("stroke", "steelblue")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
        .attr("display", "none");

    lineV = root.append("line")
        .attr("class", "crosshairs vertical")
        .attr("stroke-width", 1)
        .attr("stroke", "steelblue")
        .attr("y1", y.range()[0])
        .attr("y2", y.range()[1])
        .attr("display", "none");

    circle1 = root.append("circle")
        .attr("class", "crosshairs circle")
        .attr("fill", "black")
        .attr("r", 6)
        .attr("display", "none");

    circle2 = root.append("circle")
        .attr("class", "crosshairs circle")
        .attr("fill", "black")
        .attr("r", 6)
        .attr("display", "none");

    circle3 = root.append("circle")
        .attr("class", "crosshairs circle")
        .attr("fill", "black")
        .attr("r", 6)
        .attr("display", "none");

    calloutH1 = root.append("text")
        .attr("class", "crosshairs callout horizontal")
        .attr("x", x.range()[1])
        .attr("style", "text-anchor: end")
        .attr("display", "none");

    calloutH2 = root.append("text")
        .attr("class", "crosshairs callout horizontal")
        .attr("x", x.range()[1])
        .attr("style", "text-anchor: end")
        .attr("display", "none");

    calloutH3 = root.append("text")
        .attr("class", "crosshairs callout horizontal")
        .attr("x", x.range()[1])
        .attr("style", "text-anchor: end")
        .attr("display", "none");
})


