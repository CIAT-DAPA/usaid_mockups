var D3Graphics = D3Graphics || {};

D3Graphics.Barchart = D3Graphics.Barchart || {};

D3Graphics.Barchart.vars = {
    container: '#chart'
}

D3Graphics.Barchart.render = function (data) {
    var margin = { top: 80, right: 80, bottom: 80, left: 80 },
        width = 850 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var svg = d3.select(D3Graphics.Barchart.vars.container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("class", "graph")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    x.domain(data.map(function (d) { return d.Fecha; }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    var y = d3.scale.linear().domain([0, 8000]).range([height,0]),
        yDesviacion = d3.scale.linear().domain([0, 8000]).range([0,height]);


    // create left yAxis
    var yAxisLeft = d3.svg.axis().scale(y).ticks(8).orient("left");

    svg.append("g")
        .attr("class", "y axis ")
        .attr("transform", "translate(0,0)")
        .call(yAxisLeft)
        .append("text")
        .attr("y", 6)
        .attr("dy", "-2em")
        .style("text-anchor", "end")
        .text("Rend. Kg/ha");

    // Tooltip
    var tooltip = d3.select(D3Graphics.Barchart.vars.container).append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

    var bars = null;

    var format = d3.format(",.0f");

    var variedad = [];
    var rango = 0;    
    for (var i = 0; i < data.length; i++) {
        if (variedad.indexOf(data[i].Variedad) < 0) {
            variedad.push(data[i].Variedad);

            bars = svg.selectAll(".bar").data(data.filter(function (item) {
                return item.Variedad == variedad[variedad.length - 1];
            })).enter();

            bars = bars.append("rect")
                .attr("data-legend", function (d) { return d.Variedad })
                .attr("class", "bar" + variedad.length)
                .attr("x", function (d) { return x(d.Fecha) + rango; })
                .attr("width", (x.rangeBand() / 2) * .9)
                .attr("y", function (d) { return y(d.RendimientoPromedio) -  (yDesviacion(d.RendimientoDesviacion) ); })
                .attr("height", function (d, i, j) { return yDesviacion(d.RendimientoDesviacion) * 2; })
                .on("mouseover", function (d) {
                    var r = parseFloat(d.RendimientoDesviacion);
                    var lower = parseFloat(d.RendimientoPromedio) - r;
                    var upper = parseFloat(d.RendimientoPromedio) + r;
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9)
                        .style("background", 'lightsteelblue');
                    tooltip.html('[' + format(lower) + '-' + format(upper) + ']<br />' + 
                                'Rendimiento promedio: ' + format( d.RendimientoPromedio) + 'Kg/ha <br />' + 
                                'Desviación: ' + format( d.RendimientoDesviacion) + 'Kg/ha')
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function (d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            rango += x.rangeBand() / 2;
        }
    }

    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(30,-30)")
        .style("font-size", "12px")
        .call(d3.legend);
}