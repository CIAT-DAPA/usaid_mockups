//Practically all this code comes from https://github.com/alangrafu/radar-chart-d3
//I only made some additions and aesthetic adjustments to make the chart look better 
//(of course, that is only my point of view)
//Such as a better placement of the titles at each line end, 
//adding numbers that reflect what each circular level stands for
//Not placing the last level and slight differences in color
//
//For a bit of extra information check the blog about it:
//http://nbremer.blogspot.nl/2013/09/making-d3-radar-chart-look-bit-better.html

var D3Graphics = D3Graphics || {};

D3Graphics.Spider = D3Graphics.Spider || {};

D3Graphics.Spider.vars = {
    radius: 5,
    w: 600,
    h: 600,
    factor: 1,
    factorLegend: .85,
    levels: 3,
    maxValue: 0,
    radians: 2 * Math.PI,
    opacityArea: 0.5,
    ToRight: 5,
    TranslateX: 80,
    TranslateY: 30,
    ExtraWidthX: 100,
    ExtraWidthY: 100,
    color: d3.scale.category10(),
    container: "#chart",
    format: d3.format(',.0f')
}

D3Graphics.Spider.render = function (d) {

    D3Graphics.Spider.vars.maxValue = Math.max(D3Graphics.Spider.vars.maxValue, d3.max(d, function (i) { return d3.max(i.map(function (o) { return o.value; })) }));
    D3Graphics.Spider.vars.maxValue *= 1.1;
    
    var allAxis = [];
    d.forEach(function (value, key) {
        value.forEach(function (i, j) {
            if(allAxis.indexOf(i.axis) < 0)
                allAxis.push(i.axis);
        });
    });
    var total = allAxis.length;
    var radius = D3Graphics.Spider.vars.factor * Math.min(D3Graphics.Spider.vars.w / 2, D3Graphics.Spider.vars.h / 2);
    d3.select(D3Graphics.Spider.vars.container).select("svg").remove();

    var g = d3.select(D3Graphics.Spider.vars.container)
        .append("svg")
        .attr("width", D3Graphics.Spider.vars.w + D3Graphics.Spider.vars.ExtraWidthX)
        .attr("height", D3Graphics.Spider.vars.h + D3Graphics.Spider.vars.ExtraWidthY)
        .append("g")
        .attr("transform", "translate(" + D3Graphics.Spider.vars.TranslateX + "," + D3Graphics.Spider.vars.TranslateY + ")");


    var tooltip;

    //Circular segments
    for (var j = 0; j < D3Graphics.Spider.vars.levels ; j++) {
        var levelFactor = (D3Graphics.Spider.vars.factor *.95) * radius * ((j + 1) / D3Graphics.Spider.vars.levels);
        g.selectAll(".levels")
            .data(allAxis)
            .enter()
            .append("svg:line")
            .attr("x1", function (d, i) { return levelFactor * (1 - D3Graphics.Spider.vars.factor * Math.sin(i * D3Graphics.Spider.vars.radians / total)); })
            .attr("y1", function (d, i) { return levelFactor * (1 - D3Graphics.Spider.vars.factor * Math.cos(i * D3Graphics.Spider.vars.radians / total)); })
            .attr("x2", function (d, i) { return levelFactor * (1 - D3Graphics.Spider.vars.factor * Math.sin((i + 1) * D3Graphics.Spider.vars.radians / total)); })
            .attr("y2", function (d, i) { return levelFactor * (1 - D3Graphics.Spider.vars.factor * Math.cos((i + 1) * D3Graphics.Spider.vars.radians / total)); })
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-opacity", "0.75")
            .style("stroke-width", "1px")
            .attr("transform", "translate(" + (D3Graphics.Spider.vars.w / 2 - levelFactor) + ", " + (D3Graphics.Spider.vars.h / 2 - levelFactor) + ")");
    }

    //Text indicating at what % each level is
    for (var j = 0; j < D3Graphics.Spider.vars.levels; j++) {
        var levelFactor = (D3Graphics.Spider.vars.factor * .98) * radius * ((j + 1) / D3Graphics.Spider.vars.levels);
        g.selectAll(".levels")
            .data([1]) //dummy data
            .enter()
            .append("svg:text")
            .attr("x", function (d) { return levelFactor * (1 - D3Graphics.Spider.vars.factor * Math.sin(0)); })
            .attr("y", function (d) { return levelFactor * (1 - D3Graphics.Spider.vars.factor * Math.cos(0)); })
            .attr("class", "legend")
            .style("font-family", "sans-serif")
            .style("font-size", "10px")
            .attr("transform", "translate(" + (D3Graphics.Spider.vars.w / 2 - levelFactor + D3Graphics.Spider.vars.ToRight) + ", " + (D3Graphics.Spider.vars.h / 2 - levelFactor) + ")")
            .attr("fill", "#737373")
            .text(D3Graphics.Spider.vars.format((j + 1) * D3Graphics.Spider.vars.maxValue / D3Graphics.Spider.vars.levels));
    }

    series = 0;

    var axis = g.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

    axis.append("line")
        .attr("x1", D3Graphics.Spider.vars.w / 2)
        .attr("y1", D3Graphics.Spider.vars.h / 2)
        .attr("x2", function (d, i) { return D3Graphics.Spider.vars.w / 2 * (1 - D3Graphics.Spider.vars.factor * Math.sin(i * D3Graphics.Spider.vars.radians / total)); })
        .attr("y2", function (d, i) { return D3Graphics.Spider.vars.h / 2 * (1 - D3Graphics.Spider.vars.factor * Math.cos(i * D3Graphics.Spider.vars.radians / total)); })
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-width", "1px");

    axis.append("text")
        .attr("class", "legend")
        .text(function (d) { return d })
        .style("font-family", "sans-serif")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "1.5em")
        .attr("transform", function (d, i) { return "translate(0, -10)" })
        .attr("x", function (d, i) { return D3Graphics.Spider.vars.w / 2 * (1 - D3Graphics.Spider.vars.factorLegend * Math.sin(i * D3Graphics.Spider.vars.radians / total)) - 60 * Math.sin(i * D3Graphics.Spider.vars.radians / total); })
        .attr("y", function (d, i) { return D3Graphics.Spider.vars.h / 2 * (1 - Math.cos(i * D3Graphics.Spider.vars.radians / total)) - 20 * Math.cos(i * D3Graphics.Spider.vars.radians / total); });


    d.forEach(function (y, x) {
        dataValues = [];
        g.selectAll(".nodes")
            .data(y, function (j, i) {
                dataValues.push([
                    D3Graphics.Spider.vars.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / D3Graphics.Spider.vars.maxValue) * D3Graphics.Spider.vars.factor * Math.sin(i * D3Graphics.Spider.vars.radians / total)),
                    D3Graphics.Spider.vars.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / D3Graphics.Spider.vars.maxValue) * D3Graphics.Spider.vars.factor * Math.cos(i * D3Graphics.Spider.vars.radians / total))
                ]);
            });
        dataValues.push(dataValues[0]);
        g.selectAll(".area")
            .data([dataValues])
            .enter()
            .append("polygon")
            .attr("class", "radar-chart-serie" + series)
            .style("stroke-width", "2px")
            .style("stroke", D3Graphics.Spider.vars.color(series))
            .attr("points", function (d) {
                var str = "";
                for (var pti = 0; pti < d.length; pti++) {
                    str = str + d[pti][0] + "," + d[pti][1] + " ";
                }
                return str;
            })
            .style("fill", function (j, i) { return D3Graphics.Spider.vars.color(series) })
            .style("fill-opacity", D3Graphics.Spider.vars.opacityArea)
            .on('mouseover', function (d) {
                z = "polygon." + d3.select(this).attr("class");
                g.selectAll("polygon")
                    .transition(200)
                    .style("fill-opacity", 0.1);
                g.selectAll(z)
                    .transition(200)
                    .style("fill-opacity", .7);
            })
            .on('mouseout', function () {
                g.selectAll("polygon")
                    .transition(200)
                    .style("fill-opacity", D3Graphics.Spider.vars.opacityArea);
            });
        series++;
    });
    series = 0;


    d.forEach(function (y, x) {
        g.selectAll(".nodes")
            .data(y).enter()
            .append("svg:circle")
            .attr("class", "radar-chart-serie" + series)
            .attr('r', D3Graphics.Spider.vars.radius)
            .attr("alt", function (j) { return Math.max(j.value, 0) })
            .attr("cx", function (j, i) {
                dataValues.push([
                    D3Graphics.Spider.vars.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / D3Graphics.Spider.vars.maxValue) * D3Graphics.Spider.vars.factor * Math.sin(i * D3Graphics.Spider.vars.radians / total)),
                    D3Graphics.Spider.vars.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / D3Graphics.Spider.vars.maxValue) * D3Graphics.Spider.vars.factor * Math.cos(i * D3Graphics.Spider.vars.radians / total))
                ]);
                return D3Graphics.Spider.vars.w / 2 * (1 - (Math.max(j.value, 0) / D3Graphics.Spider.vars.maxValue) * D3Graphics.Spider.vars.factor * Math.sin(i * D3Graphics.Spider.vars.radians / total));
            })
            .attr("cy", function (j, i) {
                return D3Graphics.Spider.vars.h / 2 * (1 - (Math.max(j.value, 0) / D3Graphics.Spider.vars.maxValue) * D3Graphics.Spider.vars.factor * Math.cos(i * D3Graphics.Spider.vars.radians / total));
            })
            .attr("data-id", function (j) { return j.axis })
            .style("fill", D3Graphics.Spider.vars.color(series)).style("fill-opacity", .9)
            .on('mouseover', function (d) {
                newX = parseFloat(d3.select(this).attr('cx')) - 10;
                newY = parseFloat(d3.select(this).attr('cy')) - 5;

                tooltip
                    .attr('x', newX)
                    .attr('y', newY)
                    .text(D3Graphics.Spider.vars.format(d.value))
                    .transition(200)
                    .style('opacity', 1);

                z = "polygon." + d3.select(this).attr("class");
                g.selectAll("polygon")
                    .transition(200)
                    .style("fill-opacity", 0.1);
                g.selectAll(z)
                    .transition(200)
                    .style("fill-opacity", .7);
            })
            .on('mouseout', function () {
                tooltip
                    .transition(200)
                    .style('opacity', 0);
                g.selectAll("polygon")
                    .transition(200)
                    .style("fill-opacity", D3Graphics.Spider.vars.opacityArea);
            })
            .append("svg:title")
            .text(function (j) { return Math.max(j.value, 0) });

        series++;
    });
    //Tooltip
    tooltip = g.append('text')
        .style('opacity', 0)
        .style('font-family', 'sans-serif')
        .style('font-size', '13px');
}