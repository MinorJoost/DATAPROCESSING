/* Joost Kooijman, minor programmeren, dataprocessing
Make a scatterplot using data from the world bank using d3
*/

// load data
d3.tsv("data.tsv", function(error, data){
	if (error) throw error;

	// initialize dimensions of image
	width = 650
	height = 650

	colors = ['#e7298a','#006837','#e31a1c','#0868ac']
	margin = {top:100, right:50, bottom:50, left:50}

	// define scales
	x = d3.scale.linear()
    	.range([0, width])

	y = d3.scale.linear()
    	.range([height, 0])

    // initialize axis
    xAxis = d3.svg.axis()
            .scale(x)
    		.orient("bottom")

    yAxis = d3.svg.axis()
    		.scale(y)
    		.orient("left")

    // append svg element to the body and call it svg
    svg = d3.select("body").append("svg")
    		.attr("width", width + margin.left + margin.right)
    		.attr("height", height + margin.top + margin.bottom)
  			.append("g")
    			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // change strings to numbers
    data.forEach(function(d) 
    {
	    d["Fertility"] = +d["Fertility"]
	    d["LogGDP"] = +d["LogGDP"]
 	})

    // initialize domain
	x.domain(d3.extent(data, function(d) { return d["LogGDP"]; })).nice()
    y.domain(d3.extent(data, function(d) { return d["Fertility"]; })).nice()

    // initialize a tooltip which is now inivisible
	var div = d3.select("body").append("div")   
	    .attr("class", "tooltip")
	    .attr("container", "body")               
	    .style("opacity", 0)

	// add axis to svg
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .style("fill", "#252525")
        .call(xAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("x", width)
	      .attr("y", -6)
	      .style("text-anchor", "end")
	      .text("log GDP per capita ($)")

	svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .style("fill", "#252525")
	    .append("text")
	      .attr("class", "label")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Total births per woman")

	// add all dots of the scatterplot
	// radius changes as a function of normalized population
	// x coord represented by logGDP
	// y coord represented by fertility
	// give dot a class to colorscheme it with continents
	svg.selectAll(".dot")
        .data(data)
	    .enter().append("circle")
	        .attr("class", "dot")
	        .attr("r", function(d) { return d["Normalized"] })
	        .attr("cx", function(d) { return x(d["LogGDP"]) })
	        .attr("cy", function(d) { return y(d["Fertility"]) })
	        .attr("class", function(d) { return d["Continent"] })
		    
	        // on mouseover show a table containing all the information of the country
		    .on("mouseover", function(d){ 
					div.transition()		
		               .duration(200)		
		               .style("opacity", .9)

		            div .html("<table class='example-table'><caption><h3>"+ d.Country + "</h3></caption>" +
		            	"<tr><tr><td>BPW: &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>" + d.Fertility + "</td>" + 
		            	"</tr><tr><tr><td>GDP:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td><td>" +"$"+ d.GDP + "</td>" + 
		            	"</tr><tr><tr><td>Population</td><td>" + d.Population + "</td></tr></table>")
		                .style("left", (d3.event.pageX + 10) + "px")		
	               		.style("top", (d3.event.pageY - 85) + "px")
		                .style("position", "absolute")
		
			})

			// let information dissapear on mouseout
			.on("mouseout", function(d){
			        div.transition() 
			            .duration(200)
			            	.style("opacity", 0) 
			        div.html("")

		    })

	// colour all continents and corresponding countries
	svg.selectAll(".Asia")
		.style("fill", colors[0])

	svg.selectAll(".Africa")
		.style("fill", colors[1])

	svg.selectAll(".America")
		.style("fill", colors[2])

	svg.selectAll(".Europe")
		.style("fill", colors[3])

	// add legenda with correct colours
	legend = svg.selectAll(".legend")
        .data(colors)
	    .enter().append("g")
	      .attr("class", "legend")
	      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")" })

	legend.append("rect")
		.data(colors)
	      .attr("x", width - 30)
	      .attr("width", 10)
	      .attr("height", 10)
	      .style("fill", function(d, i) { return d })

	legend_text = ['Asia', 'Africa', 'America', 'Europe']

	legend.append("text")
	.data(legend_text)
      .attr("x", width - 35)
      .attr("y", 5)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d })
    
    // add a title
    title_text = ["circle size represents lognormalized population size", "Relationship between GDP per Capita and total births per woman (BPW)"]

    legend.append("text")
	.data(title_text)
      .attr("x", width/2)
      .attr("y", function(d,i) { return -40 * (i+1) })
      .attr("dy", ".35em")
      .attr("font-size","20px")
      .style("text-anchor", "middle")
      .text(function(d) { return d })

})
 