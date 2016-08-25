var D3Graphics = D3Graphics || {};

D3Graphics.CalendarHeatmap = D3Graphics.CalendarHeatmap || {};

D3Graphics.CalendarHeatmap.vars = {
    container: '#chartHeatmap'
};

D3Graphics.CalendarHeatmap.tools = {

}

D3Graphics.CalendarHeatmap.render = function (items) {
    var containerEl = document.getElementById(D3Graphics.CalendarHeatmap.vars.container.replace('#', ''));

    var width = 960,
        height = 136,
        cellSize = 17; // cell size

    var color = d3.scale.quantize()
        //.domain([5776.1145, 6417.801])
        .domain([2000, 12000])
        .range(d3.range(11).map(function (d) { return "q" + d + "-11"; }));


    var percent = d3.format(".1%"),
        format = d3.time.format("%Y-%m-%d"),
        round = d3.format(",.0f");


    var svg = d3.select(D3Graphics.CalendarHeatmap.vars.container).selectAll("svg")
        .data(d3.range(2016, 2017))
        .enter().append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "RdYlGn")
        .append("g")
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

    svg.append("text")
        .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
        .style("text-anchor", "middle")
        .text(function (d) { return d; });
    
    /* Month titles */
  var weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    var titlesMonth = svg.selectAll('.year')
        .selectAll('.titles-month')
        .data(month)
        .enter().append('g')
        .attr('class', 'titles-month')
        .attr('transform', function (d, i) {
            return 'translate(' + (((i + 1) * (width / 12)) ) + ',0)';
        });

    titlesMonth.append('text')
        .attr('class', function (d, i) { return month[i]; })
        .style('text-anchor', 'end')
        .text(function (d, i) { return month[i]; });

   /* var titlesDays = svg.selectAll('.year')
        .selectAll('.titles-day')
        .data(weekDays)
        .enter().append('g')
        .attr('class', 'titles-day')
        .attr('transform', function (d, i) {
            return 'translate(-5,' + cellSize * (i + 1) + ')';
        });

    titlesDays.append('text')
        .attr('class', function (d, i) { return weekDays[i]; })
        .style('text-anchor', 'end')
        .attr('dy', '-.25em')
        .text(function (d, i) { return weekDays[i]; });*/

    var rect = svg.selectAll(".day")
        .data(function (d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function (d) { return d3.time.weekOfYear(d) * cellSize; })
        .attr("y", function (d) { return d.getDay() * cellSize; })
        .datum(format);

    rect.append("title")
        .text(function (d) { return d; });

    svg.selectAll(".month")
        .data(function (d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("path")
        .attr("class", "month")
        .attr("d", monthPath);


    var data = d3.nest()
        .key(function (d) { return d.Fecha; })
        .rollup(function (d) { return d[0].RendimientoPromedio; })
        .map(items);

    rect.filter(function (d) { return d in data; })
        .attr("class", function (d) { return "day " + color(data[d]); })
    /*.select("title")
    .text(function (d) { return d + ": " + round(data[d]); });*/


    //  Tooltip Object
    var tooltip = d3.select("body")
        .append("div").attr("id", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("a simple tooltip");

    rect.on("mouseover", function (d) {
        tooltip.style("visibility", "visible");
        var value = ((data[d] !== undefined) ? round(data[d]) : round(0)) + ' Kg/ha';
        var purchase_text = d + ": " + value;

        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(purchase_text)
            .style("left", (d3.event.pageX) + 30 + "px")
            .style("top", (d3.event.pageY) + "px");
    });

    rect.on("mouseout", function (d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        var $tooltip = $("#tooltip");
        $tooltip.empty();
    });

    function monthPath(t0) {
        var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
            d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
        return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
            + "H" + w0 * cellSize + "V" + 7 * cellSize
            + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
            + "H" + (w1 + 1) * cellSize + "V" + 0
            + "H" + (w0 + 1) * cellSize + "Z";
    }

    
}