var D3Graphics = D3Graphics || {};

D3Graphics.CalendarGoogle = D3Graphics.CalendarGoogle || {};

D3Graphics.CalendarGoogle.vars = {
    calendarWidth: 960,
    calendarHeight: 1000,
    gridXTranslation: 6,
    gridYTranslation: 90,
    cellColorForCurrentMonth: '#EAEAEA',
    cellColorForPreviousMonth: '#FFFFFF',
    counter: 0, // Counter is used to keep track of the number of "back" and "forward" button presses and to calculate the month to display.
    currentMonth: new Date().getMonth(),
    monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    daysOfTheWeek: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    datesGroup: null,
    calendar: null,
    chartsGroup: null,
    container: '#chart',
    data: null
}

D3Graphics.CalendarGoogle.tools = {
    gridWidth: function () { return D3Graphics.CalendarGoogle.vars.calendarWidth - 10; },
    gridHeight: function () { return D3Graphics.CalendarGoogle.vars.calendarHeight - 40; },
    cellWidth: function () { return D3Graphics.CalendarGoogle.tools.gridWidth() / 7; },
    cellHeight: function () { return D3Graphics.CalendarGoogle.tools.gridHeight() / 7; },
    incrementCounter: function () { D3Graphics.CalendarGoogle.vars.counter += 1; },
    decrementCounter: function () { D3Graphics.CalendarGoogle.vars.counter -= 1; },
    monthToDisplay: function () {
        var dateToDisplay = new Date();
        // We use the counter that keep tracks of "back" and "forward" presses to get the month to display.
        dateToDisplay.setMonth(D3Graphics.CalendarGoogle.vars.currentMonth + D3Graphics.CalendarGoogle.vars.counter);
        return dateToDisplay.getMonth();
    },
    monthToDisplayAsText: function () { return D3Graphics.CalendarGoogle.vars.monthNames[D3Graphics.CalendarGoogle.tools.monthToDisplay()]; },
    yearToDisplay: function () {
        var dateToDisplay = new Date();
        // We use the counter that keep tracks of "back" and "forward" presses to get the year to display.
        dateToDisplay.setMonth(D3Graphics.CalendarGoogle.vars.currentMonth + D3Graphics.CalendarGoogle.vars.counter);
        return dateToDisplay.getFullYear();
    },
    gridCellPositions: function () {
        // We store the top left positions of a 7 by 5 grid. These positions will be our reference points for drawing
        // various objects such as the rectangular grids, the text indicating the date etc.
        var cellPositions = [];
        for (var y = 0; y < 5; y++) {
            for (var x = 0; x < 7; x++) {
                cellPositions.push([x * D3Graphics.CalendarGoogle.tools.cellWidth(), y * D3Graphics.CalendarGoogle.tools.cellHeight()]);
            }
        }

        return cellPositions;
    },
    // This function generates all the days of the month. But since we have a 7 by 5 grid, we also need to get some of
    // the days from the previous month and the next month. This way our grid will have all its cells filled. The days
    // from the previous or the next month will have a different color though. 
    daysInMonth: function () {
        var daysArray = [];

        var firstDayOfTheWeek = new Date(D3Graphics.CalendarGoogle.tools.yearToDisplay(), D3Graphics.CalendarGoogle.tools.monthToDisplay(), 1).getDay();
        var daysInPreviousMonth = new Date(D3Graphics.CalendarGoogle.tools.yearToDisplay(), D3Graphics.CalendarGoogle.tools.monthToDisplay(), 0).getDate();        
        // Lets say the first week of the current month is a Wednesday. Then we need to get 3 days from 
        // the end of the previous month. But we can't naively go from 29 - 31. We have to do it properly
        // depending on whether the last month was one that had 31 days, 30 days or 28.
        for (var i = 1; i <= firstDayOfTheWeek; i++) {
            daysArray.push([daysInPreviousMonth - firstDayOfTheWeek + i, D3Graphics.CalendarGoogle.vars.cellColorForCurrentMonth]);
        }

        // These are all the days in the current month.
        var daysInMonth = new Date(D3Graphics.CalendarGoogle.tools.yearToDisplay(), D3Graphics.CalendarGoogle.tools.monthToDisplay() + 1, 0).getDate();
        for (i = 1; i <= daysInMonth; i++) {
            daysArray.push([i, D3Graphics.CalendarGoogle.vars.cellColorForPreviousMonth]);
        }

        // Depending on how many days we have so far (from previous month and current), we will need
        // to get some days from next month. We can do this naively though, since all months start on
        // the 1st.
        var daysRequiredFromNextMonth = 35 - daysArray.length;

        for (i = 1; i <= daysRequiredFromNextMonth; i++) {
            daysArray.push([i, D3Graphics.CalendarGoogle.vars.cellColorForCurrentMonth]);
        }

        return daysArray.slice(0, 35);
    },
    dateToYMD: function (date) {
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();
        return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
    },
    searchInData: function (date,variedad) {
        for(var i=0; i< D3Graphics.CalendarGoogle.vars.data.length; i++){            
            if(D3Graphics.CalendarGoogle.vars.data[i].Fecha == date && D3Graphics.CalendarGoogle.vars.data[i].Variedad == variedad){
                return D3Graphics.CalendarGoogle.vars.data[i].RendimientoPromedio;
            }
                
        }
        return 0;

    },
    getDataForMonth: function () {                
        var variedad = [];       
        for(var i=0; i < D3Graphics.CalendarGoogle.vars.data.length; i++ ){
            if(variedad.indexOf(D3Graphics.CalendarGoogle.vars.data[i].Variedad) < 0 && D3Graphics.CalendarGoogle.vars.data[i].Variedad != '')
                variedad.push(D3Graphics.CalendarGoogle.vars.data[i].Variedad);
        }
        var randomData = [];
        var dailyData = [];
        var firstDayOfTheWeek = new Date(D3Graphics.CalendarGoogle.tools.yearToDisplay(), D3Graphics.CalendarGoogle.tools.monthToDisplay(), 1).getDay();
        var daysInPreviousMonth = new Date(D3Graphics.CalendarGoogle.tools.yearToDisplay(), D3Graphics.CalendarGoogle.tools.monthToDisplay(), 0).getDate();
        var total = 0;        
        // Lets say the first week of the current month is a Wednesday. Then we need to get 3 days from 
        // the end of the previous month. But we can't naively go from 29 - 31. We have to do it properly
        // depending on whether the last month was one that had 31 days, 30 days or 28.
        for (var i = 1; i <= firstDayOfTheWeek; i++) {
            dailyData = [];
            total = 0;
            for(var j = 0; j < variedad.length; j++){   
                var date = new Date(D3Graphics.CalendarGoogle.tools.yearToDisplay(), D3Graphics.CalendarGoogle.tools.monthToDisplay()-1, daysInPreviousMonth - firstDayOfTheWeek + i);
                var value = parseFloat(D3Graphics.CalendarGoogle.tools.searchInData(D3Graphics.CalendarGoogle.tools.dateToYMD(date),variedad[j]));
                total += value;             
                dailyData.push(value);
            }
            if(total != 0){
                for(var j = 0; j < dailyData.length; j++){
                    dailyData[j] = ((dailyData[j] / total) * 100).toFixed(1); 
                    //dailyData[j] = (dailyData[j]).toFixed(1);
                }
            }
            randomData.push(dailyData);
        }

        // These are all the days in the current month.
        
        var daysInMonth = new Date(D3Graphics.CalendarGoogle.tools.yearToDisplay(), D3Graphics.CalendarGoogle.tools.monthToDisplay() , 0).getDate();
        for (i = 1; i <= daysInMonth; i++) {
            dailyData = [];
            total = 0;
            for(var j = 0; j < variedad.length; j++){   
                var date = new Date(D3Graphics.CalendarGoogle.tools.yearToDisplay(), D3Graphics.CalendarGoogle.tools.monthToDisplay() , i);             
                var value = parseFloat(D3Graphics.CalendarGoogle.tools.searchInData(D3Graphics.CalendarGoogle.tools.dateToYMD(date),variedad[j]));
                total += value;             
                dailyData.push(value);
            }
            if(total != 0){
                for(var j = 0; j < dailyData.length; j++){
                    dailyData[j] = ((dailyData[j] / total)*100).toFixed(1);
                    //dailyData[j] = (dailyData[j]).toFixed(1); 
                }
                
            }
            randomData.push(dailyData);
        }

        // Depending on how many days we have so far (from previous month and current), we will need
        // to get some days from next month. We can do this naively though, since all months start on
        // the 1st.
        var daysRequiredFromNextMonth = 35 - randomData.length;        
        for (i = 1; i <= daysRequiredFromNextMonth; i++) {
            dailyData = [];
            total = 0;
            for(var j = 0; j < variedad.length; j++){   
                var date = new Date(D3Graphics.CalendarGoogle.tools.yearToDisplay(), D3Graphics.CalendarGoogle.tools.monthToDisplay() + 1, i);
                var value = parseFloat(D3Graphics.CalendarGoogle.tools.searchInData(D3Graphics.CalendarGoogle.tools.dateToYMD(date),variedad[j]));
                total += value;             
                dailyData.push(value);             
            }
            if(total != 0){
                for(var j = 0; j < dailyData.length; j++){
                    dailyData[j] = ((dailyData[j] / total)*100).toFixed(1);
                    //dailyData[j] = (dailyData[j]).toFixed(1); 
                }
            }
            randomData.push(dailyData);
        }
        
        return randomData;
    },
    drawGraphsForMonthlyData: function () {
        // Get some random data
        var data = D3Graphics.CalendarGoogle.tools.getDataForMonth();
        // Set up variables required to draw a pie chart
        var outerRadius = D3Graphics.CalendarGoogle.tools.cellWidth() / 3;
        var innerRadius = 0;
        var pie = d3.layout.pie();
        var color = d3.scale.category10();
        var arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius);

        // We need to index and group the pie charts and slices generated so that they can be rendered in
        // the appropriate cells. To do that, we call D3's 'pie' function of each of the data elements.
        var indexedPieData = [];
        for (var i = 0; i < data.length; i++) {
            var pieSlices = pie(data[i]);
            // This loop is to store an index (j) for each of the slices of a given pie chart. Two different charts
            // on two different days will have the the same set of numbers for slices (eg: 0,1,2). This will help us
            // pick the same colors for the slices for two independent charts. Otherwise, the colors of the slices
            // will be different each day.
            for (var j = 0; j < pieSlices.length; j++) {
                indexedPieData.push([pieSlices[j], i, j]);
            }
        }

        var cellPositions = D3Graphics.CalendarGoogle.tools.gridCellPositions();

        D3Graphics.CalendarGoogle.vars.chartsGroup
            .selectAll("g.arc")
            .remove();

        var arcs = D3Graphics.CalendarGoogle.vars.chartsGroup.selectAll("g.arc")
            // use the indexed data so that each pie chart can be draw in a different cell and therefore for a different day
            .data(indexedPieData)
            .enter()
            .append("g")
            .attr("class", "arc")
            .attr("transform", function (d) {
                // This is where we use the index here to translate the pie chart and rendere it in the appropriate cell. 
                // Normally, the chart would be squashed up against the top left of the cell, obscuring the text that shows the day of the month.
                // We use the gridXTranslation and gridYTranslation and multiply it by a factor to move it to the center of the cell. There is probably
                // a better way of doing this though.
                var currentDataIndex = d[1];
                return "translate(" + (outerRadius + D3Graphics.CalendarGoogle.vars.gridXTranslation * 5 + cellPositions[currentDataIndex][0]) + ", " + (outerRadius + D3Graphics.CalendarGoogle.vars.gridYTranslation * 1.25 + cellPositions[currentDataIndex][1]) + ")";
            });

        arcs.append("path")
            .attr("fill", function (d, i) {
                // The color is generated using the second index. Each slice of the pie is given a fixed number. This applies to all charts (see the indexing loop above).
                // This way, by using the index we can generate teh same colors for each of the slices for different charts on different days.
                return color(d[2]);
            })
            .attr("d", function (d, i) {
                // Standard functions for drawing a pie charts in D3.
                return arc(d[0]);
            });

        arcs.append("text")
            .attr("transform", function (d, i) {
                // Standard functions for drawing a pie charts in D3.
                return "translate(" + arc.centroid(d[0]) + ")";
            })
            .attr("text-anchor", "middle")
            .text(function (d, i) {
                return d[0].value;
            });

    },    
    renderDaysOfMonth: function () {
        // RENDERDAYSOFMONTH
        $('#currentMonth').text(D3Graphics.CalendarGoogle.tools.monthToDisplayAsText() + ' ' + D3Graphics.CalendarGoogle.tools.yearToDisplay());
        // We get the days for the month we need to display based on the number of times the user has pressed
        // the forward or backward button.
        var daysInMonthToDisplay = D3Graphics.CalendarGoogle.tools.daysInMonth();
        var cellPositions = D3Graphics.CalendarGoogle.tools.gridCellPositions();

        // All text elements representing the dates in the month are grouped together in the "datesGroup" element by the initalizing
        // function below. The initializing function is also responsible for drawing the rectangles that make up the grid.
        D3Graphics.CalendarGoogle.vars.datesGroup
            .selectAll("text")
            .data(daysInMonthToDisplay)
            .attr("x", function (d, i) { return cellPositions[i][0]; })
            .attr("y", function (d, i) { return cellPositions[i][1]; })
            .attr("dx", 20) // right padding
            .attr("dy", 20) // vertical alignment : middle
            .attr("transform", "translate(" + D3Graphics.CalendarGoogle.vars.gridXTranslation + "," + D3Graphics.CalendarGoogle.vars.gridYTranslation + ")")
            .text(function (d) { return d[0]; }); // Render text for the day of the week

        D3Graphics.CalendarGoogle.vars.calendar
            .selectAll("rect")
            .data(daysInMonthToDisplay)
            // Here we change the color depending on whether the day is in the current month, the previous month or the next month.
            // The function that generates the dates for any given month will also specify the colors for days that are not part of the
            // current month. We just have to use it to fill the rectangle
            .style("fill", function (d) { return d[1]; });

        D3Graphics.CalendarGoogle.tools.drawGraphsForMonthlyData();
    }
}

D3Graphics.CalendarGoogle.controls = {
    displayPreviousMonth: function () {
        // We keep track of user's "back" and "forward" presses in this counter
        D3Graphics.CalendarGoogle.tools.decrementCounter();
        D3Graphics.CalendarGoogle.tools.renderDaysOfMonth();
    },
    displayNextMonth: function () {
        // We keep track of user's "back" and "forward" presses in this counter
        D3Graphics.CalendarGoogle.tools.incrementCounter();
        D3Graphics.CalendarGoogle.tools.renderDaysOfMonth();
    }
}

D3Graphics.CalendarGoogle.render = function (data) {
    // Controls
    $('#back').click(D3Graphics.CalendarGoogle.controls.displayPreviousMonth);
    $('#forward').click(D3Graphics.CalendarGoogle.controls.displayNextMonth);

    // Set data
    D3Graphics.CalendarGoogle.vars.data = data;
    
    // Add the svg element.
    D3Graphics.CalendarGoogle.vars.calendar = d3.select(D3Graphics.CalendarGoogle.vars.container)
        .append("svg")
        .attr("class", "calendar")
        .attr("width", D3Graphics.CalendarGoogle.vars.calendarWidth)
        .attr("height", D3Graphics.CalendarGoogle.vars.calendarHeight)
        .append("g");

    // Cell positions are generated and stored globally because they are used by other functions as a reference to render different things.
    var cellPositions = D3Graphics.CalendarGoogle.tools.gridCellPositions();

    // Draw rectangles at the appropriate postions, starting from the top left corner. Since we want to leave some room for the heading and buttons,
    // use the gridXTranslation and gridYTranslation variables.
    D3Graphics.CalendarGoogle.vars.calendar.selectAll("rect")
        .data(cellPositions)
        .enter()
        .append("rect")
        .attr("x", function (d) { return d[0]; })
        .attr("y", function (d) { return d[1]; })
        .attr("width", D3Graphics.CalendarGoogle.tools.cellWidth())
        .attr("height", D3Graphics.CalendarGoogle.tools.cellHeight())
        .style("stroke", "#555")
        .style("fill", "white")
        .attr("transform", "translate(" + D3Graphics.CalendarGoogle.vars.gridXTranslation + "," + D3Graphics.CalendarGoogle.vars.gridYTranslation + ")");

    
    // This adds the day of the week headings on top of the grid
    D3Graphics.CalendarGoogle.vars.calendar.selectAll("headers")
        .data([0, 1, 2, 3, 4, 5, 6])
        .enter().append("text")
        .attr("x", function (d) { return cellPositions[d][0]; })
        .attr("y", function (d) { return cellPositions[d][1]; })
        .attr("dx", D3Graphics.CalendarGoogle.vars.gridXTranslation + 5) // right padding
        .attr("dy", 30) // vertical alignment : middle
        .text(function (d) { return D3Graphics.CalendarGoogle.vars.daysOfTheWeek[d] });

    // The intial rendering of the dates for the current mont inside each of the cells in the grid. We create a named group ("datesGroup"),
    // and add our dates to this group. This group is also stored globally. Later on, when the the user presses the back and forward buttons
    // to navigate between the months, we clear and re add the new text elements to this group
    D3Graphics.CalendarGoogle.vars.datesGroup = D3Graphics.CalendarGoogle.vars.calendar.append("svg:g");
    var daysInMonthToDisplay = D3Graphics.CalendarGoogle.tools.daysInMonth();
    D3Graphics.CalendarGoogle.vars.datesGroup
        .selectAll("daysText")
        .data(daysInMonthToDisplay)
        .enter()
        .append("text")
        .attr("x", function (d, i) { return cellPositions[i][0]; })
        .attr("y", function (d, i) { return cellPositions[i][1]; })
        .attr("dx", 20) // right padding
        .attr("dy", 20) // vertical alignment : middle
        .attr("transform", "translate(" + D3Graphics.CalendarGoogle.vars.gridXTranslation + "," + D3Graphics.CalendarGoogle.vars.gridYTranslation + ")")
        .text(function (d) { return d[0]; });

    // Create a new svg group to store the chart elements and store it globally. Again, as the user navigates through the months by pressing 
    // the "back" and "forward" buttons on the page, we clear the chart elements from this group and re add them again.
    D3Graphics.CalendarGoogle.vars.chartsGroup = D3Graphics.CalendarGoogle.vars.calendar.append("svg:g");
    // Call the function to draw the charts in the cells. This will be called again each time the user presses the forward or backward buttons.
    D3Graphics.CalendarGoogle.tools.drawGraphsForMonthlyData();

    D3Graphics.CalendarGoogle.tools.renderDaysOfMonth()

}

