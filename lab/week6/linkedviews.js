// Joost Kooijman, 10760768

// initialize colourscheme for map
var colour = d3.scale.linear()
    .range(['lightblue', '#003366']);

// initialize variables for barchart
var barVariables = ["Export", "Import"],
    barData = [];

// initialize colours for barchart
var barColours = d3.scale.ordinal()
    .domain(barVariables)
    .range(["green", "blue"]);

// set all data in queue
queue()
    .defer(d3.json, "2012.json")
    .defer(d3.json, "2013.json")
    .defer(d3.json, "2014.json")
    .defer(d3.json, "2015.json")
    .awaitAll(onLoad);

// start function once data is loaded
function onLoad(error, data) {

    // if there is an error alert user
    if (error){
        alert(error);
    }


    current = data[0];
    countryCodes = Object.keys(current);  
    selected = countryCodes[0];

    // initialize constants for barchart
    barWidth = 40;
    barSpacing = 25;
    transition = 150;

    // function for changing the plots
    function changeYear(val) {

        current = data[val];
        colours = {};
        gdp = [];

        // add logged values of gdp to array
        $.each(countryCodes, function(i, val) {
            gdp.push(Math.log(parseFloat(current[val].GDP)));
        });

        // initialize corresponding colourdomain
        colour.domain([Math.min(...gdp), Math.max(...gdp)]);

        // create colours for map
        $.each(countryCodes, function(i, val) {
            colours[val] = colour(gdp[i]);
        });

        // draw new bars and update the maps colours
        drawBars();
        map.updateChoropleth(colours);
    }

    function drawBars() {

        // get data of selected country
        var countryData = current[selected];
        barData = [];

        // add all economic indicators to json format for easy use
        for (var i = 0, n = barVariables.length; i < n; i++) {
            barData.push({
                'indicator': barVariables[i],
                'value': parseFloat(countryData[barVariables[i]])
            });
        };

        // initialize length of bars, called each time because domain differs
        var barLength = d3.scale.linear()
            .range([0, 70])
            .domain([0, d3.max(barData, function(d) {return d.value} )]);

        // transition all bars to new values
        bar.selectAll(".bar rect")
            .data(barData)
            .transition().duration(transition)
            .attr("width", function(d) {
                return barLength(d.value) + "%";
            });

        // add dynamic text to the left of bar containing economic indicator values
        bar.selectAll(".bartext")
            .data(barData)
            .transition().duration(transition)
            .attr("x", function(d) {
                return ( barLength(d.value) + 0.5) + "%";
            })
            .text(function(d) {
                return d.value;
            });

        // remove the old title
        d3.selectAll(".bartitle").remove()

        // create a new one
        bar.append("text")
            .attr("class", "bartitle")
            .attr("transform", "translate(110,400)")
            .attr("x", 0)             
            .attr("y", -barVariables.length * (barWidth + barSpacing) + barWidth / 2 - 140)
            .attr("text-anchor", "beginning")  
            .style("font-size", "26px") 
            .style("text-decoration", "underline")
            .text(countryData.Country);
    }

    // initialize chart
    var chart = d3.select("#barchart").append("svg")
        .attr("width", window.innerWidth / 2)
        .attr("height", window.innerHeight);

    var bar = chart.append("g")
        .attr("id", "bar");

    // append bars without any x coordinate, will be filled in on drawBars call
    var barchart = bar.selectAll(".bar")
        .data(barVariables)
        .enter().append("g")
            .attr("transform", "translate(110, 400)")
            .attr("class", "bar")
            .append("rect")
                .attr("fill", function(d) { return barColours(d); })
                .attr("height", barWidth)
                .attr("y", function(d, i) {
                    return -i * (barWidth + barSpacing) -  155;
                });

    // append text element which will be filled in on Drawbars call
    bar.selectAll(".bar").append("text")
        .data(barVariables)
        .attr("class", "bartext")
        .attr("y", function(d, i) {
            return -i * (barWidth + barSpacing) + barWidth / 2 - 150;
        });

    // append non dynamic text containing econmic indicators
    bar.selectAll(".bar")
        .data(barVariables)
        .append("text")
            .attr("class", "text")
            .attr("x", 10)
            .attr("y", function(d, i) {
                return -i * (barWidth + barSpacing) + barWidth / 2 + -150;
            })
            .text(function(d) { return d + " (in Millions \u20AC)"; });

    // create the new map using Datamaps
    var map = new Datamap({

        element: $('#map')[0],
        setProjection: function(element) {
            var projection = d3.geo.equirectangular()

                // make sure europe is in view
                .center([13, 38.5])
                .rotate([10, -15])
                .scale(800)
                .translate([element.offsetWidth / 2, element.offsetHeight / 2]);

            var path = d3.geo.path()
                .projection(projection);

            return {path: path, projection: projection};
        },
        fills: {
            defaultFill: "grey"
        },
        geographyConfig: {
            borderColor: '#000000',

            // add popup containing GDP
            popupTemplate: function(geography, data) {
                if ($.inArray(selected, countryCodes) != -1){
                return  '<div class="hoverinfo"><strong>' + 
                        '<table class="table-popup" style="width:210px"><tr><td>Country:</td><td>'+ geography.properties.name +
                        '</td></tr><tr><td>GDP (in Millions \u20AC):</td><td>'+ current[geography.properties.iso].GDP +'</td></tr></table>'+'</div>';
                }
            }    
        },

        // on click draw bars of clicked country if data exists
        done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                selected = geography.properties.iso;
                if ($.inArray(selected, countryCodes) != -1){
                    drawBars();
                }
            })
        }
    });

    // change the year to first year
    val = 0;
    changeYear(val);

    // dynamically add dropdown values and years
    for (var i = 0; i < data.length; i++)
    {
        var newOption = $('<option>');
        newOption.attr('value', i).text(data[i].AUT.Year)
        $('#inds').append(newOption)
    }

    // add functionality to dropdown
    d3.select("#inds")
        .on("change", function () {
            var sect = document.getElementById("inds")
            var val = sect.options[sect.selectedIndex].value
            changeYear(val); });
}
