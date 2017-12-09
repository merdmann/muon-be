/*
 * The MIT License (MIT) applies.
 *
 * Copyright (c) 2015 Michael Erdmann
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*jslint node: true */
/*global console, require, restful, d3 */

exports.display = function (data, minDate, maxDate, minY, maxY, tag) {
    "use strict";
    var margin = {
            top: 20,
            right: 80,
            bottom: 50,
            left: 50
        },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    var padding = 50;

    // this is an accessor to the detector selected via the gui
    var yData = function (d) {
        return d.value;
    };

    // creating scale for x and y axis
    var x = d3.time.scale()
        .domain([new Date(minDate), new Date(maxDate)])
        .range([padding, width - padding * 2]);

    var y = d3.scale.linear()
        .domain([minY, maxY])
        .range([height, 0]);

    // define the y axis
    var yAxis = d3.svg.axis()
        .orient("left")
        .scale(y);

    // define the y axis
    var xAxis = d3.svg.axis()
        .orient("bottom")
        .scale(x);

    d3.select(tag).selectAll('svg').remove();

    var svg = d3.select(tag)
        .append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var lineD1 = d3.svg.line()
        .interpolate("linear")
        .x(function (d) {
            return x(new Date(d.date));
        })
        .y(function (d) {
            return y(d.value);
        });

    // draw y axis with labels and move in from the size by the amount of padding
    svg.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    // draw x axis with labels and move to the bottom of the chart area
    svg.append("g")
        .attr("class", "xaxis") // give it a class so it can be used to select only xaxis labels  below
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("path")
        .attr("d", lineD1(data))
        .attr("stroke", "blue")
        .attr("stroke-width", "1")
        .attr("fill", "none");

    // now rotate text on x axis
    // solution based on idea here: https://groups.google.com/forum/?fromgroups#!topic/d3-js/heOBPQF3sAY
    // first move the text left so no longer centered on the tick
    // then rotate up to get 45 degrees.
    svg.selectAll(".xaxis text") // select all the text elements for the xaxis
        .attr("transform", function (d) {
            return "translate(" + this.getBBox().height * -2 + "," + this.getBBox().height + ")rotate(-45)";
        });

    svg.append("path")
        .attr("d", lineD1(data))
        .attr("stroke", "blue")
        .attr("stroke-width", 1)
        .attr("fill", "none");
};



