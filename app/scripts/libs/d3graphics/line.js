var D3Graphics = D3Graphics || {};

D3Graphics.Line = D3Graphics.Line || {};

D3Graphics.Line.vars = {
    DURATION: 1500,
    DELAY: 500,
    container: 'lineChart'
}

D3Graphics.Line.tools = {
    drawCircle: function (datum, index, x, y, detailWidth, detailHeight, detailMargin, circleContainer) {
        
        circleContainer.datum(datum)
            .append('circle')
            .attr('class', 'lineChart--circle')
            .attr('r', 0)
            .attr('cx', function (d) { return x(d.date) + detailWidth / 2; } )
            .attr('cy', function (d) { return y(d.value); } )
            .on('mouseenter', function (d) {
                d3.select(this)
                    .attr('class', 'lineChart--circle lineChart--circle__highlighted')
                    .attr('r', 7);
                d.active = true;
                D3Graphics.Line.tools.showCircleDetail(d, x, y, detailHeight, detailMargin, detailWidth, circleContainer);
            })
            .on('mouseout', function (d) {
                d3.select(this)
                    .attr('class', 'lineChart--circle')
                    .attr('r', 6);
                if (d.active) {
                    D3Graphics.Line.tools.hideCircleDetails(circleContainer);
                    d.active = false;
                }
            })
            .on('click touch', function (d) {
                if (d.active) {
                    D3Graphics.Line.tools.showCircleDetail(d, x, y, detailHeight, detailMargin, detailWidth, circleContainer);
                } else {
                    D3Graphics.Line.tools.hideCircleDetails(circleContainer);
                }
            })
            .transition()
            .delay(D3Graphics.Line.vars.DURATION / 10 * index)
            .attr('r', 6);
    },
    drawCircles: function (data, svg, x, y, detailWidth, detailHeight, detailMargin, circleContainer) {
        circleContainer = svg.append('g');

        data.forEach(function (datum, index) {
            D3Graphics.Line.tools.drawCircle(datum, index, x, y, detailWidth, detailHeight, detailMargin, circleContainer);
        });
    },
    hideCircleDetails: function (circleContainer) {
        circleContainer.selectAll('.lineChart--bubble')
            .remove();
    },

    showCircleDetail: function (data, x, y, detailHeight, detailMargin, detailWidth,circleContainer) {
        var details = circleContainer.append('g')
            .attr('class', 'lineChart--bubble')
            .attr(
            'transform',
            function () {
                var result = 'translate(';

                result += x(data.date);
                result += ', ';
                result += y(data.value) - detailHeight - detailMargin;
                result += ')';

                return result;
            }
            );

        details.append('path')
            .attr('d', 'M2.99990186,0 C1.34310181,0 0,1.34216977 0,2.99898218 L0,47.6680579 C0,49.32435 1.34136094,50.6670401 3.00074875,50.6670401 L44.4095996,50.6670401 C48.9775098,54.3898926 44.4672607,50.6057129 49,54.46875 C53.4190918,50.6962891 49.0050244,54.4362793 53.501875,50.6670401 L94.9943116,50.6670401 C96.6543075,50.6670401 98,49.3248703 98,47.6680579 L98,2.99898218 C98,1.34269006 96.651936,0 95.0000981,0 L2.99990186,0 Z M2.99990186,0')
            .attr('width', detailWidth)
            .attr('height', detailHeight);

        var text = details.append('text')
            .attr('class', 'lineChart--bubble--text');

        text.append('tspan')
            .attr('class', 'lineChart--bubble--label')
            .attr('x', detailWidth / 2)
            .attr('y', detailHeight / 3)
            .attr('text-anchor', 'middle')
            .text(data.label);

        text.append('tspan')
            .attr('class', 'lineChart--bubble--value')
            .attr('x', detailWidth / 2)
            .attr('y', detailHeight / 4 * 3)
            .attr('text-anchor', 'middle')
            .text(data.value);
    },
    tween: function (b, callback) {
        return function (a) {
            var i = d3.interpolateArray(a, b);

            return function (t) {
                return callback(i(t));
            };
        };
    }
}

D3Graphics.Line.render = function (data) {

    // parse helper functions on top
    var parse = d3.time.format('%Y-%m-%d').parse;
    // data manipulation first
    data = data.map(function (datum) {
        datum.date = parse(datum.date);
        return datum;
    });

    // TODO code duplication check how you can avoid that
    var containerEl = document.getElementById(D3Graphics.Line.vars.container),
        width = containerEl.clientWidth,
        height = width * 0.4,
        margin = {
            top: 30,
            right: 10,
            left: 10
        },

        detailWidth = 98,
        detailHeight = 55,
        detailMargin = 10,

        container = d3.select(containerEl),
        svg = container.select('svg')
            .attr('width', width)
            .attr('height', height + margin.top),

        x = d3.time.scale().range([0, width - detailWidth]),
        xAxis = d3.svg.axis().scale(x)
            .ticks(8)
            .tickSize(-height),
        xAxisTicks = d3.svg.axis().scale(x)
            .ticks(16)
            .tickSize(-height)
            .tickFormat(''),
        y = d3.scale.linear().range([height, 0]),
        yAxisTicks = d3.svg.axis().scale(y)
            .ticks(12)
            .tickSize(width)
            .tickFormat('')
            .orient('right'),

        area = d3.svg.area()
            .interpolate('linear')
            .x(function (d) { return x(d.date) + detailWidth / 2; })
            .y0(height)
            .y1(function (d) { return y(d.value); }),

        line = d3.svg.line()
            .interpolate('linear')
            .x(function (d) { return x(d.date) + detailWidth / 2; })
            .y(function (d) { return y(d.value); }),

        startData = data.map(function (datum) {
            return {
                date: datum.date,
                value: 0
            };
        }),

        circleContainer;

    // Compute the minimum and maximum date, and the maximum price.
    x.domain([data[0].date, data[data.length - 1].date]);
    // hacky hacky hacky :(
    y.domain([0, d3.max(data, function (d) { return d.value; }) + 700]);

    svg.append('g')
        .attr('class', 'lineChart--xAxisTicks')
        .attr('transform', 'translate(' + detailWidth / 2 + ',' + height + ')')
        .call(xAxisTicks);

    svg.append('g')
        .attr('class', 'lineChart--xAxis')
        .attr('transform', 'translate(' + detailWidth / 2 + ',' + (height + 7) + ')')
        .call(xAxis);

    svg.append('g')
        .attr('class', 'lineChart--yAxisTicks')
        .call(yAxisTicks);

    // Add the line path.
    svg.append('path')
        .datum(startData)
        .attr('class', 'lineChart--areaLine')
        .attr('d', line)
        .transition()
        .duration(D3Graphics.Line.vars.DURATION)
        .delay(D3Graphics.Line.vars.DURATION / 2)
        .attrTween('d', D3Graphics.Line.tools.tween(data, line))
        .each('end', function () {
            D3Graphics.Line.tools.drawCircles(data, svg, x, y, detailWidth, detailHeight, detailMargin, circleContainer);
        });


    // Add the area path.
    svg.append('path')
        .datum(startData)
        .attr('class', 'lineChart--area')
        .attr('d', area)
        .transition()
        .duration(D3Graphics.Line.vars.DURATION)
        .attrTween('d', D3Graphics.Line.tools.tween(data, area));

}