var D3Graphics = D3Graphics || {};

D3Graphics.Trend = D3Graphics.Trend || {};

D3Graphics.Trend.vars = {
    container: "chart_trend",
    format: d3.format(',.0f')
}


D3Graphics.Trend.render = function (data) {
    console.log(data);
    //function drawPaths (svg, data, x, y) {
    var containerEl = document.getElementById(D3Graphics.Trend.vars.container);
    var width = containerEl.clientWidth,
        height = width * 0.4,
        margin = { top: 20, right: 20, bottom: 40, left: 40 },
        chartWidth = width - margin.left - margin.right,
        chartHeight = height - margin.top - margin.bottom;

    var svg = d3.select("#" + D3Graphics.Trend.vars.container).append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    
    var x = d3.time.scale().range([0, chartWidth])
        .domain(d3.extent(data, function (d) { return d.Fecha; })),
        y = d3.scale.linear().range([chartHeight, 0])
            .domain([0, d3.max(data, function (d) { return d.pct95; })]);

    // clipping to start chart hidden and slide it in later
    var rectClip = svg.append('clipPath')
        .attr('id', 'rect-clip')
        .append('rect')
        .attr('width', 0)
        .attr('height', chartHeight);

    var upperOuterArea = d3.svg.area()
        .interpolate('basis')
        .x(function (d) { return x(d.Fecha) || 1; })
        .y0(function (d) { return y(d.pct95); })
        .y1(function (d) { return y(d.pct75); });

    var upperInnerArea = d3.svg.area()
        .interpolate('basis')
        .x(function (d) { return x(d.Fecha) || 1; })
        .y0(function (d) { return y(d.pct75); })
        .y1(function (d) { return y(d.pct50); });

    var medianLine = d3.svg.line()
        .interpolate('basis')
        .x(function (d) { return x(d.Fecha); })
        .y(function (d) { return y(d.pct50); });

    var lowerInnerArea = d3.svg.area()
        .interpolate('basis')
        .x(function (d) { return x(d.Fecha) || 1; })
        .y0(function (d) { return y(d.pct50); })
        .y1(function (d) { return y(d.pct25); });

    var lowerOuterArea = d3.svg.area()
        .interpolate('basis')
        .x(function (d) { return x(d.Fecha) || 1; })
        .y0(function (d) { return y(d.pct25); })
        .y1(function (d) { return y(d.pct05); });

    svg.datum(data);

    svg.append('path')
        .attr('class', 'area upper outer')
        .attr('d', upperOuterArea)
        .attr('clip-path', 'url(#rect-clip)');

    svg.append('path')
        .attr('class', 'area lower outer')
        .attr('d', lowerOuterArea)
        .attr('clip-path', 'url(#rect-clip)');

    svg.append('path')
        .attr('class', 'area upper inner')
        .attr('d', upperInnerArea)
        .attr('clip-path', 'url(#rect-clip)');

    svg.append('path')
        .attr('class', 'area lower inner')
        .attr('d', lowerInnerArea)
        .attr('clip-path', 'url(#rect-clip)');

    svg.append('path')
        .attr('class', 'median-line')
        .attr('d', medianLine)
        .attr('clip-path', 'url(#rect-clip)');



    // Axis
    

    var xAxis = d3.svg.axis().scale(x).orient('bottom')
        .innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10),
        yAxis = d3.svg.axis().scale(y).orient('left')
            .innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10);

    var axes = svg.append('g')
        .attr('clip-path', 'url(#axes-clip)');

    axes.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + chartHeight + ')')
        .call(xAxis);

    axes.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Time (s)');
}