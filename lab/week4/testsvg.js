/*
* Joost Kooijman, minor programmeren, dataprocessing
* Making a legenda complete
*/

d3.xml("test.svg", "image/svg+xml", function(error, xml){ 
	if (error) throw error;

	//append the incomplete image to the document
	document.body.appendChild(xml.documentElement)

	// name the image legenda and change attributes
	legenda = d3.select("svg")
	legenda.attr("height", 1500)

	// select 2 boxes and a text box to get the information necessary
	box_1 = d3.select("#kleur1")
	box_2 = d3.select("#kleur2")

	text_1 = d3.select("#tekst1")

	colours = ['#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#005824','#d3d3d3']
	text = ['100', '1000', '10000', '100000', '1000000', '10000000', 'Unknown']
	
	// get offset value and ranges between boxes
	y_0 = parseFloat(box_1.attr("y"))
	d_y = parseFloat(box_2.attr("y") - box_1.attr("y"))

	// remove all boxes and textboxes
	d3.select("body").selectAll(".st1").remove()
	d3.select("body").selectAll(".st2").remove()

	// add all boxes with information
	boxes = legenda.selectAll("st1")
	    .data(colours)
	    .enter()
	    .append("rect")
	    .attr("x", 13)
	    .attr("y", function(d,i){ return y_0 + i * d_y * 0.93; })
	    .attr("height", parseFloat(box_1.attr("height")))
	    .attr("width", parseFloat(box_1.attr("width")))
	    .attr("class", "st1")
	    .style("fill", function(d) {return d})
	    .style("stroke", "#ffffff")

	// add all textbars
	bars = legenda.selectAll("st2")
	    .data(colours)
	    .enter()
	    .append("rect")
	    .attr("x", 46.5)
	    .attr("y", function(d, i){ return y_0 + i * d_y * 0.93; })
	    .attr("height", parseFloat(text_1.attr("height")))
	    .attr("width", parseFloat(text_1.attr("width")))
	    .attr("class", "st2")
	    .style("stroke", "#ffffff")

	// add text into bars by adding text on corresponding coords
	legenda.selectAll("g")
		.data(text)
		.enter()
		.append("text")
		.attr("x", 46.5 + 25)
		.attr("y", function(d, i){ return y_0 + i * d_y * 0.93 + 19; })
		.text(function(d) { return d; })

	// remove border
	legenda.select(".st0")
		.style("stroke", "#ffffff");

});