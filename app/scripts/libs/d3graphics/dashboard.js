var D3Graphics = D3Graphics || {};

D3Graphics.Dashboard = D3Graphics.Dashboard || {};

D3Graphics.Dashboard.vars = {
    containerBars: '#charBars',
    containerPie: '#charPie',
}

D3Graphics.Dashboard.render = function (fData) {
    var barColor = 'steelblue';
    function segColor(c) { return { bajo: "#d79d91", normal: "#92d892", alta: "#6bb7c7" }[c]; }

    // function to handle histogram.
    function histoGram(fD) {
        var containerEl = document.getElementById(D3Graphics.Dashboard.vars.containerBars.replace('#', ''));
        var hG = {}, hGDim = { t: 60, r: 10, b: 30, l: 0 };
        hGDim.w = 500 - hGDim.l - hGDim.r;
        hGDim.h = 300 - hGDim.t - hGDim.b;
        var width = containerEl.clientWidth;
        //var widthBars = width > 400 ? width / 2 : width;
        var widthBars = width;
        var heightBars = widthBars * 0.5;

        //create svg for histogram.
        var hGsvg = d3.select(D3Graphics.Dashboard.vars.containerBars).append("svg")
            .attr("width", widthBars)
            .attr("height", heightBars).append("g")
            .attr("transform", "translate(0,0)");

        // create function for x-axis mapping.
        var x = d3.scale.ordinal().rangeRoundBands([30, widthBars - 30], 0.1)
            .domain(fD.map(function (d) { return d[0]; }));


        // Add x-axis to the histogram svg.
        hGsvg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + (heightBars * .9) + ")")
            .call(d3.svg.axis().scale(x).orient("bottom"));

        // Create function for y-axis map.
        var y = d3.scale.linear().range([heightBars * .9, 0])
            .domain([0, d3.max(fD, function (d) { return d[1]; }) * 1.1]);

        var yAxisLeft = d3.svg.axis().scale(y).ticks(8).orient("left");

        hGsvg.append("g")
            .attr("class", "y axis ")
            .attr("transform", "translate(35,0)")
            .call(yAxisLeft)
            .append("text")
            .attr("y", 6)
            .attr("dy", "-2em")
            .style("text-anchor", "end")
            .text("Precipitación mt2");

        // Create bars for histogram to contain rectangles and freq labels.
        var bars = hGsvg.selectAll(".bar").data(fD).enter()
            .append("g").attr("class", "bar");

        //create the rectangles.
        bars.append("rect")
            .attr("x", function (d) { return x(d[0]); })
            .attr("y", function (d) { return y(d[1]); })
            .attr("width", x.rangeBand())
            .attr("height", function (d) { return (heightBars * .9) - y(d[1]); })
            .attr('fill', barColor)
            .on("mouseover", mouseover)// mouseover is defined bebajo.
            .on("mouseout", mouseout);// mouseout is defined bebajo.

        //Create the frequency labels above the rectangles.
        bars.append("text").text(function (d) { return d3.format(",")(d[1]) })
            .attr("x", function (d) { return x(d[0]) + x.rangeBand() / 2; })
            .attr("y", function (d) { return y(d[1]) - 5; })
            .attr("text-anchor", "normaldle");

        function mouseover(d) {  // utility function to be called on mouseover.
            // filter for selected state.
            var st = fData.filter(function (s) { return s.State == d[0]; })[0],
                nD = d3.keys(st.freq).map(function (s) { return { type: s, freq: st.freq[s] }; });

            // call update functions of pie-chart and legend.    
            pC.update(nD);
            leg.update(nD);
            $("#month").text(d[0]);
        }

        function mouseout(d) {    // utility function to be called on mouseout.
            // reset the pie-chart and legend.    
            //pC.update(tF);
            //leg.update(tF);
        }

        // create function to update the bars. This will be used by pie-chart.
        hG.update = function (nD, color) {
            // update the domain of the y-axis map to reflect change in frequencies.
            y.domain([0, d3.max(nD, function (d) { return d[1]; })]);

            // Attach the new data to the bars.
            var bars = hGsvg.selectAll(".bar").data(nD);

            // transition the height and color of rectangles.
            bars.select("rect").transition().duration(500)
                .attr("y", function (d) { return y(d[1]); })
                .attr("height", function (d) { return hGDim.h - y(d[1]); })
                .attr("fill", color);

            // transition the frequency labels location and change value.
            bars.select("text").transition().duration(500)
                .text(function (d) { return d3.format(",")(d[1]) })
                .attr("y", function (d) { return y(d[1]) - 5; });
        }
        return hG;
    }

    // function to handle pieChart.
    function pieChart(pD) {
        var containerEl = document.getElementById(D3Graphics.Dashboard.vars.containerPie.replace('#', ''));
        var pC = {}, pieDim = { w: 250, h: 250 };
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

        var width = containerEl.clientWidth;
        //var widthPie = width > 400 ? width / 4 : width;
        var widthPie = width / 2;
        var heightPie = widthPie;
        var radius = Math.min(widthPie, heightPie) / 2;

        // create svg for pie chart.
        var piesvg = d3.select(D3Graphics.Dashboard.vars.containerPie).append("svg")
            .attr("width", widthPie).attr("height", heightPie).append("g")
            .attr("transform", "translate(" + radius + "," + radius + ")");

        // create function to draw the arcs of the pie slices.
        var arc = d3.svg.arc().outerRadius(radius).innerRadius(0);

        // create a function to compute the pie slice angles.
        var pie = d3.layout.pie().sort(null).value(function (d) { return d.freq; });

        // Draw the pie slices.
        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
            .each(function (d) { this._current = d; })
            .style("fill", function (d) { return segColor(d.data.type); });

        // create function to update pie-chart. This will be used by histogram.
        pC.update = function (nD) {
            piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                .attrTween("d", arcTween);
        }
        // Animating the pie-slice requiring a custom function which specifies
        // how the intermediate paths should be drawn.
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) { return arc(i(t)); };
        }
        return pC;
    }

    // function to handle legend.
    function legend(lD) {
        var leg = {};

        // create table for legend.
        var legend = d3.select(D3Graphics.Dashboard.vars.containerPie).append("table").attr('class', 'legend');

        // create one row per segment.
        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

        // create the first column for each segment.
        tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("circle")
            .attr("cx", '8').attr("cy", '8').attr("r", '8')
            .attr("fill", function (d) { return segColor(d.type); });

        // create the second column for each segment.
        tr.append("td").text(function (d) { return d.type == 'bajo' ? 'Debajo de lo normal' : (d.type == 'normal' ? 'Normal' : 'Arriba de lo normal'); });

        // create the third column for each segment.

        // create the fourth column for each segment.
        tr.append("td").attr("class", 'legendPerc')
            .text(function (d) { return getLegend(d, lD); });

        // Utility function to be used to update the legend.
        leg.update = function (nD) {
            // update the data attached to the row elements.
            var l = legend.select("tbody").selectAll("tr").data(nD);

            // update the percentage column.
            l.select(".legendPerc").text(function (d) { return getLegend(d, nD); });
        }

        function getLegend(d, aD) { // Utility function to compute percentage.
            return d3.format("%")(d.freq / d3.sum(aD.map(function (v) { return v.freq; })));
        }

        return leg;
    }



    // calculate total frequency by state for all segment.
    var sF = fData.map(function (d) { return [d.State, d.total]; });

    var st = fData.filter(function (s) { return s.State == fData[0].State; })[0],
        tf = d3.keys(st.freq).map(function (s) { return { type: s, freq: st.freq[s] }; });


    var hG = histoGram(sF), // create the histogram.
        pC = pieChart(tf), // create the pie-chart.
        leg = legend(tf);  // create the legend.
}
